const Sse = require('json-sse')
const stream = new Sse()
const bcrypt = require('bcrypt')
const { toJWT, toData } = require('./jwt')
const { Router } = require('express')
const { Game, User } = require('./Model')
const router = new Router

router.get('/stream',
  async (request, response) => {
    const games = await Game
      .findAll({ include: [User] })

    const data = JSON.stringify(games)
    stream.updateInit(data)

    stream.init(request, response)
  }
)

router.post('/user',
  async (request, response) => {
    const{
      name,
      password,
      word,
      correctWord,
      incorrectWord
    } = request.body

    console.log('request.body test:', request.body)

    const entity = await User.create({
      name,
      password,
      word,
      correctWord,
      incorrectWord
    })

    console.log("entity", entity)
    const games = await Game.findAll({
      include: [User]
    })
    const data = JSON.stringify(games)
  
    stream.updateInit(data)
    stream.send(data)

    response.send(entity)
  }
)

router.post('/login',
async (request, response) => {
  //request.body.email !== '' && request.body.password !== ''
  if (request.body.email, request.body.password !== '') {
    response.status(400).send({
      message: 'Please supply a valid email and password'
    })
  }
  else {
    User
      .findOne({
        where: {
          email: request.body.email,
        }
      })
      await (entity => {
        if (!entity) {
          response.status(400).send({
            message: 'User with that email does not exist'
          })
        }
        if (bcrypt.compareSync(request.body.password, entity.password)) {
          response.send({
            jwt: toJWT({ userId: entity.id })
          })
        }
        else {
          response.status(400).send({
            message: 'Password was incorrect'
          })
        }
      })
      .catch(err => {
        console.error(err)
        response.status(500).send({
          message: 'Something went wrong'
        })
      })
    response.send({
      jwt: toJWT({ userId: 1 })
    })
  }
})



module.exports = router