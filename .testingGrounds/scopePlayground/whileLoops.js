async function Millie(i) {
  return new Promise((res, rej) => {
    setTimeout((j) => {
      console.log(`In timeout ${j}`)
      res(j)
    }, 1000, i)

  })
}


async function chico() {

  let j

  for (let i=1; i < 5; i++) {
    j = i.toString()
    console.log(`Before timeout ${i}`)
    await Millie(i).then((i) => {
      console.log(`In then ${i}`)
    })
    console.log(`After timeout ${i}`)

  }

  console.log("After while loop, i = ", i);
}


chico()