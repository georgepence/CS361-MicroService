const express = require('express');
const cors = require('cors');
const https = require('https');
require('dotenv').config();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/getImage', ((req, res) => {
  
  const url = 'https://web.engr.oregonstate.edu/~penceg/roscoe-memorial/images/gate.shower?width=450';
  console.log("Req send = ", req.query.send)
  
  if (!req.query.send || req.query.send === "link") {
    // URL of the image
    res.send(res.json(url))
    
  } else {
    try {
      console.log("I'm here now!!!")
      res.sendFile(`${__dirname}/images/tennis.jpg`)
      console.log('sent!')
    } catch (error) {
      console.error(error);
    }

  }

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
    req = https.request(url, res => {
      console.log(`statusCode: ${res.statusCode}`)
      
      console.log(res.JSON)
    })
    
    req.on('error', err => console.error(err))
   res.send("Wow!")
  
}))

app.get('*', ((req, res) => {
  let message = "Message from CS361"
  message = JSON.stringify(message)
  res.send(message)
}));

app.listen(port, ()=> console.log(`server started on port ${port}.`));
