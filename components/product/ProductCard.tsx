"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  originalPrice: number | null;
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  images: string;
  shortDescription: string | null;
  category?: {
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: ProductData;
  hotline?: string;
  zalo?: string;
}

export function ProductCard({ product }: ProductCardProps) {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  let parsedImages: string[] = [];
  try {
    parsedImages = JSON.parse(product.images);
    if (!Array.isArray(parsedImages)) parsedImages = [product.images];
  } catch {
    parsedImages = [product.images];
  }
  if (parsedImages.length === 0) parsedImages = ["/images/do-tho-cung.jpg"];

  // Angles setup
  const angleColors = ["#f3eee4", "#e8cf8d", "#c59239", "#784421", "#3d2314"];
  const angleLabels = ["Ảnh chính", "Góc nghiêng", "Cận cảnh hoa văn", "Mặt sau", "Tổng thể"];

  const hasMultipleImages = parsedImages.length > 1;
  const dotCount = hasMultipleImages ? Math.min(parsedImages.length, 5) : 4;

  const currentDisplayImage = hasMultipleImages
    ? parsedImages[activeAngleIndex % parsedImages.length]
    : parsedImages[0];

  const categorySlug = product.category?.slug || "do-tho-cung";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("cart");
      const cart = stored ? JSON.parse(stored) : [];
      const existingIndex = cart.findIndex((item: any) => item.id === product.id);
      if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price || 0,
          slug: product.slug,
          image: currentDisplayImage,
          categorySlug: categorySlug,
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group bg-[#FFFDF9] border border-[#EBDCC3] hover:border-[#801019]/60 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-full shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
      <div>
        {/* Product Image Window */}
        <Link
          href={`/san-pham/${categorySlug}/${product.slug}`}
          className="block aspect-[4/3] sm:aspect-square mb-2 overflow-hidden rounded-xl bg-white border border-[#F3EDE2] p-2.5 relative flex items-center justify-center group/img"
        >
          <img
            src={currentDisplayImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain group-hover/img:scale-105 transition-all duration-300"
          />
          {product.material && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#4A1015]/90 text-[#FFFDF9] text-[9px] font-bold tracking-wide rounded shadow-sm">
              {product.material.split("-")[0]}
            </span>
          )}
        </Link>

        {/* Multi-angle switcher dots */}
        <div className="flex items-center gap-2 px-1 py-1.5 mb-1.5">
          {[...Array(dotCount)].map((_, i) => {
            const isActive = activeAngleIndex === i;
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveAngleIndex(i);
                }}
                onMouseEnter={() => setActiveAngleIndex(i)}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 relative border ${
                  isActive
                    ? "ring-2 ring-[#dfb755] ring-offset-1 scale-110 border-white shadow-sm"
                    : "border-black/10 opacity-70 hover:opacity-100 hover:scale-105"
                }`}
                style={{ backgroundColor: angleColors[i % angleColors.length] }}
                title={`${angleLabels[i] || `Góc ${i + 1}`}`}
                aria-label={`Xem ${angleLabels[i] || `góc ${i + 1}`}`}
              />
            );
          })}
          <span className="text-[10px] text-gray-400 font-medium ml-auto">
            {hasMultipleImages ? `${parsedImages.length} góc chụp` : "Đa góc nhìn"}
          </span>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <Link href={`/san-pham/${categorySlug}/${product.slug}`}>
            <h3 className="font-serif text-[13px] sm:text-sm font-bold text-[#2A160F] group-hover:text-[#801019] transition-colors line-clamp-2 leading-snug min-h-[38px]">
              {product.name}
            </h3>
          </Link>

          {/* 5 Rating Stars */}
          <div className="flex items-center gap-0.5 pt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-[#DFB755] text-[#DFB755]"
              />
            ))}
            <span className="text-[11px] text-gray-500 font-medium ml-1">(5.0)</span>
          </div>

          {/* Price Box */}
          <div className="pt-1.5 pb-1 flex items-baseline gap-2">
            {product.originalPrice && product.originalPrice > (product.price || 0) && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-serif font-extrabold text-sm sm:text-base text-[#801019]">
              {product.price && product.price > 0 ? formatPrice(product.price) : "Liên hệ báo giá"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Giỏ Hàng & Chi Tiết */}
      <div className="grid grid-cols-2 gap-2 pt-2.5 mt-auto border-t border-[#EBDCC3]/70">
        <button
          type="button"
          onClick={handleAddToCart}
          className="bg-white hover:bg-slate-100 text-[#801019] text-[11px] sm:text-xs font-black py-2 px-1 rounded-lg text-center transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95 border border-[#801019]/30"
          title="Thêm vào giỏ hàng"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-[#801019] shrink-0" />
          <span className="truncate">Giỏ Hàng</span>
        </button>
        <Link
          href={`/san-pham/${categorySlug}/${product.slug}`}
          className="bg-[#ffd700] hover:bg-[#ffe082] text-[#070e17] text-[11px] sm:text-xs font-black py-2 px-1 rounded-lg text-center transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95 border border-[#ffd700]"
          title="Xem chi tiết sản phẩm"
        >
          <span className="truncate">Chi Tiết</span>
        </Link>
      </div>
    </div>
  );
}