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