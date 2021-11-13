async function pause() {
  await new Promise((resolve) => {
    setTimeout(
        () => {
          console.log("Taking time out");
          resolve("success")
        },
        500
    );
    
  })
}

module.exports = pause