let request = require('request');
require('dotenv').config();

let apiKey = 'api_key=' + process.env.FLICKR_KEY;
let groupId = 'group_id=34427469792%40N01';

let method;

async function search(args) {
  
  let url = 'https://www.flickr.com/services/rest/?';
  let page = args.randomPage ? `page=${args.randomPage}&` : 'page=1'
  
  if (args.searchTerms || !args.searchTerms === 'random') {
    
    // ======= --->>>>   OBTAIN IMAGE URL FROM KEYWORD SEARCH   <<<<--- =======
    
    method = 'method=flickr.photos.search'
    url += `${method}&${apiKey}&tags=${args.searchTerms}&${page}&format=json&nojsoncallback=1`
    
  } else {
    // ======= --->>>>   OBTAIN IMAGE URL FROM RANDOM SEARCH    <<<<--- =======
    
    method  = 'method=flickr.groups.pools.getPhotos'
    url += `${method}&${apiKey}&${groupId}&${page}format=json&nojsoncallback=1`
  }

  // Function that returns a Promise which resolves to JSON search results.
  
  return new Promise((res, rej) => {
  
    console.log(`At flickrSearch top: ${JSON.stringify(args)}`)
    request(url, {json: true}, function (error, response, body) {
      
      if (error) {
        console.log(`flickrSearch error: error= \n ${error}`)
        res({ error: body });
      }
      
      if (!body.photos || body.photos.photo.length === 0) {
        console.log(`flickrSearch error: !body.photos, body= \n ${body}`)
        res({ error: body });
      }
      
      if (args.searchTerms && !(args.response_type === 'random')) {
        let idx = Math.floor(Math.random() * body.photos.photo.length);
        let photo = body.photos.photo[idx];
        res(`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`)
      }
      
      res(body.photos);
      
    })
    
  })
}

exports.search = search;