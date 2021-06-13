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
      }
    })
    let data = JSON.parse(dataArray);
    if (data[0] == "message") {
      let username = data[1];
      let userInput = data[2];
      console.log('type: ' + data[0] + ' ' + username + ' says: ' + userInput);
    } else if (data[0] == "file") {
      let username = data[1];
      console.log('type: ' + data[0] + ' from ' + username);
    }
  });
});

const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

console.log("listening on port: " + port);
