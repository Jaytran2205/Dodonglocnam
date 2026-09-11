import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { customerName, phone, email, address, note, productName, productPrice, productId } = data;

    if (!customerName || !phone) {
      return NextResponse.json({ success: false, message: "Họ tên và số điện thoại là bắt buộc." }, { status: 400 });
    }

    const price = productPrice ? parseFloat(productPrice) : 0;
    const orderCode = `LN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderCode,
        customerName,
        phone,
        email: email || null,
        address: address || "Liên hệ xác nhận",
        note: note || null,
        totalPrice: price,
        status: "PENDING",
        items: {
          create: [
            {
              name: productName || "Sản phẩm tư vấn",
              price: price,
              quantity: 1,
              productId: productId || null
            }
          ]
        }
      },
      include: { items: true }
    });

    // Update or create Customer record
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone: phone.trim() }
    });

    if (existingCustomer) {
      await prisma.customer.update({
        where: { phone: phone.trim() },
        data: {
          name: customerName,
          email: email || existingCustomer.email,
          address: address || existingCustomer.address,
          orderCount: existingCustomer.orderCount + 1,
          totalSpent: existingCustomer.totalSpent + price
        }
      });
    } else {
      await prisma.customer.create({
        data: {
          name: customerName,
          phone: phone.trim(),
          email: email || null,
          address: address || null,
          orderCount: 1,
          totalSpent: price
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Đặt hàng thành công! Nhân viên Lộc Nam sẽ liên hệ quý khách trong ít phút.",
      orderCode
    });
  } catch (error: any) {
    console.error("Order Submit Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi ghi nhận đơn hàng." }, { status: 500 });
  }
}
