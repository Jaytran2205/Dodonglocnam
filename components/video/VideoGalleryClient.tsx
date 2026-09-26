"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  PlayCircle,
  Eye,
  Clock,
  X,
  ExternalLink,
  Film,
} from "lucide-react";

export interface VideoItem {
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

export function VideoGalleryClient({
  initialVideos,
}: {
  initialVideos: VideoItem[];
}) {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.home_videos) {
          try {
            const parsed = JSON.parse(data.settings.home_videos);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const activeOnes = parsed.filter((v: any) => v.active !== false);
              if (activeOnes.length > 0) {
                setVideos(activeOnes);
              }
            }
          } catch (e) {
            console.error("Error parsing home_videos:", e);
          }
        }
      })
      .catch((err) => console.error("Error fetching video settings:", err));
  }, []);

  return (
    <div>
      {/* Video Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {videos.map((video, idx) => {
          const targetUrl = video.videoUrl || video.embedUrl || "";

          return (
            <div
              key={video.id || idx}
              onClick={() =>
                setSelectedVideo({
                  id: video.id || String(idx),
                  title: video.title,
                  url: targetUrl,
                })
              }
              className="group overflow-hidden rounded-2xl border border-[#e2d5bd] bg-[#0c1825] shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-[#dfb755] flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#070c14]">
                  <img
                    src={video.image || "/images/hero_golden_ship.jpg"}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-95 group-hover:brightness-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#0c1825]/30 group-hover:bg-[#0c1825]/10 transition-colors" />

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider bg-[#0c1825]/90 text-[#dfb755] border border-[#dfb755]/50 backdrop-blur-sm shadow-md uppercase">
                    {video.category || "QUY TRÌNH CHẾ TÁC"}
                  </span>

                  {/* Play Icon Circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0c1825] shadow-[0_4px_20px_rgba(223,183,85,0.6)] group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                      <Play className="h-6 w-6 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/85 text-white text-[11px] font-bold flex items-center gap-1.5 shadow">
                      <Clock className="w-3.5 h-3.5 text-[#dfb755]" />
                      <span>{video.duration}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 bg-[#0b1622] space-y-2">
                  <h2 className="font-serif text-base sm:text-lg font-bold text-[#f1f5f9] group-hover:text-[#dfb755] transition-colors leading-snug line-clamp-2">
                    {video.title}
                  </h2>
                  {video.desc && (
                    <p className="text-xs sm:text-sm text-[#94a3b8] font-light leading-relaxed line-clamp-2">
                      {video.desc}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-5 py-3 bg-[#08101a] border-t border-[#1c2c3d] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#94a3b8] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#dfb755]" />
                  <span>{video.views || "15.000"} lượt xem</span>
                </span>
                <span className="text-xs font-bold text-[#dfb755] group-hover:underline flex items-center gap-1">
                  <span>Phát Video</span>
                  <Play className="w-3 h-3 fill-current" />
                </span>
              </div>
            </div>
          );
        })}
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
    </div>
  );
}
