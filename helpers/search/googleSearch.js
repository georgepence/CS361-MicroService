const request = require('request');
const findRandomImage = require('./helpers/findRandomImage')
require('dotenv').config();

async function googleSearch(clientReq) {
  
  let searchTerms = clientReq.searchTerms || "random";
  let imgSize = clientReq.imgSize || "xlarge";
  let start = clientReq.start || 1;
  let apiKey = process.env.GOOGLE_KEY;
  let url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}`
  url += `&q=${searchTerms}&imgSize=${imgSize}&start=${start}&fileType=jpg&searchType=image`
  
  // Returns a Promise which resolves to Google search results.
  // Search results are limited to 10 images.
  
  return new Promise((res, rej) => {
    console.log(`At googleSearch top: ${JSON.stringify(clientReq)}`)
    request(url, {json: true}, function (error, response, body) {
  
      if (error) {
        console.log(`googleSearch error: error= \n ${error}`)
        res({ error: body });
      }
      
      if (body.error) {
        console.log(`googleSearch error: error= \n ${body.error}`)
        res({ error: body.error });
  
      } else if (body.items.length === 0) {
        res({ error: `The search returned no results. Try a different search. ${body}` })
        
      } else {
        let sourceUrl = findRandomImage(body.items);
        
        res(sourceUrl);
        
      }
      
    })
  })
}

exports.search = googleSearch;