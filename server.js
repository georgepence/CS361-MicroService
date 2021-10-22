const express = require('express');
const request = require('request');
const cors = require('cors');
const https = require('https');
// const http = require('http');      todo
require('dotenv').config();
const bodyParser = require('body-parser');
const helpers = require('./helpers/readmeHelpers')
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

    let url = await helpers.randomFile()
    console.log("Here we go:  url = ", url)
    if (url.error) {
      console.log(url.error)
      res.send(url.error)
    }

    console.log("In main server, req.query = ", req.query.response_type == true, req.query.response_type)   // todo
    if (req.query.response_type) {console.log(url)}
    console.log("Req url", req.url)   // todo
    console.log("Req query", req.query)   // todo
    console.log("Req body", req.body)   // todo
    console.log("Req orig url", req.originalUrl)   // todo
    
    
    if (req.query.response_type === "link") {
      // URL of the image
      res.json(url)

    } else {
      try {
        let fileName = await helpers.randomFileName()
        console.log("File Name = ", fileName)   // todo
        res.sendFile(`${__dirname}/images/client/random/small/${fileName}`)
        console.log('sent!')   // todo

      } catch (error) {
        console.error(error);
      }

    }
  }
  console.log("Starting")
  fetchRandom(req).finally(() =>{})

}))

// ============================================================================
app.get('/chico', ((req, res) => {
  console.log("Found Chico!!")
  res.send(JSON.stringify("I am a small dog"))

  async function Chico() {
    // URL of the image
    const url = 'https://web.engr.oregonstate.edu/~penceg/roscoe-memorial/images/gate.jpeg?width=450';

    https.get(url,(res) => {
      console.log("Status = ", res.statusCode)
      // Image will be stored at this path
      const path = `${__dirname}/mac-app/images/cave.jpeg`;
      console.log("path = ", path)
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on('finish',() => {
        filePath.close();
        console.log('Download Completed');
      })
    })
  }

  Chico().then((res) => console.log("yahoo!!", res)).catch(err => console.log(err));

}))
// ============================================================================

app.get('/imageSearch', ((req, res) => {

    const url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAqsEc83ZtQM-aUDoxqyUSKZ4nK6gyXRAg&cx=1d51ed3d0c23e53c2&q=lectures&searchType=image'
    https.get(url, res => {
      console.log(`statusCode:   `, res.statusCode);
      console.log(`statusMessage:`, res.statusMessage);
      console.log(`headers:      `, res.headers);
      
      res.on('data', d => {
        if(Buffer.isBuffer(d)){
          d = d.toString();
          let chico = JSON.parse(d)
          console.log("Data! :", chico.items)
        }

      })

    }).on('error', (e) => {
      console.error(e);
    })


   res.send("Wow!")

}))

// ===== GOOGLE IMAGE SEARCH ==================================================

app.get('/imageSearchTwo', ((req, res) => {
  const url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAqsEc83ZtQM-aUDoxqyUSKZ4nK6gyXRAg&cx=1d51ed3d0c23e53c2&q=lectures&searchType=image'
  
  // Function that returns a Promise which resolves to Google search results.
  // Search results are limited to 10 images.
  function fetchGoogle(url) {
    
    return new Promise((res, rej) => {
      request(url, {json:true}, function (error, response, body) {
        
        if (error || res.statusCode < 200 || res.statusCode > 400) {
          rej(error || `${res.statusCode} indicates an error occurred`)
          
        } else {
          res(body.items)
        }
      })
        }
    )
  }

  fetchGoogle(url).then((result) => {
    res.json(result)}).catch(err => res.send(err))
  
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
  res.sendFile(__dirname + '/images/client/random/small/' + image)
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
