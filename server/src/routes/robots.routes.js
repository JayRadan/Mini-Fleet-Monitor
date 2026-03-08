// STEP 1: Create Express router.
// STEP 2: Apply auth middleware to all robot routes.
// STEP 3: Implement GET / -> return all robots.
// STEP 4: Implement POST /:id/move -> move one robot.
// STEP 5: Broadcast robot update to websocket clients.

import express from "express";
import { checkToken } from "../middleware/chekToken.js";
import { getAllRobots, moveRobotById , changeRobotStatusById} from "../services/robotService.js";
import { broadcastRobotUpdate } from "../services/wsHub.js";
const router = express.Router();
router.use(checkToken); 
router.get("/", async (_req, res,next) => {
  
  try {
    const robots = await getAllRobots();
    return res.status(200).json(robots);
  } catch (err) {
       next({message:err.message, status: 500}); // Pass error to global handler
  }

});

router.post("/:id/move", async (_req, res,next) => {
  try {
    const { id } = _req.params;
    const { x, y } = _req.body; // Expect { x: number, y: number }
    const robot = await moveRobotById(id, { x, y });
    if (!robot) {
      return next({ message: "Robot not found", status: 404 });
    }
    broadcastRobotUpdate(robot);
    return res.status(200).json(robot);
  } catch (err) {
    next({message:err.message, status: 500});
  }
});

router.post("/:id/change-status", async (_req, res,next) => {
  try {
    console.log("changeRobotStatus", _req.params, _req.body);
    const { id } = _req.params;
    const { status } = _req.body; // Expect { status: "stopped" | "moving" }
    if (!["stopped", "moving"].includes(status)) {
      return next({ message: "Invalid status value", status: 400 });
    }
    const robot =await changeRobotStatusById(id, status);
    if (!robot) {
      return next({ message: "Robot not found", status: 404 });
    }
    broadcastRobotUpdate(robot);
    return res.status(200).json(robot);
  } catch (err) {
    next({message:err.message, status: 500});
  }
});

export default router;
