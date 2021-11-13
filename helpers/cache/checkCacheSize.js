const queryDb = require("../../database/dbcon");

async function checkCacheSize() {
  
  let cacheSize = await queryDb(
        'select count(`RandomUrls`.`url`) as `count` from `RandomUrls`;',
        []
  )
  
    return cacheSize[0].count
}

module.exports = checkCacheSize