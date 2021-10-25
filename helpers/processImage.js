const sharp = require('sharp');
const emailError = require('./emailError');
const path = require('path');

async function getMetadata(image) {
  
  sharp(image).metadata()
      .then((result) => {return result})
      .catch((e) => {
        let message = `<p>Error getting metadata for ${image}</p><p>${e}</p>`
        emailError.send(message)
        console.log("error in getting metadata for ", image, "\n" , e)
      })
      .finally(() => console.log("done"));
  
}

async function resize(image, args) {
  
  // Get original image dimensions

  let imageData = await sharp(image).metadata();
  let width = imageData.width;
  let height = imageData.height;
  
  return new Promise((res, rej) => {

    let destination = args.destination || 'general/'
    let fileName = args.fileName || 'image.jpg'
    
    if (args.width && width > args.width &&
        (!args.height || (width / height) >= (args.width / args.height))) {
      sharp(image)
          .resize({width: args.width})
          .toFile('./images/client/' + destination + fileName)
          .then(() => {res({ fileName: fileName, filePath: destination })})
          .catch((err) => res({error: err}));
    
    } else if (args.height && height > args.height &&
        (!args.width || (width / height) < (args.width / args.height))) {
      sharp(image)
          .resize({height: args.height})
          .toFile('./images/client/' + destination + fileName)
          .then(() => {res({ fileName: fileName, filePath: destination })})
          .catch((err) => res({error: err}));
    }
  })
  
}

exports.resize = resize;
exports.getMetadata = getMetadata;