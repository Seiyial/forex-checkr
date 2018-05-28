require('dotenv').config()
const express = require('express')
const request = require('request')
const app = express()
const formatFixerAPIResponse = require('./helpers/formatFixerAPIResponse')

// ----------------------------------------------------

app.use(express.static('dist')) // webpack bundle folder

app.get('/fixer_api', function (req, res) {
  request(
    `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}`, 
    formatFixerAPIResponse
  )
})

// ----------------------------------------------------

const port = process.env.PORT || 5001;

app.listen(port, () => console.log('Listening on ' + port))
