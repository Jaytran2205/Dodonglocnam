"use client";

import React, { useState } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductWatermark } from "@/components/common/ProductWatermark";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const displayImages = images.length > 0 ? images : ["/images/hero_golden_ship.jpg"];
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      <div className="space-y-3">
        {/* Main Big Image Frame */}
        <div className="relative aspect-square max-h-[420px] w-full rounded-xl border border-[#e2d5bd] bg-white overflow-hidden group shadow-sm flex items-center justify-center">
          <img
            src={currentImage}
            alt={productName}
            className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Watermark Branding */}
          <ProductWatermark size="sm" position="top-left" showCenterLogo={true} />

          {/* Zoom trigger button */}
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Phóng to ảnh"
            className="absolute bottom-3 right-3 py-1.5 px-3 bg-[#0c1825] hover:bg-[#1a2d42] text-[#e8d5ad] rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-md flex items-center gap-1.5 text-xs font-serif font-semibold tracking-wider border border-[#c59b4e]/40"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Phóng to</span>
          </button>
        </div>

        {/* Thumbnail Selector */}
        {displayImages.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-16 rounded-lg border overflow-hidden shrink-0 transition-all bg-white p-1 ${
                  idx === selectedIndex
                    ? "border-[#b8860b] ring-2 ring-[#b8860b]/30 shadow scale-102"
                    : "border-gray-200 opacity-70 hover:opacity-100 hover:border-[#b8860b]"
                }`}
              >
                <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={currentImage}
              alt={productName}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Lightbox Watermark Branding */}
            <ProductWatermark size="lg" position="bottom-right" showCenterLogo={true} />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black text-white rounded-full"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black text-white rounded-full"
                  aria-label="Ảnh kế tiếp"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}