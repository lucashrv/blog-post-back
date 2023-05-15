const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const Category = require('./models/Category')

router.get('/admin/categories', (req, res) => {
    Category
        .findAll({
            order: [
                [ 'id', 'ASC' ]
            ],
            raw: true
        })
        .then(category => res.send(category))
        .catch(err => res.send(err))
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

router.delete('/admin/categories/delete/:id', (req, res) => {
    const { id } = req.params

    if (id != undefined && !isNaN(id)) {
        Category.destroy({
            where: { id }
        })
            .then(() => res.json(`Categoria com id ${id} deletado com sucesso`))
            .catch(err => res.json(`Ocorreu um erro: ${err}`))
    }
})

module.exports = router