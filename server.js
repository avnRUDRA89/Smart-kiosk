const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');

const PORT = 8080;

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname)));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const dataFile = path.join(__dirname, 'visitor_data.csv');

try {
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, 'Name\n'); 
    }
} catch (err) {
    console.error('Error creating or checking data file:', err);
}

wss.on('connection', function connection(ws) {
    console.log('New client connected from', ws._socket.remoteAddress);

    ws.on('message', function incoming(message) {
        const msg = typeof message === 'string' ? message : message.toString();
        console.log('Received message:', msg);

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });

        if (msg.startsWith('Visitor:')) {
            const name = msg.replace('Visitor:', '').trim();
            try {
                fs.appendFileSync(dataFile, `${name}\n`);
            } catch (err) {
                console.error('Error writing to data file:', err);
            }
        }
    });

    ws.send('Connection established');
});

wss.on('error', function error(err) {
    console.error('WebSocket server error:', err);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
    console.log(`Or use the IP address of the server for LAN access: http://<ip-address>:${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Shutting down WebSocket server...');
    wss.close(() => {
        console.log('WebSocket server closed.');
        process.exit(0);
    });
});
