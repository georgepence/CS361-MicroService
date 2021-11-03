const express = require('express');
const request = require('request');
const cors = require('cors');
const fs = require('fs');
const https = require('https');                           // TODO
// const http = require('http');                          // TODO
require('dotenv').config();
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');
const logFile = require('./helpers/logFile');
const emailError = require('./helpers/emailError');
const googleSearch = require('./helpers/googleSearch');
const flickrSearch = require('./helpers/flickrSearch')
const port = process.env.PORT || 5000;
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


// ======  >>>>    MAIN PATH TO GET IMAGES    <<<<  ===========================

app.get('/getImage', ((req, res) => {

  async function fetchImage(req) {

    // Get location of image to send client
    let url = await helpers.getFilePath(req.query);
  
    // Capture info to logging

    // let reqQuery = req.query === {} ? "none" : JSON.stringify(req.query);  //T ODO
    let reqInfo = {
      userInfo: JSON.stringify(req.headers["user-agent"]),
      reqQuery: !req.query ? "none" : JSON.stringify(req.query),
      urlResult: url.original
    }
    
    let requestHeaders = JSON.stringify(req.headers["user-agent"])
    
    console.log("URL = ", url);       //  TODO
    
    if (url.error) {
      res.send(url.error);
      emailError.send(`<p>Error getting image url</p><p>${url.error}</p>`)
          .catch((err) => console.log("error", err))
    }
    
    if (req.query.response_type === "link") {
      res.json(url.host + '/image?image=' + url.filePath + url.fileName)
  
    } else if (req.query.response_type === "random") {
      res.json(url.original);
      
    } else {
      try {
        res.sendFile(`${__dirname}/images/client/${url.filePath}${url.fileName}`)

      } catch (error) {
        emailError.send(`<p>Error with sendFile in server</p><p>${error}</p>`)
            .catch((err) => console.log("error", err))
      }
    }
    
    // Add results to log file
    if (process.env.NODE_ENV === 'production') { logFile.createLog(reqInfo) }
    
  }

  fetchImage(req).finally(() =>{})

}))


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
        res.send(result)
      })
}))

// +++++++++++=  TEST PATH ++++++++++++++++++++++++++++++++++++++++++++++++++++

// Without middleware
app.get('/test2', function(req, res){
  var options = {
    root: path.join(__dirname, '/images/client/')
  };

  var fileName = 'chico.txt';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

// +++++++++++=  END TEST PATH ++++++++++++++++++++++++++++++++++++++++++++++++

app.get('/image', (req, res) => {
  let image = req.query.image
  res.sendFile(__dirname + '/images/client/' + image)
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
  res.send('500 - Server Error');
});

app.listen(port, ()=> console.log(`server started on port ${port}.`));
