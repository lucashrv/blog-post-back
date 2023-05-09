const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

const categoriesController = require('./controller/CategoriesController')
const articlesController = require('./controller/articlesController')

const Article = require('./controller/models/Article')
const Category = require('./controller/models/Category')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Add headers before the routes are defined
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

connection
    .authenticate()
    .then(() => console.log('Connect to DB'))
    .catch(err => console.log(err))

app.use('/', categoriesController)

app.use('/', articlesController)

app.get('/', (req, res) => {

})

app.listen(3030, () => console.log('Server running'))