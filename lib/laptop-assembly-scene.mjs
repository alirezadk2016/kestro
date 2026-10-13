import * as THREE from "three";
import { ConvexHull } from "three/examples/jsm/math/ConvexHull.js";
import { buildAssemblyModel } from "./laptop-assembly-model.mjs";

const clamp = (value) => Math.min(1, Math.max(0, value));
const ease = (value) => value * value * value * (value * (value * 6 - 15) + 10);
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
  renderer.shadowMap.autoUpdate = false;
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
  let pitch = 0.5;
  let targetYaw = yaw;
  let targetPitch = pitch;
  let hoverX = 0,
    hoverY = 0,
    targetHoverX = 0,
    targetHoverY = 0;
  let fitKey = "";
  let distance = 10;
  let fitDistance = distance;
  const hingeAxis = new THREE.Vector3(1, 0, 0);
  const aim = new THREE.Vector3();
  const outward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  const corner = new THREE.Vector3();

  function setProgress(value) {
    const next = clamp(value);
    if (next === current) return;
    current = next;
    renderer.shadowMap.needsUpdate = true;
    const close = range(current, 0.02, 0.2);
    const turn = range(current, 0.22, 0.52);
    const screws = range(current, 0.53, 0.63);
    const coverLift = range(current, 0.6, 0.76);
    const coverPark = range(current, 0.72, 0.86);
    // Close around the hinge before turning the intact device to its service side.
    parts.lid.rotation.x = THREE.MathUtils.lerp(-0.215, Math.PI / 2, close);
    parts.root.rotation.x = Math.PI * turn;
    const turnLift = Math.sin(turn * Math.PI) * 1.16;
    parts.root.position.y = 0.16 * turn + turnLift;
    parts.external.position.z = -range(current, 0.57, 0.7) * 0.56;
    parts.tray.position.set(0, -coverLift * 0.85, coverPark * 2.1);
    parts.tray.rotation.x = -range(current, 0.82, 0.92) * 0.9;
    parts.fasteners.forEach((screw) => {
      screw.position.copy(screw.userData.home);
      screw.position.y -= screws * 0.018;
      screw.position.applyAxisAngle(hingeAxis, parts.tray.rotation.x).add(parts.tray.position);
      screw.rotation.set(parts.tray.rotation.x, screws * Math.PI * 3, 0);
    });
    parts.modules.forEach((module, index) => {
      const offset = index * 0.018;
      const release = range(current, 0.8 + offset, 0.88 + offset);
      const extract = range(current, 0.87 + offset, 0.98 + offset);
      module.position.copy(module.userData.home);
      module.rotation.x = release * 0.32;
      module.position.y += extract * (0.48 + index * 0.12);
      module.position.z -= extract * 0.18;
    });
    parts.ssd.position.set(-range(current, 0.82, 0.91) * 0.13, range(current, 0.9, 1) * 0.48, 0);
    parts.pack.position.set(
      0,
      range(current, 0.85, 0.97) * 0.38,
      range(current, 0.84, 0.94) * 0.12,
    );
    parts.cooling.position.y = range(current, 0.9, 1) * 0.2;
    parts.wifi.position.y = range(current, 0.9, 1) * 0.22;
    floor.position.y = -0.09;
    floor.material.opacity = 0.16;
    aim.set(0, THREE.MathUtils.lerp(0.84, 0.35, turn) + turnLift, 0);
    parts.root.updateMatrixWorld(true);
  }

  const framingPoses = [];
  for (let index = 0; index <= 40; index++) {
    const phase = index / 40;
    setProgress(phase);
    const points = [];
    parts.root.traverse((node) => {
      if (!node.isMesh) return;
      if (node.isInstancedMesh && !node.boundingBox) node.computeBoundingBox();
      if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
      const box = node.isInstancedMesh ? node.boundingBox : node.geometry.boundingBox;
      for (let i = 0; i < 8; i++)
        points.push(
          new THREE.Vector3(
            i & 1 ? box.max.x : box.min.x,
            i & 2 ? box.max.y : box.min.y,
            i & 4 ? box.max.z : box.min.z,
          ).applyMatrix4(node.matrixWorld),
        );
    });
    const hull = new ConvexHull().setFromPoints(points);
    const vertices = new Set();
    for (const face of hull.faces) {
      let edge = face.edge;
      do {
        vertices.add(edge.head().point);
        edge = edge.next;
      } while (edge !== face.edge);
    }
    framingPoses.push({
      points: [...vertices],
      aim: aim.clone(),
      elevation: range(phase, 0.22, 0.52) * 0.28,
    });
  }
  for (const [name, part] of Object.entries(parts)) if (part?.isObject3D) part.name = name;

  function basis(horizontal, vertical) {
    outward.set(
      Math.sin(horizontal) * Math.cos(vertical),
      Math.sin(vertical),
      Math.cos(horizontal) * Math.cos(vertical),
    );
    right.set(Math.cos(horizontal), 0, -Math.sin(horizontal));
    up.crossVectors(outward, right);
  }

  function fit() {
    const key = `${camera.aspect}:${targetYaw}:${targetPitch}`;
    if (key === fitKey) return;
    const initialized = Boolean(fitKey);
    fitKey = key;
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
    fitDistance = 0;
    // One lens distance for the entire sequence prevents scale breathing on teardown.
    for (const pose of framingPoses) {
      basis(targetYaw, targetPitch + pose.elevation);
      for (const point of pose.points) {
        corner.copy(point).sub(pose.aim);
        fitDistance = Math.max(
          fitDistance,
          Math.abs(corner.dot(up)) / tangent + corner.dot(outward),
          Math.abs(corner.dot(right)) / (tangent * camera.aspect) + corner.dot(outward),
        );
      }
    }
    fitDistance *= 1.085;
    if (!initialized) distance = fitDistance;
  }

  function draw(delta = 1 / 60, immediate = false) {
    const dt = Math.max(0, delta);
    yaw = immediate ? targetYaw : THREE.MathUtils.damp(yaw, targetYaw, 12, dt);
    pitch = immediate ? targetPitch : THREE.MathUtils.damp(pitch, targetPitch, 12, dt);
    hoverX = immediate ? targetHoverX : THREE.MathUtils.damp(hoverX, targetHoverX, 10, dt);
    hoverY = immediate ? targetHoverY : THREE.MathUtils.damp(hoverY, targetHoverY, 10, dt);
    fit();
    distance = immediate ? fitDistance : THREE.MathUtils.damp(distance, fitDistance, 9, dt);
    basis(yaw + hoverX * 0.045, pitch + range(current, 0.22, 0.52) * 0.28 + hoverY * 0.025);
    camera.position.copy(aim).addScaledVector(outward, distance);
    camera.lookAt(aim);
    camera.userData.framingDistance = distance;
    renderer.render(scene, camera);
  }
  setProgress(0);
  return {
    camera,
    scene,
    setProgress,
    draw,
    orbitBy(horizontal, vertical) {
      targetYaw += horizontal;
      targetPitch = THREE.MathUtils.clamp(targetPitch + vertical, 0.18, 0.9);
    },
    resetOrbit() {
      targetYaw = 0.34;
      targetPitch = 0.5;
      targetHoverX = targetHoverY = 0;
    },
    setHover(horizontal, vertical) {
      targetHoverX = THREE.MathUtils.clamp(horizontal, -1, 1);
      targetHoverY = THREE.MathUtils.clamp(vertical, -1, 1);
    },
    get moving() {
      return (
        Math.abs(yaw - targetYaw) +
          Math.abs(pitch - targetPitch) +
          Math.abs(hoverX - targetHoverX) +
          Math.abs(hoverY - targetHoverY) +
          Math.abs(distance - fitDistance) >
        0.001
      );
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
