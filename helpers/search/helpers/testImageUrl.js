// const request = require("request");    todo
// const path = require("path");
//
// async function testImageUrl (sourceUrl, foundImage, results, idx) {
//   // let good = { status: false }   todo
//   let imageExt
//
//   // Remove any query items
//   if (sourceUrl.includes('?')) {
//     imageExt = path.extname(sourceUrl)
//         .substring(0, path.extname(sourceUrl).indexOf('?'));
//     sourceUrl = sourceUrl.substring(0, sourceUrl.indexOf('?'));
//
//   } else {
//     imageExt = path.extname(sourceUrl)
//   }
//
//   await request(sourceUrl, function(err, response, body) {
//
//     if (!err && response.statusCode < 400) {
//       if (!['.jpg', '.png', '.tif', '.tiff', '.jpeg'].includes(imageExt) ||
//           sourceUrl.toLowerCase().includes('download')) {
//         results.splice(idx, 1);
//         return false
//       } else {
//         return true
//       }
//
//     } else {
//       return false;
//     }
//   })
//
// }
//
// module.exports = testImageUrl;