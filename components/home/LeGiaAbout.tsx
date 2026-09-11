import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function LeGiaAbout() {
  return (
    <section className="w-full bg-white py-14 px-4 sm:px-8 border-b-2 border-[#D4AF37]/30">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        
        {/* Title */}
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#D4AF37] tracking-widest uppercase">
            VỀ LỘC NAM
          </h2>
          {/* Gold flourish graphic */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <div className="w-6 h-6 border-2 border-[#D4AF37] rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#D4AF37]"></div>
            </div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>
        </div>

        {/* Content Box */}
        <div className="text-left text-[#F3E9D2]/90 text-sm sm:text-[15px] leading-relaxed space-y-5 bg-[#120D0B] p-6 sm:p-8 rounded-xl border border-[#D4AF37]/40 shadow-[0_18px_56px_rgba(0,0,0,0.35)]">
          <p className="text-[#F3E9D2]">
            Lộc Nam chuyên tư vấn và cung cấp những món quà tặng cao cấp, độc quyền dành cho các doanh nghiệp, đối tác, lãnh đạo và những nhân vật quan trọng. Mỗi sản phẩm được chế tác tinh xảo để tôn vinh giá trị của người nhận và tạo dấu ấn lâu dài.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#26050B] flex items-center justify-center shrink-0 mt-1 font-bold text-xs">✓</div>
              <p>
                Chúng tôi chuyên cung cấp quà tặng doanh nghiệp, quà VIP, quà tri ân, quà sự kiện và quà phong thủy theo phong cách <strong className="text-[#D4AF37]">sang trọng, độc quyền và dễ dàng thể hiện thương hiệu.</strong>
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#26050B] flex items-center justify-center shrink-0 mt-1 font-bold text-xs">✓</div>
              <p>
                Từ mô hình thuyền buồm, tranh mạ vàng, tượng phong thủy, cây hoa phong thủy đến trống đồng và sản phẩm theo yêu cầu, tất cả đều được làm bằng bàn tay nghệ nhân, với sự tỉ mỉ và tinh xảo trong từng chi tiết.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#26050B] flex items-center justify-center shrink-0 mt-1 font-bold text-xs">✓</div>
              <p>
                Giải pháp quà tặng Lộc Nam không chỉ đẹp mà còn có ý nghĩa: gửi gắm niềm tin, tôn vinh cá nhân và mang lại giá trị lâu dài cho mỗi mối quan hệ kinh doanh.
              </p>
            </div>
          </div>

          <div className="text-center pt-3 border-t border-[#D4AF37]/30">
            <p className="font-serif font-extrabold text-[#D4AF37] text-base sm:text-xl tracking-wide">
              &ldquo;Lộc Nam – Quà Tặng Cao Cấp, Tôn Vinh Giá Trị Người Nhận&rdquo;
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="pt-2">
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#B89628] text-[#26050B] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all shadow-xl hover:scale-105"
          >
            <span>XEM CHI TIẾT</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
