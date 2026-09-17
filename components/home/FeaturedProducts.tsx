"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ProductWatermark } from "@/components/common/ProductWatermark";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  originalPrice: number | null;
  material: string | null;
  dimensions: string | null;
  images: string;
  shortDescription: string | null;
  category?: {
    name: string;
    slug: string;
  };
}

interface FeaturedProductsProps {
  products: ProductItem[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabs = [
    { label: "Tất Cả Tác Phẩm", slug: "all" },
    { label: "Đồ Thờ Cúng", slug: "do-tho-cung" },
    { label: "Tượng Đồng", slug: "tuong-dong" },
    { label: "Tranh & Trống Đồng", slug: "qua-tang-dong" },
  ];

  const filteredProducts = activeTab === "all"
    ? products
    : products.filter((p) => p.category?.slug === activeTab);

  return (
    <section className="w-full bg-[#FAF6ED] py-12 lg:py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E5DAC3]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-[#8B6B38] text-xs uppercase tracking-wider font-semibold mb-2">
          <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
          <span>Tuyển Tập Kiệt Tác Thủ Công</span>
          <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] tracking-wider uppercase mb-3">
          DANH MỤC TÁC PHẨM ĐÚC ĐỒNG
        </h2>
        <p className="text-xs sm:text-sm text-[#6B5342] max-w-2xl mx-auto leading-relaxed">
          Được chế tác thủ công trực tiếp tại xưởng Vạn Điểm – Ý Yên bởi Nghệ nhân Dương Bá Tiến, đạt chuẩn độ bền trường tồn và chuẩn phong thủy gia tiên.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(tab.slug)}
              className={`px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.slug
                  ? "bg-[#7B1E2B] text-white shadow-sm"
                  : "bg-[#F4EDE0] text-[#5C4535] hover:bg-[#EAE0CF] border border-[#E5DAC3]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => {
          let parsedImages: string[] = [];
          try {
            parsedImages = JSON.parse(prod.images);
          } catch {
            parsedImages = [prod.images];
          }
          const displayImage = parsedImages[0] || "/images/do-tho-cung.jpg";
          const categorySlug = prod.category?.slug || "do-tho-cung";

          return (
            <div
              key={prod.id}
              className="group bg-[#F4EDE0] border border-[#E5DAC3] rounded-sm p-4 hover-lift flex flex-col justify-between h-full shadow-sm hover:border-[#8B6B38] transition-all duration-300"
            >
              <div>
                {/* Image Frame */}
                <Link
                  href={`/san-pham/${categorySlug}/${prod.slug}`}
                  className="block aspect-square mb-3 overflow-hidden rounded-sm bg-[#FAF6ED] relative border border-[#E5DAC3]/60"
                >
                  <img
                    src={displayImage}
                    alt={prod.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <ProductWatermark size="xs" position="bottom-right" />
                  {prod.material && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#3A2418]/90 text-white text-[10px] font-semibold tracking-wide rounded-sm max-w-[85%] truncate">
                      {prod.material.split("-")[0]}
                    </span>
                  )}
                </Link>

                {/* Info */}
                <div className="space-y-1">
                  <Link href={`/san-pham/${categorySlug}/${prod.slug}`}>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#3A2418] group-hover:text-[#7B1E2B] transition-colors line-clamp-2 leading-snug">
                      {prod.name}
                    </h3>
                  </Link>

                  {prod.dimensions && (
                    <p className="text-[11px] text-[#6B5342] font-medium">
                      KT: {prod.dimensions}
                    </p>
                  )}

                  {/* Price */}
                  <div className="pt-1 pb-2 flex items-baseline gap-2">
                    <span className="font-bold text-base text-[#7B1E2B]">
                      {formatPrice(prod.price)}
                    </span>
                    {prod.originalPrice && prod.originalPrice > (prod.price || 0) && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(prod.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E5DAC3]/50 mt-auto">
                <Link
                  href={`/san-pham/${categorySlug}/${prod.slug}`}
                  className="inline-flex items-center justify-center py-2 px-1 bg-[#7B1E2B] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#611722] transition-colors rounded-sm shadow-sm"
                >
                  Xem Chi Tiết
                </Link>
                <a
                  href="tel:0846699997"
                  className="inline-flex items-center justify-center gap-1 py-2 px-1 bg-[#FAF6ED] text-[#3A2418] border border-[#8B6B38] text-[11px] font-bold uppercase tracking-wider hover:bg-[#EAE0CF] transition-colors rounded-sm"
                >
                  <Phone className="w-3 h-3 text-[#8B6B38]" />
                  <span>Tư Vấn</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}