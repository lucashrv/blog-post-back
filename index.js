const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const session = require('express-session')

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Controllers
const categoriesController = require('./controller/CategoriesController')
const articlesController = require('./controller/ArticlesController')
const usersController = require('./controller/UsersController')

//Models
const Article = require('./controller/models/Article')
const Category = require('./controller/models/Category')
const User = require('./controller/models/User')

//Session
app.use(session({
    secret: process.env.SECRET_SESSION,
    cookie: { maxAge: 30000000 }
  }))

//Add headers before the routes are defined
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

connection
    .authenticate()
    .then(() => console.log('Connect to DB'))
    .catch(err => console.log(err))

//Routes
app.use('/', categoriesController)

app.use('/', articlesController)

app.use('', usersController)

app.get('/', (req, res) => {
    Article
        .findAll({
            order: [["id", 'DESC']],
            raw: true
        })
        .then(response => res.json(response))
        .catch(err => res.json(err))
})

app.listen(8000, () => console.log('Server running'))