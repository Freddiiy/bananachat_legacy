const WebSocket = require('ws');

const port = 6969;

const wss = new WebSocket.Server({ port: port });

var inMsg;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(message);
  });
});
console.log("listening on port: " + port);