import express from 'express'
import bodyParser from 'body-parser'
import db from '../models/db'
import auth from '../middleware/auth'


const app = express()
const router = express.Router()
app.use(bodyParser.json())

// get all users
router.get('/', (req, res) => {
  db.User.find().then((users) => {
    res.send({
      status: 200,
      message: 'Retrieved all users successfully',
      data: users,
    })
  }).catch((err) => {
    res.status(400).send({
      status: 400,
      message: err.message,
    })
  })
})

// get specific user by ID
router.get('/:id', (req, res) => {
  db.User.findById(req.params.id).then((user) => {
    res.send({
      status: 200,
      message: `Retrieved user ${user.username} successfully`,
      data: user,
    })
  }).catch((err) => {
    res.status(400).send({
      status: 400,
      message: err.message,
    })
  })
})

// create new user
router.post('/', (req, res) => {
  const newUser = req.body
  db.User.create(newUser).then((user) => {
    res.status(201).send({
      status: 201,
      message: `Created user ${user.username} successfully`,
      data: user,
    })
  }).catch((err) => {
    res.status(400).send({
      status: 400,
      message: err.message,
    })
  })
})

// update existing user
router.patch('/:id', (req, res) => {
  const updatedUser = req.body
  db.User.findById(req.params.id).then((val) => {
    const user = val
    if (updatedUser.username) {
      user.username = updatedUser.username
    }
    if (updatedUser.email) {
      user.email = updatedUser.email
    }
    if (updatedUser.password) {
      user.password = updatedUser.password
    }
    user.save()
    res.send({
      status: 200,
      message: `Updated user ${user.username} successfully`,
      data: user,
    })
  }).catch((err) => {
    res.status(400).send({
      status: 400,
      message: err.message,
    })
  })
})

router.delete('/:id', auth.ensureCorrectUser, (req, res) => {
  db.User.findByIdAndRemove(req.params.id).then(() => {
    res.status(204).send({
      status: 204,
      message: `Deleted user with ID ${req.params.id} successfully`,
    })
  }).catch((err) => {
    res.status(400).send({
      status: 400,
      message: err.message,
    })
  })
})

export default router
