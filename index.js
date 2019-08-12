const express = require('express')
const db = require('./db')

const port = process.env.PORT || 4000
const app = express()

app.listen(port, () =>{
  console.log(`Listening to Port: ${port}`)
})