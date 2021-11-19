/**
 * Write a log entry to the database showing client browser information,
 * query and result.  This only runs when the app is deployed.
 */

const queryDb = require('../../database/dbcon')
// const emailError = require('./emailError') // TODO: I'll need this later
require('dotenv').config();

// CODE TO INSERT QUERY DATA & RESULT INFO INTO LOG ON DATABASE

async function writeEntry(req, imageInfo) {
  
  let userInfo = JSON.stringify(req.headers["user-agent"]);
  let reqQuery = !req.query ? "none" : JSON.stringify(req.query)
  let urlResult = (
      imageInfo.sourceUrl ?
      imageInfo.sourceUrl :
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
    console.log({"success": false});        // TODO: MODULARIZE ERROR HANDLING
  }
}

exports.writeEntry = writeEntry;