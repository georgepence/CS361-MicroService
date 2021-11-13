const queryDb = require('../../database/dbcon')
const emailError = require('./emailError')
require('dotenv').config();


// CODE TO INSERT QUERY DATA & RESULT INFO INTO LOG ON DATABASE

// todo: Does this need to be async ???

async function writeEntry(req, imageInfo) {
  
  let userInfo = JSON.stringify(req.headers["user-agent"]);
  let reqQuery = !req.query ? "none" : JSON.stringify(req.query)
  let urlResult = (
      imageInfo.originalUrl ?
      imageInfo.originalUrl :
      imageInfo.host + '/image?image=' + imageInfo.filePath + imageInfo.fileName
  )
 
  try {
    await queryDb(
        'insert into ImageServerLog (`userInfo`, `reqQuery`, `urlResult`) values (?, ?, ?)',
        [JSON.parse(userInfo), reqQuery, urlResult]
    );
    console.log({"success": true, "operation": "insert"});
  } catch (e) {
    console.log(e);
    console.log({"success": false});   // TODO: MODULARIZE ERROR HANDLING
  }
}

exports.writeEntry = writeEntry;