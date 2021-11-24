

// console.log(now.getSeconds().toString() + now.getMilliseconds().toString())

let yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
console.log(yesterday.toString())
let now = new Date()
console.log(now - yesterday);

if (now - yesterday > 86400000) {
  console.log("ha", now - yesterday - 86400000)
} else {
  console.log("ho", now - yesterday -86400000)
}