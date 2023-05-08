const express = require('express')
const router = express.Router()

router.get('/articles', (req, res) => {
    res.json({ msg: '/articles' })
})

router.get('admin/articles/new', (req, res) => {
    res.json({ msg: '/articles/post' })
})

module.exports = router