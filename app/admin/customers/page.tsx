"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Phone, Mail, MapPin, ShoppingBag, DollarSign, RefreshCw, MessageSquare, User, Calendar, CheckCircle2, Clock } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success) setCustomers(data.customers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
    );
  }, [customers, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              QUẢN TRỊ KHÁCH HÀNG
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide mt-1">
            DANH SÁCH KHÁCH HÀNG ({customers.length})
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Lịch sử giao dịch, tổng giá trị chi tiêu và liên hệ tư vấn trực tiếp qua Zalo / Hotline
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="p-2.5 bg-[#111c2e] hover:bg-[#152236] text-[#d4af37] border border-[#d4af37]/30 rounded-xl transition-all shadow self-start sm:self-auto"
          title="Tải lại"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên khách hàng, số điện thoại, địa chỉ..."
            className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none placeholder:text-gray-500"
          />
        </div>

        <span className="text-xs text-[#94a3b8] hidden sm:inline">
          Tổng cộng <strong>{filtered.length}</strong> khách hàng
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-400">Đang tải danh sách khách hàng...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3 text-gray-400">
            <User className="w-12 h-12 mx-auto text-gray-600" />
            <p className="text-sm">Chưa có khách hàng nào trong hệ thống.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111c2e] text-[#d4af37] uppercase font-serif tracking-wider text-[11px] border-b border-[#1f2d42]">
                <tr>
                  <th className="py-3.5 px-4">Khách Hàng</th>
                  <th className="py-3.5 px-4">Số Điện Thoại / Zalo</th>
                  <th className="py-3.5 px-4">Địa Chỉ</th>
                  <th className="py-3.5 px-4 text-center">Số Đơn Hàng</th>
                  <th className="py-3.5 px-4 text-right">Tổng Chi Tiêu</th>
                  <th className="py-3.5 px-4 text-right">Ngày Tham Gia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d42]/60">
                {filtered.map((c) => {
                  const cleanPhone = (c.phone || "").replace(/\D/g, "");

                  return (
                    <tr key={c.id} className="hover:bg-[#111c2e]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center font-bold font-serif text-sm shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{c.name}</div>
                            {c.email && <div className="text-[11px] text-gray-400">{c.email}</div>}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-1.5 rounded-lg bg-[#152236] hover:bg-[#d4af37] hover:text-[#070c14] text-[#d4af37] transition-colors"
                            title="Gọi điện"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://zalo.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#0068FF] hover:bg-[#0052cc] text-white transition-colors"
                            title="Nhắn Zalo"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <span className="font-mono text-gray-200 font-semibold">{c.phone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-300 max-w-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span className="truncate">{c.address || "Chưa có địa chỉ"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-white">
                        <span className="px-2.5 py-1 rounded-md bg-[#152236] text-[#d4af37]">
                          {c.orderCount || 1} đơn
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-serif font-bold text-[#d4af37] text-sm">
                        {c.totalSpent ? `${c.totalSpent.toLocaleString("vi-VN")} đ` : "0 đ"}
                      </td>

                      <td className="py-3.5 px-4 text-right text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
