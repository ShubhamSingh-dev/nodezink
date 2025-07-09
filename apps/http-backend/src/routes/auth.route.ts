import express, { Router } from "express";
import { userSignin, userSignup } from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/signup", userSignup);
router.post("/signin", userSignin);

export default router;
