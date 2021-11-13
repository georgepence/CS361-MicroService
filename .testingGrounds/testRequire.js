const talking = require('./testExport')

// console.log("Chico", talking.chico)

let conversation = talking()
// let conversation = talking.speak()

console.log("Speaking to you ", conversation)