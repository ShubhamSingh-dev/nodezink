import express from "express";
import {
  createRoom,
  userSignin,
  userSignup,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: express.Router = express.Router();

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.post("/create-room",authMiddleware,createRoom);

export default router;
