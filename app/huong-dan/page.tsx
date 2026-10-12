import React from "react";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import Link from "next/link";
import {
  Download,
  ExternalLink,
  Smartphone,
  Sparkles,
  Layers,
  Package,
  ShoppingCart,
  Image as ImageIcon,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
  Phone,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cẩm Nang Hướng Dẫn Quản Trị Website | Đồ Đồng Lộc Nam",
  description: "Tài liệu hướng dẫn chi tiết cách quản lý website Đồ Đồng Lộc Nam: Đăng sản phẩm, sửa giá, đổi banner trang chủ, xử lý đơn hàng và tối ưu SEO.",
  alternates: { canonical: siteUrl("/huong-dan") },
  robots: { index: false, follow: false }, // Private guide for store management
};

export default function PublicGuidePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fcfbf9] text-[#1a1a1a]">
      <ModernHeader />

      <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0a1420] via-[#112234] to-[#0a1420] text-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border-2 border-[#d4af37]/70 shadow-xl space-y-4 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#ffd700] text-[#ffd700] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TÀI LIỆU HƯỚNG DẪN BÀN GIAO NỘI BỘ</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide leading-tight">
            CẨM NANG QUẢN TRỊ NỘI DUNG & VẬN HÀNH WEBSITE
          </h1>

          <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-2xl leading-relaxed font-light">
            Dành riêng cho Chủ xưởng và Ban quản trị Đồ Đồng Lộc Nam (Ý Yên, Nam Định). Hỗ trợ làm chủ 100% các chức năng trên cả máy tính và điện thoại.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="/huong-dan.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#08121e] text-xs sm:text-sm font-extrabold shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Tải file PDF gửi Zalo (700 KB)</span>
            </a>

            <a
              href="/huong-dan.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c1825] border border-[#ffd700]/70 text-[#ffd700] text-xs sm:text-sm font-bold hover:bg-[#152840] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở bản Web giao diện toàn màn hình</span>
            </a>
          </div>
        </div>

        {/* Quick Access Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e5dcce] pb-3">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 uppercase">
              1. Bảng Lối Tắt Các Khu Vực Quản Trị
            </h2>
            <span className="text-xs text-[#785500] font-bold">10 Chương Mục</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Box 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-gray-900">Quản Lý Sản Phẩm</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Thêm mẫu mới, đổi giá bán, chọn bề mặt hoàn thiện (đồng đỏ/cát tút/mạ vàng), tải ảnh góc chụp.
              </p>
              <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs font-bold text-[#b8860b] hover:underline">
                <span>Vào trang Sản phẩm</span> <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-gray-900">Đồng Bộ Danh Mục</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Đổi ảnh đại diện và tên danh mục. Tự động đồng bộ ăn khớp giữa Trang chủ, Menu và Admin.
              </p>
              <Link href="/admin/categories" className="inline-flex items-center gap-1 text-xs font-bold text-[#b8860b] hover:underline">
                <span>Vào trang Danh mục</span> <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-gray-900">Xử Lý Đơn Hàng</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Xem thông tin người mua, bấm gọi điện thoại tư vấn chốt cọc 1 chạm, cập nhật trạng thái đơn hàng.
              </p>
              <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs font-bold text-[#b8860b] hover:underline">
                <span>Vào trang Đơn hàng</span> <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Box 4 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-gray-900">Quản Trị Trang Chủ</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Đổi 4 Banner slider, 6 Danh mục nổi bật, 5 Mẫu yêu thích, 4 Cơ sở Showroom và Video xưởng đúc.
              </p>
              <Link href="/admin/landing-page" className="inline-flex items-center gap-1 text-xs font-bold text-[#b8860b] hover:underline">
                <span>Vào trang Trang chủ</span> <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Box 5 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-gray-900">Thư Viện Ảnh (Media)</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Quản lý hơn 4.000 bức ảnh của xưởng. Kéo thả để tải lên. Lưu ý không tải ảnh nặng 10MB từ điện thoại.
              </p>
              <Link href="/admin/images" className="inline-flex items-center gap-1 text-xs font-bold text-[#b8860b] hover:underline">
                <span>Vào Thư viện ảnh</span> <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Box 6 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-gray-900">Quản Trị Trên Điện Thoại</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Toàn bộ các trang quản trị đều hoạt động mượt mà trên iPhone và Android thông qua trình duyệt web.
              </p>
              <Link href="/admin/login" className="inline-flex items-center gap-1 text-xs font-bold text-[#b8860b] hover:underline">
                <span>Đăng nhập Admin</span> <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Detailed Mobile Usage Instructions */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d7c3] shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-gray-900">
                2. Hướng Dẫn Vận Hành Bằng Điện Thoại (Smartphone)
              </h2>
              <p className="text-xs text-gray-500">Mẹo thao tác nhanh gọn cho chủ xưởng bận rộn:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#ede5d7] space-y-1.5">
              <div className="font-bold text-amber-900 uppercase">📱 Cách 1: Đăng nhập</div>
              <p className="text-gray-600 leading-relaxed">
                Mở Safari (iPhone) hoặc Chrome (Android), gõ <strong>quatanglocnam.com/admin/login</strong>. Bấm nút "Lưu mật khẩu" trên trình duyệt để những lần sau vào ngay không phải gõ lại.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#ede5d7] space-y-1.5">
              <div className="font-bold text-amber-900 uppercase">📞 Cách 2: Gọi khách 1 chạm</div>
              <p className="text-gray-600 leading-relaxed">
                Vào mục <strong>Đơn hàng</strong>, chạm trực tiếp vào số điện thoại của khách hàng. Điện thoại sẽ tự động mở màn hình gọi để bạn tư vấn chốt đơn ngay lập tức.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#ede5d7] space-y-1.5">
              <div className="font-bold text-amber-900 uppercase">⚡ Cách 3: Nén ảnh chụp</div>
              <p className="text-gray-600 leading-relaxed">
                Ảnh chụp từ iPhone thường nặng 10MB. Hãy gửi ảnh qua <strong>Zalo ở chế độ thường (không chọn HD)</strong> để Zalo tự nén ảnh về 150KB, sau đó tải lên web để web luôn mở tức thì!
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d7c3] shadow-sm space-y-4">
          <h2 className="font-serif text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            3. Câu Hỏi Thường Gặp (FAQ)
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="font-bold text-gray-900 mb-1">
                ❓ Tôi vừa sửa giá / đổi ảnh sản phẩm nhưng mở web ra vẫn thấy giá cũ?
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                👉 Máy chủ có bộ nhớ đệm tăng tốc (Edge Cache) tự làm mới sau <strong>60 giây</strong>. Trên máy tính hãy bấm <code>Ctrl + F5</code>; trên điện thoại vuốt mạnh xuống để làm mới trang.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="font-bold text-gray-900 mb-1">
                ❓ Có thể thêm 1 sản phẩm vào 2 danh mục khác nhau không?
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                👉 Có! Trong khung sửa sản phẩm, bạn có thể tích chọn nhiều danh mục cùng lúc (ví dụ: vừa là Quà tặng vừa là Tượng đồng).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-emerald-950">Kênh hỗ trợ kỹ thuật bảo hành 24/7</div>
              <div className="text-emerald-800">Đội ngũ phát triển Jaydev luôn đồng hành hỗ trợ Đồ Đồng Lộc Nam.</div>
            </div>
            <a
              href="tel:0846699997"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold shadow-sm hover:bg-emerald-800 self-start sm:self-auto"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>0846 699 997</span>
            </a>
          </div>
        </section>
      </main>

      <ModernFooter />
      <FloatingContact />
    </div>
  );
}
