function startListening() {
  document.getElementById("searchSource").addEventListener("change", () => {
    console.log("changed!")
    let form = document.getElementById("sourceForm");
    
    fetchImage(form.elements["searchSource"].value)
    
  })
}

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
  
  let imageDiv = document.getElementById("searchResults");
  let htmlCode = ''
  
  // ==========  GOOGLE SEARCH   ==============================================
  
  if (source !== 'flickr') {
    
    for (let i = 0; i < 2; i++) {
    
      let url = serverURL.main + `/imageSearch?searchTerms=dog&imgSize=xlarge&start=${(i * 10) + 1}`
      let result = await fetch(url);
      let data = await result.json();
    
      if (data.error) {
        htmlCode += `<p>Error accessing Google API</p>` +
            `<p>${data.error}</p>`
      } else {
      
        htmlCode += '<div class="row mt-1 mb-1">'
      
        await data.map((gResult, index) => {

          htmlCode += `<div id="c-${index}" ` +
              `class="col-xl-2 col-md-3 col-sm-6 mt-1 mb-1" >` +
              `<img src=${gResult.image.thumbnailLink} alt=${gResult.title} />` +
              `<p>${gResult.image.width} x ${gResult.image.height}</p>` +
              `</div>`
        })
        htmlCode += '</div>'
      }
    }
  }
  
  // ==========  FLICKR SEARCH   ==============================================
  
  if (source !== 'google') {
    
    let url = serverURL.main + `/flickrSearch`
    let result = await fetch(url);
    let data = await result.json();
  
    htmlCode += '<div class="row mt-1 mb-1">'
  
    await data.map((fResult, index) => {
      let iUrl = `https://live.staticflickr.com/${fResult.server}/${fResult.id}_${fResult.secret}_m.jpg`
      htmlCode += `<div id="c-${index}" ` +
          `class="col-xl-2 col-md-4 col-sm-6 mt-1 mb-1" >` +
          `<img src=${iUrl} alt=image ${index}  ${fResult.title} />` +
          // `<p>${gResult.image.width} x ${gResult.image.height}</p>` +
          `</div>`
    })
  
    htmlCode += '</div>'
    
    // if (data.error) {
    //   htmlCode += `<p>Error accessing Google API</p>` +
    //       `<p>${data.error}</p>`
    // } else {
    //
    //   htmlCode += '<div class="row mt-1 mb-1">'
    //
    //   await data.map((gResult, index) => {
    //
    //     htmlCode += `<div id="c-${index}" ` +
    //         `class="col-xl-2 col-md-3 col-sm-6 mt-1 mb-1" >` +
    //         `<img src=${gResult.image.thumbnailLink} alt=${gResult.title} />` +
    //         `<p>${gResult.image.width} x ${gResult.image.height}</p>` +
    //         `</div>`
    //   })
    //   htmlCode += '</div>'
    // }
  }
  
  // ==========  END OF SEARCH   ==============================================
                          // Todo
  imageDiv.innerHTML = htmlCode
}
let imageSource = 'both';
fetchImage(imageSource).finally(() => {});
startListening();