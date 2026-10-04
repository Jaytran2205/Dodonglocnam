import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

// SuperAdmin Security & Token Session Cache - Managed by jaydev

import {
  parsePermissions,
  ROLE_DEFAULT_PERMISSIONS,
  RoleType,
} from "@/lib/permissions";

const JWT_SECRET =
  process.env.JWT_SECRET || "locnam_luxury_bronze_secret_key_2026";

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

const sessionCache = new Map<
  string,
  { session: AdminTokenPayload; expires: number }
>();
const pendingSessions = new Map<string, Promise<AdminTokenPayload | null>>();
const versions = new Map<string, number>();
export class AdminSessionUnavailableError extends Error {
  constructor() {
    super("Kết nối database tạm thời gián đoạn. Vui lòng thử lại.");
  }
}

export function invalidateAdminSession(userId: string) {
  sessionCache.delete(userId);
  pendingSessions.delete(userId);
  versions.set(userId, (versions.get(userId) || 0) + 1);
}

async function freshSession(userId: string, shareRead = true): Promise<AdminTokenPayload | null> {
  const pending = shareRead ? pendingSessions.get(userId) : undefined;
  if (pending) return pending;
  // A write must not borrow a read that began before a permission change.
  if (!shareRead) versions.set(userId, (versions.get(userId) || 0) + 1);
  const version = versions.get(userId) || 0;
  const request = (async () => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          permissions: true,
          isActive: true,
        },
      });
      if (!user || !user.isActive) {
        sessionCache.delete(userId);
        return null;
      }
      const role = (user.role || "STAFF").toUpperCase();
      const permissions =
        user.permissions == null
          ? ROLE_DEFAULT_PERMISSIONS[role as RoleType] || []
          : parsePermissions(user.permissions);
      const session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role,
        permissions,
      };
      if ((versions.get(userId) || 0) === version) {
        if (sessionCache.size > 1000) sessionCache.clear();
        sessionCache.set(userId, { session, expires: Date.now() + 15000 });
      }
      return session;
    } catch {
      sessionCache.delete(userId);
      throw new AdminSessionUnavailableError();
    }
  })().finally(() => {
    if (pendingSessions.get(userId) === request) pendingSessions.delete(userId);
  });
  if (shareRead) pendingSessions.set(userId, request);
  return request;
}

export async function getAdminSession(
  req: NextRequest
): Promise<AdminTokenPayload | null> {
  const token = req.cookies.get("admin_token")?.value;
  const decoded = token ? verifyAdminToken(token) : null;
  if (!decoded) return null;
  const cached = sessionCache.get(decoded.userId);
  // Short read cache, but every write checks current account/permissions in DB.
  // No stale-session fallback when the database is unavailable.
  if (req.method === "GET" && cached && cached.expires > Date.now())
    return cached.session;
  return freshSession(decoded.userId, req.method === "GET");
}
