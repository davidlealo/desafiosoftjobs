const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'softjobs',
    allowExitOnIdle: true
})

const registro = async (email, password, rol, lenguaje) => {
    const consulta = 'INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)'
    const passwordEncriptado = bcrypt.hashSync(password)
    const values = [email, passwordEncriptado, rol, lenguaje]
    await pool.query(consulta, values)
}

const loguear = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: passwordEncriptado } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptado)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}

const obtenerDatos = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const values = [email]
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)

    if (!rowCount) {
        throw { code: 404, message: "Usuario no encontrado" }
    }
    delete usuario.password
    return usuario
}

module.exports = { registro, loguear, obtenerDatos }