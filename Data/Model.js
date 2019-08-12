const Sequelize = require('sequelize')
const db = require('../db')

const Group = db.define(
  'groups',
  {
    name: Sequelize.STRING,
    status: Sequelize.STRING
  })

const User = db.define(
  'users',
  {
    name:Sequelize.STRING,
    password: Sequelize.STRING,
    name: Sequelize.STRING,
    word: Sequelize.STRING,
    correctWord: Sequelize.STRING,
    incorrectWord: Sequelize.STRING
  }
)  

User.belongsTo(Group)
Group.hasMany(User) 

module.exports = {
  Group,
 User
}
