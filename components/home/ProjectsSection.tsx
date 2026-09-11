import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle2 } from "lucide-react";

export function ProjectsSection() {
  const projects = [
    {
      title: "Dự Án Đúc Đại Hồng Chung 2.5 Tấn Tại Chùa Phúc Lâm",
      location: "Bắc Ninh",
      year: "2026",
      desc: "Nấu và rót đồng trực tiếp tại khuôn viên chùa trước sự chứng kiến của hàng ngàn tăng ni phật tử. Tiếng chuông ngân vang trầm ấm.",
      image: "/images/project-chua-phuc-lim.jpg",
    },
    {
      title: "Đúc Tượng Phật Thích Ca Mâu Ni 3m Đồng Đỏ Nguyên Khối",
      location: "Thiền Viện Trúc Lâm",
      year: "2025",
      desc: "Pho đại tượng Phật nặng 4.5 tấn, diện mạo trang nghiêm từ bi, chạm khắc hoa văn hoa sen và ánh hào quang sắc nét.",
      image: "/images/project-thich-ca-3m.jpg",
    },
    {
      title: "Thi Công Trọn Gói Không Gian Thờ Gia Tộc Họ Nguyễn",
      location: "Hà Đông, Hà Nội",
      year: "2025",
      desc: "Cung cấp bộ đồ thờ thất lân vờn cầu khảm ngũ sắc 70cm, đôi hạc chầu 1m80 và bộ hoành phi câu đối đồng vàng dát vàng 9999.",
      image: "/images/project-gia-toc-nguyen.jpg",
    },
    {
      title: "Chế Tác 100 Bộ Trống Đồng Đông Sơn Mạ Vàng 24K Ngoại Giao",
      location: "Hà Nội",
      year: "2026",
      desc: "Quà tặng lưu niệm cấp cao phục vụ Hội nghị Thượng đỉnh Doanh nghiệp Quốc tế kèm hộp gỗ nhung và chứng chỉ vàng 24k.",
      image: "/images/project-trong-dong-ngoai-giao.jpg",
    },
  ];

  return (
    <section className="w-full bg-[#FAF6ED] py-12 lg:py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E5DAC3]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#8B6B38] text-xs uppercase tracking-wider font-semibold mb-1">
            <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
            <span>Hồ Sơ Năng Lực Thực Tế</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] uppercase tracking-wide">
            DỰ ÁN & CÔNG TRÌNH TIÊU BIỂU
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5342] mt-1">
            Những công trình đúc chuông đình chùa và không gian thờ gia tiên do Đồ Đồng Lộc Nam trực tiếp thi công
          </p>
        </div>

        <Link
          href="/lien-he"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#7B1E2B] hover:text-[#611722] border border-[#8B6B38]/60 bg-[#F4EDE0] hover:bg-[#EAE0CF] px-4 py-2 rounded-sm transition-colors shadow-sm"
        >
          <span>Xem Tất Cả Dự Án</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((item, idx) => (
          <div
            key={idx}
            className="group bg-[#F4EDE0] border border-[#E5DAC3] rounded-sm overflow-hidden hover-lift flex flex-col justify-between shadow-sm hover:border-[#8B6B38] transition-all duration-300"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-[#FAF6ED] relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#3A2418]/90 text-white text-[10px] font-bold uppercase rounded-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C5A876]" />
                  <span>{item.location}</span>
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-serif font-bold text-sm text-[#3A2418] group-hover:text-[#7B1E2B] line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B5342] line-clamp-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-[#E5DAC3]/50 mt-auto">
              <span className="text-[11px] font-semibold text-[#8B6B38] flex items-center gap-1 pt-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Hoàn thành {item.year}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}