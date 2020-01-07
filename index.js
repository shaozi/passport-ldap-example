const CONFIG = require('./config.js')
const cookieSession = require('cookie-session')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const passport = require('passport')
const CustomStrategy = require('passport-custom').Strategy
const { authenticate } = require('ldap-authentication')

passport.use('ldap', new CustomStrategy(
  async function (req, done) {
    try {
      if (!req.body.username || !req.body.password) {
        throw new Error('username and password are not provided')
      }
      let ldapBaseDn = CONFIG.ldap.dn
      let options = {
        ldapOpts: {
          url: CONFIG.ldap.url
        },
        userDn: `uid=${req.body.username},${ldapBaseDn}`,
        userPassword: req.body.password,
        userSearchBase: ldapBaseDn,
        userSearchString: `(uid=${req.body.username})`,
      }
      let user = await authenticate(options)
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  }
))

passport.serializeUser(function (user, done) {
  done(null, user);
})

passport.deserializeUser(function (user, done) {
  done(null, user);
})

var sessionMiddleWare = cookieSession({
  name: 'session',
  keys: ['keep the secret only to yourself'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
})

// The order of the following middleware is very important!!
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sessionMiddleWare)
app.use(passport.initialize())
app.use(passport.session())

// template
app.set('view engine', 'pug')

app.post('/login',
  passport.authenticate('ldap', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/success');
  }
)

app.get('/success', (req, res) => {
  let user = req.user
  if (!user) {
    res.redirect('/')
    return
  }
  res.render('success',
    {
      userDisplayName: user.cn,
      userObject: JSON.stringify(user, null, 2)
    })
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

// Start server
let port = 4000
console.log(`app is listening on port ${port}`)
app.listen(port, '127.0.0.1')