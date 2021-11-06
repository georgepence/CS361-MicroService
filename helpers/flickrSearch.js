let request = require('request');
let parseString = require('xml2js').parseString;
let apiKey = 'api_key=f05fe4b6609f1ceb4f6ca45a9158f361';
let userId = 'user_id=32758310%40N04'
let groupId = 'group_id=34427469792%40N01'

let method;

async function search(args) {
  
  let url = 'https://www.flickr.com/services/rest/?';
  let page = args.randomPage ? `page=${args.randomPage}&` : ''
  
  if (args.searchTerms || !args.searchTerms === 'random') {
    
    // ======= --->>>>   OBTAIN IMAGE URL FROM KEYWORD SEARCH   <<<<--- =======
    
    method = 'method=flickr.photos.search'
    url += `${method}&${apiKey}&tags=${args.searchTerms}&${page}format=json&nojsoncallback=1`
    
  } else {
    // ======= --->>>>   OBTAIN IMAGE URL FROM RANDOM SEARCH    <<<<--- =======
    
    method  = 'method=flickr.groups.pools.getPhotos'
    url += `${method}&${apiKey}&${groupId}&${page}format=json&nojsoncallback=1`
  }
  console.log("In flickrSearch. url =", url);
  // Function that returns a Promise which resolves to JSON search results.
  
  return new Promise((res, rej) => {
    request(url, {json: true}, function (error, response, body) {

      if (!body.photos) {
        console.log("error")
        res(body);
      }
      if (body.photos.photo.length === 0) {console.log(body)}
      res(body.photos);
      
    })
    
  })
}


exports.search = search;