const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);


app.use(express.static(path.join(__dirname, 'client')));
app.get('/healthcheck', (req, res) => {
    res.send('<h2>RPS App running....</h2>');
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', (socket) => {
    console.log("user is connected");
    socket.on('disconnect', () => {
        console.log('user dsiconnected');
    })
});

server.listen(3000, () => {
    console.log('listening on * : 3000');
})