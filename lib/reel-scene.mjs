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
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const TWO_PI = Math.PI * 2;

/**
 * The grade: everything a camera does to an image after the light hits it.
 *
 * Three effects in one full-screen pass rather than three passes, because each
 * pass is another full-resolution read and write of the frame and these are
 * all cheap arithmetic on the same pixel.
 *
 *   - Chromatic aberration. A real lens does not focus every wavelength on the
 *     same plane, so the red and blue channels are sampled a fraction apart,
 *     scaled by distance from the centre — none at all in the middle, a hair
 *     at the corners. It is the single most recognisable signature of a
 *     photographed image, and at this strength it is invisible until you
 *     remove it.
 *   - Vignette. Lenses fall off at the edges. It also does real work here:
 *     it darkens the corners where panes turn away, so they leave the frame
 *     into shadow rather than at a boundary.
 *   - Grain, animated. Static grain reads as a dirty screen; grain that moves
 *     reads as film. Seeded on time as well as position, so it does not sit
 *     still.
 *
 * The alpha channel is carried through untouched. The canvas is transparent so
 * the hero shows through it, and an effect that writes alpha would punch the
 * page out behind the reel.
 */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberration: { value: 0.0016 },
    uVignette: { value: 0.42 },
    uGrain: { value: 0.055 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAberration;
    uniform float uVignette;
    uniform float uGrain;
    varying vec2 vUv;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 centred = vUv - 0.5;
      float radius = length(centred);

      // Red and blue pulled apart with distance from centre; green stays put.
      vec2 offset = centred * uAberration * radius;
      vec4 colour = texture2D(tDiffuse, vUv);
      colour.r = texture2D(tDiffuse, vUv + offset).r;
      colour.b = texture2D(tDiffuse, vUv - offset).b;

      colour.rgb *= 1.0 - uVignette * smoothstep(0.25, 0.78, radius);
      colour.rgb += (noise(vUv * 900.0 + uTime * 60.0) - 0.5) * uGrain;

      gl_FragColor = colour;
    }
  `,
};

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
 * A soft round pool of light, as a texture.
 *
 * Used twice, at different sizes and opacities: once standing behind the ring
 * as a backdrop, once lying flat under it as the light on the floor. Both are
 * the same idea — the panes are dark objects, and without something lit behind
 * and beneath them they are shapes floating in a void rather than objects in a
 * room. A studio photographer solves this with a lit backdrop and a bounce
 * card; this is the same two lights, drawn.
 */
function createGlowTexture(stops) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [offset, colour] of stops) gradient.addColorStop(offset, colour);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
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

  /*
   * Tone mapping belongs to whichever stage writes the screen. With a
   * composer, that is the OutputPass at the end of the chain — leaving it on
   * the renderer would tone-map the scene, then bloom the already-compressed
   * highlights, and the bloom would have nothing bright left to find.
   */
  const post = config.post !== false;
  renderer.toneMapping = post ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
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

  /*
   * The room.
   *
   * Depth first: without fog, a pane on the far side of the ring is the same
   * brightness as the one at the front and the ring reads as flat cut-outs on
   * a turntable. The fog is the hero's own navy, so a pane receding is
   * literally dissolving into the page behind it, and the canvas can stay
   * transparent.
   */
  scene.fog = new THREE.Fog(config.fog.colour, config.fog.near, config.fog.far);

  /* The lit backdrop, stood up behind the ring. */
  const backdropTexture = createGlowTexture([
    [0, "rgba(72,116,232,0.16)"],
    [0.4, "rgba(40,70,170,0.06)"],
    [1, "rgba(11,20,38,0)"],
  ]);
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(config.radius * 3.2, config.radius * 2.4),
    new THREE.MeshBasicMaterial({
      map: backdropTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    }),
  );
  backdrop.position.set(0, config.panelY, -config.radius * 2.1);
  backdrop.renderOrder = -2;
  scene.add(backdrop);

  /* The pool on the floor, laid flat under it. Squashed along Z because a
     circle seen at this angle reads as a circle only when it is an ellipse. */
  const poolTexture = createGlowTexture([
    [0, "rgba(96,138,255,0.15)"],
    [0.35, "rgba(46,90,200,0.055)"],
    [1, "rgba(11,20,38,0)"],
  ]);
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(config.radius * 3.6, config.radius * 3.6),
    new THREE.MeshBasicMaterial({
      map: poolTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    }),
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, config.panelY - config.panel.height / 2 - config.floorGap, 0);
  pool.scale.z = 0.62;
  pool.renderOrder = -1;
  scene.add(pool);

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

  /*
   * The chain: draw, bloom, grade, output.
   *
   * Bloom is what makes the light in a render read as light rather than as a
   * bright pixel — the streak crossing a pane spills past its own edge the way
   * a highlight does through a lens. It is also the one effect here that costs
   * real time, five downsampled passes of the frame, so it is threshold-gated
   * high: only the specular on the glass and the brightest parts of a
   * photograph reach it, never the mid-tones.
   */
  const composer = post ? new EffectComposer(renderer) : null;
  let usingPost = post;
  let bloomPass = null;
  let gradePass = null;

  if (composer) {
    composer.addPass(new RenderPass(scene, camera));

    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      config.bloom.strength,
      config.bloom.radius,
      config.bloom.threshold,
    );
    composer.addPass(bloomPass);

    gradePass = new ShaderPass(GradeShader);
    gradePass.uniforms.uAberration.value = config.grade.aberration;
    gradePass.uniforms.uVignette.value = config.grade.vignette;
    gradePass.uniforms.uGrain.value = config.grade.grain;
    composer.addPass(gradePass);

    const output = new OutputPass();
    output.toneMapping = THREE.ACESFilmicToneMapping;
    composer.addPass(output);
  }

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
  let elapsed = 0;

  /* Where the camera is being asked to look from, and where it actually is.
     The second chases the first, which is what keeps a mouse move from
     snapping the frame. */
  const aim = { x: 0, y: 0 };
  const eye = { x: 0, y: 0 };
  const home = camera.position.clone();

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
      /* On the wrapped angle, not the raw one. A pane at 300° and a pane at
         −60° stand in the same place, but scaling the first by 0.72 turns it
         216° — its back to the camera, rendering as a black slab. */
      const wrapped = ((((angle + Math.PI) % TWO_PI) + TWO_PI) % TWO_PI) - Math.PI;
      pane.group.rotation.y = wrapped * config.faceIn;
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

    /*
     * The camera moves.
     *
     * A fixed camera with a turning object in front of it is a turntable; a
     * camera that drifts is a shot. Two figures at different periods, so the
     * movement never visibly repeats, and an amount small enough that nobody
     * watching notices it happening — which is the point. Underneath it, the
     * pointer offsets the camera a little further, so moving the mouse across
     * the frame feels like leaning rather than like dragging a control.
     */
    elapsed += delta;
    const driftX = Math.sin(elapsed * 0.11) * config.camera.drift;
    const driftY = Math.sin(elapsed * 0.077 + 1.7) * config.camera.drift * 0.55;

    const wantX = driftX + aim.x * config.camera.parallax;
    const wantY = driftY + aim.y * config.camera.parallax * 0.6;
    eye.x = approach(eye.x, wantX, 0.5, delta);
    eye.y = approach(eye.y, wantY, 0.5, delta);

    camera.position.set(home.x + eye.x, home.y + eye.y, home.z);
    camera.lookAt(0, config.lookY, 0);

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

    if (usingPost) {
      if (gradePass) gradePass.uniforms.uTime.value = elapsed;
      composer.render(delta);
    } else {
      renderer.render(scene, camera);
    }
  }

  function setPointer(x, y) {
    if (x === null) {
      pointerActive = false;
      aim.x = 0;
      aim.y = 0;
      return;
    }
    pointer.set(x, y);
    aim.x = x;
    aim.y = y;
    pointerActive = true;
  }

  /** Pushes the ring along, for scroll. Cancels any snap in progress: the
      reader moving the page outranks a marker they clicked a moment ago. */
  function nudge(amount) {
    snapTarget = null;
    turn += amount;
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

  /** Keeps the composer's render targets in step with the canvas. */
  function setSize(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (composer) composer.setSize(width, height);
    /* Bloom at half resolution. It is a blur — there is nothing in it fine
       enough to need full-resolution pixels, and its five downsample and
       upsample steps are the most expensive thing in the chain. */
    if (bloomPass) bloomPass.setSize(width / 2, height / 2);
  }

  /**
   * Turns the whole post chain off for the rest of the session.
   *
   * Called by the caller when it has watched enough frames to know this device
   * cannot afford it. Tone mapping has to go back on the renderer at the same
   * moment, because the OutputPass that was doing it is no longer in the path
   * — without this the picture drops to raw linear and washes out grey.
   */
  function setPost(enabled) {
    usingPost = enabled && composer !== null;
    renderer.toneMapping = usingPost ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = config.exposure;
  }

  function dispose() {
    if (composer) composer.dispose();
    if (bloomPass) bloomPass.dispose();
    if (gradePass) gradePass.dispose();
    for (const pane of panes) {
      for (const material of pane.slab.material) material.dispose();
      pane.glass.material.dispose();
      pane.mirror.material.dispose();
    }
    for (const texture of textures) texture.dispose();
    backdrop.geometry.dispose();
    backdrop.material.dispose();
    backdropTexture.dispose();
    pool.geometry.dispose();
    pool.material.dispose();
    poolTexture.dispose();
    slabGeometry.dispose();
    faceGeometry.dispose();
    glassGeometry.dispose();
    falloffTexture.dispose();
    environment.dispose();
    pmrem.dispose();
  }

  layout(0.016);

  return {
    scene,
    camera,
    draw,
    setPointer,
    setDrifting,
    setTurn,
    setSize,
    setPost,
    nudge,
    goTo,
    activeFrame,
    dispose,
  };
}
