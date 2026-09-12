import { LocNamPartners } from "@/components/home/LocNamPartners";
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { articlesData } from "./articlesData";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Calendar, Clock, ChevronRight, BookOpen, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Tin Tức & Cẩm Nang Đồ Đồng Phong Thủy | Đồ Đồng Lộc Nam",
  description:
    "Cẩm nang kiến thức phong thủy đồ thờ cúng bằng đồng, kinh nghiệm chọn bộ đỉnh đồng gia tiên, quy trình đúc tượng chân dung truyền thần và ý nghĩa trống đồng Đông Sơn từ nghệ nhân Lộc Nam.",
  keywords: [
    "tin tức đồ đồng",
    "kiến thức đồ đồng",
    "kinh nghiệm mua đồ đồng",
    "cách chọn đồ thờ cúng",
    "quy trình đúc tượng chân dung",
    "phong thủy đồ đồng",
    "đồ đồng lộc nam",
    "đồ đồng nam định",
  ].join(", "),
  alternates: {
    canonical: "https://www.quatanglocnam.com/tin-tuc",
  },
  openGraph: {
    title: "Tin Tức & Cẩm Nang Đồ Đồng Phong Thủy | Đồ Đồng Lộc Nam",
    description:
      "Tổng hợp kiến thức tâm linh, phong thủy thờ cúng và nghệ thuật đúc đồng truyền thống Nam Định từ các nghệ nhân kỳ cựu.",
    url: "https://www.quatanglocnam.com/tin-tuc",
    siteName: "Đồ Đồng Lộc Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/do-tho-cung.jpg",
        width: 1200,
        height: 630,
        alt: "Tin tức đồ đồng Lộc Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tin Tức & Cẩm Nang Đồ Đồng Phong Thủy | Đồ Đồng Lộc Nam",
    description:
      "Tổng hợp kiến thức tâm linh, phong thủy thờ cúng và nghệ thuật đúc đồng truyền thống Nam Định.",
  },
};

export default function TinTucPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      {/* Breadcrumb Schema for Google */}
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
          { name: "Tin Tức & Cẩm Nang", url: "https://www.quatanglocnam.com/tin-tuc" },
        ]}
      />

      <ModernHeader />

      <main className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6b7280] mb-6 overflow-x-auto pb-1" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#b8860b]">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-[#9ca3af]" />
          <span className="font-medium text-[#b8860b]">Tin Tức & Cẩm Nang</span>
        </nav>

        {/* Header Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fdf8ee] text-[#b8860b] border border-[#e2d5bd] text-xs font-serif font-bold uppercase rounded-full mb-3 tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CẨM NANG TINH HOA VIỆT</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0c1825] uppercase tracking-wide">
            TIN TỨC & KIẾN THỨC PHONG THỦY
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] max-w-2xl mx-auto mt-2 font-light">
            Chia sẻ kinh nghiệm bài trí bàn thờ gia tiên, chọn quà tặng ngoại giao mạ vàng 24k và ý nghĩa phong thủy các linh vật từ nghệ nhân Lộc Nam.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#c59b4e]"></div>
            <div className="w-2.5 h-2.5 bg-[#c59b4e] rotate-45"></div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#c59b4e]"></div>
          </div>
        </div>

        {/* Featured Top Article */}
        {articlesData.length > 0 && (
          <div className="mb-10">
            <Link
              href={`/tin-tuc/${articlesData[0].slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-[#e2d5bd] overflow-hidden shadow-sm hover:border-[#b8860b] hover:shadow-md transition-all p-6"
            >
              <div className="lg:col-span-6 aspect-[16/10] overflow-hidden rounded-xl bg-[#0c1825] border border-[#e2d5bd] relative">
                <img
                  src={articlesData[0].image}
                  alt={articlesData[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#0c1825] text-[#d4af37] text-[10px] font-bold uppercase px-2.5 py-1 rounded border border-[#c59b4e]/50">
                  ★ BÀI VIẾT NỔI BẬT
                </span>
              </div>
              <div className="lg:col-span-6 flex flex-col justify-between py-1 text-[#1a1a1a]">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>{articlesData[0].date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>{articlesData[0].readTime}</span>
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl group-hover:text-[#b8860b] transition-colors leading-snug text-[#0c1825]">
                    {articlesData[0].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed font-light">
                    {articlesData[0].summary}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-gray-100 mt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {articlesData[0].keywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="text-[10px] bg-[#fbf9f5] border border-[#e2d5bd] px-2 py-0.5 rounded text-[#6b7280]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-serif font-bold text-[#b8860b] group-hover:translate-x-1 transition-transform">
                    <span>Đọc tiếp</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articlesData.slice(1).map((article) => (
            <Link
              key={article.slug}
              href={`/tin-tuc/${article.slug}`}
              className="group flex flex-col justify-between bg-white rounded-xl border border-[#e2d5bd] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-[#b8860b] transition-all p-4"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden rounded-lg bg-[#0c1825] border border-[#e2d5bd] relative mb-3">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-[#0c1825] text-[#d4af37] text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-[#c59b4e]/40">
                    {article.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#6b7280] mb-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#b8860b]" />
                    <span>{article.date}</span>
                  </span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="font-serif font-bold text-sm sm:text-base text-[#0c1825] group-hover:text-[#b8860b] transition-colors line-clamp-2 leading-snug mb-2">
                  {article.title}
                </h3>

                <p className="text-xs text-[#4b5563] line-clamp-3 leading-relaxed font-light">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[#b8860b] text-xs font-serif font-semibold">
                <span className="flex items-center gap-1 text-[11px] text-[#6b7280]">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span>Đồ Đồng Lộc Nam</span>
                </span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
