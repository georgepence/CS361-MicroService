const emailError = require('./emailError');
const queryDb = require('../database/dbcon');
const flickrSearch = require('./helpers');
require('dotenv').config();

// Initialize RandomUrls table to hold 20 random urls from Flickr

async function deleteUrls(cacheStatus, cacheSize) {
  for (let i = 1; i <= cacheSize - cacheStatus.desiredCacheSize; i++) {
    
    let oldestUrl = await queryDb(
        'select min(`RandomUrls`.`id`) as `oldest` from `RandomUrls`;',
        []
    )
        .then((result) => {
          
          let dbRsponse = queryDb(
              'delete from `RandomUrls` where `RandomUrls`.`id` = ' + `${result[0].oldest};`,
              []
          )
  
          console.log(" >>>>> In createCache, just deleted an url")
          console.log("DB Response : ", dbRsponse)
        })
        .catch((err) => console.log("Cache is empty", err))
        .finally(() => {})
  }
}

async function addUrls(cacheStatus, cacheSize) {
  for (let i = 1; i <= cacheStatus.desiredCacheSize - cacheSize; i++) {
    
    let url = await flickrSearch.getFilePath({
      response_type: 'random',
      flickrSearch: 'flickrSearch'
    })
        .catch(err => isError = true);
    
    
    let result = await queryDb(
        'insert into RandomUrls (`url`) values (?)',
        [url.originalUrl]
    )
        .catch(err => isError = true)
        .finally(() => {});
  }
}

async function checkCacheSize() {
  let cacheSize = await queryDb(
      'select count(`RandomUrls`.`url`) as `count` from `RandomUrls`;',
      []
  )
  return cacheSize[0].count
}

async function fillCache(cacheStatus) {
  
  let isError = false;
  let cacheSize = await checkCacheSize();
  
  cacheStatus.needsUpdate = !(cacheSize === cacheStatus.desiredCacheSize);
  
  console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
  console.log(`S T A R T I N G      U P D A T E\n`, cacheStatus)
  console.log("in fillCache, cacheSize = ", cacheSize,"Desired cache = ", cacheStatus.desiredCacheSize)
  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`)
  
  if (cacheStatus.updating) {
    console.log("In fillCache.  Can't update at this time");
  } else {
    cacheStatus.updating = true
    while (cacheStatus.needsUpdate) {
      if (cacheSize > cacheStatus.desiredCacheSize) {
        await deleteUrls(cacheStatus, cacheSize)
      }
      if (cacheSize < cacheStatus.desiredCacheSize) {
        await addUrls(cacheStatus, cacheSize)
      }
      cacheSize = await checkCacheSize();
      console.log("In createCache.fillCache, while loop, size =", cacheSize, typeof cacheSize, typeof cacheStatus.desiredCacheSize)
      cacheStatus.needsUpdate = !(cacheSize === cacheStatus.desiredCacheSize);
    }
  }
  cacheStatus.updating = false
  console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
  console.log(`F I N I S H E D      U P D A T E\n`, cacheStatus, "cacheSize = ", cacheSize);
  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`)
}

exports.fillCache = fillCache;