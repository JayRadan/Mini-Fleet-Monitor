// STEP 1: Read simulation interval from env config.
// STEP 2: Every 2 seconds, move all robots.
// STEP 3: Broadcast each updated robot via websocket.
// STEP 4: Handle/log errors so timer keeps running.
// STEP 5: Return timer reference for optional stop control.
import { moveAllRobotsWithStatusMoving } from "./robotService.js";
import { broadcastRobotUpdate } from "./wsHub.js";

function startRobotSimulation() {
  const intervalMs = Number(process.env.SIMULATION_INTERVAL_MS) || 2000;

  const timer = setInterval(async () => {
    try {
      const updatedRobots = await moveAllRobotsWithStatusMoving();
      updatedRobots.forEach((robot) => broadcastRobotUpdate(robot));
    } catch (error) {
      console.error("[Simulation] Failed to update robots:", error.message);
    }
  }, intervalMs);

  return timer;
}

export { startRobotSimulation };
