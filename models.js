const {Sequelize,Model,DataTypes} = require('sequelize')
const path = require('path')
const sequelize = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', null, null, {dialect: 'sqlite'})
    : new Sequelize({dialect: 'sqlite', storage: path.join(__dirname, 'data.db')})

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
