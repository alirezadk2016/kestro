import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { buildKeyboard } from "./laptop-keyboard.mjs";

function rounded(parent, material, size, position, radius = 0.015) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 2, radius), material);
  mesh.position.set(...position);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function blocks(parent, material, parts) {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material, parts.length);
  const transform = new THREE.Object3D();
  parts.forEach((part, index) => {
    transform.position.set(...part.position);
    transform.scale.set(...part.size);
    transform.rotation.set(0, part.angle ?? 0, 0);
    transform.updateMatrix();
    mesh.setMatrixAt(index, transform.matrix);
  });
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, material, radius, height, position, segments = 32) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, segments),
    material,
  );
  mesh.position.set(...position);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function rectangle(path, x, y, width, depth, radius) {
  const a = x - width / 2,
    b = y - depth / 2,
    r = Math.min(radius, width / 2, depth / 2);
  path.moveTo(a + r, b);
  path.lineTo(a + width - r, b);
  path.quadraticCurveTo(a + width, b, a + width, b + r);
  path.lineTo(a + width, b + depth - r);
  path.quadraticCurveTo(a + width, b + depth, a + width - r, b + depth);
  path.lineTo(a + r, b + depth);
  path.quadraticCurveTo(a, b + depth, a, b + depth - r);
  path.lineTo(a, b + r);
  path.quadraticCurveTo(a, b, a + r, b);
  return path;
}

function plate(parent, material, width, depth, thickness, y, holes = []) {
  const shape = rectangle(new THREE.Shape(), 0, 0, width, depth, 0.045);
  for (const hole of holes)
    shape.holes.push(rectangle(new THREE.Path(), hole[0], -hole[1], hole[2], hole[3], 0.025));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 8,
  });
  geometry.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = y;
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

function decal(parent, texture, size, position, points) {
  const geometry = new THREE.PlaneGeometry(...size);
  if (points) {
    const uv = geometry.attributes.uv;
    points.forEach(([x, y], i) => uv.setXY(i, x / 1536, 1 - y / 1024));
  }
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.05,
    depthWrite: false,
    roughness: 0.7,
    metalness: 0.04,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function materials() {
  const grain = canvas(256, 256, (context, w, h) => {
    const pixels = context.createImageData(w, h);
    let seed = 41;
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 110 + (seed % 35);
      pixels.data[i + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
  });
  grain.colorSpace = THREE.NoColorSpace;
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(48, 48);
  const standard = (color, metalness, roughness) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness });
  return {
    body: new THREE.MeshStandardMaterial({
      color: "#202123",
      metalness: 0.06,
      roughness: 0.58,
      bumpMap: grain,
      bumpScale: 0.0012,
    }),
    edge: standard("#242628", 0.3, 0.45),
    dark: standard("#0c0e10", 0.05, 0.67),
    keys: standard("#181a1c", 0.03, 0.67),
    pad: standard("#202225", 0.05, 0.69),
    pcb: standard("#193d31", 0.12, 0.58),
    chip: standard("#171b1d", 0.08, 0.68),
    steel: standard("#8d969d", 0.82, 0.32),
    solder: standard("#b6bab6", 0.86, 0.28),
    copper: standard("#b77a48", 0.88, 0.3),
    gold: standard("#c0a964", 0.86, 0.3),
    battery: standard("#181d20", 0.08, 0.74),
    red: standard("#bd1d2c", 0.03, 0.72),
    lens: new THREE.MeshPhysicalMaterial({
      color: "#10262e",
      metalness: 0.12,
      roughness: 0.12,
      clearcoat: 0.7,
    }),
  };
}

function ports(root, m) {
  for (const [side, z, width, height] of [
    [-1, -0.91, 0.095, 0.03],
    [-1, -0.7, 0.095, 0.03],
    [-1, -0.43, 0.18, 0.04],
    [1, -0.8, 0.26, 0.014],
    [1, -0.51, 0.18, 0.095],
    [1, -0.18, 0.17, 0.052],
    [1, 0.13, 0.19, 0.049],
    [1, 0.45, 0.17, 0.052],
  ]) {
    rounded(root, m.steel, [0.008, height + 0.008, width + 0.01], [side * 1.681, 0.027, z], 0.004);
    rounded(root, m.dark, [0.012, height, width], [side * 1.687, 0.027, z], 0.004);
    if (height > 0.02)
      blocks(
        root,
        m.gold,
        Array.from({ length: 5 }, (_, i) => ({
          size: [0.004, 0.005, 0.008],
          position: [side * 1.694, 0.022, z - width * 0.3 + i * width * 0.15],
        })),
      );
  }
  const jack = cylinder(root, m.dark, 0.023, 0.01, [1.686, 0.028, 0.73], 24);
  jack.rotation.z = Math.PI / 2;
}

