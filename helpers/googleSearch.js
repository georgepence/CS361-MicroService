let request = require('request');

async function googleSearch(args) {
  
  let searchTerms = args.searchTerms || "random"
  const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAqsEc83ZtQM-aUDoxqyUSKZ4nK6gyXRAg&cx=1d51ed3d0c23e53c2&q=${searchTerms}&imgSize=${args.imgSize}&start=${args.start}&searchType=image`
  
  // Function that returns a Promise which resolves to Google search results.
  // Search results are limited to 10 images.
  // function fetchGoogle(url) {
  
  return new Promise((res, rej) => {
    request(url, {json: true}, function (error, response, body) {
      
      if (body.error) {
        res(body)
        
      } else {
        
        res(body.items)
      }
      
    })
  })
}

exports.googleSearch = googleSearch;