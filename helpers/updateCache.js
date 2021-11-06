const emailError = require('./emailError');
const queryDb = require('../database/dbcon');
const flickrSearch = require('./helpers');
const createCache = require('./createCache');
require('dotenv').config();

let desiredCache = parseInt(process.env.CACHE_SIZE) || 50

async function Insert(url) {
    

    console.log("In insert... url = ", url)
    
    let result = await queryDb(
        'insert into RandomUrls (`url`) values (?)',
        [url]
    )
        .catch(err => isError = true)
        .finally(() => console.log(`Finished adding to cache to ${url.originalUrl}`));
  
}

async function Delete() {
  
  let oldestUrl = await queryDb(
      'select min(`RandomUrls`.`id`) as `oldest` from `RandomUrls`;',
      []
  )
      .then((result) => {
        
        let dbRsponse = queryDb(
            'delete from `RandomUrls` where `RandomUrls`.`id` = ' + `${result[0].oldest};`,
            []
        )
        console.log("DB Response : ", dbRsponse)
      })
      .catch((err) => console.log("Cache is empty", err))
      .finally(() => console.log(`Finished reducing cache to ${desiredCache}`))
}

async function Update() {
  
  console.log("In Update")
  let url = await flickrSearch.getFilePath({
    response_type: 'random',
    flickrSearch: 'flickrSearch'
  })
      .catch(err => isError = true);
  
  await Insert(url.originalUrl)
      .then(() => Delete())
      .finally(() => {
    
  });
  
  let cacheSize = await queryDb(
      'select count(`RandomUrls`.`url`) as `count` from `RandomUrls`;',
      []
  )
  cacheSize = cacheSize[0].count
  console.log("Who are you? ", cacheSize, typeof cacheSize, desiredCache, typeof desiredCache)
  
  if (cacheSize !== desiredCache) {
    let message = `<p>Error: cache size should be ${desiredCache}, but it is ${cacheSize}</p>`;
    emailError.send(message);
    console.log(message);
    createCache.fillCache();
    }
    
}

exports.Update = Update;
exports.Delete = Delete;