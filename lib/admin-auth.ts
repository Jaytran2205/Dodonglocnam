import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "locnam_luxury_bronze_secret_key_2026";

export interface AdminTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(req: NextRequest): Promise<AdminTokenPayload | null> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
