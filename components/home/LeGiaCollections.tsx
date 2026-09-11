import React from "react";
import Link from "next/link";

export function LeGiaCollections() {
  const items = [
    {
      title: "QUÀ TẶNG VIP & LÃNH ĐẠO",
      image: "/images/trong-dong-phong-thuy-le-gia.jpg",
      href: "/san-pham/qua-tang-dong",
    },
    {
      title: "QUÀ TẶNG MẠ VÀNG CAO CẤP",
      image: "/images/tranh-dong-my-nghe1.jpg",
      href: "/san-pham/qua-tang-dong",
    },
    {
      title: "QUÀ TẶNG PHONG THỦY",
      image: "/images/tuong-dong-le-gia.jpg",
      href: "/san-pham/tuong-dong",
    },
    {
      title: "QUÀ TẶNG SỰ KIỆN & HỘI NGHỊ",
      image: "/images/do-tho-le-gia.jpg",
      href: "/san-pham/do-tho-cung",
    },
    {
      title: "QUÀ TẶNG DOANH NGHIỆP",
      image: "/images/cup-golf-le-gia.jpg",
      href: "/san-pham/qua-tang-dong",
    },
    {
      title: "QUÀ TẶNG THEO YÊU CẦU",
      image: "/images/thiet-ke-thi-cong-tu-duong.jpg",
      href: "/san-pham/duc-chuong-cong-trinh",
    },
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-12 px-4 sm:px-6 border-b-2 border-[#D4AF37]/30">
      <div className="max-w-[1240px] mx-auto">
        {/* Title matching screenshot */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#D4AF37] tracking-wider uppercase drop-shadow">
            ĐỒ ĐỒNG LỘC NAM
          </h2>
          {/* Gold flourish graphic */}
          <div className="flex items-center justify-center gap-3 mt-2.5">
            <div className="w-14 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <div className="w-5 h-5 border-2 border-[#D4AF37] rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#D4AF37]"></div>
            </div>
            <div className="w-14 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>
        </div>

        {/* 6 Cards Grid matching screenshot - SIZE TRUNG BÌNH */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group relative overflow-hidden rounded-xl border-2 border-[#D4AF37] hover:border-[#F3C85C] bg-[#F7EBD4] transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(212,175,55,0.35)] block p-2.5"
            >
              {/* Image with dark rich backdrop matching screenshot */}
              <div className="aspect-[4/3] overflow-hidden rounded-lg relative flex items-center justify-center bg-[#0d1b2a] border border-[#D4AF37]/50 p-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Label Bottom on Cream Background */}
              <div className="pt-2.5 pb-0.5 px-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-[#1a1a1a] group-hover:text-[#D4AF37] tracking-wide uppercase text-left transition-colors font-sans">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
