/**
 * This is the main maodule that takes clientReq from server.js and returns an
 * image url or an image file.
 */

const fsProm = require('fs/promises');
const path = require('path');
const setSearchEngine = require('./search/setSearchEngine');
const emailError = require('./utilities/emailError');
const getFileBaseNameEnding = require('./search/helpers/getFileBaseNameEnding');
const download = require('./imageProcessing/download');
const processImage = require('./imageProcessing/processImage');
const pause = require('./utilities/pause');
const getHostPath = require('./utilities/getHostPath');


async function getImage(clientReq, cacheStatus, googleStatus) {
 
  // Initialize   :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  let engine = setSearchEngine(clientReq, googleStatus);
  let status = { error: false, busy: false };
  let imageExt;
  let imageFile = { fileName: '', filePath: ''};
  let hostPath = getHostPath();
  let sourceUrl;
  
  // Search, find image url   :::::::::::::::::::::::::::::::::::::::::::::::::
  sourceUrl = await engine.search(clientReq, cacheStatus);
  
  // If search error:
  if ( sourceUrl.error === true) {
    console.log("In getImage with search error, sourceUrl = ", sourceUrl)
    await emailError.send(`<p>Error in search</p><p>${JSON.stringify(sourceUrl.error)}</p>`)
    //      TODO:   Do something ( alternate search? )
  }
  
  // Process and return link or file  :::::::::::::::::::::::::::::::::::::::::
  
  if (clientReq.response_type === 'random') {
    
    return { sourceUrl: sourceUrl }           // This is the image object

  } else {
  
    // Not sure if this is needed to prevent clashing file operations.
    // Not really sure it works anyway...
    while (status.busy) {
      console.log("In non-random, pausing")
      await pause();
    }
    
    status.busy = true
    
    // try {      // TODO
    //   console.log("Google results = ", sourceUrl, "Extension = ", path.extname(sourceUrl));
    // } catch {
    //   console.log("Error in getFile: sourceUrl =  ", sourceUrl)
    // }

    let baseEnding = getFileBaseNameEnding();
    imageFile.original =  'originalImage' + baseEnding + path.extname(sourceUrl);
    imageFile.fileName = 'image-' + baseEnding + path.extname(sourceUrl);
    imageFile.filePath = './images/client/general/';
  
    // Take image and resize it to size = clientReq || default  :::::::::::::::
  
    let width = parseInt(clientReq.width) || 800
    let height = parseInt(clientReq.height) || 800
  
    imageFile = await download.get(sourceUrl, imageFile.filePath + imageFile.original, imageFile)
        .then((imageFile) => {
          return processImage.getMetadata(imageFile.filePath + imageFile.original)
        })
        .then((metadata) => {
          let result = processImage
              .resize(imageFile.filePath +
                  imageFile.original, metadata, {
                width: width,
                height: height,
                destination: imageFile.filePath,
                fileName: imageFile.fileName,
                baseEnding: baseEnding
              })
          return result
              })
          .catch((e) => {
          let message = `<p>Error processing file ${imageFile}</p><p>${e}</p>`;
          emailError.send(message)
              .then(() => console.log(`Error processing file ${imageFile} - ${e}`));
        })
  
  
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Special debugging block used when file open / write errors occur  // TODO
    console.log(';'.repeat(80), `\n`)
    try {
      console.log("Sending stuff back,: ", "host:", hostPath, "path:", imageFile.filePath.substr(1), "fileName:", imageFile.fileName, "sourceUrl:", sourceUrl)
    } catch {
      status.error = true;
      let errorFilename = !imageFile ? '' : imageFile.fileName;
      status.message = `Error processing image ${errorFilename}`
      console.log(imageFile, imageExt)
    }
    console.log(';'.repeat(80), `\n`)
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  

    status.busy = false
    
    if (status.error) {
      return { error: true, message: status.message }
    }
    
    // Return link and location information to image file    ::::::::::::::::::
    return {
      host: hostPath,
      filePath: imageFile.filePath.substr(1),
      fileName: imageFile.fileName,
      sourceUrl: sourceUrl
    }
  }
}

exports.getImage = getImage;






