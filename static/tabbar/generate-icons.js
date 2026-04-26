const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(color, outputPath) {
  const width = 81;
  const height = 81;
  
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);
  
  // IDAT chunk - image data
  const rawData = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 3 + 1)] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      const offset = y * (width * 3 + 1) + 1 + x * 3;
      rawData[offset] = color[0];     // R
      rawData[offset + 1] = color[1]; // G
      rawData[offset + 2] = color[2]; // B
    }
  }
  
  const compressedData = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressedData);
  
  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));
  
  // Combine all parts
  const png = Buffer.concat([signature, ihdr, idat, iend]);
  fs.writeFileSync(outputPath, png);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = calculateCRC32(crcData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC32(buffer) {
  let crc = 0xFFFFFFFF;
  const table = makeCRCTable();
  
  for (let i = 0; i < buffer.length; i++) {
    crc = table[(crc ^ buffer[i]) & 0xFF] ^ (crc >>> 8);
  }
  
  return crc ^ 0xFFFFFFFF;
}

function makeCRCTable() {
  const table = [];
  for (let c = 0; c < 256; c++) {
    let n = c;
    for (let k = 0; k < 8; k++) {
      n = (n & 1) ? (0xEDB88320 ^ (n >>> 1)) : (n >>> 1);
    }
    table.push(n);
  }
  return table;
}

// Colors
const COLORS = {
  // Unselected: #999999
  unselected: [0x99, 0x99, 0x99],
  // Selected: #1890ff
  selected: [0x18, 0x90, 0xFF]
};

// Create icons
const icons = [
  { name: 'home', color: COLORS.unselected },
  { name: 'home-active', color: COLORS.selected },
  { name: 'mutual', color: COLORS.unselected },
  { name: 'mutual-active', color: COLORS.selected },
  { name: 'post', color: COLORS.unselected },
  { name: 'post-active', color: COLORS.selected },
  { name: 'message', color: COLORS.unselected },
  { name: 'message-active', color: COLORS.selected },
  { name: 'profile', color: COLORS.unselected },
  { name: 'profile-active', color: COLORS.selected }
];

const outputDir = __dirname;

icons.forEach(icon => {
  const outputPath = path.join(outputDir, `${icon.name}.png`);
  createPNG(icon.color, outputPath);
  console.log(`Created: ${outputPath} (${icon.name === 'home' || icon.name === 'mutual' || icon.name === 'post' || icon.name === 'message' || icon.name === 'profile' ? '#999999' : '#1890ff'})`);
});

console.log(`\nDone: Created ${icons.length} tabbar icons`);
console.log('Size: 81x81 pixels');
console.log('Format: PNG with RGB color');
