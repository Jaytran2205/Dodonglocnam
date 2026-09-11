import React from "react";
import Link from "next/link";
import { Phone, MapPin, Mail, Home } from "lucide-react";

interface FooterProps {
  hotline?: string;
  address?: string;
}

export function Footer({
  hotline = "0846.699.997",
  address = "Ý Yên, Nam Định",
}: FooterProps) {
  const cleanPhone = hotline.replace(/\./g, "").replace(/\s/g, "");

  return (
    <footer className="w-full bg-[#0d0d0f] border-t border-[#d4af37]/35 text-[#f5e7b4]">
      {/* Gold line */}
      <div className="w-full h-2 bg-gradient-to-r from-[#d4af37] via-[#f1d27c] to-[#d4af37] border-b border-[#d4af37]/40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-[#d4af37] flex items-center justify-center p-1 bg-[#17171a]">
                <div className="w-full h-full rounded-full border border-[#d4af37] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <rect x="7" y="7" width="10" height="10" />
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </div>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#f5e7b4] tracking-wider uppercase">
                ĐÚC ĐỒNG LỘC NAM
              </h3>
            </div>
            <p className="font-serif italic text-xs text-[#f1d27c] font-medium">
              Tinh hoa đúc đồng Việt
            </p>
            <p className="text-xs text-[#d9c8a3] leading-relaxed max-w-sm">
              Chế tác trực tiếp tại xưởng – Gìn giữ giá trị truyền đời
            </p>
          </div>

          {/* Column 2: Về Chúng Tôi */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#f5e7b4] uppercase tracking-wider">
              Về Chúng Tôi
            </h4>
            <ul className="space-y-2 text-xs text-[#d9c8a3]">
              <li>
                <Link href="/gioi-thieu" className="hover:text-[#f1d27c] transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/quy-trinh" className="hover:text-[#f1d27c] transition-colors">
                  Quy trình chế tác
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc" className="hover:text-[#f1d27c] transition-colors">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sản Phẩm */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#f5e7b4] uppercase tracking-wider">
              Sản Phẩm
            </h4>
            <ul className="space-y-2 text-xs text-[#d9c8a3]">
              <li>
                <Link href="/san-pham/tuong-dong" className="hover:text-[#f1d27c] transition-colors">
                  Tượng đồng
                </Link>
              </li>
              <li>
                <Link href="/san-pham/do-tho-cung" className="hover:text-[#f1d27c] transition-colors">
                  Đồ thờ
                </Link>
              </li>
              <li>
                <Link href="/san-pham/qua-tang-dong" className="hover:text-[#f1d27c] transition-colors">
                  Quà tặng đồng
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Hỗ Trợ */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#f5e7b4] uppercase tracking-wider">
              Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-xs text-[#d9c8a3]">
              <li>
                <Link href="/chinh-sach-bao-hanh" className="hover:text-[#f1d27c] transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/huong-dan-mua-hang" className="hover:text-[#f1d27c] transition-colors">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-van-chuyen" className="hover:text-[#f1d27c] transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Liên Hệ */}
          <div className="md:col-span-2 space-y-3 relative">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#f5e7b4] uppercase tracking-wider">
              Liên Hệ
            </h4>
            <ul className="space-y-2 text-xs text-[#d9c8a3]">
              <li className="flex items-start gap-2">
                <Home className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Xưởng đúc đồng Lộc Nam</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-[#f1d27c] font-medium">
                  Hotline: {hotline}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <a href="mailto:dodonglocnam1102@gmail.com" className="hover:text-[#f1d27c] truncate">
                  Email: dodonglocnam1102@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Địa chỉ: {address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="w-full border-t border-[#d4af37]/30 py-4 text-center text-xs text-[#d9c8a3]">
        <p>© {new Date().getFullYear()} ĐÚC ĐỒNG LỘC NAM. BẢO LƯU MỌI BẢN QUYỀN.</p>
      </div>
    </footer>
  );
}