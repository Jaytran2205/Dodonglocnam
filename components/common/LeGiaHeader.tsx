"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, ChevronDown, ChevronRight, Search, Menu, X, Phone, MessageCircle, Sparkles } from "lucide-react";

export function LeGiaHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [mobileGiftsOpen, setMobileGiftsOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState("tranh-dong");

  const quickSearchKeywords = [
    { label: "Đồ thờ cúng bằng đồng", href: "/san-pham/do-tho-cung" },
    { label: "Đúc đồng chân dung", href: "/san-pham/tuong-dong" },
    { label: "Tượng Trần Quốc Tuấn", href: "/san-pham/tuong-dong/tuong-tran-quoc-tuan-catut-81cm" },
    { label: "Tượng Bác Hồ", href: "/san-pham/tuong-dong/tuong-bac-ho-ngoi-ghe-may-dat-vang-90cm" },
    { label: "Trống đồng Đông Sơn", href: "/san-pham/qua-tang-dong/qua-trong-dong-dong-son-duc-thu-cong-60cm" },
    { label: "Tranh Vinh Hoa Phú Quý", href: "/san-pham/qua-tang-dong/tranh-dong-vinh-hoa-phu-quy-ma-vang-2m3" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/san-pham?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const productCategories = [
    {
      id: "thuyen-buom",
      name: "MÔ HÌNH THUYỀN BUỒM",
      image: "/images/trong-dong-phong-thuy-le-gia.jpg",
      subitems: [
        { name: "THUYỀN BUỒM MẠ VÀNG", href: "/san-pham/qua-tang-dong" },
        { name: "THUYỀN BUỒM PHONG THỦY", href: "/san-pham/qua-tang-dong" },
        { name: "THUYỀN BUỒM TẶNG ĐỐI TÁC", href: "/san-pham/qua-tang-dong" },
        { name: "THUYỀN BUỒM CỠ LỚN", href: "/san-pham/qua-tang-dong" },
      ],
    },
    {
      id: "tranh-dong",
      name: "TRANH DÁT VÀNG",
      image: "/images/tranh-dong-my-nghe1.jpg",
      subitems: [
        { name: "TRANH CHỮ PHÚC LỘC THỌ", href: "/san-pham/qua-tang-dong" },
        { name: "TRANH THUẬN BUỒM XUÔI GIÓ", href: "/san-pham/qua-tang-dong" },
        { name: "TRANH BÁT MÃ", href: "/san-pham/qua-tang-dong" },
        { name: "TRANH HOA SEN", href: "/san-pham/qua-tang-dong" },
        { name: "TRANH VĂN HÓA VIỆT", href: "/san-pham/qua-tang-dong" },
      ],
    },
    {
      id: "tuong-dong",
      name: "TƯỢNG PHONG THỦY",
      image: "/images/tuong-dong-le-gia.jpg",
      subitems: [
        { name: "TƯỢNG RỒNG", href: "/san-pham/tuong-dong" },
        { name: "TƯỢNG MÈO TÀI LỘC", href: "/san-pham/tuong-dong" },
        { name: "TƯỢNG BÁC HỒ", href: "/san-pham/tuong-dong" },
        { name: "TƯỢNG DANH NHÂN", href: "/san-pham/tuong-dong" },
        { name: "TƯỢNG 12 CON GIÁP", href: "/san-pham/tuong-dong" },
      ],
    },
    {
      id: "do-tho",
      name: "CÂY HOA PHONG THỦY",
      image: "/images/do-tho-le-gia.jpg",
      subitems: [
        { name: "CÂY SƠN THUỶ", href: "/san-pham/do-tho-cung" },
        { name: "CÂY LAN", href: "/san-pham/do-tho-cung" },
        { name: "CÂY KIM NGÂN", href: "/san-pham/do-tho-cung" },
        { name: "HOA SEN", href: "/san-pham/do-tho-cung" },
        { name: "PHONG THỦY NỘI THẤT", href: "/san-pham/do-tho-cung" },
      ],
    },
    {
      id: "qua-tang-doanh-nghiep",
      name: "QUÀ TẶNG DOANH NGHIỆP",
      image: "/images/cup-golf-le-gia.jpg",
      subitems: [
        { name: "QUÀ TẶNG LỄ KHỞI CÔNG", href: "/san-pham/qua-tang-dong" },
        { name: "QUÀ TẶNG TẾT", href: "/san-pham/qua-tang-dong" },
        { name: "QUÀ TẶNG VIP", href: "/san-pham/qua-tang-dong" },
        { name: "QUÀ TẶNG SỰ KIỆN", href: "/san-pham/qua-tang-dong" },
      ],
    },
    {
      id: "custom-gift",
      name: "QUÀ TẶNG THEO YÊU CẦU",
      image: "/images/thiet-ke-thi-cong-tu-duong.jpg",
      subitems: [
        { name: "THIẾT KẾ THEO LOGO", href: "/san-pham/duc-chuong-cong-trinh" },
        { name: "TẶNG CÁ NHÂN HÓA", href: "/san-pham/duc-chuong-cong-trinh" },
        { name: "QUÀ TẶNG SỰ KIỆN CÁ NHÂN", href: "/san-pham/duc-chuong-cong-trinh" },
        { name: "PHỤ KIỆN TẶNG KÈM", href: "/san-pham/duc-chuong-cong-trinh" },
      ],
    },
  ];

  const currentCategory = productCategories.find(c => c.id === activeCategoryTab) || productCategories[1];

  const giftItems = [
    { name: "QUÀ TẶNG KỶ NIỆM THÀNH LẬP CÔNG TY", href: "/san-pham/qua-tang-dong" },
    { name: "QUÀ TẶNG SINH NHẬT CÔNG TY", href: "/san-pham/qua-tang-dong" },
    { name: "QUÀ TẶNG TẾT DOANH NGHIỆP", href: "/san-pham/qua-tang-dong" },
    { name: "QUÀ KHAI TRƯƠNG CÔNG TY", href: "/san-pham/qua-tang-dong" },
    { name: "QUÀ TẶNG SẾP", href: "/san-pham/qua-tang-dong" },
    { name: "QUÀ TẶNG SỰ KIỆN CHO DOANH NGHIỆP", href: "/san-pham/qua-tang-dong" },
    { name: "QUÀ TẶNG ĐỐI TÁC", href: "/san-pham/qua-tang-dong" },
    { name: "QUÀ TẶNG THEO YÊU CẦU", href: "/san-pham/qua-tang-dong" },
  ];

  const collectionItems = [
    { name: "BỘ SƯU TẬP TRỐNG ĐỒNG", href: "/san-pham/qua-tang-dong" },
    { name: "BỘ SƯU TẬP TRANH ĐỒNG", href: "/san-pham/qua-tang-dong" },
    { name: "BỘ SƯU TẬP QUÀ TẶNG", href: "/san-pham/qua-tang-dong" },
    { name: "BỘ SƯU TẬP TƯỢNG ĐỒNG", href: "/san-pham/tuong-dong" },
    { name: "BỘ SƯU TẬP ĐỒ THỜ", href: "/san-pham/do-tho-cung" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-[#2B080E] border-b-2 border-[#D4AF37] shadow-xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[68px] relative">
          
          {/* Left Navigation */}
          <nav className="hidden xl:flex items-center gap-6 text-white font-bold text-[13px] tracking-wide">
            <Link
              href="/"
              className="p-1 text-white hover:text-[#FFD700] hover:scale-110 transition-all duration-200 flex items-center"
              title="Trang chủ"
            >
              <Home className="w-4 h-4 text-white hover:text-[#FFD700]" />
            </Link>

            <Link
              href="/gioi-thieu"
              className="hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all duration-200 uppercase whitespace-nowrap"
            >
              GIỚI THIỆU
            </Link>

            {/* MEGA MENU: QUÀ TẶNG ▼ */}
            <div className="relative group py-5">
              <Link
                href="/san-pham"
                className="text-[#FFD700] hover:text-[#FFE57F] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all duration-200 flex items-center gap-1 uppercase whitespace-nowrap font-bold"
              >
                <span>QUÀ TẶNG</span>
                <span className="text-[10px] text-[#FFD700] ml-0.5">▼</span>
              </Link>

              {/* Mega Menu Popup Container */}
              <div className="absolute top-full left-0 w-[920px] bg-[#33080F] border-2 border-[#FFD700] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 grid grid-cols-12 overflow-hidden rounded-b-lg">
                
                {/* Column 1: Left Categories List (4 cols) */}
                <div className="col-span-3 bg-[#26050B] py-3.5 border-r border-[#FFD700]/40">
                  {productCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onMouseEnter={() => setActiveCategoryTab(cat.id)}
                      className={`flex items-center justify-between px-4 py-2.5 text-xs font-bold uppercase cursor-pointer transition-colors ${
                        activeCategoryTab === cat.id
                          ? "text-[#FFD700] bg-[#3D0A12] border-l-4 border-[#FFD700]"
                          : "text-[#F3E9D2]/85 hover:text-[#FFD700] hover:bg-[#3D0A12]/60"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#FFD700] text-[10px]">❯</span>
                        <span>{cat.name}</span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Column 2: Middle Sub-items List (5 cols) */}
                <div className="col-span-5 bg-[#33080F] py-3.5 px-6 border-r border-[#FFD700]/40 max-h-[440px] overflow-y-auto">
                  <div className="space-y-2.5">
                    {currentCategory.subitems.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={sub.href}
                        className="block text-xs font-bold text-[#F3E9D2] hover:text-[#FFD700] uppercase tracking-wide transition-all py-0.5"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 3: Right Image Card (4 cols) */}
                <div className="col-span-4 bg-[#33080F] p-4 flex flex-col items-center justify-center relative">
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative border border-[#FFD700]/50 bg-[#26050B] p-2 flex items-center justify-center shadow">
                    <img
                      src={currentCategory.image}
                      alt={currentCategory.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mt-2.5 text-center">
                    <h4 className="font-serif font-extrabold text-sm text-[#FFD700] tracking-wider uppercase drop-shadow">
                      {currentCategory.name}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* DROPDOWN: QUÀ TẶNG DOANH NGHIỆP ▼ */}
            <div className="relative group py-5">
              <Link
                href="/san-pham/qua-tang-dong"
                className="hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all duration-200 flex items-center gap-1 uppercase whitespace-nowrap"
              >
                <span>QUÀ TẶNG DOANH NGHIỆP</span>
                <span className="text-[10px] text-white group-hover:text-[#FFD700] ml-0.5">▼</span>
              </Link>

              <div className="absolute top-full left-0 w-72 bg-[#33080F] border-2 border-[#FFD700] shadow-2xl py-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-b-lg">
                {giftItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#F3E9D2]/90 hover:text-[#FFD700] hover:bg-[#26050B] uppercase transition-colors"
                  >
                    <span className="text-[#FFD700] text-[10px]">❯</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/tin-tuc"
              className="hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all duration-200 uppercase whitespace-nowrap"
            >
              KIẾN THỨC ĐỒ ĐỒNG
            </Link>
          </nav>

          {/* Center Logo - KHUNG TRÒN VƯƠN XUỐNG DƯỚI CHUẨN MẪU */}
          <Link
            href="/"
            className="flex items-center justify-center shrink-0 px-2 sm:px-4 group z-30 transform translate-y-3 sm:translate-y-4"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center border-2 border-[#FFD700] shadow-[0_4px_25px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform bg-white p-1.5">
              <img
                src="/images/logo.png"
                alt="Logo Đồ Đồng Lộc Nam"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Right Navigation */}
          <nav className="hidden xl:flex items-center gap-6 text-white font-bold text-[13px] tracking-wide">
            <Link
              href="/tin-tuc"
              className="hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all duration-200 uppercase whitespace-nowrap"
            >
              BẠN CÓ BIẾT
            </Link>

            {/* DROPDOWN: BỘ SƯU TẬP ▼ */}
            <div className="relative group py-5">
              <Link
                href="/san-pham"
                className="hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all duration-200 flex items-center gap-1 uppercase whitespace-nowrap"
              >
                <span>BỘ SƯU TẬP</span>
                <span className="text-[10px] text-white group-hover:text-[#FFD700] ml-0.5">▼</span>
              </Link>

              <div className="absolute top-full left-0 w-72 bg-[#33080F] border-2 border-[#FFD700] shadow-2xl py-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-b-lg">
                {collectionItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#F3E9D2]/90 hover:text-[#FFD700] hover:bg-[#26050B] uppercase transition-colors"
                  >
                    <span className="text-[#FFD700] text-[10px]">❯</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/#video-section"
              className="hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all duration-200 uppercase whitespace-nowrap"
            >
              VIDEO SẢN PHẨM
            </Link>

            <div className="relative group py-5">
              <Link
                href="/lien-he"
                className="hover:text-[#FFD700] hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all duration-200 flex items-center gap-1 uppercase whitespace-nowrap"
              >
                <span>HỖ TRỢ ĐẶT HÀNG</span>
                <span className="text-[10px] text-white group-hover:text-[#FFD700] ml-0.5">▼</span>
              </Link>
              <div className="absolute top-full right-0 w-60 bg-[#33080F] border-2 border-[#FFD700] shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-b-lg">
                <Link href="/chinh-sach-kiem-hang" className="block px-4 py-2 text-xs font-bold text-[#F3E9D2] hover:bg-[#26050B] hover:text-[#FFD700]">
                  • Hướng Dẫn Mua Hàng
                </Link>
                <Link href="/chinh-sach-bao-mat" className="block px-4 py-2 text-xs font-bold text-[#F3E9D2] hover:bg-[#26050B] hover:text-[#FFD700]">
                  • Chính Sách Bảo Hành
                </Link>
                <Link href="/lien-he" className="block px-4 py-2 text-xs font-bold text-[#F3E9D2] hover:bg-[#26050B] hover:text-[#FFD700]">
                  • Đặt Đúc Theo Yêu Cầu
                </Link>
              </div>
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-[#FFD700] hover:scale-105 transition-all duration-200 uppercase flex items-center gap-1.5 whitespace-nowrap font-bold text-[13px]"
            >
              <Search className="w-4 h-4 text-white hover:text-[#FFD700]" />
              <span>TÌM KIẾM</span>
            </button>
          </nav>

          {/* Mobile buttons: Search & Hamburger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Tìm kiếm"
              className="p-2 text-[#FFD700] hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mở menu"
              className="p-2 text-[#FFD700] hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Interactive Search Modal Dropdown */}
        {searchOpen && (
          <div className="py-4 border-t-2 border-[#D4AF37] bg-[#26050B]/95 backdrop-blur-md rounded-b-xl shadow-2xl animate-in fade-in duration-200">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center gap-2 px-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên sản phẩm: tượng đồng, lư đồng, bát hương, tranh đồng..."
                  className="w-full bg-[#1A0307] border-2 border-[#D4AF37] text-white text-xs sm:text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3C85C] hover:from-[#FFE57F] hover:to-[#FFD700] text-[#26050B] font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-md shrink-0 flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tìm</span>
              </button>
            </form>

            {/* Quick Keyword Links */}
            <div className="max-w-2xl mx-auto mt-3 px-2 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-[#D4AF37] font-bold">Gợi ý tìm nhanh:</span>
              {quickSearchKeywords.map((kw, i) => (
                <Link
                  key={i}
                  href={kw.href}
                  onClick={() => setSearchOpen(false)}
                  className="bg-[#3D0A12] hover:bg-[#5C131E] text-[#F3E9D2] hover:text-[#FFD700] px-2.5 py-0.5 rounded border border-[#D4AF37]/40 transition-colors"
                >
                  {kw.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer with Smooth Accordions */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#2B080E] border-t-2 border-[#D4AF37] py-4 px-4 space-y-2 text-[#F3E9D2] font-semibold text-xs rounded-b-xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 px-3 hover:bg-[#4A0E17] rounded-lg border-b border-[#D4AF37]/20"
            >
              <Home className="w-4 h-4 text-[#FFD700]" />
              <span>TRANG CHỦ</span>
            </Link>

            <Link
              href="/gioi-thieu"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 hover:bg-[#4A0E17] rounded-lg border-b border-[#D4AF37]/20"
            >
              GIỚI THIỆU
            </Link>

            {/* Mobile SẢN PHẨM Accordion */}
            <div className="border-b border-[#D4AF37]/20 pb-1">
              <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#4A0E17] rounded-lg text-[#FFD700]">
                <Link href="/san-pham" onClick={() => setMobileMenuOpen(false)} className="font-bold">
                  SẢN PHẨM
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                  className="p-1 hover:text-white"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCategoryOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {mobileCategoryOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-[#1F0408] rounded-lg mb-2">
                  <Link href="/san-pham/do-tho-cung" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[11px] text-[#F3E9D2]/90 hover:text-[#FFD700]">
                    • ĐỒ THỜ BẰNG ĐỒNG
                  </Link>
                  <Link href="/san-pham/tuong-dong" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[11px] text-[#F3E9D2]/90 hover:text-[#FFD700]">
                    • TƯỢNG ĐỒNG & ĐÚC CHÂN DUNG
                  </Link>
                  <Link href="/san-pham/qua-tang-dong" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[11px] text-[#F3E9D2]/90 hover:text-[#FFD700]">
                    • TRANH ĐỒNG & TRỐNG ĐỒNG
                  </Link>
                  <Link href="/san-pham/duc-chuong-cong-trinh" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-[11px] text-[#F3E9D2]/90 hover:text-[#FFD700]">
                    • THI CÔNG TỪ ĐƯỜNG & ĐÚC CHUÔNG
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile QUÀ TẶNG Accordion */}
            <div className="border-b border-[#D4AF37]/20 pb-1">
              <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#4A0E17] rounded-lg">
                <Link href="/san-pham/qua-tang-dong" onClick={() => setMobileMenuOpen(false)}>
                  QUÀ TẶNG DOANH NGHIỆP
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileGiftsOpen(!mobileGiftsOpen)}
                  className="p-1 hover:text-[#FFD700]"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileGiftsOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {mobileGiftsOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-[#1F0408] rounded-lg mb-2">
                  {giftItems.slice(0, 5).map((g, idx) => (
                    <Link key={idx} href={g.href} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[11px] text-[#F3E9D2]/80 hover:text-[#FFD700]">
                      • {g.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile BỘ SƯU TẬP Accordion */}
            <div className="border-b border-[#D4AF37]/20 pb-1">
              <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#4A0E17] rounded-lg">
                <Link href="/san-pham" onClick={() => setMobileMenuOpen(false)}>
                  BỘ SƯU TẬP
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                  className="p-1 hover:text-[#FFD700]"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCollectionsOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {mobileCollectionsOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-[#1F0408] rounded-lg mb-2">
                  {collectionItems.map((c, idx) => (
                    <Link key={idx} href={c.href} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[11px] text-[#F3E9D2]/80 hover:text-[#FFD700]">
                      • {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/tin-tuc"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 hover:bg-[#4A0E17] rounded-lg border-b border-[#D4AF37]/20 text-[#FFD700]"
            >
              BẠN CÓ BIẾT & KIẾN THỨC ĐỒ ĐỒNG
            </Link>

            <Link
              href="/#video-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 hover:bg-[#4A0E17] rounded-lg border-b border-[#D4AF37]/20"
            >
              VIDEO SẢN PHẨM
            </Link>

            <Link
              href="/lien-he"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 hover:bg-[#4A0E17] rounded-lg"
            >
              LIÊN HỆ & BÁO GIÁ
            </Link>

            {/* Quick Call Action on Mobile */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href="tel:0846699997"
                className="py-2.5 bg-[#FFD700] text-[#26050B] font-bold text-center rounded-lg flex items-center justify-center gap-1.5 shadow"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Gọi Hotline</span>
              </a>
              <a
                href="https://zalo.me/0846699997"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-[#0068FF] text-white font-bold text-center rounded-lg flex items-center justify-center gap-1.5 shadow"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Zalo</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
