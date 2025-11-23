const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');
const { use } = require('react');

//Регистрация

router.post('/register', async(req, res) => {
    try{
        const {email, username, password} = req.body;

        //Проверяем существует ли пользователь
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400). json( {error: 'User already exists'});
        }

        //Хешируем пароль
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Создаем пользователя

        const newUser = await pool.query(
            'INSERT INTO users (email, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, username, role',
            [email, username, hashedPassword, 'player']
        );

        //Генерируем JWT токен
        const token = jwt.sign(
            {userId: newUser.rows[0].id},
            process.env.JWT_SECRET,
            { expiresIn: '24h'}
        );

        res.status(201).json({
            token, user: newUser.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
});

//Логин

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        //Находим пользователя
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({error: "Invalid credentials"});
        }

        //Проверяем пароль
        const isValidPassword = await bcrypt.compare(
            password,
            user.rows[0].password_hash
        );

        if (!isValidPassword){
            return res.status(400).json({error: "Invalid credentials"});
        }

        //Генерируем JWT токен
        const token = jwt.sign(
            { userId: user.rows[0].id},
            process.env.JWT_SECRET,
            { expiresIn: '24h'}
        );

        res.json({
            token,
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
                username: user.rows[0].username,
                role: user.rows[0].role
            }
        });
    } catch (error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
});

module,exports = router;