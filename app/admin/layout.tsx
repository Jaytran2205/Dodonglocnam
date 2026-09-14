"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  ShoppingCart,
  Users,
  Sliders,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Globe,
  Plus
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);

  // If we are on the login page, don't show the dashboard shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    if (!adminUser) {
      fetch("/api/admin/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAdminUser(data.user);
          } else {
            router.push("/admin/login");
          }
        })
        .catch(() => router.push("/admin/login"));
    }

    // Fetch pending orders count for badge once
    fetch("/api/admin/orders?status=PENDING")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setPendingOrdersCount(data.orders.length);
        }
      })
      .catch(() => {});
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Tổng Quan & Báo Cáo", icon: LayoutDashboard },
    { href: "/admin/products", label: "Quản Lý Sản Phẩm", icon: Package },
    { href: "/admin/categories", label: "Danh Mục & Thẻ Con", icon: Layers },
    { href: "/admin/landing-page", label: "Giao Diện & Trang Chủ", icon: Sliders },
    { href: "/admin/orders", label: "Quản Lý Đơn Hàng", icon: ShoppingCart, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { href: "/admin/articles", label: "Bài Viết Chuẩn SEO", icon: FileText },
    { href: "/admin/customers", label: "Khách Hàng & Liên Hệ", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#070c14] text-[#f1f5f9] flex flex-col md:flex-row antialiased selection:bg-[#d4af37] selection:text-[#070c14]">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex md:w-72 flex-col justify-between bg-[#0c1420] border-r border-[#d4af37]/20 shadow-2xl shrink-0 z-20">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-[#d4af37]/20 flex items-center gap-3.5 bg-gradient-to-b from-[#111c2e] to-[#0c1420]">
            <div className="w-12 h-12 rounded-xl border border-[#d4af37]/50 p-1 bg-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <img src="/images/logo.png" alt="Lộc Nam" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase">
                  ADMIN PORTAL
                </span>
              </div>
              <h2 className="font-serif font-extrabold text-sm text-white tracking-wide uppercase leading-tight mt-0.5">
                ĐỒ ĐỒNG LỘC NAM
              </h2>
              <span className="text-[10px] text-[#94a3b8] block">
                Ý Yên, Nam Định
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="text-[11px] font-serif font-bold text-[#d4af37]/70 uppercase tracking-widest px-3 py-2">
              Quản Trị Hệ Thống
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all group ${
                    active
                      ? "bg-gradient-to-r from-[#d4af37] to-[#e5b869] text-[#070c14] font-bold shadow-lg shadow-[#d4af37]/20"
                      : "text-[#94a3b8] hover:bg-[#152236] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        active ? "text-[#070c14]" : "text-[#d4af37]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow animate-pulse">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                        active ? "opacity-100 text-[#070c14]" : "text-gray-500"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Sidebar User Info & Storefront Link */}
        <div className="p-4 border-t border-[#d4af37]/20 space-y-3 bg-[#0a111c]">
          <Link
            href="/"
            target="_blank"
            className="w-full py-2.5 px-3 bg-[#152236] hover:bg-[#1d2f4a] text-[#d4af37] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all border border-[#d4af37]/30 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Xem Website Cửa Hàng</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
          </Link>

          <div className="p-3 bg-[#111c2e] rounded-xl border border-[#d4af37]/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-[#070c14] font-bold flex items-center justify-center text-xs shrink-0 shadow">
                AD
              </div>
              <div className="overflow-hidden text-xs">
                <span className="text-white font-semibold truncate block">
                  {adminUser?.name || "Admin Lộc Nam"}
                </span>
                <span className="text-[10px] text-[#94a3b8] truncate block">
                  {adminUser?.email || "admin@dodonglocnam.com"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-900/60 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#070c14]">
        {/* Top Navbar */}
        <header className="h-16 bg-[#0c1420]/90 backdrop-blur-md border-b border-[#d4af37]/20 px-4 sm:px-8 flex items-center justify-between shadow-lg sticky top-0 z-30 shrink-0">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#d4af37] hover:text-white rounded-lg hover:bg-[#152236]"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg border border-[#d4af37] p-0.5 bg-white flex items-center justify-center">
                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif font-bold text-xs text-[#d4af37] uppercase">
                LỘC NAM ADMIN
              </span>
            </div>
          </div>

          {/* Desktop Search / Quick Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111c2e] border border-[#d4af37]/20 text-xs text-[#94a3b8]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Hệ thống quản trị xưởng đúc Đồ Đồng Lộc Nam (Ý Yên - Nam Định)</span>
            </div>
          </div>

          {/* Quick Actions Right */}
          <div className="flex items-center gap-3">
            {pendingOrdersCount > 0 && (
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-all"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>{pendingOrdersCount} đơn chờ xử lý</span>
              </Link>
            )}

            <Link
              href="/admin/products"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d4af37] hover:bg-[#b89628] text-[#070c14] font-bold text-xs uppercase tracking-wide rounded-lg transition-all shadow hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Sản Phẩm</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#152236] hover:bg-[#1d2f4a] text-[#d4af37] border border-[#d4af37]/30 rounded-lg text-xs font-semibold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trang Chủ</span>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0c1420] border-b-2 border-[#d4af37]/30 p-4 space-y-2 shadow-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold uppercase ${
                    active
                      ? "bg-[#d4af37] text-[#070c14] font-bold"
                      : "text-[#94a3b8] hover:bg-[#152236] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full mt-3 py-2 px-3 bg-rose-950/80 text-rose-300 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 border border-rose-900"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
