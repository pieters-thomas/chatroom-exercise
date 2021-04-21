const express = require('express');
const http = require('http');

const app = express();
const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));
const server = http.createServer(app);
const PORT = 8080
server.listen(8080, () => {
    console.log("server running on " + PORT);
});

const io = require('socket.io')(server);

async function UpdateOnline() {
    let activeUsers = [];
    for (const link of await io.fetchSockets()) {
        if(link !== undefined){
            activeUsers.push(link.data.user);
        }
    }
    io.emit("displayConnected", (activeUsers));
}

io.on('connection', (socket) => {

    socket.on('login', async (user) => {
        socket.data.user = user;
        await UpdateOnline();
        socket.broadcast.emit("serverMessage", (`${socket.data.user.username} has joined the chat.`));
    });

    socket.on('disconnect', async function () {
        await UpdateOnline()
        io.emit("serverMessage", (`${socket.data.username} has left the chat.`));
    });

    socket.on('sendToAll', (message) => {
        io.emit("displayMessage", (message));
    });

    socket.on('sendMessage', async function (target, message) {
        for (let link of await io.fetchSockets()) {
            if(link.data.user.username === target)
            {
                socket.in(link.id).emit("displayMessage", (message));
                socket.emit("displayMessage", (message));
                return;
            }
        }
        socket.emit("serverMessage", (`Provided username is invalid.`));

    });

    socket.on('typing', (user) => {
        socket.broadcast.emit('typing', user);
    })

});





