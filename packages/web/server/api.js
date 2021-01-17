const express = require('express')
const auth = require('./middleware/auth')
const router = express.Router()
const modules = require('../src/config/modules')
const redis = require("redis");
const client = redis.createClient();

router.get('/', function(req, res) {
  res.json({ text: 'Hello World!' })
})

router.post('/auth', auth, (req, res) => {
  res.json(req.user)
})

router.get('/modules', auth, (req, res) => {
  client.hgetall('module:status', (err, result) => {
    for (let mod in modules) {
      modules[mod].enabled = result[mod] === 'true'
    }
  
    res.json(modules)
  })
})

router.post('/module/:name/:action', auth, (req, res) => {
  if (!modules[req.params.name]) {
    return res.json({success: false})
  }
  client.hmset('module:status', [req.params.name, req.params.action === 'enable'], (err, result) => {
    if (!err) {
      client.publish('modules', JSON.stringify({
        name:req.params.name,
        enabled: req.params.action === 'enable'
      }))
    }

    res.json({ success: !err })
  })
})

module.exports = router
