"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function LocNamCategories() {
  const collectionCategories = [
    {
      id: "trong-dong",
      title: "TRỐNG ĐỒNG",
      subtitle: "Trống đồng lưu niệm, quà tặng ngoại giao",
      image: "/images/collections/cat_trong_dong.jpg?v=2",
      href: "/san-pham/trong-dong",
    },
    {
      id: "tranh-dong",
      title: "TRANH ĐỒNG CAO CẤP",
      subtitle: "Tranh Thuận Buồm Xuôi Gió mạ vàng 24k",
      image: "/images/collections/cat_tranh_dong.jpg?v=2",
      href: "/san-pham/tranh-dong",
    },
    {
      id: "tuong-dong",
      title: "TƯỢNG ĐỒNG",
      subtitle: "Tượng Phật Bà Quan Âm mạ vàng tòa sen",
      image: "/images/collections/cat_tuong_dong.jpg?v=2",
      href: "/san-pham/tuong-dong",
    },
    {
      id: "do-tho",
      title: "ĐỒ THỜ CÚNG",
      subtitle: "Đỉnh đồng, tam sự, ngũ sự gia truyền",
      image: "/images/collections/cat_do_tho.jpg?v=2",
      href: "/san-pham/do-tho-cung",
    },
    {
      id: "qua-tang",
      title: "QUÀ TẶNG DOANH NGHIỆP",
      subtitle: "Mô hình thuyền buồm mạ vàng, quà tặng đối tác",
      image: "/images/collections/cat_cup_golf.jpg?v=2",
      href: "/san-pham/qua-tang-dong",
    },
    {
      id: "linh-vat-12-con-giap",
      title: "LINH VẬT 12 CON GIÁP",
      subtitle: "Bộ tượng phong thủy, mã thượng phong hầu",
      image: "/images/collections/cat_linh_vat_12_con_giap.jpg?v=2",
      href: "/san-pham/tuong-dong?sub=linh-vat-12-con-giap",
    },
  ];

  return (
    <section className="bg-[#fcfaf6] py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#ece5d8]">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div className="text-left">
            <div className="text-[#a67c2e] font-serif text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#dfb755]" />
              <span>DANH MỤC SẢN PHẨM & CÔNG TRÌNH</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0c1825] tracking-wide uppercase">
              SẢN PHẨM NỔI BẬT
            </h2>
          </div>

          <Link
            href="/san-pham"
            prefetch={true}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-serif font-bold text-[#b8860b] hover:text-[#8c6508] transition-colors uppercase tracking-wider group shrink-0"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Layout (< sm): Individual Split Cards with Spacing & Square Image */}
        <div className="sm:hidden flex flex-col gap-3.5">
          {collectionCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              prefetch={true}
              className="flex items-stretch rounded-2xl overflow-hidden border-2 border-[#1c2e42] hover:border-[#dfb755] bg-[#071322] shadow-lg hover:shadow-[0_8px_24px_rgba(223,183,85,0.2)] transition-all duration-300 active:scale-[0.99] group"
            >
              {/* Left Column (~48%): Bold Gold Title Centered */}
              <div className="w-[48%] flex flex-col items-center justify-center p-3.5 text-center bg-[#071322] border-r border-[#16283d]">
                <h3 className="font-serif text-[13px] xs:text-sm font-black tracking-wider text-[#dfb755] uppercase leading-snug group-hover:text-white transition-colors">
                  {cat.title}
                </h3>
              </div>

              {/* Right Column (~52%): Perfect Square Image */}
              <div className="w-[52%] aspect-square relative overflow-hidden bg-[#06101d]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop Layout (>= sm): 3-Column Luxury Square Cards */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {collectionCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              prefetch={true}
              className="group relative rounded-2xl overflow-hidden bg-[#0c1825] border-2 border-[#1c2e42] hover:border-[#dfb755] shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_14px_36px_rgba(223,183,85,0.3)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between block aspect-square"
            >
              {/* Image Collage with Dark Luxury Background */}
              <div className="w-full h-full relative overflow-hidden bg-[#06101d]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#060c14]/95 via-[#060c14]/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
              </div>

              {/* Title Overlay in Bottom Left Corner */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-black tracking-wider text-[#dfb755] group-hover:text-white uppercase transition-colors drop-shadow-md">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#cbd5e1] font-light mt-0.5 line-clamp-1 opacity-90 group-hover:opacity-100">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#122234] border border-[#dfb755]/60 flex items-center justify-center text-[#dfb755] group-hover:bg-[#dfb755] group-hover:text-[#0c1825] transition-all shrink-0 ml-2 shadow-md group-hover:scale-110">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
