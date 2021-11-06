const express = require('express');
const app = express();
const path = require('path');
const WebSocket = require('ws');

const port = process.env.PORT || 6969;

//serves the webpage
app.use(express.static("public"));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
  console.log("serving webpage");
});

//backend websocket
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', function connection(ws) {
  console.log("User connected");
  ws.on('message', function incoming(dataArray) {
    let data = JSON.parse(dataArray);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(dataArray);
      }
    });
  });
});

const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

console.log("listening on port: " + port);