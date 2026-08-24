/*
 * The laptop scene, built once and used three times.
 *
 * components/HeroModel.tsx renders it as an ambient loop in the hero,
 * components/MachineViewer.tsx lets a visitor take hold of it, and
 * scripts/render-hero-still.mjs renders a single frame of it to the poster
 * image. They have to agree exactly — the poster is what a visitor sees until
 * the canvas takes over, and any difference in camera or lighting shows up as
 * a jump at that moment. So none of them owns the scene: this does, and all
 * three call it with the same lib/hero-view.json.
 *
 * Plain JavaScript rather than TypeScript because the still renderer loads it
 * straight into a headless browser through an import map, with no build step.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * A dark studio for the laptop to stand in.
 *
 * three ships RoomEnvironment, but it is a brightly lit white room: against it
 * a metallic chassis reflects white on every face and the machine turns grey.
 * The look the reference shots have is the opposite — a black surround with a
 * few narrow sources, so the light lives in the edges and the panel gradients.
 * That is what this builds: unlit emissive panels in an otherwise black room,
 * which PMREMGenerator then turns into the reflections.
 */
function createStudio(panels) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x05070f);

  for (const panel of panels) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(panel.size[0], panel.size[1]),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(panel.color).multiplyScalar(panel.intensity),
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.set(panel.position[0], panel.position[1], panel.position[2]);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
  }

  return studio;
}

/** Smooth acceleration and deceleration between two points in the cycle. */
function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * How far the lid is shut at this point in the cycle: 0 fully open, 1 shut.
 *
 * The lid shuts as the laptop turns away and is open again by the time it
 * comes back round, which is how the manufacturers shoot these. Closing it
 * face-on would just hide the machine.
 */
function lidProgress(phase, timings) {
  if (phase < timings.closeStart) return 0;
  if (phase < timings.closeEnd) return smoothstep(timings.closeStart, timings.closeEnd, phase);
  if (phase < timings.openStart) return 1;
  if (phase < timings.openEnd) return 1 - smoothstep(timings.openStart, timings.openEnd, phase);
  return 0;
}

/**
 * Frame-rate independent easing towards a value.
 *
 * A plain `current += (target - current) * 0.1` moves twice as fast on a 120 Hz
 * screen as on a 60 Hz one. This converges at the same rate either way.
 */
function approach(current, target, smoothing, delta) {
  return target + (current - target) * Math.exp(-delta / smoothing);
}

const TWO_PI = Math.PI * 2;

/** The shortest way round from one angle to another. */
function shortestTurn(from, to) {
  return from + ((((to - from + Math.PI) % TWO_PI) + TWO_PI) % TWO_PI) - Math.PI;
}

/**
 * Builds the scene and returns the handle used to drive it.
 *
 * The scene has one pose — yaw, pitch, distance, and how far the lid is shut —
 * and always eases towards it. Left alone it turns on its own; give it a pose
 * and it travels there and stays. That is the whole difference between the
 * hero's ambient loop and the viewer a visitor can steer.
 *
 * @param {THREE.WebGLRenderer} renderer
 * @param {object} view parsed lib/hero-view.json
 * @param {{basePath?: string, spin?: boolean}} [options]
 */
