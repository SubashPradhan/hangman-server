const express = require('express')
const db = require('./db')
const Group = require('./Data/Model')
const cors = require('cors')
const middleware = cors()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const port = process.env.PORT || 4000
const app = express()
app.use(middleware)
app.use(jsonParser)

app.listen(port, () =>{
  console.log(`Listening to Port: ${port}`)
})