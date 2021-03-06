const flickrSearch = require('./flickrSearch');
const googleSearch = require('./googleSearch');
const cacheSearch = require('./cacheSearch');

function setSearchEngine(clientReq, googleStatus) {

  if ((clientReq.response_type === 'random') &&
      !clientReq.width &&
      !clientReq.height) {
    return cacheSearch;

  } else if (googleStatus.quotaLimitReached || googleStatus.failedSearch) {
    googleStatus.failedSearch = false;
    return flickrSearch;

  } else {
    return googleSearch;
  }

}

module.exports = setSearchEngine