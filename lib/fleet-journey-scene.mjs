import * as THREE from "three";
import { buildAssemblyModel } from "./laptop-assembly-model.mjs";

function studioEnvironment(renderer) {
  const room = new THREE.Scene();
  room.background = new THREE.Color("#03050a");
  for (const [position, size, color, intensity] of [
    [[-4, 6, 4], [4, 5], "#f6eee4", 3],
    [[4, 3, 1], [1, 6], "#d6e8ff", 3],
    [[0, 4, -4], [6, 1], "#8fb7ff", 2],
  ]) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(...size),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      }),
    );
    panel.position.set(...position);
    panel.lookAt(0, 0.7, 0);
    room.add(panel);
  }
  const generator = new THREE.PMREMGenerator(renderer);
  const map = generator.fromScene(room, 0.04);
  generator.dispose();
  room.traverse((node) => {
    if (node.isMesh) {
      node.geometry.dispose();
      node.material.dispose();
    }
  });
  return map;
}

function screenTexture() {
  const image = document.createElement("canvas");
  image.width = 512;
  image.height = 320;
  const context = image.getContext("2d");
  context.fillStyle = "#020509";
  context.fillRect(0, 0, 512, 320);
  const gradient = context.createLinearGradient(0, 320, 512, 0);
  gradient.addColorStop(0, "#113576");
  gradient.addColorStop(0.5, "#2870ed");
  gradient.addColorStop(1, "#bddbff");
  context.strokeStyle = gradient;
  context.shadowColor = "#185eea";
  context.shadowBlur = 18;
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(-20, 290);
  context.bezierCurveTo(200, 320, 220, 85, 540, 25);
  context.stroke();
  context.shadowBlur = 0;
  context.lineWidth = 1.2;
  context.stroke();
  const texture = new THREE.CanvasTexture(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Position, yaw, lid angle and scale; all stages share one fixed camera lens.
const poses = [
  [
    [0, 0.05, 0.6, 0, -0.215, 1.2],
    [-2.3, 0.05, -2.2, 0.25, 1.57, 0.78],
    [2.3, 0.05, -2.2, -0.25, 1.57, 0.78],
  ],
  [
    [0, 0.05, 1, 0, -0.215, 1],
    [-2.3, 0.05, -2, 0.2, -0.215, 0.78],
    [2.3, 0.05, -2, -0.2, -0.215, 0.78],
  ],
  [
    [0, 0.05, 1.35, -0.35, -0.215, 1.08],
    [-2.3, 0.05, -2.2, 0.22, 1.57, 0.78],
    [2.3, 0.05, -2.2, -0.22, 1.57, 0.78],
  ],
  [
    [0, 0.29, 0, -0.2, 1.57, 1],
    [0, 0.05, 0, -0.2, 1.57, 1],
    [0, 0.53, 0, -0.2, 1.57, 1],
  ],
  [
    [0, 0.05, 1, 0, -0.215, 1],
    [-2.3, 0.05, -1.8, 0.22, -0.215, 0.78],
    [2.3, 0.05, -1.8, -0.22, -0.215, 0.78],
  ],
];

export async function createFleetJourneyScene(renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 80);
  const environment = studioEnvironment(renderer);
  scene.environment = environment.texture;
  scene.environmentIntensity = 1.3;
  scene.fog = new THREE.FogExp2("#060b16", 0.035);
  const key = new THREE.DirectionalLight("#fff5e9", 4.2);
  key.position.set(-4, 9, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 6, bottom: -6, near: 0.5, far: 25 });
  key.shadow.normalBias = 0.035;
  const rim = new THREE.DirectionalLight("#86b4ff", 3.2);
  rim.position.set(5, 4, -5);
  const fill = new THREE.HemisphereLight("#dce6f6", "#11131b", 1.2);
  scene.add(key, rim, fill);
  const textures = [screenTexture()];
  const loader = new THREE.TextureLoader();
  const loaded = await Promise.allSettled(
    ["thinkpad-keyboard-texture"].map((name) => loader.loadAsync(`/models/${name}.webp`)),
  );
  if (loaded.some((result) => result.status === "rejected")) {
    loaded.forEach((result) => {
      if (result.status === "fulfilled") result.value.dispose();
    });
    environment.dispose();
    textures.forEach((texture) => texture.dispose());
    key.dispose();
    rim.dispose();
    throw new Error("Fleet textures unavailable");
  }
  loaded.forEach((result) => textures.push(result.value));
  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  });
  const parts = buildAssemblyModel({
    wallpaper: textures[0],
    keyboard: textures[1],
    internals: textures[1],
  });
  // Concealed boards reuse the atlas without another download and are never rendered.
  parts.internals.visible = false;
  parts.root.traverse((node) => {
    if (node.isMesh && node.material.bumpMap) {
      node.material.color.set("#242932");
      node.material.metalness = 0.2;
      node.material.roughness = 0.48;
    }
  });
  parts.lid.name = "fleet-lid";
  const group = new THREE.Group();
  const machines = [parts.root, parts.root.clone(true), parts.root.clone(true)];
  machines.forEach((machine) => group.add(machine));
  scene.add(group);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 18),
    new THREE.ShadowMaterial({ opacity: 0.3 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.015;
  floor.receiveShadow = true;
  scene.add(floor);
  let current = 0,
    destination = 0,
    hover = 0,
    hoverTarget = 0;

  function draw(delta = 1 / 60, immediate = false) {
    current = immediate ? destination : THREE.MathUtils.damp(current, destination, 5.5, delta);
    hover = immediate ? hoverTarget : THREE.MathUtils.damp(hover, hoverTarget, 8, delta);
    const from = Math.min(3, Math.floor(current));
    const to = Math.min(4, from + 1);
    const mix = THREE.MathUtils.smoothstep(current - from, 0, 1);
    machines.forEach((machine, index) => {
      const a = poses[from][index],
        b = poses[to][index];
      machine.position.set(
        ...a.slice(0, 3).map((value, axis) => THREE.MathUtils.lerp(value, b[axis], mix)),
      );
      machine.rotation.y = THREE.MathUtils.lerp(a[3], b[3], mix);
      machine.getObjectByName("fleet-lid").rotation.x = THREE.MathUtils.lerp(a[4], b[4], mix);
      machine.scale.setScalar(THREE.MathUtils.lerp(a[5], b[5], mix));
    });
    group.rotation.y = hover * 0.09;
    const fit = Math.max(1, 1.1 / camera.aspect);
    camera.position.set(2.8 * fit, 5.1 * fit, 13.2 * fit);
    camera.lookAt(0, 0.7, -0.2);
    renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
  }

  return {
    camera,
    draw,
    setStage(value) {
      destination = THREE.MathUtils.clamp(value, 0, 4);
    },
    setHover(value) {
      hoverTarget = THREE.MathUtils.clamp(value, -1, 1);
    },
    get moving() {
      return Math.abs(current - destination) + Math.abs(hover - hoverTarget) > 0.001;
    },
    get progress() {
      return current;
    },
    dispose() {
      const geometries = new Set(),
        materials = new Set(),
        maps = new Set(textures);
      scene.traverse((node) => {
        if (!node.isMesh) return;
        geometries.add(node.geometry);
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          materials.add(material);
          for (const value of Object.values(material)) if (value?.isTexture) maps.add(value);
        }
        if (node.isInstancedMesh) node.dispose();
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      maps.forEach((texture) => texture.dispose());
      environment.dispose();
      key.dispose();
      rim.dispose();
    },
  };
}
