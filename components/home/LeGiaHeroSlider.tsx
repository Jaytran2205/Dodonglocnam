"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function LeGiaHeroSlider() {
  const [slides, setSlides] = useState([
    {
      image: "/images/tuong-dong-le-gia.jpg",
      title: "QUÀ TẶNG VIP",
      subtitle: "Tinh hoa thủ công tôn vinh giá trị & mục đích của nhân vật nhận quà",
      link: "/san-pham/qua-tang-dong",
    },
    {
      image: "/images/trong-dong-viet-nam.jpg",
      title: "QUÀ TẶNG DOANH NGHIỆP",
      subtitle: "Nâng tầm thương hiệu, gửi gắm niềm tin và tạo dấu ấn lâu dài",
      link: "/san-pham/qua-tang-dong",
    },
    {
      image: "/images/do-tho-dong.jpg",
      title: "QUÀ TẶNG PHONG THỦY",
      subtitle: "Mang may mắn & phúc lộc, tôn vinh và khắc ghi khoảnh khắc quý giá",
      link: "/san-pham/do-tho-cung",
    },
  ]);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          setSlides([
            {
              image: s.banner1_image || "/images/tuong-dong-le-gia.jpg",
              title: s.banner1_title || "QUÀ TẶNG VIP",
              subtitle: s.banner1_subtitle || "Tinh hoa thủ công tôn vinh giá trị & mục đích của nhân vật nhận quà",
              link: s.banner1_link || "/san-pham/qua-tang-dong",
            },
            {
              image: s.banner2_image || "/images/trong-dong-viet-nam.jpg",
              title: s.banner2_title || "QUÀ TẶNG DOANH NGHIỆP",
              subtitle: s.banner2_subtitle || "Nâng tầm thương hiệu, gửi gắm niềm tin và tạo dấu ấn lâu dài",
              link: s.banner2_link || "/san-pham/qua-tang-dong",
            },
            {
              image: s.banner3_image || "/images/do-tho-dong.jpg",
              title: s.banner3_title || "QUÀ TẶNG PHONG THỦY",
              subtitle: s.banner3_subtitle || "Mang may mắn & phúc lộc, tôn vinh và khắc ghi khoảnh khắc quý giá",
              link: s.banner3_link || "/san-pham/do-tho-cung",
            },
          ]);
        }
      })
      .catch((e) => console.error("Error fetching slider banners:", e));
  }, []);

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
    <div className="relative w-full bg-[#0B1320] overflow-hidden">
      {/* Aspect Ratio Container matching banner screenshot */}
      <div className="relative aspect-[21/9] sm:aspect-[21/8] lg:aspect-[24/9] min-h-[380px] max-h-[620px] w-full">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Link href={slide.link} className="block w-full h-full relative cursor-pointer">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />
            </Link>
          </div>
        ))}

        {/* Prev / Next Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-16 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-16 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/10"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
