import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";

export function NewsSection() {
  const articles = [
    {
      title: "Cách Bài Trí Bàn Thờ Gia Tiên Chuẩn Phong Thủy Đón Tài Lộc",
      slug: "cach-bai-tri-ban-tho-gia-tien-chuan-phong-thuy",
      date: "24/08/2026",
      desc: "Hướng dẫn chi tiết vị trí đặt bát hương, đỉnh đồng, đôi hạc thờ theo đúng nguyên tắc âm dương ngũ hành.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs0uIhuTl2qCxpyWrK_BKdgxWCbsWNI3-hgjzFAexflOsizAOnAuuz2EsfqX7eWCKcAyUknxYq0fDJsyfnxbQy0kh02-PkUC91A0_qHjLeOS0eoK-RQq1ybhx2z4Sq9nRpJ7gshFObztiWgg7dHKaUg2wxUKtgVyRgteow1CHmM3m9_km1BODx5nDzkzY0ou6aep7r6wUs73wOg8ZexjOdw4mzdTCgMPG05qgBZy06a4zGMrLrcQnDUw",
    },
    {
      title: "Cách Phân Biệt Đồng Đỏ Nguyên Chất Và Đồng Pha Kém Chất Lượng",
      slug: "cach-phan-biet-dong-do-nguyen-chat",
      date: "20/08/2026",
      desc: "Những mẹo đơn giản từ nghệ nhân lão làng giúp gia chủ nhận biết đồng thật, thử âm thanh và độ nặng.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTrJEcLUMYnp_Lxlr9s3KdTG6bx57VuzUZ66lOlXUIXiKILkwOYLsRw69Pp8UTunG0tyGwUXNEU_xzCvxuhpmjsMuLj-sOaCiTkKweGCxauPCNisJHmY630D_4LvMKzNLW630h8aY--tMzRo553g5iIYuhuViASuKFhO1zaNTiPeZHi15S4QG2sCTdtuw5TIRWoaUn0w8rnjTyVepo51B2KeeljwQhkLYze4nZHSIbTbuXnzhzPD5VUA",
    },
    {
      title: "Ý Nghĩa Phong Thủy Của Tượng Quan Công Trảm Rồng Trong Nhà",
      slug: "y-nghia-phong-thuy-tuong-quan-cong-tram-rong",
      date: "15/08/2026",
      desc: "Tại sao các doanh nhân và quan chức thường thỉnh tượng Quan Công để phòng làm việc trấn trạch trừ tà.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzmklt7eRBjBIdojXLEHR-1b2XoOaDKROCA4XpnIBpWxY3MSRPgdTFpsi83lOToiaT7oMcPQqKHNj0MeEmeZZ_INNTGojHZodJj5DloUcr21QXfkwnHeW4zpqWTm5IxsMyxLkvpHqmot8UE-ajenviwqGcqjAl2OvSuZz9Yx7QdxFMbs4s3rMSwABtm0gDhQahExCIGaSC1xQwxwQDnUdwjWOHiP11vewTYgJmPbYf-TH0r5-RYSaauQ",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-8 max-w-container mx-auto">
      <div className="flex items-center justify-between border-b-2 border-[#8B1522] pb-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-3 h-8 bg-[#8B1522] rounded-sm"></div>
          <h2 className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-[#1a1a1a] uppercase tracking-wide">
            KIẾN THỨC PHONG THỦY & TIN TỨC
          </h2>
        </div>

        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#1a1a1a] hover:text-[#D4AF37]"
        >
          <span>Xem Tất Cả Tin Tức</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-[#D4AF37]/40 hover:border-[#D4AF37] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover-lift group flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-[#5C3015] font-medium">
                  <Calendar className="w-3 h-3 text-[#D4AF37]" />
                  <span>{item.date}</span>
                </div>

                <h3 className="font-serif font-bold text-sm sm:text-base text-[#1a1a1a] group-hover:text-[#D4AF37] line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#5C3015] line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <span className="text-[11px] font-bold text-[#D4AF37] group-hover:text-[#B89628] uppercase flex items-center gap-1">
                <span>Đọc bài viết</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}