function display(m, wallpaper) {
  const lid = new THREE.Group();
  lid.position.set(0, 0.151, -1.09);
  lid.rotation.x = -0.215;
  const cover = new THREE.Group();
  const bezel = new THREE.Group();
  const lcd = new THREE.Group();
  const camera = new THREE.Group();
  rounded(cover, m.body, [3.37, 2.12, 0.045], [0, 1.06, -0.004], 0.021);
  const outer = rectangle(new THREE.Shape(), 0, 1.06, 3.355, 2.105, 0.034);
  outer.holes.push(rectangle(new THREE.Path(), 0, 1.153, 3.08, 1.734, 0.012));
  const front = new THREE.Mesh(
    new THREE.ExtrudeGeometry(outer, { depth: 0.009, bevelEnabled: false, curveSegments: 10 }),
    m.dark,
  );
  front.position.z = 0.02;
  front.castShadow = front.receiveShadow = true;
  bezel.add(front);
  const screenMaterial = new THREE.MeshPhysicalMaterial({
    map: wallpaper,
    emissiveMap: wallpaper,
    emissive: "#ffffff",
    emissiveIntensity: 0.48,
    roughness: 0.31,
    metalness: 0,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
    envMapIntensity: 0.2,
  });
  rounded(lcd, screenMaterial, [3.08, 1.734, 0.006], [0, 1.153, 0.026], 0.01).castShadow = false;
  const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.012, 24), m.lens);
  pupil.position.set(0, 2.063, 0.038);
  camera.add(pupil);
  rounded(camera, m.keys, [0.09, 0.018, 0.006], [0.04, 2.063, 0.036], 0.007);
  rounded(camera, m.edge, [0.027, 0.017, 0.008], [0.065, 2.063, 0.039], 0.004);
  lid.add(cover, bezel, lcd, camera);
  return { lid, cover, bezel, lcd, camera };
}

