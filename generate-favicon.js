const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  const sizes = [16, 32, 48, 64, 128, 256];
  const publicDir = path.join(__dirname, 'public');
  const sourcePath = path.join(__dirname, 'assets', 'favicon-source.png');

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Favicon source not found: ${sourcePath}`);
  }

  console.log('Generating favicon files from assets/favicon-source.png...');

  for (const size of sizes) {
    await sharp(sourcePath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
    console.log(`✓ Generated favicon-${size}x${size}.png`);
  }

  // Browsers accept PNG content for favicon.ico
  await sharp(sourcePath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✓ Generated favicon.ico');

  await sharp(sourcePath)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png');

  await sharp(sourcePath)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  console.log('✓ Generated android-chrome-192x192.png');

  await sharp(sourcePath)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  console.log('✓ Generated android-chrome-512x512.png');

  const manifest = {
    name: 'Discernible.io',
    short_name: 'Discernible',
    description: 'RODiT: Rich Online Digital Tokens',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    theme_color: '#E31C23',
    background_color: '#ffffff',
    display: 'standalone'
  };

  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✓ Generated site.webmanifest');

  const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/favicon-256x256.png"/>
      <TileColor>#E31C23</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

  fs.writeFileSync(path.join(publicDir, 'browserconfig.xml'), browserconfig);
  console.log('✓ Generated browserconfig.xml');

  console.log('\n✅ All favicon files generated successfully!');
}

generateFavicon().catch(console.error);
