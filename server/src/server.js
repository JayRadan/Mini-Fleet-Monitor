// STEP 1: Load app and create HTTP server.
// STEP 2: Connect/init DB + Redis + bootstrap data.
// STEP 3: Setup websocket hub.
// STEP 4: Start robot simulation timer.
// STEP 5: Listen on configured PORT.
// STEP 6: Add graceful shutdown (SIGINT/SIGTERM).
import http from "node:http";
import app from "./app.js";
import { startRobotSimulation } from "./services/robotSimulation.js";
import { setupWebSocket } from "./services/wsHub.js";


async function start() {
  const server = http.createServer(app);
  setupWebSocket(server);
  const simulationTimer = startRobotSimulation();

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
/// Graceful shutdown handler , this will clear the simulation timer and close the server on SIGINT/SIGTERM signals.
/// This ensures that the server can shut down cleanly without leaving hanging timers or open connections.
  const shutdown = (signal) => {
    console.log(`[Server] Received ${signal}, shutting down...`);
    clearInterval(simulationTimer);
    server.close(() => {
      console.log("[Server] Shutdown complete");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();
