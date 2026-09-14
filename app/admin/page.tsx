"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Package,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  Plus,
  Sparkles,
  Layers,
  FileText,
  Truck,
  XCircle,
  ArrowUpRight
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = () => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
          try {
            sessionStorage.setItem("locnam_admin_analytics", JSON.stringify(resData.data));
          } catch {}
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("locnam_admin_analytics");
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
      }
    } catch {}
    fetchAnalytics();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const resData = await res.json();
      if (resData.success) {
        fetchAnalytics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#94a3b8] font-serif font-bold uppercase tracking-widest">
          Đang tải dữ liệu báo cáo...
        </p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const topProducts = data?.topProducts || [];
  const monthlyRevenue = data?.monthlyRevenue || {
    "T4": 0,
    "T5": 0,
    "T6": 0,
    "T7": 0,
    "T8": 0,
    "T9": 0
  };

  const months = Object.keys(monthlyRevenue);
  const maxMonthValue = Math.max(...Object.values(monthlyRevenue).map((v) => Number(v) || 0), 1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Chờ Xử Lý", bg: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: Clock };
      case "PROCESSING":
        return { label: "Đang Chuẩn Bị", bg: "bg-blue-500/15 text-blue-300 border-blue-500/30", icon: Sparkles };
      case "SHIPPING":
        return { label: "Đang Giao", bg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30", icon: Truck };
      case "DELIVERED":
        return { label: "Hoàn Tất", bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: CheckCircle2 };
      case "CANCELLED":
        return { label: "Đã Hủy", bg: "bg-rose-500/15 text-rose-300 border-rose-500/30", icon: XCircle };
      default:
        return { label: status, bg: "bg-gray-500/15 text-gray-300 border-gray-500/30", icon: Clock };
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f1b2d] via-[#142338] to-[#0c1420] p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-serif font-bold uppercase rounded-full tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRUNG TÂM ĐIỀU HÀNH DOANH NGHIỆP</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              Chào Mừng Trở Lại, Ban Quản Trị Lộc Nam!
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl font-light">
              Theo dõi biến động doanh thu, quản lý đơn đặt hàng thủ công mỹ nghệ và cập nhật danh mục sản phẩm Ý Yên Nam Định theo thời gian thực.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/products"
              className="px-4 py-2.5 bg-[#d4af37] hover:bg-[#b89628] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Sản Phẩm Mới</span>
            </Link>

            <Link
              href="/admin/orders"
              className="px-4 py-2.5 bg-[#152236] hover:bg-[#1d2f4a] text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-[#d4af37]/30 shadow transition-all flex items-center gap-2"
            >
              <span>Xem Đơn Hàng</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37]" />
            </Link>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. 4 KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Doanh thu */}
        <div className="bg-[#0c1420] border border-[#d4af37]/25 p-5 rounded-2xl shadow-xl hover:border-[#d4af37]/50 transition-all flex items-center justify-between group">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
              TỔNG DOANH THU
            </span>
            <h3 className="font-serif font-extrabold text-2xl text-[#d4af37]">
              {(stats.totalRevenue ?? 0).toLocaleString("vi-VN")} đ
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-[#94a3b8] font-medium">
              <span>{stats.totalRevenue > 0 ? "Doanh thu thực tế tích lũy" : "Đã reset về 0 (Sẵn sàng bán)"}</span>
            </div>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Tổng đơn hàng */}
        <div className="bg-[#0c1420] border border-[#d4af37]/25 p-5 rounded-2xl shadow-xl hover:border-[#d4af37]/50 transition-all flex items-center justify-between group">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
              TỔNG ĐƠN HÀNG
            </span>
            <h3 className="font-serif font-extrabold text-2xl text-white">
              {stats.totalOrders ?? 0} đơn
            </h3>
            <span className="text-[11px] text-[#94a3b8] block">
              Từ Form đặt nhanh & Showroom
            </span>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-blue-500/15 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Đơn chờ xử lý */}
        <div className="bg-[#0c1420] border border-[#d4af37]/25 p-5 rounded-2xl shadow-xl hover:border-[#d4af37]/50 transition-all flex items-center justify-between group">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
              ĐƠN CHỜ XỬ LÝ
            </span>
            <h3 className="font-serif font-extrabold text-2xl text-amber-400">
              {stats.pendingOrders ?? 0} đơn
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats.pendingOrders > 0 ? "Cần gọi tư vấn khách ngay" : "Không có đơn tồn đọng"}</span>
            </div>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Tổng sản phẩm */}
        <div className="bg-[#0c1420] border border-[#d4af37]/25 p-5 rounded-2xl shadow-xl hover:border-[#d4af37]/50 transition-all flex items-center justify-between group">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
              SẢN PHẨM HOẠT ĐỘNG
            </span>
            <h3 className="font-serif font-extrabold text-2xl text-emerald-400">
              {stats.totalProducts ?? 329} SP
            </h3>
            <span className="text-[11px] text-[#94a3b8] block">
              100% Độc bản & Chuẩn ảnh
            </span>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Revenue Chart & Quick Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-[#0c1420] border border-[#d4af37]/20 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#1f2d42] pb-4">
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-white uppercase tracking-wide">
                BIỂU ĐỒ DOANH THU 6 THÁNG GẦN NHẤT
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Doanh số bán hàng thực tế qua hệ thống (Đơn vị: VNĐ)
              </p>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${
              (stats.totalRevenue ?? 0) > 0
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-[#152236] text-[#94a3b8] border-[#334155]/50"
            }`}>
              {(stats.totalRevenue ?? 0) > 0 ? "Tăng trưởng ổn định" : "Chưa có phát sinh"}
            </span>
          </div>

          {/* Bar Chart Bars */}
          <div className="grid grid-cols-6 gap-3 sm:gap-6 pt-6 pb-2 items-end h-56">
            {months.map((month) => {
              const val = Number(monthlyRevenue[month]) || 0;
              const percent = Math.min(Math.round((val / maxMonthValue) * 100), 100);
              return (
                <div key={month} className="flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] sm:text-xs font-bold text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity">
                    {(val / 1000000).toFixed(0)}M
                  </span>
                  <div className="w-full max-w-[48px] bg-[#152236] rounded-t-xl overflow-hidden p-0.5 h-full flex items-end">
                    <div
                      style={{ height: `${percent}%` }}
                      className="w-full bg-gradient-to-t from-[#b8860b] to-[#e5b869] rounded-t-lg group-hover:brightness-125 transition-all duration-500 shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                    ></div>
                  </div>
                  <span className="text-xs font-serif font-bold text-[#94a3b8] group-hover:text-white">
                    {month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Quick Navigation Shortcuts */}
        <div className="lg:col-span-4 bg-[#0c1420] border border-[#d4af37]/20 p-6 rounded-2xl shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-serif font-bold text-base text-[#d4af37] uppercase tracking-wide border-b border-[#1f2d42] pb-3">
              LỐI TẮT NHANH
            </h2>
            <p className="text-xs text-[#94a3b8] mt-2 mb-4">
              Truy cập nhanh vào các chức năng quản trị cốt lõi:
            </p>

            <div className="space-y-2.5">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl bg-[#111c2e] hover:bg-[#182740] border border-[#1f2d42] hover:border-[#d4af37]/50 text-xs font-semibold text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
                    <Package className="w-4 h-4" />
                  </div>
                  <span>Quản Lý {stats.totalProducts || 329} Sản Phẩm</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#d4af37] transition-colors" />
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-[#111c2e] hover:bg-[#182740] border border-[#1f2d42] hover:border-[#d4af37]/50 text-xs font-semibold text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <span>Xử Lý Đơn Hàng Mới</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center justify-between p-3 rounded-xl bg-[#111c2e] hover:bg-[#182740] border border-[#1f2d42] hover:border-[#d4af37]/50 text-xs font-semibold text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>Danh Mục Sản Phẩm</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
              </Link>

              <Link
                href="/admin/articles"
                className="flex items-center justify-between p-3 rounded-xl bg-[#111c2e] hover:bg-[#182740] border border-[#1f2d42] hover:border-[#d4af37]/50 text-xs font-semibold text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Đăng Cẩm Nang Phong Thủy</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
              </Link>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-xl border border-[#d4af37]/30 text-xs text-[#94a3b8]">
            <span className="font-bold text-[#d4af37] block">Tư vấn trực tiếp:</span>
            <span>Hotline hỗ trợ kỹ thuật xưởng: <strong>0846 699 997</strong></span>
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2d42] pb-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-white uppercase tracking-wide flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#d4af37]" />
              <span>ĐƠN ĐẶT HÀNG MỚI NHẤT</span>
            </h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Danh sách đơn đặt hàng nhanh cần liên hệ xác nhận
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-bold font-serif text-[#d4af37] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Xem Tất Cả ({stats.totalOrders || 0} đơn)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 space-y-2">
            <ShoppingCart className="w-10 h-10 mx-auto text-gray-600" />
            <p className="text-sm">Chưa có đơn hàng nào phát sinh.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111c2e] text-[#d4af37] uppercase font-serif tracking-wider text-[11px] border-b border-[#1f2d42]">
                <tr>
                  <th className="py-3 px-4">Mã Đơn</th>
                  <th className="py-3 px-4">Khách Hàng</th>
                  <th className="py-3 px-4">Liên Hệ</th>
                  <th className="py-3 px-4">Tổng Tiền</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4">Ngày Đặt</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d42]/60">
                {recentOrders.map((order: any) => {
                  const badge = getStatusBadge(order.status);
                  const Icon = badge.icon;
                  const cleanPhone = (order.phone || "").replace(/\D/g, "");

                  return (
                    <tr key={order.id} className="hover:bg-[#111c2e]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#d4af37]">
                        {order.orderCode}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div>{order.customerName}</div>
                        <div className="text-[11px] text-[#94a3b8] truncate max-w-xs">{order.address}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-1 rounded bg-[#152236] hover:bg-[#d4af37] hover:text-[#070c14] text-[#d4af37] transition-colors"
                            title="Gọi điện"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://zalo.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-[#0068FF] hover:bg-[#0052cc] text-white transition-colors"
                            title="Chat Zalo"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <span className="font-mono text-gray-300">{order.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#d4af37]">
                        {order.totalPrice ? `${order.totalPrice.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${badge.bg}`}
                        >
                          <option value="PENDING" className="bg-[#0c1420] text-amber-300">Chờ Xử Lý</option>
                          <option value="PROCESSING" className="bg-[#0c1420] text-blue-300">Đang Chuẩn Bị</option>
                          <option value="SHIPPING" className="bg-[#0c1420] text-indigo-300">Đang Giao Hàng</option>
                          <option value="DELIVERED" className="bg-[#0c1420] text-emerald-300">Hoàn Tất</option>
                          <option value="CANCELLED" className="bg-[#0c1420] text-rose-300">Đã Hủy</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href="/admin/orders"
                          className="px-3 py-1.5 bg-[#152236] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#070c14] rounded-lg font-semibold text-xs transition-colors"
                        >
                          Chi Tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Featured Catalog Snapshot */}
      {topProducts.length > 0 && (
        <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2d42] pb-4">
            <h2 className="font-serif font-bold text-lg text-white uppercase tracking-wide flex items-center gap-2">
              <Package className="w-5 h-5 text-[#d4af37]" />
              <span>SẢN PHẨM TIÊU BIỂU TRÊN SHOWROOM</span>
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-bold font-serif text-[#d4af37] hover:text-white"
            >
              Xem Toàn Bộ Kho Hàng ›
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {topProducts.slice(0, 4).map((prod: any) => {
              let imgs: string[] = [];
              try {
                imgs = JSON.parse(prod.images);
              } catch {
                imgs = [prod.images || "/images/hero_golden_ship.jpg"];
              }
              const thumb = imgs[0] || "/images/hero_golden_ship.jpg";

              return (
                <div
                  key={prod.id}
                  className="bg-[#111c2e] border border-[#1f2d42] hover:border-[#d4af37]/60 rounded-xl p-3 flex flex-col justify-between group transition-all"
                >
                  <div className="space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-white/5 relative p-2">
                      <img
                        src={thumb}
                        alt={prod.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-serif font-bold text-xs text-white group-hover:text-[#d4af37] line-clamp-2 transition-colors">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#1f2d42] flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-[#d4af37]">
                      {prod.price ? `${prod.price.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                      Sẵn sàng
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
