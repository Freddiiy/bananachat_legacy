const WebSocket = require('ws');

const port = 6969;

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(dataArray) {
    wss.clients.forEach(function each(client) {
      console.log("client is not itself: ", client !== ws);
      console.log("client is open: ", client.readyState === WebSocket.OPEN);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(dataArray);
        console.log("data sent back: ", dataArray);
      }
    })
    console.log('received: %s', dataArray);
  });
});
console.log("listening on port: " + port);