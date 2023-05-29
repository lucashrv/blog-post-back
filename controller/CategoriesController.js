const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const Category = require('./models/Category')
const Article = require('./models/Article')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/categories', adminAuth, (req, res) => {
    Category
        .findAll({
            order: [
                [ 'id', 'ASC' ]
            ],
            raw: true
        })
        .then(response => res.json(response))
        .catch(err => res.json(err))
})

router.post('/admin/categories/new', adminAuth, (req, res) => {
    const { title } = req.body

    if(title){

        Category
            .create({
                title: title,
                slug: slugify(title.toLowerCase())
            })
            .then(response => res.json(response))
            .catch(err => res.json(err))

    } else {
        res.json({ error: "'title' is required!" })
    }
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    const { id } = req.params

    Category
        .findByPk(id)
        .then(category => {
            if (category != undefined && !isNaN(id)) {
                res.json(category)
            } else {
                res.json('Categoria com id não encontrado!')
            }
        })
        .catch(err => res.send(err))
})

router.put('/admin/categories/update', adminAuth, (req, res) => {
    const { id, title } = req.body

    Category.update(
        {
            title,
            slug: slugify(title.toLowerCase())
        },
        { where: { id } }
    )
        .then(response => res.status(200).json(response))
        .catch(err => res.json(err))
})

router.delete('/admin/categories/delete/:id', adminAuth, (req, res) => {
    const { id } = req.params

    const isArticleCategory =
        Article.findOne({
            where: { categoryId: id }
        })

    if(isArticleCategory) return res.status(422).json({ msg: 'Há artigos cadastrados nessa categoria' })

    if (id != undefined && !isNaN(id)) {
        Category.destroy({
            where: { id }
        })
            .then(() => res.json(`Categoria com id ${id} deletado com sucesso`))
            .catch(err => res.json(err))
    }
})

module.exports = router