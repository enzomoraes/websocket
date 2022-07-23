const http = require('http');
const { WebSocketServer } = require('ws');
let path = require('path');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.', 'views'));
app.use(express.static('public'));


const server = http.createServer(app);
let likes = 0;
let deslikes = 0;

app.get('/', (req, res) => {
  let port = process.env.PORT
  let ip = process.env.IP
  res.render('home', { port, ip });
});


app.get('/local', (req, res) => {
  let port = process.env.PORT
  let ip = process.env.IP
  res.render('local', { port, ip });
});

app.get('/admin/reset', (req, res, next) => {
  likes = 0;
  deslikes = 0;
  websocket.clients.forEach(client => {
    client.send(JSON.stringify({ likes, deslikes }));
  });
  res.json();
})

const websocket = new WebSocketServer({
  server,
});

websocket.on('connection', connection => {
  console.log('new client connected');
  websocket.clients.forEach(client => {
    client.send(JSON.stringify({ likes, deslikes }));
  });
  connection.on('message', message => {
    message.toString() === 'like' ? likes++ : deslikes++;
    // envia array de mensagens
    websocket.clients.forEach(client => {
      client.send(JSON.stringify({ likes, deslikes }));
    });
  });
});

module.exports = server;
