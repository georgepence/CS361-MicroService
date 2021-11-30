const express = require('express');
const bodyParser = require('body-parser');
const helpers = require('./helpers/getImage');
const updateCache = require('./helpers/updateCache');
const logFile = require('./helpers/utilities/logFile');
const clearImageFiles = require('./helpers/utilities/deleteAllFiles');

const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

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
const clearingImageFile = { status: true };
const googleStatus = {
  failedSearch: false,
  quotaLimitReached: false
};

clearImageFiles('./images/client/general', clearingImageFile);
updateCache.fillCache(cacheStatus).then(() => {});


// ======  >>>>    MAIN PATH TO GET IMAGES    <<<<  ===========================

app.get('/getImage', ((req, res) => {

  async function fetchImage(req) {
    
    if (!(req.query.response_type === 'random') && !req.query.searchTerms) {
      req.query.response_type = 'random'
    }
    
    // Get location of image to send client
    let image = await helpers.getImage(req.query, cacheStatus, googleStatus);
    
    // If error: re-do search as flickr search
    if (image.error) {
      googleStatus.failedSearch = true;
      image = await helpers.getImage(req.query, cacheStatus, googleStatus);

      // If still error, send error message back to client
      if (image.error) {
        res.send(image);
        console.log("error", image)
        
      } else {
        // Send link or file, based on client url request query arguments

        // Send link to processed image on server (keyword search, response_type=link)
        if (req.query.response_type === "link") {
          res.json(image.host + '/image?image=' + image.filePath + image.fileName)

          // Send link to original image from external site (response_type=random)
        } else if (req.query.response_type === "random") {
          res.json(image.sourceUrl);

          // Send image file from server (keyword search, response_type=file)
        } else {
          try {
            res.sendFile(`${__dirname}${image.filePath}${image.fileName}`)
          } catch (error) {
            console.log("error", error)
          }
        }
      }

    } else {
      // Send link or file, based on client url request query arguments
      
      // Send link to processed image on server (keyword search, response_type=link)
      if (req.query.response_type === "link") {
        res.json(image.host + '/image?image=' + image.filePath + image.fileName)
    
        // Send link to original image from external site (response_type=random)
      } else if (req.query.response_type === "random") {
        res.json(image.sourceUrl);
    
        // Send image file from server (keyword search, response_type=file)
      } else {
        try {
          res.sendFile(`${__dirname}${image.filePath}${image.fileName}`)
        } catch (error) {
          console.log("error", error)
        }
      }
    }
    
    // Create log entry in db log table
    if (process.env.NODE_ENV === 'production') { logFile.writeEntry(req, image) }
  }

  fetchImage(req).finally(() =>{})

}))


// This route serves a server image file
// Query format:  http://host/image?image=filename.jpg
// Filename query argument must include path, i.e., /images/client/general/

app.get('/image', (req, res) => {
  let image = req.query.image
  console.log("In /image", req.query.image, __dirname)
  res.sendFile(__dirname + image)
})


// Message on simple GET request with no parameters
app.get('/', ((req, res) => {
  let message = "API message:  call for images using route /getImage"
  message = JSON.stringify(message)
  res.send(message)
}));


// Error handling

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


// Listen
app.listen(port, ()=> console.log(`server started on port ${port}.`));
