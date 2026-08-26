/*
 * The hero carousel: the frames of a machine being made ready, mounted behind
 * glass on a ring that turns.
 *
 * Built the same way as lib/laptop-scene.mjs and for the same reason — the
 * poster image and the live canvas both come from this file, so they cannot
 * drift apart. Plain JavaScript, because scripts/render-reel-still.mjs loads it
 * straight into a headless browser through an import map with no build step.
 *
 * Two decisions worth naming.
 *
 * The frames are already studio renders, lit and graded. Lighting them a
 * second time in here would flatten exactly the blacks that make them look
 * expensive, so the picture face is unlit and opts out of tone mapping
 * (`toneMapped: false`) and reaches the screen as it was authored.
 *
 * The glass in front of it is where the light goes instead. It is a real
 * physical material with a clearcoat and a strong environment map, so as the
 * ring turns each pane sweeps the studio's highlight across itself — the
 * reflection moves because the pane moves, not because a texture is being slid
 * about. That is the difference between glass and a picture of glass, and it
 * costs nothing extra: the environment map is already there for the metal.
 */
import * as THREE from "three";

const TWO_PI = Math.PI * 2;

/** Frame-rate independent easing towards a value; see lib/laptop-scene.mjs. */
function approach(current, target, smoothing, delta) {
  return target + (current - target) * Math.exp(-delta / smoothing);
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * A dark surround for the glass and the metal to reflect.
 *
 * Same argument as the laptop scene: three's RoomEnvironment is a white room,
 * and white reflections across every pane would read as plastic. These are a
 * few narrow sources in a black room. The first one is deliberately the
 * brightest and the narrowest — it is the streak that crosses each pane as the
 * ring brings it round, and without something that concentrated there is
 * nothing for the glass to catch.
 */
function createStudio() {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x04060e);

  /*
   * Where these sit matters more than how bright they are. A pane at the front
   * of the ring is a flat mirror facing the camera, so what it shows is
   * whatever stands behind the camera — put every source up in the roof, as a
   * product studio would, and the reflection lands above the pane's top edge
   * where nobody sees it. The first two are therefore low and out to the
   * sides, roughly at eye height and slightly in front of the ring: narrow
   * vertical strips whose reflection crosses the face of each pane as the ring
   * brings it round. That travelling streak is the whole effect.
   */
  const panels = [
    { position: [-4.4, 1.2, 12.5], size: [1.5, 8], color: 0xffffff, intensity: 3.4 },
    { position: [4.8, 2.4, 11.5], size: [1.0, 8], color: 0xc9d8ff, intensity: 2.4 },
    { position: [-4, 9, 8], size: [1.6, 14], color: 0xffffff, intensity: 1.2 },
    { position: [0, 10, 2], size: [26, 5], color: 0xdbe4ff, intensity: 0.4 },
    { position: [-11, 1, 3], size: [5, 14], color: 0x93a9ef, intensity: 0.3 },
    { position: [11, 0, -3], size: [5, 14], color: 0x2e79ff, intensity: 0.26 },
    { position: [0, -9, 3], size: [22, 6], color: 0x16224a, intensity: 0.25 },
  ];

  for (const panel of panels) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(panel.size[0], panel.size[1]),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(panel.color).multiplyScalar(panel.intensity),
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.set(...panel.position);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
  }

  return studio;
}

/**
 * The gradient that swallows the reflections.
 *
 * A mirrored copy of a pane that simply stops has a hard edge across it and
 * reads as a second pane upside down. The obvious fix — hanging a plane
 * painted in the background colour in front of it — only works if the canvas
 * has that background, and this one is transparent so the hero shows through.
 * So the fade lives in the reflection's own alpha instead: opaque where it
 * meets the floor, gone by the time it would have ended.
 *
 * The mirror is drawn with scale.y = −1, which flips its texture coordinates
 * with it: the top of this gradient lands at the bottom of the reflection.
 */
function createFalloffTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, "#000000");
  gradient.addColorStop(0.42, "#242424");
  gradient.addColorStop(1, "#ffffff");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 4, 256);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Builds the carousel and returns the handle used to drive it.
 *
 * Every pane's place is derived from one number — how far the ring has turned
 * — so there is no per-pane state to keep in step. Where it sits, how far it
 * has turned away, whether it has gone round the back and faded out, and which
 * one is at the front all fall out of its angle.
 */
