import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(), // Changed from username to email
  password: z.string().min(6),
  name: z.string().min(3),
  photo: z.string().optional(), // Added to match your User table
});

export const SigninSchema = z.object({
  email: z.string().email(), // Changed from username to email
  password: z.string().min(6),
});

export const CreateRoomSchema = z.object({
  slug: z.string().min(3).max(20), // Changed from name to slug to match your Room table
  adminId: z.string(), // Added to match your Room table
});
