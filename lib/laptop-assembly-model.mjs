import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

function rounded(parent, material, size, position, radius = 0.018) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 2, radius), material);
  mesh.position.set(...position);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function blocks(parent, material, parts, geometry = new THREE.BoxGeometry(1, 1, 1)) {
  const mesh = new THREE.InstancedMesh(geometry, material, parts.length);
  const transform = new THREE.Object3D();
  parts.forEach(({ position, size, angle = 0 }, index) => {
    transform.position.set(...position);
    transform.scale.set(...size);
    transform.rotation.set(0, angle, 0);
    transform.updateMatrix();
    mesh.setMatrixAt(index, transform.matrix);
  });
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, material, radius, height, position, segments = 40) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, segments),
    material,
  );
  mesh.position.set(...position);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function canvas(width, height, paint) {
  const image = document.createElement("canvas");
  image.width = width;
  image.height = height;
  paint(image.getContext("2d"), width, height);
  const texture = new THREE.CanvasTexture(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function decal(parent, texture, size, position) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(...size),
    new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.08,
      depthWrite: false,
      roughness: 0.65,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function noise() {
  let seed = 41;
  const data = new Uint8Array(256 * 256 * 4);
  for (let index = 0; index < data.length; index += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    data[index] = data[index + 1] = data[index + 2] = 110 + (seed % 37);
    data[index + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, 256, 256);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(48, 48);
  texture.needsUpdate = true;
  return texture;
}

function materials() {
  const standard = (color, metalness, roughness) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness });
  return {
    body: new THREE.MeshPhysicalMaterial({
      color: "#3b3e42",
      metalness: 0.72,
      roughness: 0.34,
      clearcoat: 0.08,
      clearcoatRoughness: 0.38,
      bumpMap: noise(),
      bumpScale: 0.0008,
    }),
    edge: standard("#72777b", 0.94, 0.23),
    dark: standard("#111418", 0.12, 0.48),
    keys: standard("#24282d", 0.05, 0.38),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#272e34",
      metalness: 0.25,
      roughness: 0.26,
      clearcoat: 0.6,
      clearcoatRoughness: 0.21,
    }),
    pcb: standard("#183e32", 0.12, 0.53),
    chip: standard("#1a2021", 0.12, 0.59),
    steel: standard("#9ea6aa", 0.9, 0.25),
    solder: standard("#b3b9b4", 0.86, 0.28),
    copper: standard("#bb7545", 0.94, 0.22),
    gold: standard("#cab46e", 0.88, 0.25),
    battery: standard("#202629", 0.13, 0.53),
    blue: new THREE.MeshStandardMaterial({
      color: "#87baff",
      emissive: "#4a8fff",
      emissiveIntensity: 1.2,
      roughness: 0.23,
    }),
  };
}

