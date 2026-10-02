"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  X,
  LogIn,
  LogOut,
  RefreshCw,
  Trash2,
  Sparkles,
  Sliders,
  Laptop,
  Clock,
  Shield,
  MousePointer,
  Compass,
  FileEdit,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  Package,
  ShoppingCart,
  Layers,
  FileText
} from "lucide-react";
import { isHiddenSuperAdmin } from "@/lib/permissions";

export interface UserJourneyTarget {
  email: string;
  name?: string | null;
  role?: string | null;
  phone?: string | null;
  isActive?: boolean;
}

interface LogItem {
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

interface JourneyStats {
  totalActions: number;
  totalLogins: number;
  totalModifications: number;
  totalClicks: number;
  lastActiveAt?: string | null;
  lastIp?: string | null;
  lastUserAgent?: string | null;
}

interface UserJourneyModalProps {
  user: UserJourneyTarget | null;
  onClose: () => void;
}

export default function UserJourneyModal({ user, onClose }: UserJourneyModalProps) {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [stats, setStats] = useState<JourneyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  // Filter tabs: "ALL" | "LOGIN" | "MODIFY" | "CLICK"
  const [actionGroup, setActionGroup] = useState<"ALL" | "LOGIN" | "MODIFY" | "CLICK">("ALL");
  const [dateRange, setDateRange] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    // Safety guard
    if (isHiddenSuperAdmin(user.email)) {
      onClose();
      return;
    }

    const fetchJourney = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("userEmail", user.email);
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (actionGroup !== "ALL") params.set("actionGroup", actionGroup);
        if (dateRange !== "all") params.set("dateRange", dateRange);
        if (search.trim()) params.set("search", search.trim());

        const res = await fetch(`/api/admin/logs?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setLogs(data.logs || []);
          setTotal(data.total || 0);
          if (data.userJourneyStats) {
            setStats(data.userJourneyStats);
          }
        }
      } catch (err) {
        console.error("Error fetching user journey:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [user?.email, page, actionGroup, dateRange]);

  if (!user) return null;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Helper format relative time
  const formatRelativeTime = (isoString: string) => {
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

  const getActionConfig = (action: string) => {
    switch (action) {
      case "LOGIN":
        return {
          label: "Đăng Nhập",
          icon: LogIn,
          color: "text-purple-400 bg-purple-500/15 border-purple-500/40",
          tagBg: "bg-purple-500/20 text-purple-300",
        };
      case "LOGOUT":
        return {
          label: "Đăng Xuất",
          icon: LogOut,
          color: "text-indigo-400 bg-indigo-500/15 border-indigo-500/40",
          tagBg: "bg-indigo-500/20 text-indigo-300",
        };
      case "CREATE":
        return {
          label: "Thêm Mới",
          icon: Sparkles,
          color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40",
          tagBg: "bg-emerald-500/20 text-emerald-300",
        };
      case "UPDATE":
        return {
          label: "Chỉnh Sửa",
          icon: FileEdit,
          color: "text-blue-400 bg-blue-500/15 border-blue-500/40",
          tagBg: "bg-blue-500/20 text-blue-300",
        };
      case "DELETE":
        return {
          label: "Xóa Dữ Liệu",
          icon: Trash2,
          color: "text-rose-400 bg-rose-500/15 border-rose-500/40",
          tagBg: "bg-rose-500/20 text-rose-300",
        };
      case "STATUS_CHANGE":
        return {
          label: "Đổi Trạng Thái",
          icon: Sliders,
          color: "text-amber-400 bg-amber-500/15 border-amber-500/40",
          tagBg: "bg-amber-500/20 text-amber-300",
        };
      case "NAVIGATE":
      case "PAGE_VIEW":
        return {
          label: "Truy Cập Trang",
          icon: Compass,
          color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/40",
          tagBg: "bg-cyan-500/20 text-cyan-300",
        };
      case "CLICK":
      case "VIEW":
        return {
          label: "Click Thao Tác",
          icon: MousePointer,
          color: "text-teal-400 bg-teal-500/15 border-teal-500/40",
          tagBg: "bg-teal-500/20 text-teal-300",
        };
      default:
        return {
          label: action,
          icon: History,
          color: "text-gray-400 bg-gray-500/15 border-gray-500/40",
          tagBg: "bg-gray-500/20 text-gray-300",
        };
    }
  };

  const parseBrowser = (ua?: string | null) => {
    if (!ua) return "Trình duyệt ẩn";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Trình duyệt Web";
  };

  const parseOS = (ua?: string | null) => {
    if (!ua) return "HĐH không rõ";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Macintosh") || ua.includes("Mac OS")) return "macOS";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    if (ua.includes("Linux")) return "Linux";
    return "Thiết bị khác";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a111c] border border-[#d4af37]/40 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-[#d4af37]/20 flex items-center justify-between bg-gradient-to-r from-[#111c2e] via-[#0d1624] to-[#0a111c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/10 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] font-bold text-lg shadow-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                  Nhật Ký Hành Trình: {user.name || user.email}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#152236] border border-[#d4af37]/30 text-[#d4af37] uppercase">
                  {user.role || "Nhân viên"}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] flex items-center gap-2 mt-0.5">
                <span>{user.email}</span>
                {user.phone && <span>• SĐT: {user.phone}</span>}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-[#152236] transition-colors"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STATS OVERVIEW CARDS (4 TILES) */}
        <div className="p-4 sm:p-5 bg-[#070c14] border-b border-[#d4af37]/15 shrink-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Tile 1: Logins */}
            <div
              onClick={() => {
                setActionGroup("LOGIN");
                setPage(1);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                actionGroup === "LOGIN"
                  ? "bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10"
                  : "bg-[#0d1624] border-purple-500/20 hover:border-purple-500/50"
              }`}
            >
              <div className="flex items-center justify-between text-purple-300 text-[11px] font-semibold">
                <span>Đăng Nhập</span>
                <LogIn className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                {stats?.totalLogins ?? 0}
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate">
                {stats?.lastIp ? `IP: ${stats.lastIp}` : "Ghi nhận từ hệ thống"}
              </div>
            </div>

            {/* Tile 2: Modifications (Sửa, Xóa, Tạo) */}
            <div
              onClick={() => {
                setActionGroup("MODIFY");
                setPage(1);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                actionGroup === "MODIFY"
                  ? "bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/10"
                  : "bg-[#0d1624] border-rose-500/20 hover:border-rose-500/50"
              }`}
            >
              <div className="flex items-center justify-between text-rose-300 text-[11px] font-semibold">
                <span>Sửa & Xóa Dữ Liệu</span>
                <Trash2 className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                {stats?.totalModifications ?? 0}
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate">
                Tác động SP, danh mục, đơn...
              </div>
            </div>

            {/* Tile 3: Clicks & Navigation */}
            <div
              onClick={() => {
                setActionGroup("CLICK");
                setPage(1);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                actionGroup === "CLICK"
                  ? "bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/10"
                  : "bg-[#0d1624] border-cyan-500/20 hover:border-cyan-500/50"
              }`}
            >
              <div className="flex items-center justify-between text-cyan-300 text-[11px] font-semibold">
                <span>Click & Xem Trang</span>
                <Compass className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                {stats?.totalClicks ?? 0}
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate">
                Đường dẫn & nút đã bấm
              </div>
            </div>

            {/* Tile 4: Total Actions */}
            <div
              onClick={() => {
                setActionGroup("ALL");
                setPage(1);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                actionGroup === "ALL"
                  ? "bg-amber-950/40 border-[#d4af37] shadow-lg shadow-[#d4af37]/10"
                  : "bg-[#0d1624] border-[#d4af37]/20 hover:border-[#d4af37]/50"
              }`}
            >
              <div className="flex items-center justify-between text-[#d4af37] text-[11px] font-semibold">
                <span>Tổng Hoạt Động</span>
                <History className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                {stats?.totalActions ?? 0}
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate">
                {stats?.lastActiveAt
                  ? `Gần nhất: ${formatRelativeTime(stats.lastActiveAt)}`
                  : "Toàn bộ lịch sử"}
              </div>
            </div>
          </div>
        </div>

        {/* TABS & SEARCH CONTROLS */}
        <div className="p-3 sm:p-4 bg-[#0c1420] border-b border-[#d4af37]/15 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          {/* Action Group Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-[#111c2e] p-1 rounded-xl border border-[#d4af37]/20 overflow-x-auto">
            <button
              onClick={() => {
                setActionGroup("ALL");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                actionGroup === "ALL"
                  ? "bg-[#d4af37] text-[#070c14] shadow"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Tất Cả ({stats?.totalActions ?? 0})
            </button>

            <button
              onClick={() => {
                setActionGroup("LOGIN");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                actionGroup === "LOGIN"
                  ? "bg-purple-600 text-white shadow"
                  : "text-purple-300/80 hover:text-purple-200"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng Nhập ({stats?.totalLogins ?? 0})</span>
            </button>

            <button
              onClick={() => {
                setActionGroup("MODIFY");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                actionGroup === "MODIFY"
                  ? "bg-rose-600 text-white shadow"
                  : "text-rose-300/80 hover:text-rose-200"
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Sửa & Xóa ({stats?.totalModifications ?? 0})</span>
            </button>

            <button
              onClick={() => {
                setActionGroup("CLICK");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                actionGroup === "CLICK"
                  ? "bg-cyan-600 text-white shadow"
                  : "text-cyan-300/80 hover:text-cyan-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Click & Xem ({stats?.totalClicks ?? 0})</span>
            </button>
          </div>

          {/* Date range & Search input */}
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs text-[#94a3b8] font-semibold focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">Toàn bộ thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Lọc từ khóa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setPage(1);
                }}
                className="w-36 sm:w-48 pl-8 pr-3 py-1.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl text-xs text-white placeholder-[#94a3b8]/60 focus:outline-none focus:border-[#d4af37]"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            </div>
          </div>
        </div>

        {/* TIMELINE LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {loading ? (
            <div className="py-16 text-center text-[#94a3b8]">
              <RefreshCw className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-3" />
              <p className="text-xs">Đang tải toàn bộ dữ liệu hành trình...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center text-[#94a3b8]">
              <AlertCircle className="w-10 h-10 text-amber-500/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">
                Không tìm thấy hoạt động nào phù hợp
              </p>
              <p className="text-xs text-[#94a3b8] mt-1">
                Thử chọn tab khác hoặc đổi khoảng thời gian
              </p>
            </div>
          ) : (
            <div className="relative border-l-2 border-[#d4af37]/20 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-4">
              {logs.map((log) => {
                const config = getActionConfig(log.action);
                const ActionIcon = config.icon;
                const isExpanded = expandedLogId === log.id;

                return (
                  <div key={log.id} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div
                      className={`absolute -left-[27px] sm:-left-[35px] top-1.5 w-6 h-6 rounded-full border-2 border-[#0a111c] flex items-center justify-center shadow-md ${config.color}`}
                    >
                      <ActionIcon className="w-3 h-3" />
                    </div>

                    {/* Timeline Card */}
                    <div className="p-3.5 rounded-2xl bg-[#0e1726] border border-[#d4af37]/15 hover:border-[#d4af37]/40 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${config.color}`}
                          >
                            {config.label}
                          </span>

                          <span className="text-[11px] font-semibold text-white">
                            {log.entity}
                          </span>

                          {log.entityName && (
                            <span className="text-[11px] text-[#d4af37] font-medium truncate max-w-[220px]">
                              "{log.entityName}"
                            </span>
                          )}
                        </div>

                        {/* Timestamp */}
                        <div className="text-[11px] text-[#94a3b8] flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-[#d4af37]" />
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
                          <span className="text-[#94a3b8]/60">
                            ({formatRelativeTime(log.createdAt)})
                          </span>
                        </div>
                      </div>

                      {/* Main Summary */}
                      <p className="text-xs sm:text-sm text-white font-medium break-words leading-relaxed">
                        {log.summary}
                      </p>

                      {/* Meta Details: IP, OS, Browser */}
                      <div className="flex items-center gap-3 text-[10px] text-[#94a3b8] mt-2 pt-2 border-t border-[#d4af37]/10 flex-wrap">
                        {log.ipAddress && (
                          <span className="flex items-center gap-1 text-[#94a3b8]/80">
                            <Laptop className="w-3 h-3 text-cyan-400" />
                            <span>IP: {log.ipAddress}</span>
                          </span>
                        )}

                        {log.userAgent && (
                          <span className="flex items-center gap-1 text-[#94a3b8]/70">
                            <span>{parseOS(log.userAgent)} • {parseBrowser(log.userAgent)}</span>
                          </span>
                        )}

                        {log.details && (
                          <button
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="ml-auto text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{isExpanded ? "Thu gọn dữ liệu" : "Xem chi tiết sửa đổi"}</span>
                          </button>
                        )}
                      </div>

                      {/* Expanded JSON details */}
                      {isExpanded && log.details && (
                        <div className="mt-3 p-3 rounded-xl bg-black/50 border border-[#d4af37]/20 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 animate-in fade-in duration-150">
                          <div className="text-[10px] uppercase font-bold text-[#d4af37] mb-1">
                            Thông Số Kỹ Thuật (Payload Details):
                          </div>
                          <pre>
                            {(() => {
                              try {
                                return JSON.stringify(JSON.parse(log.details), null, 2);
                              } catch {
                                return log.details;
                              }
                            })()}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER & PAGINATION */}
        <div className="p-3 sm:p-4 border-t border-[#d4af37]/20 bg-[#0c1420] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#94a3b8]">
            Hiển thị <strong className="text-white">{logs.length}</strong> trên tổng số{" "}
            <strong className="text-[#d4af37]">{total}</strong> hoạt động của tài khoản này
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl bg-[#111c2e] text-[#94a3b8] hover:text-white border border-[#d4af37]/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-[#111c2e] text-[#d4af37] font-bold text-xs rounded-xl border border-[#d4af37]/20">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-xl bg-[#111c2e] text-[#94a3b8] hover:text-white border border-[#d4af37]/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="ml-2 px-4 py-2 bg-[#152236] hover:bg-[#1d2f4a] text-white rounded-xl text-xs font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
