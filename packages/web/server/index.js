const { resolve } = require('path')
const history = require('connect-history-api-fallback')
const express = require('express')
const { createServer } = require('http')
const configureAPI = require('./configure')

const app = express()
const server = createServer(app)
const { PORT = 3000 } = process.env

// API
configureAPI(app, server)

// UI
const publicPath = resolve(__dirname, '../dist')
const staticConf = { maxAge: '1y', etag: false }

app.use(express.static(publicPath, staticConf))
app.use('/', history())

// Go
app.listen(PORT, () => console.log(`App running on port ${PORT}!`))
