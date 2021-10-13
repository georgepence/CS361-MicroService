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

app.get('/getImage'), ((req, res) => {

})

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
