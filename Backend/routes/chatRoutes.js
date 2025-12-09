// import express from "express";
// import { handleChat, createLead } from "../controllers/chatController.js";

// const router = express.Router();

// // Chat AI endpoint
// router.post("/chat", handleChat);

// // Lead capture endpoint
// router.post("/lead", createLead);

// export default router;






import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { sendMessage, getHistory } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat/message", authMiddleware, sendMessage);
router.get("/chat/history", authMiddleware, getHistory);

export default router;
