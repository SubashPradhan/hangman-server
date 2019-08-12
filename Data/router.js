const Sse = require('json-sse')
const stream = new Sse()
const bcrypt = require('bcrypt')

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
      user,
      gameId
    } = request.body

    const entity = await User.create({
      user,
      gameId
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

// router.post('/user', (request, response, next) => {
//   const user ={
//     name: request.body.name,
//     password: bcrypt.hashSync(request.body.password, 10)
//   }
//   response.send(request.body)
//   User
//     .create(user)
//     .then(newUser => response.send(newUser))
//     .catch(next)
// })


// router.post('/user',
//  async(request, response) => {
//    const game = await Game.create(request.body)
//    const channels = await Game.findAll({
//      include: [User]
//    })
//    const data = JSON.stringify(data)
//    stream.send(data)

//    response.send(game)
//  }
// )



module.exports = router