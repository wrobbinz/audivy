import jwt from 'jsonwebtoken'
import {} from 'dotenv/config'


export default {
  loginRequired(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (decoded) {
          next()
        } else {
          res.status(401).send('Please log in first')
        }
      })
    } catch (e) {
      res.status(401).send({
        status: 401,
        message: 'Please log in first',
      })
    }
  },

  ensureCorrectUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (decoded.user_id === req.params.id) {
          next()
        } else {
          res.status(401).send('Unauthorized')
        }
      })
    } catch (e) {
      res.status(401).send('Unauthorized')
    }
  },
}
