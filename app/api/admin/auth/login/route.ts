import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signAdminToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập đầy đủ email và mật khẩu." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: "Email hoặc mật khẩu không chính xác." }, { status: 401 });
    }

    const token = signAdminToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập thành công!",
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    });

    return response;
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi hệ thống khi đăng nhập." }, { status: 500 });
  }
}
