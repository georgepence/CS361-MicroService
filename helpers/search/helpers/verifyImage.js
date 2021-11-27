// const path = require('path');    todo
// const testImageUrl = require('./testImageUrl')
//
//
// async function verifyImage(results) {
//   let idx, sourceUrl;
//   let foundImage = false;
//   let result = {};
//
//
//     console.log(`In verifyImage, top while loop, results.length  = ${results.length}`)
//
//     idx = Math.floor(Math.random() * results.length);
//     sourceUrl = results[idx].link;
//
//   console.log(`In verifyImage, before testImage, results.length        = ${results.length}`)
//   foundImage = await testImageUrl(sourceUrl, foundImage, results, idx);
//     console.log(`In verifyImage, after testImage, results.length        = ${results.length}`)
//
//   if (foundImage) {
//     result = { foundImage: foundImage, sourceUrl: sourceUrl }
//     console.log(result)
//   } else {
//     result = { foundImage: foundImage, sourceUrl: '' }
//     console.log(result)
//   }
//   console.log(`Returning from verifyImage, result        = ${result.foundImage}, ${result.sourceUrl}`)
//   return result
//
// }
//
// module.exports = verifyImage;
//


