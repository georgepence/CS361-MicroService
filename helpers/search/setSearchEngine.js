const flickrSearch = require('./flickrSearch');
const googleSearch = require('./googleSearch');
const cacheSearch = require('./cacheSearch');
const e = require("express");

function setSearchEngine(clientReq) {
 
  if ((clientReq.response_type === 'random') &&
      !clientReq.width &&
      !clientReq.height) {

   return cacheSearch;
  }  else {
    return  googleSearch;
  }

}

module.exports = setSearchEngine