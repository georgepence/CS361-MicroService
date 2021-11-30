const sharp = require('sharp');

async function getMetadata(image) {

  return new Promise((res, rej) => {
    sharp(image).metadata()
        .then((result) => {
          res(result)
        })
        .catch((e) => {
          console.log("error in getting metadata for ", image, "\n" , e);
          rej(e);
        })
        .finally(() => console.log("done"));
  })
}

async function resize(image, imageData, args) {
  
  // Get original image dimensions
  sharp.cache(false);

  // let imageData = await sharp(image).metadata();
  let width = imageData.width;
  let height = imageData.height;
  
  return new Promise((res, rej) => {

    let destination = args.destination || 'general/'
    let fileName = args.fileName || 'image.jpg'
    
    if (args.width && width > args.width &&
        (!args.height || (width / height) >= (args.width / args.height))) {
      sharp(image)
          .resize({width: args.width})
          .toFile(destination + fileName)
          .then(() => {

            res({ fileName: fileName, filePath: destination })
          })
          .catch((err) => res({error: err, image:imageData }));
    
    } else if (args.height && height > args.height &&
        (!args.width || (width / height) < (args.width / args.height))) {
      sharp(image)
          .resize({height: args.height})
          .toFile(destination + fileName)
          .then(() => {

            res({ fileName: fileName, filePath: destination })
          })
          .catch((err) => res({error: err}));
    } else {
      sharp(image)
          .toFile(destination + fileName)
          .then(() => {

            res({ fileName: fileName, filePath: destination })
          })
          .catch((err) => res({error: err}));
    }
  })
}

exports.resize = resize;
exports.getMetadata = getMetadata;