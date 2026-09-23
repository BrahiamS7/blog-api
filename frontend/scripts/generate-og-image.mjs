import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F1F6F5" />

  <g opacity="0.6">
    <circle cx="960" cy="315" r="8" fill="#FF5A36" opacity="0.55" />
    <path d="M1010 315a230 230 0 0 1-230 230" stroke="#FF5A36" stroke-width="2.5" opacity="0.18" stroke-linecap="round" fill="none" />
    <path d="M1010 315a370 370 0 0 1-370 370" stroke="#FF5A36" stroke-width="2.5" opacity="0.12" stroke-linecap="round" fill="none" />
    <path d="M1010 315a230 230 0 0 0-230-230" stroke="#FF5A36" stroke-width="2.5" opacity="0.18" stroke-linecap="round" fill="none" />
    <path d="M1010 315a370 370 0 0 0-370-370" stroke="#FF5A36" stroke-width="2.5" opacity="0.12" stroke-linecap="round" fill="none" />
  </g>

  <circle cx="140" cy="200" r="10" fill="#FF5A36" />
  <path d="M180 200c39 0 70 28 70 63s-31 63-70 63" stroke="#FF5A36" stroke-width="8" stroke-linecap="round" fill="none" />
  <path d="M180 148c69.5 0 126 54.4 126 122s-56.5 122-126 122" stroke="#FF5A36" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.4" />

  <text x="140" y="420" font-family="Georgia, 'Times New Roman', serif" font-size="120" font-weight="600" fill="#12242A">Eco</text>
  <text x="140" y="480" font-family="Arial, sans-serif" font-size="32" fill="#52686D">Un lugar para contar las cosas.</text>
</svg>`;

await writeFile(
  new URL("../public/og-image.png", import.meta.url),
  await sharp(Buffer.from(svg)).resize(1200, 630).png({ quality: 90 }).toBuffer(),
);

console.log("og-image.png generada");
