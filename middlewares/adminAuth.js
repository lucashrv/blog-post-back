const adminAuth = (req, res, next) => {
    // if (!req.session.user) return res.status(401).json({ msg: 'Acesso negado!' })
    next()
}

module.exports = adminAuth