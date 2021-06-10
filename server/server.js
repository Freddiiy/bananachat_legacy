const WebSocket = require('ws');

const port = 6969;

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
  ws.on('', function incoming(dataArray) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(dataArray);
      }
    })
    console.log('received: %s', message);
  });
});
console.log("listening on port: " + port);