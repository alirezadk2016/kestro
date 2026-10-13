import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const home = process.env.USERPROFILE ?? process.env.HOME ?? "";
if (!process.argv.includes("--check")) {
  await sharp(join(root, "assets/artwork/laptop-wallpaper.png"))
    .resize(1536, 960, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(join(root, "public/models/laptop-wallpaper.webp"));
  for (const name of ["keyboard", "internals"]) {
    await sharp(join(root, `assets/artwork/thinkpad-${name}-reference.png`))
      .webp({ quality: 94 })
      .toFile(join(root, `public/models/thinkpad-${name}-texture.webp`));
  }
}
let playwright;
try {
  playwright = await import("playwright");
} catch {
  const modulePath = [
    process.env.PLAYWRIGHT_MODULE,
    "/opt/node22/lib/node_modules/playwright/index.mjs",
    join(
      home,
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs",
    ),
  ].find((candidate) => candidate && existsSync(candidate));
  if (!modulePath) throw new Error("Set PLAYWRIGHT_MODULE to render the assembly poster.");
  playwright = await import(pathToFileURL(modulePath).href);
}
const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/examples/jsm/":"/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import {createLaptopAssembly} from '/lib/laptop-assembly-scene.mjs';
try {
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setClearAlpha(0);renderer.setSize(1200,1200);document.body.append(renderer.domElement);
  const assembly=await createLaptopAssembly(renderer);
  assembly.camera.aspect=1;assembly.camera.updateProjectionMatrix();
  window.bounds=[]; window.frames=[];
  for(const phase of [0,0.25,0.5,0.75,1]) {
    assembly.setProgress(phase,true);assembly.draw(phase);
    window.frames.push({phase,image:renderer.domElement.toDataURL('image/png')});
    const gl=renderer.getContext();
    if(gl.isContextLost())throw new Error('WebGL context lost while rendering poster');
    const pixels=new Uint8Array(1200*1200*4);
    gl.readPixels(0,0,1200,1200,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let count=0,minX=1200,minY=1200,maxX=0,maxY=0;
    for(let index=3;index<pixels.length;index+=4) {
      if(pixels[index]<128)continue;
      count++;
      const pixel=(index-3)/4,x=pixel%1200,y=Math.floor(pixel/1200);
      minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
    }
    if(count<12000)throw new Error('Assembly poster is blank at phase '+phase);
    if(minX<12||minY<12||maxX>1187||maxY>1187)throw new Error('Assembly cropped at '+phase+': '+[minX,minY,maxX,maxY].join(','));
    window.bounds.push({phase,frame:[minX,minY,maxX,maxY],calls:renderer.info.render.calls,triangles:renderer.info.render.triangles});
  }
  assembly.setProgress(0,true);assembly.draw(0);
  window.result=renderer.domElement.toDataURL('image/png');
  let keycaps=0;
  assembly.scene.traverse(node=>{if(node.isInstancedMesh&&node.geometry.attributes.keyUvRect)keycaps+=node.count;});
  if(keycaps!==84)throw new Error('Expected 84 independent keycaps, got '+keycaps);
  for(const aspect of [1,4/3]) for(const phase of [0,1]) for(let angle=0;angle<4;angle++) {
    assembly.camera.aspect=aspect;assembly.camera.updateProjectionMatrix();
    assembly.resetOrbit();assembly.orbitBy(angle*Math.PI/2,0);assembly.setProgress(phase);assembly.draw();
    const projected=new THREE.Box3();
    assembly.scene.children.filter(node=>node.isGroup).forEach(node=>projected.expandByObject(node));
    for(let i=0;i<8;i++) {
      const point=new THREE.Vector3(i&1?projected.max.x:projected.min.x,i&2?projected.max.y:projected.min.y,i&4?projected.max.z:projected.min.z).project(assembly.camera);
      if(Math.abs(point.x)>.99||Math.abs(point.y)>.99)throw new Error('Orbit cropped at '+[aspect,phase,angle]);
    }
  }
  assembly.camera.aspect=1;assembly.camera.updateProjectionMatrix();assembly.resetOrbit();assembly.setProgress(0);assembly.draw();
}catch(error){window.failure=String(error);}
</script>`;
const types = { ".js": "text/javascript", ".mjs": "text/javascript", ".glb": "model/gltf-binary" };
const server = createServer(async (request, response) => {
  const url = request.url.split("?")[0];
  if (url === "/") return response.writeHead(200, { "content-type": "text/html" }).end(html);
  const file = url.startsWith("/three/")
    ? join(root, "node_modules", url.slice(1))
    : url.startsWith("/lib/")
      ? join(root, url.slice(1))
      : join(root, "public", url.slice(1));
  try {
    const body = await readFile(file);
    response
      .writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" })
      .end(body);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  const executablePath = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    "/opt/pw-browsers/chromium",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].find((candidate) => candidate && existsSync(candidate));
  browser = await playwright.chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(() => window.result || window.failure, { timeout: 60000 });
  const result = await page.evaluate(() => ({
    image: window.result,
    error: window.failure,
    frames: window.frames,
    bounds: window.bounds,
  }));
  if (process.env.ASSEMBLY_PREVIEW_DIR) {
    await mkdir(process.env.ASSEMBLY_PREVIEW_DIR, { recursive: true });
    for (const frame of result.frames ?? []) {
      await writeFile(
        join(process.env.ASSEMBLY_PREVIEW_DIR, `assembly-${frame.phase}.webp`),
        await sharp(Buffer.from(frame.image.split(",")[1], "base64"))
          .webp({ quality: 93 })
          .toBuffer(),
      );
    }
    await page.evaluate(() => (document.body.style.background = "#0B1426"));
    await page.screenshot({ path: join(process.env.ASSEMBLY_PREVIEW_DIR, "assembly-stage.png") });
    console.log(JSON.stringify(result.bounds));
  }
  if (result.error) throw new Error(result.error);
  const data = await sharp(Buffer.from(result.image.split(",")[1], "base64"))
    .webp({ quality: 93 })
    .toBuffer();
  if (!process.argv.includes("--check")) {
    await writeFile(join(root, "public/models/laptop-assembly.webp"), data);
  }
  console.log(
    `laptop-assembly.webp: 1200x1200, ${Math.round(data.length / 1024)} kB; five phases, 84 keycaps and 16 orbit/framing checks passed`,
  );
} finally {
  await browser?.close();
  server.close();
}
