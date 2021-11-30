const deleteUrl = require('./deleteUrl');

// Delete urls from RandomUrls table

async function deleteUrls(cacheStatus, cacheSize) {
  
  for (let i = 1; i <= cacheSize - cacheStatus.desiredCacheSize; i++) {
    
    await deleteUrl();
    
  }
}

module.exports = deleteUrls