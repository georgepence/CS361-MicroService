
async function fetchImage() {

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
  // ==========  GET SERVER URL  ==============================================
  let serverURL = await getServerUrl()


  
  let imageDiv = document.getElementById("searchResults");
  let htmlCode = ''
  
  for (let i = 0; i < 2; i++) {
  
    let url = serverURL.main + `/imageSearch?searchTerms=dog&imgSize=xlarge&start=${(i * 10) + 1}`
    let result = await fetch(url);
    let data = await result.json();
    
    if (data.error) {
      htmlCode += `<p>Error accessing Google API</p>` +
          `<p>${data.error}</p>`
    } else {
      console.log("data data = ", data)
  
      htmlCode += '<div class="row mt-1 mb-1">'
      // console.log("after row", htmlCode)               // Todo
  
      await data.map((gResult, index) => {
        // console.log("in data.map", index, htmlCode)    // Todo
        htmlCode += `<div id="c-${index}" ` +
            `class="col-xl-2 col-md-3 col-sm-6 mt-1 mb-1" >` +
            `<img src=${gResult.image.thumbnailLink} alt=${gResult.title} />` +
            `<p>${gResult.image.width} x ${gResult.image.height}</p>` +
            `</div>`
      })
      // console.log("after data.map", htmlCode)          // Todo
      htmlCode += '</div>'
      // console.log(htmlCode)
    }
    
  }
                          // Todo
  imageDiv.innerHTML = htmlCode
}

fetchImage().finally(() => {})