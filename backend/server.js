const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {createServer} = require('http');
const {Server} = require('socket.io');

require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5252",
        methods: ["GET", "POST"]
    }
});

//Middleware
app.use(cors());
app.use(express.json());

//Database connection
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/characters', require('./routes/characters'));
app.use('/api/campaigns', require('./routes/campaignt'));
app.use('/api/spells', require('./routes/spells'));
app.use('/api/monsters', require('./routes/monsters'));

//Socket.io для реального времени

io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    socket.on('join-campaign', (campaignId) => {
        socket.join(`campaign-${campaignId}`);
    });

    socket.on('send-message', (data) => {
        io.to(`campaign-${data.campaignId}`).emit('new-message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});