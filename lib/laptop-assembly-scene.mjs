import * as THREE from "three";
import { createLaptopScene } from "./laptop-scene.mjs";

const clamp = (value) => Math.min(1, Math.max(0, value));
const ease = (value) => value * value * (3 - 2 * value);

function finishExterior(root) {
  root.updateMatrixWorld(true);
  root.traverse((mesh) => {
    if (!mesh.isMesh) return;
    const surface = mesh.material;
    if (surface.name === "Material.007") surface.color.set("#46515c");
    if (surface.name === "Material.012") surface.color.set("#303943");
    if (surface.name === "Material.112") surface.color.set("#282d34");
    if (surface.name !== "Material.099") return;

    const image = document.createElement("canvas");
    image.width = 1024;
    image.height = 640;
    const context = image.getContext("2d");
    context.fillStyle = "#050a13";
    context.fillRect(0, 0, image.width, image.height);
    for (let index = 12; index >= 0; index--) {
      context.beginPath();
      context.moveTo(-30, 500 + index * 3);
      context.bezierCurveTo(350, 650, 410, 230, 1060, 180 + index * 3);
      context.strokeStyle = `rgba(38,111,255,${0.035 + (12 - index) * 0.004})`;
      context.lineWidth = 2 + index * 9;
      context.stroke();
    }
    context.beginPath();
    context.moveTo(-30, 500);
    context.bezierCurveTo(350, 650, 410, 230, 1060, 180);
    context.strokeStyle = "#77b2ff";
    context.lineWidth = 2;
    context.stroke();
    const texture = new THREE.CanvasTexture(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    surface.color.set("#ffffff");
    surface.map = surface.emissiveMap = texture;
    surface.emissive.set("#ffffff");
    surface.emissiveIntensity = 0.3;
    surface.metalness = 0;
    surface.roughness = 0.3;

    const bounds = new THREE.Box3().setFromObject(mesh);
    const position = mesh.geometry.attributes.position;
    const coordinates = new Float32Array(position.count * 2);
    const vertex = new THREE.Vector3();
    for (let index = 0; index < position.count; index++) {
      vertex.fromBufferAttribute(position, index).applyMatrix4(mesh.matrixWorld);
      coordinates[index * 2] = 1 - (vertex.z - bounds.min.z) / (bounds.max.z - bounds.min.z);
      coordinates[index * 2 + 1] = (vertex.y - bounds.min.y) / (bounds.max.y - bounds.min.y);
    }
    mesh.geometry.setAttribute("uv", new THREE.BufferAttribute(coordinates, 2));
    surface.needsUpdate = true;
  });
}

function box(parent, material, size, position) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function instances(parent, material, parts) {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material, parts.length);
  const transform = new THREE.Object3D();
  parts.forEach((part, index) => {
    transform.position.set(...part.position);
    transform.scale.set(...part.size);
    transform.rotation.set(0, part.rotation ?? 0, 0);
    transform.updateMatrix();
    mesh.setMatrixAt(index, transform.matrix);
  });
  parent.add(mesh);
  return mesh;
}

