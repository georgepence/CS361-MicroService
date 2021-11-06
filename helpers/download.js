// This code is developed from code here:
// https://www.codegrepper.com/code-examples/javascript/node+download+image+from+url+to+disk

const request = require('request');
const fs = require('fs');
const path = require('path');
const emailError = require("./emailError");

async function download(url, dest, imageFile) {
  
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(dest);
  
  /* Using Promises so that we can use the ASYNC AWAIT syntax */
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
        emailError.send(message)
        console.log(`Something happened: ${error}`);
        
      }).finally(() => console.log("FINISHED !!! DOWNLOADING !!!"));
}

// example

// (async () => {
//   const data = await download('https://random.dog/vh7i79y2qhhy.jpg', './images/image.jpg');
//   console.log(data); // The file is finished downloading.
// })();

exports.get = download