function keyboard(parent, m) {
  rounded(parent, m.dark, [2.91, 0.016, 1.09], [0, 0.15, -0.35], 0.055);
  const rows = [
    [["esc", 1], ...Array.from({ length: 12 }, (_, i) => [`F${i + 1}`, 1]), ["del", 1]],
    [
      ["\u00a7", 1],
      ..."1234567890".split("").map((key) => [key, 1]),
      ["+", 1],
      ["\u00b4", 1],
      ["back", 1.5],
    ],
    [
      ["tab", 1.4],
      ..."QWERTYUIOP".split("").map((key) => [key, 1]),
      ["\u00c5", 1],
      ["^", 1],
      ["enter", 1.1],
    ],
    [
      ["caps", 1.65],
      ..."ASDFGHJKL".split("").map((key) => [key, 1]),
      ["\u00c6", 1],
      ["\u00d8", 1],
      ["'", 1],
      ["", 0.85],
    ],
    [
      ["shift", 1.3],
      ["<", 1],
      ..."ZXCVBNM".split("").map((key) => [key, 1]),
      [",", 1],
      [".", 1],
      ["-", 1],
      ["shift", 2.2],
    ],
    [
      ["ctrl", 1.3],
      ["fn", 1],
      ["win", 1],
      ["alt", 1],
      ["", 5.7],
      ["alt gr", 1.3],
      ["\u2190", 1],
      ["\u2191\u2193", 1],
      ["\u2192", 1],
    ],
  ];
  const keys = [],
    legends = [];
  for (let row = 0; row < rows.length; row++) {
    const unit = 2.81 / rows[row].reduce((sum, [, width]) => sum + width, 0);
    let x = -1.405;
    for (const [text, width] of rows[row]) {
      const span = width * unit;
      const z = row === 0 ? -0.816 : -0.674 + (row - 1) * 0.185;
      keys.push({
        size: [span - 0.021, 0.033, row === 0 ? 0.095 : 0.151],
        position: [x + span / 2, 0.173, z],
      });
      legends.push({ text, x: x + span / 2, z, row });
      x += span;
    }
  }
  blocks(parent, m.keys, keys, new RoundedBoxGeometry(1, 1, 1, 2, 0.065));
  const texture = canvas(3072, 1200, (context, width, height) => {
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (const key of legends) {
      context.font = `${key.row === 0 || key.text.length > 2 ? 21 : 28}px Arial, sans-serif`;
      context.fillStyle = key.row === 0 ? "#bac3cb" : "#e2e7eb";
      context.fillText(
        key.text,
        ((key.x + 1.455) / 2.91) * width,
        ((key.z + 0.895) / 1.09) * height,
      );
    }
  });
  decal(parent, texture, [2.91, 1.09], [0, 0.1901, -0.35]);
  rounded(parent, m.edge, [1.15, 0.01, 0.665], [0, 0.146, 0.655], 0.04);
  rounded(parent, m.glass, [1.13, 0.012, 0.645], [0, 0.152, 0.655], 0.037);
  blocks(
    parent,
    m.dark,
    [-1, 1].flatMap((side) =>
      Array.from({ length: 37 }, (_, index) => ({
        size: [0.017, 0.003, 0.008],
        position: [side * 1.526, 0.146, -0.87 + index * 0.029],
      })),
    ),
  );
  cylinder(parent, m.dark, 0.028, 0.007, [1.51, 0.15, -0.987]);
  cylinder(parent, m.blue, 0.006, 0.008, [1.51, 0.154, -0.987], 16);
}

function ports(parent, m) {
  for (const side of [-1, 1]) {
    for (const [z, width, height] of [
      [-0.67, 0.19, 0.045],
      [-0.27, 0.19, 0.045],
      [0.18, 0.12, 0.033],
    ]) {
      rounded(
        parent,
        m.edge,
        [0.009, height + 0.012, width + 0.014],
        [side * 1.647, 0.048, z],
        0.006,
      );
      rounded(parent, m.dark, [0.012, height, width], [side * 1.653, 0.048, z], 0.006);
      blocks(
        parent,
        m.gold,
        Array.from({ length: 5 }, (_, i) => ({
          size: [0.004, 0.006, 0.011],
          position: [side * 1.66, 0.039, z - width * 0.3 + i * width * 0.15],
        })),
      );
    }
  }
  rounded(parent, m.dark, [0.008, 0.048, 0.23], [-1.653, 0.047, 0.57], 0.008);
  rounded(parent, m.edge, [0.004, 0.008, 0.18], [-1.66, 0.04, 0.57], 0.003);
  const jack = cylinder(parent, m.dark, 0.022, 0.008, [1.654, 0.047, 0.58], 24);
  jack.rotation.z = Math.PI / 2;
}

function display(m, wallpaper) {
  const lid = new THREE.Group();
  lid.position.set(0, 0.15, -1.025);
  lid.rotation.x = -0.215;
  rounded(lid, m.body, [3.3, 2.08, 0.065], [0, 1.04, 0], 0.055);
  rounded(lid, m.edge, [3.294, 2.074, 0.006], [0, 1.04, 0.029], 0.053);
  rounded(lid, m.dark, [3.276, 2.056, 0.008], [0, 1.04, 0.035], 0.052);
  const screen = new THREE.MeshPhysicalMaterial({
    map: wallpaper,
    emissiveMap: wallpaper,
    emissive: "#ffffff",
    emissiveIntensity: 0.65,
    roughness: 0.26,
    metalness: 0,
    clearcoat: 0.85,
    clearcoatRoughness: 0.16,
    envMapIntensity: 0.35,
  });
  rounded(lid, screen, [3.09, 1.825, 0.004], [0, 1.075, 0.042], 0.018).castShadow = false;
  const camera = new THREE.Mesh(new THREE.CircleGeometry(0.018, 32), m.dark);
  camera.position.set(0, 2.027, 0.045);
  lid.add(camera);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.008, 24), m.glass);
  lens.position.set(0, 2.027, 0.046);
  lid.add(lens);
  rounded(lid, m.keys, [0.093, 0.012, 0.002], [0.087, 2.027, 0.046], 0.004);
  rounded(lid, m.edge, [0.027, 0.012, 0.003], [0.112, 2.027, 0.047], 0.004);
  return lid;
}

