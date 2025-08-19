const fs = require('fs');
const path = require('path');

module.exports = {
  ensureDirectoryExists: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  },
  
  generateFilename: (viewport, extension) => {
    return `${viewport.name}-${viewport.width}x${viewport.height}.${extension}`;
  }
};