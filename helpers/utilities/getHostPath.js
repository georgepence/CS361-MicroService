require('dotenv').config();

function getHostPath() {
  
  if(process.env.NODE_ENV === 'development') {
    return `http://localhost:${process.env.PORT}`
    
  } else {
    // In 'production' (deployed)
    return `http://flip3.engr.oregonstate.edu:${process.env.PORT}`
  }
}

module.exports = getHostPath