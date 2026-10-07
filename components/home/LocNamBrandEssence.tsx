"use client";
import { getClientSettings, getClientCatalog } from "@/lib/client-cache";
import { DEFAULT_HOME_REVIEWS } from "@/lib/home-content";

import React, { useEffect, useState } from "react";
import {
  Star,
  Quote,
  CheckCircle2,
  MessageSquareHeart,
  MapPin,
  Sparkles,
} from "lucide-react";

export function LocNamBrandEssence() {


  const [reviews, setReviews] = React.useState(DEFAULT_HOME_REVIEWS);

  React.useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          setReviews(
            DEFAULT_HOME_REVIEWS.map((item, idx) => {
              const prefix = `rev${idx + 1}_`;
              return {
                ...item,
                name: s[`${prefix}name`] || item.name,
                title: s[`${prefix}title`] || item.title,
                location: s[`${prefix}location`] || item.location,
                product: s[`${prefix}product`] || item.product,
                tag: s[`${prefix}tag`] || item.tag,
                image: s[`${prefix}image`] || item.image,
                comment: s[`${prefix}comment`] || item.comment,
              };
            })
          );
        }
      })
      .catch((e) => console.error("Error loading reviews:", e));
  }, []);

  // Duplicate for seamless 100% infinite marquee loop
  const loopReviews = [...reviews, ...reviews];

  return (
    <section id="du-an-thuc-te" className="bg-[#060e17] py-14 sm:py-18 border-t border-b border-[#1c2c3d] relative overflow-hidden text-[#cbd5e1] scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-[#dfb755] font-serif text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>ĐÁNH GIÁ CỦA KHÁCH HÀNG VỀ SẢN PHẨM THỰC TẾ</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-wide leading-tight">
              ĐÁNH GIÁ CỦA KHÁCH HÀNG & SẢN PHẨM THỰC TẾ
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-light max-w-2xl leading-relaxed">
              Hình ảnh sản phẩm thực tế đã bàn giao kèm đánh giá chân thực từ khách hàng trên toàn quốc – Tự động chuyển động liên tục, rê chuột để dừng lại.
            </p>
          </div>

          {/* Trust Rating Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#142337] border border-[#dfb755]/40 text-xs shadow-md self-start md:self-auto">
            <div className="flex text-[#ffd700]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-white">4.9 / 5.0</span>
            <span className="text-[#94a3b8] text-[11px]">(2,450+ Đánh giá)</span>
          </div>
        </div>

        {/* Infinite Loop Marquee Container */}
        <div className="relative w-full overflow-hidden py-2">
          <div className="animate-marquee-loop gap-5 sm:gap-6 flex items-stretch">
            {loopReviews.map((rev, idx) => (
              <div
                key={`${rev.id}-${idx}`}
                className="w-[320px] sm:w-[350px] lg:w-[370px] flex-shrink-0 rounded-2xl bg-[#fdfbf7] border-2 border-[#d4af37]/70 hover:border-[#b8860b] shadow-[0_12px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_40px_rgba(212,175,55,0.35)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Real Product Photo with Tag */}
                  <div className="aspect-[16/10] overflow-hidden bg-[#0c1825] relative border-b border-[#e8dfd1]">
                    <img
                      src={rev.image}
                      alt={rev.product}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Tag badge on image */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#08121e] shadow-md uppercase">
                      {rev.tag}
                    </span>

                    {/* 5 Stars overlay badge on image */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-md bg-[#08121e]/90 backdrop-blur-sm border border-[#dfb755]/50 flex text-[#ffd700]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="p-4 sm:p-4.5 space-y-2.5 text-left">
                    {/* Reviewer Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#dfb755] via-[#f5db8b] to-[#b8860b] text-[#08121e] font-serif font-black text-xs flex items-center justify-center shadow-md flex-shrink-0 border border-white">
                          {rev.avatar}
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm sm:text-base text-[#0c1825] group-hover:text-[#b8860b] transition-colors line-clamp-1">
                            {rev.name}
                          </div>
                          <div className="text-[11px] text-[#556477] font-medium line-clamp-1">
                            {rev.title}
                          </div>
                        </div>
                      </div>

                      <Quote className="w-5 h-5 text-[#b8860b]/30 flex-shrink-0" />
                    </div>

                    {/* Product & Location Badge */}
                    <div className="p-2.5 rounded-xl bg-[#f5ebd7] border border-[#dfb755]/50 space-y-0.5">
                      <div className="text-[11px] sm:text-xs font-bold text-[#8c6014] line-clamp-1">
                        ✓ Sản phẩm: {rev.product}
                      </div>
                      <div className="text-[10px] text-[#6b7280] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#b8860b]" />
                        <span>{rev.location}</span>
                      </div>
                    </div>

                    {/* Customer Review Quote */}
                    <p className="text-xs text-[#2d3748] font-normal leading-relaxed italic line-clamp-3">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Footer Verified Badge */}
                <div className="p-3 bg-[#f3ede1] border-t border-[#e8dfd1] flex items-center justify-between text-[10px] font-bold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã bàn giao & nghiệm thu</span>
                  </span>
                  <span className="text-[#718096] font-medium">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