function screws(parent, m, positions) {
  for (const [x, y, z] of positions) {
    cylinder(parent, m.dark, 0.039, 0.008, [x, y, z], 24);
    cylinder(parent, m.steel, 0.027, 0.011, [x, y + 0.004, z], 24);
  }
  blocks(
    parent,
    m.dark,
    positions.flatMap(([x, y, z]) => [
      { size: [0.027, 0.002, 0.005], position: [x, y + 0.011, z] },
      { size: [0.005, 0.002, 0.027], position: [x, y + 0.011, z] },
    ]),
  );
}

function motherboard(m) {
  const board = new THREE.Group();
  rounded(board, m.pcb, [3.02, 0.029, 0.99], [0, 0.025, -0.49], 0.035);
  const trace = canvas(2048, 768, (context, width, height) => {
    context.strokeStyle = "rgba(138,175,128,0.37)";
    context.lineWidth = 1.3;
    for (let i = 0; i < 260; i++) {
      const x = (i * 137 + 19) % width,
        y = (i * 83 + 29) % height,
        dx = 30 + (i % 7) * 11;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + dx, y);
      context.lineTo(x + dx + 17, y + 17);
      context.lineTo(x + dx + 17, y + 33 + (i % 5) * 13);
      context.stroke();
    }
    context.font = "11px monospace";
    context.fillStyle = "rgba(222,232,213,0.65)";
    for (let i = 0; i < 90; i++)
      context.fillText(`R${100 + i}`, (i * 151 + 12) % width, (i * 89 + 29) % height);
    context.font = "17px monospace";
    context.fillText("SYSTEM BOARD  /  REV 2.0", 1060, 705);
  });
  decal(board, trace, [2.98, 0.96], [0, 0.0402, -0.49]);
  const components = [],
    pads = [];
  for (let i = 0; i < 250; i++) {
    const x = -1.42 + ((i * 0.173) % 2.84),
      z = -0.93 + ((i * 0.127) % 0.86);
    if ((x < -0.62 && z < -0.14) || (x > 0 && x < 1.04) || x > 1.12) continue;
    const length = 0.026 + (i % 3) * 0.008;
    components.push({ size: [length, 0.014, 0.016], position: [x, 0.052, z] });
    for (const offset of [-1, 1])
      pads.push({ size: [0.009, 0.007, 0.019], position: [x + offset * length * 0.6, 0.047, z] });
  }
  blocks(board, m.chip, components);
  blocks(board, m.solder, pads);
  blocks(board, m.chip, [
    { size: [0.32, 0.04, 0.28], position: [-0.28, 0.073, -0.45] },
    { size: [0.19, 0.035, 0.18], position: [-0.29, 0.067, -0.81] },
    { size: [0.14, 0.03, 0.12], position: [-0.34, 0.063, -0.17] },
  ]);
  rounded(board, m.steel, [0.29, 0.025, 0.25], [-0.28, 0.107, -0.45], 0.011);
  screws(board, m, [
    [-1.41, 0.05, -0.88],
    [1.42, 0.05, -0.87],
    [-1.41, 0.05, -0.12],
    [1.42, 0.05, -0.12],
  ]);
  const fan = new THREE.Group();
  fan.position.set(-0.98, 0.05, -0.55);
  board.add(fan);
  rounded(fan, m.dark, [0.65, 0.065, 0.65], [0, 0.032, 0], 0.085);
  cylinder(fan, m.chip, 0.28, 0.014, [0, 0.073, 0], 64);
  blocks(
    fan,
    m.keys,
    Array.from({ length: 39 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 39;
      return {
        size: [0.158, 0.019, 0.012],
        position: [Math.cos(angle) * 0.174, 0.087, Math.sin(angle) * 0.174],
        angle: -angle + 0.55,
      };
    }),
  );
  cylinder(fan, m.steel, 0.082, 0.018, [0, 0.093, 0], 48);
  cylinder(fan, m.dark, 0.042, 0.02, [0, 0.095, 0], 32);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.284, 0.009, 8, 64), m.edge);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.094;
  fan.add(ring);
  for (const offset of [-0.038, 0.038]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.27, 0.125, -0.45 + offset),
      new THREE.Vector3(-0.53, 0.13, -0.5 + offset),
      new THREE.Vector3(-0.57, 0.13, -0.86 + offset),
      new THREE.Vector3(-0.93, 0.125, -0.91 + offset),
    ]);
    const pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.023, 10, false), m.copper);
    pipe.castShadow = true;
    board.add(pipe);
  }
  blocks(
    board,
    m.steel,
    Array.from({ length: 25 }, (_, i) => ({
      size: [0.009, 0.09, 0.12],
      position: [-1.23 + i * 0.019, 0.09, -0.93],
    })),
  );
  return board;
}

