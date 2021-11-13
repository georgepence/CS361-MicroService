function getFileBaseNameEnding() {
  let now = new Date();
  return now.getSeconds().toString() + now.getMilliseconds().toString();
}

module.exports = getFileBaseNameEnding;