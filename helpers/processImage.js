const sharp = require('sharp');
const emailError = require('./emailError');
const path = require('path');

async function getMetadata(image) {
  console.log("In Metadata, image = ", image)
  return new Promise((res, rej) => {
    sharp(image).metadata()
        .then((result) => {
          console.log("In metadata, result = ", result)
          res(result)
        })
        .catch((e) => {
          let message = `<p>Error getting metadata for ${image}</p><p>${e}</p>`;
          emailError.send(message);
          console.log("error in getting metadata for ", image, "\n" , e);
          rej(e);
        })
        .finally(() => console.log("done"));
  })

  
}

async function resize(image, imageData, args) {
  
  // Get original image dimensions
  sharp.cache(false);
  
  console.log("here in resize", args, image)

  // let imageData = await sharp(image).metadata();
  let width = imageData.width;
  let height = imageData.height;
  console.log("Image data = ", imageData)
  
  return new Promise((res, rej) => {

    let destination = args.destination || 'general/'
    let fileName = args.fileName || 'image.jpg'
    
    if (args.width && width > args.width &&
        (!args.height || (width / height) >= (args.width / args.height))) {
      sharp(image)
          .resize({width: args.width})
          .toFile(destination + 'image.jpg')
          .then(() => {
            console.log("Finished reducing width.  Response is ", fileName, destination)
            res({ fileName: 'image.jpg', filePath: destination })
          })
          .catch((err) => res({error: err}));
    
    } else if (args.height && height > args.height &&
        (!args.width || (width / height) < (args.width / args.height))) {
      sharp(image)
          .resize({height: args.height})
          .toFile(destination + 'image.jpg')
          .then(() => {
            console.log("Finished reducing height.  Response is ", fileName, destination)
            res({ fileName: 'image.jpg', filePath: destination })
          })
          .catch((err) => res({error: err}));
    } else {
      sharp(image)
          .toFile(destination + 'image.jpg')
          .then(() => {
            console.log("Finished, no processing.  Response is ", fileName, destination)
            res({ fileName: 'image.jpg', filePath: destination })
          })
          .catch((err) => res({error: err}));
    }
  })
}

exports.resize = resize;
exports.getMetadata = getMetadata;