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

connection
    .authenticate()
    .then(() => console.log('Connect to DB'))
    .catch(err => console.log(err))

app.use('/', categoriesController)

app.use('/', articlesController)

app.get('/', (req, res) => {
    res.json({ sadasdsa: 'Positivo' })
})

app.listen(3030, () => console.log('Server running'))