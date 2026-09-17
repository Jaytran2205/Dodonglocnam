"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

export interface GridCardItem {
  id: string;
  name: string;
  image: string;
  href: string;
  count?: number;
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface CategorySubGridProps {
  title: string;
  subtitle?: string;
  description?: string;
  banner?: string;
  items: GridCardItem[];
  breadcrumbs: BreadcrumbItem[];
  parentBackHref?: string;
  parentBackText?: string;
}

export function CategorySubGrid({
  title,
  subtitle,
  description,
  banner,
  items,
  breadcrumbs,
  parentBackHref,
  parentBackText,
}: CategorySubGridProps) {
  return (
    <div className="w-full">
      {/* 1. Full-Width Edge-to-Edge Category Banner */}
      {banner && (
        <section aria-label={`Banner danh mục ${title}`} className="w-full relative aspect-[1920/818] min-h-[160px] sm:min-h-[220px] bg-[#0c1825] border-b border-[#1e344d]/60 overflow-hidden shadow-2xl">
          <img
            src={banner}
            alt={title}
            className="w-full h-full object-cover object-center transform-gpu [image-rendering:-webkit-optimize-contrast]"
            loading="eager"
            fetchPriority="high"
          />
        </section>
      )}

      {/* 2. Main Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 2xl:px-8 py-6 sm:py-8">
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs sm:text-sm text-[#94a3b8] flex items-center flex-wrap gap-2">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#64748b] shrink-0" />}
                {isLast || !crumb.url ? (
                  <span className="text-[#ffd700] font-bold">{crumb.name}</span>
                ) : (
                  <Link
                    href={crumb.url}
                    className="hover:text-[#ffd700] transition-colors flex items-center gap-1 font-medium"
                  >
                    {crumb.name}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Back Button (if parentBackHref provided) */}
        {parentBackHref && (
          <div className="mb-5">
            <Link
              href={parentBackHref}
              className="inline-flex items-center gap-1.5 text-xs text-[#dfb755] hover:text-white font-bold transition-colors py-1.5 px-3 rounded-lg bg-[#0d1b2a] border border-[#1e344d] hover:border-[#dfb755] active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>‹ {parentBackText || "Trở về danh mục cấp trên"}</span>
            </Link>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#ffd700] tracking-wide uppercase">
            {title}
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mx-auto mt-3 mb-3 rounded-full" />
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#94a3b8] uppercase tracking-wider font-semibold">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="max-w-3xl mx-auto text-xs sm:text-sm text-[#cbd5e1] mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

      {/* 3. Grid Cards 3 Columns with Auto-Centered Last Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
        {items.map((item, index) => {
          const total = items.length;

          // Auto-center cards on the last row for 3-column desktop layout (lg:grid-cols-6)
          const remainder3 = total % 3;
          const isFirstOfLastRow3 = remainder3 > 0 && index === total - remainder3;
          let lgClass = "lg:col-span-2";
          if (isFirstOfLastRow3) {
            if (remainder3 === 1) {
              // 1 card on last row: centered in middle (columns 3-4 out of 6)
              lgClass = "lg:col-start-3 lg:col-span-2";
            } else if (remainder3 === 2) {
              // 2 cards on last row: centered symmetrically (columns 2-3 & 4-5 out of 6)
              lgClass = "lg:col-start-2 lg:col-span-2";
            }
          }

          // Auto-center cards on the last row for 2-column tablet layout (sm:grid-cols-4)
          const remainder2 = total % 2;
          const isLastItem2 = remainder2 === 1 && index === total - 1;
          let smClass = "sm:col-span-2";
          if (isLastItem2) {
            // 1 card on last row of 2-column layout: centered in middle (columns 2-3 out of 4)
            smClass = "sm:col-start-2 sm:col-span-2";
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`col-span-1 ${smClass} ${lgClass} group bg-[#0a1524] border border-[#1e344d] rounded-2xl overflow-hidden hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.35)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1`}
            >
            {/* 4:3 Image with Zoom on Hover */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#060c14] relative border-b border-[#1e344d]/60">
              <img
                src={item.image || "/images/hero_golden_ship.jpg"}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1524]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Card Content & Action Button */}
            <div className="p-5 sm:p-6 flex flex-col items-center justify-between flex-grow gap-4">
              <h2 className="font-serif text-sm sm:text-base font-extrabold text-[#e2e8f0] group-hover:text-[#ffd700] transition-colors text-center uppercase tracking-wider line-clamp-2 min-h-[44px] flex items-center justify-center">
                {item.name}
              </h2>

              {/* Gold Pill Button: XEM TẤT CẢ (#FFD700) */}
              <div className="w-full flex justify-center pt-1">
                <span className="inline-flex items-center justify-center bg-[#ffd700] group-hover:bg-[#ffe082] text-black font-black text-xs px-7 py-2.5 rounded-full uppercase tracking-wider shadow-md group-hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] active:scale-95 transition-all">
                  XEM TẤT CẢ
                </span>
              </div>
            </div>
          </Link>
        );
      })}
        </div>
      </div>
    </div>
  );
}
