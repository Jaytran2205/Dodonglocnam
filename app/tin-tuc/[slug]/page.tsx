import { LocNamPartners } from "@/components/home/LocNamPartners";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { articlesData } from "../articlesData";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo/JsonLd";
import { Calendar, Clock, ChevronRight, Phone, MessageCircle, BookOpen, Tag } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return articlesData.map((a) => ({
    slug: a.slug,
  }));
}

function formatIsoDate(dateStr: string) {
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T08:00:00+07:00`;
  }
  return "2026-08-27T08:00:00+07:00";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articlesData.find((a) => a.slug === slug);
  if (!article) return { title: "Không tìm thấy bài viết | Đồ Đồng Lộc Nam" };

  const url = `https://www.quatanglocnam.com/tin-tuc/${article.slug}`;

  return {
    title: `${article.title} | Đồ Đồng Lộc Nam`,
    description: article.summary,
    keywords: article.keywords.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: url,
      siteName: "Đồ Đồng Lộc Nam",
      locale: "vi_VN",
      publishedTime: formatIsoDate(article.date),
      authors: [article.author],
      images: [
        {
          url: article.image.startsWith("http") ? article.image : `https://www.quatanglocnam.com${article.image}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = articlesData.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articlesData.filter((a) => a.slug !== slug).slice(0, 3);
  const articleUrl = `https://www.quatanglocnam.com/tin-tuc/${article.slug}`;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      {/* 1. Breadcrumb Schema */}
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
          { name: "Tin Tức", url: "https://www.quatanglocnam.com/tin-tuc" },
          { name: article.title, url: articleUrl },
        ]}
      />

      {/* 2. Article / BlogPosting Schema */}
      <ArticleJsonLd
        title={article.title}
        description={article.summary}
        image={article.image.startsWith("http") ? article.image : `https://www.quatanglocnam.com${article.image}`}
        datePublished={formatIsoDate(article.date)}
        author={article.author}
        url={articleUrl}
      />

      {article.slug === "nghe-nhan-duong-ba-tien" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Dương Bá Tiến",
              "jobTitle": "Nghệ nhân đúc đồng",
              "award": "Nghệ nhân bàn tay vàng",
              "worksFor": {
                "@type": "Organization",
                "name": "Công ty TNHH Cơ Khí Đúc Lộc Nam",
                "url": "https://www.quatanglocnam.com",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Ý Yên",
                  "addressRegion": "Nam Định",
                  "addressCountry": "VN"
                }
              },
              "hasOccupation": {
                "@type": "Occupation",
                "name": "Nghệ nhân đúc đồng",
                "experienceRequirements": "40 năm kinh nghiệm"
              }
            }),
          }}
        />
      )}

      <ModernHeader />

      <main className="flex-grow max-w-[1040px] mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6b7280] mb-6 overflow-x-auto pb-1" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#b8860b]">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-[#9ca3af]" />
          <Link href="/tin-tuc" className="hover:text-[#b8860b]">
            Tin Tức
          </Link>
          <ChevronRight className="w-3 h-3 text-[#9ca3af]" />
          <span className="font-semibold text-[#b8860b] truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Article Container */}
        <article className="bg-white rounded-2xl border border-[#e2d5bd] shadow-sm p-6 sm:p-10 mb-10">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-[#6b7280] mb-4 flex-wrap">
            <span className="bg-[#fdf8ee] text-[#b8860b] px-2.5 py-0.5 rounded-md font-serif font-bold uppercase border border-[#e2d5bd]">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{article.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>{article.readTime}</span>
            </span>
            <span>•</span>
            <span>Tác giả: {article.author}</span>
          </div>

          {/* Title */}
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0c1825] leading-snug mb-5">
            {article.title}
          </h1>

          {/* Summary Box */}
          <div className="bg-[#fbf9f5] p-4 rounded-xl border-l-4 border-[#b8860b] mb-6 text-xs sm:text-sm text-[#4b5563] italic leading-relaxed">
            {article.summary}
          </div>

          {/* Featured Image */}
          <div className="aspect-[16/9] max-h-[440px] rounded-xl overflow-hidden bg-[#0c1825] border border-[#e2d5bd] mb-6 shadow-sm flex items-center justify-center">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="space-y-4 text-xs sm:text-sm text-[#374151] leading-relaxed">
            {article.content.map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="font-serif font-bold text-lg sm:text-xl text-[#0c1825] pt-6 pb-2 border-b border-[#e2d5bd] text-primary">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="font-serif font-bold text-base sm:text-lg text-[#b8860b] pt-4 pb-1">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("#### ")) {
                return (
                  <h4 key={index} className="font-bold text-sm sm:text-base text-[#0c1825] pt-2">
                    {paragraph.replace("#### ", "")}
                  </h4>
                );
              }
              if (paragraph.startsWith("![") && paragraph.includes("](") && paragraph.endsWith(")")) {
                const match = paragraph.match(/^!\[(.*?)\]\((.*?)\)$/);
                if (match) {
                  const [, alt, src] = match;
                  return (
                    <figure key={index} className="my-6 rounded-xl overflow-hidden border border-[#e2d5bd] bg-[#fbf9f5] shadow-sm">
                      <img src={src} alt={alt} className="w-full max-h-[520px] object-cover" />
                      {alt && (
                        <figcaption className="p-3 text-center text-xs text-[#6b7280] italic bg-white border-t border-[#f0eae0]">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
              }
              if (paragraph.startsWith("> ")) {
                return (
                  <div key={index} className="p-4 my-3 bg-[#fbf9f5] border-l-4 border-[#b8860b] rounded-r-xl text-[#4b5563] text-xs sm:text-sm italic leading-relaxed">
                    {paragraph.replace("> ", "")}
                  </div>
                );
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <div key={index} className="flex items-start gap-2 pl-2">
                    <span className="text-[#b8860b] font-bold mt-0.5">•</span>
                    <span>{paragraph.replace("- ", "")}</span>
                  </div>
                );
              }
              return (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Keywords & Tags */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 flex-wrap text-xs">
            <Tag className="w-3.5 h-3.5 text-[#b8860b]" />
            <span className="font-medium text-[#0c1825]">Từ khóa:</span>
            {article.keywords.map((kw, i) => (
              <span
                key={i}
                className="bg-[#fbf9f5] border border-[#e2d5bd] text-[#4b5563] px-2.5 py-1 rounded-md text-[11px] hover:border-[#b8860b] transition-colors"
              >
                #{kw}
              </span>
            ))}
          </div>

          {/* Direct CTA Box */}
          <div className="mt-8 p-6 bg-[#0c1825] rounded-xl border border-[#c59b4e]/40 text-white shadow-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-[#d4af37] uppercase">
                  Tư Vấn Trực Tiếp Cùng Nghệ Nhân Lộc Nam
                </h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-light">
                  Đúc tượng chân dung, đồ thờ cúng, quà tặng mạ vàng 24k theo kích thước Lỗ Ban chuẩn phong thủy.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="tel:0836122222"
                  className="py-2 px-3 bg-[#b8860b] hover:bg-[#9b6f1e] text-white font-serif font-bold text-xs uppercase rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>0836 122 222</span>
                </a>
                <a
                  href="tel:0846699997"
                  className="py-2 px-3 bg-[#122234] hover:bg-[#1c2e42] text-[#ffd700] border border-[#d4af37]/40 font-serif font-bold text-xs uppercase rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>0846 699 997</span>
                </a>
                <a
                  href="https://zalo.me/0846699997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-[#0068FF] hover:bg-[#0052cc] text-white font-bold text-xs uppercase rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Zalo</span>
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mb-12">
            <h3 className="font-serif font-bold text-lg text-[#0c1825] uppercase mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#b8860b]" />
              <span>BÀI VIẾT LIÊN QUAN</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/tin-tuc/${rel.slug}`}
                  className="group bg-white p-3.5 rounded-xl border border-[#e2d5bd] shadow-sm hover:-translate-y-1 hover:border-[#b8860b] transition-all block"
                >
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-[#0c1825] mb-2.5">
                    <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="font-serif font-semibold text-xs sm:text-sm text-[#0c1825] group-hover:text-[#b8860b] line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
    </div>
  );
}