export async function createLaptopScene(renderer, view, options = {}) {
  const { basePath = "/models", spin = true } = options;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = view.exposure;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(view.fov, 1, 0.01, 100);

  /*
   * The environment map does most of the work here. The chassis is a metallic
   * material, and metal with nothing to reflect renders as flat grey however
   * many lights are pointed at it — this is the difference between a diagram
   * and a product shot. The studio is generated in code, so it costs no image
   * download.
   */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(createStudio(view.studio), 0.02);
  scene.environment = environment.texture;
  pmrem.dispose();

  const lights = [];
  for (const light of [view.lights.key, view.lights.rim, view.lights.fill]) {
    const directional = new THREE.DirectionalLight(light.color, light.intensity);
    directional.position.set(light.position[0], light.position[1], light.position[2]);
    scene.add(directional);
    lights.push(directional);
  }

  const loader = new GLTFLoader();
  const [base, lid] = await Promise.all([
    loader.loadAsync(`${basePath}/laptop-base.glb`),
    loader.loadAsync(`${basePath}/laptop-lid.glb`),
  ]);

  /*
   * The lid is a separate file so it can hang off a pivot placed on the hinge.
   * Both files are exported in the same world space, so the lid geometry is
   * pushed back by exactly the pivot's offset and lands where it started.
   */
  const [hingeX, hingeY] = view.hinge;
  const hinge = new THREE.Group();
  hinge.position.set(hingeX, hingeY, 0);
  lid.scene.position.set(-hingeX, -hingeY, 0);
  hinge.add(lid.scene);

  const laptop = new THREE.Group();
  laptop.add(base.scene, hinge);

  /* Centred on its own bounding box with the lid open, so the machine turns
     about itself rather than swinging around some corner of the model. */
  const bounds = new THREE.Box3().setFromObject(laptop);
  const size = bounds.getSize(new THREE.Vector3());
  laptop.position.sub(bounds.getCenter(new THREE.Vector3()));
  scene.add(laptop);

  const span = Math.max(size.x, size.y, size.z);

  /* Where the camera is looking now, and where it is heading. Distance is a
     multiple of the model's own size, so the framing survives a new model. */
  const pose = {
    yaw: view.startYaw,
    pitch: view.pitch,
    distance: view.distanceFactor,
    lid: 0,
    /* What the camera aims at, as a fraction of the model's height above or
       below its centre. Orbiting the centre is right for the whole machine and
       wrong for a close-up: aimed at the middle, a shot of the keyboard puts
       the keyboard in a corner. */
    lookY: 0,
  };
  const target = { ...pose };

  let spinning = spin;
  let spinOrigin = 0;
  let lastFrame = null;

  const aim = new THREE.Vector3();

  function place() {
    const distance = span * pose.distance;
    const height = pose.lookY * size.y;

    camera.position.set(
      Math.sin(pose.yaw) * Math.cos(pose.pitch) * distance,
      height + Math.sin(pose.pitch) * distance,
      Math.cos(pose.yaw) * Math.cos(pose.pitch) * distance,
    );
    camera.lookAt(aim.set(0, height, 0));
    hinge.rotation.z = pose.lid * view.lidClosedRadians;
  }

  place();

  function draw(seconds) {
    /* First frame after a pause should not be treated as a huge time step. */
    const delta = lastFrame === null ? 0 : Math.min(seconds - lastFrame, 0.1);
    lastFrame = seconds;

    if (spinning) {
      const phase = ((((seconds - spinOrigin) / view.spinSeconds) % 1) + 1) % 1;
      target.yaw = view.startYaw + phase * TWO_PI;
      target.pitch = view.pitch;
      target.distance = view.distanceFactor;
      target.lid = lidProgress(phase, view.lidTimings);
      target.lookY = 0;
      /* The spin is authoritative, so follow it exactly rather than lagging. */
      pose.yaw = target.yaw;
      pose.pitch = target.pitch;
      pose.distance = target.distance;
      pose.lid = target.lid;
      pose.lookY = target.lookY;
    } else if (delta > 0) {
      pose.yaw = approach(pose.yaw, shortestTurn(pose.yaw, target.yaw), 0.22, delta);
      pose.pitch = approach(pose.pitch, target.pitch, 0.22, delta);
      pose.distance = approach(pose.distance, target.distance, 0.28, delta);
      pose.lid = approach(pose.lid, target.lid, 0.3, delta);
      pose.lookY = approach(pose.lookY, target.lookY, 0.28, delta);
    }

    place();
    renderer.render(scene, camera);
  }

  return {
    scene,
    camera,

    draw,

    /** True while the machine is turning on its own. */
    get spinning() {
      return spinning;
    },

    /**
     * Hand control over, or give it back.
     *
     * Resuming picks the spin up from wherever the machine is now instead of
     * from wherever the clock says it should be, so it does not jump.
     */
    setSpinning(next, seconds = 0) {
      if (next && !spinning) {
        const phase = ((pose.yaw - view.startYaw) / TWO_PI) % 1;
        spinOrigin = seconds - phase * view.spinSeconds;
      }
      spinning = next;
    },

    /** Ease towards a pose. Anything left out keeps its current target. */
    setTarget(next) {
      Object.assign(target, next);
    },

    /** Drag, in radians. Pitch is clamped so the model cannot be turned inside out. */
    orbitBy(yaw, pitch) {
      target.yaw += yaw;
      target.pitch = Math.min(Math.PI / 2 - 0.08, Math.max(-0.5, target.pitch + pitch));
      /* Keep the eased value near the target so the drag feels direct. */
      pose.yaw += yaw;
    },

    /** Whether the visitor has moved it away from the pose it was given. */
    get pose() {
      return { ...pose };
    },

    dispose() {
      environment.texture.dispose();
      for (const light of lights) light.dispose();
      scene.traverse((node) => {
        if (!node.isMesh) return;
        node.geometry.dispose();
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          material.dispose();
        }
      });
    },
  };
}
