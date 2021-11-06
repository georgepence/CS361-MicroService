const fsProm = require('fs/promises');
const fs = require('fs');
const path = require('path');
const flickrSearch = require('./flickrSearch');
const googleSearch = require('./googleSearch');
const emailError = require('./emailError');
const updateCache = require('./updateCache');
const createCache = require('./createCache');
const download = require('./download');
const processImage = require('./processImage');
const queryDb = require('../database/dbcon');
const request = require("request");
require('dotenv').config();

const port = process.env.PORT
let original, originalUrl
let imageFile = { fileName: '', filePath: ''}

async function getHostPath() {
  if(process.env.NODE_ENV === 'development') {
    return `http://localhost:${process.env.PORT}`
  } else {
    // In 'production' (deployed)
    return `http://flip3.engr.oregonstate.edu:${process.env.PORT}`
  }
}

async function pause() {
  await new Promise((resolve) => {
    setTimeout(
        () => {
          console.log("Taking time out");
          resolve("success")
        },
        500
    );

})
}

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
async function getFilePath(args, cacheStatus, googleStatus) {
  let status = {
    error: false,
    busy: false
  };
  let googleData = {};
  let imageExt
  
  if (args.response_type === 'random') {
    
    if(args.flickrSearch === 'flickrSearch') {
  
      console.log("In filePath, args = ", args)         // TODO
      let result = { pages: 60000 }
  
      if (!result.photo && false) {                         // TODO Fix this
        status = {error: true};
        emailError.send(`<p>Error in getFilePath / flickrSearch</p><p>${JSON.stringify(result)}</p>`)
      } else {
    
        randomPage = Math.floor(Math.random() * result.pages);
        args.randomPage = randomPage;
    
        let photos = await flickrSearch.search(args);
        if (photos.length === 0) {console.log()}
        let randomPhoto = Math.floor(Math.random() * photos.photo.length);
        console.log("!!!!!!!!!!!!!!!!!!!!!!  R A N D O M = ", randomPhoto, " of ", photos.photo.length)
        let photo = photos.photo[randomPhoto];
        originalUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`
      }
    } else {
      console.log("In filePath, args = ", args)         // TODO
      cacheStatus.unfinishedGets += 1;
      
      let dbQuery = 'select `RandomUrls`.`url` from `RandomUrls` where `RandomUrls`.`id` = ' +
          '(select min(`RandomUrls`.`id`) as `oldest` from `RandomUrls`);'
      let dbDeleteQuery = 'delete from `RandomUrls` where `RandomUrls`.`id` = ' +
          '(select min(`RandomUrls`.`id`) as `oldest` from `RandomUrls`);'
  
      let dbRsponse = await queryDb( dbQuery, [] );
      console.log("DB Response : ", dbRsponse[0].url);
      console.log(`\n`);
      originalUrl = dbRsponse[0].url;
      await queryDb( dbDeleteQuery, [] ).then(() => {
        console.log(" >>>>> In helpers, just deleted an url, unfinished gets = ", cacheStatus.unfinishedGets);
        cacheStatus.unfinishedGets -= 1;
        if (!cacheStatus.unfinishedGets) {
          createCache.fillCache(cacheStatus)
        }
      })
    }
    
    // let result = await flickrSearch.search(args);      // TODO Maybe put back

  }
  
  // If there are search terms, try a google or flicker search, grab url.  // TODO:  PUT THIS BACK!!!
  else if (
      args.searchTerms &&
      !(args.searchTerms === "random") &&
      !googleStatus.quotaLimitReached
  ) {
    console.log("here in non-random")
    let foundGoogleImage = false
    googleData = await googleSearch.googleSearch(args)
    console.log("googleData", googleData, googleData.error, typeof googleData)
  
    if (googleData.error) {
      status.error = true;
      emailError.send(`<p>Error in getFilePath / googleSearch</p><p>${JSON.stringify(googleData)}</p>`)
    
      // ============================================================================
      // TODO: send error back to client, or try another method
      // ============================================================================
    
    }
  
    let idx = 0;
    console.log("0 here", googleData[0].link)
    console.log("1 here", googleData[1].link)
    console.log("2 here", googleData[2].link)
    // Take image link at image 0 and test
    while (!foundGoogleImage && idx < 10) {

      originalUrl = googleData[idx].link;
      console.log(originalUrl, idx)
      imageExt = (
          originalUrl.includes('?') ?
              path.extname(originalUrl)
                  .substring(0, path.extname(originalUrl).indexOf('?'))
              :
              path.extname(originalUrl)
      );

      if (['.jpg', '.png', '.tif', '.tiff', '.jpeg'].includes(imageExt)) {
        foundGoogleImage = true;
      } else {
        idx += 1
      }
    }

  
    // Set status.error = true on Google error, triggering an alternate search  // TODO

    // originalUrl = googleData[Math.floor(Math.random() * googleData.length)].link
    console.log("Google results = ", originalUrl, "Extension = ", path.extname(originalUrl));
    imageFile.fileName = 'googleImage' + imageExt;
    imageFile.filePath = './images/client/general/';
    while (status.busy) {
      await pause();
    }
    status.busy = true;
    // await download.get(originalUrl, imageFile.filePath + imageFile.fileName).then(() => {});
    status.busy = false;
    console.log("File downloaded, back in helpers")
  } else {
    let width = parseInt(args.width) || 800
    let height = parseInt(args.height) || 800
    const files = await fsProm.readdir('./images/random/large')
    let num = Math.floor(Math.random() * files.length) + 1
    original = "./images/random/large/" + num + ".jpeg"
    imageFile.filePath = "./images/client/general/";
    imageFile.fileName = num + ".jpeg"
    
    let metadata = await processImage.getMetadata("./images/random/large/" + imageFile.fileName)

    imageFile = await processImage.resize("./images/random/large/" +
            imageFile.fileName, metadata, {
          width: width,
          height: height,
          destination: imageFile.filePath,
          fileName: imageFile.fileName
        })

  }

  // If there are no search terms, or the above search fails, grab a random
  // file from disk.

  /*   // THIS CODE COULD BE USED TO PULL RANDOM FILE FROM DISK
  const files = await fsProm.readdir('./images/random/large')
  let num = Math.floor(Math.random() * files.length) + 1
  original = "./images/random/large/" + num + ".jpeg"
   */
  
  // Take image and resize it to size = args || default
  if ((args.width || args.height || !(args.response_type === "random")) && !googleStatus.quotaLimitReached) {
    console.log("BUSYSTATUS = ", status.busy)
    let width = parseInt(args.width) || 800
    let height = parseInt(args.height) || 800
    imageFile = await download.get(originalUrl, imageFile.filePath + imageFile.fileName, imageFile)
        .then((imageFile) => {
          let metadata = processImage.getMetadata(imageFile.filePath + imageFile.fileName)
          return metadata
        })
        .then((metadata) => {
          let result = processImage
              .resize(imageFile.filePath +
                  imageFile.fileName, metadata, {
                width: width,
                height: height,
                destination: imageFile.filePath,
                fileName: imageFile.fileName
              })
          return result
        })
  }
  console.log("I'm finished resizing.  imageFile = ", imageFile)
  
  let hostPath = getHostPath();
  
  console.log(`:::::::::::::::::::\n`)
  
  // Return link and location information to image file
  return {
    host: hostPath,
    filePath: imageFile.filePath.substr(1),
    fileName: imageFile.fileName,
    originalUrl: originalUrl }

}


// exports.randomFile = randomFile;             // TODO
// exports.getFile = getFile;                   // TODO
// exports.randomFileName = randomFileName;     // TODO

exports.getFilePath = getFilePath;






