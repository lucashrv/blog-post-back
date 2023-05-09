const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const Category = require('./models/Category')

router.get('admin/categories', (req, res) => {
    res.json({ msg: '/categories/post' })
})

router.post('/admin/categories/new', (req, res) => {
    const title = req.body.title

    if(title){

        Category
            .create({
                title: title,
                slug: slugify(title.toLowerCase())
            })
            .then(() => {
                res.send('Categoria criada com sucesso!')
            })

    } else {
        res.json({ error: "'title' is required!" })
    }
})

module.exports = router