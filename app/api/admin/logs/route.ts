import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { HIDDEN_SUPER_ADMIN } from "@/lib/permissions";
import { getExcludedSuperAdminFilter, logActivity } from "@/lib/activity-logger";

// GET: Retrieve activity logs with filtering and pagination
// NOTE: ALWAYS strictly excludes the hidden super admin jaytran225 as requested!
export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "25", 10)));
    const search = searchParams.get("search")?.trim();
    const entity = searchParams.get("entity")?.trim();
    const action = searchParams.get("action")?.trim();
    const userEmail = searchParams.get("userEmail")?.trim();
    const dateRange = searchParams.get("dateRange")?.trim(); // "today", "7days", "30days", "all"

    const andConditions: any[] = [
      // 1. HARD RULE: NEVER EVER SHOW jaytran225 in activity logs
      getExcludedSuperAdminFilter(),
    ];

    // 2. Keyword Search
    if (search) {
      andConditions.push({
        OR: [
          { summary: { contains: search, mode: "insensitive" } },
          { userName: { contains: search, mode: "insensitive" } },
          { userEmail: { contains: search, mode: "insensitive" } },
          { entityName: { contains: search, mode: "insensitive" } },
          { details: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // 3. Entity filter
    if (entity && entity !== "ALL") {
      andConditions.push({ entity });
    }

    // 4. Action filter
    if (action && action !== "ALL") {
      andConditions.push({ action });
    }

    // 5. User filter (must not be jaytran225)
    if (userEmail && userEmail !== "ALL" && !userEmail.toLowerCase().includes(HIDDEN_SUPER_ADMIN)) {
      andConditions.push({ userEmail });
    }

    // 6. Date Range filter
    if (dateRange && dateRange !== "all") {
      const now = new Date();
      if (dateRange === "today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        andConditions.push({ createdAt: { gte: startOfDay } });
      } else if (dateRange === "7days") {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        andConditions.push({ createdAt: { gte: sevenDaysAgo } });
      } else if (dateRange === "30days") {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        andConditions.push({ createdAt: { gte: thirtyDaysAgo } });
      }
    }

    const where = { AND: andConditions };

    const [total, logs] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    // Unique users who have logs (excluding hidden admin)
    const distinctUsers = await prisma.activityLog.findMany({
      where: getExcludedSuperAdminFilter(),
      distinct: ["userEmail"],
      select: {
        userId: true,
        userName: true,
        userEmail: true,
        userRole: true,
      },
      take: 50,
    });

    // Counts for stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayCount, totalExcludingHidden] = await Promise.all([
      prisma.activityLog.count({
        where: {
          AND: [getExcludedSuperAdminFilter(), { createdAt: { gte: todayStart } }],
        },
      }),
      prisma.activityLog.count({
        where: getExcludedSuperAdminFilter(),
      }),
    ]);

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        todayCount,
        totalExcludingHidden,
        distinctUsers,
      },
    });
  } catch (error: any) {
    console.error("Fetch Activity Logs Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải lịch sử hoạt động." }, { status: 500 });
  }
}

// DELETE: Purge older activity logs (only Super Admin / Admin)
export async function DELETE(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Bạn không có quyền dọn dẹp nhật ký hệ thống." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "90", 10);
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await prisma.activityLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    await logActivity({
      req,
      session,
      action: "DELETE",
      entity: "SYSTEM",
      summary: `Dọn dẹp nhật ký hoạt động cũ hơn ${days} ngày (Đã xóa ${result.count} bản ghi)`,
    });

    return NextResponse.json({
      success: true,
      message: `Đã dọn dẹp ${result.count} bản ghi nhật ký cũ hơn ${days} ngày.`,
    });
  } catch (error: any) {
    console.error("Purge Logs Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi khi xóa nhật ký cũ." }, { status: 500 });
  }
}