function motherboard(m) {
  const board = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(-1.5, 0.98);
  shape.lineTo(1.5, 0.98);
  shape.lineTo(1.5, 0.9);
  shape.lineTo(0.66, 0.9);
  shape.lineTo(0.66, 0.06);
  shape.lineTo(0.4, 0.06);
  shape.lineTo(0.4, -0.08);
  shape.lineTo(-0.45, -0.08);
  shape.lineTo(-0.45, 0.15);
  shape.lineTo(-1.5, 0.15);
  shape.closePath();
  const pcbGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.025,
    bevelEnabled: false,
    curveSegments: 18,
  });
  pcbGeometry.rotateX(-Math.PI / 2);
  const pcbMesh = new THREE.Mesh(pcbGeometry, m.pcb);
  pcbMesh.position.y = 0.025;
  pcbMesh.castShadow = pcbMesh.receiveShadow = true;
  board.add(pcbMesh);
  const trace = canvas(2048, 768, (ctx, w, h) => {
    ctx.strokeStyle = "rgba(139,166,126,0.4)";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 360; i++) {
      const x = (i * 137 + 19) % w,
        y = (i * 83 + 29) % h,
        dx = 25 + (i % 7) * 11;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx, y);
      ctx.lineTo(x + dx + 15, y + 15);
      ctx.lineTo(x + dx + 15, y + 40);
      ctx.stroke();
    }
    ctx.font = "11px monospace";
    ctx.fillStyle = "rgba(221,229,211,0.65)";
    for (let i = 0; i < 110; i++)
      ctx.fillText(`R${100 + i}`, (i * 151 + 12) % w, (i * 89 + 29) % h);
  });
  decal(board, trace, [1.83, 0.74], [-0.56, 0.0505, -0.56]);
  const chips = [],
    pads = [];
  for (let i = 0; i < 300; i++) {
    const x = -1.42 + ((i * 0.173) % 2.84),
      z = -0.94 + ((i * 0.127) % 0.88);
    if ((x > 0.62 && z > -0.85) || (x > -0.45 && x < 0.65 && z > -0.62) || (x < -0.65 && z > -0.26))
      continue;
    const length = 0.022 + (i % 4) * 0.008;
    chips.push({ size: [length, 0.014, 0.016], position: [x, 0.061, z] });
    for (const offset of [-1, 1])
      pads.push({ size: [0.009, 0.007, 0.019], position: [x + offset * length * 0.6, 0.056, z] });
  }
  blocks(board, m.chip, chips);
  blocks(board, m.solder, pads);
  rounded(board, m.chip, [0.33, 0.025, 0.29], [-0.2, 0.069, -0.75], 0.006);
  rounded(board, m.steel, [0.27, 0.022, 0.24], [-0.2, 0.092, -0.75], 0.009);
  const fan = new THREE.Group();
  fan.position.set(1.04, 0.045, -0.55);
  rounded(fan, m.dark, [0.65, 0.055, 0.65], [0, 0.028, 0], 0.055);
  cylinder(fan, m.chip, 0.278, 0.013, [0, 0.065, 0], 64);
  blocks(
    fan,
    m.keys,
    Array.from({ length: 43 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 43;
      return {
        size: [0.163, 0.016, 0.009],
        position: [Math.cos(angle) * 0.176, 0.078, Math.sin(angle) * 0.176],
        angle: -angle + 0.5,
      };
    }),
  );
  cylinder(fan, m.dark, 0.079, 0.019, [0, 0.081, 0], 48);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.283, 0.009, 8, 64), m.edge);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.089;
  fan.add(ring);
  const cooling = new THREE.Group();
  rounded(cooling, m.copper, [0.32, 0.014, 0.26], [-0.2, 0.108, -0.75], 0.008);
  const pipePath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 0.12, -0.75),
    new THREE.Vector3(0.18, 0.12, -0.87),
    new THREE.Vector3(0.71, 0.12, -0.88),
    new THREE.Vector3(1.31, 0.12, -0.85),
    new THREE.Vector3(1.41, 0.12, -0.57),
  ]);
  const pipe = new THREE.Mesh(new THREE.TubeGeometry(pipePath, 48, 0.025, 12, false), m.copper);
  pipe.castShadow = true;
  cooling.add(pipe);
  blocks(
    cooling,
    m.copper,
    Array.from({ length: 30 }, (_, i) => ({
      size: [0.105, 0.084, 0.007],
      position: [1.43, 0.075, -0.85 + i * 0.02],
    })),
  );
  const wifi = new THREE.Group();
  rounded(wifi, m.pcb, [0.23, 0.022, 0.31], [-0.95, 0.07, -0.69], 0.009);
  rounded(wifi, m.steel, [0.18, 0.01, 0.21], [-0.95, 0.088, -0.67], 0.004);
  for (const dz of [0, 0.045]) {
    const line = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.02, 0.1, -0.83 + dz),
      new THREE.Vector3(-1.28, 0.11, -0.92 + dz),
      new THREE.Vector3(-1.45, 0.11, -1.05 + dz),
    ]);
    wifi.add(new THREE.Mesh(new THREE.TubeGeometry(line, 20, 0.006, 6, false), m.dark));
  }
  const coin = new THREE.Group();
  cylinder(coin, m.dark, 0.079, 0.018, [0.66, 0.057, -0.11], 32);
  board.add(fan, cooling, wifi, coin);
  return { board, fan, cooling, wifi, coin };
}

