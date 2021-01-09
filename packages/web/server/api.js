const express = require('express')
const auth = require('./middleware/auth')
const router = express.Router()

router.get('/', function(req, res) {
  res.json({ text: 'Hello World!' })
})

router.post('/auth', auth, (req, res) => {
  res.json(req.user)
})

router.post('/module/:name/:action', auth, (req, res) => {
  console.log('Changing module', req.params.name, 'to', req.params.action)
  res.json({ success: false })
})

module.exports = router
