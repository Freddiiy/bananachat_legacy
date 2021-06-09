const WebSocket = require('ws');

const port = 6969;

const wss = new WebSocket.Server({ port: port });

var inMsg;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    })
    console.log('received: %s', message);
  });
});
console.log("listening on port: " + port);