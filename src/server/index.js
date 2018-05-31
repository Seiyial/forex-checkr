const dotEnvLoad = require('dotenv').config()
const knex = () => require('knex')(require('../../knexfile').development)
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const handleFixerAPIResponse = require('./helpers/handleFixerAPIResponse').default

// ----------------------------------------------------
// Displayed Routes
app.use(express.static('dist')) // webpack bundle folder
app.use(bodyParser.json())

// ----------------------------------------------------
// API Routes

// Fixer API GetData
app.get('/fixer_api/:searchVal1/:searchVal2', function (req, res) {
  const { searchVal1, searchVal2 } = req.params
  request(
    `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_ACCESS_KEY}`,
    (error, response, body) => res.json(handleFixerAPIResponse(error, response, body, searchVal1, searchVal2))
  )
})

// Create
app.post('/forex_levels', function(req, res) {
  const { searchVal1, searchVal2, upperVal, lowerVal, displayRate } = req.body
  console.log('(*) req.body =>', req.body)
  let dbResult
  const dbConn = knex()
  dbConn.table('forex_levels').insert({
    forex_name: searchVal1 + '-' + searchVal2,
    upper: upperVal,
    lower: lowerVal,
    status: true
  }).then((dbResp) => {
    res.json({ success: true })
    dbConn.destroy()
  })
  .catch((dbErr) => {
    console.log(dbErr)
    res.json({ success: false, message: 'Failed to add new item' })
    dbConn.destroy()
  })
})

// LIST
app.get('/forex_levels', function(req, res) {
  const dbConn = knex()
  dbConn.select().from('forex_levels').then((dbResp) => {
    res.json({ apiSuccess: true, dbPayload: dbResp })
    console.log('() send forex levels')
    dbConn.destroy()
  }).catch((dbErr) => {
    console.log(dbErr)
    res.json({ apiSuccess: false, message: 'Sorry, database error' })
    dbConn.destroy()
  })
})

// DELETE
app.delete('/forex_levels', function(req, res) {
  console.log('(*) req.body =>', req.body)
  const dbConn = knex()
  dbConn('forex_levels').where('id', req.body.id).del().then((dbResp) => {
    res.json({ apiSuccess: true })
    console.log('-delete forex level', req.body.id)
    dbConn.destroy()
  }).catch((dbErr) => {
    console.log(dbErr)
    res.json({ apiSuccess: false, message: 'Sorry, database error' })
    dbConn.destroy()
  })
})

// ----------------------------------------------------

const port = process.env.PORT || 5001; // use 5001 for development

app.listen(port, () => console.log('(*) Listening on Port =>', port))
