const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ')
    jwt.verify(parts[1], process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ error: 'Authentication failed' })
      }
      req.user = user
      next()
    })
  } else {
    return res.status(401).json({ error: 'Authentication required' })
  }
}
