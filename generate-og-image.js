/**
 * Generate public/og-image.png — 1200×630 IdentyClaw / Discernible brand graphic.
 * Usage: node generate-og-image.js
 */
const sharp = require('sharp');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;
const ORANGE = '#FF4500';
const publicDir = path.join(__dirname, 'public');

async function generate() {
  const lemuelRaw = await sharp(path.join(publicDir, 'lemuel.png'))
    .resize(420, 420, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  // Circular mask for Lemuel
  const circleMask = Buffer.from(`
    <svg width="420" height="420" xmlns="http://www.w3.org/2000/svg">
      <circle cx="210" cy="210" r="210" fill="#fff"/>
    </svg>
  `);
  const lemuelCircle = await sharp(lemuelRaw)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Orange ring around portrait
  const ring = Buffer.from(`
    <svg width="448" height="448" xmlns="http://www.w3.org/2000/svg">
      <circle cx="224" cy="224" r="220" fill="none" stroke="${ORANGE}" stroke-width="8"/>
    </svg>
  `);

  const backdrop = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="78%" cy="48%" r="45%">
          <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.22"/>
          <stop offset="55%" stop-color="${ORANGE}" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a0a0a"/>
          <stop offset="100%" stop-color="#141414"/>
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
      <!-- faint brand rings (left atmosphere) -->
      <circle cx="180" cy="315" r="210" fill="none" stroke="${ORANGE}" stroke-opacity="0.08" stroke-width="2"/>
      <circle cx="180" cy="315" r="140" fill="none" stroke="${ORANGE}" stroke-opacity="0.10" stroke-width="2"/>
      <circle cx="180" cy="315" r="70" fill="${ORANGE}" fill-opacity="0.12"/>
      <!-- accent bar -->
      <rect x="72" y="0" width="6" height="${HEIGHT}" fill="${ORANGE}"/>
      <!-- Discernible wordmark -->
      <g transform="translate(96, 72)">
        <rect x="0" y="0" width="268" height="52" rx="8" fill="#000" stroke="#fff" stroke-width="2"/>
        <text x="134" y="35" text-anchor="middle" font-family="Arial Black, Helvetica Neue, Arial, sans-serif"
              font-size="26" font-weight="900" fill="#fff" letter-spacing="1.5">DSCERNBLE</text>
        <rect x="276" y="0" width="56" height="52" rx="8" fill="${ORANGE}"/>
        <text x="304" y="35" text-anchor="middle" font-family="Arial Black, Helvetica Neue, Arial, sans-serif"
              font-size="26" font-weight="900" fill="#fff">IO</text>
      </g>
      <!-- Product -->
      <text x="96" y="220" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="22" font-weight="600" fill="${ORANGE}" letter-spacing="3">IDENTYCLAW</text>
      <text x="96" y="290" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="64" font-weight="800" fill="#fff">Passport</text>
      <text x="96" y="350" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="28" font-weight="500" fill="#c8c8c8">Portable agent identity. Buy once.</text>
      <line x1="96" y1="390" x2="420" y2="390" stroke="${ORANGE}" stroke-width="3"/>
      <text x="96" y="440" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="20" font-weight="400" fill="#999">API · HOLA · verify · templates</text>
      <text x="96" y="560" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="18" font-weight="400" fill="#666">www.discernible.io</text>
    </svg>
  `);

  const outPath = path.join(publicDir, 'og-image.png');
  await sharp(backdrop)
    .composite([
      { input: ring, left: 700, top: 91 },
      { input: lemuelCircle, left: 714, top: 105 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(`✓ Wrote ${outPath} (${meta.width}×${meta.height}, ${meta.size} bytes)`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
