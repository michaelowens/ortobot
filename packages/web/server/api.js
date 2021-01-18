const express = require('express')
const auth = require('./middleware/auth')
const router = express.Router()
const modules = require('./config/modules')
const redis = require("redis");
const database = redis.createClient({ url: process.env.REDIS_URL || null });

router.get('/', function(req, res) {
  res.json({ text: 'Hello World!' })
})

router.post('/auth', auth, (req, res) => {
  res.json(req.user)
})

router.get('/modules', auth, (req, res) => {
  database.hgetall('module:status', (err, result) => {
    for (let mod in modules) {
      modules[mod].enabled = result && result[mod] === 'true'
    }
  
    res.json(modules)
  })
})

router.post('/module/:name/:action', auth, (req, res) => {
  if (!modules[req.params.name]) {
    return res.json({success: false})
  }
  database.hmset('module:status', [req.params.name, req.params.action === 'enable'], (err, result) => {
    if (!err) {
      database.publish('modules', JSON.stringify({
        name: req.params.name,
        enabled: req.params.action === 'enable'
      }))
    }

    res.json({ success: !err })
  })
})

module.exports = { router, database }
