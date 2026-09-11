import { LocNamPartners } from "@/components/home/LocNamPartners";
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, Hammer, Landmark, ShieldCheck, Award, Users, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Giới Thiệu Xưởng Đúc Đồ Đồng Lộc Nam | Tinh Hoa Làng Nghề Ý Yên Nam Định",
  description:
    "Đồ Đồng Lộc Nam - Thương hiệu đúc đồng truyền thống tại làng nghề Vạn Điểm, Ý Yên, Nam Định. Chuyên chế tác đồ thờ cúng, đúc tượng chân dung truyền thần, quà tặng mạ vàng 24k và đúc chuông đồng uy tín bậc nhất.",
  keywords: [
    "giới thiệu đồ đồng lộc nam",
    "xưởng đúc đồng ý yên",
    "làng nghề đúc đồng nam định",
    "đồ đồng lộc nam",
    "đúc tượng đồng uy tín",
    "đồ đồng nam định",
  ].join(", "),
  alternates: {
    canonical: "https://dodonglocnam.com/gioi-thieu",
  },
  openGraph: {
    title: "Giới Thiệu Xưởng Đúc Đồ Đồng Lộc Nam | Tinh Hoa Ý Yên Nam Định",
    description:
      "Lịch sử phát triển và sứ mệnh gìn giữ tinh hoa đúc đồng Việt Nam của thương hiệu Đồ Đồng Lộc Nam.",
    url: "https://dodonglocnam.com/gioi-thieu",
    siteName: "Đồ Đồng Lộc Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/hero_golden_ship.jpg",
        width: 1200,
        height: 630,
        alt: "Xưởng Đúc Đồ Đồng Lộc Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới Thiệu Xưởng Đúc Đồ Đồng Lộc Nam | Tinh Hoa Ý Yên Nam Định",
    description:
      "Lịch sử phát triển và sứ mệnh gìn giữ tinh hoa đúc đồng Việt Nam của thương hiệu Đồ Đồng Lộc Nam.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      {/* Breadcrumb Schema for Google */}
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://dodonglocnam.com" },
          { name: "Giới Thiệu", url: "https://dodonglocnam.com/gioi-thieu" },
        ]}
      />

      <ModernHeader />

      <main className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-8 py-12 w-full">
        {/* Title Centered */}
        <div className="text-center mb-12">
          <div className="text-[#a67c2e] font-serif text-xs font-bold tracking-[0.2em] uppercase mb-1">
            VỀ CHÚNG TÔI
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0c1825] tracking-wide uppercase">
            GIỚI THIỆU ĐỒ ĐỒNG LỘC NAM
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] max-w-2xl mx-auto mt-2 font-light">
            Kế thừa hơn 900 năm tinh hoa làng nghề đúc đồng truyền thống Ý Yên – Nam Định
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#c59b4e]"></div>
            <div className="w-2.5 h-2.5 bg-[#c59b4e] rotate-45"></div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#c59b4e]"></div>
          </div>
        </div>

        {/* Main Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-2xl border border-[#e2d5bd] shadow-sm mb-12 items-center">
          <div className="lg:col-span-6 overflow-hidden rounded-xl border border-[#e2d5bd]">
            <img
              src="/images/hero_golden_ship.jpg"
              alt="Xưởng đúc đồng Đồ Đồng Lộc Nam tại Ý Yên Nam Định"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="lg:col-span-6 space-y-4 text-sm text-[#4b5563] leading-relaxed">
            <p>
              Sinh ra và lớn lên trong chiếc nôi của làng nghề đúc đồng truyền thống Ý Yên, Nam Định, những nghệ nhân của <strong className="text-[#0c1825]">Đồ Đồng Lộc Nam</strong> luôn mang trong mình sứ mệnh gìn giữ và phát huy tinh hoa chế tác kim hoàn và đúc đồng Việt Nam.
            </p>
            <p>
              Với đội ngũ nghệ nhân và thợ đúc lành nghề, <strong className="text-[#0c1825]">Lộc Nam</strong> chuyên sản xuất và cung cấp ra thị trường các dòng sản phẩm đồng và mạ vàng cao cấp: <strong className="text-[#b8860b]">đồ thờ cúng gia tiên bằng đồng, đúc tượng đồng chân dung truyền thần, mô hình thuyền buồm mạ vàng 24k, tranh dát vàng nghệ thuật, tượng phong thủy chiêu tài, trống đồng Đông Sơn và chuông đồng đại hồng chung</strong>.
            </p>
            <p>
              Mỗi tác phẩm của Lộc Nam không chỉ là một vật phẩm trưng bày, mà còn là một tuyệt tác mang giá trị tâm linh, phong thủy thịnh vượng và trường tồn cùng thời gian.
            </p>
            <div className="pt-2">
              <p className="font-serif font-bold text-[#b8860b] text-base sm:text-lg mb-4">
                &ldquo;Lộc Nam - Tinh Hoa Chế Tác, Nâng Tầm Giá Trị&rdquo;
              </p>
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] hover:bg-[#9b6f1e] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm"
              >
                <span>XEM TẤT CẢ SẢN PHẨM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Core Strengths Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Flame,
              title: "ĐỒNG NGUYÊN CHẤT 100%",
              text: "Sử dụng phôi đồng đỏ thanh khiết và đồng catut nguyên khối, nấu chảy ở nhiệt độ trên 1200°C.",
            },
            {
              icon: Hammer,
              title: "CHẾ TÁC TINH XẢO",
              text: "Mỗi tác phẩm được nghệ nhân gia công tỉ mỉ từng chi tiết, chạm khắc thủ công đạt độ hoàn mỹ cao nhất.",
            },
            {
              icon: Landmark,
              title: "THIẾT KẾ ĐỘC QUYỀN",
              text: "Mẫu mã độc quyền dành riêng cho quà tặng lãnh đạo, quà biếu doanh nghiệp và không gian thờ cúng gia tiên.",
            },
            {
              icon: ShieldCheck,
              title: "BẢO HÀNH TRỌN ĐỜI",
              text: "Cam kết chất lượng đồng vĩnh cửu, phiếu bảo hành trọn đời và chính sách hỗ trợ khách hàng chu đáo 24/7.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white border border-[#e2d5bd] hover:border-[#b8860b] p-6 rounded-xl text-center space-y-3 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-[#fdf8ee] border border-[#e2d5bd] text-[#b8860b] flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-bold text-sm text-[#0c1825] tracking-wide uppercase">{title}</h2>
              <p className="text-xs text-[#6b7280] leading-relaxed font-light">{text}</p>
            </div>
          ))}
        </div>
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
