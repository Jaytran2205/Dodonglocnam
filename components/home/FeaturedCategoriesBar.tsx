import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FeaturedCategoriesBar() {
  const cards = [
    {
      title: "TƯỢNG ĐỒNG",
      subtitle: "Tượng danh nhân, tượng Phật, tượng phong thủy",
      href: "/san-pham/tuong-dong",
      image: "/images/tuong-dong.jpg",
    },
    {
      title: "ĐỒ THỜ CÚNG",
      subtitle: "Bộ ngũ sự, đỉnh đồng, đồ thờ truyền thống",
      href: "/san-pham/do-tho-cung",
      image: "/images/do-tho-cung.jpg",
    },
    {
      title: "QUÀ TẶNG ĐỒNG",
      subtitle: "Quà tặng cao cấp, quà biếu, vật phẩm lưu niệm",
      href: "/san-pham/qua-tang-dong",
      image: "/images/qua-tang-dong.jpg",
    },
  ];

  return (
    <section className="w-full bg-[#FAF6ED] py-12 lg:py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Title with Traditional Bronze Ornament */}
      <div className="flex items-center justify-center gap-4 mb-10 text-[#8B6B38]">
        {/* Left flourish */}
        <div className="hidden sm:flex items-center gap-2 text-[#8B6B38]">
          <span className="w-12 h-[1px] bg-[#C5A876]"></span>
          <span className="text-sm">⚜️</span>
        </div>

        <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1a1a1a] tracking-[0.15em] uppercase text-center">
          SẢN PHẨM NỔI BẬT
        </h2>

        {/* Right flourish */}
        <div className="hidden sm:flex items-center gap-2 text-[#8B6B38]">
          <span className="text-sm">⚜️</span>
          <span className="w-12 h-[1px] bg-[#C5A876]"></span>
        </div>
      </div>

      {/* 3 Large Horizontal Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {cards.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className="group relative bg-[#F4EDE0] border border-[#DFCFA] rounded-md p-6 sm:p-7 flex items-center justify-between overflow-hidden shadow-sm hover:shadow-md hover:border-[#8B6B38] transition-all duration-300 hover:-translate-y-1"
          >
            {/* Left Content */}
            <div className="z-10 max-w-[55%] space-y-2">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#3A2418] tracking-wider uppercase group-hover:text-[#7B1E2B] transition-colors">
                {card.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#6B5342] leading-relaxed line-clamp-2">
                {card.subtitle}
              </p>
              <div className="pt-2">
                <span className="w-8 h-8 rounded-full bg-[#B3874B] text-white flex items-center justify-center shadow-sm group-hover:bg-[#7B1E2B] group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Right Cutout Image Frame */}
            <div className="w-[45%] h-36 sm:h-40 relative flex items-center justify-end">
              <img
                src={card.image}
                alt={card.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}