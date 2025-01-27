const fs = require('fs');
const path = require('path');

// 🔹 Define the source directories
const sourceDirs = [
  './src/app', // Main Angular App Source
  './src/environments', // Environments
  './src/assets', // Assets (Optional)
];

// 🔹 Define the output file
const outputFile = './extracted_code.txt';

// 🔹 File extensions to extract
const fileExtensions = ['.ts', '.html', '.scss'];

// ✅ Function to recursively extract code into one file
function extractCode(sourcePath, outputStream) {
  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠️ Skipping: Directory not found - ${sourcePath}`);
    return;
  }

  fs.readdirSync(sourcePath).forEach((file) => {
    const fullPath = path.join(sourcePath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      extractCode(fullPath, outputStream); // Recurse into directories
    } else if (fileExtensions.includes(path.extname(file))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      outputStream.write(`\n/* ===== File: ${fullPath} ===== */\n`);
      outputStream.write(content + '\n');
      console.log(`✅ Extracted: ${fullPath}`);
    }
  });
}

// ✅ Start extracting code
console.log('🔹 Extracting Angular source code into a single text file...');
const outputStream = fs.createWriteStream(outputFile, { flags: 'w' });

sourceDirs.forEach((dir) => extractCode(dir, outputStream));

outputStream.end(() => {
  console.log(`🎉 Code extraction complete! Check "${outputFile}".`);
});
