import { WebSocketServer } from "ws";
var wss = new WebSocketServer({ port: 8000 });
wss.on('connection', function (ws) {
    console.log("Client connected");
    ws.on('message', function (message) {
        console.log("Received message => ".concat(message));
        ws.send("You sent => ".concat(message));
    });
    ws.on('close', function () {
        console.log("Client disconnected");
    });
    ws.send('Hello from server!');
});
console.log('WebSocket server is running on ws://localhost:8080');
