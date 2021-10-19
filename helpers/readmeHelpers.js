const fsProm = require('fs/promises');
const fs = require('fs');
require('dotenv').config();

async function randomFile() {
  
  try {
    const files = await fsProm.readdir('./images/client/random/small')
    
    let numFiles = files.length
    let num = Math.floor(Math.random() * numFiles) + 1
 
    // return link to random image file
    return `http://localhost:${process.env.PORT}/image?image=` + num + '.jpeg'
  }
  
  catch (err) {return err}
}

async function randomFileName() {
  
  try {
    const files = await fsProm.readdir('./images/client/random/small')
    
    let numFiles = files.length
    let num = Math.floor(Math.random() * numFiles) + 1
    
    // return just file name of random image file
    return num + '.jpeg'
  }
  
  catch (err) {return err}
}

async function getFile() {
 
  const url = '/getImage?responseType=file'
  

    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFile(`.images/readme/image.jpg`, buffer, () =>
        console.log('finished downloading!'));
 
}

exports.randomFile = randomFile;
exports.getFile = getFile;
exports.randomFileName = randomFileName;






