const queryDb = require('../../database/dbcon');
const getRandomUrl = require("./getRandomUrl");
const getCacheSize = require('./checkCacheSize')

// Delete a url from RandomUrls table

async function addUrls(cacheStatus, cacheSize) {
  
  let addNumber = cacheStatus.desiredCacheSize - cacheSize;
  let needToAdd = addNumber > 0
  
  while (needToAdd) {
    
    let url = await getRandomUrl()
        .catch(err => {console.log(err)});
    
    await queryDb(
        'insert into RandomUrls (`url`) values (?)',
        [url]
    )
        .catch(err => console.log(err))
        .finally(() => {});
    
    cacheSize = getCacheSize();
    needToAdd = cacheStatus.desiredCacheSize < cacheSize
  }
}

module.exports = addUrls