"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Smartphone,
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
  FileText,
  ChevronDown,
  Info,
  CheckCircle2,
  Calendar
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

interface SessionGroup {
  id: string;
  ipAddress: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet";
  startTime: string;
  endTime: string;
  totalCount: number;
  logins: LogItem[];
  modifications: LogItem[];
  clicks: LogItem[];
  navigation: LogItem[];
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
  const limit = 50;

  // Filter tabs: "ALL" | "LOGIN" | "MODIFY" | "CLICK"
  const [actionGroup, setActionGroup] = useState<"ALL" | "LOGIN" | "MODIFY" | "CLICK">("ALL");
  const [dateRange, setDateRange] = useState("all");
  const [search, setSearch] = useState("");
  
  // View mode: "SESSIONS" (grouped by device/session - default as requested) | "TIMELINE"
  const [viewMode, setViewMode] = useState<"SESSIONS" | "TIMELINE">("SESSIONS");

  // Expanded state for sessions: { [sessionId]: boolean }
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});
  // Expanded state for categories inside a session: { [`${sessionId}_${category}`]: boolean }
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  // Expanded state for individual log details payload
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    // Safety guard: Hidden super admin must never be tracked or displayed
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
        params.set("includeClicks", "true"); // Always include user's clicks so we can group them
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

  // Helpers to parse User Agent
  const parseBrowser = (ua?: string | null) => {
    if (!ua) return "Trình duyệt ẩn";
    if (ua.includes("Chrome") && !ua.includes("Edg")) return "Google Chrome";
    if (ua.includes("Edg")) return "Microsoft Edge";
    if (ua.includes("Firefox")) return "Mozilla Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Apple Safari";
    if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
    return "Trình duyệt Web";
  };

  const parseOS = (ua?: string | null) => {
    if (!ua) return "HĐH không rõ";
    if (ua.includes("Windows NT 10.0")) return "Windows 10/11";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("iPhone")) return "iPhone (iOS)";
    if (ua.includes("iPad")) return "iPad (iPadOS)";
    if (ua.includes("Android")) return "Android Phone";
    if (ua.includes("Macintosh") || ua.includes("Mac OS")) return "macOS (Apple)";
    if (ua.includes("Linux")) return "Linux OS";
    return "Thiết bị khác";
  };

  const getDeviceType = (ua?: string | null): "desktop" | "mobile" | "tablet" => {
    if (!ua) return "desktop";
    if (ua.includes("iPhone") || ua.includes("Android")) return "mobile";
    if (ua.includes("iPad") || ua.includes("Tablet")) return "tablet";
    return "desktop";
  };

  // Group Logs into Sessions by (IP + Device signature + Time window)
  const sessionGroups: SessionGroup[] = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    const groups: SessionGroup[] = [];
    let currentSession: SessionGroup | null = null;

    // Logs are newest first (descending).
    // A gap > 3 hours or a change in IP/device triggers a new session card.
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      const logTime = new Date(log.createdAt).getTime();
      const ip = log.ipAddress || "Không rõ IP";
      const ua = log.userAgent || "";

      let shouldStartNewSession = false;

      if (!currentSession) {
        shouldStartNewSession = true;
      } else {
        const lastLogTime = new Date(currentSession.startTime).getTime();
        const diffHours = Math.abs(lastLogTime - logTime) / (1000 * 60 * 60);

        if (currentSession.ipAddress !== ip || diffHours > 4 || log.action === "LOGIN") {
          shouldStartNewSession = true;
        }
      }

      if (shouldStartNewSession) {
        const sid = `sess_${groups.length}_${log.id}`;
        currentSession = {
          id: sid,
          ipAddress: ip,
          userAgent: ua,
          browser: parseBrowser(ua),
          os: parseOS(ua),
          deviceType: getDeviceType(ua),
          startTime: log.createdAt,
          endTime: log.createdAt,
          totalCount: 0,
          logins: [],
          modifications: [],
          clicks: [],
          navigation: [],
        };
        groups.push(currentSession);
      }

      // Add to session
      if (currentSession) {
        currentSession.totalCount++;
        currentSession.startTime = log.createdAt; // keep oldest timestamp of this session as start

        if (log.action === "LOGIN" || log.action === "LOGOUT") {
          currentSession.logins.push(log);
        } else if (
          ["CREATE", "UPDATE", "DELETE", "STATUS_CHANGE", "SETTINGS_CHANGE"].includes(log.action)
        ) {
          currentSession.modifications.push(log);
        } else if (["CLICK", "VIEW"].includes(log.action)) {
          currentSession.clicks.push(log);
        } else {
          currentSession.navigation.push(log);
        }
      }
    }

    return groups;
  }, [logs]);

  // Toggle session expand/collapse
  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  // Toggle category inside session
  const toggleCategory = (sessionId: string, category: string) => {
    const key = `${sessionId}_${category}`;
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isCategoryExpanded = (sessionId: string, category: string) => {
    return Boolean(expandedCategories[`${sessionId}_${category}`]);
  };

  // Format relative time
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

  const formatSessionTime = (startTime: string, endTime: string) => {
    const s = new Date(startTime);
    const e = new Date(endTime);

    const sStr = s.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const eStr = e.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const dStr = s.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    if (sStr === eStr) {
      return `${sStr} ngày ${dStr}`;
    }
    return `${sStr} - ${eStr} (${dStr})`;
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

  // Render an individual log item inside an expanded category
  const renderLogRow = (log: LogItem) => {
    const config = getActionConfig(log.action);
    const ActionIcon = config.icon;
    const isPayloadExpanded = expandedLogId === log.id;

    return (
      <div
        key={log.id}
        className="p-3 rounded-xl bg-[#09101a] border border-[#1f2d42] hover:border-[#d4af37]/40 transition-all text-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${config.color}`}>
              {config.label}
            </span>
            <span className="font-semibold text-white">{log.entity}</span>
            {log.entityName && (
              <span className="text-[#d4af37] font-medium truncate max-w-[200px]">
                "{log.entityName}"
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#94a3b8] flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-[#d4af37]" />
            <span>
              {new Date(log.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <span className="text-[#94a3b8]/60">({formatRelativeTime(log.createdAt)})</span>
          </div>
        </div>

        <p className="text-gray-200 font-medium break-words mt-1 leading-relaxed">
          {log.summary}
        </p>

        {log.details && (
          <div className="mt-2 pt-2 border-t border-[#1a2638] flex items-center justify-between">
            <span className="text-[10px] text-[#94a3b8]">
              {log.action === "CLICK" ? "Thao tác trên giao diện" : "Dữ liệu payload hệ thống"}
            </span>
            <button
              onClick={() => setExpandedLogId(isPayloadExpanded ? null : log.id)}
              className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
            >
              <Eye className="w-3 h-3" />
              <span>{isPayloadExpanded ? "Thu gọn chi tiết" : "Xem chi tiết sửa đổi"}</span>
            </button>
          </div>
        )}

        {isPayloadExpanded && log.details && (
          <div className="mt-2 p-2.5 rounded-lg bg-black/60 border border-[#d4af37]/20 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-40 animate-in fade-in duration-150">
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
    );
  };

  if (!user) return null;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a111c] border border-[#d4af37]/40 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
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

        {/* 4 STATS OVERVIEW CARDS */}
        <div className="p-3 sm:p-4 bg-[#070c14] border-b border-[#d4af37]/15 shrink-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
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
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                {stats?.totalLogins ?? 0}
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate">
                {stats?.lastIp ? `IP gần nhất: ${stats.lastIp}` : "Ghi nhận từ hệ thống"}
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
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                {stats?.totalModifications ?? 0}
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate">
                Sản phẩm, danh mục, đơn hàng...
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
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                {stats?.totalClicks ?? 0}
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate">
                Đường dẫn & nút bấm giao diện
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
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                {stats?.totalActions ?? 0}
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate">
                {stats?.lastActiveAt
                  ? `Hoạt động gần nhất: ${formatRelativeTime(stats.lastActiveAt)}`
                  : "Toàn bộ lịch sử"}
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: VIEW MODE SWITCH, TABS, SEARCH */}
        <div className="p-3 sm:p-4 bg-[#0c1420] border-b border-[#d4af37]/15 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          {/* View Mode Switcher: Sessions vs Flat Timeline */}
          <div className="flex items-center gap-1.5 bg-[#111c2e] p-1 rounded-xl border border-[#d4af37]/20">
            <button
              onClick={() => setViewMode("SESSIONS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "SESSIONS"
                  ? "bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0c1420] shadow"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Gom Theo Phiên & Thiết Bị (Thu Gọn)</span>
            </button>

            <button
              onClick={() => setViewMode("TIMELINE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "TIMELINE"
                  ? "bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0c1420] shadow"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Dòng Thời Gian Chi Tiết</span>
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

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {loading ? (
            <div className="py-20 text-center text-[#94a3b8]">
              <RefreshCw className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-3" />
              <p className="text-xs">Đang tải toàn bộ dữ liệu hành trình theo phiên thiết bị...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20 text-center text-[#94a3b8]">
              <AlertCircle className="w-10 h-10 text-amber-500/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">
                Không tìm thấy hoạt động nào phù hợp
              </p>
              <p className="text-xs text-[#94a3b8] mt-1">
                Thử chọn khoảng thời gian khác hoặc kiểm tra lại từ khóa tìm kiếm
              </p>
            </div>
          ) : viewMode === "SESSIONS" ? (
            /* MODE 1: SESSIONS & DEVICES GROUPING WITH COLLAPSIBLE CATEGORIES (As requested by User) */
            <div className="space-y-4">
              <div className="text-xs text-[#94a3b8] flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Info className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>
                    Hoạt động đã được gom gọn theo từng thiết bị và phiên đăng nhập. Bấm "Xem chi tiết máy này" để mở rộng:
                  </span>
                </span>
                <span className="font-bold text-[#d4af37]">
                  {sessionGroups.length} Phiên làm việc
                </span>
              </div>

              {sessionGroups.map((session, sIdx) => {
                const isSessionExpanded = Boolean(expandedSessions[session.id]);
                const DeviceIcon = session.deviceType === "mobile" ? Smartphone : Laptop;

                return (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-[#d4af37]/30 bg-[#0d1624] overflow-hidden shadow-lg transition-all"
                  >
                    {/* SESSION HEADER / CARD */}
                    <div
                      onClick={() => toggleSession(session.id)}
                      className="p-4 sm:p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-[#121c2e] transition-colors border-b border-[#1f2d42]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#152236] border border-[#d4af37]/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm">
                          <DeviceIcon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">
                              {session.os} • {session.browser}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                              IP: {session.ipAddress}
                            </span>
                            {sIdx === 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                                Mới nhất
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#94a3b8] flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{formatSessionTime(session.startTime, session.endTime)}</span>
                          </p>
                        </div>
                      </div>

                      {/* SUMMARY BADGES */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {session.logins.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/15 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                            <LogIn className="w-3 h-3" />
                            {session.logins.length} Đăng nhập
                          </span>
                        )}
                        {session.modifications.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                            <FileEdit className="w-3 h-3" />
                            {session.modifications.length} Sửa/Xóa dữ liệu
                          </span>
                        )}
                        {session.clicks.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-500/15 border border-teal-500/40 text-teal-300 flex items-center gap-1">
                            <MousePointer className="w-3 h-3" />
                            {session.clicks.length} Lượt Click
                          </span>
                        )}
                        {session.navigation.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                            <Compass className="w-3 h-3" />
                            {session.navigation.length} Trang xem
                          </span>
                        )}

                        <button
                          type="button"
                          className={`ml-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 ${
                            isSessionExpanded
                              ? "bg-[#d4af37] text-[#0a111c] border-[#d4af37]"
                              : "bg-[#162234] text-[#d4af37] border-[#d4af37]/30 hover:bg-[#1f2f47]"
                          }`}
                        >
                          <span>{isSessionExpanded ? "Thu gọn máy này" : "Xem chi tiết máy này"}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isSessionExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* INSIDE THE SESSION: COLLAPSIBLE CATEGORIES (ACCORDION) */}
                    {isSessionExpanded && (
                      <div className="p-4 sm:p-5 bg-[#080d15] space-y-3 animate-in fade-in duration-150">
                        <div className="text-[11px] text-[#94a3b8] mb-2 flex items-center gap-1.5 font-medium">
                          <Info className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>
                            Dưới đây là các hạng mục thao tác tại máy này. Bấm vào từng hạng mục để xem chi tiết:
                          </span>
                        </div>

                        {/* ACCORDION 1: Đăng nhập & Xác thực */}
                        {session.logins.length > 0 && (
                          <div className="border border-purple-500/30 rounded-xl overflow-hidden bg-[#0c1420]">
                            <button
                              type="button"
                              onClick={() => toggleCategory(session.id, "logins")}
                              className="w-full p-3 flex items-center justify-between text-left hover:bg-purple-950/20 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <LogIn className="w-4 h-4 text-purple-400" />
                                <span className="font-bold text-xs sm:text-sm text-purple-200">
                                  1. Lịch sử Đăng nhập & Xác thực ({session.logins.length} lượt)
                                </span>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 text-purple-400 transition-transform duration-200 ${
                                  isCategoryExpanded(session.id, "logins") ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isCategoryExpanded(session.id, "logins") && (
                              <div className="p-3 border-t border-purple-500/20 bg-black/40 space-y-2">
                                {session.logins.map(renderLogRow)}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ACCORDION 2: Thao tác Sửa, Xóa & Cập Nhật Dữ Liệu */}
                        {session.modifications.length > 0 && (
                          <div className="border border-rose-500/30 rounded-xl overflow-hidden bg-[#0c1420]">
                            <button
                              type="button"
                              onClick={() => toggleCategory(session.id, "modifications")}
                              className="w-full p-3 flex items-center justify-between text-left hover:bg-rose-950/20 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <FileEdit className="w-4 h-4 text-rose-400" />
                                <span className="font-bold text-xs sm:text-sm text-rose-200">
                                  2. Thao tác Sửa, Xóa & Cập Nhật Dữ Liệu ({session.modifications.length} thao tác)
                                </span>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 text-rose-400 transition-transform duration-200 ${
                                  isCategoryExpanded(session.id, "modifications") ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isCategoryExpanded(session.id, "modifications") && (
                              <div className="p-3 border-t border-rose-500/20 bg-black/40 space-y-2">
                                {session.modifications.map(renderLogRow)}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ACCORDION 3: Chi tiết Các Nút & Thẻ Đã Bấm (Clicks) */}
                        {session.clicks.length > 0 && (
                          <div className="border border-teal-500/30 rounded-xl overflow-hidden bg-[#0c1420]">
                            <button
                              type="button"
                              onClick={() => toggleCategory(session.id, "clicks")}
                              className="w-full p-3 flex items-center justify-between text-left hover:bg-teal-950/20 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <MousePointer className="w-4 h-4 text-teal-400" />
                                <span className="font-bold text-xs sm:text-sm text-teal-200">
                                  3. Chi Tiết Các Nút & Thẻ Đã Click ({session.clicks.length} lượt click)
                                </span>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 text-teal-400 transition-transform duration-200 ${
                                  isCategoryExpanded(session.id, "clicks") ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isCategoryExpanded(session.id, "clicks") && (
                              <div className="p-3 border-t border-teal-500/20 bg-black/40 space-y-2">
                                {session.clicks.map(renderLogRow)}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ACCORDION 4: Các Trang Đã Truy Cập & Xem */}
                        {session.navigation.length > 0 && (
                          <div className="border border-cyan-500/30 rounded-xl overflow-hidden bg-[#0c1420]">
                            <button
                              type="button"
                              onClick={() => toggleCategory(session.id, "navigation")}
                              className="w-full p-3 flex items-center justify-between text-left hover:bg-cyan-950/20 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Compass className="w-4 h-4 text-cyan-400" />
                                <span className="font-bold text-xs sm:text-sm text-cyan-200">
                                  4. Các Trang Đã Truy Cập & Xem ({session.navigation.length} trang)
                                </span>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${
                                  isCategoryExpanded(session.id, "navigation") ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isCategoryExpanded(session.id, "navigation") && (
                              <div className="p-3 border-t border-cyan-500/20 bg-black/40 space-y-2">
                                {session.navigation.map(renderLogRow)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* MODE 2: FLAT TIMELINE LIST */
            <div className="relative border-l-2 border-[#d4af37]/20 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-4">
              {logs.map((log) => {
                const config = getActionConfig(log.action);
                const ActionIcon = config.icon;
                const isExpanded = expandedLogId === log.id;

                return (
                  <div key={log.id} className="relative group">
                    <div
                      className={`absolute -left-[27px] sm:-left-[35px] top-1.5 w-6 h-6 rounded-full border-2 border-[#0a111c] flex items-center justify-center shadow-md ${config.color}`}
                    >
                      <ActionIcon className="w-3 h-3" />
                    </div>

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

                      <p className="text-xs sm:text-sm text-white font-medium break-words leading-relaxed">
                        {log.summary}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-[#94a3b8] mt-2 pt-2 border-t border-[#d4af37]/10 flex-wrap">
                        {log.ipAddress && (
                          <span className="flex items-center gap-1 text-[#94a3b8]/80">
                            <Laptop className="w-3 h-3 text-cyan-400" />
                            <span>IP: {log.ipAddress}</span>
                          </span>
                        )}

                        {log.userAgent && (
                          <span className="flex items-center gap-1 text-[#94a3b8]/70">
                            <span>
                              {parseOS(log.userAgent)} • {parseBrowser(log.userAgent)}
                            </span>
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

                      {isExpanded && log.details && (
                        <div className="mt-3 p-3 rounded-xl bg-black/50 border border-[#d4af37]/20 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 animate-in fade-in duration-150">
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
