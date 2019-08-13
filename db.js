const Sequelize = require('sequelize')
// const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const databaseUrl = process.env.DATABASE_URL || "https://calm-reef-14417.herokuapp.com"
const db = new Sequelize(databaseUrl)

db.sync({force: false})
  .then(() => console.log("Database has been updated!"))
  .catch((error) => {
    console.log(error)
  })  

module.exports = db  