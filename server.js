const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { userJoin, getCurrentUser, userLeave } = require('./tempDB/user');
const publicDir = path.resolve(__dirname, 'public');

const app = express();
app.use(express.static(publicDir));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {

    socket.on('joinRoom', ({ room, username }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        // Emits to current users / connections
        socket.emit('connected', `Hello ${user.username} welcome to ${user.room}`);
        // EMits to all other users / connections except current
        socket.broadcast.to(user.room).emit('message', `${user.username} joined room ${user.room}`);
    });


    socket.on('message', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', ({ msg, user }));
    });


    // Emits to all users / connections
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', `User ${user.username} has left`);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
