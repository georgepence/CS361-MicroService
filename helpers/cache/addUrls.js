const queryDb = require('../../database/dbcon');
const getRandomUrl = require("./getRandomUrl");
const getCacheSize = require('./checkCacheSize')


async function addUrls(cacheStatus, cacheSize) {
  
  let addNumber = cacheStatus.desiredCacheSize - cacheSize;
  let needToAdd = addNumber > 0
  
  while (needToAdd) {
    console.log(`In addUrls, while loop top cacheSize = ${cacheSize}`)  // todo
    let url = await getRandomUrl()
        .catch(err => {console.log("Error in addUrls", err)});
    console.log(`In addUrls, got flickr, cacheSize    = ${cacheSize}`)  // todo


    await queryDb(
        'insert into RandomUrls (`url`) values (?)',
        [url]
    )
        .catch(err => console.log(err))
        .finally(() => {console.log(`In addUrls, onFinally , cacheSize    = ${cacheSize}`)});  // todo
    console.log(`In addUrls, afterFinally, cacheSize  = ${cacheSize}`)  // todo
    cacheSize = await getCacheSize();
    needToAdd = cacheStatus.desiredCacheSize > cacheSize
    console.log(`In addUrls, end while , cacheSize    = ${cacheSize}`)  // todo
  }
}

module.exports = addUrls