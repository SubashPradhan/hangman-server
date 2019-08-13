const Sequelize = require('sequelize')
const db = require('../db')

const Game = db.define(
  'games',
  {
    name: Sequelize.STRING,
    status: Sequelize.STRING
  })

const User = db.define(
  'users',
  {
    name:{
      type: Sequelize.STRING,
      allowNull: false
    },
    password: Sequelize.STRING,
    name: Sequelize.STRING,
    word: Sequelize.STRING,
    correctWord: Sequelize.STRING,
    incorrectWord: Sequelize.STRING
  }
)  

User.belongsTo(Game)
Game.hasMany(User) 

module.exports = {
  Game,
  User
}
