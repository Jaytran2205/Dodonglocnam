"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Award, CheckCircle, Phone, ArrowRight } from "lucide-react";

export function ArtisanSection() {
  const [data, setData] = useState({
    artisan_name: "Nghệ Nhân Dương Bá Tiến",
    artisan_title: "Làng nghề đúc đồng Vạn Điểm, Ý Yên",
    artisan_company: "CÔNG TY TNHH CƠ KHÍ ĐÚC LỘC NAM",
    artisan_desc:
      "Trải qua nhiều thế hệ gìn giữ và phát triển tại cái nôi làng nghề đúc đồng Vạn Điểm (Thị trấn Lâm, Ý Yên, Nam Định), Đồ Đồng Lộc Nam dưới sự dẫn dắt của Nghệ nhân Dương Bá Tiến đã chế tác hàng vạn kiệt tác đồ thờ cúng gia tiên, tượng Phật đại bi, đại hồng chung cho các ngôi chùa danh tiếng khắp đất nước.",
    artisan_image: "/images/artisan-foundry.jpg",
    hotline: "0836 122 222",
    hotline2: "0846 699 997",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.settings) {
          const s = resData.settings;
          setData((prev) => ({
            ...prev,
            artisan_name: s.artisan_name || prev.artisan_name,
            artisan_title: s.artisan_title || prev.artisan_title,
            artisan_company: s.artisan_company || prev.artisan_company,
            artisan_desc: s.artisan_desc || prev.artisan_desc,
            artisan_image: s.artisan_image || prev.artisan_image,
            hotline: s.hotline || prev.hotline,
            hotline2: s.hotline2 || prev.hotline2,
          }));
        }
      })
      .catch((e) => console.error("Error fetching artisan settings:", e));
  }, []);

  const cleanPhone1 = data.hotline.replace(/\D/g, "") || "0836122222";
  const cleanPhone2 = data.hotline2.replace(/\D/g, "") || "0846699997";

  return (
    <section className="w-full bg-[#F4EDE0] py-12 lg:py-16 border-y border-[#E5DAC3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Artisan & Workshop Image */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-sm border-2 border-[#8B6B38]/40 overflow-hidden shadow-lg aspect-[4/3] bg-[#FAF6ED]">
              <img
                src={data.artisan_image}
                alt={data.artisan_name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Experience Box */}
            <div className="absolute -bottom-4 -right-4 bg-[#3A2418] text-white p-4 rounded-sm shadow-xl border border-[#8B6B38] hidden sm:block">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-[#C5A876]" />
                <div>
                  <span className="font-serif font-bold text-sm block">{data.artisan_name}</span>
                  <span className="text-[11px] text-[#C5A876]">{data.artisan_title}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Story & Quality Promise */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-[#8B6B38] text-xs uppercase tracking-wider font-semibold">
              <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
              <span>Di Sản Đúc Đồng Truyền Thống</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] leading-tight uppercase">
              {data.artisan_company}
            </h2>

            <p className="text-xs sm:text-sm text-[#5C4535] leading-relaxed">
              {data.artisan_desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-[#5C4535]">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#8B6B38] shrink-0 mt-0.5" />
                <span>Phân xưởng sản xuất quy mô lớn tại Ý Yên</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#8B6B38] shrink-0 mt-0.5" />
                <span>Cam kết 100% đồng thanh khiết, không pha tạp chất</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#8B6B38] shrink-0 mt-0.5" />
                <span>Nghệ nhân khảm ngũ sắc, dát vàng 9999 đỉnh cao</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#8B6B38] shrink-0 mt-0.5" />
                <span>Bảo hành trọn đời độ bền màu và chất lượng đồng</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/gioi-thieu"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7B1E2B] hover:bg-[#611722] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
              >
                <span>Tìm Hiểu Về Xưởng Sản Xuất</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={`tel:${cleanPhone1}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF6ED] text-[#3A2418] border border-[#8B6B38] text-xs font-bold uppercase tracking-wider hover:bg-[#EAE0CF] transition-colors rounded-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#8B6B38]" />
                <span>{data.hotline}</span>
              </a>

              <a
                href={`tel:${cleanPhone2}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF6ED] text-[#3A2418] border border-[#8B6B38] text-xs font-bold uppercase tracking-wider hover:bg-[#EAE0CF] transition-colors rounded-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#8B6B38]" />
                <span>{data.hotline2}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}