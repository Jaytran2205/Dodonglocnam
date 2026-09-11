"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Factory,
  Store,
  Navigation,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function LocNamPartners() {
  const [settings, setSettings] = useState<any>({
    factory_name: "Xưởng Sản Xuất Đúc Đồng Gia Truyền",
    factory_address: "829C+CJ5, Ý Yên, Ninh Bình, Việt Nam",
    factory_hotline: "0846 699 997",
    factory_map_url: "https://maps.app.goo.gl/5rQAVSTNhDzQtMebA",
    factory_image: "/images/xuong_duc.jpg",
    factory_desc: "Xưởng đúc quy mô lớn hơn 2.000m² với lò đúc thủ công truyền thống và đội ngũ hơn 30 nghệ nhân đúc tượng đồng, đồ thờ ngũ sự và đúc Đại Hồng Chung bậc nhất Việt Nam.",

    cs1_name: "Showroom 1 - Cơ Sở Chính Nam Định",
    cs1_address: "Đường 57A - Thị trấn Lâm - Ý Yên - Nam Định",
    cs1_hotline: "0846.699.997",
    cs1_map_url: "https://maps.google.com/?q=Đường+57A,+Thị+trấn+Lâm,+Ý+Yên,+Nam+Định",
    cs1_image: "/images/showroom_1.jpg",
    cs1_desc: "Showroom chính 4 tầng bề thế trưng bày hàng nghìn bộ đồ thờ đồng cát tút ngũ sự, tượng đồng chân dung truyền thần, đỉnh đồng khảm ngũ sắc và các tác phẩm đúc đồng độc bản.",

    cs2_name: "Showroom 2 - KCN Ý Yên Ninh Bình",
    cs2_address: "Khu Công Nghiệp - Ý Yên - Ninh Bình",
    cs2_hotline: "0846 699 997",
    cs2_map_url: "https://maps.app.goo.gl/JkVaZ9c9g4jGfoyH7",
    cs2_image: "/images/showroom_2.jpg",
    cs2_desc: "Tòa nhà trung tâm trưng bày quy mô lớn hiện đại: tượng Phật cỡ lớn, trống đồng Đông Sơn đúc dày dặn, tranh đồng dát vàng 24k và đồ đồng mỹ nghệ hoàng gia.",

    cs3_name: "Showroom 3 - Thủ Đô Hà Nội",
    cs3_address: "164A4 Nguyễn Cảnh Dị - Hoàng Mai - Hà Nội",
    cs3_hotline: "0846 699 997",
    cs3_map_url: "https://maps.google.com/?q=164A4+Nguyễn+Cảnh+Dị,+Định+Công,+Hoàng+Mai,+Hà+Nội",
    cs3_image: "/images/showroom_3.jpg",
    cs3_desc: "Trung tâm quà tặng mạ vàng 24k, mô hình thuyền buồm phong thủy 'Thuận Buồm Xuôi Gió', tranh dát vàng và quà biếu đối tác doanh nghiệp, ngoại giao cao cấp.",
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev: any) => ({ ...prev, ...data.settings }));
        }
      })
      .catch((err) => console.error("Error loading branch settings:", err));
  }, []);

  const branches = [
    {
      id: "foundry",
      tag: "XƯỞNG SẢN XUẤT",
      tagColor: "bg-amber-600 text-white",
      icon: Factory,
      name: settings.factory_name || "Xưởng Sản Xuất Đúc Đồng Gia Truyền",
      address: settings.factory_address || "829C+CJ5, Ý Yên, Ninh Bình, Việt Nam",
      hotline: settings.factory_hotline || "0846 699 997",
      cleanPhone: (settings.factory_hotline || "0846699997").replace(/\D/g, ""),
      mapUrl: settings.factory_map_url || "https://maps.app.goo.gl/5rQAVSTNhDzQtMebA",
      image: settings.factory_image || "/images/xuong_duc.jpg",
      desc: settings.factory_desc || "Xưởng đúc quy mô lớn hơn 2.000m² với lò đúc thủ công truyền thống và đội ngũ hơn 30 nghệ nhân đúc tượng đồng, đồ thờ ngũ sự và đúc Đại Hồng Chung bậc nhất Việt Nam.",
      highlight: "Nấu đồng & rót khuôn thủ công",
      objectPos: "object-center",
    },
    {
      id: "cs1",
      tag: "SHOWROOM 1",
      tagColor: "bg-[#b8860b] text-white",
      icon: Store,
      name: settings.cs1_name || "Showroom 1 - Cơ Sở Chính Nam Định",
      address: settings.cs1_address || "Đường 57A - Thị trấn Lâm - Ý Yên - Nam Định",
      hotline: settings.cs1_hotline || "0846.699.997",
      cleanPhone: (settings.cs1_hotline || "0846699997").replace(/\D/g, ""),
      mapUrl: settings.cs1_map_url || "https://maps.google.com/?q=Đường+57A,+Thị+trấn+Lâm,+Ý+Yên,+Nam+Định",
      image: settings.cs1_image || "/images/showroom_1.jpg",
      desc: settings.cs1_desc || "Showroom chính 4 tầng bề thế trưng bày hàng nghìn bộ đồ thờ đồng cát tút ngũ sự, tượng đồng chân dung truyền thần, đỉnh đồng khảm ngũ sắc và các tác phẩm đúc đồng độc bản.",
      highlight: "Trưng bày cơ sở chính",
      objectPos: "object-center",
    },
    {
      id: "cs2",
      tag: "SHOWROOM 2",
      tagColor: "bg-[#b8860b] text-white",
      icon: Store,
      name: settings.cs2_name || "Showroom 2 - KCN Ý Yên Ninh Bình",
      address: settings.cs2_address || "Khu Công Nghiệp - Ý Yên - Ninh Bình",
      hotline: settings.cs2_hotline || "0846 699 997",
      cleanPhone: (settings.cs2_hotline || "0846699997").replace(/\D/g, ""),
      mapUrl: settings.cs2_map_url || "https://maps.app.goo.gl/JkVaZ9c9g4jGfoyH7",
      image: settings.cs2_image || "/images/showroom_2.jpg",
      desc: settings.cs2_desc || "Tòa nhà trung tâm trưng bày quy mô lớn hiện đại: tượng Phật cỡ lớn, trống đồng Đông Sơn đúc dày dặn, tranh đồng dát vàng 24k và đồ đồng mỹ nghệ hoàng gia.",
      highlight: "Tòa nhà kính cong hiện đại",
      objectPos: "object-center",
    },
    {
      id: "cs3",
      tag: "SHOWROOM 3",
      tagColor: "bg-[#b8860b] text-white",
      icon: Store,
      name: settings.cs3_name || "Showroom 3 - Thủ Đô Hà Nội",
      address: settings.cs3_address || "164A4 Nguyễn Cảnh Dị - Hoàng Mai - Hà Nội",
      hotline: settings.cs3_hotline || "0846 699 997",
      cleanPhone: (settings.cs3_hotline || "0846699997").replace(/\D/g, ""),
      mapUrl: settings.cs3_map_url || "https://maps.google.com/?q=164A4+Nguyễn+Cảnh+Dị,+Định+Công,+Hoàng+Mai,+Hà+Nội",
      image: settings.cs3_image || "/images/showroom_3.jpg",
      desc: settings.cs3_desc || "Trung tâm quà tặng mạ vàng 24k, mô hình thuyền buồm phong thủy 'Thuận Buồm Xuôi Gió', tranh dát vàng và quà biếu đối tác doanh nghiệp, ngoại giao cao cấp.",
      highlight: "Quà tặng mạ vàng thủ đô",
      objectPos: "object-center",
    },
  ];

  // Auto-slide loop every 5 seconds
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % branches.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, branches.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + branches.length) % branches.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % branches.length);
  };

  const current = branches[currentIndex];

  return (
    <section className="bg-[#faf8f5] py-10 sm:py-16 px-3 sm:px-6 lg:px-8 border-b border-[#e8dfd1] overflow-hidden">
      <div className="max-w-[1440px] mx-auto space-y-5 sm:space-y-6">
        {/* Section Header with Responsive Flex */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="text-[#996515] font-serif text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#b8860b] flex-shrink-0" />
              <span>HỆ THỐNG CỬA HÀNG & XƯỞNG ĐÚC GIA TRUYỀN</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#111c2a] tracking-wide uppercase leading-tight">
              HỆ THỐNG CƠ SỞ ĐỒ ĐỒNG LỘC NAM
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] font-light max-w-2xl">
              Hệ thống 3 Showroom lớn & 1 Xưởng đúc truyền thống – Trình chiếu tự động, bấm chọn để xem chi tiết.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrev}
              aria-label="Cơ sở trước"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-[#d8cdbc] hover:border-[#b8860b] text-[#111c2a] hover:text-[#b8860b] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#996515] px-1">
              0{currentIndex + 1} / 0{branches.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Cơ sở tiếp theo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-[#d8cdbc] hover:border-[#b8860b] text-[#111c2a] hover:text-[#b8860b] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 touch-manipulation"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RESPONSIVE GRAND SHOWROOM BANNER (SMARTPHONE OPTIMIZED)                    */}
        {/* ========================================================================= */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d8cdbc] shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch lg:h-[460px]">
            {/* Image Column: On mobile, displayed first for visual engagement */}
            <div className="order-1 lg:order-2 lg:col-span-7 h-[210px] sm:h-[290px] md:h-[340px] lg:h-full relative overflow-hidden bg-[#e8dfd1]/30">
              <img
                key={current.id}
                src={current.image}
                alt={current.name}
                className={`w-full h-full object-cover ${current.objectPos || "object-center"} transition-all duration-700 animate-fadeIn`}
              />

              {/* Direct Google Map badge */}
              <a
                href={current.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 px-2.5 sm:px-3 py-1.5 rounded-lg bg-black/75 hover:bg-black/90 text-white text-[11px] sm:text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm shadow-md transition-transform active:scale-95"
              >
                <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffd700]" />
                <span>Xem Google Maps</span>
              </a>
            </div>

            {/* Information Column: Perfectly spaced and readable on mobile */}
            <div className="order-2 lg:order-1 lg:col-span-5 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-4 text-left relative z-10 bg-[#ffffff] border-t lg:border-t-0 lg:border-r border-[#e8dfd1]">
              <div className="space-y-2.5 sm:space-y-3.5">
                {/* Badge tags */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className={`px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold tracking-wider ${current.tagColor} shadow-sm uppercase`}>
                    {current.tag}
                  </span>
                  <span className="px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-[#f5efe4] text-[#8c6014] border border-[#e2d5bd]">
                    {current.highlight}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-serif text-base sm:text-xl lg:text-2xl font-bold text-[#111c2a] leading-snug">
                  {current.name}
                </h3>

                {/* Address & Hotline Box */}
                <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#e8dfd1] space-y-1.5">
                  <div className="flex items-start gap-2 text-xs text-[#334155] leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-[#b8860b] flex-shrink-0 mt-0.5" />
                    <span>{current.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#111c2a] pt-1.5 border-t border-[#ede4d5]">
                    <Phone className="w-3.5 h-3.5 text-[#b8860b] flex-shrink-0" />
                    <span className="text-[#64748b] font-normal">Hotline:</span>
                    <a
                      href={`tel:${current.cleanPhone}`}
                      className="text-[#996515] hover:text-[#7d500c] hover:underline font-serif text-sm font-bold tracking-wide"
                    >
                      {current.hotline}
                    </a>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#475569] font-normal leading-relaxed line-clamp-3 sm:line-clamp-4">
                  {current.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 sm:pt-2 grid grid-cols-2 gap-2 sm:gap-3">
                <a
                  href={`tel:${current.cleanPhone}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#111c2a] hover:bg-[#1e2f42] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 text-center touch-manipulation min-h-[42px]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#dfb755]" />
                  <span>Gọi Ngay</span>
                </a>

                <a
                  href={current.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#b8860b] hover:bg-[#a07408] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 text-center touch-manipulation min-h-[42px]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Chỉ Đường</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Tabs with Clean Thumbnails & Titles (Responsive 2x2 Grid / 4 Col) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-[#e8dfd1] bg-[#f8f5ef]">
            {branches.map((b, idx) => {
              const isSelected = currentIndex === idx;
              return (
                <button
                  key={b.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`p-2.5 sm:p-3.5 text-left transition-all duration-200 flex items-center gap-2 sm:gap-3 border-r border-b sm:border-b-0 border-[#e8dfd1] last:border-r-0 touch-manipulation min-h-[48px] ${
                    isSelected
                      ? "bg-white text-[#111c2a] border-b-2 sm:border-b-2 border-b-[#b8860b] shadow-sm font-semibold"
                      : "text-[#64748b] hover:text-[#111c2a] hover:bg-[#f1ebe0]"
                  }`}
                >
                  {/* Mini Photo Thumbnail */}
                  <div className="w-8 h-7 sm:w-10 sm:h-8 rounded overflow-hidden bg-[#e8dfd1] flex-shrink-0 border border-[#d8cdbc]">
                    <img
                      src={b.image}
                      alt={b.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <div className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate ${
                      isSelected ? "text-[#996515]" : "text-[#786a55]"
                    }`}>
                      {b.tag}
                    </div>
                    <div className="text-[11px] sm:text-xs truncate">
                      {b.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
