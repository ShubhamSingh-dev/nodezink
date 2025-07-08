import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

export const userSignup = async (req: Request, res: Response) => {
  const user = CreateUserSchema.safeParse(req.body);
  if (!user.success) {
    res
      .status(400)
      .json({ message: "Invalid user data", errors: user.error.errors });
    return;
  }

  try {
    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email: user.data.email },
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.data.password, salt);

    // Create new user with hashed password
    const newUser = await prismaClient.user.create({
      data: {
        email: user.data.email,
        password: hashedPassword,
        name: user.data.name,
        photo: user.data.photo,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        photo: newUser.photo,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userSignin = async (req: Request, res: Response) => {
  const user = SigninSchema.safeParse(req.body);
  if (!user.success) {
    res
      .status(400)
      .json({ message: "Invalid signin data", errors: user.error.errors });
    return;
  }

  try {
    // Find user by email
    const existingUser = await prismaClient.user.findUnique({
      where: { email: user.data.email },
    });

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(
      user.data.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET);
    res.json({
      token,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        photo: existingUser.photo,
      },
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res
      .status(400)
      .json({ message: "Invalid room data", errors: data.error.errors });
    return;
  }

  try {
    // Verify the admin user exists
    const adminUser = await prismaClient.user.findUnique({
      where: { id: data.data.adminId },
    });

    if (!adminUser) {
      res.status(404).json({ message: "Admin user not found" });
      return;
    }

    // Create new room
    const newRoom = await prismaClient.room.create({
      data: {
        slug: data.data.slug,
        adminId: data.data.adminId,
      },
    });

    res.status(201).json({
      message: "Room created successfully",
      room: {
        id: newRoom.id,
        slug: newRoom.slug,
        createdAt: newRoom.createdAt,
        adminId: newRoom.adminId,
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
