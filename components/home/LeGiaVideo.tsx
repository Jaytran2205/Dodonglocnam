"use client";

import React, { useState } from "react";
import { Play, X } from "lucide-react";

export function LeGiaVideo() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const mainVideo = {
    title: "Trải nghiệm sản phẩm dịch vụ của Đồ Đồng Lộc Nam",
    image: "/images/trai-nghiem-san-pham-dich-vu-cua-le-gia.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  };

  const sideVideos = [
    {
      title: "Sản xuất quà lưu niệm sự kiện",
      image: "/images/trong-dong-luu-niem-cho-qua-su-kien.jpg",
    },
    {
      title: "Câu chuyện về quá trình đúc tượng chân dung của một vị khách",
      image: "/images/4.jpg",
    },
    {
      title: "Bộ Sưu Tập Các Mẫu Trống Đồng Của Lộc Nam",
      image: "/images/bo-suu-tap-trong-dong.jpg",
    },
  ];

  return (
    <section id="video-section" className="w-full bg-white py-14 px-4 sm:px-8 border-b-2 border-[#D4AF37]/30">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#D4AF37] tracking-widest uppercase">
            VIDEO
          </h2>
          {/* Gold flourish graphic */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <div className="w-6 h-6 border-2 border-[#D4AF37] rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#D4AF37]"></div>
            </div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>
        </div>

        {/* Video Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Large Video Left (7 cols) */}
          <div
            onClick={() => setActiveVideo(mainVideo.videoUrl)}
            className="lg:col-span-7 relative group cursor-pointer overflow-hidden rounded-xl border-2 border-[#D4AF37]/50 shadow-2xl bg-black aspect-[16/10]"
          >
            <img
              src={mainVideo.image}
              alt={mainVideo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D4AF37] text-[#26050B] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.6)] group-hover:scale-110 group-hover:bg-[#E53935] group-hover:text-white transition-all">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>
          </div>

          {/* 3 Small Videos Right (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {sideVideos.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveVideo(mainVideo.videoUrl)}
                className="group cursor-pointer flex items-center gap-4 bg-[#F7EBD4] border-2 border-[#D4AF37] hover:border-[#F3C85C] p-3 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)]"
              >
                {/* Thumbnail with Play Icon */}
                <div className="relative w-36 sm:w-40 aspect-[16/10] shrink-0 rounded-lg overflow-hidden bg-black border border-[#D4AF37]/50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#26050B] flex items-center justify-center shadow">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-bold text-xs sm:text-sm text-[#1a1a1a] group-hover:text-[#D4AF37] leading-snug line-clamp-2 transition-colors">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden border-2 border-[#D4AF37]">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 text-white hover:text-[#D4AF37] p-2 bg-black/60 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`${activeVideo}?autoplay=1`}
                title="Video Lộc Nam"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
