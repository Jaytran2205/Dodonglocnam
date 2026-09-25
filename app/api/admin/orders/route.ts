import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-logger";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: any = {};
  if (status && status !== "ALL") where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ success: true, orders });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: "Thiếu ID hoặc trạng thái đơn hàng." }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    logActivity({
      req,
      session,
      action: "STATUS_CHANGE",
      entity: "ORDER",
      entityId: order.id,
      entityName: order.customerName,
      summary: `Đổi trạng thái đơn hàng #${order.id.slice(-6).toUpperCase()} (${order.customerName}) sang "${status}"`,
      details: { orderId: order.id, customer: order.customerName, phone: order.phone, total: order.totalPrice, newStatus: status },
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Cập nhật trạng thái đơn hàng thành công!", order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi cập nhật đơn hàng." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID đơn hàng." }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    await prisma.order.delete({ where: { id } });

    if (existing) {
      logActivity({
        req,
        session,
        action: "DELETE",
        entity: "ORDER",
        entityId: id,
        entityName: existing.customerName,
        summary: `Xóa đơn hàng #${id.slice(-6).toUpperCase()} của khách "${existing.customerName}" (${existing.phone})`,
        details: { customer: existing.customerName, total: existing.totalPrice },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, message: "Đã xóa đơn hàng." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi xóa đơn hàng." }, { status: 500 });
  }
}
