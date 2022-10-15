import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
app.use(cors())
const port = 3000

const nehnutURL = (page) =>
  `https://www.nehnutelnosti.sk/byty/prenajom/?p%5Blocation%5D=p161.p162.t10&p%5Bparam1%5D%5Bfrom%5D=&p%5Bparam1%5D%5Bto%5D=800&p%5Bcategories%5D%5Bids%5D=10001.10002&p[page]=${page}`
const realityURL = (page) =>
  `https://www.reality.sk/inzeraty/?location_ids=%5B%22100001001%22,%22100001002%22,%22100001003%22%5D&price_to=800&categories_all-2=%5B11,12%5D&page=${page}`

app.get('/listing', (req, res) => {
  let url
  switch (req.query.site) {
    case 'nehnut':
      url = nehnutURL
      break
    case 'reality':
      url = realityURL
      break
    default:
      throw new Error('unknown site')
  }
  fetch(url(req.query.page))
    .then((r) => r.text())
    .then((data) => res.send(data))
    .catch(console.log)
})

app.get('/oneOffer', (req, res) => {
  const url =
    req.query.site === 'reality' ? `https://www.reality.sk${req.query.url}` : req.query.url
  fetch(url)
    .then((r) => r.text())
    .then((data) => res.send(data))
    .catch(console.log)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
