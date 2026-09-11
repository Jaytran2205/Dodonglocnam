import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, Sparkles } from "lucide-react";

export function NewsGuideSection() {
  const articles = [
    {
      title: "Cách bài trí bộ đồ thờ ngũ sự chuẩn phong thủy gia tiên",
      category: "Cẩm Nang Thờ Cúng",
      date: "15/08/2026",
      desc: "Hướng dẫn chi tiết vị trí đặt đỉnh đồng hoa sòi, đôi hạc chầu và đôi chân nến chuẩn theo nguyên tắc Đông bình Tây quả.",
      image: "/images/do-tho-cung.jpg",
      href: "/tin-tuc/cach-bai-tri-bo-ngu-su",
    },
    {
      title: "Ý nghĩa phong thủy của việc trưng bày Quả Trống Đồng Đông Sơn",
      category: "Phong Thủy Mỹ Nghệ",
      date: "10/08/2026",
      desc: "Trống đồng không chỉ là báu vật quốc gia mà còn là vật phẩm tụ khí vượng tài, đem lại uy quyền và sự nghiệp thăng tiến.",
      image: "/images/trong-dong-dong-son.jpg",
      href: "/tin-tuc/y-nghia-trong-dong-dong-son",
    },
    {
      title: "Phân biệt đồng nguyên chất và đồng pha tạp: Bí quyết từ nghệ nhân",
      category: "Kinh Nghiệm Chọn Đồng",
      date: "02/08/2026",
      desc: "Nghệ nhân Dương Bá Tiến chia sẻ cách thử tiếng chuông, kiểm tra trọng lượng và sắc màu đồng đỏ, đồng catut nguyên bản.",
      image: "/images/artisan-foundry.jpg",
      href: "/tin-tuc/phan-biet-dong-nguyen-chat",
    },
  ];

  return (
    <section className="w-full bg-[#FAF6ED] py-12 lg:py-16 px-4 sm:px-8 border-t border-[#E5DAC3]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#8B6B38] text-xs uppercase tracking-wider font-semibold mb-1">
              <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
              <span>Kiến Thức & Cẩm Nang</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] uppercase tracking-wide">
              CẨM NANG PHONG THỦY & TIN TỨC
            </h2>
          </div>

          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#7B1E2B] hover:text-[#611722] border border-[#8B6B38]/60 bg-[#F4EDE0] hover:bg-[#EAE0CF] px-4 py-2 rounded-sm transition-colors shadow-sm"
          >
            <span>Xem Tất Cả Bài Viết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F4EDE0] border border-[#E5DAC3] rounded-sm overflow-hidden hover-lift flex flex-col justify-between shadow-sm hover:border-[#8B6B38] transition-all duration-300 group"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-[#FAF6ED] relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-[#7B1E2B] text-white text-[10px] font-bold uppercase rounded-sm">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8B6B38] font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#3A2418] group-hover:text-[#7B1E2B] line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#6B5342] line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#E5DAC3]/50 mt-auto">
                <span className="text-xs font-bold uppercase text-[#7B1E2B] group-hover:text-[#611722] flex items-center gap-1 pt-3">
                  <span>Đọc Chi Tiết</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
