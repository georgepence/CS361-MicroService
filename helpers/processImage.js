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
  
  return new Promise((res, rej) => {
    let destination = args.destination || './images/client/general/'
    let fileName = args.fileName || 'image.jpg'
    let sharpImage = sharp(image)
    let size = sharpImage.metadata().then((result) => result);
    console.log("size", size)
    
    if (args.width && size.width > args.width &&
        (!args.height || (size.width / size.height) >= (args.width / args.height))) {
      sharp(image)
          .resize({width: args.width})
          .toFile("." + destination + fileName);
    
    } else if (args.height && size.height > args.height &&
        (!args.width || (size.width / size.height) < (args.width / args.height))) {
      sharp(image)
          .resize({height: args.height})
          .toFile("." + destination + fileName);
    }
  })
  
  

  //
  // try {
  //
  //   console.log("haha", size.width, size.height, "height", args.height, "width", args.width)  // todo
  //
  //
  //   console.log("done here")
  //
  //   return destination + fileName;
  // }
  //
  // catch (error) {
  //   console.log(error, typeof(error), error.prototype.message)
  //   return error
  // }
  
}

async function chico() {
  try {
    const metadata = await sharp("../images/client/random/large/16.jpeg").metadata();
    console.log(metadata);
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}
async function dogfood() {
  try {
    let dogbreath = await resize("../images/client/random/large/19.jpeg", {width: 200, height: 100})
    if (dogbreath.toString().slice(0,5) === "Error") {console.log("whee"); return "heee"}
    else {return dogbreath}
  }
  catch (error) {
    console.log(error)
    return "whoo"
  }

}
let test = resize("../images/client/random/large/1.jpeg", {width: 200, height: 100}).then((result) => console.log("result", result)).catch((err) => console.log("err", err))

// let millie = dogfood();
// console.log("millie")

exports.resize = resize;
exports.getMetadata = getMetadata;