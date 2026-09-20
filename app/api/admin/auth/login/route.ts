import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signAdminToken } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.email || body.username || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    if (!identifier || !password) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu." }, { status: 400 });
    }

    // Find user by email or username/name (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { email: `${identifier}@ducdonglocnam.com` },
          { name: { equals: identifier, mode: "insensitive" } }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "Tài khoản hoặc mật khẩu không chính xác." }, { status: 401 });
    }

    let isMatch = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (user.password === password);
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Tài khoản hoặc mật khẩu không chính xác." }, { status: 401 });
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
