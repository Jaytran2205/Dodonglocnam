import { LocNamPartners } from "@/components/home/LocNamPartners";
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { articlesData } from "@/app/tin-tuc/articlesData";

export const metadata: Metadata = {
  title: "Kiến Thức Đồ Đồng & Cẩm Nang Phong Thủy Gia Tiên | Đồ Đồng Lộc Nam",
  description:
    "Cẩm nang toàn diện về kiến thức đồ đồng thủ công mỹ nghệ Ý Yên Nam Định: cách phân biệt đồng thật và đồng pha tạp, quy trình đúc tượng chân dung truyền thần, ý nghĩa phong thủy mô hình thuyền buồm, trống đồng Đông Sơn.",
  keywords: [
    "kiến thức đồ đồng",
    "cẩm nang đồ đồng",
    "phong thủy đồ đồng",
    "phân biệt đồng thật giả",
    "cách chọn đồ thờ cúng",
    "đồ đồng lộc nam",
    "đồ đồng nam định",
  ].join(", "),
  alternates: {
    canonical: "https://dodonglocnam.com/ki-thuc-do-dong",
  },
  openGraph: {
    title: "Kiến Thức Đồ Đồng & Cẩm Nang Phong Thủy Gia Tiên | Đồ Đồng Lộc Nam",
    description:
      "Toàn bộ kinh nghiệm chọn đồ đồng, bài trí ban thờ và kiến thức đúc đồng truyền thống từ nghệ nhân Ý Yên Nam Định.",
    url: "https://dodonglocnam.com/ki-thuc-do-dong",
    siteName: "Đồ Đồng Lộc Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/do-tho-cung.jpg",
        width: 1200,
        height: 630,
        alt: "Kiến thức đồ đồng Lộc Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiến Thức Đồ Đồng & Cẩm Nang Phong Thủy Gia Tiên | Đồ Đồng Lộc Nam",
    description:
      "Toàn bộ kinh nghiệm chọn đồ đồng, bài trí ban thờ và kiến thức đúc đồng truyền thống từ nghệ nhân Ý Yên Nam Định.",
  },
};

export default function KnowledgePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      {/* Breadcrumb Schema for Google */}
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://dodonglocnam.com" },
          { name: "Kiến Thức Đồ Đồng", url: "https://dodonglocnam.com/ki-thuc-do-dong" },
        ]}
      />

      <ModernHeader />

      <main className="mx-auto max-w-[1440px] px-4 sm:px-8 py-12 w-full flex-grow">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fdf8ee] text-[#b8860b] border border-[#e2d5bd] text-xs font-serif font-bold uppercase rounded-full mb-3 tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CẨM NANG CHUYÊN SÂU</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#0c1825]">
            KIẾN THỨC ĐỒ ĐỒNG & PHONG THỦY HOÀNG KIM
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] max-w-2xl mx-auto mt-2 font-light">
            Cẩm nang hướng dẫn gia chủ cách chọn mua, bảo quản và kích hoạt phong thủy từ các tác phẩm đồ đồng thủ công Nam Định.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#c59b4e]"></div>
            <div className="w-2.5 h-2.5 bg-[#c59b4e] rotate-45"></div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#c59b4e]"></div>
          </div>
        </div>

        {/* 4 Topic Pillar Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {articlesData.map((article) => (
            <Link
              key={article.slug}
              href={`/tin-tuc/${article.slug}`}
              className="group overflow-hidden rounded-2xl border border-[#e2d5bd] bg-[#0c1825] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#b8860b]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1825] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-[#b8860b] text-white text-[10px] font-serif font-bold uppercase px-2.5 py-1 rounded shadow">
                  {article.category}
                </span>
              </div>
              <div className="p-6 bg-[#0b1622] border-t border-[#1c2c3d] flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wide text-[#f1f5f9] group-hover:text-[#d4af37] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-xs text-[#94a3b8] mt-2 line-clamp-2 font-light">
                    {article.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1c2c3d] text-xs font-serif font-bold text-[#d4af37]">
                  <span>Đọc bài viết chi tiết</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1.5 shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 3 Core Principles for SEO Authority */}
        <section className="bg-white rounded-2xl border border-[#e2d5bd] p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-[#0c1825] mb-4">
            <Sparkles className="w-5 h-5 text-[#b8860b]" />
            <h3 className="font-serif font-bold text-lg sm:text-xl uppercase">
              3 TIÊU CHÍ VÀNG KHI CHỌN ĐỒ ĐỒNG NGUYÊN CHẤT
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 bg-[#fbf9f5] rounded-xl border border-[#e2d5bd]/60 space-y-2">
              <div className="flex items-center gap-2 text-[#b8860b] font-serif font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Chất liệu phôi đồng</span>
              </div>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Đồng đỏ thanh khiết hoặc đồng catut nguyên khối có trọng lượng đầm chắc, âm vang ngân trầm ấm, không bị oxy hóa hay giòn gãy như đồng pha tạp.
              </p>
            </div>

            <div className="p-4 bg-[#fbf9f5] rounded-xl border border-[#e2d5bd]/60 space-y-2">
              <div className="flex items-center gap-2 text-[#b8860b] font-serif font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Đường nét chạm trổ</span>
              </div>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Sản phẩm thủ công truyền thống Ý Yên có đường nét hoa văn mềm mại, sắc nét, có chiều sâu mỹ thuật và thể hiện được thần thái sống động của linh vật.
              </p>
            </div>

            <div className="p-4 bg-[#fbf9f5] rounded-xl border border-[#e2d5bd]/60 space-y-2">
              <div className="flex items-center gap-2 text-[#b8860b] font-serif font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>3. Kích thước chuẩn phong thủy</span>
              </div>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Kích thước đỉnh đồng, tượng đồng và tranh đồng cần đo đạc chuẩn xác theo các cung đỏ cát tường trên thước Lỗ Ban (Đăng Khoa, Tiến Bảo, Nạp Phúc).
              </p>
            </div>
          </div>
        </section>
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
