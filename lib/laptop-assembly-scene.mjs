import * as THREE from "three";
import { buildAssemblyModel } from "./laptop-assembly-model.mjs";

const clamp = (value) => Math.min(1, Math.max(0, value));
const ease = (value) => value * value * (3 - 2 * value);
const range = (value, start, end) => ease(clamp((value - start) / (end - start)));

function contactShadow() {
  const image = document.createElement("canvas");
  image.width = 512;
  image.height = 256;
  const context = image.getContext("2d");
  context.shadowColor = "#000000";
  context.shadowBlur = 46;
  context.fillStyle = "#000000";
  context.beginPath();
  context.roundRect(104, 65, 304, 126, 35);
  context.fill();
  const texture = new THREE.CanvasTexture(image);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 3.1),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

function studio(renderer) {
  const room = new THREE.Scene();
  room.background = new THREE.Color("#080a0d");
  for (const [position, size, intensity, color] of [
    [[-3, 5, 4], [5, 5], 4, "#fff4e7"],
    [[4, 3, 2], [1.3, 7], 5, "#fafbff"],
    [[-1, 3, -4], [5, 2], 3, "#dce1e8"],
    [[0, 7, -1], [7, 1], 2, "#ffffff"],
  ]) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(...size),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      }),
    );
    panel.position.set(...position);
    panel.lookAt(0, 0.5, 0);
    room.add(panel);
  }
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(room, 0.04);
  generator.dispose();
  room.traverse((node) => {
    if (node.isMesh) {
      node.geometry.dispose();
      node.material.dispose();
    }
  });
  return environment;
}

