const WebSocket = require('ws');
const express = require('express');
const app = express();

const appPort = process.env.PORT || 80;
const port = process.env.PORT ||6969;

//serves the webpage
app.use(express.static("public"));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
  console.log("serving webpage");
});

app.listen(appPort);
console.log("Website live on: " + appPort);

//backend websocket
const wss = new WebSocket.Server({ port: port });

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
console.log("listening on port: " + port);