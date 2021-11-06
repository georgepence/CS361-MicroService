async function fetchImage(source) {
  
  // ==========  GET SERVER URL  ==============================================
  async function getServerUrl() {
    try {
      let serverData = await(fetch('http://localhost:6515/getServer'));
      let mainServer = await serverData.json()
      
      return { main: mainServer,
        readme: 'http://localhost:6515'
      };
    }
    catch {
      console.log("Well, that didn't work")
      let serverData = await(fetch('http://flip3.engr.oregonstate.edu:6515/getServer'))
      let readmeServer = await serverData.json();
      return { main: mainServer,
        readme: 'http://flip3.engr.oregonstate.edu:6515'
      }
    }}
  // ==========  END OF GET SERVER URL  =======================================
  
  let serverURL = await getServerUrl()
  console.log("Server = ", serverURL)
  
  let imageDiv = document.getElementById("searchResults");
  let flickrCountDiv = document.getElementById("flickr-count");
  let htmlCode = ''
  
  // ==========  GOOGLE SEARCH   ==============================================
  
async function fetchLinks() {
  let url = serverURL.main + `/getImage?response_type=random`
  let imageLinks = [];
  for (let i = 1; i <= 10; i++) {
    console.log("IMAGELINKS = ", imageLinks)
    let imageLink = await fetch(url)
        .then(response => response.json())
        .then((data) => {
          imageLinks.push(data)
          console.log("Chico = ", data, imageLinks)
          console.log(imageLinks.length)
        })
  }
  return imageLinks
}
  
  // ==========  FLICKR SEARCH   ==============================================
  
  if (source !== 'google') {
    
    let imageLinks = await fetchLinks()
    console.log("imageLinks = ", imageLinks)
    
    htmlCode += '<div class="row mt-1 mb-1">'
  
    await imageLinks.map((imageLink, index) => {
        htmlCode += `<div id="c-${index}" ` +
            `class="col-xl-2 col-md-4 col-sm-6 mt-1 mb-1" >` +
            `<img src=${imageLink} alt=image width="200" />` +
            `</div>`
      });
    
    htmlCode += '</div>'
    
  }
  
  // ==========  END OF SEARCH   ==============================================
  // Todo
  imageDiv.innerHTML = htmlCode
  
}
let imageSource = 'flickr';
fetchImage(imageSource).finally(() => {});
