const goDeeper = require('./goDeeper')

function feedHim(myPet) {
  myPet.temperament = 'happy';
}

function goThere(myPet) {
  goDeeper.playful(myPet);
}

exports.feedChico = feedHim;
exports.playNow = goThere;