import { LocNamPartners } from "@/components/home/LocNamPartners";
import { PlayCircle, Video as VideoIcon } from "lucide-react";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Thư Viện Video Quy Trình Đúc Đồng & Chế Tác Quà Tặng | Đồ Đồng Lộc Nam",
  description:
    "Xem video cận cảnh quy trình đúc tượng đồng chân dung, làm khuôn đúc chuông đồng, chạm khảm đồ thờ cúng và mạ vàng 24k tại xưởng Đồ Đồng Lộc Nam Ý Yên Nam Định.",
  keywords: [
    "video đúc đồng",
    "video quy trình đúc tượng",
    "video đồ thờ cúng",
    "video quà tặng mạ vàng",
    "đồ đồng lộc nam",
  ].join(", "),
  alternates: {
    canonical: "https://www.quatanglocnam.com/video",
  },
  openGraph: {
    title: "Thư Viện Video Quy Trình Đúc Đồng | Đồ Đồng Lộc Nam",
    description:
      "Video thực tế quy trình đúc đồng truyền thống và chế tác quà tặng cao cấp mạ vàng 24k.",
    url: "https://www.quatanglocnam.com/video",
    siteName: "Đồ Đồng Lộc Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/hero_golden_ship.jpg",
        width: 1200,
        height: 630,
        alt: "Video Đồ Đồng Lộc Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thư Viện Video Quy Trình Đúc Đồng | Đồ Đồng Lộc Nam",
    description:
      "Video thực tế quy trình đúc đồng truyền thống và chế tác quà tặng cao cấp mạ vàng 24k.",
  },
};

const videos = [
  {
    title: "Trải nghiệm không gian trưng bày và sản phẩm Lộc Nam",
    image: "/images/hero_golden_ship.jpg",
    href: "https://www.youtube.com/watch?v=4eOyBmy9Epg",
  },
  {
    title: "Quy trình chế tác thuyền buồm phong thủy mạ vàng 24k",
    image: "/images/cat_lanh_dao.jpg",
    href: "https://www.youtube.com/watch?v=SgLqX9il5a8&t=2s",
  },
  {
    title: "Nghệ thuật đúc tượng đồng truyền thần giống thật 99%",
    image: "/images/cat_phong_thuy.jpg",
    href: "https://www.youtube.com/watch?v=ONd94hL1Afk",
  },
  {
    title: "Bộ sưu tập trống đồng Đông Sơn và mặt trống phong thủy",
    image: "/images/cat_khai_truong.jpg",
    href: "https://www.youtube.com/watch?v=QwSbY31TVes&t=1s",
  },
];

export default function VideoPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] text-[#1a1a1a]">
      {/* Breadcrumb Schema for Google */}
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
          { name: "Video", url: "https://www.quatanglocnam.com/video" },
        ]}
      />

      <ModernHeader />

      <main className="mx-auto max-w-[1440px] px-4 sm:px-8 py-12 w-full flex-grow">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fdf8ee] text-[#b8860b] border border-[#e2d5bd] text-xs font-serif font-bold uppercase rounded-full mb-3 tracking-widest">
            <VideoIcon className="w-3.5 h-3.5" />
            <span>THƯ VIỆN VIDEO THỰC TẾ</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#0c1825]">
            VIDEO SẢN PHẨM & QUY TRÌNH CHẾ TÁC
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] max-w-2xl mx-auto mt-2 font-light">
            Ghi lại chân thực quy trình lao động sáng tạo của nghệ nhân đúc đồng Lộc Nam tại làng nghề Ý Yên, Nam Định.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#c59b4e]"></div>
            <div className="w-2.5 h-2.5 bg-[#c59b4e] rotate-45"></div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#c59b4e]"></div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {videos.map((video) => (
            <a
              key={video.title}
              href={video.href}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-xl border border-[#e2d5bd] bg-[#0c1825] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#b8860b]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={video.image}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#0c1825]/30 group-hover:bg-[#0c1825]/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#b8860b] text-white shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="h-8 w-8" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[#0b1622] border-t border-[#1c2c3d]">
                <h2 className="font-serif text-sm sm:text-base font-bold uppercase tracking-wide text-[#f1f5f9] group-hover:text-[#d4af37] transition-colors">
                  {video.title}
                </h2>
              </div>
            </a>
          ))}
        </div>
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
