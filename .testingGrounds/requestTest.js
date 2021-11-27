const request = require('request')
const url = 'https://i.guim.co.uk/img/media/71bd64a603c6fc1716551c4a78ea5c49b84f6f0e/0_183_5760_3458/master/5760.jpg'


async function chico(url) {
  await request(
      {uri: url, method: 'GET'})
              .on('response', (res) => console.log(`statusCode = ${res.statusCode}`)
)
}

chico(url)