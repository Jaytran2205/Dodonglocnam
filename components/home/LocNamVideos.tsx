"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Video as VideoIcon,
  Sparkles,
  ExternalLink,
  X,
  Eye,
  Clock,
  ChevronDown,
} from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  image: string;
  videoUrl?: string;
  embedUrl?: string;
  desc: string;
  active?: boolean;
}

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
    desc: "Từng đường nét hoa văn chạm tỉ mỉ bằng tay thể hiện tay nghề thượng thừa của nghệ nhân đúc đồng Lộc Nam.",
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

function getEmbedUrl(url: string): { type: "youtube" | "video"; src: string } {
  if (!url) return { type: "youtube", src: "" };

  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`,
    };
  }

  if (url.includes("youtube.com/embed")) {
    const src = url.includes("autoplay=1")
      ? url
      : `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;
    return { type: "youtube", src };
  }

  return { type: "video", src: url };
}

export function LocNamVideos() {
  const [videos, setVideos] = useState<VideoItem[]>(defaultVideos);
  const [sectionMeta, setSectionMeta] = useState({
    subtitle: "THƯ VIỆN VIDEO THỰC TẾ",
    title: "VIDEO QUY TRÌNH CHẾ TÁC & SẢN PHẨM",
    desc: "Kênh truyền hình & tư liệu trực quan giúp quý khách an tâm tuyệt đối về chất lượng đúc đồng thủ công của Đồ Đồng Lộc Nam.",
  });

  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    url: string;
  } | null>(null);

  const [showAllMobile, setShowAllMobile] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          if (s.video_section_subtitle || s.video_section_title || s.video_section_desc) {
            setSectionMeta({
              subtitle: s.video_section_subtitle || "THƯ VIỆN VIDEO THỰC TẾ",
              title: s.video_section_title || "VIDEO QUY TRÌNH CHẾ TÁC & SẢN PHẨM",
              desc:
                s.video_section_desc ||
                "Kênh truyền hình & tư liệu trực quan giúp quý khách an tâm tuyệt đối về chất lượng đúc đồng thủ công của Đồ Đồng Lộc Nam.",
            });
          }
          if (s.home_videos) {
            try {
              const parsed = JSON.parse(s.home_videos);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const activeOnes = parsed.filter((v: any) => v.active !== false);
                if (activeOnes.length > 0) {
                  setVideos(activeOnes);
                }
              }
            } catch (err) {
              console.error("Error parsing home_videos:", err);
            }
          }
        }
      })
      .catch((err) => console.error("Error loading video settings:", err));
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#f7f3ec] to-[#fbf9f5] py-10 sm:py-16 px-3.5 sm:px-6 lg:px-8 border-b border-[#ece5d8]">
      <div className="max-w-[1440px] mx-auto space-y-5 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="text-[#a67c2e] font-serif text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1.5 mb-0.5">
              <VideoIcon className="w-3.5 h-3.5 text-[#dfb755] flex-shrink-0" />
              <span>{sectionMeta.subtitle}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#1a2533] tracking-wide uppercase leading-tight">
              {sectionMeta.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] font-light max-w-2xl">
              {sectionMeta.desc}
            </p>
          </div>

          <Link
            href="/video"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c1825] hover:bg-[#1a2b3d] text-white hover:text-[#ffd700] text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 self-start sm:self-auto border border-[#1c2c3d]"
          >
            <span>Xem Tất Cả Video</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#dfb755]" />
          </Link>
        </div>

        {/* Video Cards Grid (Mobile shows 1 video by default, Expandable on click) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {videos.map((vid, idx) => {
            const isHiddenOnMobile = idx > 0 && !showAllMobile;
            const targetUrl = vid.videoUrl || vid.embedUrl || "";

            return (
              <div
                key={vid.id || idx}
                onClick={() =>
                  setSelectedVideo({
                    id: vid.id || String(idx),
                    title: vid.title,
                    url: targetUrl,
                  })
                }
                className={`${
                  isHiddenOnMobile ? "hidden sm:flex" : "flex"
                } group bg-white rounded-2xl overflow-hidden border border-[#e8dfd1] hover:border-[#c59b4e] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex-col justify-between cursor-pointer animate-fadeIn`}
              >
                <div>
                  {/* Video Thumbnail with Play Button Overlay */}
                  <div className="aspect-[16/10] overflow-hidden bg-[#0c1825] relative border-b border-[#f1ebe1]">
                    <img
                      src={vid.image || "/images/hero_golden_ship.jpg"}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors pointer-events-none" />

                    {/* Category Badge */}
                    <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-black tracking-wider bg-[#0c1825]/90 text-[#dfb755] border border-[#dfb755]/50 backdrop-blur-sm shadow-md uppercase">
                      {vid.category || "QUY TRÌNH CHẾ TÁC"}
                    </span>

                    {/* Play Icon Circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0c1420] flex items-center justify-center shadow-[0_4px_20px_rgba(223,183,85,0.6)] group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {vid.duration && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 text-white text-[10px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#dfb755]" />
                        <span>{vid.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Video Content */}
                  <div className="p-3.5 sm:p-4.5 space-y-1.5 sm:space-y-2 text-left">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#0c1825] group-hover:text-[#b8860b] transition-colors leading-snug line-clamp-2">
                      {vid.title}
                    </h3>

                    <p className="text-xs text-[#64748b] font-light leading-relaxed line-clamp-2">
                      {vid.desc}
                    </p>
                  </div>
                </div>

                {/* Video Footer Action */}
                <div className="p-3.5 sm:p-4 pt-0 flex items-center justify-between text-xs border-t border-[#f1ebe1] pt-3">
                  <span className="text-[11px] text-[#64748b] flex items-center gap-1 font-medium">
                    <Eye className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span>{vid.views || "15.000"} lượt xem</span>
                  </span>
                  <span className="text-xs font-bold text-[#b8860b] group-hover:underline flex items-center gap-1">
                    <span>Phát video</span>
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Expand / Collapse Button & View All Link */}
        <div className="sm:hidden space-y-2 pt-1">
          {videos.length > 1 && (
            <button
              onClick={() => setShowAllMobile(!showAllMobile)}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#fbf9f4] border-2 border-[#dfb755]/70 text-[#0c1825] font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation min-h-[44px]"
            >
              <span>
                {showAllMobile
                  ? "Thu gọn bớt video"
                  : `Xem thêm video khác (${videos.length - 1} video)`}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#b8860b] transition-transform duration-300 ${
                  showAllMobile ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          <Link
            href="/video"
            className="w-full py-2.5 px-4 rounded-xl bg-[#0c1825] text-white hover:text-[#ffd700] font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-manipulation text-center"
          >
            <span>Tất cả video xưởng Lộc Nam</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#dfb755]" />
          </Link>
        </div>
      </div>

      {/* Video Popup Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-[96vw] sm:max-w-4xl bg-[#0c1825] rounded-2xl overflow-hidden border-2 border-[#c59b4e]/60 shadow-2xl space-y-3 p-3.5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1c2c3d]">
              <div className="font-serif font-bold text-xs sm:text-base text-white line-clamp-1 pr-3">
                {selectedVideo.title}
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                aria-label="Đóng video"
                className="w-8 h-8 rounded-full bg-[#122336] text-white hover:text-[#dfb755] flex items-center justify-center transition-colors flex-shrink-0 border border-[#1c2c3d] touch-manipulation cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player: Native Video or YouTube Iframe */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner flex items-center justify-center">
              {(() => {
                const media = getEmbedUrl(selectedVideo.url);
                if (media.type === "video") {
                  return (
                    <video
                      src={media.src}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    >
                      Trình duyệt không hỗ trợ thẻ video này.
                    </video>
                  );
                }
                return (
                  <iframe
                    src={media.src}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
