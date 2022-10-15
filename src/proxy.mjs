import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
app.use(cors())
const port = 3000

app.get('/', (req, res) => {
  console.log(req.query.page)
  fetch(
    `https://www.nehnutelnosti.sk/byty/prenajom/?p%5Blocation%5D=p161.p162.t10&p%5Bparam1%5D%5Bfrom%5D=&p%5Bparam1%5D%5Bto%5D=800&p%5Bcategories%5D%5Bids%5D=10001.10002&p[page]=${req.query.page}`
  )
    .then((r) => r.text())
    .then((data) => res.send(data))
    .catch(console.log)
})

app.get('/one', (req, res) => {
  fetch(req.query.url)
    .then((r) => r.text())
    .then((data) => res.send(data))
    .catch(console.log)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
