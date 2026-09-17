import React from "react";
import { ModernHeader } from "@/components/common/ModernHeader";
import { HomeHeroSlider } from "@/components/home/HomeHeroSlider";
import { ModernFeatures } from "@/components/home/ModernFeatures";
import { LocNamCategories } from "@/components/home/LocNamCategories";
import { LocNamFavorites } from "@/components/home/LocNamFavorites";
import { LocNamProjectsSection } from "@/components/home/LocNamProjectsSection";
import { LocNamVideos } from "@/components/home/LocNamVideos";
import { LocNamBrandEssence } from "@/components/home/LocNamBrandEssence";
import { LocNamPartners } from "@/components/home/LocNamPartners";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { FaqJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export default function HomePage() {
  const homeFaqs = [
    {
      question: "Đồ Đồng Lộc Nam có nguồn gốc xuất xứ từ đâu?",
      answer:
        "Đồ Đồng Lộc Nam có xưởng sản xuất trực tiếp tại làng nghề đúc đồng truyền thống Vạn Điểm, thị trấn Lâm, huyện Ý Yên, tỉnh Nam Định với hơn 900 năm lịch sử đúc đồng.",
    },
    {
      question: "Đồ Đồng Lộc Nam có những dòng sản phẩm chính nào?",
      answer:
        "Chúng tôi chuyên chế tác: Đồ thờ cúng bằng đồng (bộ ngũ sự, tam sự, bát hương, hạc thờ), đúc tượng chân dung truyền thần, tượng phong thủy danh nhân, mô hình thuyền buồm mạ vàng 24k, tranh đồng dát vàng và đúc chuông đồng, trống đồng Đông Sơn.",
    },
    {
      question: "Chính sách bảo hành sản phẩm tại Lộc Nam như thế nào?",
      answer:
        "Tất cả sản phẩm đúc đồng tại Đồ Đồng Lộc Nam đều được bảo hành trọn đời về chất lượng phôi đồng thanh khiết, cam kết không hoen gỉ, bong tróc hoặc nứt vỡ.",
    },
    {
      question: "Khách hàng ở xa có được kiểm tra hàng trước khi thanh toán không?",
      answer:
        "Có, Đồ Đồng Lộc Nam hỗ trợ giao hàng tận nhà trên toàn quốc. Quý khách hàng được mở thùng kiểm tra đúng chất lượng, mẫu mã, cân nặng và hoa văn trước khi thanh toán tiền.",
    },
  ];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Đồ Đồng Lộc Nam",
    url: "https://www.quatanglocnam.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.quatanglocnam.com/san-pham?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      {/* WebSite Search Schema & FAQ Schema for Home */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <FaqJsonLd faqs={homeFaqs} />

      {/* Preload first hero banner image for instant LCP render */}
      <link
        rel="preload"
        as="image"
        href="/images/banners/banner_he_thong_showroom_xuong_v3.webp"
        type="image/webp"
        // @ts-ignore
        fetchPriority="high"
      />

      {/* 1. Header with Top Announcement Bar & Brand Nav */}
      <ModernHeader />

      <main className="flex-grow">
        {/* 2. Hero Banner Slider: 4 Banners Lộc Nam & Tùy Chỉnh */}
        <HomeHeroSlider />

        {/* 3. 4-Column Dark Value Proposition Bar */}
        <ModernFeatures />

        {/* 4. Highlight Categories: SẢN PHẨM NỔI BẬT */}
        <LocNamCategories />

        {/* 5. Favorite Products: SẢN PHẨM ĐƯỢC YÊU THÍCH */}
        <LocNamFavorites />

        {/* 6. Featured Projects: DỰ ÁN & CÔNG TRÌNH TIÊU BIỂU */}
        <LocNamProjectsSection />

        {/* 7. Video Showcase: VIDEO SẢN PHẨM & QUY TRÌNH CHẾ TÁC */}
        <LocNamVideos />

        {/* 7. Real Projects & Customer Testimonials: DỰ ÁN & ĐÁNH GIÁ KHÁCH HÀNG */}
        <LocNamBrandEssence />

        {/* 8. Showrooms & Facilities: HỆ THỐNG CƠ SỞ ĐỒ ĐỒNG LỘC NAM */}
        <LocNamPartners />
      </main>

      {/* 9. Footer */}
      <ModernFooter />

      {/* 10. Floating Contact Button */}
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
