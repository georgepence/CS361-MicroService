// adapted from
// www.codegrepper.com/code-examples/javascript/nodejs+delete+files+in+directory

const emailError = require('../utilities/emailError');
const fs = require('fs');

deleteAll = function(dirPath) {
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
  } catch (e) {
    let message = `<p>Error while trying to delete all files in ${dirPath}</p><p>${e}</p>`;
    emailError.send(message).then((message) => console.log(`Error while trying to delete all files in ${dirPath} - ${e}`));
  }
}

module.exports = deleteAll
