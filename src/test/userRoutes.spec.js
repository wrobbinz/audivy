import request from 'supertest'
import chai from 'chai'
import mongoose from 'mongoose'
import app from '../app'
import db from '../models/'


const expect = chai.expect
const auth = {}
let token

mongoose.Promise = Promise


function loginUser(auth) {
  return (done) => {
    function onResponse(err, res) {
      auth.token = res.body.token
      return done()
    }

    request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'test',
        password: 'secret',
      })
      .expect(200)
      .end(onResponse)
  }
}

beforeEach((done) => {
  db.User.create({ username: 'test', password: 'secret' }).then((user) => {
    auth.current_user = user
    done()
  })
})

beforeEach(loginUser(auth))

afterEach((done) => {
  db.User.remove({}).then(() => {
    done()
  })
})

describe('POST /auth/signup', () => {
  it('responds with JSON when created', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'elie', password: 'secret' })
      .set('Accept', 'application/json')
      .expect(201, done)
  })
})

describe('POST /auth/login', () => {
  it('responds with JSON', (done) => {
    request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'test', password: 'secret' })
      .set('Accept', 'application/json')
      .expect(200, done)
  })
})

describe('GET /users', () => {
  it('responds with JSON', (done) => {
    request(app)
      .get('/api/v1/users')
      .set('Authorization', `bearer: ${auth.token}`)
      .expect(200, done)
  })
})

describe('GET /users/:id', () => {
  it('responds with JSON', (done) => {
    request(app)
      .get(`/api/v1/users/${auth.current_user.id}`)
      .set('Authorization', `bearer: ${auth.token}`)
      .expect(200, done)
  })
})

describe('PATCH /users/:id', () => {
  it('responds with JSON', (done) => {
    request(app)
      .patch(`/api/v1/users/${auth.current_user.id}`)
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
      .delete(`/api/v1/users/${auth.current_user.id}`)
      .set('Authorization', `bearer: ${auth.token}`)
      .expect(204, done)
  })
})
