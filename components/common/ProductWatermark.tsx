"use client";

import React from "react";

interface ProductWatermarkProps {
  size?: "xs" | "sm" | "md" | "lg";
  position?: "bottom-right" | "bottom-left" | "top-left" | "top-right";
  showCenterLogo?: boolean;
  className?: string;
}

export function ProductWatermark({
  size = "sm",
  position = "bottom-right",
  showCenterLogo = false,
  className = "",
}: ProductWatermarkProps) {
  // Position classes
  const posClasses = {
    "bottom-right": "bottom-2 right-2 sm:bottom-2.5 sm:right-2.5",
    "bottom-left": "bottom-2 left-2 sm:bottom-2.5 sm:left-2.5",
    "top-left": "top-2 left-2 sm:top-2.5 sm:left-2.5",
    "top-right": "top-2 right-2 sm:top-2.5 sm:right-2.5",
  }[position];

  // Size styling configurations
  const sizeConfig = {
    xs: {
      logoSize: "w-3.5 h-3.5",
      titleText: "text-[8px] sm:text-[9px]",
      phoneText: "text-[7px] sm:text-[8px]",
      padding: "px-1.5 py-0.5 sm:px-2 sm:py-1",
      gap: "gap-1",
    },
    sm: {
      logoSize: "w-4 h-4 sm:w-4.5 sm:h-4.5",
      titleText: "text-[9px] sm:text-[10px]",
      phoneText: "text-[8px] sm:text-[8.5px]",
      padding: "px-2 py-1 sm:px-2.5 sm:py-1",
      gap: "gap-1.5",
    },
    md: {
      logoSize: "w-5 h-5 sm:w-6 sm:h-6",
      titleText: "text-[10px] sm:text-xs",
      phoneText: "text-[9px] sm:text-[10px]",
      padding: "px-2.5 py-1.5 sm:px-3 sm:py-1.5",
      gap: "gap-2",
    },
    lg: {
      logoSize: "w-7 h-7 sm:w-8 sm:h-8",
      titleText: "text-xs sm:text-sm",
      phoneText: "text-[10px] sm:text-xs",
      padding: "px-3.5 py-2 sm:px-4 sm:py-2.5",
      gap: "gap-2.5",
    },
  }[size];

  return (
    <>
      {/* Optional Subtle Diagonal Center Watermark Emblem */}
      {showCenterLogo && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="flex flex-col items-center justify-center opacity-[0.14] transform -rotate-12 scale-110">
            <img
              src="/images/logo.png"
              alt="Lộc Nam"
              className="w-24 h-24 sm:w-36 sm:h-36 object-contain filter drop-shadow-md"
            />
            <span className="font-serif font-black text-xs sm:text-sm tracking-widest text-[#ffd700] uppercase mt-1">
              ĐỒ ĐỒNG LỘC NAM
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-white">
              0836.122.222 - 0846.699.997
            </span>
          </div>
        </div>
      )}

      {/* Main Watermark Badge */}
      <div
        className={`absolute ${posClasses} z-20 pointer-events-none select-none flex items-center ${sizeConfig.gap} bg-[#060e18]/85 backdrop-blur-md ${sizeConfig.padding} rounded-md sm:rounded-lg border border-[#dfb755]/50 shadow-[0_4px_20px_rgba(0,0,0,0.65)] ${className}`}
      >
        <img
          src="/images/logo.png"
          alt="Lộc Nam"
          className={`${sizeConfig.logoSize} object-contain flex-shrink-0`}
          loading="eager"
        />
        <div className="flex flex-col leading-tight">
          <span
            className={`font-serif font-black tracking-wider text-[#ffd700] uppercase ${sizeConfig.titleText}`}
          >
            ĐỒ ĐỒNG LỘC NAM
          </span>
          <span
            className={`font-semibold tracking-tight text-[#f1f5f9] flex items-center gap-1 ${sizeConfig.phoneText}`}
          >
            <span className="text-[#dfb755]">Hotline:</span>
            <span>0836.122.222 - 0846.699.997</span>
          </span>
        </div>
      </div>
    </>
  );
}
