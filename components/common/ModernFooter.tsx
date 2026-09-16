"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Mail,
  Navigation,
  Facebook,
  Youtube,
  MessageCircle,
  Clock,
  ShieldCheck,
  Award,
  ExternalLink,
} from "lucide-react";

export function ModernFooter() {
  const [settings, setSettings] = useState<any>({
    hotline: "0836 122 222",
    hotline2: "0846 699 997",
    email: "dodonglocnam1102@gmail.com",
    facebook_url: "https://facebook.com/dodonglocnam",
    youtube_url: "https://youtube.com/@xuongducdonglocnamyyennamdinh",
    zalo: "0846699997",
    footer_about:
      "Xưởng đúc đồng Lộc Nam chuyên đúc tượng chân dung truyền thần, đồ thờ cúng gia tiên, quà tặng mạ vàng 24k, mô hình thuyền buồm phong thủy và trống đồng Đông Sơn cao cấp.",

    factory_name: "Xưởng Sản Xuất Đúc Đồng",
    factory_address: "829C+CJ5, Ý Yên, Ninh Bình, Việt Nam",
    factory_map_url: "https://maps.app.goo.gl/5rQAVSTNhDzQtMebA",

    cs1_name: "Showroom 1 - Cơ Sở Chính",
    cs1_address: "Đường 57A - Thị trấn Lâm - Ý Yên - Nam Định",
    cs1_map_url: "https://maps.google.com/?q=Đường+57A,+Thị+trấn+Lâm,+Ý+Yên,+Nam+Định",

    cs2_name: "Showroom 2 - KCN Ý Yên",
    cs2_address: "Khu Công Nghiệp - Ý Yên - Ninh Bình",
    cs2_map_url: "https://maps.app.goo.gl/JkVaZ9c9g4jGfoyH7",

    cs3_name: "Showroom 3 - Hà Nội",
    cs3_address: "164A4 Nguyễn Cảnh Dị - Hoàng Mai - Hà Nội",
    cs3_map_url: "https://maps.google.com/?q=164A4+Nguyễn+Cảnh+Dị,+Định+Công,+Hoàng+Mai,+Hà+Nội",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev: any) => ({ ...prev, ...data.settings }));
        }
      })
      .catch((err) => console.error("Error loading footer settings:", err));
  }, []);

  const cleanPhone1 = (settings.hotline || settings.hotline1 || "0836 122 222").replace(/\D/g, "");
  const cleanPhone2 = (settings.hotline2 || "0846 699 997").replace(/\D/g, "");

  const branchesList = [
    {
      name: settings.factory_name || "Xưởng Sản Xuất Đúc Đồng",
      address: settings.factory_address || "829C+CJ5, Ý Yên, Ninh Bình, Việt Nam",
      mapUrl: settings.factory_map_url || "https://maps.app.goo.gl/5rQAVSTNhDzQtMebA",
    },
    {
      name: settings.cs1_name || "Showroom 1 - Cơ Sở Chính",
      address: settings.cs1_address || "Đường 57A - Thị trấn Lâm - Ý Yên - Nam Định",
      mapUrl: settings.cs1_map_url || "https://maps.google.com/?q=Đường+57A,+Thị+trấn+Lâm,+Ý+Yên,+Nam+Định",
    },
    {
      name: settings.cs2_name || "Showroom 2 - KCN Ý Yên",
      address: settings.cs2_address || "Khu Công Nghiệp - Ý Yên - Ninh Bình",
      mapUrl: settings.cs2_map_url || "https://maps.app.goo.gl/JkVaZ9c9g4jGfoyH7",
    },
    {
      name: settings.cs3_name || "Showroom 3 - Hà Nội",
      address: settings.cs3_address || "164A4 Nguyễn Cảnh Dị - Hoàng Mai - Hà Nội",
      mapUrl: settings.cs3_map_url || "https://maps.google.com/?q=164A4+Nguyễn+Cảnh+Dị,+Định+Công,+Hoàng+Mai,+Hà+Nội",
    },
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-[#08121e] to-[#040910] text-[#cbd5e1] border-t border-[#1c2c3d] pb-20 lg:pb-0">
      {/* Top Value Banner */}
      <div className="border-b border-[#1c2c3d] bg-[#0b1622]/60 py-4 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#dfb755] font-semibold">
              <Award className="w-4 h-4" />
              <span>Nghệ nhân đúc đồng bàn tay vàng</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#dfb755] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Bảo hành trọn đời phôi đồng</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#dfb755] font-semibold">
              <Clock className="w-4 h-4" />
              <span>Mở cửa: 08:00 - 21:00 (Tất cả các ngày)</span>
            </span>
          </div>

          {/* Social Icons Strip */}
          <div className="flex items-center gap-2">
            <span className="text-[#94a3b8] text-[11px] font-medium hidden sm:inline">Kết nối:</span>
            {/* Facebook Button */}
            <a
              href={settings.facebook_url || "https://facebook.com/dodonglocnam"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Fanpage"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2]/20 hover:bg-[#1877F2] text-[#e2e8f0] hover:text-white border border-[#1877F2]/40 transition-all text-xs font-semibold shadow-sm"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
              <span>Facebook</span>
            </a>

            {/* Zalo Button */}
            <a
              href={`https://zalo.me/${settings.zalo || "0846699997"}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat Zalo"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0068FF]/20 hover:bg-[#0068FF] text-[#e2e8f0] hover:text-white border border-[#0068FF]/40 transition-all text-xs font-semibold shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Zalo</span>
            </a>

            {/* YouTube Button */}
            <a
              href={settings.youtube_url || "https://youtube.com/dodonglocnam"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Channel"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF0000]/20 hover:bg-[#FF0000] text-[#e2e8f0] hover:text-white border border-[#FF0000]/40 transition-all text-xs font-semibold shadow-sm"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Logo & Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 flex items-center justify-center p-1 rounded-md bg-[#122234] border border-[#c59b4e]/40">
                <img
                  src="/images/logo.png"
                  alt="Đồ Đồng Lộc Nam"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <div className="font-serif text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-[#fce9b5] via-[#ffd700] to-[#dfb755] bg-clip-text text-transparent">
                  ĐỒ ĐỒNG LỘC NAM
                </div>
                <div className="text-xs text-[#cbd5e1] font-medium tracking-wide mt-0.5">
                  Quà tặng tinh hoa - Nâng tầm giá trị
                </div>
              </div>
            </Link>

            <p className="text-xs text-[#94a3b8] leading-relaxed max-w-sm">
              {settings.footer_about ||
                "Xưởng đúc đồng Lộc Nam chuyên đúc tượng chân dung truyền thần, đồ thờ cúng gia tiên, quà tặng mạ vàng 24k, mô hình thuyền buồm phong thủy và trống đồng Đông Sơn cao cấp."}
            </p>

            {/* Hotline Call Box */}
            <div className="p-3.5 rounded-xl bg-[#0c1825] border border-[#d4af37]/40 space-y-2 shadow-inner">
              <div className="text-[11px] text-[#cbd5e1] font-semibold uppercase tracking-wider">
                Tư vấn & Đặt hàng 24/7:
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#dfb755] animate-pulse shrink-0" />
                  <span className="text-xs text-[#94a3b8] font-medium">Hotline 1:</span>
                  <a
                    href={`tel:${cleanPhone1}`}
                    className="text-base font-serif font-black text-[#ffd700] hover:underline tracking-wider"
                  >
                    {settings.hotline || "0836 122 222"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#dfb755] animate-pulse shrink-0" />
                  <span className="text-xs text-[#94a3b8] font-medium">Hotline 2:</span>
                  <a
                    href={`tel:${cleanPhone2}`}
                    className="text-base font-serif font-black text-[#ffd700] hover:underline tracking-wider"
                  >
                    {settings.hotline2 || "0846 699 997"}
                  </a>
                </div>
              </div>
              <div className="text-[10px] text-[#94a3b8] pt-1 border-t border-[#1c2c3d]">
                Email: {settings.email || "dodonglocnam1102@gmail.com"}
              </div>
            </div>
          </div>

          {/* Col 2: Hệ thống 4 Cơ Sở - Click vào thẻ là mở Google Maps ngay */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#1c2c3d] pb-2">
              <h3 className="font-serif text-xs sm:text-sm font-bold text-[#dfb755] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>HỆ THỐNG CƠ SỞ & XƯỞNG ĐÚC (BẤM ĐỂ XEM BẢN ĐỒ)</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {branchesList.map((branch, idx) => (
                <a
                  key={idx}
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Mở Google Maps ${branch.name}`}
                  className="block p-3 rounded-xl bg-[#0b1622] hover:bg-[#122234] border border-[#1c2c3d] hover:border-[#dfb755] transition-all duration-300 group shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#f1f5f9] group-hover:text-[#ffd700] transition-colors flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#dfb755] group-hover:scale-125 transition-transform"></span>
                      <span>{branch.name}</span>
                    </span>
                    <Navigation className="w-4 h-4 text-[#dfb755] group-hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                  <p className="text-xs text-[#94a3b8] group-hover:text-[#cbd5e1] pl-4.5 pt-1 leading-relaxed transition-colors">
                    {branch.address}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Danh mục & Chính sách */}
          <div className="md:col-span-3 space-y-3.5">
            <h3 className="font-serif text-xs sm:text-sm font-bold text-[#dfb755] uppercase tracking-wider border-b border-[#1c2c3d] pb-2">
              DANH MỤC NỔI BẬT
            </h3>

            <div className="space-y-2 text-xs text-[#94a3b8]">
              {[
                { name: "1. Đồ thờ cúng bằng đồng", href: "/san-pham/do-tho-cung" },
                { name: "2. Tượng đồng & tượng chân dung", href: "/san-pham/tuong-dong" },
                { name: "3. Tranh đồng mạ vàng 24k", href: "/san-pham/tranh-dong" },
                { name: "4. Trống đồng Đông Sơn", href: "/san-pham/trong-dong" },
                { name: "Quà tặng sự kiện & phong thủy", href: "/san-pham/qua-tang-dong" },
                { name: "Dự án & công trình thực tế", href: "/#du-an-thuc-te" },
                { name: "Giới thiệu công ty & nghệ nhân", href: "/gioi-thieu" },
                { name: "Dịch vụ & CSKH Lộc Nam", href: "/gioi-thieu#dich-vu" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="block hover:text-[#dfb755] hover:translate-x-1 transition-all py-0.5"
                >
                  › {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-[#1c2c3d] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-[#64748b]">
          <div>
            © 2026 ĐỒ ĐỒNG LỘC NAM - Quà tặng tinh hoa - Nâng tầm giá trị. Tất cả quyền được bảo lưu.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/gioi-thieu" className="hover:text-[#dfb755]">Giới thiệu</Link>
            <span>•</span>
            <Link href="/san-pham" className="hover:text-[#dfb755]">Sản phẩm</Link>
            <span>•</span>
            <Link href="/lien-he" className="hover:text-[#dfb755]">Liên hệ</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-[#dfb755]">Quản trị</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
