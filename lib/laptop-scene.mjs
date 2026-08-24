/*
 * The laptop scene, built once and used twice.
 *
 * components/HeroModel.tsx renders it live in the browser;
 * scripts/render-hero-still.mjs renders a single frame of it to the poster
 * image. They have to agree exactly — the poster is what a visitor sees until
 * the canvas takes over, and any difference in camera or lighting shows up as
 * a jump at that moment. So neither owns the scene: this does, and both call
 * it with the same lib/hero-view.json.
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
 * Builds the scene and returns a draw function.
 *
 * @param {THREE.WebGLRenderer} renderer
 * @param {object} view parsed lib/hero-view.json
 * @param {string} basePath where the .glb files are served from
 * @returns {Promise<{scene: THREE.Scene, camera: THREE.PerspectiveCamera,
 *   draw: (seconds: number) => void, dispose: () => void}>}
 */
export async function createLaptopScene(renderer, view, basePath = "/models") {
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
  const studio = createStudio(view.studio);
  const environment = pmrem.fromScene(studio, 0.02);
  scene.environment = environment.texture;
  pmrem.dispose();

  const { key, rim, fill } = view.lights;
  const lights = [];
  for (const light of [key, rim, fill]) {
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
  const centre = bounds.getCenter(new THREE.Vector3());
  laptop.position.sub(centre);

  const pivot = new THREE.Group();
  pivot.add(laptop);
  scene.add(pivot);

  const radius = Math.max(size.x, size.y, size.z) * view.distanceFactor;

  function draw(seconds) {
    const phase = (((seconds / view.spinSeconds) % 1) + 1) % 1;

    /* Negative: turning the machine one way is the camera going the other,
       and the poster frame is shot from startYaw. */
    pivot.rotation.y = -(view.startYaw + phase * Math.PI * 2);
    hinge.rotation.z = lidProgress(phase, view.lidTimings) * view.lidClosedRadians;

    camera.position.set(0, view.pitch * radius, radius);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function dispose() {
    environment.texture.dispose();
    for (const light of lights) light.dispose();
    scene.traverse((node) => {
      if (!node.isMesh) return;
      node.geometry.dispose();
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        material.dispose();
      }
    });
  }

  return { scene, camera, draw, dispose };
}
