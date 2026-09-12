import { LocNamPartners } from "@/components/home/LocNamPartners";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Bộ Sưu Tập Đồ Đồng & Quà Tặng Mạ Vàng Độc Bản | Đồ Đồng Lộc Nam",
  description:
    "Khám phá các bộ sưu tập đồ đồng nghệ thuật độc bản: mô hình thuyền buồm mạ vàng 24k, tượng linh vật phong thủy, tranh đồng dát vàng và trống đồng Đông Sơn từ nghệ nhân Đồ Đồng Lộc Nam.",
  keywords: [
    "bộ sưu tập đồ đồng",
    "quà tặng mạ vàng 24k",
    "thuyền buồm mạ vàng",
    "tượng linh vật phong thủy",
    "trống đồng đông sơn",
    "đồ đồng lộc nam",
  ].join(", "),
  alternates: {
    canonical: "https://www.quatanglocnam.com/bo-suu-tap",
  },
  openGraph: {
    title: "Bộ Sưu Tập Đồ Đồng & Quà Tặng Mạ Vàng Độc Bản | Đồ Đồng Lộc Nam",
    description:
      "Tuyển tập các tuyệt tác đồng đúc thủ công và quà tặng mạ vàng sang trọng của xưởng Lộc Nam.",
    url: "https://www.quatanglocnam.com/bo-suu-tap",
    siteName: "Đồ Đồng Lộc Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/cat_lanh_dao.jpg",
        width: 1200,
        height: 630,
        alt: "Bộ sưu tập Đồ Đồng Lộc Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bộ Sưu Tập Đồ Đồng & Quà Tặng Mạ Vàng Độc Bản | Đồ Đồng Lộc Nam",
    description:
      "Tuyển tập các tuyệt tác đồng đúc thủ công và quà tặng mạ vàng sang trọng của xưởng Lộc Nam.",
  },
};

const collections = [
  {
    title: "MÔ HÌNH THUYỀN BUỒM 24K",
    subtitle: "Biểu tượng phong thủy thuận buồm xuôi gió doanh nhân",
    image: "/images/cat_lanh_dao.jpg",
    href: "/san-pham/qua-tang-dong",
  },
  {
    title: "TƯỢNG LINH VẬT PHONG THỦY",
    subtitle: "Rồng uy nghi, ngựa phi nước đại, tỳ hưu chiêu tài",
    image: "/images/cat_doanh_nghiep.jpg",
    href: "/san-pham/tuong-dong",
  },
  {
    title: "TƯỢNG PHẬT & THÁNH NHÂN",
    subtitle: "Tượng Phật Di Lặc, tượng Bác Hồ & Quốc Công Tiết Chế",
    image: "/images/cat_phong_thuy.jpg",
    href: "/san-pham/tuong-dong",
  },
  {
    title: "TRANH ĐỒNG DÁT VÀNG",
    subtitle: "Tranh Vinh Hoa Phú Quý, Mã Đáo Thành Công mạ vàng 24k",
    image: "/images/cat_my_nghe.jpg",
    href: "/san-pham/qua-tang-dong",
  },
  {
    title: "TRỐNG ĐỒNG ĐÔNG SƠN",
    subtitle: "Quả trống đồng quà tặng lưu niệm ngoại giao cao cấp",
    image: "/images/cat_khai_truong.jpg",
    href: "/san-pham/duc-chuong-cong-trinh",
  },
  {
    title: "MẶT TRỐNG ĐỒNG KHUNG GỖ",
    subtitle: "Tranh mặt trống đồng trang trí phòng lãnh đạo, cơ quan",
    image: "/images/prod_mat_trong.jpg",
    href: "/san-pham/duc-chuong-cong-trinh",
  },
];

export default function CollectionPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      {/* Breadcrumb Schema for Google */}
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
          { name: "Bộ Sưu Tập", url: "https://www.quatanglocnam.com/bo-suu-tap" },
        ]}
      />

      <ModernHeader />

      <main className="mx-auto max-w-[1440px] px-4 sm:px-8 py-12 w-full flex-grow">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fdf8ee] text-[#b8860b] border border-[#e2d5bd] text-xs font-serif font-bold uppercase rounded-full mb-3 tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BỘ SƯU TẬP ĐỘC BẢN</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#0c1825]">
            TUYỆT TÁC CHẾ TÁC LỘC NAM
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] max-w-2xl mx-auto mt-2 font-light">
            Tuyển chọn những tác phẩm nghệ thuật mạ vàng và đúc đồng thủ công đạt chuẩn mực cao nhất về thần thái và độ hoàn thiện.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#c59b4e]"></div>
            <div className="w-2.5 h-2.5 bg-[#c59b4e] rotate-45"></div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#c59b4e]"></div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-xl border border-[#e2d5bd] bg-[#0c1825] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#b8860b]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1825] via-transparent to-transparent" />
              </div>
              <div className="p-5 flex items-center justify-between bg-[#0b1622] border-t border-[#1c2c3d]">
                <div>
                  <h2 className="font-serif text-sm sm:text-base font-bold uppercase tracking-wider text-[#f1f5f9] group-hover:text-[#d4af37] transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs text-[#94a3b8] font-light mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#d4af37] transition group-hover:translate-x-1 shrink-0" />
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
