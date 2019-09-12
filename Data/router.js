const Sse = require('json-sse')
const stream = new Sse()
const bcrypt = require('bcrypt')
const { toJWT, toData } = require('./jwt')
const { Router } = require('express')
const { Game, User } = require('./Model')
const  {verifyToken} = require('./verifyToken')
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

    const entity = await User.create({
      name,
      password: bcrypt.hashSync(password, 10),
      word,
      correctWord,
      incorrectWord
    })

    response.send(entity)
  }
)

async function update () {
  const games = await Game.findAll({
    include: [User]
  })
  const data = JSON.stringify(games)
  stream.send(data)
}

router.post('/game', verifyToken,
  async(request, response) => {
    const game = await Game.create(request.body)
    await update()
 
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
              jwt: toJWT({ userId: entity.id }),
              name: entity.name
            })
          } else {
            response.status(400).send({
              message: "Please Enter the correct password"
            })
          }
        })

    }
  })

router.put('/join', async (request, response) => {
  const { jwt, gameId } = request.body
  const { userId } = toData(jwt)

  const count = await User.update(
    { gameId },
    { where: { id: userId } }
  )
  await update()
  response.send({ count })
})

module.exports = router