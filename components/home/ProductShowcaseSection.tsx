"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { formatPrice, getWatermarkedImageUrl } from "@/lib/utils";

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
}

interface ProductShowcaseSectionProps {
  title: string;
  subtitle?: string;
  categorySlug: string;
  products: ProductItem[];
  hotline?: string;
}

export function ProductShowcaseSection({
  title,
  subtitle = "Kiệt tác đúc đồng thủ công truyền thống làng nghề Ý Yên",
  categorySlug,
  products,
  hotline = "0977.62.4444",
}: ProductShowcaseSectionProps) {
  const router = useRouter();
  const cleanPhone = hotline.replace(/\./g, "").replace(/\s/g, "");

  useEffect(() => {
    products.slice(0, 12).forEach((prod) => {
      const isGift =
        categorySlug === "qua-tang" ||
        categorySlug === "qua-tang-dong" ||
        (prod as any).category?.slug === "qua-tang" ||
        (prod as any).category?.slug === "qua-tang-dong";
      const productHref = isGift
        ? `/qua-tang/${prod.slug}`
        : `/san-pham/${(prod as any).category?.slug || categorySlug}/${prod.slug}`;
      router.prefetch(productHref);
    });
  }, [products, categorySlug, router]);

  return (
    <section className="py-12 px-4 sm:px-8 max-w-container mx-auto">
      {/* Category Ribbon Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-[#8B1522] pb-3 mb-8 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-8 bg-[#8B1522] rounded-sm"></div>
          <div>
            <h2 className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-[#1a1a1a] uppercase tracking-wide">
              {title}
            </h2>
            <p className="text-xs text-[#5C3015] italic">{subtitle}</p>
          </div>
        </div>

        <Link
          href={`/san-pham/${categorySlug}`}
          prefetch={true}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#1a1a1a] hover:text-[#D4AF37] bg-[#F4ECDA] px-4 py-2 rounded border border-[#D4AF37] hover:bg-[#1a1a2e] hover:text-[#D4AF37] transition-all shadow-sm"
        >
          <span>XEM TẤT CẢ ({products.length} SP)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((prod) => {
          let parsedImages: string[] = [];
          try {
            parsedImages = JSON.parse(prod.images);
          } catch {
            parsedImages = [prod.images];
          }
          const displayImage = parsedImages[0] || "/placeholder.jpg";

          const isGift =
            categorySlug === "qua-tang" ||
            categorySlug === "qua-tang-dong" ||
            (prod as any).category?.slug === "qua-tang" ||
            (prod as any).category?.slug === "qua-tang-dong";

          const productHref = isGift
            ? `/qua-tang/${prod.slug}`
            : `/san-pham/${(prod as any).category?.slug || categorySlug}/${prod.slug}`;

          return (
            <div
              key={prod.id}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("a") || target.closest("button")) return;
                router.push(productHref);
              }}
              onMouseEnter={() => router.prefetch(productHref)}
              onTouchStart={() => router.prefetch(productHref)}
              className="bg-white rounded-lg border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover-lift flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Product Image Frame */}
                <Link
                  href={productHref}
                  prefetch={true}
                  className="block relative aspect-square bg-[#F6EDE0]/60 overflow-hidden"
                >
                  <img
                    src={getWatermarkedImageUrl(displayImage)}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  {prod.material && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#2A1408]/90 text-[#FFD700] text-[10px] font-bold uppercase tracking-wider rounded border border-[#D6B86C]/50 shadow backdrop-blur-sm">
                      {prod.material.split("-")[0]}
                    </span>
                  )}
                </Link>

                {/* Info Container */}
                <div className="p-4 space-y-2">
                  <Link href={productHref} prefetch={true}>
                    <h3 className="font-serif font-bold text-sm sm:text-[15px] text-[#1a1a1a] group-hover:text-[#D4AF37] line-clamp-2 leading-snug transition-colors">
                      {prod.name}
                    </h3>
                  </Link>

                  {prod.dimensions && (
                    <p className="text-[11px] text-[#5C3015] font-medium">
                      KT: {prod.dimensions}
                    </p>
                  )}

                  {/* Price Box */}
                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="font-bold text-base sm:text-lg text-[#D4AF37]">
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

              {/* Action Button Bar */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Link
                  href={productHref}
                  prefetch={true}
                  className="py-2 px-2 bg-[#2A1408] hover:bg-[#3D1F0D] text-white text-center text-[11px] font-bold uppercase rounded transition-colors"
                >
                  Chi Tiết
                </Link>
                <a
                  href={`tel:${cleanPhone}`}
                  className="py-2 px-2 bg-[#D4AF37] hover:bg-[#B89628] text-[#1a1a1a] text-center text-[11px] font-bold uppercase rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#FFD700]" />
                  <span>Gọi Báo Giá</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}