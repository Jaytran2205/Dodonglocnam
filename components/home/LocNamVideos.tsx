"use client";

import React, { useState } from "react";
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

export function LocNamVideos() {
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    embedUrl: string;
  } | null>(null);

  const [showAllMobile, setShowAllMobile] = useState(false);

  const videos = [
    {
      id: "v1",
      title: "Quy trình rót đồng đúc tượng Phật & Đại Hồng Chung tại xưởng",
      category: "XƯỞNG ĐÚC GIA TRUYỀN",
      duration: "08:45",
      views: "12,850",
      image: "/images/xuong_duc.jpg",
      youtubeId: "4eOyBmy9Epg",
      embedUrl: "https://www.youtube.com/embed/4eOyBmy9Epg?autoplay=1",
      desc: "Cận cảnh quy trình thợ lành nghề nấu đồng đỏ nguyên chất và rót khuôn đúc Đại Hồng Chung tại xưởng Lộc Nam.",
    },
    {
      id: "v2",
      title: "Nghệ thuật chế tác Mô hình Thuyền Buồm Mạ Vàng 24K thủ công",
      category: "QUÀ TẶNG MẠ VÀNG",
      duration: "06:12",
      views: "18,420",
      image: "/images/hero_golden_ship.jpg",
      youtubeId: "SgLqX9il5a8",
      embedUrl: "https://www.youtube.com/embed/SgLqX9il5a8?autoplay=1",
      desc: "Từng sợi dây buồm, mỏ neo và cánh buồm no gió được nghệ nhân ghép tay tỉ mỉ và mạ vàng điện phân 24k trường tồn.",
    },
    {
      id: "v3",
      title: "Đúc Tượng Chân Dung Truyền Thần bằng đồng đỏ giống 99%",
      category: "TƯỢNG TRUYỀN THẦN",
      duration: "10:30",
      views: "25,100",
      image: "/images/cat_phong_thuy.jpg",
      youtubeId: "ONd94hL1Afk",
      embedUrl: "https://www.youtube.com/embed/ONd94hL1Afk?autoplay=1",
      desc: "Quy trình đắp mẫu đất sét, chỉnh sửa thần thái khuôn mặt theo ảnh thật và đúc phôi đồng nguyên khối đỉnh cao.",
    },
    {
      id: "v4",
      title: "Trải nghiệm không gian trưng bày tại Showroom Đồ Đồng Lộc Nam",
      category: "HỆ THỐNG SHOWROOM",
      duration: "05:18",
      views: "9,640",
      image: "/images/showroom_1.jpg",
      youtubeId: "QwSbY31TVes",
      embedUrl: "https://www.youtube.com/embed/QwSbY31TVes?autoplay=1",
      desc: "Khám phá hàng trăm tác phẩm đồ thờ cúng ngũ sự, tranh dát vàng, trống đồng và quà tặng cao cấp tại showroom.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#f7f3ec] to-[#fbf9f5] py-10 sm:py-16 px-3.5 sm:px-6 lg:px-8 border-b border-[#ece5d8]">
      <div className="max-w-[1440px] mx-auto space-y-5 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="text-[#a67c2e] font-serif text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1.5 mb-0.5">
              <VideoIcon className="w-3.5 h-3.5 text-[#dfb755] flex-shrink-0" />
              <span>THƯ VIỆN VIDEO THỰC TẾ</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#1a2533] tracking-wide uppercase leading-tight">
              VIDEO QUY TRÌNH CHẾ TÁC & SẢN PHẨM
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] font-light max-w-2xl">
              Cận cảnh quy trình đúc đồng truyền thống, nghệ nhân chế tác tinh xảo và không gian trưng bày của Đồ Đồng Lộc Nam.
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

            return (
              <div
                key={vid.id}
                onClick={() =>
                  setSelectedVideo({
                    id: vid.id,
                    title: vid.title,
                    embedUrl: vid.embedUrl,
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
                      src={vid.image}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors pointer-events-none" />

                    {/* Category Badge */}
                    <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-black tracking-wider bg-[#0c1825]/90 text-[#dfb755] border border-[#dfb755]/50 backdrop-blur-sm shadow-md uppercase">
                      {vid.category}
                    </span>

                    {/* Play Icon Circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0c1825] flex items-center justify-center shadow-[0_4px_20px_rgba(223,183,85,0.6)] group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 text-white text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#dfb755]" />
                      <span>{vid.duration}</span>
                    </div>
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
                    <span>{vid.views} lượt xem</span>
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
          <button
            onClick={() => setShowAllMobile(!showAllMobile)}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#fbf9f4] border-2 border-[#dfb755]/70 text-[#0c1825] font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation min-h-[44px]"
          >
            <span>{showAllMobile ? "Thu gọn bớt video" : "Xem thêm video khác (3 video)"}</span>
            <ChevronDown
              className={`w-4 h-4 text-[#b8860b] transition-transform duration-300 ${
                showAllMobile ? "rotate-180" : ""
              }`}
            />
          </button>

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
                className="w-8 h-8 rounded-full bg-[#122336] text-white hover:text-[#dfb755] flex items-center justify-center transition-colors flex-shrink-0 border border-[#1c2c3d] touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Iframe */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={selectedVideo.embedUrl}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
