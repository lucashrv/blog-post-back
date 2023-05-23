const express = require('express')
const router = express.Router()
const Article = require('./models/Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
    Article
        .findAll()
        .then(response => res.json(response))
        .catch(err => res.json(err))
})

router.get('/admin/articles/edit/:id', (req, res) => {
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

router.post('/admin/articles/new', (req, res) => {
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

router.put('/admin/articles/update', (req, res) => {
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

router.delete('/admin/articles/delete/:id', (req, res) => {
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