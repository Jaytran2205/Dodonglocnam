"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface BannerSlide {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  active?: boolean;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: "banner-he-thong-showroom",
    title: "HỆ THỐNG 1 XƯỞNG SẢN XUẤT & 3 CỬA HÀNG TRƯNG BÀY",
    subtitle: "Đúc Đồng Gia Truyền Dương Bá Tiến - Hà Nội, Nam Định, Ninh Bình",
    image: "/images/banners/banner_he_thong_showroom_xuong_v3.webp",
    link: "/gioi-thieu",
    active: true,
  },
  {
    id: "banner-thiet-ke-thi-cong",
    title: "THIẾT KẾ - ĐÚC - THI CÔNG CÁC CÔNG TRÌNH TRÊN TOÀN QUỐC",
    subtitle: "Hotline: 0836 122 222 - 0846 699 997 | Đúc Đồng Lộc Nam",
    image: "/images/banners/banner_thiet_ke_thi_cong_toan_quoc_v3.webp",
    link: "/du-an",
    active: true,
  },
  {
    id: "3",
    title: "THIẾT KẾ CHẾ TÁC QUÀ TẶNG THEO YÊU CẦU - KIẾN TẠO DẤU ẤN THƯƠNG HIỆU",
    subtitle: "Quà Tặng Doanh Nghiệp, Hội Nghị, Cúp Vinh Danh, Thuyền Buồm Mạ Vàng",
    image: "/images/banners/banner_che_tac_qua_tang.jpg",
    link: "/san-pham/qua-tang-dong",
    active: true,
  },
  {
    id: "4",
    title: "NHẬN DÁT VÀNG 9999 - THI CÔNG DỰ ÁN TRÊN TOÀN QUỐC",
    subtitle: "Dát Vàng Tượng Phật, Đồ Thờ Cúng, Nội Thất Biệt Thự & Lâu Đài",
    image: "/images/banners/banner_dat_vang_thi_cong.jpg",
    link: "/san-pham/do-tho-cung",
    active: true,
  },
  {
    id: "2",
    title: "THIẾT KẾ - ĐÚC - THI CÔNG TƯỢNG ĐÀI VÀ CÔNG TRÌNH TÂM LINH",
    subtitle: "Đúc Tượng Phật, Tượng Danh Nhân, Tượng Anh Hùng Dân Tộc",
    image: "/images/banners/banner_duc_tuong_dai.jpg",
    link: "/san-pham/tuong-dong",
    active: true,
  },
];

export function HomeHeroSlider() {
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoplayDelay, setAutoplayDelay] = useState(5000);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Load custom settings from API
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          // Parse slides if saved in settings
          if (s.home_slider_banners) {
            try {
              const parsed = JSON.parse(s.home_slider_banners);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const activeOnes = parsed.filter(
                  (item: BannerSlide) => item.active !== false && item.image
                );
                if (activeOnes.length > 0) {
                  setSlides(activeOnes);
                }
              }
            } catch (err) {
              console.error("Parse home_slider_banners error:", err);
            }
          }

          if (s.home_slider_autoplay) {
            const delay = parseInt(s.home_slider_autoplay, 10);
            if (!isNaN(delay) && delay >= 2000) {
              setAutoplayDelay(delay);
            }
          }
        }
      })
      .catch((e) => console.error("Error loading slider settings:", e));
  }, []);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);


  // Autoplay timer
  useEffect(() => {
    if (isPaused || totalSlides <= 1 || autoplayDelay <= 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused, totalSlides, autoplayDelay]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 50;
      if (diff > minSwipeDistance) {
        nextSlide();
      } else if (diff < -minSwipeDistance) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  if (totalSlides === 0) return null;

  return (
    <section
      aria-label="Banner nổi bật Đồ Đồng Lộc Nam"
      className="relative w-full aspect-[2.35/1] min-h-[220px] max-h-[calc(100vh-80px)] bg-[#fbf4ea] border-b border-[#e6dbc8] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-Height Slider Viewport Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 scale-100 pointer-events-auto"
                  : "opacity-0 z-0 scale-[1.01] pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <Link
                href={slide.link || "/san-pham"}
                className="block w-full h-full relative group overflow-hidden"
                title={slide.title}
              >
                {/* Main Banner Artwork Image - Full bleed edge-to-edge */}
                <div className="relative w-full h-full flex items-center justify-center p-0">
                  <img
                    src={slide.image}
                    alt={slide.title || "Banner Đồ Đồng Lộc Nam"}
                    className="w-full h-full object-cover object-center relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "low"}
                    decoding={index === 0 ? "sync" : "async"}
                  />
                </div>

                {/* Subtle Hover CTA Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none flex items-end justify-end p-5 sm:p-8">
                  <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#b38728] text-white px-5 py-2 rounded-full text-xs font-serif font-bold uppercase tracking-wider shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </div>
          );
        })}

        {/* Navigation Arrows (Only if more than 1 slide) */}
        {totalSlides > 1 && (
          <>
            {/* Previous Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                prevSlide();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0c1420]/75 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0c1420] border border-[#d4af37]/60 shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm group/btn hover:scale-110 active:scale-95"
              aria-label="Banner trước"
            >
              <ChevronLeft className="w-6 h-6 transform group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                nextSlide();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0c1420]/75 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0c1420] border border-[#d4af37]/60 shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm group/btn hover:scale-110 active:scale-95"
              aria-label="Banner tiếp theo"
            >
              <ChevronRight className="w-6 h-6 transform group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            {/* Slide Index Counter Pill (Top-Right) */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 bg-[#0c1420]/75 backdrop-blur-sm border border-[#d4af37]/50 text-[#f3e5ab] text-xs font-mono font-bold px-3 py-1.5 rounded-full shadow-lg">
              <span>{currentIndex + 1}</span>
              <span className="text-white/50 mx-1.5">/</span>
              <span className="text-white/75">{totalSlides}</span>
            </div>

          </>
        )}
      </div>
    </section>
  );
}
