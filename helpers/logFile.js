const fsProm = require('fs/promises');
const fs = require('fs');
const path = require('path');
const emailError = require('./emailError');
const queryDb = require('../database/dbcon')
require('dotenv').config();


// ============================================================================

// Take arguments (args) and return { host, fileName, filePath } of image
async function createLog(reqInfo) {
  
  //
  // console.log(reqInfo.reqQuery, "typeof", typeof reqInfo.reqQuery)
  // console.log("reqInfo = ", reqInfo);
  // reqInfo.reqQuery = `'${JSON.parse(reqInfo.reqQuery)}'`
  // console.log(reqInfo.reqQuery, "typeof", typeof reqInfo.reqQuery)
  
  try {
    let result = await queryDb(
        'insert into ImageServerLog (`userInfo`, `reqQuery`, `urlResult`) values (?, ?, ?)',
        [JSON.parse(reqInfo.userInfo), reqInfo.reqQuery, reqInfo.urlResult]
    );
    console.log({"success": true, "operation": "insert"});
  } catch (e) {
    console.log(e);
    console.log({"success": false});
  }
  
  
  // const files = await fsProm.readdir('./.logs')
  //
  // let thisLog = "./.logs/" + (files.length + 1) + ".log"
  //
  // let divider = "=".repeat(80)
  //
  // console.log(divider, `\n`, req, res)
  //
  // let content = divider + `\n\n` + req + `\n\n` + divider + `\n\n` + res.toString()
  // fs.writeFile(thisLog, content, (err) => {
  //   if (err) {
  //     let message = `<p>Error creating log file ${thisLog}</p><p>${e}</p>`
  //     emailError.send(message)
  //     console.log("Error writing log file", err)
  //   }
  // })
}

exports.createLog = createLog;