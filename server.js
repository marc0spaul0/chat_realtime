const express = require('express');
const path = require('path');
const {application} = require("express");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 5000;
console.log(`Listening on port ${port}`);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html')
});

let messages = [];

io.on('connection', socket =>{
    console.log(`Socket conectado. ID: ${socket.id}`)
    socket.emit('previousMessages', messages);
    socket.on('SendMessage', data => {
        console.log(data)
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    })
});

server.listen(port);