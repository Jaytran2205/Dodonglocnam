"use client";

import React from "react";
import Link from "next/link";
import { projectsData } from "@/data/projects";
import { MapPin, Calendar, ArrowRight, Award, Building2, Sparkles } from "lucide-react";

export function LocNamProjectsSection() {
  if (!projectsData || projectsData.length === 0) return null;

  // Set "Chùa Đồng Yên Tử" project as the #1 biggest featured project per user request
  const mainProject =
    projectsData.find((p) => p.id === "chua-dong-yen-tu") || projectsData[0];

  // 3 prominent companion projects on the right
  const sideProjects = projectsData
    .filter((p) => p.id !== mainProject.id)
    .slice(0, 3);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#fbf9f5] via-white to-[#fbf9f5] border-t border-[#e2d5bd]/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#e2d5bd]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f5ebd7] border border-[#dfb755]/50 rounded-full text-[11px] font-serif font-bold text-[#8c6508] uppercase tracking-widest mb-2.5">
              <Award className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>HỒ SƠ NĂNG LỰC & CÔNG TRÌNH THỰC TẾ</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0c1825] uppercase tracking-wide">
              DỰ ÁN & CÔNG TRÌNH TIÊU BIỂU
            </h2>
            <p className="text-xs sm:text-sm text-[#4b5563] mt-1 max-w-2xl leading-relaxed">
              Khẳng định vị thế và uy tín thương hiệu Đồ Đồng Lộc Nam (Ý Yên, Nam Định) qua các công trình cấp Quốc gia, sự kiện trọng đại và quà tặng ngoại giao cao cấp.
            </p>
          </div>

          <Link
            href="/du-an"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c1825] hover:bg-[#b8860b] text-[#ffd700] hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md group shrink-0"
          >
            <span>Xem tất cả dự án</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Asymmetrical Layout: 1 Big Hero Card (Left) + 3 Compact Vertical Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
          {/* LEFT: 1 BIG FEATURED PROJECT (col-span-12 lg:col-span-7) */}
          <article className="lg:col-span-7 bg-white rounded-2xl overflow-hidden border-2 border-[#d4af37]/70 shadow-lg hover:shadow-2xl hover:border-[#b8860b] transition-all duration-500 flex flex-col group">
            {/* Big Hero Image */}
            <Link
              href={`/du-an/${mainProject.slug}`}
              className="relative aspect-[16/10] sm:aspect-[16/10] overflow-hidden bg-[#0c1825] block group/img"
            >
              <img
                src={mainProject.image}
                alt={mainProject.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0c1825] text-xs font-black rounded-lg shadow-md uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  SỰ KIỆN NỔI BẬT NHẤT
                </span>
                <span className="px-2.5 py-1 bg-[#0c1825]/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg border border-white/20">
                  {mainProject.category}
                </span>
              </div>

              {mainProject.gallery && mainProject.gallery.length > 0 && (
                <span className="absolute bottom-3.5 right-3.5 px-3 py-1 bg-black/80 backdrop-blur-sm text-[#ffd700] text-xs font-bold rounded-lg border border-[#dfb755]/50 shadow-md">
                  {mainProject.gallery.length} hình ảnh thực tế
                </span>
              )}
            </Link>

            {/* Content Info */}
            <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-3.5">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7280] mb-2.5">
                  <span className="flex items-center gap-1.5 font-bold text-[#8c6508] bg-[#f5ebd7] px-2.5 py-1 rounded-md">
                    <Calendar className="w-3.5 h-3.5 text-[#b8860b]" />
                    {mainProject.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-[#4b5563]">
                    <MapPin className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                    {mainProject.location}
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-black text-[#0c1825] group-hover:text-[#b8860b] transition-colors leading-snug mb-2.5">
                  <Link href={`/du-an/${mainProject.slug}`}>
                    {mainProject.title}
                  </Link>
                </h3>

                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed line-clamp-3">
                  {mainProject.desc}
                </p>
              </div>

              <div className="pt-3.5 border-t border-[#f1e8d9] flex items-center justify-between">
                <div className="text-xs text-[#8c6508] font-bold flex items-center gap-1.5 line-clamp-1">
                  <Building2 className="w-4 h-4 text-[#b8860b] shrink-0" />
                  <span className="truncate">{mainProject.client}</span>
                </div>
                <Link
                  href={`/du-an/${mainProject.slug}`}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#b8860b] hover:text-[#8c6508] shrink-0 group-hover:translate-x-1 transition-all"
                >
                  <span>Xem chi tiết dự án</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* RIGHT: 3 COMPACT VERTICAL CARDS (col-span-12 lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {sideProjects.map((project) => (
              <article
                key={project.id}
                className="group bg-white rounded-xl overflow-hidden border border-[#e2d5bd] hover:border-[#b8860b] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-stretch p-3 gap-3.5"
              >
                {/* Thumbnail Left */}
                <Link
                  href={`/du-an/${project.slug}`}
                  className="relative w-full sm:w-36 lg:w-32 xl:w-36 aspect-[16/11] sm:aspect-auto sm:h-auto rounded-lg overflow-hidden bg-[#0c1825] shrink-0 block"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
                  <span className="absolute bottom-1.5 left-1.5 sm:hidden px-1.5 py-0.5 bg-black/80 text-[#dfb755] text-[9px] font-bold rounded">
                    {project.gallery?.length || 1} ảnh
                  </span>
                </Link>

                {/* Content Right */}
                <div className="flex flex-col justify-between flex-grow min-w-0 space-y-1.5 py-0.5">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#6b7280] mb-1">
                      <span className="flex items-center gap-1 font-medium text-[#b8860b]">
                        <Calendar className="w-3 h-3 text-[#b8860b]" />
                        {project.date}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[120px]">{project.category}</span>
                    </div>

                    <h4 className="font-serif text-sm font-bold text-[#0c1825] group-hover:text-[#b8860b] transition-colors leading-snug line-clamp-2">
                      <Link href={`/du-an/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h4>

                    <p className="text-[11px] text-[#6b7280] line-clamp-2 leading-relaxed mt-1">
                      {project.desc}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#f1e8d9] flex items-center justify-between text-[11px]">
                    <span className="text-[#8c6508] font-medium truncate max-w-[150px]">
                      {project.client}
                    </span>
                    <Link
                      href={`/du-an/${project.slug}`}
                      className="inline-flex items-center gap-0.5 font-bold text-[#b8860b] hover:text-[#8c6508] shrink-0 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Chi tiết</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Big Stylized "Xem Thêm Dự Án" CTA Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/du-an"
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl font-serif text-sm sm:text-base font-bold bg-gradient-to-r from-[#0c1825] via-[#1a2e44] to-[#0c1825] text-[#ffd700] hover:text-white border-2 border-[#dfb755] hover:border-[#ffd700] shadow-[0_8px_25px_rgba(12,24,37,0.3)] hover:shadow-[0_12px_35px_rgba(223,183,85,0.45)] hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            <span>XEM THÊM CÁC DỰ ÁN & CÔNG TRÌNH THỰC TẾ ({projectsData.length})</span>
            <ArrowRight className="w-5 h-5 text-[#dfb755]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