function memory(m, photo) {
  const ram = new THREE.Group();
  const modules = [];
  for (const [index, z] of [-0.42, -0.08].entries()) {
    const module = new THREE.Group();
    module.position.set(0.1, 0.077, z + 0.137);
    module.userData.home = module.position.clone();
    rounded(module, m.pcb, [1.03, 0.021, 0.286], [0, 0, -0.137], 0.01);
    blocks(
      module,
      m.chip,
      Array.from({ length: 4 }, (_, i) => ({
        size: [0.17, 0.025, 0.15],
        position: [-0.39 + i * 0.26, 0.023, -0.142],
      })),
    );
    blocks(
      module,
      m.gold,
      Array.from({ length: 42 }, (_, i) => ({
        size: [0.013, 0.003, 0.034],
        position: [-0.49 + i * 0.0235, 0.013, 0],
      })),
    );
    decal(
      module,
      photo,
      [0.99, 0.245],
      [0, 0.036, -0.137],
      index === 0
        ? [
            [645, 486],
            [819, 525],
            [631, 536],
            [805, 576],
          ]
        : [
            [629, 536],
            [805, 576],
            [614, 586],
            [788, 628],
          ],
    );
    rounded(ram, m.dark, [1.12, 0.016, 0.33], [0.1, 0.056, z], 0.01);
    blocks(
      ram,
      m.steel,
      [-0.45, 0.65].map((x) => ({ size: [0.026, 0.026, 0.13], position: [x, 0.074, z] })),
    );
    ram.add(module);
    modules.push(module);
  }
  return { ram, modules };
}

function storage(m, photo) {
  const caddy = new THREE.Group(),
    ssd = new THREE.Group();
  rounded(caddy, m.steel, [0.83, 0.028, 0.92], [-1.02, 0.043, -0.34], 0.014);
  rounded(caddy, m.dark, [0.71, 0.018, 0.8], [-1.02, 0.064, -0.34], 0.01);
  rounded(ssd, m.pcb, [0.7, 0.021, 0.225], [-1.02, 0.083, -0.34], 0.008);
  blocks(
    ssd,
    m.chip,
    [-1.23, -0.99, -0.75].map((x) => ({ size: [0.19, 0.022, 0.16], position: [x, 0.104, -0.34] })),
  );
  decal(
    ssd,
    photo,
    [0.68, 0.213],
    [-1.02, 0.117, -0.34],
    [
      [332, 507],
      [510, 548],
      [319, 551],
      [498, 589],
    ],
  );
  const cable = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.008, 0.27), m.dark);
  cable.position.set(-0.58, 0.066, -0.13);
  caddy.add(cable);
  return { caddy, ssd };
}

function battery(m) {
  const pack = new THREE.Group();
  rounded(pack, m.dark, [2.55, 0.022, 0.75], [0.1, 0.015, 0.69], 0.025);
  rounded(pack, m.battery, [1.23, 0.075, 0.69], [-0.54, 0.056, 0.69], 0.025);
  rounded(pack, m.battery, [1.23, 0.075, 0.69], [0.74, 0.056, 0.69], 0.025);
  rounded(pack, m.dark, [0.07, 0.009, 0.69], [0.1, 0.097, 0.69], 0.002);
  rounded(pack, m.dark, [0.17, 0.025, 0.18], [0.06, 0.054, 0.24], 0.005);
  const external = new THREE.Group();
  rounded(external, m.battery, [2.69, 0.08, 0.34], [0, 0.005, -1.035], 0.035);
  return { pack, external };
}

function speakers(m) {
  return [-1, 1].map((side) => {
    const root = new THREE.Group();
    rounded(root, m.dark, [0.27, 0.075, 0.35], [side * 1.45, 0.04, 0.82], 0.018);
    rounded(root, m.edge, [0.19, 0.008, 0.23], [side * 1.45, 0.083, 0.82], 0.03);
    blocks(
      root,
      m.chip,
      Array.from({ length: 9 }, (_, i) => ({
        size: [0.012, 0.002, 0.19],
        position: [side * 1.45 - 0.072 + i * 0.018, 0.089, 0.82],
      })),
    );
    return root;
  });
}

function fasteners(m) {
  return [-1, 1].flatMap((side) =>
    [-0.98, 0, 0.98].map((z) => {
      const root = new THREE.Group();
      root.position.set(side * 1.56, -0.03, z);
      root.userData.home = root.position.clone();
      cylinder(root, m.steel, 0.022, 0.022, [0, 0, 0], 24);
      blocks(root, m.dark, [
        { size: [0.023, 0.002, 0.004], position: [0, -0.012, 0] },
        { size: [0.004, 0.002, 0.023], position: [0, -0.012, 0] },
      ]);
      return root;
    }),
  );
}

