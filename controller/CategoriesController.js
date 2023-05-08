const express = require('express')
const router = express.Router()

router.get('admin/categories/new', (req, res) => {
    res.json({ msg: '/categories/post' })
})

module.exports = router