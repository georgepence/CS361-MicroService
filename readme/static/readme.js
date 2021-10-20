
async function insertImage(cardId, buttonId) {
  console.log("Here in insertImage")
  try {let serverData = await(fetch('http://localhost:6515/getServer'));}
  catch {let serverData = await(fetch('http://flip3.engr.oregonstate.edu:6515/getServer'))}
  
  let serverURL = await serverData.json();
  console.log(serverURL);

  let url = 'http://flip3.engr.oregonstate.edu:6515/getImage'
  let url2 ='http://flip3.engr.oregonstate.edu:6515/testRoute'
  if (buttonId === 'button-1') url += '?method=link'
  if (buttonId === 'button-2') url += '?method=get'
  if (buttonId === 'button-3') url = url2
  
  let result = await fetch(url).catch((err) => console.log(err))
  // if (buttonId === 'button-1') { let data = await result.json() }
  // if (buttonId === 'button-2') url += '?method=get'
  // if (buttonId === 'button-3') { let data = '/images/client/myfiles/myFetchImage.jpg' }
  
  let data = await result.json();
  console.log("data data = ", data)
  
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