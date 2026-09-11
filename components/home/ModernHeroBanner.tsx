"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Gift } from "lucide-react";

export function ModernHeroBanner() {
  const [data, setData] = useState({
    hero_tagline: "QUÀ TẶNG TINH HOA",
    hero_title1: "NÂNG TẦM",
    hero_title2: "GIÁ TRỊ",
    hero_desc:
      "Chuyên chế tác và cung cấp quà tặng cao cấp, đồ mỹ nghệ trang trí, quà biếu tặng dành cho doanh nghiệp, đối tác và lãnh đạo.",
    hero_image: "/images/hero_golden_ship.jpg",
    hero_btn1_text: "KHÁM PHÁ NGAY",
    hero_btn1_link: "/san-pham",
    hero_btn2_text: "TƯ VẤN QUÀ TẶNG",
    hero_btn2_link: "/lien-he",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.settings) {
          const s = resData.settings;
          setData((prev) => ({
            ...prev,
            hero_tagline: s.hero_tagline || prev.hero_tagline,
            hero_title1: s.hero_title1 || prev.hero_title1,
            hero_title2: s.hero_title2 || prev.hero_title2,
            hero_desc: s.hero_desc || prev.hero_desc,
            hero_image: s.hero_image || prev.hero_image,
            hero_btn1_text: s.hero_btn1_text || prev.hero_btn1_text,
            hero_btn1_link: s.hero_btn1_link || prev.hero_btn1_link,
            hero_btn2_text: s.hero_btn2_text || prev.hero_btn2_text,
            hero_btn2_link: s.hero_btn2_link || prev.hero_btn2_link,
          }));
        }
      })
      .catch((e) => console.error("Error fetching hero settings:", e));
  }, []);

  return (
    <section className="relative w-full bg-[#fbf9f5] border-b border-[#e9e3d5] overflow-hidden py-10 lg:py-16">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#f3e7cf] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-[#f9edd8] rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6">
            {/* Tagline */}
            <div className="inline-block">
              <span className="text-[#a67c2e] font-serif text-xs sm:text-sm tracking-[0.25em] uppercase font-bold">
                {data.hero_tagline}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0c1825] tracking-tight leading-[1.1]">
                {data.hero_title1}
              </h1>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#b38728] via-[#cca347] to-[#966b1a] tracking-tight leading-[1.1]">
                {data.hero_title2}
              </h1>
            </div>

            {/* Description */}
            <p className="text-[#4b5563] text-sm sm:text-base leading-relaxed max-w-lg font-light">
              {data.hero_desc}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={data.hero_btn1_link}
                className="inline-flex items-center gap-1.5 bg-[#bf8f3b] hover:bg-[#a47629] text-white px-7 py-3.5 rounded-md font-serif text-xs sm:text-sm font-bold tracking-wider transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span>{data.hero_btn1_text}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                href={data.hero_btn2_link}
                className="inline-flex items-center gap-2 bg-transparent hover:bg-[#ebdcc3]/40 text-[#694e1d] border border-[#cfad70] px-6 py-3.5 rounded-md font-serif text-xs sm:text-sm font-bold tracking-wider transition-all"
              >
                <span>{data.hero_btn2_text}</span>
                <Gift className="w-4 h-4 text-[#9b6f1e]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Golden Ship Product */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[720px] rounded-2xl overflow-hidden shadow-2xl border border-[#e5d8c3]/80 group">
              <img
                src={data.hero_image}
                alt="Thuyền buồm phong thủy mạ vàng 24k Lộc Nam"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