function memory(m) {
  const ram = new THREE.Group();
  for (const z of [-0.71, -0.31]) {
    rounded(ram, m.dark, [1.13, 0.018, 0.33], [0.46, 0.063, z], 0.012);
    rounded(ram, m.pcb, [1.03, 0.021, 0.286], [0.46, 0.084, z], 0.01);
    blocks(
      ram,
      m.chip,
      Array.from({ length: 8 }, (_, i) => ({
        size: [0.105, 0.021, 0.09],
        position: [0.055 + (i % 4) * 0.266, 0.105, z - 0.059 + Math.floor(i / 4) * 0.118],
      })),
    );
    blocks(
      ram,
      m.gold,
      Array.from({ length: 42 }, (_, i) => ({
        size: [0.013, 0.003, 0.034],
        position: [-0.03 + i * 0.0235, 0.097, z + 0.137],
      })),
    );
    blocks(
      ram,
      m.steel,
      [-0.09, 1.01].map((x) => ({ size: [0.025, 0.027, 0.13], position: [x, 0.084, z] })),
    );
  }
  return ram;
}

function storage(m) {
  const ssd = new THREE.Group();
  rounded(ssd, m.pcb, [0.228, 0.021, 0.77], [1.225, 0.068, -0.49], 0.012);
  blocks(
    ssd,
    m.chip,
    [-0.7, -0.47, -0.24].map((z) => ({ size: [0.17, 0.028, 0.16], position: [1.225, 0.093, z] })),
  );
  blocks(
    ssd,
    m.gold,
    Array.from({ length: 9 }, (_, i) => ({
      size: [0.011, 0.004, 0.046],
      position: [1.132 + i * 0.023, 0.081, -0.88],
    })),
  );
  const label = canvas(256, 768, (context, width, height) => {
    context.fillStyle = "#d8dcd9";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#23332d";
    context.font = "bold 39px Arial";
    context.fillText("NVMe", 20, 63);
    context.font = "19px monospace";
    context.fillText("SOLID STATE", 20, 102);
    context.fillText("M.2 / PCIe", 20, 132);
    for (let i = 0; i < 63; i++) context.fillRect(22 + i * 3.3, 175, i % 3 ? 1 : 2, 47);
    context.font = "15px monospace";
    context.fillText("STORAGE MODULE", 20, 257);
    context.strokeStyle = "#667a70";
    for (let i = 0; i < 12; i++) {
      context.beginPath();
      context.moveTo(20, 300 + i * 22);
      context.lineTo(width - 20 - (i % 3) * 15, 300 + i * 22);
      context.stroke();
    }
  });
  decal(ssd, label, [0.196, 0.65], [1.225, 0.109, -0.46]);
  screws(ssd, m, [[1.225, 0.077, -0.085]]);
  return ssd;
}

