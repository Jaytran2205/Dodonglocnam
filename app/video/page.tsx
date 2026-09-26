import { LocNamPartners } from "@/components/home/LocNamPartners";
import { Video as VideoIcon } from "lucide-react";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import prisma from "@/lib/prisma";
import { VideoGalleryClient, VideoItem } from "@/components/video/VideoGalleryClient";

export const revalidate = 300;

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

const defaultVideos: VideoItem[] = [
  {
    id: "v1",
    title: "Trực Tiếp Quy Trình Rót Đồng Đại Hồng Chung 1 Tấn - Chuông Đồng Đỏ Nguyên Chất Ý Yên",
    category: "QUY TRÌNH ĐÚC ĐỒNG",
    duration: "05:32",
    views: "15,420",
    image: "/images/videos/NUnVlHO1mEU.jpg",
    videoUrl: "https://www.youtube.com/watch?v=NUnVlHO1mEU",
    desc: "Cận cảnh quy trình nghệ nhân nấu đồng đỏ nguyên chất và rót khuôn đúc Tôn Tượng Phật & Đại Hồng Chung bằng đồng tại xưởng đúc đồng Lộc Nam.",
  },
  {
    id: "v2",
    title: "Nghệ Nhân Chạm Khắc Long Phụng Trên Bề Mặt Trống Đồng Đông Sơn - Tinh Xảo Từng Chi Tiết",
    category: "CHẠM KHẮC THỦ CÔNG",
    duration: "08:15",
    views: "28,910",
    image: "/images/videos/wmWQK2MBn3c.jpg",
    videoUrl: "https://www.youtube.com/watch?v=wmWQK2MBn3c",
    desc: "Từng đường nét hoa văn chạm tỉ mỉ bằng tay thể hiện tay nghề thượng thừa của nghệ nhân gia truyền.",
  },
  {
    id: "v3",
    title: "Hướng Dẫn Phân Biệt Đồng Thật Chuẩn Cát Tút Với Đồng Pha Kém Chất Lượng Ngoài Thị Trường",
    category: "KIẾN THỨC ĐỒ THỜ",
    duration: "04:45",
    views: "42,150",
    image: "/images/videos/o-vHwLilgjM.jpg",
    videoUrl: "https://www.youtube.com/watch?v=o-vHwLilgjM",
    desc: "Kinh nghiệm thực tế chọn đồng chuẩn, giữ màu bền đẹp hàng trăm năm không bị oxy hóa hay hoen gỉ.",
  },
  {
    id: "v4",
    title: "Bàn Giao Bộ Đỉnh Đồng Cát Tút Cao Cấp Cho Biệt Thự Gia Chủ Tại Starlake Tây Hồ",
    category: "BÀN GIAO CÔNG TRÌNH",
    duration: "06:20",
    views: "19,800",
    image: "/images/videos/ctwWCrZZwk4.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ctwWCrZZwk4",
    desc: "Trọn bộ đỉnh đồng cát tút ngũ sự an vị trang nghiêm trên ban thờ gia tiên của khách hàng VIP tại Hà Nội.",
  },
];

export default async function VideoPage() {
  let initialVideos = defaultVideos;
  try {
    const videoSetting = await prisma.setting.findUnique({
      where: { key: "home_videos" },
    });
    if (videoSetting?.value) {
      const parsed = JSON.parse(videoSetting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const activeOnes = parsed.filter((v: any) => v.active !== false);
        if (activeOnes.length > 0) {
          initialVideos = activeOnes;
        }
      }
    }
  } catch (err) {
    console.error("Error reading home_videos in VideoPage:", err);
  }

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

        <VideoGalleryClient initialVideos={initialVideos} />
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
