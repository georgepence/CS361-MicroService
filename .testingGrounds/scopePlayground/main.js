const moduleOne = require('./moduleOne');

let myPet = { name: 'Chico', type: 'Bad Dog', temperament: 'hungry' };

console.log("Chico is ", myPet.temperament);
moduleOne.feedChico(myPet);
console.log("Chico is ", myPet.temperament);
moduleOne.playNow(myPet);
console.log("Chico is ", myPet.temperament);

let sourceUrl = 'chicoDOWNLOAD'

console.log("includes download?", sourceUrl.toLowerCase().includes('download'))

let status = "ok"

try {
  fetch('http://wwww.iamnotawebsite.jjj')
} catch {
  let status
  status = "not ok"
}

console.log("status = ", status)

let muffy = new Date()
let tuffy = new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000))
googleStatus = {  }

if (muffy - googleStatus.quotaReached > 200) {
  console.log("I'm here")
} else {
  console.log("I'm there")
}

let doggie = new Date()
console.log(doggie.getDate())
if (new Date - googleStatus.timeReached > 1 ) {
  console.log(myPet)
}

if (new Date - doggie < 1 ) {
  console.log("What is happening")
}