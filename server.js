const WebSocket = require('ws');
const config = require('./config');

// Create WebSocket server
const wss = new WebSocket.Server({ port: config.port});

// Store overall match log
let scoreLog = [];

// Broadcast to all clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', (ws) => {
  console.log("✅ New client connected");

  // // Send full score log on connection
  // ws.send(JSON.stringify({ type: "fullLog", log: scoreLog }));

  ws.on('message', (message) => {
    try {
      let data = JSON.parse(message);
      console.log("📢 Received:", data);
      if (data.for == 'Cricketpanel') {
        // Broadcast updated log
        broadcast({ type: data.for, log: data.score });
        console.log("📢 Update:", entry);
      }
    } catch (err) {
      console.error("❌ Invalid message:", message);
    }
  });

  ws.on('close', () => {
    console.log("❌ Client disconnected");
  });
});

console.log(`🚀 LiveStrike WebSocket Server running on ws://${config.port}`);
