let request = require('request');
let parseString = require('xml2js').parseString;
let apiKey = 'api_key=f05fe4b6609f1ceb4f6ca45a9158f361';
let userId = 'user_id=32758310%40N04'
let url = 'https://www.flickr.com/services/rest/?';
let method;

async function search(args) {
  
  if (args.searchTerms || !args.searchTerms === 'random') {
    method = 'method=flickr.photos.search'
    url += `${method}&${apiKey}&tags=${args.searchTerms}&per_page=20&format=rest&nojsoncallback=1`
  } else {
    method  = 'method=flickr.photos.getPopular'
    url += `${method}&${apiKey}&${userId}&tags=${args.searchTerms}&per_page=20&format=json&nojsoncallback=1`
  }
  console.log("url =", url);
  // Function that returns a Promise which resolves to Flickr XML search results.
  
  return new Promise((res, rej) => {
    request(url, {json: true}, function (error, response, body) {

      if (body.stat !== "ok") {
        console.log("error")
        res(body);
      }
      
      console.log("sending photos")
      res(body.photos.photo);
      
    })
    
  })
}


exports.search = search;