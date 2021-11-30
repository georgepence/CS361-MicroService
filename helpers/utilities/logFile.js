/**
 * Write a log entry to the database showing client browser information,
 * query and result.  This only runs when the app is deployed.
 */

const queryDb = require('../../database/dbcon')
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

  } catch (e) {
    console.log(e);
  }
}

exports.writeEntry = writeEntry;