const dotEnvLoad = require('dotenv').config()
const express = require('express')
const request = require('request')
const app = express()
const handleFixerAPIResponse = require('./helpers/handleFixerAPIResponse').default

// ----------------------------------------------------
// Displayed Routes
app.use(express.static('dist')) // webpack bundle folder

// ----------------------------------------------------
// API Routes
app.get('/fixer_api/:searchVal1/:searchVal2', function (req, res) {
  if (process.env.NODE_ENV === 'development') res.header('Access-Control-Allow-Origin', '*')
  const { searchVal1, searchVal2 } = req.params
  console.log('(*) searchVal1 =>', searchVal1)
  request(
    `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_ACCESS_KEY}`,
    (error, response, body) => res.json(handleFixerAPIResponse(error, response, body, searchVal1, searchVal2))
  )
})

// ----------------------------------------------------

const port = process.env.PORT || 5001; // use 5001 for development

app.listen(port, () => console.log('(*) Listening on Port =>', port))
