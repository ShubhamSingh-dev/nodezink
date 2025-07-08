import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";

export const userSignup = async (req: Request, res: Response) => {
  const user = CreateUserSchema.safeParse(req.body);
  if (!user.success) {
    res
      .status(400)
      .json({ message: "Invalid user data", errors: user.error.errors });
    return;
  }
  res.status(201).json({
    message: "User created successfully",
  });
  return;
};

export const userSignin = async (req: Request, res: Response) => {
  const user = SigninSchema.safeParse(req.body);
  if (!user.success) {
    res
      .status(400)
      .json({ message: "Invalid signin data", errors: user.error.errors });
    return;
  }

  const userId = req.body.userId;
  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({ token });
  return;
};

export const createRoom = async (req: Request, res: Response) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res
      .status(400)
      .json({ message: "Invalid room data", errors: data.error.errors });
    return;
  }
  res.status(201).json({
    message: "Room created successfully",
  });
  return;
};
