import request from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
import db from '../models/'


const auth = {}
mongoose.Promise = Promise

function loginUser() {
  return (done) => {
    request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'testuser', password: 'secret' })
      .expect(200)
      .end((err, res) => {
        auth.token = res.body.token
        return done()
      })
  }
}

beforeEach((done) => {
  db.User.create({ username: 'testuser', password: 'secret' }).then((user) => {
    auth.current_user = user
    done()
  })
})

beforeEach(loginUser())

afterEach((done) => {
  db.User.remove({}).then(() => {
    done()
  })
})

describe('POST /auth/signup', () => {
  it('should create user (201)', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'test', password: 'secret' })
      .set('Accept', 'application/json')
      .expect(201, done)
  })
})

describe('POST /auth/login', () => {
  it('should log in user (200)', (done) => {
    request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'testuser', password: 'secret' })
      .set('Accept', 'application/json')
      .expect(200, done)
  })
})

describe('GET /users', () => {
  it('should retrieve all users (200)', (done) => {
    request(app)
      .get('/api/v1/user')
      .set('Authorization', `bearer: ${auth.token}`)
      .expect(200, done)
  })
})

describe('GET /users/:id', () => {
  it('should retrieve a single user (200)', (done) => {
    request(app)
      .get(`/api/v1/user/${auth.current_user.id}`)
      .set('Authorization', `bearer: ${auth.token}`)
      .expect(200, done)
  })
})

describe('PATCH /users/:id', () => {
  it('responds with JSON', (done) => {
    request(app)
      .patch(`/api/v1/user/${auth.current_user.id}`)
      .send({
        username: 'bob',
      })
      .set('Authorization', `bearer: ${auth.token}`)
      .expect(200, done)
  })
})

describe('DELETE /users/:id', () => {
  it('responds with JSON', (done) => {
    request(app)
      .delete(`/api/v1/user/${auth.current_user.id}`)
      .set('Authorization', `bearer: ${auth.token}`)
      .expect(204, done)
  })
})
