const fsProm = require('fs/promises');
const fs = require('fs');
const path = require('path');
const googleSearch = require('./googleSearch');
const emailError = require('./emailError')
const processImage = require('./processImage')
require('dotenv').config();

const port = process.env.PORT

// TODO:  REPLACE THIS AND DELETE
// async function randomFile() {
//   console.log("before try statement")
//   try {
//     console.log("About to start")
//     console.log("Root = ", __dirname)
//     let imagePath = path.resolve('./images/random/small')
//     console.log("path = ", imagePath)
//     const files = await fsProm.readdir(imagePath)
//     console.log("files = ", files)
//
//     let numFiles = files.length
//     let num = Math.floor(Math.random() * numFiles) + 1
//     console.log("numfiles = ", numFiles, "randomNum = ", num)
//
//     // return link to random image file
//     console.log(`http://localhost:${process.env.PORT}/image?image=${num}.jpeg`)
//     if(process.env.NODE_ENV === 'development') {
//       return `http://localhost:${process.env.PORT}/image?image=${num}.jpeg`
//     } else {
//       return `http://flip3.engr.oregonstate.edu:${process.env.PORT}/image?image=${num}.jpeg`
//     }
//   }
//
//   catch (err) {return err}
// }

// TODO:  REPLACE THIS AND DELETE
// async function randomFileName() {
//
//   try {
//     const files = await fsProm.readdir('./images/random/small')
//
//     let numFiles = files.length
//     let num = Math.floor(Math.random() * numFiles) + 1
//
//     // return just file name of random image file
//     return num + '.jpeg'
//   }
//
//   catch (err) {return err}
// }

// TODO:  REPLACE THIS AND DELETE
// async function getFile() {
//
//   const url = '/getImage?responseType=file'
//
//
//     const response = await fetch(url);
//     const buffer = await response.buffer();
//     fs.writeFile(`.images/readme/image.jpg`, buffer, () =>
//         console.log('finished downloading!'));
//
// }

// ============================================================================

// Take arguments (args) and return { host, fileName, filePath } of image
async function getFilePath(args) {
  let status = { error: false }
  let googleData = {}
  
  // If there are search terms, try a google or flicker search, grab url.
  if (args.searchTerms && !(args.searchTerms === "random")) {
    googleData = await googleSearch.googleSearch(args)
    
    // Set status.error = true on Google error, triggering an alternate search
    if (googleData.error) {
      status.error = true;
      emailError.send(`<p>Error in getFilePath / googleSearch</p><p>${JSON.stringify(googleData)}</p>`)
    }
  }
  
  // If there are no search terms, or the above search fails, grab a random
  // file from disk.
  
  const files = await fsProm.readdir('./images/random/large')
  let num = Math.floor(Math.random() * files.length) + 1
  let original = "./images/random/large/" + num + ".jpeg"
  
  // Take image and resize it to size = args || default

  let imageFile = {}
  let width = parseInt(args.width) || 800
  let height = parseInt(args.height) || 800
  imageFile = await processImage.resize(original, {width: width, height: height})

  
  // Save file to 'general' (if search) and replace, or save to 'random' as
  // a new file in sequence (keeping old files).
  
  // return link to random image file
  let hostPath
  if(process.env.NODE_ENV === 'development') {
    hostPath = `http://localhost:${process.env.PORT}`
  } else {
    // In 'production' (deployed)
    hostPath = `http://flip3.engr.oregonstate.edu:${process.env.PORT}`
  }
  
  // Return link and location information to image file
  return {
    host: hostPath,
    filePath: imageFile.filePath,
    fileName: imageFile.fileName,
    original: 'https://web.engr.oregonstate.edu/~penceg/images/large/' + num + '.jpeg' }

}


// exports.randomFile = randomFile;             // TODO
// exports.getFile = getFile;                   // TODO
// exports.randomFileName = randomFileName;     // TODO

exports.getFilePath = getFilePath;






