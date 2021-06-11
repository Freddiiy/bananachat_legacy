const express = require('express');
const app = express();
const WebSocket = require('ws');


const port = process.env.PORT || 80;

//serves the webpage
app.use(express.static("public"));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
  console.log("serving webpage");
});

//backend websocket
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(dataArray) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(dataArray);
        console.log("data sent back: ", dataArray);
      }
    })
    let data = JSON.parse(dataArray);
    let username = data[0];
    let userInput = data[1];
    console.log(username + ' says: ' + userInput);
  });
});

const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

console.log("listening on port: " + port);