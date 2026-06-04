import express from "express";
import {
  clearHistory,
  deleteConversation,
  getConversationById,
  getHistory,
  sendMessage,
} from "../controllers/chat.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/message", sendMessage);
router.get("/history", getHistory);
router.get("/history/:id", getConversationById);
router.delete("/history/:id", deleteConversation);
router.delete("/history", clearHistory);

export default router;
