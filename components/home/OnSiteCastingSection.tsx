"use client";

import React, { useState } from "react";
import { Bell, CheckCircle2, Phone, Sparkles, Send } from "lucide-react";
import { ConsultationModal } from "./ConsultationModal";

interface OnSiteCastingSectionProps {
  hotline?: string;
}

export function OnSiteCastingSection({ hotline = "0977.62.4444" }: OnSiteCastingSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const cleanPhone = hotline.replace(/\./g, "").replace(/\s/g, "");

  const commitments = [
    "Nấu và rót đồng trực tiếp tại khuôn viên chùa/công trình trước sự chứng kiến của Ban Trị Sự & Phật Tử.",
    "Khách hàng & phật tử tùy tâm bỏ Vàng, Bạc nguyên chất vào mẻ nấu đồng để tăng phúc đức.",
    "Âm thanh chuông đại hồng chung ngân vang, trầm ấm, độ ngân dài chuẩn âm thanh truyền thống.",
    "Nghệ nhân tay nghề 30+ năm trực tiếp tạo mẫu, chạm khắc bài vị, kệ chuông, chữ Hán sắc nét.",
  ];

  return (
    <>
      <section className="bg-[#2A1408] text-white py-14 px-4 sm:px-8 border-y-4 border-[#D6B86C] my-8 relative overflow-hidden">
        {/* Background Subtle Radial Glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E5A122]/15 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Image Showcase of Real Casting Site */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg overflow-hidden border-2 border-[#FFD700] shadow-2xl col-span-2 aspect-[16/9]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTrJEcLUMYnp_Lxlr9s3KdTG6bx57VuzUZ66lOlXUIXiKILkwOYLsRw69Pp8UTunG0tyGwUXNEU_xzCvxuhpmjsMuLj-sOaCiTkKweGCxauPCNisJHmY630D_4LvMKzNLW630h8aY--tMzRo553g5iIYuhuViASuKFhO1zaNTiPeZHi15S4QG2sCTdtuw5TIRWoaUn0w8rnjTyVepo51B2KeeljwQhkLYze4nZHSIbTbuXnzhzPD5VUA"
                  alt="Lễ đúc chuông tận nơi tại chùa"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="rounded-lg overflow-hidden border border-[#D6B86C] shadow-lg aspect-[4/3]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs0uIhuTl2qCxpyWrK_BKdgxWCbsWNI3-hgjzFAexflOsizAOnAuuz2EsfqX7eWCKcAyUknxYq0fDJsyfnxbQy0kh02-PkUC91A0_qHjLeOS0eoK-RQq1ybhx2z4Sq9nRpJ7gshFObztiWgg7dHKaUg2wxUKtgVyRgteow1CHmM3m9_km1BODx5nDzkzY0ou6aep7r6wUs73wOg8ZexjOdw4mzdTCgMPG05qgBZy06a4zGMrLrcQnDUw"
                  alt="Nghệ nhân rót đồng"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="rounded-lg overflow-hidden border border-[#D6B86C] shadow-lg aspect-[4/3]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzmklt7eRBjBIdojXLEHR-1b2XoOaDKROCA4XpnIBpWxY3MSRPgdTFpsi83lOToiaT7oMcPQqKHNj0MeEmeZZ_INNTGojHZodJj5DloUcr21QXfkwnHeW4zpqWTm5IxsMyxLkvpHqmot8UE-ajenviwqGcqjAl2OvSuZz9Yx7QdxFMbs4s3rMSwABtm0gDhQahExCIGaSC1xQwxwQDnUdwjWOHiP11vewTYgJmPbYf-TH0r5-RYSaauQ"
                  alt="Chuông đồng hoàn thiện"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Content & Value Commitments */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1a1a2e] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/50">
                <Bell className="w-3.5 h-3.5" />
                <span>DỊCH VỤ ĐẶC BIỆT CỦA XƯỞNG LỘC NAM</span>
              </div>

              <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-[#FFD700] leading-tight uppercase">
                DỊCH VỤ ĐÚC CHUÔNG ĐỒNG & TƯỢNG PHẬT TẬN NƠI
              </h2>

              <p className="text-xs sm:text-sm text-[#EBD18D] leading-relaxed">
                Xưởng Đúc Đồng Lộc Nam nhận đúc Đại Hồng Chung từ 50kg đến 10 tấn, tượng Phật kích thước lớn trực tiếp tại các chùa, đền, phủ, nhà thờ họ trên khắp 63 tỉnh thành.
              </p>

              {/* 4 Checkpoint points */}
              <div className="space-y-2.5 pt-2">
                {commitments.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-100 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#B89628] text-[#1a1a2e] text-xs sm:text-sm font-bold uppercase tracking-wider rounded shadow-lg border border-[#D4AF37] transition-all hover-lift flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Đăng Ký Đúc Tận Nơi</span>
                </button>

                <a
                  href={`tel:${cleanPhone}`}
                  className="px-6 py-3 bg-[#E5B842] hover:bg-[#FFD700] text-[#2A1408] text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded shadow-lg transition-all hover-lift flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Hotline: {hotline}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} productName="Dịch vụ đúc chuông & tượng Phật tận nơi" />
    </>
  );
}