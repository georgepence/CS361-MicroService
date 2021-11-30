// This code is adapted from code here:   // TODO
// https://www.codegrepper.com/code-examples/javascript/node+download+image+from+url+to+disk
const downloadImage = require('image-downloader');
// const request = require('request');
// const fs = require('fs');

// async function download(url, dest, imageFile) {
//
//   /* Create an empty file where we can save data */
//   const file = fs.createWriteStream(dest);
//
//   console.log('~'.repeat(28), 'in download', '~'.repeat(29))
//   console.log('url :', url, '    dest:', dest)
//   console.log('~'.repeat(80))
//
//   return new Promise((resolve, reject) => {
//
//     console.log(`At download top: \n${url}\n${dest}\n${JSON.stringify(imageFile)}`)
//     try {
//       request({
//         /* Here you should specify the exact link to the file you are trying to download */
//         uri: url,
//         gzip: true,
//       })
//           .pipe(file)
//           .on('finish', async () => {
//             console.log(`download finished`)
//             resolve(imageFile);
//           })
//           .on('RequestError', (error) => {
//             console.log(`download onRequestError: ${error}`)
//             resolve({ error: `download onRequestError: ${error}`})
//       })
//           .on('error', (error) => {
//             console.log(`download error`)
//             reject(error);
//           })
//     } catch (error) {
//       console.log(`(Download) Error processing file: ${url} error: ${error}`)
//       resolve({ error: `Error processing image.  Please retry`})
//     }
//
//   })
// }

// This code adapted from example code at npm image-downloader documentation
// https://www.npmjs.com/package/image-downloader

async function imageDownload(url, dest, imageFile) {
  let options;
  return new Promise((resolve, reject) => {
    console.log(`At imageDownload top: \n${url}\n${dest}\n${JSON.stringify(imageFile)}`)
    options = {
      url: url,
      dest: dest      // will be saved to /path/to/dest/photo.jpg
    }
  
    downloadImage.image(options)
        .then(({ filename }) => {
          console.log('Saved to', filename)  // saved to /path/to/dest/photo.jpg
          resolve(imageFile);
        })
        .catch((err) => {
          console.error(`imageDownload error: rejecting on ${err}`);
          reject(err);
        })
  })
}

// exports.get = download;    todo
exports.fetch = imageDownload;