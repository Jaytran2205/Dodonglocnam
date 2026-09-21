"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Heart,
  SlidersHorizontal,
  X,
  Check,
  ChevronDown,
  ShoppingCart,
  Star,
} from "lucide-react";
import {
  MainCategoryData,
  SubCategoryItem,
  DetailCategoryItem,
} from "@/lib/subcategories-data";
import { formatPrice, getWatermarkedImageUrl, removeVietnameseTones } from "@/lib/utils";

export interface ListingProduct {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  originalPrice?: number | null;
  images: string;
  material?: string | null;
  dimensions?: string | null;
  category: {
    name: string;
    slug: string;
  };
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface CategoryProductListingViewProps {
  mainCategory: MainCategoryData;
  activeSubCategory?: SubCategoryItem;
  activeDetailCategory?: DetailCategoryItem;
  products: ListingProduct[];
  breadcrumbs: BreadcrumbItem[];
  parentBackHref?: string;
  parentBackText?: string;
}

export function CategoryProductListingView({
  mainCategory,
  activeSubCategory,
  activeDetailCategory,
  products,
  breadcrumbs,
  parentBackHref,
  parentBackText,
}: CategoryProductListingViewProps) {
  const router = useRouter();
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Always pin/scroll to the top of the product listing when entering from grid or switching subcategories
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeSubCategory?.id, activeDetailCategory?.id]);

  // Active filter keywords
  const activeKeywords = useMemo(() => {
    if (activeDetailCategory) {
      return activeDetailCategory.keyword.toLowerCase().split(",").map((k) => k.trim());
    }
    if (activeSubCategory) {
      return activeSubCategory.keyword.toLowerCase().split(",").map((k) => k.trim());
    }
    return [];
  }, [activeDetailCategory, activeSubCategory]);

  const activeTitle = useMemo(() => {
    if (activeDetailCategory && activeDetailCategory.id !== activeSubCategory?.id) return activeDetailCategory.name;
    if (activeSubCategory) return activeSubCategory.name;
    return mainCategory.name;
  }, [activeDetailCategory, activeSubCategory, mainCategory]);

  const basePrefix =
    mainCategory.slug === "qua-tang" || mainCategory.slug === "qua-tang-dong"
      ? "/qua-tang"
      : `/san-pham/${mainCategory.slug}`;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (product: ListingProduct, e: React.MouseEvent) => {
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
          image: parseMainImage(product.images),
          categorySlug: product.category?.slug || "san-pham",
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      setToastMessage(`Đã thêm "${product.name}" vào giỏ hàng!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Filter products
  const filteredProducts = useMemo(() => {
    const isCrossCategory =
      activeSubCategory?.id === "linh-vat-12-con-giap" ||
      activeSubCategory?.id === "trong-dong-qua-tang";

    let result = isCrossCategory
      ? [...products]
      : (mainCategory.slug === "qua-tang" || mainCategory.slug === "qua-tang-dong")
      ? products.filter((p) => p.category.slug === "qua-tang" || p.category.slug === "qua-tang-dong")
      : products.filter((p) => p.category.slug === mainCategory.slug);

    // Gift folders isolation: ensure products from folder A never leak into folder B
    const giftFolderKeys = [
      "qua-tang-doanh-nghiep",
      "qua-tang-su-kien",
      "qua-tang-phong-thuy",
      "qua-tang-luu-niem",
    ];

    if (activeSubCategory && giftFolderKeys.includes(activeSubCategory.id)) {
      const currentFolder = activeSubCategory.id;
      // Exclude products that explicitly belong to another gift folder
      result = result.filter((p) => {
        const otherFolders = giftFolderKeys.filter((f) => f !== currentFolder);
        const belongsToOther = otherFolders.some((f) => p.images && p.images.includes(f));
        return !belongsToOther;
      });
    }

    // Check if viewing whole gift subcategory (all products in this folder)
    const isGiftCategory = activeSubCategory && giftFolderKeys.includes(activeSubCategory.id);
    const isViewingEntireGiftFolder =
      isGiftCategory &&
      (!activeDetailCategory ||
        activeDetailCategory.id === activeSubCategory?.id ||
        giftFolderKeys.includes(activeDetailCategory.id));

    if (isViewingEntireGiftFolder && activeSubCategory) {
      result = result.filter((p) => {
        if (p.images && p.images.includes(activeSubCategory.id)) {
          return true;
        }
        // Fallback to keyword matching for older legacy products in DB
        const pName = p.name.toLowerCase();
        const pNameClean = removeVietnameseTones(pName);
        return activeKeywords.some((kw) => {
          const cleanKw = kw.trim();
          if (!cleanKw) return false;
          const cleanKwTones = removeVietnameseTones(cleanKw);
          if (cleanKw.includes(" ")) return pName.includes(cleanKw) || pNameClean.includes(cleanKwTones);
          const regex = new RegExp(
            `(^|[\\s,./()_\\-+:"'])${cleanKw.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}($|[\\s,./()_\\-+:"'])`,
            "i"
          );
          const regexClean = new RegExp(
            `(^|[\\s,./()_\\-+:"'])${cleanKwTones.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}($|[\\s,./()_\\-+:"'])`,
            "i"
          );
          return regex.test(pName) || regexClean.test(pNameClean);
        });
      });
    } else if (activeKeywords.length > 0) {
      result = result.filter((p) => {
        const pName = p.name.toLowerCase();
        const pNameClean = removeVietnameseTones(pName);

        // Special exclusion: Tranh chữ must only be paintings/plaques, never statues
        if (activeDetailCategory?.id === "tranh-chu-dong-dat-vang" && (pName.includes("tượng") || !pName.includes("tranh"))) {
          return false;
        }

        // Special exclusion: Tranh & Đĩa phong thủy must only be paintings/plates, never statues
        if (activeDetailCategory?.id === "tranh-dia-phong-thuy-cat-tuong" && pName.includes("tượng")) {
          return false;
        }

        // Special exclusion: if viewing Tiger (hổ), exclude rắn / rắn hổ mang
        const isTigerView =
          activeDetailCategory?.id === "tuong-ho" ||
          activeKeywords.includes("hổ");
        if (isTigerView && (pName.includes("rắn") || pName.includes("hổ mang"))) {
          return false;
        }

        return activeKeywords.some((kw) => {
          const cleanKw = kw.trim();
          if (!cleanKw) return false;
          const cleanKwTones = removeVietnameseTones(cleanKw);
          // Multi-word phrase: direct substring
          if (cleanKw.includes(" ")) {
            return pName.includes(cleanKw) || pNameClean.includes(cleanKwTones);
          }
          // Single word: use word boundary regex to avoid matching substrings like "ngọ" in "ngọc" or "heo" in "theo"
          const regex = new RegExp(`(^|[\\s,./()_\\-+:"'])${cleanKw.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}($|[\\s,./()_\\-+:"'])`, "i");
          const regexClean = new RegExp(`(^|[\\s,./()_\\-+:"'])${cleanKwTones.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}($|[\\s,./()_\\-+:"'])`, "i");
          return regex.test(pName) || regexClean.test(pNameClean);
        });
      });
    }

    // 2. Price filter
    if (priceFilter !== "all") {
      result = result.filter((p) => {
        const price = p.price || 0;
        if (price === 0) return true; // Liên hệ
        switch (priceFilter) {
          case "under-1m":
            return price < 1000000;
          case "1m-3m":
            return price >= 1000000 && price <= 3000000;
          case "3m-5m":
            return price > 3000000 && price <= 5000000;
          case "5m-10m":
            return price > 5000000 && price <= 10000000;
          case "10m-20m":
            return price > 10000000 && price <= 20000000;
          case "above-20m":
            return price > 20000000;
          default:
            return true;
        }
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "price-asc") {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === "price-desc") {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name, "vi");
      }
      // default newest
      return 0;
    });

    return result;
  }, [products, mainCategory.slug, activeKeywords, priceFilter, sortBy]);

  // Reset to page 1 on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceFilter, sortBy, activeSubCategory, activeDetailCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Prefetch for visible products deferred until after initial render so images load first at full bandwidth
  useEffect(() => {
    const timer = setTimeout(() => {
      paginatedProducts.forEach((p) => {
        const isGift =
          p.category?.slug === "qua-tang" ||
          p.category?.slug === "qua-tang-dong" ||
          mainCategory.slug === "qua-tang" ||
          mainCategory.slug === "qua-tang-dong";
        const href = isGift
          ? `/qua-tang/${p.slug}`
          : `/san-pham/${p.category?.slug || mainCategory.slug}/${p.slug}`;
        router.prefetch(href);
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [paginatedProducts, mainCategory.slug, router]);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const parseMainImage = (imagesStr: string) => {
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
      if (imagesStr && imagesStr.startsWith("/")) return imagesStr;
    }
    return "/images/hero_golden_ship.jpg";
  };

  const formatPrice = (price: number | null) => {
    if (!price || price === 0) return "Liên hệ";
    return price.toLocaleString("vi-VN") + " ₫";
  };

  return (
    <div className="w-full">
      {/* 0. Full-Width Edge-to-Edge Category Banner */}
      {mainCategory?.banner && (
        <section aria-label={`Banner danh mục ${mainCategory.name}`} className="w-full relative aspect-[1920/818] min-h-[160px] sm:min-h-[220px] bg-[#0c1825] border-b border-[#1e344d]/60 overflow-hidden shadow-2xl">
          <img
            src={mainCategory.banner}
            alt={mainCategory.name}
            className="w-full h-full object-cover object-center transform-gpu [image-rendering:-webkit-optimize-contrast]"
            loading="eager"
            fetchPriority="high"
          />
        </section>
      )}

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 2xl:px-8 py-6 sm:py-8">
        {/* 1. Breadcrumbs Navigation */}
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

      {/* 2. Mobile Filter Bar (< lg) */}
      <div className="lg:hidden flex items-center justify-between gap-3 bg-[#0c1825] p-3 rounded-xl border border-[#1e344d] mb-6">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 bg-[#ffd700] text-black font-bold px-3.5 py-2 rounded-lg text-xs active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Danh mục & Bộ lọc</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
          <span>Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#070e17] border border-[#1e344d] text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-[#ffd700]"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="name-asc">Tên A-Z</option>
          </select>
        </div>
      </div>

      {/* 3. Main 2-Column Layout (Sidebar 30% + Product Grid 70%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ========================================================= */}
        {/* DESKTOP SIDEBAR (3 cols ~ 25-30%)                         */}
        {/* ========================================================= */}
        <aside className="hidden lg:block lg:col-span-3 bg-[#0a1420] border border-[#1e344d] rounded-2xl p-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto space-y-6 custom-scrollbar">
          {/* Back to Parent Button */}
          {parentBackHref && (
            <Link
              href={parentBackHref}
              scroll={false}
              className="flex items-center gap-2 text-xs text-[#dfb755] hover:text-white font-semibold pb-3 border-b border-[#1e344d] w-full transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span className="truncate">{parentBackText || `Trở về danh mục ${mainCategory.name}`}</span>
            </Link>
          )}

          {/* Section 1: CÂY THƯ MỤC DANH MỤC */}
          <div>
            <h3 className="font-serif text-xs sm:text-sm font-extrabold text-[#ffd700] uppercase tracking-wider pb-2 border-b border-[#ffd700]/30 mb-3">
              DANH MỤC {mainCategory.name.toUpperCase()}
            </h3>

            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {mainCategory.subCategories.map((sub) => {
                const isSubActive =
                  activeSubCategory?.id === sub.id && !activeDetailCategory;
                const isParentOfActiveDetail = activeSubCategory?.id === sub.id;
                const subHref = `${basePrefix}/${sub.id}`;

                return (
                  <div key={sub.id} className="space-y-0.5">
                    {/* Subcategory Parent Link */}
                    <Link
                      href={subHref}
                      scroll={false}
                      className={`text-xs py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-between group select-none ${
                        isSubActive
                          ? "bg-gradient-to-r from-[#ffd700]/15 to-[#ffd700]/5 text-[#ffd700] font-bold border-l-2 border-[#ffd700]"
                          : isParentOfActiveDetail
                          ? "text-[#ffd700] font-semibold bg-white/[0.03]"
                          : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-white/[0.04] font-medium"
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      {isSubActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700] shrink-0 ml-1.5" />
                      )}
                    </Link>

                    {/* Children List */}
                    {sub.children && sub.children.length > 0 && isParentOfActiveDetail && (
                      <div className="pl-3 space-y-0.5 border-l-2 border-[#ffd700]/20 ml-3 my-1">
                        {sub.children.map((child) => {
                          const isChildActive = activeDetailCategory?.id === child.id;
                          return (
                            <Link
                              key={child.id}
                              href={`${basePrefix}/${sub.id}/${child.id}`}
                              scroll={false}
                              className={`text-[11px] py-1 px-2 rounded-md transition-all flex items-center justify-between group select-none ${
                                isChildActive
                                  ? "bg-[#ffd700]/15 text-[#ffd700] font-bold"
                                  : "text-[#94a3b8] hover:text-[#ffd700] hover:bg-white/[0.03] font-medium"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className={`w-1 h-1 rounded-full shrink-0 transition-colors ${
                                    isChildActive
                                      ? "bg-[#ffd700] shadow-[0_0_4px_#ffd700]"
                                      : "bg-[#64748b] group-hover:bg-[#ffd700]"
                                  }`}
                                />
                                <span className="truncate">{child.name}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: BỘ LỌC KHOẢNG GIÁ */}
          <div>
            <h3 className="font-serif text-xs sm:text-sm font-extrabold text-[#ffd700] uppercase tracking-wider pb-2 border-b border-[#ffd700]/30 mb-3">
              KHOẢNG GIÁ
            </h3>
            <div className="space-y-1">
              {[
                { id: "all", label: "Tất cả mức giá" },
                { id: "under-1m", label: "Dưới 1 triệu" },
                { id: "1m-3m", label: "Từ 1 triệu - 3 triệu" },
                { id: "3m-5m", label: "Từ 3 triệu - 5 triệu" },
                { id: "5m-10m", label: "Từ 5 triệu - 10 triệu" },
                { id: "10m-20m", label: "Từ 10 triệu - 20 triệu" },
                { id: "above-20m", label: "Trên 20 triệu" },
              ].map((range) => {
                const isSelected = priceFilter === range.id;
                return (
                  <label
                    key={range.id}
                    className={`flex items-center gap-2.5 text-xs cursor-pointer py-1.5 px-2 rounded-lg transition-all select-none ${
                      isSelected
                        ? "bg-[#ffd700]/10 text-[#ffd700] font-bold"
                        : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-white/[0.03] font-medium"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "border-[#ffd700] bg-[#ffd700]/20"
                          : "border-[#334155] bg-[#070e17]"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_4px_#ffd700]" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="priceFilter"
                      checked={isSelected}
                      onChange={() => setPriceFilter(range.id)}
                      className="sr-only"
                    />
                    <span className="truncate">{range.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* PRODUCT GRID SECTION (9 cols ~ 70-75%)                    */}
        {/* ========================================================= */}
        <section className="lg:col-span-9 space-y-6">
          {/* Header Bar */}
          <div className="bg-[#0a1524] border border-[#1e344d] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-black text-[#ffd700] uppercase tracking-wide">
                {activeTitle}
              </h1>
              <p className="text-xs text-[#94a3b8] mt-1 font-medium">
                Hiển thị <span className="text-[#ffd700] font-bold">{filteredProducts.length}</span> sản phẩm
              </p>
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#94a3b8]">
              <span>Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#070e17] border border-[#1e344d] text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#ffd700]"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name-asc">Tên A-Z</option>
              </select>
            </div>
          </div>

          {/* Product Grid 4 Columns */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {paginatedProducts.map((p, idx) => (
                <ListingProductCard
                  key={p.id}
                  product={p}
                  priority={idx < 4}
                  isWished={wishlist.includes(p.id)}
                  mainCategorySlug={mainCategory.slug}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#0a1524] border border-[#1e344d] rounded-2xl p-12 text-center space-y-3">
              <p className="text-sm sm:text-base text-[#cbd5e1]">
                Hiện chưa có sản phẩm phù hợp với bộ lọc trong mục{" "}
                <span className="text-[#ffd700] font-bold">{activeTitle}</span>.
              </p>
              <button
                type="button"
                onClick={() => setPriceFilter("all")}
                className="text-xs font-bold text-[#ffd700] hover:underline"
              >
                Xóa bộ lọc giá để xem tất cả
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#0a1524] border border-[#1e344d] text-[#cbd5e1] hover:text-[#ffd700] hover:border-[#ffd700] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                ← Trang trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === currentPage;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#ffd700] text-black shadow-md scale-105"
                        : "bg-[#0a1524] border border-[#1e344d] text-[#cbd5e1] hover:text-[#ffd700] hover:border-[#ffd700]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#0a1524] border border-[#1e344d] text-[#cbd5e1] hover:text-[#ffd700] hover:border-[#ffd700] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Trang sau →
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ========================================================= */}
      {/* MOBILE FILTER MODAL DRAWER                                */}
      {/* ========================================================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative ml-auto w-[85%] max-w-[340px] h-full bg-[#0a1420] border-l border-[#1e344d] p-5 overflow-y-auto z-10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e344d]">
                <h3 className="font-serif text-sm font-bold text-[#ffd700] uppercase">
                  DANH MỤC & BỘ LỌC
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-[#94a3b8] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category Tree */}
              <div>
                <h4 className="text-xs font-extrabold text-[#ffd700] uppercase mb-2.5 tracking-wider pb-1.5 border-b border-[#ffd700]/30">
                  DANH MỤC {mainCategory.name}
                </h4>
                <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                  {mainCategory.subCategories.map((sub) => {
                    const isSubActive =
                      activeSubCategory?.id === sub.id && !activeDetailCategory;
                    const isParentOfActiveDetail = activeSubCategory?.id === sub.id;

                    return (
                      <div key={sub.id} className="space-y-0.5">
                        <Link
                          href={`${basePrefix}/${sub.id}`}
                          scroll={false}
                          onClick={() => setMobileFilterOpen(false)}
                          className={`text-xs py-1.5 px-2 rounded-lg flex items-center justify-between transition-colors ${
                            isSubActive
                              ? "bg-gradient-to-r from-[#ffd700]/15 to-[#ffd700]/5 text-[#ffd700] font-bold border-l-2 border-[#ffd700]"
                              : isParentOfActiveDetail
                              ? "text-[#ffd700] font-semibold bg-white/[0.03]"
                              : "text-[#cbd5e1] hover:text-[#ffd700]"
                          }`}
                        >
                          <span className="truncate">{sub.name}</span>
                          {isSubActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700] shrink-0 ml-1.5" />
                          )}
                        </Link>

                        {sub.children && isParentOfActiveDetail && (
                          <div className="pl-3 space-y-0.5 border-l-2 border-[#ffd700]/20 ml-3 my-1">
                            {sub.children.map((child) => {
                              const isChildActive =
                                activeDetailCategory?.id === child.id;
                              return (
                                <Link
                                  key={child.id}
                                  href={`${basePrefix}/${sub.id}/${child.id}`}
                                  scroll={false}
                                  onClick={() => setMobileFilterOpen(false)}
                                  className={`text-[11px] py-1 px-2 rounded-md flex items-center justify-between transition-colors ${
                                    isChildActive
                                      ? "bg-[#ffd700]/15 text-[#ffd700] font-bold"
                                      : "text-[#94a3b8] hover:text-[#ffd700]"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span
                                      className={`w-1 h-1 rounded-full shrink-0 ${
                                        isChildActive
                                          ? "bg-[#ffd700] shadow-[0_0_4px_#ffd700]"
                                          : "bg-[#64748b]"
                                      }`}
                                    />
                                    <span className="truncate">{child.name}</span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Price Filter */}
              <div>
                <h4 className="text-xs font-extrabold text-[#ffd700] uppercase mb-2.5 tracking-wider pb-1.5 border-b border-[#ffd700]/30">
                  KHOẢNG GIÁ
                </h4>
                <div className="space-y-1">
                  {[
                    { id: "all", label: "Tất cả mức giá" },
                    { id: "under-1m", label: "Dưới 1 triệu" },
                    { id: "1m-3m", label: "Từ 1 triệu - 3 triệu" },
                    { id: "3m-5m", label: "Từ 3 triệu - 5 triệu" },
                    { id: "5m-10m", label: "Từ 5 triệu - 10 triệu" },
                    { id: "10m-20m", label: "Từ 10 triệu - 20 triệu" },
                    { id: "above-20m", label: "Trên 20 triệu" },
                  ].map((range) => {
                    const isSelected = priceFilter === range.id;
                    return (
                      <label
                        key={range.id}
                        className={`flex items-center gap-2.5 text-xs cursor-pointer py-1.5 px-2 rounded-lg transition-all ${
                          isSelected
                            ? "bg-[#ffd700]/10 text-[#ffd700] font-bold"
                            : "text-[#cbd5e1]"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-[#ffd700] bg-[#ffd700]/20"
                              : "border-[#334155] bg-[#070e17]"
                          }`}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="mobilePriceFilter"
                          checked={isSelected}
                          onChange={() => {
                            setPriceFilter(range.id);
                            setMobileFilterOpen(false);
                          }}
                          className="sr-only"
                        />
                        <span>{range.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#ffd700] text-black font-bold text-xs uppercase"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification for Cart Addition */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#0c1825] border-2 border-[#ffd700] text-white px-4 py-3 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 max-w-sm">
          <div className="w-8 h-8 rounded-full bg-[#ffd700] text-black flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
            ✓
          </div>
          <div className="text-xs flex-grow">
            <p className="font-bold text-[#ffd700]">Giỏ hàng Lộc Nam</p>
            <p className="text-slate-200 line-clamp-1 mt-0.5">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 text-sm font-bold"
            aria-label="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive Dark Luxury Product Card with Multi-Image Dots & Preview Arrows
// ---------------------------------------------------------------------------
interface ListingProductCardProps {
  product: ListingProduct;
  priority?: boolean;
  isWished: boolean;
  mainCategorySlug: string;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  onAddToCart: (p: ListingProduct, e: React.MouseEvent) => void;
}

function ListingProductCard({
  product,
  priority = false,
  isWished,
  mainCategorySlug,
  onToggleWishlist,
  onAddToCart,
}: ListingProductCardProps) {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  let imageList: string[] = [];
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed)) {
      imageList = parsed.filter((img) => typeof img === "string" && img.trim().length > 0);
    } else if (typeof parsed === "string") {
      imageList = [parsed];
    }
  } catch {
    if (product.images) imageList = [product.images];
  }
  if (imageList.length === 0) {
    imageList = ["/images/locnam_real/locnam_qua_doanh_nghiep.jpg"];
  }

  const hasMultiple = imageList.length > 1;
  const currentImg = hasMultiple
    ? imageList[activeImageIndex % imageList.length]
    : imageList[0];

  const isGift =
    product.category?.slug === "qua-tang" ||
    product.category?.slug === "qua-tang-dong" ||
    mainCategorySlug === "qua-tang" ||
    mainCategorySlug === "qua-tang-dong";

  const detailHref = isGift
    ? `/qua-tang/${product.slug}`
    : `/san-pham/${product.category?.slug || mainCategorySlug}/${product.slug}`;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <div
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest("button") && !target.closest("a")) {
          router.push(detailHref);
        }
      }}
      onMouseEnter={() => router.prefetch(detailHref)}
      onTouchStart={() => router.prefetch(detailHref)}
      className="group bg-[#0a1524] border border-[#1e344d] rounded-xl overflow-hidden hover:border-[#ffd700] hover:shadow-[0_0_20px_rgba(255,215,0,0.25)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-[#070e17] group/cardimg">
        <Link href={detailHref} prefetch={true} className="block w-full h-full">
          <img
            src={getWatermarkedImageUrl(currentImg)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            // @ts-ignore
            fetchPriority={priority ? "high" : "auto"}
            width={400}
            height={400}
          />
        </Link>

        {/* Navigation Dots if multiple images */}
        {hasMultiple && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
            {imageList.map((_, dotIdx) => {
              const isActive = (activeImageIndex % imageList.length) === dotIdx;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImageIndex(dotIdx);
                  }}
                  onMouseEnter={() => setActiveImageIndex(dotIdx)}
                  aria-label={`Xem ảnh ${dotIdx + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-4 h-1.5 bg-[#ffd700] shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                      : "w-1.5 h-1.5 bg-white/60 hover:bg-white hover:scale-125"
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Prev / Next Chevrons on Hover (Desktop) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-[#ffd700] flex items-center justify-center opacity-0 group-hover/cardimg:opacity-100 transition-opacity z-20 backdrop-blur-sm border border-white/15"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-[#ffd700] flex items-center justify-center opacity-0 group-hover/cardimg:opacity-100 transition-opacity z-20 backdrop-blur-sm border border-white/15"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Wishlist Heart Button (Top-Right) */}
        <button
          type="button"
          onClick={(e) => onToggleWishlist(product.id, e)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20 ${
            isWished
              ? "bg-red-600 text-white shadow-md scale-110"
              : "bg-black/60 text-white/80 hover:text-red-500 hover:bg-black/80 backdrop-blur-sm"
          }`}
          aria-label="Thêm vào yêu thích"
        >
          <Heart className={`w-4 h-4 ${isWished ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-grow gap-2">
        <Link href={detailHref} prefetch={true}>
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ffd700] transition-colors line-clamp-2 min-h-[38px] leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* 5 Stars Rating & Score */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="flex items-center text-[#ffd700]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#ffd700] text-[#ffd700]" />
            ))}
          </div>
          <span className="text-[10px] text-[#94a3b8] font-bold">5/5</span>
        </div>

        {/* Price Row */}
        <div className="pt-1.5 border-t border-[#1e344d]/60 flex items-baseline justify-between gap-2">
          <span className="text-xs sm:text-sm font-black text-[#ffd700]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > (product.price || 0) && (
            <span className="text-[10px] text-[#64748b] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Two Action Buttons: Giỏ Hàng (Trắng) & Chi Tiết (Vàng) */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 mt-auto">
          <button
            type="button"
            onClick={(e) => onAddToCart(product, e)}
            className="bg-white hover:bg-slate-100 text-[#801019] text-[11px] sm:text-xs font-black py-2 px-1 rounded-lg text-center transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95 border border-white"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#801019] shrink-0" />
            <span className="truncate">Giỏ Hàng</span>
          </button>
          <Link
            href={detailHref}
            prefetch={true}
            className="bg-[#ffd700] hover:bg-[#ffe082] text-[#070e17] text-[11px] sm:text-xs font-black py-2 px-1 rounded-lg text-center transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95 border border-[#ffd700]"
            title="Xem chi tiết sản phẩm"
          >
            <span className="truncate">Chi Tiết</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
