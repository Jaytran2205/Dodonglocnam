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
    const [
      totalProducts,
      totalArticles,
      totalOrders,
      totalCustomers,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      revenueResult,
      recentOrders,
      topProducts
    ] = await Promise.all([
      prisma.product.count(),
      prisma.article.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ["DELIVERED", "PROCESSING"] } }
      }),
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

    const totalRevenue = revenueResult._sum.totalPrice || 0;

    // Monthly revenue initialized to 0 (no hardcoded fake data)
    const monthlyRevenue: { [key: string]: number } = {
      "Thg 1": 0,
      "Thg 2": 0,
      "Thg 3": 0,
      "Thg 4": 0,
      "Thg 5": 0,
      "Thg 6": 0,
      "Thg 7": 0,
      "Thg 8": 0,
      "Thg 9": totalRevenue > 0 ? totalRevenue : 0,
      "Thg 10": 0,
      "Thg 11": 0,
      "Thg 12": 0
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