/** Independent illustrative assemblies; photographs and catalogue GLBs remain untouched. */
export function buildAssemblyModel(textures) {
  const m = materials(),
    root = new THREE.Group(),
    deck = new THREE.Group(),
    chassis = new THREE.Group(),
    tray = new THREE.Group();
  plate(chassis, m.body, 3.37, 2.32, 0.065, -0.005, [[0, 0, 3.23, 2.18]]);
  ports(chassis, m);
  plate(deck, m.body, 3.37, 2.32, 0.014, 0.06, [
    [0, -0.33, 2.97, 1.17],
    [-0.1, 0.725, 1.11, 0.69],
  ]);
  const keyboard = buildKeyboard(textures.keyboard, m);
  const touchpad = new THREE.Group(),
    buttons = new THREE.Group(),
    trackpoint = new THREE.Group();
  rounded(touchpad, m.dark, [1.1, 0.01, 0.68], [-0.1, 0.078, 0.725], 0.015);
  rounded(touchpad, m.pad, [1.075, 0.004, 0.654], [-0.1, 0.086, 0.725], 0.012);
  for (const [x, width] of [
    [-0.47, 0.37],
    [-0.1, 0.32],
    [0.27, 0.37],
  ]) {
    rounded(buttons, m.keys, [width, 0.022, 0.12], [x, 0.091, 0.32], 0.009);
    if (x !== -0.1)
      rounded(buttons, m.red, [width - 0.025, 0.002, 0.009], [x, 0.103, 0.378], 0.002);
  }
  cylinder(trackpoint, m.dark, 0.038, 0.008, [-0.14, 0.106, -0.226]);
  cylinder(trackpoint, m.red, 0.032, 0.012, [-0.14, 0.113, -0.226]);
  cylinder(deck, m.dark, 0.035, 0.006, [1.51, 0.077, -0.96]);
  rounded(deck, m.dark, [0.115, 0.008, 0.15], [1.49, 0.078, 0.58], 0.008);
  const hinges = new THREE.Group();
  for (const x of [-1.13, 1.13]) {
    rounded(hinges, m.body, [0.29, 0.08, 0.1], [x, 0.107, -1.09], 0.012);
    const hinge = cylinder(hinges, m.steel, 0.032, 0.31, [x, 0.151, -1.09]);
    hinge.rotation.z = Math.PI / 2;
  }
  const displayParts = display(m, textures.wallpaper),
    boardParts = motherboard(m),
    memoryParts = memory(m, textures.internals),
    storageParts = storage(m, textures.internals),
    batteryParts = battery(m);
  rounded(tray, m.body, [3.355, 0.022, 2.305], [0, -0.026, 0], 0.009);
  rounded(tray, m.body, [3.19, 0.008, 2.14], [0, -0.011, 0], 0.016);
  blocks(
    tray,
    m.edge,
    Array.from({ length: 5 }, (_, i) => ({
      size: [0.018, 0.008, 1.99],
      position: [-1.22 + i * 0.61, -0.003, 0],
    })),
  );
  blocks(
    tray,
    m.dark,
    Array.from({ length: 26 }, (_, i) => ({
      size: [0.54, 0.003, 0.01],
      position: [1.02, -0.038, 0.3 + i * 0.021],
    })),
  );
  for (const x of [-1.2, 1.2])
    for (const z of [-0.92, 0.92])
      rounded(tray, m.dark, [0.28, 0.012, 0.08], [x, -0.043, z], 0.009);
  const speakerParts = speakers(m),
    screwParts = fasteners(m);
  const internals = new THREE.Group();
  internals.position.y = 0.06;
  internals.rotation.x = Math.PI;
  internals.scale.y = 0.6;
  internals.add(
    boardParts.board,
    memoryParts.ram,
    storageParts.caddy,
    storageParts.ssd,
    batteryParts.pack,
    ...speakerParts,
  );
  root.add(
    chassis,
    deck,
    keyboard.root,
    touchpad,
    buttons,
    trackpoint,
    hinges,
    displayParts.lid,
    internals,
    batteryParts.external,
    tray,
    ...screwParts,
  );
  return {
    root,
    chassis,
    deck,
    keyboard,
    touchpad,
    buttons,
    trackpoint,
    hinges,
    internals,
    ...displayParts,
    ...boardParts,
    ...memoryParts,
    ...storageParts,
    ...batteryParts,
    tray,
    speakers: speakerParts,
    fasteners: screwParts,
  };
}
