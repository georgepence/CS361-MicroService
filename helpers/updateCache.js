const checkCacheSize = require('./cache/checkCacheSize');
const deleteUrls = require('./cache/deleteUrls');
const addUrls = require('./cache/addUrls');
require('dotenv').config();

// Manage size of flickr image link cache stored in db table RandomUrls table

async function fillCache(cacheStatus) {
  
  let cacheSize = await checkCacheSize();
  
  cacheStatus.needsUpdate = !(cacheSize === cacheStatus.desiredCacheSize);
  
  console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)  // TODO
  console.log(`S T A R T I N G      C A C H E      U P D A T E         cacheSize =`, cacheSize)
  console.log('updating:', cacheStatus.updating, '  needsUpdate:', cacheStatus.needsUpdate, '  desiredCacheSize:', cacheStatus.desiredCacheSize, '  unfinishedGets:', cacheStatus.unfinishedGets)
  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`)
  
  if (cacheStatus.updating || cacheStatus.unfinishedGets) {
    console.log("In fillCache.  Can't update at this time", cacheStatus);
  
  } else {

    console.log('In updateCache, starting')
    console.log('booleans', 'size > desired', cacheSize > cacheStatus.desiredCacheSize, '!updating', !cacheStatus.updating, '!unfinished', !cacheStatus.unfinishedGets)
    // while (cacheStatus.needsUpdate) {
      if (cacheSize > cacheStatus.desiredCacheSize && !cacheStatus.updating && !cacheStatus.unfinishedGets) {
        cacheStatus.updating = true
        await deleteUrls(cacheStatus, cacheSize)
        
      }
      if (cacheSize < cacheStatus.desiredCacheSize && !cacheStatus.updating && !cacheStatus.unfinishedGets) {
        cacheStatus.updating = true
        await addUrls(cacheStatus, cacheSize)
      }
      cacheSize = await checkCacheSize();
      console.log("In updateCache - finished ? , size =", cacheSize, typeof cacheSize, typeof cacheStatus.desiredCacheSize)
      cacheStatus.needsUpdate = !(cacheSize === cacheStatus.desiredCacheSize);
    // }
  }
  cacheStatus.updating = false
  
  console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)  // TODO
  console.log(`F I N I S H E D      C A C H E      U P D A T E         cacheSize =`, cacheSize);
  console.log('updating:', cacheStatus.updating, '  needsUpdate:', cacheStatus.needsUpdate, '  desiredCacheSize:', cacheStatus.desiredCacheSize, '  unfinishedGets:', cacheStatus.unfinishedGets)
  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`)
}

exports.fillCache = fillCache;