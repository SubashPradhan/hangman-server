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
    const {
      name,
      password,
      word,
      correctWord,
      incorrectWord
    } = request.body

    console.log('request.body test:', request.body)

    const entity = await User.create({
      name,
      password: bcrypt.hashSync(password, 10),
      word,
      correctWord,
      incorrectWord
    })

    response.json(entity)
  })

router.post('/game',
  async(request, response) => {
    const game = await Game.create(request.body)
    const games = await Game.findAll({
      include: [User]
    })
    const data = JSON.stringify(games)
    stream.send(data)
 
    response.send(game)
  }
 )  

router.post('/game',
 async(request, response) => {
   const game = await Game.create(request.body)
   const games = await Game.findAll({
     include: [User]
   })
   const data = JSON.stringify(games)
   stream.send(data)

   response.send(game)
 }
)

router.post('/login',
  async (request, response) => {
    if (!request.body.name || !request.body.password) {
      response.status(400).send({
        message: 'Please supply a valid name and password'
      })
    }
    else {
      User
        .findOne({
          where: {
            name: request.body.name,
          }
        })
        .then(entity => {

          if (!entity) {
            return response.status(400).send({
              message: 'User with that name does not exist'
            })
          }
          if (bcrypt.compareSync(request.body.password, entity.password)) {

            response.send({
              jwt: toJWT({ userId: entity.id })
            })
          } else {
            response.status(400).send({
              message: "Please Enter the correct password"
            })
          }
        })

    }
  })

module.exports = router