"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { getWatermarkedImageUrl } from "@/lib/utils";

export function LocNamFavorites() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<number[]>([]);

  const products = [
    {
      id: 1,
      name: "Thuyền buồm thuận buồm xuôi gió mạ vàng 24k",
      price: "8.500.000đ",
      image: "/images/prod_thuyen_buom.jpg",
      href: "/san-pham/qua-tang-dong",
    },
    {
      id: 2,
      name: "Tượng ngựa phong thủy mạ vàng",
      price: "6.800.000đ",
      image: "/images/prod_tuong_ngua.jpg",
      href: "/san-pham/tuong-dong",
    },
    {
      id: 3,
      name: "Tranh thuận buồm xuôi gió mạ vàng",
      price: "5.200.000đ",
      image: "/images/prod_tranh_dong.jpg",
      href: "/san-pham/tranh-dong",
      isHighlighted: true,
    },
    {
      id: 4,
      name: "Tượng Di Lặc mạ vàng phúc lộc",
      price: "4.800.000đ",
      image: "/images/prod_di_lac.jpg",
      href: "/san-pham/tuong-dong",
    },
    {
      id: 5,
      name: "Mặt trống đồng đường kính 80cm khung gỗ",
      price: "7.900.000đ",
      image: "/images/prod_mat_trong.jpg",
      href: "/san-pham/trong-dong",
    },
  ];

  // Prefetch deferred to prioritize image loading
  useEffect(() => {
    const timer = setTimeout(() => {
      products.forEach((prod) => {
        router.prefetch(prod.href);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [products, router]);

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-white py-12 sm:py-16 px-4 sm:px-8 lg:px-12 border-b border-[#f0eae0]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="text-[#b8860b] font-serif text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-1.5 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-[#b8860b]/40"></span>
            <span>TUYỆT TÁC CHẾ TÁC</span>
            <span className="w-8 h-[1px] bg-[#b8860b]/40"></span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1a2533] tracking-wider uppercase">
            SẢN PHẨM ĐƯỢC YÊU THÍCH
          </h2>
        </div>

        {/* 5 Cards Grid - Exact Design matching user reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {products.map((prod) => {
            const isFav = wishlist.includes(prod.id);
            return (
              <div
                key={prod.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest("a") || target.closest("button")) return;
                  router.push(prod.href);
                }}
                onMouseEnter={() => router.prefetch(prod.href)}
                onTouchStart={() => router.prefetch(prod.href)}
                className={`group bg-white rounded-2xl border transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-1 cursor-pointer ${
                  prod.isHighlighted
                    ? "border-[#d4af37] ring-1 ring-[#d4af37]/30"
                    : "border-[#ece4d5] hover:border-[#d4af37]"
                }`}
              >
                <div>
                  {/* Product Image Box */}
                  <Link
                    href={prod.href}
                    prefetch={true}
                    className="block aspect-square w-full rounded-xl overflow-hidden bg-white border border-[#f5eee2] p-2 relative flex items-center justify-center"
                  >
                    {/* Badge LỘC NAM */}
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-[#fff9ee] border border-[#f3e5c8] text-[#b8860b] text-[10px] font-bold tracking-wider shadow-xs">
                      LỘC NAM
                    </span>

                    <img
                      src={getWatermarkedImageUrl(prod.image)}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>

                  {/* Product Title */}
                  <div className="pt-2.5 pb-1">
                    <Link href={prod.href} prefetch={true}>
                      <h3 className="font-serif text-[12px] sm:text-[13px] font-bold text-[#231b15] group-hover:text-[#b8860b] transition-colors line-clamp-2 leading-snug min-h-[36px]">
                        {prod.name}
                      </h3>
                    </Link>
                  </div>
                </div>

                {/* Price & Action Icons Row */}
                <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
                  <span className="font-serif font-extrabold text-sm sm:text-[15px] text-[#b8860b]">
                    {prod.price}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(prod.id, e)}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title="Yêu thích"
                      aria-label="Yêu thích"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </button>
                    <Link
                      href={prod.href}
                      prefetch={true}
                      className="p-1 text-gray-300 hover:text-[#b8860b] transition-colors"
                      title="Đặt mua sản phẩm"
                      aria-label="Đặt mua"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </Link>
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
