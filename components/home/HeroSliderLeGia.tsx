"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export function HeroSliderLeGia() {
  const slides = [
    {
      image: "/images/trong-dong-viet-nam.jpg",
      title: "TRỐNG ĐỒNG ĐÔNG SƠN",
      subtitle: "BÁU VẬT NGÀN NĂM – TỰ HÀO VĂN HÓA VIỆT",
      desc: "Chế tác thủ công nguyên bản, chuẩn kích thước Lỗ Ban, dát vàng 24K đỉnh cao.",
      link: "/san-pham/qua-tang-dong",
      badge: "KIỆT TÁC QUỐC GIA",
    },
    {
      image: "/images/do-tho-dong.jpg",
      title: "ĐỒ THỜ ĐỒNG CAO CẤP",
      subtitle: "TRANG NGHIÊM KHÔNG GIAN THỜ GIA TIÊN",
      desc: "Bộ ngũ sự khảm ngũ sắc, đỉnh đồng thất lân, hạc thờ chầu – Bảo hành độ bền trọn đời.",
      link: "/san-pham/do-tho-cung",
      badge: "ĐỒ THỜ GIA TIÊN",
    },
    {
      image: "/images/tuong-dong-le-gia.jpg",
      title: "TƯỢNG ĐỒNG MỸ NGHỆ",
      subtitle: "THẦN THÁI UY NGHIÊM – DIỆN MẠO TRANG TRỌNG",
      desc: "Tượng Phật đại bi, tượng Bác Hồ, danh nhân lịch sử & đúc tượng chân dung theo yêu cầu.",
      link: "/san-pham/tuong-dong",
      badge: "ĐÚC TƯỢNG NGHỆ THUẬT",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-white border-b-2 border-[#D4AF37]">
      {/* Slides Container */}
      <div className="relative aspect-[21/9] sm:aspect-[21/8] lg:aspect-[24/9] min-h-[360px] max-h-[580px] w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image with Dark Vignette Gradient */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#21130B]/90 via-[#21130B]/60 to-transparent"></div>

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
                <div className="max-w-2xl space-y-3 sm:space-y-4 text-white">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7B1E2B] text-white text-[11px] font-bold uppercase tracking-wider rounded-sm shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A876]" />
                    <span>{slide.badge}</span>
                  </span>

                  <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F3E9D2] tracking-wide leading-tight uppercase">
                    {slide.title}
                  </h1>

                  <p className="text-xs sm:text-base font-medium text-[#E6D5C3] leading-relaxed">
                    {slide.subtitle} — {slide.desc}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] hover:bg-[#2a2a3e] text-[#D4AF37] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-sm transition-all shadow-lg hover:scale-105 border border-[#D4AF37]"
                    >
                      <span>KHÁM PHÁ BỘ SƯU TẬP</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/lien-he"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF6ED]/95 hover:bg-white text-[#3A2418] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-sm transition-all shadow-lg border border-[#8B6B38]"
                    >
                      <span>BÁO GIÁ TRỰC TIẾP</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#7B1E2B] text-white flex items-center justify-center transition-colors border border-white/20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#7B1E2B] text-white flex items-center justify-center transition-colors border border-white/20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-8 bg-[#C5A876]" : "w-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
