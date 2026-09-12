import { LocNamPartners } from "@/components/home/LocNamPartners";
import React from "react";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { ContactForm } from "@/components/contact/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Liên Hệ Xưởng Đúc Đồ Đồng Lộc Nam | Hotline 0846 699 997",
  description:
    "Liên hệ Đồ Đồng Lộc Nam để nhận tư vấn và báo giá trực tiếp đồ thờ cúng, đúc tượng chân dung, tranh đồng dát vàng và quà tặng mạ vàng 24k. Showroom tại Hà Nội và xưởng đúc tại Ý Yên, Nam Định.",
  keywords: [
    "liên hệ đồ đồng lộc nam",
    "địa chỉ xưởng đúc đồng ý yên",
    "showroom đồ đồng lộc nam",
    "số điện thoại đúc đồng lộc nam",
    "báo giá đồ thờ bằng đồng",
  ].join(", "),
  alternates: {
    canonical: "https://www.quatanglocnam.com/lien-he",
  },
  openGraph: {
    title: "Liên Hệ Xưởng Đúc Đồ Đồng Lộc Nam | Hotline & Showroom",
    description:
      "Địa chỉ showroom Hà Nội và xưởng đúc truyền thống Ý Yên Nam Định của Đồ Đồng Lộc Nam.",
    url: "https://www.quatanglocnam.com/lien-he",
    siteName: "Đồ Đồng Lộc Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/hero_golden_ship.jpg",
        width: 1200,
        height: 630,
        alt: "Liên hệ Đồ Đồng Lộc Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liên Hệ Xưởng Đúc Đồ Đồng Lộc Nam | Hotline & Showroom",
    description:
      "Địa chỉ showroom Hà Nội và xưởng đúc truyền thống Ý Yên Nam Định của Đồ Đồng Lộc Nam.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      {/* Breadcrumb Schema for Google */}
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
          { name: "Liên Hệ", url: "https://www.quatanglocnam.com/lien-he" },
        ]}
      />

      <ModernHeader />

      <main className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-8 py-12 w-full">
        {/* Title Centered */}
        <div className="text-center mb-12">
          <div className="text-[#a67c2e] font-serif text-xs font-bold tracking-[0.2em] uppercase mb-1">
            THÔNG TIN LIÊN HỆ
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0c1825] tracking-wide uppercase">
            LIÊN HỆ ĐỒ ĐỒNG LỘC NAM
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] max-w-2xl mx-auto mt-2 font-light">
            Đội ngũ nghệ nhân Lộc Nam luôn sẵn sàng lắng nghe, tư vấn kích thước phong thủy và gửi báo giá chi tiết tới quý khách 24/7.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#c59b4e]"></div>
            <div className="w-2.5 h-2.5 bg-[#c59b4e] rotate-45"></div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#c59b4e]"></div>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Company Info */}
          <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d5bd] shadow-sm">
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#0c1825] uppercase tracking-wide">
                XƯỞNG ĐÚC ĐỒNG LỘC NAM
              </h2>
              <p className="text-xs text-[#a67c2e] font-serif mt-1 font-semibold">
                Tinh hoa làng nghề đúc đồng truyền thống Ý Yên, Nam Định
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#4b5563] leading-relaxed">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#b8860b] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#0c1825] block font-medium">Showroom Trưng Bày Hà Nội</strong>
                  <span>172 Lê Trọng Tấn, P. Khương Mai, Q. Thanh Xuân, Hà Nội</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#b8860b] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#0c1825] block font-medium">Xưởng Sản Xuất Trực Tiếp</strong>
                  <span>Làng nghề đúc đồng truyền thống Vạn Điểm, TT. Lâm, Ý Yên, Nam Định</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#b8860b] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#0c1825] block font-medium">Hotline Tư Vấn 24/7</strong>
                  <a href="tel:0846699997" className="hover:text-[#b8860b] font-bold text-[#b8860b] text-base">
                    0846 699 997
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#b8860b] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#0c1825] block font-medium">Hòm Thư Điện Tử</strong>
                  <a href="mailto:dodonglocnam1102@gmail.com" className="hover:text-[#b8860b]">
                    dodonglocnam1102@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#b8860b] shrink-0 mt-1" />
                <div>
                  <strong className="text-[#0c1825] block font-medium">Thời Gian Mở Cửa</strong>
                  <span>Thứ 2 – Chủ Nhật: 08:00 – 21:00 (Kể cả ngày lễ, Tết)</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#fbf9f5] rounded-xl border border-[#e2d5bd] flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#b8860b] shrink-0" />
              <p className="text-xs text-[#0c1825] font-serif font-bold">
                Cam kết phôi đồng thanh khiết 100% – Bảo hành trọn đời mọi sản phẩm.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
