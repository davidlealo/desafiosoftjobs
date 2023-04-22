const express = require('express')
const cors = require('cors')
const jwt = require("jsonwebtoken")
const app = express()

app.use(express.json())
app.use(cors())

const { registro, loguear, obtenerDatos } = require('./consultas')

app.listen(3000, () => {console.log('Servidor funcionando en el puerto 3000')})

const reportarConsultas = async (req, res, next) => {
    const parametros = req.params
    const url = req.url
    console.log(`Hoy ${new Date()} recibimos una consulta en ${url} con los parametros:`, parametros)
    next()
}


app.post('/usuarios', reportarConsultas, async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body
        await registro(email, password, rol, lenguage)
        res.send('Nuevo usuario registrado')
    }
    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})


app.post('/login', reportarConsultas, async (req, res) => {
    try {
        const { email, password } = req.body
        await loguear(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    }
    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

app.get('/usuarios', reportarConsultas, async (req, res) => {
    try {
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        const datos = await obtenerDatos(email)
        res.json(datos)
    }
    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})