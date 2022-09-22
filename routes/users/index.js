const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {
  registration,
  login,
  logout,
  refresh,
} = require('../../controllers/users')
const guard = require('../../helper/guard')
const passport = require('../../middlewares/authenticate')
const { JWT_SECRET_KEY } = process.env

router.post('/signup', registration)
router.post('/login', login)
router.get('/current', guard, refresh)
router.post('/logout', guard, logout)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
)
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    const payload = {
      id: req.user._id,
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '24h' })
    res.cookie('token', token)

    res.redirect('http://localhost:3000')
  },
)

module.exports = router
