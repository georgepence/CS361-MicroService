const flickrSearch = require('./flickrSearch');
const googleSearch = require('./googleSearch');
const cacheSearch = require('./cacheSearch');
const e = require("express");

function setSearchEngine(clientReq, googleStatus) {
 
  if ((clientReq.response_type === 'random') &&
      !clientReq.width &&
      !clientReq.height) {

   return cacheSearch;
   
  }  else if(googleStatus.quotaLimitReached || googleStatus.failedSearch) {
    return flickrSearch;
    
  } else {
    return  googleSearch;
  }

}

module.exports = setSearchEngine