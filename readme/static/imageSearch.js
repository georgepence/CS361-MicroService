
async function fetchImage() {

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

  let serverURL = await getServerUrl()

  console.log("Got my server", serverURL);

  let url = serverURL.main + '/imageSearch'
  let result = await fetch(url).catch((err => console.log(err)))
  let data = await result.json();

  console.log("data data = ", data)
  //  return data



  let imageDiv = document.getElementById("searchResults");
  let htmlCode = '<div class="row>"'
  htmlCode = 'Look at me'
  htmlCode += '</div>'
  imageDiv.innerHTML = htmlCode
}

fetchImage().finally(() => {})