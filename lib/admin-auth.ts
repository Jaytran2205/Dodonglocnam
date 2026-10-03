import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

import { parsePermissions, ROLE_DEFAULT_PERMISSIONS, RoleType } from "@/lib/permissions";

const JWT_SECRET = process.env.JWT_SECRET || "locnam_luxury_bronze_secret_key_2026";

export interface AdminTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
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
  const decoded = verifyAdminToken(token);
  if (!decoded) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, permissions: true, isActive: true }
    });
    if (!user || !user.isActive) {
      return null;
    }
    const roleUpper = (user.role || "STAFF").toUpperCase();
    let permissions: string[];
    if (user.permissions === null || user.permissions === undefined) {
      permissions = ROLE_DEFAULT_PERMISSIONS[roleUpper as RoleType] || [];
    } else {
      permissions = parsePermissions(user.permissions);
    }
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: roleUpper,
      permissions,
    };
  } catch (error) {
    // Fail-closed on error for security
    return null;
  }
}
