import express from 'express'
import jwt from 'jsonwebtoken'
import {} from 'dotenv/config'
import db from '../models/'


const router = express.Router()

router.post('/login', (req, res) => {
  db.User.findOne({ username: req.body.username }).then((user) => {
    user.comparePassword(req.body.password, (err, isMatch) => {
      let token
      if (isMatch) {
        token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        res.status(200).send({ token })
      } else {
        res.status(400).send({
          status: 400,
          message: 'Invalid Credentials',
        })
      }
    })
  }, (err) => {
    res.status(400).send({
      status: 400,
      message: 'Invalid Credentials',
      error: err,
    })
  })
})

router.post('/signup', (req, res) => {
  db.User.create(req.body).then((user) => {
    const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
    res.status(201).send({ token })
  })
})

router.get('/logout', (req, res) => {
  req.session.user_id = null
  res.status(200).send({
    status: 200,
    message: 'Logged out',
  })
})

export default router
