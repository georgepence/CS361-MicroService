const downloadImage = require('image-downloader');

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

exports.fetch = imageDownload;