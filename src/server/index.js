const dotEnvLoad = require('dotenv').config()
const express = require('express')
const request = require('request')
const app = express()
const handleFixerAPIResponse = require('./helpers/handleFixerAPIResponse').default

console.log('(*) dotEnvLoad =>', dotEnvLoad)

// ----------------------------------------------------
// Displayed Routes
app.use(express.static('dist')) // webpack bundle folder

// ----------------------------------------------------
// API Routes
app.get('/fixer_api/:searchVal1/:searchVal2', function (req, res) {
  const { searchVal1, searchVal2 } = req.params
  console.log('(*) process.env.FIXER_API_ACCESS_KEY =>', process.env.FIXER_API_ACCESS_KEY)
  const result = request(
    `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_ACCESS_KEY}`,
    (error, response, body) => res.json(handleFixerAPIResponse(error, response, body, searchVal1, searchVal2))
  )
})

// ----------------------------------------------------

const port = process.env.PORT || 5001;

app.listen(port, () => console.log('Listening on ' + port))
