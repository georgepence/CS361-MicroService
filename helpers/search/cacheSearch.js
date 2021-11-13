const queryDb = require("../../database/dbcon");
const dbQueries = require('../../database/dbQueries')
const deleteUrl = require('../cache/deleteUrl');
const createCache = require("../updateCache");


async function cacheSearch(clientReq, cacheStatus) {
  
  let query = dbQueries.fetchFromCache;
  cacheStatus.unfinishedGets += 1;
  
  let dbResponse = await queryDb( query, [] );
  
  if (dbResponse.error) {
    return dbResponse.error;
  }
  
  let sourceUrl = dbResponse[0].url;
  
  await deleteUrl().then(() => {
    cacheStatus.unfinishedGets -= 1;

    if (!cacheStatus.unfinishedGets) {
      createCache.fillCache(cacheStatus);
    }
  });
  
  return sourceUrl
  
}

exports.search = cacheSearch;