export async function createReelScene(renderer, config, options = {}) {
  const { basePath = "/reel", drifting = true } = options;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = config.exposure;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(config.fov, 1, 0.1, 100);
  camera.position.set(0, config.cameraY, config.radius + config.distance);
  camera.lookAt(0, config.lookY, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(createStudio(), 0.03).texture;
  scene.environment = environment;

  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(4, 8, 9);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xa9bcff, 3.4);
  rim.position.set(-8, 5, 4);
  scene.add(rim);

  const loader = new THREE.TextureLoader();
  const anisotropy = renderer.capabilities.getMaxAnisotropy();

  const textures = await Promise.all(
    config.frames.map(
      (frame) =>
        new Promise((resolve, reject) => {
          loader.load(
            `${basePath}/${frame}.webp`,
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.anisotropy = anisotropy;
              resolve(texture);
            },
            undefined,
            reject,
          );
        }),
    ),
  );

  const falloffTexture = createFalloffTexture();

  const { width: W, height: H, depth: D } = config.panel;
  const slabGeometry = new THREE.BoxGeometry(W, H, D);
  const faceGeometry = new THREE.PlaneGeometry(W, H);
  const glassGeometry = new THREE.PlaneGeometry(W * 1.03, H * 1.045);

  const step = TWO_PI / textures.length;

  /* Every pane needs its own materials: they fade independently as they turn
     round the back, and opacity lives on the material. */
  const panes = textures.map((texture, index) => {
    const edge = () =>
      new THREE.MeshStandardMaterial({
        color: 0x1c2742,
        metalness: 0.96,
        roughness: 0.14,
        emissive: 0x0d1730,
        emissiveIntensity: 0.55,
        transparent: true,
      });

    const face = new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
      transparent: true,
    });

    const back = new THREE.MeshStandardMaterial({
      color: 0x070a14,
      metalness: 0.5,
      roughness: 0.7,
      transparent: true,
    });

    /* BoxGeometry takes its materials in +X, −X, +Y, −Y, +Z, −Z order, so the
       picture goes at index 4 and the visitor never sees the other five
       head-on. */
    const slab = new THREE.Mesh(slabGeometry, [edge(), edge(), edge(), edge(), face, back]);
    slab.userData.index = index;

    /*
     * The pane of glass over the picture.
     *
     * Not transmission: a transmissive material makes three render the scene a
     * second time into an offscreen target every frame, and for a sheet this
     * thin over an opaque picture the refraction is invisible anyway. What is
     * visible is what glass over a photograph actually does — it adds a hard,
     * moving reflection of the room on top without hiding what is underneath.
     * That is a clearcoat with a strong environment map and almost no opacity
     * of its own, which costs one extra transparent quad.
     *
     * It overhangs the picture slightly, so the sheet reads as sitting on the
     * front of the slab rather than as being the front of the slab.
     */
    const glass = new THREE.Mesh(
      glassGeometry,
      new THREE.MeshStandardMaterial({
        /* Black base, added rather than blended over. A pale sheet at low
           opacity is the obvious way to draw glass and the wrong one: it lays
           a grey veil across the picture and the blacks the renders depend on
           go flat. Additive blending over a black base contributes nothing at
           all where the room is not reflected, and only the specular and the
           clearcoat reach the screen — which is what a clean pane does. */
        color: 0x000000,
        metalness: 0,
        roughness: 0.055,
        /* Standard, not physical, and no clearcoat. A clearcoat is the
           obvious knob for glass and it is a second full specular lobe
           evaluated per pixel — the most expensive thing that was in this
           scene. On a flat pane with nothing coloured underneath for a coat to
           sit on, one smooth dielectric lobe against a strong environment
           gives the same streak; the physical shader was being compiled and
           run for features none of which were switched on. */
        envMapIntensity: 2.6,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: config.glass,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
    );
    glass.position.z = D / 2 + 0.012;
    glass.renderOrder = 1;

    /* The reflection is the same picture, mirrored below the floor line. A
       real reflective floor would cost a second render pass of the whole
       scene every frame for something the falloff hides half of. */
    const mirror = new THREE.Mesh(
      faceGeometry,
      new THREE.MeshBasicMaterial({
        map: texture,
        alphaMap: falloffTexture,
        toneMapped: false,
        transparent: true,
        depthWrite: false,
        opacity: config.reflection,
        side: THREE.DoubleSide,
      }),
    );
    mirror.position.y = -H - config.floorGap;
    mirror.scale.y = -1;

    const group = new THREE.Group();
    group.add(slab, glass, mirror);
    scene.add(group);

    return { group, slab, glass, mirror, index, lift: 0 };
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let turn = 0;
  let snapTarget = null;
  let speed = 0;
  let hovered = -1;
  let pointerActive = false;
  let spinning = drifting;
  let last = 0;
  let active = 0;

  function layout(delta) {
    let nearest = 0;
    let nearestFacing = -Infinity;

    for (const pane of panes) {
      /* Minus, not plus. With the turn added, the pane at the front as the
         ring moves is the one with the *lower* index, so the sequence plays
         backwards: a machine that arrives already finished, then loses its
         keyboard, then its battery. */
      const angle = pane.index * step - turn;

      /* How square-on this pane is to the camera: 1 at the front of the ring,
         0 edge-on, −1 round the back. Everything else is derived from it. */
      const facing = Math.cos(angle);

      pane.lift = approach(pane.lift, pane.index === hovered ? 1 : 0, 0.09, delta);

      /* Hovering pushes a pane out along its own radius rather than towards
         the camera, so it stays on the ring instead of breaking away from it. */
      const radius = config.radius * (1 + pane.lift * config.hoverPush);
      pane.group.position.set(Math.sin(angle) * radius, config.panelY, Math.cos(angle) * radius);
      /*
       * Turned less than the ring itself.
       *
       * A pane mounted true to the ring sits at the full angle, and with six
       * of them that is 60° for the two either side of the front — steep
       * enough that a face on one is a sliver. Easing the rotation back keeps
       * the neighbours readable while the ring still reads as a ring; at 1 it
       * is a true carousel, at 0 a row of billboards that happen to curve.
       */
      pane.group.rotation.y = angle * config.faceIn;
      pane.group.scale.setScalar(1 + pane.lift * config.hoverScale);

      /* Panes do not vanish at the edge of the ring; they fade as they turn
         away, which is also what hides the fact that the far side is being
         looked at from behind. */
      const opacity = smoothstep(config.fadeAt, config.fadeTo, facing);
      for (const material of pane.slab.material) material.opacity = opacity;
      pane.glass.material.opacity = config.glass * opacity;
      pane.mirror.material.opacity = config.reflection * opacity * opacity;
      pane.group.visible = opacity > 0.004;

      if (facing > nearestFacing) {
        nearestFacing = facing;
        nearest = pane.index;
      }
    }

    active = nearest;
  }

  function draw(time) {
    const delta = last === 0 ? 0.016 : Math.min(time - last, 0.05);
    last = time;

    if (snapTarget !== null) {
      /* Someone picked a frame. The ring eases to it and the drift stays out
         of the way until it arrives, so the pane they asked for is the one
         that stops in front of them. */
      turn = approach(turn, snapTarget, 0.2, delta);
      if (Math.abs(turn - snapTarget) < 0.0015) {
        turn = snapTarget;
        snapTarget = null;
      }
      speed = 0;
    } else {
      /* The turn stops while the pointer is holding a pane, so reading a
         caption is not a race against the animation. */
      const wanted = spinning && !pointerActive ? config.speed : 0;
      speed = approach(speed, wanted, 0.4, delta);
      turn += speed * delta;
    }

    layout(delta);

    if (pointerActive) {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(
        panes.filter((pane) => pane.group.visible).map((pane) => pane.slab),
        false,
      );
      hovered = hits.length ? hits[0].object.userData.index : -1;
    } else {
      hovered = -1;
    }

    renderer.render(scene, camera);
  }

  function setPointer(x, y) {
    if (x === null) {
      pointerActive = false;
      return;
    }
    pointer.set(x, y);
    pointerActive = true;
  }

  /**
   * Brings one frame to the front by the shorter way round.
   *
   * The ring wraps, so the target angle has infinitely many equivalents;
   * without picking the nearest one, choosing frame 1 while frame 9 is at the
   * front sends the whole ring spinning backwards through all seven between.
   */
  function goTo(index) {
    const wanted = index * step;
    const diff = ((((wanted - turn + Math.PI) % TWO_PI) + TWO_PI) % TWO_PI) - Math.PI;
    snapTarget = turn + diff;
  }

  function setDrifting(value) {
    spinning = value;
  }

  /** Puts the ring at an exact angle, for rendering a chosen frame. */
  function setTurn(value) {
    turn = value;
    snapTarget = null;
    layout(0.016);
  }

  /** Which frame is at the front, for the caption underneath the canvas. */
  function activeFrame() {
    return hovered >= 0 ? hovered : active;
  }

  function dispose() {
    for (const pane of panes) {
      for (const material of pane.slab.material) material.dispose();
      pane.glass.material.dispose();
      pane.mirror.material.dispose();
    }
    for (const texture of textures) texture.dispose();
    slabGeometry.dispose();
    faceGeometry.dispose();
    glassGeometry.dispose();
    falloffTexture.dispose();
    environment.dispose();
    pmrem.dispose();
  }

  layout(0.016);

  return { scene, camera, draw, setPointer, setDrifting, setTurn, goTo, activeFrame, dispose };
}
