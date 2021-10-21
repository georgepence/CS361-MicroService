
async function insertImage(cardId, buttonId) {
  console.log("Here in insertImage")
  
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
  
  async function getImageSrc() {
    if (buttonId === 'button-3') {
      return '/images/client/myfiles/myFetchImage.jpg';
    } else {
      return await result.json();
    }
  }

  let serverURL = await getServerUrl()
  
  console.log("Got my server", serverURL);

  let url = serverURL.readme + '/getImage'
  let url2 =serverURL.readme + '/testRoute'
  if (buttonId === 'button-1') url += '?method=link'
  if (buttonId === 'button-2') url += '?method=file'
  if (buttonId === 'button-3') url = url2
  
  if (buttonId === 'button-1') {
    let result = await fetch(url).catch((err) => console.log(err))
    // if (buttonId === 'button-1') { let data = await result.json() }
    // if (buttonId === 'button-2') url += '?method=get'
    // if (buttonId === 'button-3') { let data = '/images/client/myfiles/myFetchImage.jpg' }
  
    let data = await result.json();
    console.log("data data = ", data)
    return data
  }

  
  let card = document.getElementById(cardId);
  card.innerHTML = `<img src=${data} class="random-image" alt="random image"/> `;
  card.classList.remove('fetch-image');
  let button = document.getElementById(buttonId);
  button.innerText = "Refresh Image";
  button.classList.remove('btn-primary');
  button.classList.add('btn-success');
}

function startListening() {
  let buttonOne = document.getElementById("button-1")
  buttonOne.addEventListener("click", function() {insertImage('chico', 'button-1')})
  let buttonTwo = document.getElementById("button-2")
  buttonTwo.addEventListener("click", function() {insertImage('card-2', 'button-2')})
  let buttonThree = document.getElementById("button-3")
  buttonThree.addEventListener("click", function() {insertImage('card-3', 'button-3')})
}

startListening();