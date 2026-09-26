"use client";

import React, { useState, useRef } from "react";
import { Play } from "lucide-react";
import { isRawFilename } from "@/lib/videoUtils";
export { isRawFilename };

interface Props {
  url: string;
  title?: string;
}

export function ArticleVideoPlayer({ url, title }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const showCaption = title && !isRawFilename(title);

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-[#e2d5bd] bg-[#0c1825] shadow-xl max-w-3xl mx-auto not-prose">
      <div className="relative group/vid aspect-video w-full flex items-center justify-center bg-black overflow-hidden select-none">
        <video
          ref={videoRef}
          src={`${url}#t=0.1`}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-contain cursor-pointer"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={handlePlayToggle}
        >
          Trình duyệt của bạn không hỗ trợ phát thẻ video HTML5.
        </video>

        {!isPlaying && (
          <button
            type="button"
            onClick={handlePlayToggle}
            className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#dfb755] to-[#ffd700] text-[#0c1420] flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white z-10 cursor-pointer pointer-events-auto"
            aria-label="Phát video"
            title="Bấm để phát video"
          >
            <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
          </button>
        )}
      </div>

      {showCaption && (
        <p className="text-center text-xs sm:text-sm text-[#5a4a32] italic p-3 bg-[#fbf9f5] border-t border-[#e2d5bd]/60 font-serif">
          {title}
        </p>
      )}
    </div>
  );
}
