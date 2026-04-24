import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
} from "../controllers/sessionController.js";

console.log("✅ sessionRoute loaded");

const router = express.Router();

// ✅ ADD LOG INSIDE ROUTE (CORRECT WAY)
router.post("/", protectRoute, (req, res, next) => {
  console.log("🔥 Create session API HIT");
  next(); // move to controller
}, createSession);

router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);

export default router;



