"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { getWatermarkedImageUrl } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  priceText?: string | null;
  images: string;
  material?: string | null;
  dimensions?: string | null;
  category: {
    name: string;
    slug: string;
  };
}

interface LeGiaProductGridProps {
  products: Product[];
}

export function LeGiaProductGrid({ products }: LeGiaProductGridProps) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "TẤT CẢ" },
    { id: "do-tho-cung", label: "QUÀ THỜ CÚNG" },
    { id: "tuong-dong", label: "TƯỢNG PHONG THỦY" },
    { id: "qua-tang-dong", label: "TRANH & QUÀ TẶNG" },
    { id: "duc-chuong-cong-trinh", label: "MÔ HÌNH ĐỒNG" },
  ];

  const filteredProducts = activeTab === "all"
    ? products
    : products.filter(p => p.category.slug === activeTab);

  return (
    <section className="w-full bg-white py-14 px-4 sm:px-8 border-b-2 border-[#D4AF37]/30">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#D4AF37] tracking-widest uppercase">
            BỘ SƯU TẬP SẢN PHẨM
          </h2>
          {/* Gold flourish graphic */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <div className="w-6 h-6 border-2 border-[#D4AF37] rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#D4AF37]"></div>
            </div>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "bg-[#D4AF37] text-[#26050B] shadow-[0_0_15px_rgba(212,175,55,0.5)] scale-105"
                    : "bg-[#33080F] text-[#F3E9D2]/80 hover:bg-[#4A0E17] hover:text-[#D4AF37] border border-[#D4AF37]/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - SIZE TRUNG BÌNH */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.slice(0, 8).map((product) => {
            let imgList: string[] = [];
            try {
              imgList = JSON.parse(product.images);
            } catch {
              imgList = [product.images || "/images/artisan-foundry.jpg"];
            }
            const thumb = imgList[0] || "/images/artisan-foundry.jpg";

            const isGift =
              product.category?.slug === "qua-tang" ||
              product.category?.slug === "qua-tang-dong";

            const productHref = isGift
              ? `/qua-tang/${product.slug}`
              : `/san-pham/${product.category?.slug || "tuong-dong"}/${product.slug}`;

            return (
              <div
                key={product.id}
                className="group bg-[#FFFDF7] border-2 border-[#D4AF37]/60 hover:border-[#D4AF37] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)]"
              >
                <div>
                  <Link
                    href={productHref}
                    className="block aspect-square overflow-hidden bg-[#FAF6EB] relative p-3 border-b border-[#E8DCC4]"
                  >
                    <img
                      src={getWatermarkedImageUrl(thumb)}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.material && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#4A0E17] text-[#F3E9D2] text-[9px] font-bold uppercase rounded shadow border border-[#D4AF37]">
                        {product.material}
                      </span>
                    )}
                  </Link>

                  <div className="p-3 space-y-1">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase block tracking-wider">
                      {product.category.name}
                    </span>

                    <h3 className="font-bold text-xs sm:text-[13px] text-[#1a1a1a] group-hover:text-[#D4AF37] line-clamp-2 leading-snug transition-colors">
                      <Link href={productHref}>
                        {product.name}
                      </Link>
                    </h3>

                    <div className="pt-0.5">
                      {product.price ? (
                        <span className="text-sm sm:text-[15px] font-black text-[#9B111E]">
                          {product.price.toLocaleString("vi-VN")} đ
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#B8860B]">
                          Liên hệ báo giá
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0 border-t border-[#E8DCC4] mt-auto">
                  <div className="grid grid-cols-2 gap-1.5 pt-2">
                    <Link
                      href={productHref}
                      className="py-1.5 text-center text-[11px] font-bold text-[#F3E9D2] bg-[#4A0E17] hover:bg-[#631420] rounded transition-colors"
                    >
                      Chi Tiết
                    </Link>

                    <a
                      href="tel:0846699997"
                      className="py-1.5 text-center text-[11px] font-bold text-[#1a1a2e] bg-[#D4AF37] hover:bg-[#B89628] rounded transition-colors flex items-center justify-center gap-1 shadow"
                    >
                      <Phone className="w-2.5 h-2.5 fill-current" />
                      <span>Tư Vấn</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
