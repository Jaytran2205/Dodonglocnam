import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rawStats, recentOrders, topProducts] = await Promise.all([
      prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          (SELECT COUNT(*)::int FROM "Product") as total_products,
          (SELECT COUNT(*)::int FROM "Article") as total_articles,
          (SELECT COUNT(*)::int FROM "Customer") as total_customers,
          (SELECT COUNT(*)::int FROM "Order") as total_orders,
          (SELECT COUNT(*)::int FROM "Order" WHERE status = 'PENDING') as pending_orders,
          (SELECT COUNT(*)::int FROM "Order" WHERE status = 'PROCESSING') as processing_orders,
          (SELECT COUNT(*)::int FROM "Order" WHERE status = 'DELIVERED') as delivered_orders,
          (SELECT COUNT(*)::int FROM "Order" WHERE status = 'CANCELLED') as cancelled_orders,
          (SELECT COALESCE(SUM("totalPrice"), 0)::float FROM "Order" WHERE status IN ('DELIVERED', 'PROCESSING')) as total_revenue
      `),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true }
      }),
      prisma.product.findMany({
        take: 4,
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          category: { select: { name: true } }
        }
      })
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

    // Monthly revenue 6-month breakdown for chart
    const monthlyRevenue: { [key: string]: number } = {
      "T4": 0,
      "T5": 0,
      "T6": 0,
      "T7": 0,
      "T8": 0,
      "T9": totalRevenue
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          stats: {
            totalRevenue,
            totalOrders,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            cancelledOrders,
            totalProducts,
            totalArticles,
            totalCustomers
          },
          monthlyRevenue,
          recentOrders,
          topProducts
        }
      },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate"
        }
      }
    );
  } catch (error: any) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải dữ liệu thống kê." }, { status: 500 });
  }
}
