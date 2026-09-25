"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  History,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Shield,
  Tag,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Info,
  Sliders,
  LogIn,
  Package,
  Layers,
  ShoppingCart,
  FileText,
  UserCheck,
  Sparkles,
  Laptop
} from "lucide-react";
import { useToast } from "@/components/admin/AdminToast";

interface ActivityLogItem {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  entityName?: string | null;
  summary: string;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

interface DistinctUser {
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
}

export default function AdminActivityLogsPage() {
  const { toastSuccess, toastError, confirm } = useToast();

  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [distinctUsers, setDistinctUsers] = useState<DistinctUser[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [userEmailFilter, setUserEmailFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState("all");

  // Selected Log for details modal
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  // Fetch logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search.trim()) params.set("search", search.trim());
      if (entityFilter !== "ALL") params.set("entity", entityFilter);
      if (actionFilter !== "ALL") params.set("action", actionFilter);
      if (userEmailFilter !== "ALL") params.set("userEmail", userEmailFilter);
      if (dateRange !== "all") params.set("dateRange", dateRange);

      const res = await fetch(`/api/admin/logs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        if (data.distinctUsers) {
          setDistinctUsers(data.distinctUsers);
        }
      } else {
        toastError(data.message || "Không thể tải nhật ký hoạt động");
      }
    } catch {
      toastError("Lỗi kết nối khi tải nhật ký");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, limit, entityFilter, actionFilter, userEmailFilter, dateRange]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setEntityFilter("ALL");
    setActionFilter("ALL");
    setUserEmailFilter("ALL");
    setDateRange("all");
    setPage(1);
  };

  // Clear old logs
  const handleClearOldLogs = () => {
    confirm({
      title: "Dọn Dẹp Nhật Ký Hoạt Động Cũ",
      message: "Bạn có chắc muốn xóa các bản ghi nhật ký hoạt động cũ hơn 30 ngày? Nhật ký mới sẽ vẫn được giữ nguyên.",
      type: "warning",
      confirmText: "Dọn Dẹp Ngay",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/logs?days=30", { method: "DELETE" });
          const data = await res.json();
          if (data.success) {
            toastSuccess(data.message || "Đã dọn dẹp nhật ký thành công!");
            fetchLogs();
          } else {
            toastError(data.message || "Lỗi dọn dẹp nhật ký");
          }
        } catch {
          toastError("Lỗi kết nối");
        }
      },
    });
  };

  // Helper for action badges
  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return {
          label: "Thêm Mới",
          color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          icon: Sparkles,
        };
      case "UPDATE":
        return {
          label: "Cập Nhật",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/40",
          icon: RefreshCw,
        };
      case "DELETE":
        return {
          label: "Xóa Dữ Liệu",
          color: "bg-rose-500/20 text-rose-400 border-rose-500/40",
          icon: Trash2,
        };
      case "STATUS_CHANGE":
        return {
          label: "Đổi Trạng Thái",
          color: "bg-amber-500/20 text-amber-400 border-amber-500/40",
          icon: Sliders,
        };
      case "LOGIN":
        return {
          label: "Đăng Nhập",
          color: "bg-purple-500/20 text-purple-400 border-purple-500/40",
          icon: LogIn,
        };
      case "SETTINGS_CHANGE":
        return {
          label: "Cấu Hình",
          color: "bg-teal-500/20 text-teal-400 border-teal-500/40",
          icon: Sliders,
        };
      case "SECURITY":
        return {
          label: "Bảo Mật",
          color: "bg-orange-500/20 text-orange-400 border-orange-500/40",
          icon: Shield,
        };
      default:
        return {
          label: action,
          color: "bg-gray-500/20 text-gray-300 border-gray-500/40",
          icon: History,
        };
    }
  };

  // Helper for entity badges
  const getEntityBadge = (entity: string) => {
    switch (entity) {
      case "PRODUCT":
        return { label: "Sản Phẩm", icon: Package, color: "text-[#d4af37]" };
      case "ORDER":
        return { label: "Đơn Hàng", icon: ShoppingCart, color: "text-amber-400" };
      case "CATEGORY":
        return { label: "Danh Mục", icon: Layers, color: "text-cyan-400" };
      case "ARTICLE":
        return { label: "Bài Viết", icon: FileText, color: "text-emerald-400" };
      case "SETTING":
        return { label: "Giao Diện", icon: Sliders, color: "text-pink-400" };
      case "USER":
        return { label: "Tài Khoản", icon: UserCheck, color: "text-indigo-400" };
      case "AUTH":
        return { label: "Hệ Thống", icon: Shield, color: "text-purple-400" };
      default:
        return { label: entity, icon: Tag, color: "text-gray-400" };
    }
  };

  // Helper format relative time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Vừa xong";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#d4af37]/20">
        <div>
          <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Nhật Ký Kiểm Toán & Giám Sát</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-wide">
            Lịch Sử Hoạt Động Hệ Thống
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 max-w-2xl">
            Theo dõi chi tiết các thao tác thêm, sửa, xóa, đăng nhập và thời gian thực hiện của từng tài khoản nhân viên
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-[#111c2e] hover:bg-[#152236] text-[#94a3b8] hover:text-[#d4af37] rounded-xl border border-[#d4af37]/20 transition-all text-xs font-semibold"
            title="Tải lại nhật ký"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#d4af37]" : ""}`} />
            <span className="hidden sm:inline">Làm Mới</span>
          </button>

          <button
            onClick={handleClearOldLogs}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white rounded-xl border border-rose-800/40 transition-all text-xs font-semibold"
            title="Dọn dẹp nhật ký cũ hơn 30 ngày"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Dọn Dẹp Cũ</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-lg space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung thao tác, tên nhân viên, tên sản phẩm, đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs sm:text-sm text-white placeholder-[#94a3b8]/60 focus:outline-none focus:border-[#d4af37] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#b89628] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow shrink-0"
          >
            Tìm Kiếm
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#d4af37]/10">
          {/* Entity Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#94a3b8] mb-1">
              Đối Tượng Thao Tác
            </label>
            <select
              value={entityFilter}
              onChange={(e) => {
                setEntityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs text-[#d4af37] font-semibold focus:outline-none focus:border-[#d4af37]"
            >
              <option value="ALL">Tất Cả Đối Tượng</option>
              <option value="PRODUCT">Sản Phẩm</option>
              <option value="ORDER">Đơn Hàng</option>
              <option value="CATEGORY">Danh Mục</option>
              <option value="ARTICLE">Bài Viết</option>
              <option value="SETTING">Giao Diện & Cài Đặt</option>
              <option value="USER">Tài Khoản Phân Quyền</option>
              <option value="AUTH">Đăng Nhập / Đăng Xuất</option>
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#94a3b8] mb-1">
              Loại Hành Động
            </label>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs text-[#94a3b8] font-semibold focus:outline-none focus:border-[#d4af37]"
            >
              <option value="ALL">Tất Cả Hành Động</option>
              <option value="CREATE">Thêm Mới (CREATE)</option>
              <option value="UPDATE">Cập Nhật (UPDATE)</option>
              <option value="DELETE">Xóa (DELETE)</option>
              <option value="STATUS_CHANGE">Đổi Trạng Thái</option>
              <option value="SETTINGS_CHANGE">Đổi Thiết Lập</option>
              <option value="LOGIN">Đăng Nhập (LOGIN)</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#94a3b8] mb-1">
              Tài Khoản Thực Hiện
            </label>
            <select
              value={userEmailFilter}
              onChange={(e) => {
                setUserEmailFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs text-[#94a3b8] font-semibold focus:outline-none focus:border-[#d4af37]"
            >
              <option value="ALL">Mọi Tài Khoản</option>
              {distinctUsers.map((du) => (
                <option key={du.userEmail || du.userId} value={du.userEmail || ""}>
                  {du.userName} ({du.userEmail})
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#94a3b8] mb-1">
              Khoảng Thời Gian
            </label>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs text-[#94a3b8] font-semibold focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">Toàn Bộ Thời Gian</option>
              <option value="today">Hôm Nay</option>
              <option value="7days">7 Ngày Vừa Qua</option>
              <option value="30days">30 Ngày Vừa Qua</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Quick Button */}
        {(search || entityFilter !== "ALL" || actionFilter !== "ALL" || userEmailFilter !== "ALL" || dateRange !== "all") && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#94a3b8]">
              Tìm thấy <strong className="text-[#d4af37]">{total}</strong> hoạt động phù hợp
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>
        )}
      </div>

      {/* ACTIVITY TIMELINE / TABLE */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#94a3b8]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-3" />
            <p className="text-sm">Đang tải nhật ký hệ thống...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-[#94a3b8]">
            <History className="w-10 h-10 text-amber-500/50 mx-auto mb-3" />
            <p className="text-base font-semibold text-white">Chưa có hoạt động nào được ghi lại</p>
            <p className="text-xs text-[#94a3b8] mt-1">
              Các thao tác của nhân viên trên hệ thống sẽ xuất hiện tự động tại đây
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#d4af37]/10">
            {logs.map((log) => {
              const actionBadge = getActionBadge(log.action);
              const ActionIcon = actionBadge.icon;
              const entityBadge = getEntityBadge(log.entity);
              const EntityIcon = entityBadge.icon;

              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-[#111c2e]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Action Icon Pill */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 shadow-sm ${actionBadge.color}`}
                    >
                      <ActionIcon className="w-4 h-4" />
                    </div>

                    {/* Content Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {/* Action Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${actionBadge.color}`}
                        >
                          {actionBadge.label}
                        </span>

                        {/* Entity Badge */}
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#94a3b8]">
                          <EntityIcon className={`w-3.5 h-3.5 ${entityBadge.color}`} />
                          <span className="text-white">{entityBadge.label}</span>
                        </span>

                        {/* Actor Info */}
                        <span className="text-[11px] text-[#94a3b8] flex items-center gap-1">
                          bởi <strong className="text-[#d4af37] font-semibold">{log.userName}</strong>
                          <span className="text-[#94a3b8]/60">({log.userEmail})</span>
                        </span>
                      </div>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-white font-medium break-words leading-snug">
                        {log.summary}
                      </p>

                      {/* Meta Footer */}
                      <div className="flex items-center gap-3 text-[11px] text-[#94a3b8] mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#d4af37]/70" />
                          <span>
                            {new Date(log.createdAt).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[#94a3b8]/60 font-normal">
                            ({formatTime(log.createdAt)})
                          </span>
                        </span>

                        {log.ipAddress && (
                          <span className="hidden md:flex items-center gap-1 text-[10px] text-[#94a3b8]/80">
                            <Laptop className="w-3 h-3" /> IP: {log.ipAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex items-center justify-end gap-2 shrink-0 sm:pl-4">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#152236] hover:bg-[#1d2f4a] text-[#d4af37] hover:text-white rounded-lg text-xs font-semibold border border-[#d4af37]/20 transition-all shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi Tiết</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && total > 0 && (
          <div className="p-4 border-t border-[#d4af37]/15 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0a111c]">
            <div className="text-xs text-[#94a3b8]">
              Hiển thị <strong className="text-white">{(page - 1) * limit + 1}</strong> -{" "}
              <strong className="text-white">{Math.min(page * limit, total)}</strong> trên tổng số{" "}
              <strong className="text-[#d4af37]">{total}</strong> hoạt động
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-[#111c2e] text-[#94a3b8] hover:text-white border border-[#d4af37]/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 bg-[#111c2e] text-[#d4af37] font-bold text-xs rounded-lg border border-[#d4af37]/20">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-[#111c2e] text-[#94a3b8] hover:text-white border border-[#d4af37]/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0c1420] border border-[#d4af37]/40 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#d4af37]/20 flex items-center justify-between bg-gradient-to-r from-[#111c2e] to-[#0c1420] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Chi Tiết Bản Ghi Hoạt Động
                  </h3>
                  <p className="text-[11px] text-[#94a3b8]">Mã bản ghi: #{selectedLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#152236]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Summary */}
              <div className="p-3.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-[#d4af37] mb-1">
                  Nội Dung Thao Tác
                </div>
                <div className="text-sm font-semibold text-white leading-relaxed">
                  {selectedLog.summary}
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#111c2e]/60 rounded-xl border border-[#d4af37]/10">
                  <div className="text-[10px] uppercase text-[#94a3b8] font-bold">Người Thực Hiện</div>
                  <div className="text-white font-semibold mt-1">{selectedLog.userName}</div>
                  <div className="text-[11px] text-[#94a3b8]">{selectedLog.userEmail}</div>
                  <div className="text-[10px] text-[#d4af37] font-semibold mt-0.5">
                    Vai trò: {selectedLog.userRole}
                  </div>
                </div>

                <div className="p-3 bg-[#111c2e]/60 rounded-xl border border-[#d4af37]/10">
                  <div className="text-[10px] uppercase text-[#94a3b8] font-bold">Thời Gian Ghi Nhận</div>
                  <div className="text-white font-semibold mt-1">
                    {new Date(selectedLog.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-[10px] text-[#94a3b8] mt-0.5">
                    ({formatTime(selectedLog.createdAt)})
                  </div>
                </div>

                <div className="p-3 bg-[#111c2e]/60 rounded-xl border border-[#d4af37]/10">
                  <div className="text-[10px] uppercase text-[#94a3b8] font-bold">Loại Hành Động</div>
                  <div className="text-white font-semibold mt-1">{selectedLog.action}</div>
                  <div className="text-[10px] text-[#94a3b8]">Đối tượng: {selectedLog.entity}</div>
                </div>

                <div className="p-3 bg-[#111c2e]/60 rounded-xl border border-[#d4af37]/10">
                  <div className="text-[10px] uppercase text-[#94a3b8] font-bold">Địa Chỉ IP</div>
                  <div className="text-white font-semibold mt-1">
                    {selectedLog.ipAddress || "Không xác định"}
                  </div>
                </div>
              </div>

              {/* User Agent */}
              {selectedLog.userAgent && (
                <div className="p-3 bg-[#111c2e]/40 rounded-xl border border-[#d4af37]/10">
                  <div className="text-[10px] uppercase text-[#94a3b8] font-bold mb-1">
                    Trình Duyệt & Thiết Bị (User Agent)
                  </div>
                  <div className="text-[11px] text-[#94a3b8] font-mono break-all leading-snug">
                    {selectedLog.userAgent}
                  </div>
                </div>
              )}

              {/* Details JSON */}
              {selectedLog.details && (
                <div className="p-3.5 bg-[#0a111c] rounded-xl border border-[#d4af37]/20">
                  <div className="text-[10px] uppercase text-[#d4af37] font-bold mb-1.5 flex items-center justify-between">
                    <span>Thông Số Dữ Liệu Thay Đổi (Details)</span>
                  </div>
                  <pre className="text-[11px] font-mono text-emerald-300 bg-black/40 p-3 rounded-lg overflow-x-auto max-h-48 border border-white/5">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(selectedLog.details), null, 2);
                      } catch {
                        return selectedLog.details;
                      }
                    })()}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#d4af37]/20 flex justify-end bg-[#0c1420]">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-[#152236] hover:bg-[#1d2f4a] text-white rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
