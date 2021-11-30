const path = require("path");

async function findRandomImage(results) {
  let foundImage = false;
  let idx, imageExt, sourceUrl;
  
  while (!foundImage && results.length > 0) {
    idx = Math.floor(Math.random() * results.length);
    sourceUrl = results[idx].link;
    
    if (sourceUrl.includes('?')) {
      imageExt = path.extname(sourceUrl)
          .substring(0, path.extname(sourceUrl).indexOf('?'));
      sourceUrl = sourceUrl.substring(0, sourceUrl.indexOf('?'));
      
    } else {
      imageExt = path.extname(sourceUrl)
    }
  
    if (!['.jpg', '.png', '.tif', '.tiff', '.jpeg'].includes(imageExt) ||
    sourceUrl.toLowerCase().includes('download')) {
      results.splice(idx, 1);
    } else {
      foundImage = true;
    }
  
  }
  if (foundImage) {
    return sourceUrl;
    
  } else {
    return { error: "No valid search results returned.  Try a different search." }
  }
}

module.exports = findRandomImage