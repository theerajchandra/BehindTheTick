const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const publicDir = path.join(__dirname, '../public');
  
  try {
    console.log('Converting SVG icons to PNG...');
    
    // Convert 192x192 icon
    const svg192 = fs.readFileSync(path.join(publicDir, 'icon-192.svg'));
    await sharp(svg192)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✅ Created icon-192.png');
    
    // Convert 512x512 icon
    const svg512 = fs.readFileSync(path.join(publicDir, 'icon-512.svg'));
    await sharp(svg512)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✅ Created icon-512.png');
    
    // Also create favicon.ico from the 192x192 version
    await sharp(svg192)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    console.log('✅ Created favicon.png');
    
    console.log('🎉 All icons converted successfully!');
    
  } catch (error) {
    console.error('❌ Error converting icons:', error);
  }
}

convertSvgToPng();
