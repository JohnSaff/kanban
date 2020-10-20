const {Sequelize,Model,DataTypes} = require('sequelize')
const path = require('path')

const connectionSettings = {
    test: {dialect: 'sqlite', storage: 'sqlite::memory:'},
    dev: {dialect: 'sqlite', storage: path.join(__dirname, 'data.db')},
    production: {dialect: 'postgres', protocal: 'postgres'}
}
const sequelize = process.env.NODE_ENV === 'production'
    ? new Sequelize(process.env.DATABASE_URL, connectionSettings[process.env.NODE_ENV])
    : new Sequelize(connectionSettings[process.env.NODE_ENV])

//pointless change
class User extends Model{}
User.init({
    username: DataTypes.STRING,
    avatar: DataTypes.STRING
},{sequelize:sequelize})

class Board extends Model{}
Board.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
},{sequelize:sequelize})

class Task extends Model{}
Task.init({
    taskName: DataTypes.STRING,
    taskDescription: DataTypes.STRING,
    status: DataTypes.STRING,
    priority: DataTypes.STRING,
    deadline: DataTypes.DATE
},{sequelize:sequelize})

User.hasMany(Task,{as: 'tasks'})
Task.belongsTo(User)
Board.hasMany(Task,{as:'tasks'})
Task.belongsTo(Board)
User.belongsToMany(Board,{through:'userboards'})
Board.belongsToMany(User,{through:'userboards'})

module.exports ={
    Task,
    User,
    Board,
    sequelize
}
