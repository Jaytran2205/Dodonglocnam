"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Download,
  ExternalLink,
  Smartphone,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  Layers,
  Package,
  ShoppingCart,
  Image as ImageIcon,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function AdminGuidePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "mobile" | "faq">("overview");

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#0a1420] to-[#162a42] p-6 sm:p-8 rounded-2xl border-2 border-[#b8860b] shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfb755]/20 border border-[#ffd700] text-[#ffd700] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TÀI LIỆU HƯỚNG DẪN BÀN GIAO NỘI BỘ</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            CẨM NANG QUẢN TRỊ WEBSITE ĐỒ ĐỒNG LỘC NAM
          </h1>
          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
            Hướng dẫn đầy đủ từng bước cách sử dụng các tính năng: Thêm sản phẩm, cập nhật giá, đồng bộ danh mục, quản lý đơn hàng và chỉnh sửa giao diện trang chủ trên cả máy tính và điện thoại.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="/huong-dan.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#08121e] text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Tải file PDF gửi Zalo (700 KB)</span>
            </a>

            <a
              href="/huong-dan.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c1825] border border-[#ffd700]/60 text-[#ffd700] text-xs sm:text-sm font-bold hover:bg-[#12243a] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở bản Web tương tác toàn màn hình</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-[#0a1420] text-[#ffd700] shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          📖 Các Chức Năng Chính
        </button>
        <button
          onClick={() => setActiveTab("mobile")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "mobile"
              ? "bg-[#0a1420] text-[#ffd700] shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          📱 Hướng Dẫn Dùng Trên Điện Thoại
        </button>
        <button
          onClick={() => setActiveTab("faq")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "faq"
              ? "bg-[#0a1420] text-[#ffd700] shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          ❓ Câu Hỏi Thường Gặp & Hỗ Trợ
        </button>
      </div>

      {/* Tab 1: Overview Cards */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-base font-bold text-gray-900">Quản Lý Sản Phẩm</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Thêm mới sản phẩm, đổi giá bán, chọn bề mặt hoàn thiện (đồng đỏ/cát tút/mạ vàng 24k), tải thư viện ảnh nhiều góc chụp và tối ưu chuẩn SEO Google.
            </p>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b8860b] hover:underline pt-1"
            >
              <span>Vào trang Sản phẩm</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-base font-bold text-gray-900">Đồng Bộ Danh Mục</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cập nhật ảnh đại diện và tên danh mục. Cơ chế đồng bộ tự động giúp ảnh ở trang chủ, menu chính và trang admin luôn ăn khớp 100%.
            </p>
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b8860b] hover:underline pt-1"
            >
              <span>Vào trang Danh mục</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-base font-bold text-gray-900">Xử Lý Đơn Hàng</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Xem thông tin khách hàng, số điện thoại, danh sách món đồ đã chọn. Bấm gọi trực tiếp cho khách và đổi trạng thái giao hàng.
            </p>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b8860b] hover:underline pt-1"
            >
              <span>Vào trang Đơn hàng</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-base font-bold text-gray-900">Quản Trị Trang Chủ (7 Tab)</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Đổi banner slider, 6 danh mục nổi bật, 5 sản phẩm yêu thích, địa chỉ 4 showroom xưởng đúc và video quy trình đúc YouTube.
            </p>
            <Link
              href="/admin/landing-page"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b8860b] hover:underline pt-1"
            >
              <span>Vào trang Trang chủ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-base font-bold text-gray-900">Thư Viện Ảnh (Media)</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Quản lý hơn 4.000 hình ảnh. Kéo thả để tải lên. Lưu ý không tải trực tiếp ảnh nặng 10MB từ điện thoại để giữ web load trong 0.2 giây.
            </p>
            <Link
              href="/admin/images"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b8860b] hover:underline pt-1"
            >
              <span>Vào Thư viện ảnh</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2d7c3] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-base font-bold text-gray-900">Tài Khoản & Phân Quyền</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tạo tài khoản riêng cho từng nhân viên bán hàng hoặc biên tập viên bài viết, theo dõi lịch sử hoạt động bảo mật.
            </p>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b8860b] hover:underline pt-1"
            >
              <span>Vào trang Quản trị viên</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Mobile Usage Guide */}
      {activeTab === "mobile" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d7c3] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                HƯỚNG DẪN QUẢN TRỊ WEBSITE BẰNG ĐIỆN THOẠI (SMARTPHONE)
              </h2>
              <p className="text-xs text-gray-500">
                Toàn bộ giao diện Admin Đồ Đồng Lộc Nam đã được thiết kế tối ưu 100% cho điện thoại iPhone và Android.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Bước 1: Đăng nhập</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mở Safari (iPhone) hoặc Chrome (Android), truy cập:  
                <span className="block font-mono font-bold text-gray-900 mt-1">quatanglocnam.com/admin/login</span>  
                Nhập tài khoản và mật khẩu như bình thường.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Bước 2: Menu điều hướng</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ở góc trên bên trái có biểu tượng <strong>3 dấu gạch ngang (☰)</strong>. Bấm vào đây để mở menu chọn Sản phẩm, Đơn hàng, Trang chủ.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Bước 3: Gọi khách 1 chạm</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Khi có đơn hàng mới, số điện thoại khách hàng hiển thị dưới dạng nút bấm màu xanh. Chỉ cần bấm vào là điện thoại sẽ tự động quay số gọi ngay cho khách!
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Mẹo tải ảnh sản phẩm từ điện thoại:</span>
            </div>
            <p>
              Camera điện thoại đời mới chụp ảnh rất nặng (10MB). Trước khi tải lên web, bạn nên gửi ảnh qua <strong>Zalo ở chế độ thường (không chọn HD)</strong> để Zalo tự nén ảnh về cỡ 150KB vừa nét vừa giúp web mở tức thì không bị chậm.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: FAQ & Support */}
      {activeTab === "faq" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d7c3] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                CÂU HỎI THƯỜNG GẶP & KÊNH HỖ TRỢ KỸ THUẬT
              </h2>
              <p className="text-xs text-gray-500">
                Giải đáp nhanh các thắc mắc trong quá trình vận hành website Đồ Đồng Lộc Nam.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">
                1. Tôi vừa đổi ảnh / đổi giá sản phẩm nhưng mở web ra vẫn thấy giá cũ?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hệ thống có bộ nhớ đệm tốc độ cao (Edge Cache) tự làm mới sau <strong>60 giây</strong>. Trên máy tính bạn có thể bấm <code>Ctrl + F5</code> để xóa bộ nhớ tạm; trên điện thoại hãy vuốt mạnh xuống để tải lại trang.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">
                2. Tôi có thể đăng 1 sản phẩm vào 2 danh mục khác nhau không?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hoàn toàn được! Trong khung sửa sản phẩm, bạn có thể tích chọn cả danh mục Quà tặng và Danh mục Tượng đồng cùng lúc.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">
                3. Nếu lỡ tay xóa nhầm sản phẩm thì làm thế nào?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dữ liệu website được tự động sao lưu dự phòng hàng ngày trên Cloud. Hãy liên hệ ngay kỹ thuật viên để được khôi phục nguyên vẹn.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs sm:text-sm font-bold text-emerald-950">Kênh hỗ trợ kỹ thuật bảo hành 24/7</div>
              <div className="text-xs text-emerald-800">Đội ngũ phát triển Jaydev luôn đồng hành cùng Đồ Đồng Lộc Nam.</div>
            </div>
            <a
              href="https://www.quatanglocnam.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-md hover:bg-emerald-800 whitespace-nowrap"
            >
              Liên hệ kỹ thuật
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
