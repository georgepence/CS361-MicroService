const express = require('express');
const path = require('path')
const request = require('request');
// const http = require('http');    todo
require('dotenv').config();
const bodyParser = require('body-parser');
const helpers = require('../helpers/helpers');
const port = process.env.PORT || 6515;
const serverURL = process.env.SERVER || 'http://localhost:5000'
const fs = require('fs')
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))
app.use(express.static(__dirname + '/static'))

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/getServer', (req, res) => {
  res.json(serverURL);
})

app.get('/getImage', (req, res) => {
  async function fetchImage (req, res) {
    // let imageLink = '';
    
    if (req.query.method === 'link') {
      let result = await axios.get(serverURL + '/getImage?response_type=link')
      return result.data
      
    } else if (req.query.method === 'get') {
      let result = await axios.get(serverURL + '/getImage?response_type=file')
      let imageLink = await result.data;
      console.log("get request = ", serverURL + imageLink)
      let file = await axios.get(serverURL + imageLink);
      console.log("file = ", file)
      // fs.writeFile('/images/client/myfiles/myGetImage.jpg', image)
      // return '/images/client/myfiles/myGetImage.jpg'
    } else {
      const url = serverURL + '/getImage?response_type=file'
      const savePath = path.resolve(__dirname + '/static/images/client/myfiles', 'myFetchImage.jpg')
      console.log("Chico says savePath = ", savePath)
      const writer = fs.createWriteStream(savePath)
      // fs.writeFile(__dirname + '/static/images/client/myfiles/chico.txt', 'chico is here', (err) => {console.log("WHATT???", err)})
      
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      })
      console.log("hooo", response.data.IncomingMessage[_readableState.ReadableState[objectMode]])
      response.data.pipe(writer)
      let imageLink = '/images/client/myfiles/myFetchImage.jpg'
      
      return new Promise(((resolve, reject) => {
        writer.on('finish', resolve(imageLink))
        writer.on('error', reject)
      }))

    }
  }
  fetchImage(req, res).then((imageLink) => {res.json(imageLink)})
})

app.get('/testRoute', (req, res) => {
  const download = function(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
      console.log('content-type: ', res.headers['content-type'])
      console.log('content-length: ', res.headers['content-length'])
      request(uri).pipe(fs.createWriteStream(__dirname + '/static/images/client/myfiles/' + filename))
    })
  }
  download(serverURL + '/getImage', 'myFetchImage.jpg', function(res) {
    console.log("here in download")
    res.json('roscoe.jpg')
  })
  console.log("here after download")
  res.json('/images/client/myfiles/myFetchImage.jpg')
})

app.get('/imageSearch', ((req, res) => {
  res.sendFile(path.join(`${__dirname}`,'imageSearch.html'))
}));

app.get('/flickrTest', ((req, res) => {
  res.sendFile(path.join(`${__dirname}`,'flickrTest.html'))
}));

app.get('/', ((req, res) => {
  res.sendFile(path.join(`${__dirname}`,'readme.html'))
}));

app.listen(port, ()=> console.log(`server started on port ${port}.`));