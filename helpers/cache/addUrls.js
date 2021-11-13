const queryDb = require('../../database/dbcon');
const getRandomUrl = require("./getRandomUrl");
const getCacheSize = require('./checkCacheSize')


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
    
    cacheSize = await getCacheSize();
    needToAdd = cacheStatus.desiredCacheSize > cacheSize
    console.log("AddUrls: Need to Add = ", needToAdd, cacheSize, cacheStatus.desiredCacheSize)
  }
}

module.exports = addUrls