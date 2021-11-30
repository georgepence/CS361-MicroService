// adapted from
// www.codegrepper.com/code-examples/javascript/nodejs+delete+files+in+directory

const fs = require('fs');

deleteAll = function(dirPath, clearingImageFile) {
  try {
    let files = fs.readdirSync(dirPath);
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        let filePath = dirPath + '/' + files[i];
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
    }
    clearingImageFile.status = false;
  } catch (e) {
    clearingImageFile.status = false;
    console.log(`Error while trying to delete all files in ${dirPath} - ${e}`);
  }
}

module.exports = deleteAll
