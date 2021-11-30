const checkCacheSize = require('./cache/checkCacheSize');
const deleteUrls = require('./cache/deleteUrls');
const addUrls = require('./cache/addUrls');
require('dotenv').config();

// Manage size of flickr image link cache stored in db table RandomUrls table

async function fillCache(cacheStatus) {
  
  let cacheSize = await checkCacheSize();
  
  cacheStatus.needsUpdate = !(cacheSize === cacheStatus.desiredCacheSize);
  
  if (cacheStatus.updating || cacheStatus.unfinishedGets) {
  
  } else {

      if (cacheSize > cacheStatus.desiredCacheSize && !cacheStatus.updating && !cacheStatus.unfinishedGets) {
        cacheStatus.updating = true
        await deleteUrls(cacheStatus, cacheSize)
        
      }
      if (cacheSize < cacheStatus.desiredCacheSize && !cacheStatus.updating && !cacheStatus.unfinishedGets) {
        cacheStatus.updating = true
        await addUrls(cacheStatus, cacheSize)
      }
      cacheSize = await checkCacheSize();
      cacheStatus.needsUpdate = !(cacheSize === cacheStatus.desiredCacheSize);
  }
  cacheStatus.updating = false
}

exports.fillCache = fillCache;