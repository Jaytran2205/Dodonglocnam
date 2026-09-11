import React from "react";
import Link from "next/link";
import { ArrowRight, Gift, Award, Briefcase } from "lucide-react";

export function GiftBannersLeGia() {
  const gifts = [
    {
      title: "QUÀ TẶNG DOANH NGHIỆP",
      subtitle: "Khắc logo thương hiệu – Chiết khấu xưởng cao",
      desc: "Trống đồng mini, đĩa đồng lưu niệm, biểu trưng vinh danh sự kiện công ty.",
      image: "/images/qua-tang-cong-ty-doanh-nghiep.jpg",
      href: "/san-pham/qua-tang-dong",
      icon: Briefcase,
    },
    {
      title: "QUÀ BIẾU SẾP & ĐỐI TÁC",
      subtitle: "Mạ vàng 24K sang trọng – Hộp gỗ nhung cao cấp",
      desc: "Tượng phong thủy tụ tài, tranh Mã Đáo Thành Công, Thuận Buồm Xuôi Gió dát vàng.",
      image: "/images/qua-tang-sep-doi-tac.jpg",
      href: "/san-pham/qua-tang-dong",
      icon: Award,
    },
    {
      title: "QUÀ TẶNG SỰ KIỆN NGOẠI GIAO",
      subtitle: "Đậm đà bản sắc Việt – Thiết kế theo yêu cầu",
      desc: "Biểu tượng Khuê Văn Các, Chùa Một Cột, cúp mỹ nghệ đúc đồng nguyên khối.",
      image: "/images/qua-tang-su-kien-hoi-nghi-bang-dong.jpg",
      href: "/san-pham/qua-tang-dong",
      icon: Gift,
    },
  ];

  return (
    <section className="w-full bg-[#F4EDE0] py-12 lg:py-16 px-4 sm:px-8 border-b border-[#E5DAC3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-[#8B6B38] text-xs uppercase tracking-wider font-semibold">
            <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
            <span>Giải Pháp Quà Tặng Đẳng Cấp</span>
            <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] uppercase tracking-wide">
            QUÀ TẶNG ĐỒ ĐỒNG THEO YÊU CẦU
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5342] max-w-xl mx-auto">
            Cung cấp giải pháp quà tặng mỹ nghệ mạ vàng 24K cho hàng ngàn tập đoàn, cơ quan ban ngành và doanh nghiệp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gifts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF6ED] border border-[#E5DAC3] rounded-sm overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#7B1E2B] transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#3A2418] relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#7B1E2B] font-bold text-xs">
                      <Icon className="w-4 h-4" />
                      <span>{item.subtitle}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#3A2418] group-hover:text-[#7B1E2B] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#6B5342] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#E5DAC3]/50 mt-auto">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#7B1E2B] group-hover:text-[#611722] pt-3 transition-colors"
                  >
                    <span>Xem Thêm Mẫu Quà Tặng</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
