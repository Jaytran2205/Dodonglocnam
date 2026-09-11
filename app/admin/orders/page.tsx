"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Eye,
  Trash2,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  X,
  Phone,
  MessageCircle,
  MapPin,
  RefreshCw,
  ShoppingCart,
  Calendar,
  DollarSign,
  User,
  Package,
  FileSpreadsheet,
  Sparkles
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter === "ALL" ? "/api/admin/orders" : `/api/admin/orders?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (e) {
      alert("Lỗi cập nhật trạng thái đơn hàng");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${code}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder?.id === id) setSelectedOrder(null);
      }
    } catch (e) {
      alert("Lỗi khi xóa đơn hàng");
    }
  };

  const exportCSV = () => {
    const headers = [
      "Mã Đơn Hàng",
      "Khách Hàng",
      "Số Điện Thoại",
      "Email",
      "Địa Chỉ Giao Hàng",
      "Tổng Tiền (VNĐ)",
      "Trạng Thái",
      "Ngày Đặt"
    ];
    const rows = orders.map((o) => [
      o.orderCode,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.email || ""}"`,
      `"${o.address}"`,
      o.totalPrice,
      o.status,
      new Date(o.createdAt).toLocaleDateString("vi-VN")
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Don_Hang_Do_Dong_Loc_Nam_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusConfig: Record<string, { label: string; bg: string; icon: any }> = {
    PENDING: { label: "Chờ Xử Lý", bg: "bg-amber-500/15 text-amber-300 border-amber-500/40", icon: Clock },
    PROCESSING: { label: "Đang Chuẩn Bị", bg: "bg-blue-500/15 text-blue-300 border-blue-500/40", icon: Sparkles },
    SHIPPING: { label: "Đang Giao Hàng", bg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/40", icon: Truck },
    DELIVERED: { label: "Hoàn Tất", bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40", icon: CheckCircle2 },
    CANCELLED: { label: "Đã Hủy", bg: "bg-rose-500/15 text-rose-300 border-rose-500/40", icon: XCircle }
  };

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderCode.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.address.toLowerCase().includes(q)
    );
  }, [orders, search]);

  return (
    <div className="space-y-6">
      {/* Header with Title & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              QUẢN LÝ BÁN HÀNG
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide mt-1">
            DANH SÁCH ĐƠN HÀNG ({orders.length})
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Xác nhận đơn đặt hàng nhanh, liên hệ tư vấn qua điện thoại/Zalo và cập nhật tiến độ giao hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="p-2.5 bg-[#111c2e] hover:bg-[#152236] text-[#d4af37] border border-[#d4af37]/30 rounded-xl transition-all shadow"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-[#152236] hover:bg-[#1d2f4a] text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Báo Cáo Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "ALL", label: "Tất Cả Đơn" },
          { id: "PENDING", label: "Chờ Xử Lý", icon: Clock },
          { id: "PROCESSING", label: "Đang Chuẩn Bị", icon: Sparkles },
          { id: "SHIPPING", label: "Đang Giao", icon: Truck },
          { id: "DELIVERED", label: "Hoàn Tất", icon: CheckCircle2 },
          { id: "CANCELLED", label: "Đã Hủy", icon: XCircle }
        ].map((tab) => {
          const active = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                active
                  ? "bg-[#d4af37] text-[#070c14] shadow-lg shadow-[#d4af37]/20"
                  : "bg-[#0c1420] text-[#94a3b8] hover:text-white border border-[#1f2d42]"
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn, tên khách hàng, số điện thoại, địa chỉ..."
            className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none transition-all placeholder:text-gray-500"
          />
        </div>

        <span className="text-xs text-[#94a3b8] hidden sm:inline">
          Tìm thấy <strong>{filteredOrders.length}</strong> đơn hàng
        </span>
      </div>

      {/* Orders Data Table */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-400">Đang tải dữ liệu đơn hàng...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 space-y-3 text-gray-400">
            <ShoppingCart className="w-12 h-12 mx-auto text-gray-600" />
            <p className="text-sm">Không có đơn hàng nào trong mục này.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111c2e] text-[#d4af37] uppercase font-serif tracking-wider text-[11px] border-b border-[#1f2d42]">
                <tr>
                  <th className="py-3.5 px-4">Mã Đơn</th>
                  <th className="py-3.5 px-4">Khách Hàng</th>
                  <th className="py-3.5 px-4">Liên Hệ Trực Tiếp</th>
                  <th className="py-3.5 px-4">Tổng Tiền</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4">Ngày Đặt</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d42]/60">
                {filteredOrders.map((order) => {
                  const badge = statusConfig[order.status] || {
                    label: order.status,
                    bg: "bg-gray-500/20 text-gray-300 border-gray-500/40",
                    icon: Clock
                  };
                  const cleanPhone = (order.phone || "").replace(/\D/g, "");

                  return (
                    <tr key={order.id} className="hover:bg-[#111c2e]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#d4af37]">
                        #{order.orderCode}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-[#94a3b8] truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0 text-gray-500" />
                          <span>{order.address}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-1.5 rounded-lg bg-[#152236] hover:bg-[#d4af37] hover:text-[#070c14] text-[#d4af37] transition-colors shadow-sm"
                            title={`Gọi ngay: ${order.phone}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://zalo.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#0068FF] hover:bg-[#0052cc] text-white transition-colors shadow-sm"
                            title="Chat Zalo"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <span className="font-mono text-gray-200 font-semibold">{order.phone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#d4af37]">
                        {order.totalPrice ? `${order.totalPrice.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-lg border focus:outline-none cursor-pointer ${badge.bg}`}
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-[#152236] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#070c14] rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Xem</span>
                          </button>

                          <button
                            onClick={() => handleDelete(order.id, order.orderCode)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-400 hover:text-white transition-colors"
                            title="Xóa đơn"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* ORDER DETAIL DRAWER / MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0c1420] border-2 border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-gradient-to-r from-[#111c2e] to-[#0c1420] border-b border-[#d4af37]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest block">
                  CHI TIẾT ĐƠN HÀNG
                </span>
                <h2 className="font-serif font-extrabold text-xl text-white">
                  MÃ ĐƠN: #{selectedOrder.orderCode}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#152236] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Customer Info Card */}
              <div className="p-4 bg-[#111c2e] rounded-xl border border-[#1f2d42] space-y-2.5">
                <h3 className="font-serif font-bold text-sm text-[#d4af37] uppercase">
                  Thông Tin Người Nhận
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
                  <div>
                    <span className="text-gray-500 block">Họ và tên:</span>
                    <strong className="text-white text-sm">{selectedOrder.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Số điện thoại:</span>
                    <div className="flex items-center gap-2 pt-0.5">
                      <strong className="text-[#d4af37] font-mono text-sm">{selectedOrder.phone}</strong>
                      <a href={`tel:${selectedOrder.phone}`} className="p-1 bg-[#152236] text-[#d4af37] rounded">
                        <Phone className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block">Địa chỉ giao hàng:</span>
                    <span className="text-white">{selectedOrder.address}</span>
                  </div>
                  {selectedOrder.note && (
                    <div className="sm:col-span-2 p-2 bg-[#0c1420] rounded border border-gray-800 text-amber-300 italic">
                      Ghi chú: {selectedOrder.note}
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#d4af37] uppercase">
                  Sản Phẩm Trong Đơn ({selectedOrder.items?.length || 1})
                </h3>

                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="p-3 bg-[#111c2e] rounded-xl border border-[#1f2d42] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-gray-400">Số lượng: {item.quantity || 1}</div>
                        </div>
                        <div className="font-serif font-bold text-[#d4af37] text-sm">
                          {item.price ? `${item.price.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-[#111c2e] rounded-xl border border-[#1f2d42] flex items-center justify-between">
                      <span className="text-white font-medium">Đặt hàng trực tuyến / Tư vấn sản phẩm</span>
                      <span className="font-serif font-bold text-[#d4af37] text-sm">
                        {selectedOrder.totalPrice ? `${selectedOrder.totalPrice.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Status Selector */}
              <div className="p-4 bg-[#111c2e] rounded-xl border border-[#d4af37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-gray-400 block">Tổng Tiền Thanh Toán:</span>
                  <span className="font-serif font-extrabold text-xl text-[#d4af37]">
                    {selectedOrder.totalPrice ? `${selectedOrder.totalPrice.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Trạng thái:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="bg-[#0c1420] border border-[#d4af37] text-[#d4af37] font-bold text-xs px-3 py-2 rounded-xl focus:outline-none"
                  >
                    <option value="PENDING">Chờ Xử Lý</option>
                    <option value="PROCESSING">Đang Chuẩn Bị</option>
                    <option value="SHIPPING">Đang Giao Hàng</option>
                    <option value="DELIVERED">Hoàn Tất</option>
                    <option value="CANCELLED">Đã Hủy</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
