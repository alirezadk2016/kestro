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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
  const wallpaper = await new THREE.TextureLoader().loadAsync("/models/laptop-wallpaper.webp");
  wallpaper.colorSpace = THREE.SRGBColorSpace;
  wallpaper.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const parts = buildAssemblyModel(wallpaper);
  scene.add(parts.root);
  const floor = contactShadow();
  scene.add(floor);
  let current = 0;
  const aim = new THREE.Vector3();

  function setProgress(value) {
    current = clamp(value);
    const open = 1 - range(current, 0.06, 0.9);
    parts.deck.position.y = open * 0.45;
    parts.lid.position.y = 0.15 + open * 1.33;
    parts.board.position.y = -open * 0.22;
    parts.ram.position.y = -open * 0.22 + (1 - range(current, 0.12, 0.6)) * 0.21;
    parts.ssd.position.y = -open * 0.22 + (1 - range(current, 0.18, 0.65)) * 0.14;
    for (const part of [parts.board, parts.ram, parts.ssd]) part.position.z = open * 0.95;
    parts.pack.position.y = -open * 0.42;
    parts.pack.position.z = open * 0.18;
    parts.tray.position.y = 0.055 - open * 0.93;
    parts.root.rotation.y = -0.16 + range(current, 0.05, 0.95) * 0.22;
    for (const part of [parts.board, parts.ram, parts.ssd, parts.pack]) part.visible = open > 0.018;
    floor.position.y = -0.06 - open * 0.93;
  }

  function draw() {
    const open = 1 - range(current, 0.06, 0.9);
    const fit = camera.aspect > 1.15 ? 0.89 + open * 0.11 : Math.max(1, 0.92 / camera.aspect);
    const distance = (7.6 + open * 4.8) * fit;
    const yaw = 0.39 + open * 0.07,
      pitch = 0.36 + open * 0.075,
      center = 0.86 + open * 0.3;
    camera.position.set(
      Math.sin(yaw) * Math.cos(pitch) * distance,
      center + Math.sin(pitch) * distance,
      Math.cos(yaw) * Math.cos(pitch) * distance,
    );
    camera.lookAt(aim.set(0, center, 0));
    renderer.render(scene, camera);
  }
  setProgress(0);
  return {
    camera,
    scene,
    setProgress,
    draw,
    dispose() {
      const geometries = new Set(),
        materials = new Set(),
        textures = new Set([wallpaper]);
      scene.traverse((node) => {
        if (!node.isMesh) return;
        geometries.add(node.geometry);
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          materials.add(material);
          for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
        }
        if (node.isInstancedMesh) node.dispose();
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      environment.dispose();
      key.dispose();
      rim.dispose();
      fill.dispose();
    },
  };
}
