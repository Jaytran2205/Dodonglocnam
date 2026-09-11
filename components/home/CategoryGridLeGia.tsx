import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CategoryGridLeGia() {
  const collections = [
    {
      title: "TRỐNG ĐỒNG PHONG THỦY",
      desc: "Trống Đông Sơn, mặt trống đúc dát vàng 24K",
      image: "/images/trong-dong-phong-thuy-le-gia.jpg",
      href: "/san-pham/qua-tang-dong",
    },
    {
      title: "TRANH ĐỒNG MỸ NGHỆ",
      desc: "Vinh hoa phú quý, Thuận buồm xuôi gió, Tứ quý",
      image: "/images/tranh-dong-my-nghe1.jpg",
      href: "/san-pham/qua-tang-dong",
    },
    {
      title: "TƯỢNG ĐỒNG MỸ NGHỆ",
      desc: "Tượng Phật, Bác Hồ, Trần Quốc Tuấn, 12 Con giáp",
      image: "/images/tuong-dong-le-gia.jpg",
      href: "/san-pham/tuong-dong",
    },
    {
      title: "ĐỒ THỜ CÚNG GIA TIÊN",
      desc: "Bộ tam sự, ngũ sự, đỉnh đồng khảm tam khí, ngũ sắc",
      image: "/images/do-tho-le-gia.jpg",
      href: "/san-pham/do-tho-cung",
    },
    {
      title: "QUÀ TẶNG DOANH NGHIỆP",
      desc: "Quà biếu sếp, đối tác ngoại giao, cúp sự kiện mạ vàng",
      image: "/images/qua-tang-cong-ty-doanh-nghiep.jpg",
      href: "/san-pham/qua-tang-dong",
    },
    {
      title: "THI CÔNG TỪ ĐƯỜNG & CHÙA",
      desc: "Đúc đại hồng chung, chuông đồng, không gian nhà thờ họ",
      image: "/images/thiet-ke-thi-cong-tu-duong.jpg",
      href: "/san-pham/duc-chuong-cong-trinh",
    },
  ];

  return (
    <section className="w-full bg-[#FAF6ED] py-12 lg:py-16 px-4 sm:px-8 border-b border-[#E5DAC3]">
      <div className="max-w-7xl mx-auto">
        {/* Title Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-[#8B6B38] text-xs uppercase tracking-wider font-semibold">
            <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
            <span>Danh Mục Tiêu Biểu</span>
            <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] uppercase tracking-wide">
            BỘ SƯU TẬP KIỆT TÁC ĐỒ ĐỒNG
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5342] max-w-xl mx-auto">
            Khám phá các dòng sản phẩm đồng nguyên chất được đúc thủ công tinh xảo bởi nghệ nhân Lộc Nam
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group relative overflow-hidden rounded-sm border-2 border-[#8B6B38]/40 hover:border-[#7B1E2B] bg-[#3A2418] transition-all duration-300 shadow-md hover:-translate-y-1 block"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21130B] via-[#21130B]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
              </div>

              {/* Text overlay bottom */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#F3E9D2] group-hover:text-white tracking-wide uppercase transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#C5A876] mt-0.5 font-medium line-clamp-1">
                    {item.desc}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#7B1E2B] group-hover:bg-[#611722] text-white flex items-center justify-center shrink-0 ml-3 shadow-md group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
