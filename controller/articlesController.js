const express = require('express')
const router = express.Router()
const Article = require('./models/Article')
const Category = require('./models/Category')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth, (req, res) => {
    Article
        .findAll({
            include:[{ model: Category }]
        })
        .then(response => res.json(response))
        .catch(err => res.json(err))
})

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const { id } = req.params

    Article.findByPk(id)
        .then(article => {
            if (article != undefined && !isNaN(id)) {
                res.json(article)
            } else {
                res.json('Artigo com id não encontrado!')
            }
        })
        .catch(err => res.json(err))
})

router.get('/articles/GetArticlesByCategory/:id', (req, res) => {
    const { id } = req.params

    Category
        .findOne({
            where: { id },
            include: [{ model: Article }]
        })
        .then(response => res.json(response))
        .catch(err => res.json(err))
})

router.get('/articles/pagination/:page', (req,res) => {
    const { page } = req.params
    let offset = 0

    if (isNaN(page) || page == 1){
        offset = 0
    } else {
        offset = parseInt(page) * 4 - 4
    }

    Article
        .findAndCountAll({
            limit: 4,
            offset: offset,
            order: [[ 'id', 'DESC' ]]
        })
        .then(response => {
            let next

            if(offset + 4 >= response.count){
                next = false
            } else {
                next = true
            }

            const result = {
                next,
                data: response
            }

            res.json(result)
        })
        .catch(err => res.json(err))
})

router.post('/admin/articles/new', adminAuth, (req, res) => {
    const { title, body, categoryId } = req.body

    if (!title) {
        res.json("'title' is required!")
        return
    }
    if (!body) {
        res.json("'body' is required!")
        return
    }
    if (!categoryId) {
        res.json("'categoryId' is required!")
        return
    }

    Article.create({
        title,
        slug: slugify(title.toLowerCase()),
        body,
        categoryId
    })
        .then(response => res.json(response))
        .catch(err => res.json(err))
})

router.put('/admin/articles/update', adminAuth, (req, res) => {
    const { id, title, body, categoryId } = req.body

    Article.update(
        {
            id,
            title,
            body,
            categoryId,
            slug: slugify(title.toLowerCase())
        },
        { where: { id } }
    )
        .then(response => res.json(response))
        .catch(err => res.json(err))
})

router.delete('/admin/articles/delete/:id', adminAuth, (req, res) => {
    const { id } = req.params

    if (id != undefined && !isNaN(id)) {
        Article.destroy({
            where: { id }
        })
            .then(() => res.json(`Artigo com id ${id} deletado com sucesso`))
            .catch(err => res.json(err))
    } else {
        res.json('id inválido')
    }
})

module.exports = router