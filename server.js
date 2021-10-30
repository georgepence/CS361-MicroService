const express = require('express');
const request = require('request');
const cors = require('cors');
const https = require('https');
// const http = require('http');      todo
require('dotenv').config();
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');
const emailError = require('./helpers/emailError');
const port = process.env.PORT || 5000;
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

console.log("At the top")

app.get('/getImage', ((req, res) => {

  async function fetchRandom(req) {

    // let url = await helpers.randomFile()         //  TODO
    
    // Get host, filePath, fileName of image to send client
    let url = await helpers.getFilePath(req.query);
    
    if (url.error) {
      res.send(url.error)
      emailError.send(url.error)
          .catch((err) => console.log("error", err))
    }
    
    if (req.query.response_type === "link") {
      // URL of the image
      res.json(url.host + '/image?image=' + url.filePath + url.fileName)

    } else {
      try {
        // let fileName = await helpers.randomFileName()  // TODO
        // console.log("File Name = ", fileName)          // TODO
        
        res.sendFile(`${__dirname}/images/client/${url.filePath}${url.fileName}`)

      } catch (error) {
        emailError.send(url.error)
            .catch((err) => console.log("error", err))
      }

    }
  }

  fetchRandom(req).finally(() =>{})

}))

// ===============================================================  // TODO
// app.get('/chico', ((req, res) => {
//   console.log("Found Chico!!")
//   res.send(JSON.stringify("I am a small dog"))
//
//   async function Chico() {
//     // URL of the image
//     const url = 'https://web.engr.oregonstate.edu/~penceg/roscoe-memorial/images/gate.jpeg?width=450';
//
//     https.get(url,(res) => {
//       console.log("Status = ", res.statusCode)
//       // Image will be stored at this path
//       const path = `${__dirname}/mac-app/images/cave.jpeg`;
//       console.log("path = ", path)
//       const filePath = fs.createWriteStream(path);
//       res.pipe(filePath);
//       filePath.on('finish',() => {
//         filePath.close();
//         console.log('Download Completed');
//       })
//     })
//   }
//
//   Chico().then((res) => console.log("yahoo!!", res)).catch(err => console.log(err));
//
// }))
// ============================================================================

app.get('/imageSearch', ((req, res) => {

  const url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAqsEc83ZtQM-aUDoxqyUSKZ4nK6gyXRAg&cx=1d51ed3d0c23e53c2&q=lectures&searchType=image'

  // -----------  HTTPS GET ----------------------------------------------------
  https.get(url, res => {
    console.log(`statusCode:   `, res.statusCode);
    console.log(`statusMessage:`, res.statusMessage);
    console.log(`headers:      `, res.headers);

    res.on('data', d => {
          if (Buffer.isBuffer(d)) {
            d = d.toString();

            // console.log("Data! :", d)
          }
        }
    )
  console.log("here")
  }).on('error', (e) => {
    console.error("Error in /imageSearch: ", e);
  })
  // -----------  HTTPS GET ----------------------------------------------------

  console.log("res.body = ", res._body)
  res.send("res._body")

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
