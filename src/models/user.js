import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: String,
  password: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
})

userSchema.pre('save', function encryptPass(next) {
  const user = this

  if (!user.isModified('password')) {
    next()
  }
  bcrypt.hash(user.password, 10).then((hash) => {
    user.password = hash
    next()
  }, err => next(err))
})

userSchema.methods.comparePassword = function comparePass(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      next(err)
    }
    next(null, isMatch)
  })
}

const User = mongoose.model('User', userSchema)

module.exports = User
