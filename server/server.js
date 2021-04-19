const express = require('express');
const http = require('http');

const app = express();
const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));
const server = http.createServer(app);
const PORT = 8080
server.listen(8080, () =>{
    console.log("server running on "+ PORT);
});

const io = require('socket.io')(server);


let activeUsers = [];

io.on('connection', (socket) => {

    socket.on('sendToAll', (message) =>{
        io.emit("displayMessage", (message));
    });

    socket.on('sendToSelf', (message) =>{
        socket.emit("displayMessage", (message));
    });

    socket.on('login', (login) =>{
        activeUsers.push(login);
        io.emit("displayConnected", (activeUsers));
        io.emit("serverMessage", (`${login} has joined the chat.`));
    });

    socket.on('logout', (logout) =>{
        for (let i = 0; i < activeUsers.length; i++){
            if(activeUsers[i] === logout){
                activeUsers.splice(i,1);
                i = activeUsers.length
            }
        }
        io.emit("displayConnected", (activeUsers));
        io.emit("serverMessage", (`${logout} has left the chat.`));
    });



});




