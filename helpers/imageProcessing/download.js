// This code is developed from code here:
// https://www.codegrepper.com/code-examples/javascript/node+download+image+from+url+to+disk

const request = require('request');
const fs = require('fs');
// const path = require('path');                 // TODO
const emailError = require("../utilities/emailError");

async function download(url, dest, imageFile) {
  
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(dest);
  
  console.log('~'.repeat(28), 'in download', '~'.repeat(29))
  console.log('url :', url, '    dest:', dest)
  console.log('~'.repeat(80))
  
  return new Promise((resolve, reject) => {
    request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: url,
      gzip: true,
    })
        .pipe(file)
        .on('finish', async () => {
          resolve(imageFile);
        })
        .on('error', (error) => {
          reject(error);
        });
  })
      .catch((error) => {
        let message = `<p>Error downloading image file from url ${url} to ${dest}</p><p>${error}</p>`
        emailError.send(message);
        console.log(`Something happened: ${error}`);
        
      }).finally(() => console.log("FINISHED !!! DOWNLOADING !!!"));
}

exports.get = download