require("dotenv").config()
const express = require("express")
const app = express()

// ----------------------------------------------------

app.use(express.static('dist')) // webpack bundle folder

// ----------------------------------------------------

const port = process.env.PORT || 9701;

app.listen(port, () => console.log("Listening on " + port))
