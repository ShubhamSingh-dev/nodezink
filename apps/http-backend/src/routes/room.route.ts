import express, { Router } from "express";
import {
  createRoom,
  getChats,
  getChatsSlug,
} from "../controllers/room.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.post("/create-room", authMiddleware, createRoom);
router.get("/chats/:roomId", getChats);
router.get("/room/:slug", getChatsSlug);

export default router;
