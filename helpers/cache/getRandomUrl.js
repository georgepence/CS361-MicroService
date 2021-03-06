const flickrSearch = require("../search/flickrSearch");

async function getRandomUrl() {
  
  let result = { pages: 60000 }
  
  if (!result.photo && false) {

    return  { error: 'Flickr returned no photos ' };
  } else {
    
    let randomPage = Math.floor(Math.random() * result.pages);
    
    let photos = await flickrSearch.search({ randomPage: randomPage })
        .catch((err) => console.log(err));
    if (photos.length === 0) {console.log()}
    
    let photo = photos.photo[Math.floor(Math.random() * photos.photo.length)];
    
    let data
    try {
      data = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`
    } catch {
      console.log(`In getRandomUrl, photo = ${photo}`)
      data = {error: true, message: photo}
    }
    return data
  }
}

module.exports = getRandomUrl




