"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Home,
  Phone,
  MessageCircle,
  ShieldCheck,
  Truck,
  Star,
  CheckCircle2,
  Share2,
  MapPin,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Copy,
  Info,
  Award,
  Clock,
  Sparkles,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { QuickOrderForm } from "./QuickOrderForm";
import { getWatermarkedImageUrl } from "@/lib/utils";

interface ProductData {
  id: string | number;
  name: string;
  slug: string;
  price: number | null;
  originalPrice: number | null;
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  shortDescription: string | null;
  description: string | null;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
}

interface RelatedProduct {
  id: string | number;
  name: string;
  slug: string;
  price: number | null;
  images: string[];
  category: {
    slug: string;
  };
}

interface ProductDetailClientProps {
  product: ProductData;
  relatedProducts: RelatedProduct[];
  hotline1: string;
  hotline2: string;
  cleanPhone1: string;
  cleanPhone2: string;
  zaloPhone: string;
  fullUrl: string;
}

export function ProductDetailClient({
  product,
  relatedProducts,
  hotline1,
  hotline2,
  cleanPhone1,
  cleanPhone2,
  zaloPhone,
  fullUrl,
}: ProductDetailClientProps) {
  // Image gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = product.images.length > 0 ? product.images : ["/images/hero_golden_ship.jpg"];
  const currentImage = images[selectedImageIndex] || images[0];

  // Variant sizes: parse or create default options
  const router = useRouter();
  const defaultSizes = ["Nến 50", "Nến 60", "Nến 70"];
  const parsedSizes = product.dimensions
    ? product.dimensions
        .split(/[,;\/|]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const sizeOptions = parsedSizes.length > 0 ? parsedSizes : defaultSizes;
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || "Theo yêu cầu");

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Tabs state: 'detail' | 'faq' | 'reviews'
  const [activeTab, setActiveTab] = useState<"detail" | "faq" | "reviews">("detail");

  // Pre-load all related products into client cache for instant click
  useEffect(() => {
    relatedProducts.slice(0, 8).forEach((rel) => {
      const isGift =
        rel.category?.slug === "qua-tang" ||
        rel.category?.slug === "qua-tang-dong";
      const relHref = isGift
        ? `/qua-tang/${rel.slug}`
        : `/san-pham/${rel.category.slug}/${rel.slug}`;
      router.prefetch(relHref);
    });
  }, [relatedProducts, router]);

  // Read full product text toggle ("Xem đầy đủ" / "Xem chi tiết chữ sản phẩm")
  const [isExpanded, setIsExpanded] = useState(false);

  // Share link copy feedback
  const [copied, setCopied] = useState(false);

  // Smooth scroll ref to tabs / order section
  const tabsRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTabChange = (tab: "detail" | "faq" | "reviews") => {
    setActiveTab(tab);
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBuyNow = () => {
    if (orderRef.current) {
      orderRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = document.getElementById("order-customer-name");
      if (input) input.focus();
    }
  };

  const formattedPrice = product.price
    ? `${product.price.toLocaleString("vi-VN")}đ`
    : "Liên hệ báo giá";

  return (
    <div className="w-full">
      {/* Breadcrumbs Bar */}
      <div className="flex items-center justify-between py-4 border-b border-[#1c2c3d]/60 mb-6 text-xs text-[#94a3b8]">
        <nav className="flex items-center gap-2 overflow-x-auto" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#ffd700] flex items-center gap-1 shrink-0 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Trang Chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[#475569] shrink-0" />
          <Link
            href={`/san-pham/${product.category.slug}`}
            className="hover:text-[#ffd700] shrink-0 transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-[#475569] shrink-0" />
          <span className="font-semibold text-[#ffd700] truncate max-w-[200px] sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Share Button */}
        <div className="relative shrink-0 ml-4">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#122234] hover:bg-[#1a2f48] text-[#cbd5e1] hover:text-[#ffd700] border border-[#1c2c3d] text-xs font-semibold transition-all active:scale-95 shadow-sm"
            title="Chia sẻ liên kết sản phẩm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Đã chép link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#dfb755]" />
                <span>Chia sẻ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Product Hero Box (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0b1422] p-5 sm:p-8 rounded-2xl border border-[#1c2c3d] shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-10">
        {/* Left Column: Image Viewer with Watermark & Thumbnails */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#070e17] border border-[#1c2c3d] shadow-inner flex items-center justify-center group">
            {/* Main Image */}
            <img
              src={getWatermarkedImageUrl(currentImage)}
              alt={product.name}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-[#ffd700] border border-[#dfb755]/40 hover:border-[#ffd700] flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl active:scale-95 group-hover:scale-105"
                aria-label="Xem ảnh trước"
                title="Ảnh trước"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-[#ffd700] border border-[#dfb755]/40 hover:border-[#ffd700] flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl active:scale-95 group-hover:scale-105"
                aria-label="Xem ảnh tiếp theo"
                title="Ảnh tiếp theo"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Image Counter Badge (Top-Right) */}
            {images.length > 1 && (
              <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-full border border-[#dfb755]/30 text-[11px] font-bold text-[#ffd700] shadow-md">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}

          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto py-3 mt-3">
              {images.map((img, idx) => {
                const isSelected = idx === selectedImageIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 transition-all bg-[#070e17] p-1 border-2 ${
                      isSelected
                        ? "border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.5)] scale-105"
                        : "border-[#1c2c3d] opacity-65 hover:opacity-100 hover:border-[#dfb755]"
                    }`}
                  >
                    <img
                      src={getWatermarkedImageUrl(img)}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Title, Price, Variants, Buttons & Guarantees */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#f1f5f9] leading-snug">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#070e17] border border-[#1c2c3d] flex items-baseline gap-3">
              <span className="font-serif font-black text-2xl sm:text-3xl text-[#ffd700] tracking-wide">
                {formattedPrice}
              </span>
              {product.originalPrice && product.originalPrice > (product.price || 0) && (
                <span className="text-sm text-[#64748b] line-through">
                  {product.originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>

            {/* Status & Brand Information */}
            <div className="space-y-1.5 text-xs text-[#cbd5e1] pt-1">
              <div className="flex items-center gap-4">
                <span className="w-24 text-[#94a3b8]">Tình trạng:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Còn hàng (Có sẵn tại xưởng)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 text-[#94a3b8]">Thương hiệu:</span>
                <span className="text-[#f1f5f9] font-bold">Đồ Đồng Lộc Nam (Ý Yên, Nam Định)</span>
              </div>
            </div>

            {/* Variant Size Selector Buttons */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-serif font-bold text-[#f1f5f9] uppercase tracking-wider flex items-center justify-between">
                <span>Kích thước chế tác:</span>
                <span className="text-[#ffd700] text-[11px] font-normal">
                  Đang chọn: <strong>{selectedSize}</strong>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {sizeOptions.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all border ${
                        isSelected
                          ? "bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#070e17] border-[#ffd700] shadow-[0_0_12px_rgba(223,183,85,0.45)] scale-105"
                          : "bg-[#070e17] text-[#cbd5e1] border-[#1c2c3d] hover:border-[#dfb755] hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Action Button Row */}
            <div className="pt-2 space-y-3">
              <div className="text-xs font-serif font-bold text-[#f1f5f9] uppercase tracking-wider">
                Chọn số lượng:
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Plus Minus Counter */}
                <div className="flex items-center rounded-lg bg-[#070e17] border border-[#1c2c3d] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-[#122234] transition-colors active:scale-95"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-[#f1f5f9]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-[#122234] transition-colors active:scale-95"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Red "MUA HÀNG" Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[170px] py-2.5 px-5 bg-gradient-to-r from-[#e11d48] via-[#dc2626] to-[#b91c1c] hover:brightness-110 text-white rounded-lg font-serif text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(225,29,72,0.45)] border border-[#f43f5e] transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>MUA HÀNG NGAY</span>
                </button>

                {/* Định Vị Showroom Button */}
                <a
                  href="https://maps.app.goo.gl/5rQAVSTNhDzQtMebA"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Xem định vị showroom trên Google Maps"
                  className="px-3.5 py-2.5 bg-[#122234] hover:bg-[#dfb755]/20 text-[#dfb755] hover:text-[#ffd700] rounded-lg font-serif text-xs font-bold border border-[#dfb755]/50 flex items-center gap-1.5 shadow-sm transition-all active:scale-95 whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 text-[#ffd700] animate-bounce shrink-0" />
                  <span>Định Vị Showroom</span>
                </a>
              </div>
            </div>

            {/* Hotline Advisory Buttons */}
            <div className="pt-2">
              <div className="text-[11px] text-[#94a3b8] mb-1.5 font-medium">
                Gọi tư vấn chế tác & đặt hàng 24/7:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${cleanPhone1}`}
                  className="p-2.5 rounded-lg bg-[#070e17] hover:bg-[#122234] text-[#ffd700] border border-[#dfb755]/40 flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 fill-[#ffd700]" />
                  <span className="font-bold">Hotline 1: {hotline1}</span>
                </a>
                <a
                  href={`tel:${cleanPhone2}`}
                  className="p-2.5 rounded-lg bg-[#070e17] hover:bg-[#122234] text-[#fce9b5] border border-[#dfb755]/30 flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 fill-[#dfb755]" />
                  <span className="font-bold">Hotline 2: {hotline2}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Commitments Checklist Box (Dark card with checkboxes matching screenshot) */}
          <div className="p-4 rounded-xl bg-[#070e17] border border-[#1c2c3d] space-y-2.5 text-xs text-[#cbd5e1]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#dfb755] shrink-0 mt-0.5" />
              <span>Thanh toán COD (Nhận hàng kiểm tra đầy đủ rồi mới thanh toán)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#dfb755] shrink-0 mt-0.5" />
              <span>Miễn phí thiết kế và làm tem kính, bảng đồng kỷ niệm tặng theo yêu cầu</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#dfb755] shrink-0 mt-0.5" />
              <span>Freeship với các đơn hàng từ 2.000.000đ nội thành Hà Nội, TP.HCM & toàn quốc</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#dfb755] shrink-0 mt-0.5" />
              <span>Chính sách giá xưởng, ưu đãi tốt nhất khi đặt hàng số lượng cho công trình</span>
            </div>
            <div className="flex items-start gap-2 text-[#fce9b5]">
              <Sparkles className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
              <span>
                <strong>Với nhu cầu thiết kế, chế tác riêng theo mẫu - số lượng mang tính cá nhân hóa:</strong>{" "}
                quý khách vui lòng liên hệ trực tiếp hotline để được nghệ nhân tư vấn kỹ thuật.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABS NAVIGATION & EXPANDABLE DETAIL READER (MATCHING SCREENSHOT 1)         */}
      {/* ========================================================================= */}
      <div ref={tabsRef} className="scroll-mt-24 mb-12">
        {/* Tabs Bar Header */}
        <div className="flex items-center border-b border-[#1c2c3d] bg-[#070e17] rounded-t-xl overflow-x-auto">
          {/* Tab 1: Chi tiết sản phẩm */}
          <button
            type="button"
            onClick={() => handleTabChange("detail")}
            className={`flex-1 min-w-[160px] sm:min-w-[200px] py-3.5 px-4 text-center text-xs sm:text-sm font-serif font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === "detail"
                ? "bg-[#eab308] text-[#070e17] shadow-[0_4px_20px_rgba(234,179,8,0.4)]"
                : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-[#122234]"
            }`}
          >
            Chi tiết sản phẩm
          </button>

          {/* Tab 2: Câu hỏi thường gặp */}
          <button
            type="button"
            onClick={() => handleTabChange("faq")}
            className={`flex-1 min-w-[160px] sm:min-w-[200px] py-3.5 px-4 text-center text-xs sm:text-sm font-serif font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === "faq"
                ? "bg-[#eab308] text-[#070e17] shadow-[0_4px_20px_rgba(234,179,8,0.4)]"
                : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-[#122234]"
            }`}
          >
            Câu hỏi thường gặp
          </button>

          {/* Tab 3: Đánh giá sản phẩm */}
          <button
            type="button"
            onClick={() => handleTabChange("reviews")}
            className={`flex-1 min-w-[160px] sm:min-w-[200px] py-3.5 px-4 text-center text-xs sm:text-sm font-serif font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === "reviews"
                ? "bg-[#eab308] text-[#070e17] shadow-[0_4px_20px_rgba(234,179,8,0.4)]"
                : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-[#122234]"
            }`}
          >
            Đánh giá sản phẩm
          </button>
        </div>

        {/* Tab 1 Content: Chi tiết sản phẩm với "Xem đầy đủ" / Expand Button */}
        {activeTab === "detail" && (
          <div className="bg-[#0b1422] border-x border-b border-[#1c2c3d] rounded-b-xl p-5 sm:p-8 relative">
            {/* Collapsible Container */}
            <div
              className={`transition-all duration-700 ease-in-out relative ${
                isExpanded ? "max-h-none" : "max-h-[460px] overflow-hidden"
              }`}
            >
              {/* 1. Bảng Thông Tin Sản Phẩm (Matching table in screenshot) */}
              <div className="mb-8">
                <h3 className="font-serif text-base sm:text-lg font-black text-[#ffd700] mb-3 uppercase tracking-wide">
                  Thông tin sản phẩm:
                </h3>
                <div className="border border-[#1c2c3d] rounded-lg overflow-hidden text-xs text-[#cbd5e1]">
                  <div className="grid grid-cols-12 border-b border-[#1c2c3d] bg-[#070e17]/80 p-3">
                    <span className="col-span-4 sm:col-span-3 font-bold text-[#f1f5f9]">Tên sản phẩm:</span>
                    <span className="col-span-8 sm:col-span-9 font-semibold text-[#ffd700]">{product.name}</span>
                  </div>
                  <div className="grid grid-cols-12 border-b border-[#1c2c3d] p-3 bg-[#0b1422]">
                    <span className="col-span-4 sm:col-span-3 font-bold text-[#f1f5f9]">Chất liệu:</span>
                    <span className="col-span-8 sm:col-span-9">{product.material || "Đồng nguyên chất (Đồng Cattut / Đồng đỏ cao cấp)"}</span>
                  </div>
                  <div className="grid grid-cols-12 border-b border-[#1c2c3d] bg-[#070e17]/80 p-3">
                    <span className="col-span-4 sm:col-span-3 font-bold text-[#f1f5f9]">Kích thước:</span>
                    <span className="col-span-8 sm:col-span-9">{selectedSize || product.dimensions || "Theo yêu cầu phong thủy"}</span>
                  </div>
                  <div className="grid grid-cols-12 border-b border-[#1c2c3d] p-3 bg-[#0b1422]">
                    <span className="col-span-4 sm:col-span-3 font-bold text-[#f1f5f9]">Phương thức:</span>
                    <span className="col-span-8 sm:col-span-9">Đúc đồng thủ công truyền thống làng nghề Ý Yên</span>
                  </div>
                  <div className="grid grid-cols-12 bg-[#070e17]/80 p-3">
                    <span className="col-span-4 sm:col-span-3 font-bold text-[#f1f5f9]">Mẫu:</span>
                    <span className="col-span-8 sm:col-span-9">Chế tác theo yêu cầu, chạm khắc hoa văn tinh xảo</span>
                  </div>
                </div>
              </div>

              {/* 2. Hình Ảnh Sản Phẩm & Bài Viết Chi Tiết */}
              <div className="space-y-6 text-[#cbd5e1] text-xs sm:text-sm leading-relaxed">
                <h3 className="font-serif text-base sm:text-lg font-black text-[#ffd700] uppercase tracking-wide">
                  Hình ảnh sản phẩm & Quy trình chế tác:
                </h3>

                {/* Primary Embedded Showcase Photo */}
                <div className="relative rounded-xl overflow-hidden border border-[#1c2c3d] bg-[#070e17] flex items-center justify-center p-4">
                  <img
                    src={currentImage}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-[500px] w-auto object-contain rounded-lg"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <p>
                    Tác phẩm <strong className="text-[#ffd700]">{product.name}</strong> được trực tiếp chế tác bởi các nghệ nhân lão luyện của thương hiệu <strong className="text-[#ffd700]">Đồ Đồng Lộc Nam</strong> tại làng nghề đúc đồng truyền thống Ý Yên, Nam Định.
                  </p>

                  <p>
                    {product.description ||
                      "Sản phẩm được đúc từ nguồn đồng chuẩn thanh khiết, trải qua đầy đủ quy trình nghiêm ngặt: tạo mẫu đắp đất, làm khuôn chịu nhiệt 2 lớp, nấu đồng ở nhiệt độ cao trên 1200 độ C, rót đồng nguyên khối, chạm trổ hoa văn tinh xảo thủ công và xử lý mạ vàng 24k hoặc phun bóng bảo vệ bề mặt chống oxy hóa vượt thời gian."}
                  </p>

                  <div className="p-4 rounded-xl bg-[#070e17] border border-[#1c2c3d] space-y-2">
                    <h4 className="font-serif font-bold text-sm text-[#ffd700] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#ffd700]" />
                      <span>Cam Kết Đẳng Cấp Từ Đồ Đồng Lộc Nam:</span>
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-xs text-[#cbd5e1]">
                      <li>Chế tác thủ công tinh xảo, kiểm định phôi đồng khắt khe 100%.</li>
                      <li>Hoa văn sắc nét, đường nét uy nghiêm, chuẩn phong thủy truyền thống.</li>
                      <li>Khách hàng được mở hàng kiểm tra cẩn thận trước khi thanh toán tiền.</li>
                      <li>Bảo hành trọn đời chất lượng phôi đồng thanh khiết không bong tróc, nứt gãy.</li>
                    </ul>
                  </div>

                  {/* Secondary Photo Showcase */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      {images.slice(1, 3).map((img, i) => (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden border border-[#1c2c3d] bg-[#070e17] p-2 flex items-center justify-center"
                        >
                          <img
                            src={img}
                            alt={`${product.name} góc chụp ${i + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="max-h-[360px] object-contain rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gradient overlay when collapsed */}
              {!isExpanded && (
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b1422] via-[#0b1422]/90 to-transparent pointer-events-none" />
              )}
            </div>

            {/* Read More / Collapse Button ("nút xem chi tiết chữ sản phẩm phần khi đọc sản phẩm") */}
            <div className="pt-4 text-center relative z-20">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#070e17] hover:bg-[#122234] text-[#ffd700] hover:text-white border-2 border-[#dfb755]/60 hover:border-[#ffd700] font-serif text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(223,183,85,0.25)] active:scale-95 group"
              >
                <span>{isExpanded ? "Thu gọn nội dung" : "Xem đầy đủ chi tiết"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#ffd700] group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#ffd700] group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2 Content: Câu hỏi thường gặp (FAQ) */}
        {activeTab === "faq" && (
          <div className="bg-[#0b1422] border-x border-b border-[#1c2c3d] rounded-b-xl p-5 sm:p-8 space-y-4">
            <h3 className="font-serif text-base sm:text-lg font-black text-[#ffd700] mb-4 uppercase tracking-wide">
              Câu Hỏi Thường Gặp Về Sản Phẩm:
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#070e17] border border-[#1c2c3d]">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#ffd700] mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#dfb755] shrink-0" />
                  <span>Sản phẩm có đúng là đúc từ đồng chuẩn nguyên chất không?</span>
                </h4>
                <p className="text-xs text-[#cbd5e1] leading-relaxed pl-6">
                  Đồ Đồng Lộc Nam cam kết 100% sản phẩm được đúc từ nguồn đồng chuẩn nguyên khối (đồng Cattut vỏ đạn quân sự, đồng đỏ hoặc đồng vàng nguyên chất). Quý khách hoàn toàn có thể kiểm tra cân nặng và thẩm định chất lượng phôi đồng trước khi thanh toán.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070e17] border border-[#1c2c3d]">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#ffd700] mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#dfb755] shrink-0" />
                  <span>Chính sách bảo hành sản phẩm tại Lộc Nam như thế nào?</span>
                </h4>
                <p className="text-xs text-[#cbd5e1] leading-relaxed pl-6">
                  Tất cả tác phẩm đúc đồng cao cấp tại Lộc Nam đều được bảo hành trọn đời về độ bền phôi đồng và hỗ trợ làm mới, mạ vàng dát vàng nâng cấp trọn đời với chi phí ưu đãi cho khách hàng thân thiết.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070e17] border border-[#1c2c3d]">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#ffd700] mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#dfb755] shrink-0" />
                  <span>Tôi ở xa (Hà Nội, TP.HCM, miền Tây) thì nhận hàng và thanh toán ra sao?</span>
                </h4>
                <p className="text-xs text-[#cbd5e1] leading-relaxed pl-6">
                  Chúng tôi đóng kiện gỗ xốp chống sốc chuyên dụng và giao hàng tận nơi trên toàn quốc. Khách hàng được quyền mở hộp, kiểm tra cẩn thận đúng mẫu mã, hoa văn và cân nặng trước khi giao tiền cho nhân viên bưu điện (COD).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070e17] border border-[#1c2c3d]">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#ffd700] mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#dfb755] shrink-0" />
                  <span>Có nhận đúc theo kích thước ban thờ và thước Lỗ Ban riêng không?</span>
                </h4>
                <p className="text-xs text-[#cbd5e1] leading-relaxed pl-6">
                  Có! Lộc Nam nhận đúc đo ni đóng giày theo kích thước lỗ ban phong thủy riêng của từng gia đình và doanh nghiệp. Nghệ nhân sẽ tư vấn cụ thể cung số đỏ tài lộc hợp gia chủ.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3 Content: Đánh giá sản phẩm */}
        {activeTab === "reviews" && (
          <div className="bg-[#0b1422] border-x border-b border-[#1c2c3d] rounded-b-xl p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-xl bg-[#070e17] border border-[#1c2c3d]">
              <div className="text-center sm:text-left">
                <div className="font-serif font-black text-3xl sm:text-4xl text-[#ffd700]">5.0 / 5.0</div>
                <div className="flex items-center justify-center sm:justify-start text-[#ffd700] gap-1 my-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-[#94a3b8]">Dựa trên 48 lượt đánh giá thực tế từ khách hàng</div>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-2.5 px-5 bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#070e17] rounded-lg font-serif text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95"
              >
                Gửi Đánh Giá Của Bạn
              </button>
            </div>

            {/* Testimonials List */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#070e17] border border-[#1c2c3d] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f1f5f9]">Bác Trần Văn Hưng (Quận Hoàn Kiếm, Hà Nội)</span>
                  <span className="text-[#64748b]">1 tuần trước</span>
                </div>
                <div className="flex items-center text-[#ffd700] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Đôi chân nến và bộ đồ thờ đúc rất dày dặn, phôi đồng chuẩn màu vàng ánh kim cực kỳ trang nghiêm. Đóng gói rất cẩn thận, giao tới Hà Nội đúng hẹn. Rất hài lòng!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070e17] border border-[#1c2c3d] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f1f5f9]">Anh Nguyễn Hoàng Nam (Quận 1, TP.HCM)</span>
                  <span className="text-[#64748b]">2 tuần trước</span>
                </div>
                <div className="flex items-center text-[#ffd700] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Sản phẩm sắc nét, hoa văn tinh tế đúng chuẩn làng nghề Ý Yên. Xứng đáng với giá trị tâm linh của gia đình.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Quick Order Section with ID for smooth anchor positioning */}
      <div ref={orderRef} id="dat-hang" className="scroll-mt-24 mb-12">
        <div className="bg-[#0b1422] p-6 sm:p-8 rounded-2xl border border-[#1c2c3d] shadow-xl">
          <div className="border-b border-[#1c2c3d] pb-3 mb-6">
            <h3 className="font-serif font-black text-lg sm:text-xl text-[#ffd700] uppercase tracking-wide">
              Biểu Mẫu Đặt Hàng & Yêu Cầu Chế Tác
            </h3>
            <p className="text-xs text-[#94a3b8] mt-1 font-light">
              Quý khách chỉ cần để lại số điện thoại, nghệ nhân Lộc Nam sẽ gọi lại tư vấn kỹ thuật và chốt đơn trong 15 phút.
            </p>
          </div>
          <QuickOrderForm
            productName={`${product.name} (${selectedSize}, SL: ${quantity})`}
            hotline={hotline1}
          />
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#1c2c3d] pt-10 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#f1f5f9] uppercase tracking-wide">
              Sản Phẩm Cùng Danh Mục
            </h2>
            <Link
              href={`/san-pham/${product.category.slug}`}
              className="text-xs font-serif font-bold text-[#dfb755] hover:text-[#ffd700] transition-colors"
            >
              Xem tất cả danh mục ›
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rel) => {
              const thumb = rel.images[0] || "/images/hero_golden_ship.jpg";
              const isGift =
                rel.category?.slug === "qua-tang" ||
                rel.category?.slug === "qua-tang-dong";
              const relHref = isGift
                ? `/qua-tang/${rel.slug}`
                : `/san-pham/${rel.category.slug}/${rel.slug}`;

              return (
                <div
                  key={rel.id}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("a") || target.closest("button")) return;
                    router.push(relHref);
                  }}
                  onMouseEnter={() => router.prefetch(relHref)}
                  onTouchStart={() => router.prefetch(relHref)}
                  className="group bg-[#0b1422] rounded-xl border border-[#1c2c3d] hover:border-[#dfb755] p-3 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(223,183,85,0.2)] hover:-translate-y-1 cursor-pointer"
                >
                  <div>
                    <Link
                      href={relHref}
                      prefetch={true}
                      className="block aspect-square overflow-hidden bg-[#070e17] rounded-lg relative p-2 mb-2"
                    >
                      <img
                        src={getWatermarkedImageUrl(thumb)}
                        alt={rel.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="space-y-1">
                      <Link href={relHref} prefetch={true}>
                        <h3 className="font-serif font-semibold text-xs text-[#f1f5f9] group-hover:text-[#ffd700] line-clamp-2 leading-snug transition-colors">
                          {rel.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-0.5 text-[#ffd700]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-current" />
                        ))}
                      </div>

                      <div className="pt-1">
                        <span className="font-serif text-xs sm:text-[13px] font-black text-[#ffd700]">
                          {rel.price ? `${rel.price.toLocaleString("vi-VN")}đ` : "Liên hệ"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
