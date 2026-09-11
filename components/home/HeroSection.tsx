"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ConsultationModal } from "./ConsultationModal";

export function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#1A120D] text-white min-h-[500px] lg:min-h-[560px] flex items-center border-b border-[#3D2C1E]">
        {/* Ambient Dark Atmospheric Background Overlay */}
        <div className="absolute inset-0 z-0 flex">
          {/* Left: Artisan pouring molten metal */}
          <div className="w-1/2 h-full relative overflow-hidden hidden sm:block">
            <img
              src="/images/artisan-foundry.jpg"
              alt="Nghệ nhân đúc đồng Lộc Nam rót khuôn"
              className="w-full h-full object-cover object-left filter brightness-[0.75] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A120D]/60 to-[#1A120D]"></div>
          </div>

          {/* Right: Seated bronze statue with antique temple backdrop */}
          <div className="w-full sm:w-1/2 h-full relative overflow-hidden">
            <img
              src="/images/statue-hero.jpg"
              alt="Tượng đồng tinh xảo Đúc Đồng Lộc Nam"
              className="w-full h-full object-cover object-right filter brightness-[0.8] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1A120D]/60 to-[#1A120D]"></div>
          </div>
        </div>

        {/* Dark Vignette Overlay for Crisp Readability */}
        <div className="absolute inset-0 bg-[#160E08]/40 pointer-events-none z-10"></div>

        {/* Center Typography & Action Buttons */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-8 text-center py-16 sm:py-20 space-y-6">
          <div className="space-y-2">
            <h1 className="font-serif font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-[0.15em] uppercase leading-tight drop-shadow-md">
              TINH HOA <br />
              <span className="text-[#FDF9F0] tracking-[0.18em]">ĐÚC ĐỒNG VIỆT</span>
            </h1>

            <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#E6D5C3] max-w-xl mx-auto tracking-wide pt-1">
              Chế tác trực tiếp tại xưởng – Gìn giữ giá trị truyền đời
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/san-pham"
              className="px-8 py-3 bg-[#7B1E2B] hover:bg-[#611722] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.15em] rounded-[3px] shadow-lg transition-all hover:scale-105"
            >
              XEM SẢN PHẨM
            </Link>

            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3 bg-black/40 hover:bg-black/70 border border-white/40 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.15em] rounded-[3px] shadow-lg backdrop-blur-sm transition-all hover:scale-105"
            >
              NHẬN TƯ VẤN
            </button>
          </div>
        </div>
      </section>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}