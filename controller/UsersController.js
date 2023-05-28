const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./models/User')

const checkToken = (req, res, next) => {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(" ")[1]

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' })
    }

    try {

        const secret = process.env.SECRET
        jwt.verify(token, secret)

        next()

    } catch (err) {
        return res.status(400).json({ msg: 'Token invalido!' })
    }
}

router.get('/admin/user', (req, res) => {
    User
        .findAll()
        .then(response => res.json(response))
        .catch(err => res.json(err))
})

// private route

router.get('/admin/user/:id', checkToken, async (req, res) => {
    const { id } = req.params

    const user =
        await User
            .findOne({
                where: { id },
                raw: true,
                attributes: { exclude: [ 'password' ] }
                //exclude
            })

    // validation
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' })
    }

    res.status(200).json({ ...user })
})

// Register User - public route

router.post('/user/register', async (req, res) => {
    const {
        userName,
        password,
        confirmPassword,
        email,
        firstName,
        lastName
    } = req.body

    if (!userName) return res.status(422).json({ msg: 'O nome é obrigatório' })

    if (!password) return res.status(422).json({ msg: 'A senha é obrigatória' })

    if (password !== confirmPassword) return res.status(422).json({ msg: 'A senha está diferente de confirmar a senha' })

    if (!email) return res.status(422).json({ msg: 'O email é obrigatório' })

    const userExists = await User.findOne({ where: { userName } })
    const passwordExists = await User.findOne({ where: { password } })
    const emailExists = await User.findOne({ where: { email } })

    if (userExists) {
        return res.status(422).send({ msg: 'Usuário já cadastrado no sistema' })
    }
    if (passwordExists) {
        return res.status(422).send({ msg: 'Senha já cadastrada no sistema' })
    }
    if (emailExists) {
        return res.status(422).send({ msg: 'Email já cadastrado no sistema' })
    }

    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)

    try {
        await User.create({
            userName,
            password: hash,
            email,
            firstName,
            lastName
        })
            .then(resp => res.status(201).json({
                msg: 'Usuário criado com sucesso',
                data: resp
            }))
    } catch (err) {
        console.log(err)

        res.status(500).json({ msg: 'Ocorreu um erro' })
    }
})

// Login user - public route

router.post('/user/login', async(req, res) => {
    const { userName, password } = req.body

    if (!userName) return res.status(422).json({ msg: 'O nome é obrigatório' })

    if (!password) return res.status(422).json({ msg: 'A senha é obrigatória' })

    const user = await User.findOne({ where: { userName } })

    if (!user) {
        return res.status(404).send({ msg: 'Usuário não encontrado' })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).send({ msg: 'Senha inválida' })
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign({ id: user._id }, secret)

        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token })

    } catch (err) {
        console.log(err)

        res.status(500).json({ msg: 'Ocorreu um erro' })
    }
})

module.exports = router