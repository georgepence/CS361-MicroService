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
  
  // Function that returns a Promise which resolves to Google search results.
  // Search results are limited to 10 images.
  // function fetchGoogle(url) {
  
  return new Promise((res, rej) => {
    request(url, {json: true}, function (error, response, body) {
      // console.log("body = ", body, body.error, typeof body, typeof body.error)   // TODO
      if (body.error) {
        res(body)
  
      } else if (body.items.length === 0) {
        res({ error: "The search returned no results. Try a different search." })
        
      } else {
        
        for (let i = 0; i < body.items.length; i++) {
          console.log(body.items[i].link)
        }

        let sourceUrl = findRandomImage(body.items);
        
        res(sourceUrl);
        
      }
      
    })
  })
}

exports.search = googleSearch;