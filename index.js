const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const users = [];
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(`${__dirname}/frontend`));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './frontend/main.html'));
});

io.on('connection', (socket) => {
    socket.on('login', (data)=> {
        if (!users.includes(data)) {
            users.push(data);
            socket.nickname = data;
            io.sockets.emit('login', {status: 'OK', })
            io.sockets.emit('users', {users})
        }
        else io.sockets.emit('login', {status: 'FAILED'})
    })

    socket.on('message', (data)=> {
        io.sockets.emit('new message', {
            message: data.inputValue,
            nickname: data.nicknameValue
        })
    })


    socket.on('disconnect', (data)=> {
        for (let i=0; i< users.length; i++) {
            if (users[i] === socket.nickname) users.splice(i, 1)
        }
        io.sockets.emit('users', {users})
    })
})

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});