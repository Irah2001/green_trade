import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createOrFindConversation,
  getConversations,
  getMessages,
  markAsRead,
  editMessage,
  deleteMessage,
  deleteConversation,
} from "../controllers/conversationController.js";

const router: Router = Router();

router.use(authenticate);

router.post("/", createOrFindConversation);
router.get("/", getConversations);
router.get("/:id/messages", getMessages);
router.post("/:id/read", markAsRead);
router.patch("/messages/:messageId", editMessage);
router.delete("/messages/:messageId", deleteMessage);
router.delete("/:id", deleteConversation);

export default router;
