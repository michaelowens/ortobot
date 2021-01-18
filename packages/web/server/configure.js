require('dotenv').config()
const bodyParser = require('body-parser')
const passport = require('passport')
const twitchStrategy = require('passport-twitch-new').Strategy
const jwt = require('jsonwebtoken')
const api = require('./api')
const wsApi = require('./ws-api')

// I am lazy, probably gonna let the bot update redis with a list of mods
const mods = ['xikeon', 'ortopilot', 'chibijuice_']

// auth from: {
//   id: '15206897',
//   login: 'xikeon',
//   display_name: 'Xikeon',
//   type: '',
//   broadcaster_type: 'affiliate',
//   description: ' .',
//   profile_image_url: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/41780b5a-def8-11e9-94d9-784f43822e80-profile_image-300x300.png',
//   offline_image_url: '',
//   view_count: 11482,
//   email: 'michael@owens.nl',
//   created_at: '2010-09-02T11:25:06.249647Z',
//   provider: 'twitch'
// }

module.exports = (app, server) => {
  let io
  app.use((req, res, next) => {
    if (!io) {
      console.log('Set up socket io')
      const server = req.connection.server;
      io = require('socket.io')(server, { serveClient: false });
      wsApi(io)
    }
    next();
  })

  app.use(passport.initialize())

  passport.use(
    new twitchStrategy(
      {
        clientID: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        callbackURL: process.env.TWITCH_CALLBACK || 'http://localhost:8080/api/auth/twitch/callback',
        scope: 'user_read',
      },
      function(accessToken, refreshToken, user, done) {
        api.database.lpos('mods', user.login, (err, result) => {
          if (result === null) {
            err = 'Could not authenticate'
          }
          return done(err, err ? user : null)
        })
      }
    )
  )

  passport.serializeUser(function(user, done) {
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  api.router.get('/auth/twitch', passport.authenticate('twitch'))
  api.router.get(
    '/auth/twitch/callback',
    passport.authenticate('twitch', {
      failureRedirect: '/',
    }),
    (req, res) => {
      const token = jwt.sign(req.user, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })
      res.redirect('/?token=' + token)
    }
  )

  app.use(bodyParser.json())
  app.use('/api', api.router)
}
