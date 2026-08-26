/*
 * The hero reel: the nine frames of a machine being made ready, hung as
 * physical panels in a dark studio and drifting slowly past the camera.
 *
 * Built the same way as lib/laptop-scene.mjs and for the same reason — the
 * poster image and the live canvas both come from this file, so they cannot
 * drift apart. Plain JavaScript, because scripts/render-reel-still.mjs loads it
 * straight into a headless browser through an import map with no build step.
 *
 * The design problem worth naming: the frames are already studio renders, lit
 * and graded. Lighting them a second time in here would flatten exactly the
 * blacks that make them look expensive. So the picture face is unlit and opts
 * out of tone mapping (`toneMapped: false`) and reaches the screen as it was
 * authored — while the slab it is mounted on is real geometry in real light,
 * with metal edges that catch the rim. The physicality comes from the edge and
 * the reflection, never from relighting the photograph.
 */
import * as THREE from "three";

/** Frame-rate independent easing towards a value; see lib/laptop-scene.mjs. */
function approach(current, target, smoothing, delta) {
  return target + (current - target) * Math.exp(-delta / smoothing);
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * A dark surround for the panels to reflect.
 *
 * Same argument as the laptop scene: three's RoomEnvironment is a white room,
 * and white reflections down the edge of every panel would read as plastic.
 * These are a few narrow sources in a black room, so the metal edges pick up
 * one bright line and stay dark everywhere else.
 */
function createStudio() {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x04060e);

  const panels = [
    { position: [0, 9, 4], size: [26, 7], color: 0xffffff, intensity: 0.9 },
    { position: [-9, 1, 5], size: [8, 12], color: 0x93a9ef, intensity: 0.55 },
    { position: [9, 0, -4], size: [10, 12], color: 0x2e79ff, intensity: 0.5 },
    { position: [0, -8, 3], size: [22, 6], color: 0x1b2b5c, intensity: 0.3 },
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
 * A mirrored copy of a panel that simply stops has a hard edge across it and
 * reads as a second panel upside down. The obvious fix — hanging a plane
 * painted in the background colour in front of it — only works if the canvas
 * has that background, and this one is transparent so the hero shows through.
 * So the fade lives in the reflection's own alpha instead: opaque where it
 * meets the floor, gone by the time it would have ended. Works on any
 * background, and costs one 4×256 texture shared by every panel.
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
  gradient.addColorStop(0.42, "#2a2a2a");
  gradient.addColorStop(1, "#ffffff");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 4, 256);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Builds the reel and returns the handle used to drive it.
 *
 * The rail carries the panels round endlessly: each one's position along it is
 * its index times the spacing, plus a shared offset, wrapped. Everything else
 * — how far back it curves, how far it has faded, whether it is the one the
 * pointer is over — is derived from where it ended up, so there is no
 * per-panel state to keep in step.
 */
export async function createReelScene(renderer, config, options = {}) {
  const { basePath = "/reel", drifting = true } = options;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = config.exposure;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(config.fov, 1, 0.1, 100);
  camera.position.set(0, config.cameraY, config.distance);
  camera.lookAt(0, config.lookY, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(createStudio(), 0.04).texture;
  scene.environment = environment;

  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(5, 8, 7);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xa9bcff, 3.4);
  rim.position.set(-7, 5, 3);
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

  /* Every panel needs its own materials: they fade independently as they reach
     the ends of the rail, and opacity lives on the material. */
  const panels = textures.map((texture, index) => {
    /*
     * The slab's edge is the whole trick. The pictures are black objects on a
     * black ground sitting on a near-black page, so a panel with no edge has
     * no boundary and reads as a stain rather than an object. A narrow band of
     * polished metal down the side catches the rim light and draws the panel's
     * outline in one bright line — which is exactly how the reference product
     * shots separate a black laptop from a black background.
     */
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
       picture goes at index 4 and the visitor never sees the other five head-on. */
    const slab = new THREE.Mesh(slabGeometry, [edge(), edge(), edge(), edge(), face, back]);
    slab.userData.index = index;

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
    group.add(slab, mirror);
    scene.add(group);

    return { group, slab, mirror, face, index, lift: 0, liftTarget: 0 };
  });

  const total = panels.length * config.spacing;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let offset = 0;
  let snapTarget = null;
  let scrub = 0;
  let hovered = -1;
  let pointerActive = false;
  let spinning = drifting;
  let last = 0;
  let active = 0;

  /** Where a panel sits on the rail right now, wrapped to [−total/2, total/2). */
  function railPosition(index) {
    const raw = index * config.spacing + offset;
    return ((((raw + total / 2) % total) + total) % total) - total / 2;
  }

  function layout(delta) {
    let nearest = 0;
    let nearestDistance = Infinity;

    for (const panel of panels) {
      const x = railPosition(panel.index);
      const distance = Math.abs(x);

      /* The rail curves away from the camera at the edges rather than running
         flat: a flat wall of panels reads as a filmstrip pasted on the page,
         a curved one reads as a room. */
      const curve = Math.min(distance * distance * config.arc, config.arcMax);

      panel.liftTarget = panel.index === hovered ? 1 : 0;
      panel.lift = approach(panel.lift, panel.liftTarget, 0.09, delta);

      panel.group.position.set(x, config.panelY, -curve + panel.lift * config.hoverLift);
      panel.group.rotation.y = -x * config.turn;
      panel.group.rotation.x = -panel.lift * 0.02;

      const scale = 1 + panel.lift * config.hoverScale;
      panel.group.scale.setScalar(scale);

      /* Panels do not pop in at the edge of the frame; they arrive out of the
         dark. The same curve hides the seam where the rail wraps round. */
      const fade = 1 - smoothstep(config.fadeStart, config.fadeEnd, distance);
      const opacity = fade;
      for (const material of panel.slab.material) material.opacity = opacity;
      panel.mirror.material.opacity = config.reflection * fade * fade;
      panel.group.visible = opacity > 0.004;

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = panel.index;
      }
    }

    active = nearest;
  }

  function draw(time) {
    const delta = last === 0 ? 0.016 : Math.min(time - last, 0.05);
    last = time;

    if (snapTarget !== null) {
      /* Someone picked a frame. The rail eases to it and the drift stays out
         of the way until it arrives, so the panel they asked for is the one
         that stops in front of them. */
      offset = approach(offset, snapTarget, 0.18, delta);
      if (Math.abs(offset - snapTarget) < 0.002) {
        offset = snapTarget;
        snapTarget = null;
      }
      scrub = 0;
    } else {
      /* The drift stops while the pointer is holding a panel, so reading a
         caption is not a race against the animation. */
      const wanted = spinning && !pointerActive ? -config.speed : 0;
      scrub = approach(scrub, wanted, 0.35, delta);
      offset += scrub * delta;
    }

    layout(delta);

    if (pointerActive) {
      raycaster.setFromCamera(pointer, camera);
      const visible = panels.filter((panel) => panel.group.visible);
      const hits = raycaster.intersectObjects(
        visible.map((panel) => panel.slab),
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

  function nudge(amount) {
    snapTarget = null;
    offset += amount;
  }

  /**
   * Brings one frame to the centre by the shorter way round.
   *
   * The rail wraps, so the target offset has infinitely many equivalents;
   * without picking the nearest one, choosing frame 1 while frame 9 is in
   * front sends the whole reel scrolling backwards through all seven in
   * between.
   */
  function goTo(index) {
    const wanted = -index * config.spacing;
    const diff = ((((wanted - offset + total / 2) % total) + total) % total) - total / 2;
    snapTarget = offset + diff;
  }

  function setDrifting(value) {
    spinning = value;
  }

  /** Which frame is closest to centre, for the caption underneath the canvas. */
  function activeFrame() {
    return hovered >= 0 ? hovered : active;
  }

  function dispose() {
    for (const panel of panels) {
      for (const material of panel.slab.material) material.dispose();
      panel.mirror.material.dispose();
    }
    for (const texture of textures) texture.dispose();
    slabGeometry.dispose();
    faceGeometry.dispose();
    falloffTexture.dispose();
    environment.dispose();
    pmrem.dispose();
  }

  layout(0.016);

  return { scene, camera, draw, setPointer, setDrifting, nudge, goTo, activeFrame, dispose };
}
