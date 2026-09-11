import React from "react";
import Link from "next/link";
import { Phone, MapPin, Mail, Play } from "lucide-react";

export function LeGiaFooter() {
  return (
    <footer className="w-full bg-[#1A0307] text-[#F3E9D2] border-t-2 border-[#D4AF37]">
      {/* 1. Big Bronze Gold Hotline Banner on Top */}
      <div className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E5B869] to-[#D4AF37] py-4 px-4 sm:px-8 text-[#26050B] shadow-2xl">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center sm:text-left">
          {/* Hotline 1 */}
          <a
            href="tel:0846699997"
            className="flex flex-col sm:flex-row items-center gap-2 group hover:scale-105 transition-transform"
          >
            <span className="text-xs sm:text-sm font-bold text-[#3D0A12]">Hotline 1</span>
            <span className="font-serif font-extrabold text-xl sm:text-2xl text-[#26050B]">
              0921.30.9779
            </span>
          </a>

          {/* White/Red Center Phone Circle */}
          <div className="w-12 h-12 rounded-full bg-[#3D0A12] text-[#D4AF37] flex items-center justify-center shadow-xl shrink-0 border-2 border-[#D4AF37]">
            <Phone className="w-6 h-6 fill-[#D4AF37]" />
          </div>

          {/* Hotline 2 */}
          <a
            href="tel:0846699997"
            className="flex flex-col sm:flex-row items-center gap-2 group hover:scale-105 transition-transform"
          >
            <span className="text-xs sm:text-sm font-bold text-[#3D0A12]">Hotline 2</span>
            <span className="font-serif font-extrabold text-xl sm:text-2xl text-[#26050B]">
              0846.699.997
            </span>
          </a>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Col 1: Logo, Intro, Socials, Badges (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#D4AF37] p-2 flex items-center justify-center bg-white shadow-[0_0_20px_rgba(212,175,55,0.5)] overflow-hidden">
              <img
                src="/images/logo.png"
                alt="Đồ Đồng Lộc Nam"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-[#F3E9D2]/80 leading-relaxed max-w-md">
              Belux chuyên sản xuất và cung cấp các món quà tặng cao cấp như mô hình thuyền buồm, tranh mạ vàng, tượng phong thủy, cây hoa phong thủy, trống đồng và sản phẩm theo yêu cầu cho doanh nghiệp, đối tác, khách hàng VIP.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#D4AF37] text-[#26050B] flex items-center justify-center hover:bg-white transition-colors shadow"
              >
                <span className="font-bold text-sm">f</span>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#D4AF37] text-[#26050B] flex items-center justify-center hover:bg-white transition-colors shadow"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#D4AF37] text-[#26050B] flex items-center justify-center hover:bg-white transition-colors shadow"
              >
                <span className="font-bold text-xs">d</span>
              </a>
            </div>

            {/* Bộ Công Thương & DMCA Badges */}
            <div className="flex items-center gap-3 pt-2">
              <div className="px-3 py-1.5 bg-[#520E18] text-[#F3E9D2] rounded flex items-center gap-2 border border-[#D4AF37]/50 shadow">
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center text-[10px] font-bold text-[#D4AF37]">✓</div>
                <div>
                  <span className="text-[9px] font-bold block uppercase leading-none text-[#D4AF37]">ĐÃ THÔNG BÁO</span>
                  <span className="text-[8px] text-[#F3E9D2]/80 block uppercase leading-none mt-0.5">BỘ CÔNG THƯƠNG</span>
                </div>
              </div>

              <div className="px-3 py-1.5 bg-[#2B080E] text-[#F3E9D2] rounded border border-[#D4AF37]/50 flex items-center gap-1 text-[10px] font-bold shadow">
                <span className="text-[#D4AF37]">DMCA.com</span>
                <span className="text-[8px] text-[#F3E9D2]/70">COMPLIANT ©</span>
              </div>
            </div>
          </div>

          {/* Col 2: THÔNG TIN LIÊN HỆ (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-[#D4AF37] uppercase tracking-wider">
              THÔNG TIN LIÊN HỆ
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-[#F3E9D2]/80 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Showroom</strong>
                  <span>172 Lê Trọng Tấn, Phường Liệt, Thanh Xuân, Hà Nội</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Hotline 1</strong>
                  <a href="tel:0846699997" className="hover:text-[#D4AF37] transition-colors">
                    0921.30.9779
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Hotline 2</strong>
                  <a href="tel:0846699997" className="hover:text-[#D4AF37] transition-colors">
                    0846.699.997
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Email</strong>
                  <a href="mailto:sales@dodonglocnam.com" className="hover:text-[#D4AF37] transition-colors">
                    sales@dodonglocnam.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: HỖ TRỢ KHÁCH HÀNG (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-[#D4AF37] uppercase tracking-wider">
              HỖ TRỢ KHÁCH HÀNG
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#F3E9D2]/80">
              {[
                { name: "Chính sách kiểm hàng", href: "/chinh-sach-kiem-hang" },
                { name: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
                { name: "Hướng dẫn đặt hàng- thanh toán", href: "/huong-dan-thanh-toan" },
                { name: "Chính sách đổi trả", href: "/chinh-sach-doi-tra" },
                { name: "Chính sách vận chuyển", href: "/chinh-sach-van-chuyen" },
                { name: "Liên hệ", href: "/lien-he" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
                >
                  <span className="text-[#D4AF37] text-[10px]">▶</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-[#D4AF37]/20 text-center text-xs text-[#F3E9D2]/50">
          © 2026 Đồ Đồng Lộc Nam. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