function internals(root) {
  const material = (color, metalness = 0.3, roughness = 0.42) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const pcb = material("#234e45", 0.28, 0.55);
  const chip = material("#313c48", 0.15, 0.48);
  const metal = material("#6f7984", 0.78, 0.32);
  const shell = material("#46515c", 0.6, 0.46);
  const gold = material("#b79a57", 0.75, 0.3);
  const copper = material("#b27a50", 0.78, 0.32);
  const battery = material("#283440", 0.2, 0.62);

  const board = new THREE.Group();
  const tray = new THREE.Group();
  root.add(board, tray);
  box(board, pcb, [1.48, 0.045, 4.08], [0.92, 0.12, 0]);

  instances(board, chip, [
    ...[-1.8, -1.43, -1.06, -0.69, -0.32, 0.05].map((z) => ({
      size: [0.23, 0.065, 0.2],
      position: [1.44, 0.17, z],
    })),
    ...[-1.8, -1.44, -1.08, 0.63, 0.99, 1.35, 1.72].map((z) => ({
      size: [0.17, 0.055, 0.16],
      position: [0.29, 0.17, z],
    })),
  ]);
  box(board, metal, [0.43, 0.08, 0.44], [0.79, 0.19, -0.18]);
  box(board, shell, [0.56, 0.035, 0.55], [0.79, 0.25, -0.18]);

  const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.13, 48), shell);
  fan.position.set(0.76, 0.21, -1.32);
  board.add(fan);
  const fanTop = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.02, 48), chip);
  fanTop.position.set(0.76, 0.285, -1.32);
  board.add(fanTop);
  instances(
    board,
    metal,
    Array.from({ length: 16 }, (_, index) => {
      const angle = (index * Math.PI) / 8;
      return {
        size: [0.18, 0.014, 0.025],
        position: [0.76 + Math.cos(angle) * 0.23, 0.302, -1.32 + Math.sin(angle) * 0.23],
        rotation: -angle + 0.5,
      };
    }),
  );
  for (const offset of [-0.06, 0.06]) {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.8 + offset, 0.3, -0.17),
      new THREE.Vector3(1.1 + offset, 0.3, -0.52),
      new THREE.Vector3(1.05 + offset, 0.3, -1.16),
      new THREE.Vector3(0.85 + offset, 0.3, -1.45),
    ]);
    board.add(new THREE.Mesh(new THREE.TubeGeometry(path, 24, 0.035, 8, false), copper));
  }

  for (const x of [0.68, 1.19]) {
    box(board, pcb, [0.39, 0.035, 1.18], [x, 0.2, 0.67]);
    instances(
      board,
      chip,
      Array.from({ length: 4 }, (_, index) => ({
        size: [0.25, 0.05, 0.21],
        position: [x, 0.24, 0.25 + index * 0.27],
      })),
    );
    instances(
      board,
      gold,
      Array.from({ length: 28 }, (_, index) => ({
        size: [0.045, 0.012, 0.018],
        position: [x + 0.172, 0.223, 0.13 + index * 0.039],
      })),
    );
  }
  box(board, pcb, [1.12, 0.035, 0.29], [0.84, 0.2, 1.73]);
  instances(
    board,
    chip,
    [0.46, 0.79, 1.13].map((x) => ({
      size: [0.24, 0.055, 0.22],
      position: [x, 0.245, 1.73],
    })),
  );
  box(board, gold, [0.055, 0.014, 0.22], [1.41, 0.225, 1.73]);

  instances(
    board,
    battery,
    [-1.28, 0, 1.28].map((z) => ({
      size: [0.73, 0.12, 1.22],
      position: [2.12, 0.14, z],
    })),
  );
  instances(
    board,
    metal,
    [-1.8, -0.9, 0, 0.9, 1.8].map((z) => ({
      size: [0.025, 0.045, 0.08],
      position: [1.74, 0.15, z],
    })),
  );

  box(tray, shell, [2.73, 0.055, 4.55], [1.43, -0.055, 0]);
  instances(tray, shell, [
    { size: [2.73, 0.12, 0.045], position: [1.43, 0.025, -2.25] },
    { size: [2.73, 0.12, 0.045], position: [1.43, 0.025, 2.25] },
    { size: [0.045, 0.12, 4.5], position: [0.085, 0.025, 0] },
    { size: [0.045, 0.12, 4.5], position: [2.775, 0.025, 0] },
  ]);
  instances(
    tray,
    chip,
    Array.from({ length: 22 }, (_, index) => ({
      size: [0.55, 0.007, 0.025],
      position: [0.72, -0.02, -1.8 + index * 0.06],
    })),
  );
  for (const x of [0.23, 2.62]) {
    for (const z of [-2.09, 2.09]) {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16), metal);
      screw.position.set(x, 0.02, z);
      tray.add(screw);
    }
  }
  return { board, tray };
}

/** Illustrative internal layers; the catalogue's real model photos stay separate. */
export async function createLaptopAssembly(renderer, view) {
  const assemblyView = {
    ...view,
    exposure: 1.2,
    lights: {
      key: { ...view.lights.key, intensity: 1.6 },
      rim: { ...view.lights.rim, intensity: 0.6 },
      fill: { ...view.lights.fill, color: "#d1d9e4", intensity: 0.25 },
    },
    studio: view.studio.map((panel, index) => ({
      ...panel,
      intensity: panel.intensity * (index === 1 ? 0.45 : 1),
      color: index === 2 ? "#c9d5e6" : panel.color,
    })),
  };
  const laptop = await createLaptopScene(renderer, assemblyView, { spin: false });
  laptop.scene.add(new THREE.HemisphereLight("#edf2fa", "#1a1b20", 1.2));
  const { root, base, lid } = laptop.parts;
  finishExterior(root);
  const baseY = base.position.y;
  const lidY = lid.position.y;
  const { board, tray } = internals(root);

  function setProgress(value, immediate = false) {
    const progress = clamp(value);
    const separation = 1 - ease(clamp((progress - 0.06) / 0.84));
    base.position.y = baseY + separation * 1.08;
    lid.position.y = lidY + separation * 1.95;
    board.position.y = -separation * 0.45;
    board.position.x = separation * 0.55;
    tray.position.y = -separation * 1.75;
    tray.position.x = separation * 0.8;
    board.visible = tray.visible = separation > 0.025;
    laptop.setTarget(
      {
        yaw: 1.12 - separation * 0.28,
        pitch: 0.4 + separation * 0.12,
        distance: 2.5 + separation * 1.9,
        lid: 0,
        lookY: -0.02,
      },
      immediate,
    );
  }

  setProgress(0);
  return {
    ...laptop,
    setProgress,
    dispose() {
      root.traverse((mesh) => {
        if (!mesh.isMesh) return;
        mesh.material.map?.dispose();
        if (mesh.isInstancedMesh) mesh.dispose();
      });
      laptop.dispose();
    },
  };
}
