const queryDb = require('../../database/dbcon');
const dbQueries = require('../../database/dbQueries')

// Delete a url from RandomUrls table

async function deleteUrl() {
  
  let dbResponse = await queryDb( dbQueries.deleteFromCache,  [] );
 
  if ( dbResponse.error === true ) {
    return dbResponse
  }
}

module.exports = deleteUrl