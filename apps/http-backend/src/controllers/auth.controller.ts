import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";

export const userSignup = (req: Request, res: Response) => {
  const user = CreateUserSchema.safeParse(req.body);
  if (!user.success) {
    res.status(400).json({ message: user.error.message });
    return;
  }
  res.json({
    message: "User created successfully",
  });
};
export const userSignin = (req: Request, res: Response) => {
  const user = SigninSchema.safeParse(req.body);
  if (!user.success) {
    res.status(400).json({ message: user.error.message });
    return;
  }
  const userId = req.body.userId;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({ token });
};
export const createRoom = (req: Request, res: Response) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ message: data.error.message });
    return;
  }
  res.json({
    message: "Room created successfully",
  });
};
