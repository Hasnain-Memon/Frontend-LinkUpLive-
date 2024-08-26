import {WebSocketServer, Data} from "ws";

const wss: WebSocketServer = new WebSocketServer({port: 8000});

wss.on('connection', ws => {
    console.log("Client connected");

    ws.on('message', (message: Data) => {
        console.log(`Received message => ${message}`);
        ws.send(`You sent => ${message}`);
    })

    ws.on('close', () => {
        console.log("Client disconnected");
    })

    ws.send('Hello from server!');
});

console.log('WebSocket server is running on ws://localhost:8080');