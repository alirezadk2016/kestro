import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const home = process.env.USERPROFILE ?? process.env.HOME ?? "";
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
const view = JSON.parse(await readFile(join(root, "lib/hero-view.json"), "utf8"));
const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/examples/jsm/":"/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import {createLaptopAssembly} from '/lib/laptop-assembly-scene.mjs';
try {
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setClearAlpha(0);renderer.setSize(1200,1200);document.body.append(renderer.domElement);
  const assembly=await createLaptopAssembly(renderer,${JSON.stringify(view)});
  assembly.camera.aspect=1;assembly.camera.updateProjectionMatrix();
  window.bounds=[];
  for(const phase of [0,0.25,0.5,0.75,1]) {
    assembly.setProgress(phase,true);assembly.draw(phase);
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
    window.bounds.push({phase,frame:[minX,minY,maxX,maxY]});
  }
  assembly.setProgress(0,true);assembly.draw(0);
  window.result=renderer.domElement.toDataURL('image/webp',0.93);
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
  await page.waitForFunction(() => window.result || window.failure);
  const result = await page.evaluate(() => ({ image: window.result, error: window.failure }));
  if (result.error) throw new Error(result.error);
  const data = Buffer.from(result.image.split(",")[1], "base64");
  if (!process.argv.includes("--check")) {
    await writeFile(join(root, "public/models/laptop-assembly.webp"), data);
  }
  console.log(
    `laptop-assembly.webp: 1200x1200, ${Math.round(data.length / 1024)} kB; all five assembly phases are framed`,
  );
} finally {
  await browser?.close();
  server.close();
}
