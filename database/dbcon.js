const mysql = require('mysql');
require('dotenv').config();

// init mysql
const pool = mysql.createPool({
  connectionLimit: 10, // this is the default
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB,
  dateStrings: true,
});

// wrapper that makes pool queries return a promise
function promisePool(query, vars){
  return new Promise((res, rej) => {

    pool.query(query, vars, (err, rows, fields) => {
      if (err){
        console.log("Here in dbcon error:  rej = ", err);
        rej(err);
        
      } else {
        res(rows);
      }
    })
  });
}

module.exports = promisePool