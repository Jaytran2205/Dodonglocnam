import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { projectsData } from "@/data/projects";
import { Calendar, MapPin, Building2, ArrowRight, ShieldCheck, Award, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Dự Án Công Trình Đúc Đồng Tiêu Biểu | Đồ Đồng Lộc Nam",
  description:
    "Tổng hợp các dự án công trình đúc đồng tiêu biểu của xưởng Đúc Đồng Lộc Nam: đúc chuông Đại Hồng Chung, tượng đài Bác Hồ, biển đồng công trình cầu đường, quà tặng doanh nghiệp và không gian thờ cúng gia tiên trên toàn quốc.",
  keywords: "dự án đúc đồng, công trình đồ đồng, đúc chuông đồng lộc nam, tượng đài bác hồ, đồ đồng lộc nam nam định",
  openGraph: {
    title: "Dự Án Công Trình Tiêu Biểu | Đồ Đồng Lộc Nam",
    description: "Tổng hợp các dự án công trình đúc đồng thực tế tiêu biểu của xưởng Đồ Đồng Lộc Nam.",
    images: [{ url: "/images/du_an/bien-dong-cau-cha-la-ninh-binh.jpg" }],
  },
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      <ModernHeader />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="relative bg-[#0c1825] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b-2 border-[#b8860b]">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#dfb755_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-[1440px] mx-auto relative z-10 text-center">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-[0.25em] text-[#ffd700] uppercase mb-3 bg-[#dfb755]/15 px-4 py-1 rounded-full border border-[#dfb755]/40">
              Hồ Sơ Năng Lực & Công Trình
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
              DỰ ÁN ĐÚC ĐỒNG TIÊU BIỂU
            </h1>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              Minh chứng thực tế cho năng lực chế tác đỉnh cao từ xưởng Đồ Đồng Lộc Nam – Ý Yên, Nam Định. Hàng trăm công trình đại hồng chung, tượng đài danh nhân, biển đồng và quà tặng cấp cao trên toàn quốc.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8 pt-8 border-t border-[#1e344d]">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-black text-[#ffd700]">500+</div>
                <div className="text-[11px] sm:text-xs text-[#94a3b8] mt-0.5">Dự án và sản phẩm</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-black text-[#ffd700]">100%</div>
                <div className="text-[11px] sm:text-xs text-[#94a3b8] mt-0.5">Đồng đỏ thanh khiết</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-black text-[#ffd700]">63</div>
                <div className="text-[11px] sm:text-xs text-[#94a3b8] mt-0.5">Tỉnh thành phủ sóng</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-black text-[#ffd700]">Trọn Đời</div>
                <div className="text-[11px] sm:text-xs text-[#94a3b8] mt-0.5">Bảo hành chất lượng</div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e2d5bd] gap-4">
            <div>
              <span className="text-xs font-bold text-[#b8860b] uppercase tracking-wider block mb-1">
                Hiện thực hóa mọi ý tưởng
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0c1825]">
                Tất Cả Dự Án Thực Tế
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projectsData.map((project) => (
              <article
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#e2d5bd] shadow-sm hover:shadow-xl hover:border-[#b8860b] transition-all duration-300 flex flex-col group"
              >
                {/* Image Box with zoom */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#081018]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#0c1825]/85 backdrop-blur-sm text-[#ffd700] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#dfb755]/40">
                    {project.category}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-[#6b7280] mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#b8860b]" />
                        {project.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#b8860b]" />
                        {project.location}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#0c1825] group-hover:text-[#b8860b] transition-colors leading-snug line-clamp-2">
                      <Link href={`/du-an/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#4b5563] mt-2 line-clamp-3 leading-relaxed">
                      {project.desc}
                    </p>
                  </div>

                  {/* Client & Action */}
                  <div className="pt-3 border-t border-[#f1e8d9] flex items-center justify-between">
                    <div className="text-[11px] text-[#6b7280] flex items-center gap-1.5 truncate mr-2">
                      <Building2 className="w-3.5 h-3.5 text-[#b8860b] flex-shrink-0" />
                      <span className="truncate font-medium">{project.client}</span>
                    </div>

                    <Link
                      href={`/du-an/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#b8860b] group-hover:translate-x-1 transition-transform flex-shrink-0"
                    >
                      <span>Chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Consulting CTA Section */}
        <section className="bg-[#0c1825] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-[#b8860b]">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#ffd700]">
              BẠN CÓ NHU CẦU THIẾT KẾ & ĐÚC ĐỒNG CÔNG TRÌNH?
            </h3>
            <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-2xl mx-auto leading-relaxed">
              Xưởng Đồ Đồng Lộc Nam nhận đúc tượng đài cỡ lớn, đại hồng chung cho nhà chùa, biển đồng công trình, mô hình quà tặng doanh nghiệp theo yêu cầu riêng với cam kết chất lượng chuẩn đồng thanh khiết 100%.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a
                href="tel:0846699997"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#dfb755] via-[#ffd700] to-[#b8860b] text-[#0c1825] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>HOTLINE TƯ VẤN: 0846 699 997</span>
              </a>
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-white/20 transition-all"
              >
                <span>GỬI YÊU CẦU BÁO GIÁ</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <ModernFooter />
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
