import { LocNamPartners } from "@/components/home/LocNamPartners";
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, Hammer, Landmark, ShieldCheck, Award, Users, Flame, BookOpen, Factory, PhoneCall } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
    canonical: "https://www.quatanglocnam.com/gioi-thieu",
  },
  openGraph: {
    title: "Giới Thiệu Xưởng Đúc Đồ Đồng Lộc Nam | Tinh Hoa Ý Yên Nam Định",
    description:
      "Lịch sử phát triển và sứ mệnh gìn giữ tinh hoa đúc đồng Việt Nam của thương hiệu Đồ Đồng Lộc Nam.",
    url: "https://www.quatanglocnam.com/gioi-thieu",
    siteName: "Đồ Đồng Lộc Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/artisan-foundry.jpg",
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

export default async function AboutPage() {
  let settingsMap: Record<string, string> = {};
  try {
    const rows = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            "artisan_name",
            "artisan_title",
            "artisan_company",
            "artisan_desc",
            "artisan_image",
            "site_name",
            "hotline",
            "hotline2",
          ],
        },
      },
    });
    rows.forEach((r) => {
      settingsMap[r.key] = r.value;
    });
  } catch (err) {
    console.error("AboutPage fetch settings error:", err);
  }

  const artisanImage = settingsMap.artisan_image || "/images/artisan-foundry.jpg";
  const artisanName = settingsMap.artisan_name || "Nghệ Nhân Dương Bá Tiến";
  const artisanTitle = settingsMap.artisan_title || "Làng nghề đúc đồng Vạn Điểm, Ý Yên";
  const artisanCompany = settingsMap.artisan_company || "CÔNG TY TNHH CƠ KHÍ ĐÚC LỘC NAM";
  const artisanDesc =
    settingsMap.artisan_desc ||
    "Trải qua nhiều thế hệ gìn giữ và phát triển tại cái nôi làng nghề đúc đồng Vạn Điểm (Thị trấn Lâm, Ý Yên, Nam Định), Đồ Đồng Lộc Nam dưới sự dẫn dắt của Nghệ nhân Dương Bá Tiến đã chế tác hàng vạn kiệt tác đồ thờ cúng gia tiên, tượng Phật đại bi, đại hồng chung cho các ngôi chùa danh tiếng khắp đất nước.";
  const hotline = settingsMap.hotline || "0836 122 222";
  const hotline2 = settingsMap.hotline2 || "0846 699 997";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      {/* Breadcrumb Schema for Google */}
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
          { name: "Giới Thiệu", url: "https://www.quatanglocnam.com/gioi-thieu" },
        ]}
      />

      <ModernHeader />

      <main className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-8 py-10 w-full space-y-12">
        {/* Title Centered */}
        <div className="text-center">
          <div className="text-[#a67c2e] font-serif text-xs font-bold tracking-[0.2em] uppercase mb-1">
            VỀ CHÚNG TÔI
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0c1825] tracking-wide uppercase">
            {artisanCompany}
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

        {/* Main Content Box (Nghệ Nhân & Cơ Sở Xưởng Đúc) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-2xl border border-[#e2d5bd] shadow-sm items-center">
          <div className="lg:col-span-6 relative">
            <div className="overflow-hidden rounded-xl border-2 border-[#b8860b]/40 shadow-lg aspect-[4/3] bg-[#FAF6ED]">
              <img
                src={artisanImage}
                alt={artisanName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Experience Box */}
            <div className="absolute -bottom-3 -right-3 bg-[#111c2e] text-white p-3.5 rounded-xl shadow-xl border border-[#b8860b]/60 hidden sm:flex items-center gap-3">
              <Award className="w-7 h-7 text-[#d4af37]" />
              <div>
                <span className="font-serif font-bold text-xs block text-[#d4af37]">{artisanName}</span>
                <span className="text-[10px] text-[#94a3b8]">{artisanTitle}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 text-sm text-[#4b5563] leading-relaxed">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fdf8ee] border border-[#e2d5bd] rounded-full text-xs font-bold text-[#b8860b]">
              <Award className="w-3.5 h-3.5" />
              <span>{artisanTitle}</span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0c1825]">
              {artisanName} & Sứ Mệnh Gìn Giữ Tinh Hoa Nghề Cổ
            </h2>

            <p className="whitespace-pre-line leading-relaxed">
              {artisanDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] hover:bg-[#9b6f1e] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm"
              >
                <span>XEM TẤT CẢ SẢN PHẨM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`tel:${hotline.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#fdf8ee] hover:bg-[#faebd7] text-[#8B6B38] font-bold text-xs uppercase tracking-wider rounded-lg border border-[#e2d5bd] transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#b8860b]" />
                <span>Hotline: {hotline}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2 In-depth Articles / Stories Section */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-[#a67c2e] font-serif text-xs font-bold tracking-[0.2em] uppercase mb-1">
              BÀI VIẾT CHUYÊN SÂU
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0c1825]">
              Tìm Hiểu Thêm Về Nghệ Nhân & Hệ Thống Xưởng Sản Xuất
            </h2>
            <p className="text-xs text-[#6b7280] mt-1">
              Đọc các bài viết tư liệu lịch sử, chứng nhận bàn tay vàng và quy mô 7 phân xưởng chuyên biệt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Article 1: Duong Ba Tien */}
            <Link
              href="/tin-tuc/nghe-nhan-duong-ba-tien"
              className="bg-white p-6 rounded-2xl border border-[#e2d5bd] hover:border-[#b8860b] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#b8860b] uppercase">
                  <Award className="w-4 h-4" />
                  <span>NGHỆ NHÂN ĐÚC ĐỒNG</span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#0c1825] group-hover:text-[#b8860b] transition-colors leading-snug">
                  Nghệ Nhân Dương Bá Tiến - 40 Năm Gìn Giữ Tinh Hoa Nghề Đúc Đồng Lộc Nam
                </h3>
                <p className="text-xs text-[#6b7280] leading-relaxed line-clamp-3">
                  Tìm hiểu về nghệ nhân Dương Bá Tiến - Bàn tay vàng với 40 năm cống hiến cho nghề đúc đồng truyền thống tại làng nghề Ý Yên, Nam Định. Gìn giữ tinh hoa nghề xưa và đưa thương hiệu Lộc Nam vươn tầm quốc gia.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#f0e6d2] flex items-center justify-between text-xs font-bold text-[#b8860b]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Xem chi tiết bài viết</span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Article 2: Xuong Duc Loc Nam */}
            <Link
              href="/tin-tuc/xuong-san-xuat-duc-dong-loc-nam"
              className="bg-white p-6 rounded-2xl border border-[#e2d5bd] hover:border-[#b8860b] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#b8860b] uppercase">
                  <Factory className="w-4 h-4" />
                  <span>QUY MÔ CƠ SỞ SẢN XUẤT</span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#0c1825] group-hover:text-[#b8860b] transition-colors leading-snug">
                  Xưởng Đúc Đồng Lộc Nam - Hệ Thống 7 Phân Xưởng Chuyên Sâu Khép Kín
                </h3>
                <p className="text-xs text-[#6b7280] leading-relaxed line-clamp-3">
                  Khám phá xưởng đúc đồng Lộc Nam tại Ý Yên Nam Định: 3 trụ sở sản xuất quy mô lớn, 7 phân xưởng chức năng khép kín, gần 100 thợ thủ công lành nghề và công nghệ mạ dát vàng 9999 đỉnh cao.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#f0e6d2] flex items-center justify-between text-xs font-bold text-[#b8860b]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Xem chi tiết bài viết</span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* 4 Core Strengths & Customer Service Cards (Anchor #dich-vu) */}
        <div id="dich-vu" className="scroll-mt-24 space-y-6 pt-4">
          <div className="text-center">
            <div className="text-[#a67c2e] font-serif text-xs font-bold tracking-[0.2em] uppercase mb-1">
              DỊCH VỤ & CHĂM SÓC KHÁCH HÀNG
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0c1825]">
              Cam Kết Uy Tín & Dịch Vụ Phục Vụ Tận Tâm
            </h2>
            <p className="text-xs text-[#6b7280] mt-1">
              Chính sách bảo hành trọn đời, đúc theo yêu cầu và giao hàng tận nơi trên toàn quốc
            </p>
          </div>

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
                <h3 className="font-serif font-bold text-sm text-[#0c1825] tracking-wide uppercase">{title}</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed font-light">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline={hotline2} zalo={hotline2.replace(/\D/g, "")} />
    </div>
  );
}
