// STEP 1: Initialize ws WebSocketServer on path /ws.
// STEP 2: Track connected clients automatically via ws server.
// STEP 3: Implement broadcastRobotUpdate(robot).
// STEP 4: Send JSON payload to all OPEN clients.
import { WebSocketServer, WebSocket } from "ws";

let wss;

function setupWebSocket(server) {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "ws:connected" }));
  });

  return wss;
}

function broadcastRobotUpdate(robot) {
  if (!wss) {
    return;
  }

  const payload = JSON.stringify({
    type: "robot:update",
    data: robot,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

export { setupWebSocket, broadcastRobotUpdate };
