const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET_KEY = "zaglushka"

const generateAccessToken = (id, email) => {
    const payload = { id, email }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" })
}

class UserController {
    //Регистрация
    async registration(req, res) {
        try {
            const { email, password } = req.body
            
            //Проверяем на email
            const candidate = await db.query('SELECT * FROM users WHERE email = $1', [email])
            if (candidate.rows.length > 0) {
                return res.status(400).json({ message: "Пользователь с таким email уже существует" })
            }

            //Шифруем пароль
            const hashPassword = await bcrypt.hash(password, 5)

            //Сохраняем в базу
            const newUser = await db.query(
                `INSERT INTO users (email, password_hash) values ($1, $2) RETURNING id, email`, 
                [email, hashPassword]
            )

            const token = generateAccessToken(newUser.rows[0].id, newUser.rows[0].email)
                return res.json({ token, user: newUser.rows[0] })
        } catch (e) {
                res.status(500).json({ message: "Ошибка регистрации" })
            }
    }

    //Авторизация
    async login(req, res) {
        try {
            const { email, password } = req.body

            //Ищем пользователя
            const user = await db.query('SELECT * FROM users WHERE email = $1', [email])
            if (user.rows.length === 0) {
                return res.status(400).json({ message: "Пользователь не найден" })
            }

            //Сравниваем введенный пароль с захешированным в базе
            const validPassword = bcrypt.compareSync(password, user.rows[0].password_hash)
            if (!validPassword) {
                return res.status(400).json({ message: "Введен неверный пароль" })
            }

            const token = generateAccessToken(user.rows[0].id, user.rows[0].email)
            //Возвращаем данные
            return res.json({ 
                token, 
                user: { id: user.rows[0].id, email: user.rows[0].email } 
            })
        } catch (e) {
            res.status(500).json({ message: "Ошибка входа" })
        }
    }


}

module.exports = new UserController()