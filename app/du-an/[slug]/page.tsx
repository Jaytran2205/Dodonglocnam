import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { projectsData } from "@/data/projects";
import {
  Calendar,
  MapPin,
  Building2,
  ArrowLeft,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Hammer,
  Sparkles,
} from "lucide-react";

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const project = projectsData.find((p) => p.slug === params.slug);
  if (!project) {
    return { title: "Dự Án | Đồ Đồng Lộc Nam" };
  }

  return {
    title: `${project.title} | Đồ Đồng Lộc Nam`,
    description: project.desc,
    openGraph: {
      title: project.title,
      description: project.desc,
      images: [{ url: project.image }],
    },
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = projectsData.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = projectsData.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      <ModernHeader />

      <main className="flex-grow">
        {/* Breadcrumb Bar */}
        <div className="bg-[#081018] text-[#94a3b8] py-3.5 px-4 sm:px-6 lg:px-8 border-b border-[#1e344d]">
          <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-xs flex-wrap">
            <Link href="/" className="hover:text-[#ffd700] transition-colors">
              Trang Chủ
            </Link>
            <span>/</span>
            <Link href="/du-an" className="hover:text-[#ffd700] transition-colors">
              Dự Án
            </Link>
            <span>/</span>
            <span className="text-[#ffd700] truncate max-w-xs sm:max-w-md">{project.title}</span>
          </div>
        </div>

        {/* Project Header Banner */}
        <article className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Link
            href="/du-an"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#b8860b] hover:text-[#8c6508] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại tất cả dự án</span>
          </Link>

          {/* Category Tag & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#0c1825] text-[#ffd700] text-xs font-bold px-3 py-1 rounded-full border border-[#dfb755]/40">
              {project.category}
            </span>
            <span className="text-xs text-[#6b7280] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#b8860b]" />
              {project.date}
            </span>
            <span className="text-xs text-[#6b7280] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#b8860b]" />
              {project.location}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#0c1825] leading-snug sm:leading-tight mb-6">
            {project.title}
          </h1>

          {/* Project Summary Card */}
          <div className="bg-[#f5ebd7]/50 border border-[#dfb755]/60 rounded-2xl p-5 sm:p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#8c6508] font-bold block uppercase text-[10px] tracking-wider mb-1">
                Chủ đầu tư / Khách hàng
              </span>
              <p className="font-semibold text-[#0c1825] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#b8860b] flex-shrink-0" />
                <span>{project.client}</span>
              </p>
            </div>
            <div>
              <span className="text-[#8c6508] font-bold block uppercase text-[10px] tracking-wider mb-1">
                Địa điểm thi công
              </span>
              <p className="font-semibold text-[#0c1825] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#b8860b] flex-shrink-0" />
                <span>{project.location}</span>
              </p>
            </div>
            <div>
              <span className="text-[#8c6508] font-bold block uppercase text-[10px] tracking-wider mb-1">
                Đơn vị thực hiện
              </span>
              <p className="font-semibold text-[#0c1825] flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-[#b8860b] flex-shrink-0" />
                <span>Đồ Đồng Lộc Nam (Ý Yên, Nam Định)</span>
              </p>
            </div>
          </div>

          {/* Main Hero Photo */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-[#e2d5bd] mb-10 bg-[#081018]">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto max-h-[650px] object-cover mx-auto"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose prose-lg max-w-none text-[#2d3748] space-y-5 leading-relaxed text-sm sm:text-base mb-12">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0c1825] pb-2 border-b border-[#e2d5bd]">
              1. Thông Tin Chi Tiết Về Dự Án
            </h2>

            {project.content.map((paragraph, index) => (
              <p key={index} className="text-justify">
                {paragraph}
              </p>
            ))}

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0c1825] pt-4 pb-2 border-b border-[#e2d5bd]">
              2. Tiêu Chuẩn Kỹ Thuật & Cam Kết Chất Lượng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-6">
              <div className="p-4 rounded-xl bg-white border border-[#e2d5bd] shadow-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0c1825]">Nguyên Liệu Thanh Khiết</h4>
                  <p className="text-xs text-[#6b7280] mt-1">
                    Đồng đỏ dây điện, đồng catut vỏ đạn hoặc vàng quỳ 24k đạt chuẩn kiểm định cơ lý tính, không tạp chất.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#e2d5bd] shadow-sm flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0c1825]">Nghệ Nhân Làng Nghề Ý Yên</h4>
                  <p className="text-xs text-[#6b7280] mt-1">
                    Chế tác thủ công gia truyền từ đất tổ đúc đồng Ý Yên, Nam Định với hơn 900 năm bề dày lịch sử.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#e2d5bd] shadow-sm flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0c1825]">Bảo Hành Trọn Đời Chất Lượng Đồng</h4>
                  <p className="text-xs text-[#6b7280] mt-1">
                    Cam kết bảo hành phôi đồng trọn đời, chống nứt vỡ, phai màu hoặc bong tróc rỗ bề mặt.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#e2d5bd] shadow-sm flex items-start gap-3">
                <Building2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0c1825]">Khảo Sát & Lắp Đặt Toàn Quốc</h4>
                  <p className="text-xs text-[#6b7280] mt-1">
                    Hỗ trợ phương tiện chuyên dụng, cẩu tải và đội ngũ thợ bậc cao thi công an toàn trên 63 tỉnh thành.
                  </p>
                </div>
              </div>
            </div>

            {/* FULL PHOTO GALLERY (100% Photos from Project Folder) */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="my-10 pt-6 border-t border-[#e2d5bd] not-prose">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <span className="text-[11px] font-bold text-[#b8860b] uppercase tracking-wider block mb-0.5">
                      Tư liệu thực địa tại công trình
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0c1825]">
                      Bộ Sưu Tập Hình Ảnh Thi Công ({project.gallery.length} Hình Ảnh Thực Tế)
                    </h3>
                  </div>
                  <span className="text-xs text-[#8c6508] font-bold bg-[#f5ebd7] px-3.5 py-1.5 rounded-full border border-[#dfb755]/40 self-start sm:self-auto">
                    ✓ Đầy đủ 100% hình ảnh
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {project.gallery.map((imgUrl, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="group relative rounded-2xl overflow-hidden bg-[#0c1825] border border-[#e2d5bd] shadow-sm hover:shadow-xl hover:border-[#b8860b] transition-all duration-300"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={imgUrl}
                          alt={`${project.title} - Ảnh chi tiết ${imgIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute top-3 left-3 bg-[#0c1825]/85 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow">
                        Ảnh {imgIdx + 1} / {project.gallery.length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-8 border-t border-[#e2d5bd]">
            <span className="text-xs font-bold text-[#6b7280] mr-2">Từ khóa:</span>
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#e8ded1]/60 text-[#0c1825] px-3 py-1 rounded-md border border-[#dfb755]/30"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Contact Consultation Box */}
          <div className="my-10 p-6 sm:p-8 rounded-2xl bg-[#0c1825] text-white border border-[#b8860b] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#ffd700]">
                Cần Tư Vấn Thiết Kế Công Trình Tương Tự?
              </h3>
              <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-xl">
                Liên hệ ngay trực tiếp với Ban Quản Lý Dự Án của xưởng Đúc Đồng Lộc Nam để nhận khảo sát thực tế và báo giá chi tiết trong vòng 24 giờ.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="tel:0846699997"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0c1825] font-black text-xs sm:text-sm px-6 py-3 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>0846 699 997</span>
              </a>
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 transition-all"
              >
                <span>Gửi bản vẽ / Yêu cầu</span>
              </Link>
            </div>
          </div>

          {/* Related Projects */}
          <div className="mt-14 pt-10 border-t border-[#e2d5bd]">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0c1825] mb-6">
              Các Dự Án Tiêu Biểu Khác
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/du-an/${rel.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-[#e2d5bd] shadow-sm hover:shadow-lg hover:border-[#b8860b] transition-all group flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#081018]">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#b8860b] uppercase block mb-1">
                        {rel.category}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[#0c1825] group-hover:text-[#b8860b] transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#f1e8d9] flex items-center justify-between text-[11px] text-[#6b7280]">
                      <span>{rel.location}</span>
                      <span className="font-bold text-[#b8860b]">Xem ›</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>

      <ModernFooter />
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
