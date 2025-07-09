import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";

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

export const getChats = async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    console.log(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.log(e);
    res.json({
      messages: [],
    });
  }
};

export const getChatsSlug = async (req: Request, res: Response) => {
   const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
}
