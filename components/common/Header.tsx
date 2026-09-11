"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopBar } from "./TopBar";
import { Search, Phone, Menu, X, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { ConsultationModal } from "@/components/home/ConsultationModal";

interface HeaderProps {
  hotline?: string;
  email?: string;
}

export function Header({
  hotline = "0846.699.997",
  email = "dodonglocnam1102@gmail.com",
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cleanPhone = hotline.replace(/\./g, "").replace(/\s/g, "");

  const mainCategories = [
    { name: "TRANG CHỦ", href: "/" },
    {
      name: "GIỚI THIỆU",
      href: "/gioi-thieu",
      subitems: [
        { name: "Về Đúc Đồng Lộc Nam", href: "/gioi-thieu" },
        { name: "Nghệ Nhân Dương Bá Tiến", href: "/gioi-thieu" },
        { name: "Xưởng Sản Xuất & Showroom", href: "/gioi-thieu" },
        { name: "Quy Trình Đúc Thủ Công", href: "/quy-trinh" },
      ],
    },
    {
      name: "ĐỒ THỜ CÚNG",
      href: "/san-pham/do-tho-cung",
      subitems: [
        { name: "Bộ Đồ Thờ Đầy Đủ", href: "/san-pham/do-tho-cung" },
        { name: "Bộ Tam Sự, Ngũ Sự", href: "/san-pham/do-tho-cung" },
        { name: "Đỉnh Đồng Thờ Cúng", href: "/san-pham/do-tho-cung" },
        { name: "Bát Hương Bằng Đồng", href: "/san-pham/do-tho-cung" },
        { name: "Hạc Thờ & Chân Nến", href: "/san-pham/do-tho-cung" },
        { name: "Hoành Phi Câu Đối", href: "/san-pham/do-tho-cung" },
        { name: "Đồ Thờ Khảm Ngũ Sắc", href: "/san-pham/do-tho-cung" },
        { name: "Đồ Thờ Dát Vàng 9999", href: "/san-pham/do-tho-cung" },
      ],
    },
    {
      name: "TƯỢNG ĐỒNG",
      href: "/san-pham/tuong-dong",
      subitems: [
        { name: "Tượng Phật Bằng Đồng", href: "/san-pham/tuong-dong" },
        { name: "Tượng Bác Hồ - Đại Tướng", href: "/san-pham/tuong-dong" },
        { name: "Tượng Đức Thánh Trần", href: "/san-pham/tuong-dong" },
        { name: "Tượng Quan Vân Trường", href: "/san-pham/tuong-dong" },
        { name: "Đúc Tượng Chân Dung", href: "/san-pham/tuong-dong" },
        { name: "Tượng 12 Con Giáp Phong Thủy", href: "/san-pham/tuong-dong" },
      ],
    },
    {
      name: "TRANH & TRỐNG ĐỒNG",
      href: "/san-pham/qua-tang-dong",
      subitems: [
        { name: "Tranh Đồng Mạ Vàng 24K", href: "/san-pham/qua-tang-dong" },
        { name: "Tranh Vinh Hoa Phú Quý", href: "/san-pham/qua-tang-dong" },
        { name: "Tranh Thuận Buồm Xuôi Gió", href: "/san-pham/qua-tang-dong" },
        { name: "Tranh Tứ Quý Bằng Đồng", href: "/san-pham/qua-tang-dong" },
        { name: "Quả Trống Đồng Đông Sơn", href: "/san-pham/qua-tang-dong" },
        { name: "Mặt Trống Đồng Đúc & Dát Vàng", href: "/san-pham/qua-tang-dong" },
      ],
    },
    {
      name: "ĐÚC CHUÔNG & TỪ ĐƯỜNG",
      href: "/san-pham/duc-chuong-cong-trinh",
      subitems: [
        { name: "Đúc Đại Hồng Chung Chùa", href: "/san-pham/duc-chuong-cong-trinh" },
        { name: "Chiêng & Khánh Đồng", href: "/san-pham/duc-chuong-cong-trinh" },
        { name: "Thi Công Không Gian Nhà Thờ Họ", href: "/san-pham/duc-chuong-cong-trinh" },
        { name: "Đúc Tượng Cỡ Lớn Tận Nơi", href: "/san-pham/duc-chuong-cong-trinh" },
      ],
    },
    { name: "DỰ ÁN", href: "/du-an" },
    { name: "TIN TỨC", href: "/tin-tuc" },
    { name: "LIÊN HỆ", href: "/lien-he" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/san-pham?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        {/* 1. TopBar (Showroom, Hotline, Hours) */}
        <TopBar hotline={hotline} email={email} />

        {/* 2. Middle Brand & Big Search Section */}
        <div className="w-full bg-[#111111] border-b border-[#d4af37]/40 py-3.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4 shrink-0 group">
              <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
                <svg viewBox="0 0 320 200" className="h-[82px] w-[176px] sm:h-[100px] sm:w-[220px]" aria-label="Lộc Nam logo" role="img">
                  <defs>
                    <linearGradient id="locNamBadgeGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F5E7B4" />
                      <stop offset="45%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#9B6D17" />
                    </linearGradient>
                  </defs>
                  <g transform="translate(0 5)">
                    <circle cx="90" cy="95" r="72" fill="none" stroke="url(#locNamBadgeGold)" strokeWidth="6" />
                    <circle cx="90" cy="95" r="58" fill="url(#locNamBadgeGold)" opacity="0.96" />
                    <g fill="none" stroke="#FFF9EE" strokeLinecap="round" strokeWidth="4">
                      <path d="M90 32 L90 64" />
                      <path d="M90 126 L90 158" />
                      <path d="M32 95 L64 95" />
                      <path d="M116 95 L148 95" />
                      <path d="M48 48 L68 68" />
                      <path d="M132 48 L112 68" />
                      <path d="M132 142 L112 122" />
                      <path d="M48 142 L68 122" />
                    </g>
                    <g fill="#FFF9EE" opacity="0.95">
                      <circle cx="90" cy="95" r="10" />
                      <circle cx="90" cy="48" r="6" />
                      <circle cx="90" cy="142" r="6" />
                      <circle cx="44" cy="95" r="6" />
                      <circle cx="136" cy="95" r="6" />
                      <circle cx="60" cy="60" r="5" />
                      <circle cx="120" cy="60" r="5" />
                      <circle cx="60" cy="130" r="5" />
                      <circle cx="120" cy="130" r="5" />
                    </g>
                    <path d="M165 145 C185 130, 220 90, 230 58" fill="none" stroke="url(#locNamBadgeGold)" strokeWidth="8" strokeLinecap="round" />
                    <path d="M149 143 L202 61" fill="none" stroke="url(#locNamBadgeGold)" strokeWidth="8" strokeLinecap="round" />
                    <rect x="161" y="94" width="40" height="24" rx="8" fill="#111111" opacity="0.9" />
                    <text x="181" y="112" textAnchor="middle" fontSize="18" fontWeight="700" fontFamily="Georgia, 'Times New Roman', serif" fill="#E9C86A">LG</text>
                  </g>
                </svg>
              </div>
            </Link>

            {/* Big Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm đỉnh đồng, tượng Phật, đồ thờ cúng, trống đồng..."
                className="w-full py-2.5 pl-4 pr-12 bg-[#171717] border-2 border-[#d4af37]/55 focus:border-[#f1d27c] rounded-sm text-xs sm:text-sm text-[#f7f0dd] focus:outline-none placeholder:text-stone-400 shadow-inner"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="absolute right-1 top-1 bottom-1 px-4 bg-[#d4af37] hover:bg-[#e7c76d] text-[#120d08] rounded-sm flex items-center justify-center transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Hotline & CTA */}
            <div className="flex items-center gap-4 shrink-0">
              <a
                href={`tel:${cleanPhone}`}
                className="hidden lg:flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center text-[#f1d27c] group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] text-[#d9c8a3] uppercase font-bold block">Tư vấn trực tiếp 24/7</span>
                  <span className="font-serif font-bold text-sm sm:text-base text-[#f1d27c] group-hover:underline">
                    {hotline}
                  </span>
                </div>
              </a>

              <button
                onClick={() => setModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#d4af37] hover:bg-[#e7c76d] text-[#120d08] text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>BÁO GIÁ XƯỞNG</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                className="md:hidden p-2 text-[#f5e7b4]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Navigation Bar */}
        <nav className="hidden md:block w-full bg-[#0d0d0f] border-t border-b border-[#d4af37]/40 text-white shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center">
              {mainCategories.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={`px-4 py-3.5 text-xs lg:text-[13px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all duration-200 ${
                        isActive
                          ? "bg-[#1a1a1d] text-[#f1d27c] border-b-2 border-[#d4af37]"
                          : "text-[#f7f0dd]/90 hover:bg-[#17171a] hover:text-[#f1d27c]"
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.subitems && (
                        <ChevronDown className="w-3 h-3 text-[#d4af37] group-hover:rotate-180 transition-transform" />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {item.subitems && (
                      <div className="absolute top-full left-0 w-64 bg-[#111111] border-2 border-[#d4af37]/60 shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.subitems.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2.5 text-xs font-semibold text-[#f7f0dd] hover:bg-[#1a1a1d] hover:text-[#f1d27c] border-b border-[#d4af37]/20 last:border-0 transition-colors"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Guarantee Tag */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[#f1d27c]">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>Bảo hành trọn đời</span>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#111111] border-b border-[#d4af37]/40 px-6 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
            {/* Search input in mobile */}
            <form onSubmit={handleSearch} className="relative pb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full py-2 pl-3 pr-10 bg-[#171717] border border-[#d4af37]/50 rounded-sm text-xs text-[#f7f0dd]"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-[#f1d27c]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {mainCategories.map((item) => (
              <div key={item.name} className="border-b border-[#d4af37]/20 pb-2">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-xs font-bold tracking-wider uppercase text-[#f7f0dd] hover:text-[#f1d27c]"
                >
                  {item.name}
                </Link>
                {item.subitems && (
                  <div className="pl-4 space-y-1 mt-1">
                    {item.subitems.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 text-[11px] text-[#d9c8a3] hover:text-[#f1d27c]"
                      >
                        • {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2">
              <a
                href={`tel:${cleanPhone}`}
                className="w-full py-2.5 bg-[#d4af37] text-[#120d08] text-xs font-bold uppercase rounded-sm text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 fill-[#120d08]" />
                <span>Gọi Hotline: {hotline}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