function battery(m) {
  const pack = new THREE.Group();
  rounded(pack, m.dark, [2.97, 0.024, 0.89], [0, 0.018, 0.58], 0.035);
  for (const x of [-0.963, 0, 0.963]) {
    rounded(pack, m.battery, [0.94, 0.074, 0.805], [x, 0.059, 0.58], 0.032);
    rounded(pack, m.dark, [0.91, 0.004, 0.029], [x, 0.095, 0.215], 0.004);
    rounded(pack, m.dark, [0.91, 0.004, 0.029], [x, 0.095, 0.946], 0.004);
  }
  const label = canvas(1536, 384, (context, width) => {
    context.fillStyle = "#a9b0b4";
    context.font = "27px Arial";
    context.fillText("RECHARGEABLE LITHIUM-ION BATTERY", 35, 64);
    context.font = "19px monospace";
    context.fillText("Li-ion  /  HANDLE WITH CARE", 35, 104);
    for (let i = 0; i < 6; i++)
      context.fillText("Do not puncture. Disconnect before service.", 35, 159 + i * 22);
    context.font = "21px monospace";
    context.fillText("+", width - 69, 58);
    context.fillText("-", width - 35, 58);
  });
  decal(pack, label, [2.62, 0.64], [0, 0.097, 0.58]);
  rounded(pack, m.dark, [0.18, 0.028, 0.18], [0.08, 0.055, 0.08], 0.005);
  blocks(
    pack,
    m.copper,
    Array.from({ length: 5 }, (_, i) => ({
      size: [0.008, 0.006, 0.12],
      position: [0.028 + i * 0.022, 0.073, 0.08],
    })),
  );
  return pack;
}

function bottom(m) {
  const tray = new THREE.Group();
  rounded(tray, m.body, [3.29, 0.035, 2.21], [0, -0.062, 0], 0.012);
  rounded(tray, m.dark, [3.13, 0.012, 2.06], [0, -0.04, 0], 0.04);
  blocks(
    tray,
    m.body,
    [-1, 1].flatMap((side) => [
      { size: [3.15, 0.043, 0.026], position: [0, -0.024, side * 1.06] },
      { size: [0.026, 0.043, 2.1], position: [side * 1.59, -0.024, 0] },
    ]),
  );
  blocks(
    tray,
    m.body,
    Array.from({ length: 5 }, (_, i) => ({
      size: [0.018, 0.018, 1.88],
      position: [-1.2 + i * 0.6, -0.021, 0],
    })),
  );
  blocks(
    tray,
    m.dark,
    Array.from({ length: 22 }, (_, i) => ({
      size: [0.64, 0.004, 0.012],
      position: [-0.94, -0.031, -0.87 + i * 0.024],
    })),
  );
  screws(
    tray,
    m,
    [-1, 1].flatMap((side) => [-0.96, 0, 0.96].map((z) => [side * 1.52, -0.017, z])),
  );
  for (const x of [-1.15, 1.15])
    for (const z of [-0.89, 0.89])
      rounded(tray, m.dark, [0.33, 0.026, 0.08], [x, -0.093, z], 0.028);
  return tray;
}

/** Detailed illustrative hardware; the actual catalogue model stays independent. */
export function buildAssemblyModel(wallpaper) {
  const m = materials();
  const root = new THREE.Group(),
    deck = new THREE.Group();
  rounded(deck, m.body, [3.3, 0.12, 2.22], [0, 0.074, 0], 0.022);
  rounded(deck, m.edge, [3.293, 0.008, 2.214], [0, 0.133, 0], 0.052);
  rounded(deck, m.body, [3.275, 0.009, 2.197], [0, 0.139, 0], 0.05);
  keyboard(deck, m);
  ports(deck, m);
  for (const x of [-1.1, 1.1]) {
    const hinge = cylinder(deck, m.edge, 0.043, 0.35, [x, 0.14, -1.025]);
    hinge.rotation.z = Math.PI / 2;
  }
  const lid = display(m, wallpaper),
    board = motherboard(m),
    ram = memory(m),
    ssd = storage(m),
    pack = battery(m),
    tray = bottom(m);
  root.add(deck, lid, board, ram, ssd, pack, tray);
  return { root, deck, lid, board, ram, ssd, pack, tray };
}