/** Studio-lit product assembly, isolated from the hero and catalogue scenes. */
export async function createLaptopAssembly(renderer) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  const environment = studio(renderer);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.85;
  const key = new THREE.DirectionalLight("#fff5e9", 3.1);
  key.position.set(-3, 7, 5);
  key.castShadow = true;
  const shadowSize = renderer.domElement.getBoundingClientRect().width < 500 ? 1024 : 2048;
  key.shadow.mapSize.set(shadowSize, shadowSize);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 5, bottom: -3, near: 0.5, far: 18 });
  key.shadow.bias = -0.00015;
  key.shadow.normalBias = 0.012;
  const rim = new THREE.DirectionalLight("#dbe7fa", 1.8);
  rim.position.set(4, 2, -4);
  const fill = new THREE.DirectionalLight("#edf3ff", 0.6);
  fill.position.set(3, 1, 5);
  scene.add(key, rim, fill, new THREE.HemisphereLight("#dce6f0", "#111319", 0.35));
  const loader = new THREE.TextureLoader();
  const loaded = await Promise.allSettled(
    ["laptop-wallpaper", "thinkpad-keyboard-texture", "thinkpad-internals-texture"].map((name) =>
      loader.loadAsync(`/models/${name}.webp`),
    ),
  );
  if (loaded.some((result) => result.status === "rejected")) {
    for (const result of loaded) if (result.status === "fulfilled") result.value.dispose();
    environment.dispose();
    key.dispose();
    rim.dispose();
    fill.dispose();
    throw new Error("Laptop textures unavailable");
  }
  const textures = loaded.map((result) => result.value);
  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  });
  const parts = buildAssemblyModel({
    wallpaper: textures[0],
    keyboard: textures[1],
    internals: textures[2],
  });
  scene.add(parts.root);
  const floor = contactShadow();
  scene.add(floor);
  let current = -1;
  let yaw = 0.34;
  let pitch = 0.48;
  const aim = new THREE.Vector3();
  const bounds = new THREE.Box3();
  const outward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  const corner = new THREE.Vector3();

  function setProgress(value) {
    const next = clamp(value);
    if (next === current) return;
    current = next;
    const shell = range(current, 0.04, 0.46);
    const components = range(current, 0.28, 0.8);
    const detail = range(current, 0.64, 1);
    parts.deck.position.set(-shell * 0.65, shell * 0.7, -shell * 0.35);
    parts.keyboard.root.position.set(shell * 0.15, shell * 1.1, -shell * 0.4);
    parts.keyboard.setSeparation(detail);
    parts.touchpad.position.set(-shell * 0.45, shell * 0.8, shell * 0.5);
    parts.buttons.position.set(shell * 0.15, shell * 0.95, -shell * 0.4);
    parts.trackpoint.position.set(shell * 0.15, shell * 1.2 + detail * 0.12, -shell * 0.4);
    parts.hinges.position.y = shell * 0.28;
    parts.lid.position.set(0, 0.17 + shell * 0.95, -1.09 - shell * 0.3);
    parts.cover.position.z = -detail * 0.23;
    parts.bezel.position.z = detail * 0.24;
    parts.lcd.position.z = detail * 0.12;
    parts.camera.position.y = detail * 0.12;
    parts.board.position.set(0, -shell * 0.15, components * 0.8);
    parts.fan.position.set(1.04 + detail * 0.14, 0.045 + components * 0.31, -0.55);
    parts.cooling.position.y = components * 0.46;
    parts.wifi.position.y = components * 0.2;
    parts.coin.position.y = detail * 0.17;
    parts.ram.position.set(0, -shell * 0.15, components * 0.8);
    parts.modules.forEach((module, index) => {
      module.position.set((index ? 1 : -1) * detail * 0.09, components * (0.38 + index * 0.2), 0);
      module.rotation.x = components * -0.08;
    });
    parts.caddy.position.set(-components * 0.4, -shell * 0.15, components * 0.8);
    parts.ssd.position.set(-components * 0.5, components * 0.5, components * 0.85);
    parts.pack.position.set(0, -shell * 0.48, components * 0.4);
    parts.external.position.set(0, -shell * 0.2, -components * 0.7);
    parts.tray.position.y = -shell * 0.95;
    parts.speakers.forEach((speaker, index) =>
      speaker.position.set((index ? 1 : -1) * components * 0.15, -shell * 0.1, components * 0.24),
    );
    parts.fasteners.forEach((screw, index) =>
      screw.position.set((index < 3 ? -1 : 1) * detail * 0.1, -shell * 1.1, 0),
    );
    floor.position.y = -0.09 - shell * 1.1;
    floor.material.opacity = 0.2 - shell * 0.09;
    parts.root.updateMatrixWorld(true);
    bounds.setFromObject(parts.root);
    bounds.getCenter(aim);
  }

  function draw() {
    const elevation = Math.min(1.2, pitch + range(current, 0.2, 1) * 0.18);
    outward.set(
      Math.sin(yaw) * Math.cos(elevation),
      Math.sin(elevation),
      Math.cos(yaw) * Math.cos(elevation),
    );
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    up.crossVectors(outward, right);
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
    let distance = 0;
    // Fit every corner from the current viewing angle, including exploded parts.
    for (let i = 0; i < 8; i++) {
      corner
        .set(
          i & 1 ? bounds.max.x : bounds.min.x,
          i & 2 ? bounds.max.y : bounds.min.y,
          i & 4 ? bounds.max.z : bounds.min.z,
        )
        .sub(aim);
      distance = Math.max(
        distance,
        Math.abs(corner.dot(up)) / tangent + corner.dot(outward),
        Math.abs(corner.dot(right)) / (tangent * camera.aspect) + corner.dot(outward),
      );
    }
    camera.position.copy(aim).addScaledVector(outward, distance * 1.055);
    camera.lookAt(aim);
    renderer.render(scene, camera);
  }
  setProgress(0);
  return {
    camera,
    scene,
    setProgress,
    draw,
    orbitBy(horizontal, vertical) {
      yaw = THREE.MathUtils.euclideanModulo(yaw + horizontal + Math.PI, Math.PI * 2) - Math.PI;
      pitch = THREE.MathUtils.clamp(pitch + vertical, 0.12, 1.05);
    },
    resetOrbit() {
      yaw = 0.34;
      pitch = 0.48;
    },
    get orbit() {
      return { yaw, pitch };
    },
    dispose() {
      const geometries = new Set(),
        materials = new Set(),
        allTextures = new Set(textures);
      scene.traverse((node) => {
        if (!node.isMesh) return;
        geometries.add(node.geometry);
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          materials.add(material);
          for (const value of Object.values(material)) if (value?.isTexture) allTextures.add(value);
        }
        if (node.isInstancedMesh) node.dispose();
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      allTextures.forEach((texture) => texture.dispose());
      environment.dispose();
      key.dispose();
      rim.dispose();
      fill.dispose();
    },
  };
}
