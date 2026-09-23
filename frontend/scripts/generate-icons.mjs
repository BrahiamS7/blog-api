import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile } from "node:fs/promises";

const squareIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${size}" height="${size}">
  <rect width="40" height="40" rx="10" fill="#12242A" />
  <circle cx="14" cy="20" r="3.2" fill="#FF5A36" />
  <path d="M21 11c5.523 0 10 4.03 10 9s-4.477 9-10 9" stroke="#FF5A36" stroke-width="2.6" stroke-linecap="round" fill="none" />
  <path d="M21 5c8.837 0 16 6.716 16 15s-7.163 15-16 15" stroke="#FF5A36" stroke-width="2.6" stroke-linecap="round" fill="none" opacity="0.4" />
</svg>`;

// Full-bleed, no border-radius — iOS applies its own mask on top.
const appleTouchIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${size}" height="${size}">
  <rect width="40" height="40" fill="#12242A" />
  <circle cx="14" cy="20" r="3.2" fill="#FF5A36" />
  <path d="M21 11c5.523 0 10 4.03 10 9s-4.477 9-10 9" stroke="#FF5A36" stroke-width="2.6" stroke-linecap="round" fill="none" />
  <path d="M21 5c8.837 0 16 6.716 16 15s-7.163 15-16 15" stroke="#FF5A36" stroke-width="2.6" stroke-linecap="round" fill="none" opacity="0.4" />
</svg>`;

async function renderPng(svg, size, outPath) {
  const buffer = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  await writeFile(outPath, buffer);
  return buffer;
}

const pub = new URL("../public/", import.meta.url);

await renderPng(squareIcon(16), 16, new URL("favicon-16x16.png", pub));
const png32 = await renderPng(squareIcon(32), 32, new URL("favicon-32x32.png", pub));
await renderPng(appleTouchIcon(180), 180, new URL("apple-touch-icon.png", pub));
await renderPng(squareIcon(192), 192, new URL("icon-192.png", pub));
await renderPng(squareIcon(512), 512, new URL("icon-512.png", pub));

const png16 = await sharp(Buffer.from(squareIcon(16))).resize(16, 16).png().toBuffer();
const icoBuffer = await pngToIco([png16, png32]);
await writeFile(new URL("favicon.ico", pub), icoBuffer);

console.log("Iconos generados en public/");
