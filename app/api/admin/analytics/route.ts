import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { AdminTiming } from "@/lib/admin-timing";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const getAnalytics = unstable_cache(
  async () => {
    const [rawStats, recentOrders, topProducts] = await Promise.all([
      prisma.$queryRawUnsafe<any[]>(`
        SELECT
          (SELECT COUNT(*)::int FROM "Product") AS total_products,
          (SELECT COUNT(*)::int FROM "Article") AS total_articles,
          (SELECT COUNT(*)::int FROM "Customer") AS total_customers,
          COUNT(*)::int AS total_orders,
          COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending_orders,
          COUNT(*) FILTER (WHERE status = 'PROCESSING')::int AS processing_orders,
          COUNT(*) FILTER (WHERE status = 'DELIVERED')::int AS delivered_orders,
          COUNT(*) FILTER (WHERE status = 'CANCELLED')::int AS cancelled_orders,
          COALESCE(SUM("totalPrice") FILTER (WHERE status IN ('DELIVERED', 'PROCESSING')), 0)::float AS total_revenue
        FROM "Order"
      `),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.product.findMany({
        take: 4,
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          category: { select: { name: true } },
        },
      }),
    ]);

    const statRow = rawStats[0] || {};
    const totalRevenue = Number(statRow.total_revenue) || 0;
    const totalOrders = Number(statRow.total_orders) || 0;
    const totalCustomers = Number(statRow.total_customers) || 0;
    const totalProducts = Number(statRow.total_products) || 0;
    const totalArticles = Number(statRow.total_articles) || 0;
    const pendingOrders = Number(statRow.pending_orders) || 0;
    const processingOrders = Number(statRow.processing_orders) || 0;
    const deliveredOrders = Number(statRow.delivered_orders) || 0;
    const cancelledOrders = Number(statRow.cancelled_orders) || 0;

    // Monthly revenue rolling 6-month breakdown from actual orders
    const now = new Date();
    const monthKeys: string[] = [];
    const monthlyRevenue: { [key: string]: number } = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `T${d.getMonth() + 1}`;
      monthKeys.push(key);
      monthlyRevenue[key] = 0;
    }

    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1,
      0,
      0,
      0,
      0
    );
    const revenueRows = await prisma.$queryRaw<
      { month: number; total: number }[]
    >`
      SELECT EXTRACT(MONTH FROM "createdAt")::int AS month, COALESCE(SUM("totalPrice"), 0)::float AS total
      FROM "Order" WHERE status IN ('DELIVERED', 'PROCESSING') AND "createdAt" >= ${sixMonthsAgo}
      GROUP BY EXTRACT(MONTH FROM "createdAt")
    `;
    for (const row of revenueRows) {
      const key = `T${row.month}`;
      if (monthlyRevenue[key] !== undefined)
        monthlyRevenue[key] = Number(row.total) || 0;
    }
    return {
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,
        totalProducts,
        totalArticles,
        totalCustomers,
      },
      monthlyRevenue,
      recentOrders,
      topProducts,
    };
  },
  ["admin-dashboard-v2"],
  { revalidate: 15, tags: ["products", "articles", "orders", "customers"] }
);

export async function GET(req: NextRequest) {
  const timing = new AdminTiming();
  let session;
  try {
    session = await timing.measure("auth", () => getAdminSession(req));
  } catch {
    return timing.json(
      {
        success: false,
        message: "Kết nối database đang gián đoạn. Vui lòng thử lại.",
      },
      503
    );
  }
  if (!session)
    return timing.json({ success: false, message: "Unauthorized" }, 401);
  try {
    return timing.json({
      success: true,
      data: await timing.measure("data", getAnalytics),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return timing.json(
      { success: false, message: "Không tải được báo cáo. Vui lòng thử lại." },
      503
    );
  }
}
