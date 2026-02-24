const fs = require('fs');

function setupDir(dir) {
  const storeFolders = dir.split('/');
  storeFolders.forEach((folderName, index) => {
    const storePath = `${storeFolders.slice(0, index).join('/')}/${folderName}`;
    const folderPath = `${process.cwd()}/${storePath}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });
}
module.exports = {
  setupDir
};
