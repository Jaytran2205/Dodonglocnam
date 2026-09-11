import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, content, productInterest } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp họ tên và số điện thoại." },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        content: content ? content.trim() : "Yêu cầu tư vấn",
        productInterest: productInterest ? productInterest.trim() : null,
        status: "PENDING",
      },
    });

    // Also record into Order and Customer for Admin dashboard management
    const orderCode = `LN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await prisma.order.create({
      data: {
        orderCode,
        customerName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        address: "Liên hệ tư vấn",
        note: content || "Đặt hàng từ website",
        totalPrice: 0,
        status: "PENDING",
        items: {
          create: [
            {
              name: productInterest || "Yêu cầu tư vấn từ Landing Page",
              price: 0,
              quantity: 1,
            }
          ]
        }
      }
    });

    const existingCustomer = await prisma.customer.findUnique({
      where: { phone: phone.trim() }
    });

    if (existingCustomer) {
      await prisma.customer.update({
        where: { phone: phone.trim() },
        data: {
          name: fullName.trim(),
          orderCount: existingCustomer.orderCount + 1,
        }
      });
    } else {
      await prisma.customer.create({
        data: {
          name: fullName.trim(),
          phone: phone.trim(),
          email: email ? email.trim() : null,
          orderCount: 1,
          totalSpent: 0
        }
      });
    }

    return NextResponse.json({ success: true, messageId: message.id, orderCode });
  } catch (error) {
    console.error("Lỗi khi lưu tin nhắn liên hệ:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra trong quá trình xử lý yêu cầu." },
      { status: 500 }
    );
  }
}