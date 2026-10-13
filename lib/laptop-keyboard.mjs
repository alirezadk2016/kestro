import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Pixel bounds are measured from the approved reference, not generated lettering.
const rows = [
  {
    y: [537, 562],
    x: [
      [273, 327],
      [331, 367],
      [371, 407],
      [411, 446],
      [450, 487],
      [498, 534],
      [538, 574],
      [578, 614],
      [617, 654],
      [666, 701],
      [705, 741],
      [745, 780],
      [784, 821],
      [832, 868],
      [871, 907],
      [911, 946],
      [950, 1005],
    ],
  },
  {
    y: [575, 611],
    x: [
      [272, 314],
      [322, 363],
      [371, 412],
      [421, 462],
      [470, 511],
      [520, 561],
      [569, 610],
      [619, 660],
      [668, 709],
      [718, 759],
      [767, 809],
      [817, 858],
      [867, 907],
      [916, 1005],
    ],
  },
  {
    y: [623, 659],
    x: [
      [272, 338],
      [347, 387],
      [396, 437],
      [446, 487],
      [496, 536],
      [545, 585],
      [595, 635],
      [644, 685],
      [693, 735],
      [743, 784],
      [793, 834],
      [842, 883],
      [892, 932],
      [940, 1005],
    ],
  },
  {
    y: [672, 708],
    x: [
      [273, 351],
      [360, 400],
      [409, 450],
      [458, 499],
      [508, 549],
      [558, 599],
      [608, 648],
      [657, 698],
      [706, 747],
      [756, 797],
      [805, 846],
      [855, 896],
      [905, 1005],
    ],
  },
  {
    y: [721, 756],
    x: [
      [273, 376],
      [384, 425],
      [434, 475],
      [484, 525],
      [534, 574],
      [583, 624],
      [632, 674],
      [682, 723],
      [731, 772],
      [780, 822],
      [830, 871],
      [880, 1005],
    ],
  },
  {
    y: [771, 809],
    x: [
      [273, 314],
      [322, 376],
      [384, 425],
      [434, 475],
      [484, 723],
      [731, 772],
      [780, 822],
      [830, 871],
    ],
  },
  {
    y: [771, 792],
    x: [
      [879, 915],
      [923, 962],
      [969, 1005],
    ],
  },
  {
    y: [800, 829],
    x: [
      [879, 915],
      [923, 962],
      [969, 1005],
    ],
  },
];

export function buildKeyboard(texture, materials) {
  const root = new THREE.Group();
  const frame = new THREE.Mesh(new RoundedBoxGeometry(2.97, 0.02, 1.17, 2, 0.015), materials.dark);
  frame.position.set(0, 0.178, -0.33);
  frame.castShadow = frame.receiveShadow = true;
  root.add(frame);

  const geometry = new RoundedBoxGeometry(1, 1, 1, 3, 0.09);
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i),
      z = position.getZ(i);
    if (normal.getY(i) > 0.7) {
      position.setY(i, position.getY(i) - 0.1 * (1 - Math.min(1, x * x * 4)));
      uv.setXY(i, x + 0.5, 0.5 - z);
    } else uv.setXY(i, 0.025, 0.025);
  }
  geometry.computeVertexNormals();

  const keys = rows.flatMap((row, rowIndex) =>
    row.x.map(([left, right]) => ({
      row: rowIndex,
      position: new THREE.Vector3(
        (((left + right) / 2 - 639) / 740) * 2.9,
        0.208,
        -0.88 + (((row.y[0] + row.y[1]) / 2 - 531) / 301) * 1.1,
      ),
      scale: new THREE.Vector3(
        ((right - left) / 740) * 2.9,
        0.034,
        ((row.y[1] - row.y[0]) / 301) * 1.1,
      ),
      rect: [left / 1274, 1 - row.y[1] / 1234, (right - left) / 1274, (row.y[1] - row.y[0]) / 1234],
    })),
  );
  geometry.setAttribute(
    "keyUvRect",
    new THREE.InstancedBufferAttribute(new Float32Array(keys.flatMap((key) => key.rect)), 4),
  );
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.62,
    metalness: 0.02,
    color: "#eeeeee",
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = `attribute vec4 keyUvRect;\n${shader.vertexShader}`.replace(
      "#include <uv_vertex>",
      "#include <uv_vertex>\n#ifdef USE_MAP\nvMapUv = keyUvRect.xy + uv * keyUvRect.zw;\n#endif",
    );
  };
  material.customProgramCacheKey = () => "kestro-reference-keycaps-v1";
  const caps = new THREE.InstancedMesh(geometry, material, keys.length);
  caps.castShadow = caps.receiveShadow = true;
  caps.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  root.add(caps);
  const transform = new THREE.Object3D();

  function setSeparation(value) {
    keys.forEach((key, index) => {
      transform.position.copy(key.position);
      transform.position.y += value * (0.105 + Math.min(key.row, 5) * 0.012);
      transform.scale.copy(key.scale);
      transform.rotation.set(value * 0.015, 0, 0);
      transform.updateMatrix();
      caps.setMatrixAt(index, transform.matrix);
    });
    caps.instanceMatrix.needsUpdate = true;
    caps.computeBoundingBox();
    caps.computeBoundingSphere();
  }
  setSeparation(0);
  return { root, caps, setSeparation, count: keys.length };
}
