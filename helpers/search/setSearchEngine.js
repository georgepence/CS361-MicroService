const flickrSearch = require('./flickrSearch');
const googleSearch = require('./googleSearch');
const cacheSearch = require('./cacheSearch');
const e = require("express");

function setSearchEngine(clientReq, googleStatus) {

  if ((clientReq.response_type === 'random') &&
      !clientReq.width &&
      !clientReq.height) {
    console.log("Engine = cacheSearch")   // todo
    return cacheSearch;

  } else if (googleStatus.quotaLimitReached || googleStatus.failedSearch) {
    console.log("Engine = flickrSearch")   // todo
    return flickrSearch;

  } else {
    console.log("Engine = googleSearch")   // todo
    return googleSearch;
  }

}

module.exports = setSearchEngine