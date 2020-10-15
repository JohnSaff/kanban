const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const { response } = require('express')
const app = express()
const {Board,Task,User,sequelize} = require("./models")

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
async function sync() {
 await sequelize.sync()
}
sync()
app.listen(3000, () => console.log('web server running on port 3000'))

//---------rendering create User page ------

app.get('/users/create',(req,res)=>{
    res.render('createUser')
})

//------rendering create board page-----
app.get('/boards/create',(req,res)=>{
    res.render('createBoard')
})


//--------creating board post request

app.post('/boards/create',async (req,res)=>{
    console.log('creating board')
    const board = await Board.create({name:req.body.name,description:req.body.description,})
    res.redirect(`/boards/${board.id}`)
})


//--------post request to add user to db from create user page

app.post('/users/create',async (req,res)=>{
    console.log('creating user')
    const user = await User.create({username:req.body.username,avatar:req.body.avatar})
    res.redirect(`/users/${user.id}`)
})

//-----rendering home page-----

app.get('/',async (req,res)=>{
    const boards = await Board.findAll({
        include: [{model:User}],
        nest: true
    })
    res.render('home',{boards})
})
