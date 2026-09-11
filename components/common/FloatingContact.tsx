"use client";

import React, { useState, useEffect } from "react";
import { Phone, ArrowUp, MessageSquare, MapPin } from "lucide-react";

interface FloatingContactProps {
  hotline?: string;
  hotline2?: string;
  zalo?: string;
}

export function FloatingContact({
  hotline = "0836 122 222",
  hotline2 = "0846 699 997",
  zalo = "0846699997",
}: FloatingContactProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Robust default: ensure both hotlines are present
  const initialH1 = hotline.replace(/\D/g, "") === "0846699997" ? "0836 122 222" : hotline;
  const initialH2 = hotline2 || "0846 699 997";

  const [phoneData, setPhoneData] = useState({
    hotline: initialH1,
    hotline2: initialH2,
    zalo: zalo,
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setPhoneData({
            hotline: data.settings.hotline || data.settings.hotline1 || "0836 122 222",
            hotline2: data.settings.hotline2 || data.settings.hotline_2 || "0846 699 997",
            zalo: data.settings.zalo || "0846699997",
          });
        }
      })
      .catch((e) => console.error("Error fetching floating contact settings:", e));
  }, []);

  // Clean numbers for tel: and zalo
  const cleanPhone1 = (phoneData.hotline || "0836 122 222").replace(/\D/g, "");
  const cleanPhone2 = (phoneData.hotline2 || "0846 699 997").replace(/\D/g, "");
  const cleanZalo = (phoneData.zalo || phoneData.hotline2 || "0846699997").replace(/\D/g, "");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP FLOATING BUTTONS (Bottom-Right, lg:flex)         */}
      {/* ============================================================ */}
      <aside
        aria-label="Kênh liên hệ nhanh"
        className="hidden lg:flex fixed bottom-6 right-6 z-40 flex-col items-center gap-3"
      >
        {/* Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Cuộn lên đầu trang"
            className="w-11 h-11 rounded-full bg-[#FAF2E1] border-2 border-[#D4AF37] text-[#4A0E17] hover:bg-[#D4AF37] hover:text-[#26050B] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Định Vị / Bản Đồ Showroom & Xưởng Đúc Button */}
        <a
          href="https://maps.app.goo.gl/5rQAVSTNhDzQtMebA"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Định vị Showroom và Xưởng đúc Lộc Nam trên Google Maps"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#dc2626] via-[#ea580c] to-[#b91c1c] text-white shadow-2xl border-2 border-[#fca5a5]/80 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <span className="absolute -inset-1.5 rounded-full bg-[#ef4444]/40 animate-ping"></span>
          <MapPin className="w-5 h-5 text-white animate-bounce" />
          <span className="absolute right-14 px-3 py-1.5 bg-[#0b1622] text-[#ffd700] text-xs font-bold rounded-lg border border-[#ffd700] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
            📍 Định vị: Showroom & Xưởng đúc Lộc Nam
          </span>
        </a>

        {/* Zalo Chat Floating Button */}
        <a
          href={`https://zalo.me/${cleanZalo}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat qua Zalo tư vấn trực tiếp"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0068FF] text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <span className="absolute -inset-1 rounded-full bg-[#0068FF]/40 animate-ping"></span>
          <span className="font-black text-[11px] tracking-tighter">ZALO</span>
          <span className="absolute right-14 px-3 py-1.5 bg-[#0b1622] text-[#FFD700] text-xs font-bold rounded-lg border border-[#D4AF37] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Chat Zalo: {phoneData.zalo}
          </span>
        </a>

        {/* Hotline 2 Button */}
        <a
          href={`tel:${cleanPhone2}`}
          aria-label="Gọi Hotline 2"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#996515] to-[#784e10] text-[#FFD700] shadow-xl border-2 border-[#FFD700]/60 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Phone className="w-5 h-5 fill-current" />
          <span className="absolute right-14 px-3 py-1.5 bg-[#0b1622] text-[#FFD700] text-xs font-bold rounded-lg border border-[#FFD700] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Hotline 2: {phoneData.hotline2}
          </span>
        </a>

        {/* Hotline 1 (Chính) Button */}
        <a
          href={`tel:${cleanPhone1}`}
          aria-label="Gọi Hotline 1 Lộc Nam"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#dfb755] via-[#f5db8b] to-[#b8860b] text-[#0b1622] shadow-2xl border-2 border-[#ffe082] transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <span className="absolute -inset-1.5 rounded-full bg-[#FFD700]/40 animate-ping"></span>
          <Phone className="w-5 h-5 fill-current animate-bounce" />
          <span className="absolute right-14 px-3 py-1.5 bg-[#0b1622] text-[#FFD700] text-xs font-bold rounded-lg border border-[#FFD700] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Hotline 1: {phoneData.hotline}
          </span>
        </a>
      </aside>

      {/* ============================================================ */}
      {/* 2. MOBILE BOTTOM ACTION BAR (lg:hidden)                     */}
      {/* ============================================================ */}
      <nav
        aria-label="Thanh điều hướng liên hệ di động"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 select-none"
      >
        {/* Frosted Glass Container */}
        <div className="relative mx-auto max-w-md rounded-2xl bg-[#0b1622]/95 backdrop-blur-2xl border border-[#1c2c3d] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] overflow-visible">
          {/* Top Shimmer Line */}
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700]/50 to-transparent"></div>

          <div className="grid grid-cols-4 items-center px-2 py-1.5 text-center gap-1.5">
            {/* 1. ĐỊNH VỊ SHOWROOM */}
            <a
              href="https://maps.app.goo.gl/5rQAVSTNhDzQtMebA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-1 group active:scale-90 transition-transform duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c] border border-[#fca5a5]/60 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md">
                <MapPin className="w-4 h-4 text-white animate-bounce" />
              </div>
              <span className="text-[10px] font-bold text-[#ffd700] mt-1 tracking-tight">
                Định vị
              </span>
            </a>

            {/* 2. GỌI HOTLINE 1 */}
            <a
              href={`tel:${cleanPhone1}`}
              className="flex flex-col items-center justify-center py-1 px-1 bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0b1622] rounded-xl font-bold shadow-md border border-[#ffe082] active:scale-95 transition-transform"
            >
              <Phone className="w-4 h-4 fill-[#0b1622] animate-pulse" />
              <span className="text-[9px] font-black tracking-tight mt-0.5 whitespace-nowrap">0836.122.222</span>
            </a>

            {/* 3. GỌI HOTLINE 2 */}
            <a
              href={`tel:${cleanPhone2}`}
              className="flex flex-col items-center justify-center py-1 px-1 bg-gradient-to-r from-[#996515] to-[#6d460d] text-[#ffe082] rounded-xl font-bold shadow-md border border-[#dfb755]/50 active:scale-95 transition-transform"
            >
              <Phone className="w-4 h-4 fill-[#ffe082] animate-pulse" />
              <span className="text-[9px] font-black tracking-tight mt-0.5 whitespace-nowrap">0846.699.997</span>
            </a>

            {/* 4. CHAT ZALO */}
            <a
              href={`https://zalo.me/${cleanZalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-1 group active:scale-90 transition-transform duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-[#0068FF] shadow-md flex items-center justify-center text-white font-black text-[9px] tracking-tighter group-hover:scale-105 transition-transform border border-white/40">
                Zalo
              </div>
              <span className="text-[10px] font-bold text-[#e2e8f0] mt-1 tracking-tight">
                Chat Zalo
              </span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}