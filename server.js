const express = require('express');
const request = require('request');
const cors = require('cors');
const fs = require('fs');                              // TODO
// const https = require('https');                        // TODO
// const http = require('http');                          // TODO
require('dotenv').config();
const bodyParser = require('body-parser');
const helpers = require('./helpers/getImage');
const createCache = require('./helpers/updateCache');
// const updateCache = require('./helpers/updateCache');  // TODO
const logFile = require('./helpers/utilities/logFile');
const pause = require('./helpers/utilities/pause');
const emailError = require('./helpers/utilities/emailError');
const googleSearch = require('./helpers/search/googleSearch');
const flickrSearch = require('./helpers/search/flickrSearch')
const port = process.env.PORT || 5000;
// const path = require('path');                          // TODO

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

const cacheStatus = {
  updating: false,
  needsUpdate: false,
  desiredCacheSize: parseInt(process.env.CACHE_SIZE) || 100,
  unfinishedGets: 0
}

const googleStatus = {
  quotaLimitReached: true
}

createCache.fillCache(cacheStatus).then(() => {});

// ======  >>>>    MAIN PATH TO GET IMAGES    <<<<  ===========================

app.get('/getImage', ((req, res) => {

  async function fetchImage(req) {

    // TODO:  This needs to be handled differently
    if (!(req.query.response_type === 'random') && !req.query.searchTerms) {
      req.query.response_type = 'random'
    }
    
    // Get location of image to send client
    let image = await helpers.getImage(req.query, cacheStatus, googleStatus);
    
    console.log("server.js says I got imageInfo --> ", image);       //  TODO
    
    if (image.error) {
      res.send(image.error === true);
      emailError.send(`<p>Error getting image url</p><p>${image.error}</p>`)
          .catch((err) => console.log("error", err))
    } else {
  
      if (req.query.response_type === "link") {
        res.json(image.host + '/image?image=' + image.filePath + image.fileName)
    
      } else if (req.query.response_type === "random") {
        res.json(image.sourceUrl);
    
      } else {
        try {
          res.sendFile(`${__dirname}${image.filePath}${image.fileName}`)
      
        } catch (error) {
          emailError.send(`<p>Error with sendFile in server</p><p>${error}</p>`)
              .catch((err) => console.log("error", err))
        }
      }
      
    }
    
    
    

    // Create log entry in db log table
    if (process.env.NODE_ENV === 'production') { logFile.writeEntry(req, image) }
  }

  fetchImage(req).finally(() =>{})

}))

// =================  TESTING CACHE OPERATIONS  ===============================

// app.get('/cache', ((req, res) => {
//
//   createCache.fillCache().then((result) => res.json(result) )
//
// }))

// // TODO
// app.get('/updateCache', ((req, res) => {
//
//   updateCache.Update().then((result) => res.json(result) )
//
// }))


// ============================================================================

app.get('/imageSearch', ((req, res) => {

  let args = req.query

  async function fetchGoogle(args) {
    let googleData;
    googleData = await googleSearch.googleSearch(args);

    if (googleData.error) {
      emailError.send(`<p>Error in getFilePath / googleSearch</p><p>${JSON.stringify(googleData)}</p>`)
    }
    return googleData
  }

  fetchGoogle(args).then((result) => res.json(result) )
  
}))

// ===== GOOGLE IMAGE SEARCH ==================================================

app.get('/imageSearchTwo', ((req, res) => {
  const url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAqsEc83ZtQM-aUDoxqyUSKZ4nK6gyXRAg&cx=1d51ed3d0c23e53c2&q=lectures&searchType=imageha'
  
  // Function that returns a Promise which resolves to Google search results.
  // Search results are limited to 10 images.
  function fetchGoogle(url) {
    
    return new Promise((res, rej) => {
      request(url, {json: true}, function (error, response, body) {
        
        if (body.error) {
          rej(body.error.message)
          
        } else {
          res(body.items)
        }
        
      })
    })
  }
  
  fetchGoogle(url)
      .then((result) => {
        res.json(result)
      })
      .catch((err) => {
        let message = `<p>Error in Google search</p><p>${err}</p>`
        emailError.send(message)
            .catch((err) => console.log("error", err))
        res.send(err)
      })
}))

// ===== FLICKR IMAGE SEARCH ==================================================

app.get('/flickrSearch', ((req, res) => {
  
  flickrSearch.search({})
      .then((result) => {
        console.log("result = ", result)
        res.send(result)
      })
}))

// +++++++++++=  TEST PATH ++++++++++++++++++++++++++++++++++++++++++++++++++++

// ToDo

// app.get('/test2', function(req, res){
//   var options = {
//     root: path.join(__dirname, '/images/client/')
//   };
//
//   var fileName = 'chico.txt';
//   res.sendFile(fileName, options, function (err) {
//     if (err) {
//       next(err);
//     } else {
//       console.log('Sent:', fileName);
//     }
//   });
// });

// +++++++++++=  END TEST PATH ++++++++++++++++++++++++++++++++++++++++++++++++

app.get('/image', (req, res) => {
  let image = req.query.image
  console.log("In /image", req.query.image, __dirname)
  res.sendFile(__dirname + image)
})

app.get('/', ((req, res) => {
  let message = "Message from CS361"
  message = JSON.stringify(message)
  res.send(message)
}));


app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Image Server Error');
});

app.listen(port, ()=> console.log(`server started on port ${port}.`));
