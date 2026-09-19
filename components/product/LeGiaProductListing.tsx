"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingBag,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  X,
  Check,
  Filter,
  ArrowLeft,
  Search,
} from "lucide-react";
import { getWatermarkedImageUrl, removeVietnameseTones } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  originalPrice?: number | null;
  priceText?: string | null;
  images: string;
  material?: string | null;
  dimensions?: string | null;
  description?: string | null;
  createdAt?: Date | string | null;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

import {
  DEFAULT_HIERARCHICAL_CATEGORIES,
  MainCategoryData,
  SubCategoryItem,
} from "@/lib/subcategories-data";

export type { SubCategoryItem, MainCategoryData };
export const HIERARCHICAL_CATEGORIES: MainCategoryData[] = DEFAULT_HIERARCHICAL_CATEGORIES;

const PRODUCT_FAQS = [
  {
    q: "Làm thế nào để chọn được sản phẩm phù hợp với nhu cầu và ngân sách của mình?",
    a: "Quý khách có thể liên hệ trực tiếp hotline/zalo 0836 122 222 - 0846 699 997 để được nghệ nhân tư vấn chi tiết về kích thước, chất liệu (đồng vàng, đồng đỏ, mạ vàng 24k) phù hợp với không gian thờ tự hoặc phong thủy gia chủ và ngân sách dự kiến.",
  },
  {
    q: "Đồ Đồng Lộc Nam có giao hàng tận nơi không?",
    a: "Đồ Đồng Lộc Nam hỗ trợ giao hàng tận nơi trên toàn quốc và quốc tế. Quý khách luôn được quyền kiểm tra sản phẩm trước khi thanh toán, đảm bảo chuẩn mẫu mã, chuẩn phôi đồng và sắc nét từng chi tiết.",
  },
  {
    q: "Tôi muốn gắn thêm tem - mác logo lời chúc trên sản phẩm có được không?",
    a: "Hoàn toàn được. Chúng tôi hỗ trợ thiết kế và khắc laser logo doanh nghiệp, thông điệp tri ân, biển đồng gắn lên đế gỗ hoàn toàn miễn phí theo yêu cầu.",
  },
  {
    q: "Tôi muốn chế tác sản phẩm theo yêu cầu riêng có được không?",
    a: "Đồ Đồng Lộc Nam là xưởng sản xuất trực tiếp tại làng nghề đúc đồng Ý Yên - Nam Định, nhận chế tác theo mọi bản vẽ phác thảo, hình ảnh hoặc kích thước yêu cầu riêng của quý khách.",
  },
  {
    q: "Để chế tác mẫu riêng thì tôi cần cung cấp thông tin gì?",
    a: "Quý khách chỉ cần cung cấp hình ảnh góc chụp rõ nét, kích thước mong muốn, quy cách hoàn thiện (màu mộc, khảm tam khí/ngũ sắc, mạ vàng 24k) và thời gian dự kiến nhận hàng.",
  },
  {
    q: "Sản phẩm quà tặng của Đồ Đồng Lộc Nam có chất lượng đảm bảo không?",
    a: "Mọi sản phẩm đều được đúc từ phôi đồng nguyên chất thanh khiết, bề mặt xử lý chống oxy hóa bền màu vĩnh cửu. Sản phẩm mạ vàng 24k/dát vàng 9999 có kèm chứng thư bảo hành chất lượng.",
  },
  {
    q: "Quy trình tiếp nhận và đúc tượng chân dung theo yêu cầu như thế nào?",
    a: "Quy trình gồm 5 bước bài bản: 1. Tiếp nhận ảnh đa chiều rõ nét -> 2. Nghệ nhân đắp mẫu đất sét truyền thần -> 3. Khách hàng trực tiếp duyệt hoặc chỉnh sửa thần thái -> 4. Đúc phôi đồng nguyên khối -> 5. Sửa nguội, dát vàng hoặc làm màu cổ và bàn giao tận nơi.",
  },
];

interface LeGiaProductListingProps {
  products: Product[];
  categories: Category[];
  currentCategorySlug?: string;
  initialSub?: string;
  initialSearch?: string;
  pageTitle?: string;
}

export function LeGiaProductListing({
  products,
  categories,
  currentCategorySlug,
  initialSub,
  initialSearch,
  pageTitle = "TẤT CẢ SẢN PHẨM",
}: LeGiaProductListingProps) {
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentCategorySlug || "all"
  );
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(
    initialSub || null
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    initialSearch || searchParams?.get("search") || searchParams?.get("q") || ""
  );
  const [searchInput, setSearchInput] = useState<string>(
    initialSearch || searchParams?.get("search") || searchParams?.get("q") || ""
  );

  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [surfaceFilters, setSurfaceFilters] = useState<string[]>([]);
  const [materialFilters, setMaterialFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize state when URL search params change
  useEffect(() => {
    if (currentCategorySlug) {
      setSelectedCategory(currentCategorySlug);
    }
    const q = searchParams?.get("search") || searchParams?.get("q") || "";
    setSearchQuery(q);
    setSearchInput(q);
    const sub = searchParams?.get("sub") || initialSub || "";
    setSelectedSubItem(sub || null);
  }, [searchParams, currentCategorySlug, initialSub]);

  // Live real-time filter as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const [categoriesCatalog, setCategoriesCatalog] = useState<MainCategoryData[]>(HIERARCHICAL_CATEGORIES);

  useEffect(() => {
    fetch("/api/subcategories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCategoriesCatalog(data.data);
        }
      })
      .catch((err) => console.error("Error fetching subcategories:", err));
  }, []);

  // Current category data object
  const currentCategoryData = useMemo(() => {
    if (selectedCategory === "all") return null;
    return (
      categoriesCatalog.find((c) => c.slug === selectedCategory) || null
    );
  }, [selectedCategory, categoriesCatalog]);

  const activeCategoryTitle = useMemo(() => {
    if (currentCategoryData) return currentCategoryData.name;
    const cat = categories.find((c) => c.slug === selectedCategory);
    return cat ? cat.name : pageTitle;
  }, [currentCategoryData, categories, selectedCategory, pageTitle]);

  const categoryBanner = useMemo(() => {
    if (currentCategoryData?.banner) return currentCategoryData.banner;
    switch (selectedCategory) {
      case "trong-dong":
        return "/images/collections/cat_trong_dong.jpg";
      case "do-tho-cung":
        return "/images/collections/cat_do_tho.jpg";
      case "tuong-dong":
        return "/images/collections/cat_tuong_dong.jpg";
      case "tranh-dong":
        return "/images/collections/cat_tranh_dong.jpg";
      case "qua-tang-dong":
        return "/images/collections/cat_qua_tang.jpg";
      default:
        return "/images/collections/cat_trong_dong.jpg";
    }
  }, [currentCategoryData, selectedCategory]);

  const handleSelectSubItem = (catSlug: string, subName: string) => {
    setSelectedCategory(catSlug);
    setSelectedSubItem(subName);
    if (typeof window !== "undefined") {
      const basePath = catSlug !== "all" ? `/san-pham/${catSlug}` : "/san-pham";
      window.history.pushState(
        null,
        "",
        `${basePath}?sub=${encodeURIComponent(subName)}`
      );
    }
  };

  const handleBackToHub = () => {
    setSelectedSubItem(null);
    if (typeof window !== "undefined") {
      const basePath =
        selectedCategory !== "all"
          ? `/san-pham/${selectedCategory}`
          : "/san-pham";
      window.history.pushState(null, "", basePath);
    }
  };

  const toggleSurfaceFilter = (val: string) => {
    setSurfaceFilters((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const toggleMaterialFilter = (val: string) => {
    setMaterialFilters((prev) =>
      prev.includes(val) ? prev.filter((m) => m !== val) : [...prev, val]
    );
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 0. Precision Search Filter & Relevance Ranking
    if (searchQuery && searchQuery.trim()) {
      const rawQ = searchQuery.trim().toLowerCase();
      const cleanQ = removeVietnameseTones(rawQ);
      const qTokens = cleanQ.split(/\s+/).filter(Boolean);

      if (qTokens.length > 0) {
        const scored: { product: Product; score: number }[] = [];

        for (const p of result) {
          const rawN = (p.name || "").toLowerCase();
          const cleanN = removeVietnameseTones(rawN);
          const nWords = cleanN.split(/[\s,./()_+-]+/).filter(Boolean);

          const rawCat = (p.category?.name || "").toLowerCase();
          const cleanCat = removeVietnameseTones(rawCat);
          const catWords = cleanCat.split(/[\s,./()_+-]+/).filter(Boolean);

          const rawMat = (p.material || "").toLowerCase();
          const cleanMat = removeVietnameseTones(rawMat);

          let score = 0;

          // 1. Exact or Phrase Match in Name (Highest Priority)
          if (rawN.includes(rawQ)) {
            score = 1000;
          } else if (cleanN.includes(cleanQ)) {
            score = 900;
          }
          // 2. All search tokens match whole words in Name
          else if (qTokens.every((t) => nWords.includes(t))) {
            score = 800;
          }
          // 3. Multi-word search across Name + Category (at least one token in Name)
          else if (qTokens.length > 1) {
            const allWords = [...nWords, ...catWords];
            if (
              qTokens.every((t) => allWords.includes(t)) &&
              qTokens.some((t) => nWords.includes(t))
            ) {
              score = 700;
            } else if (
              qTokens.every((t) => nWords.some((w) => w.startsWith(t)))
            ) {
              score = 600;
            }
          }
          // 4. Single token match in Name (whole word or word prefix)
          else if (
            qTokens.length === 1 &&
            (nWords.includes(qTokens[0]) || nWords.some((w) => w.startsWith(qTokens[0])))
          ) {
            score = 500;
          }
          // 5. Category or Material match
          else if (cleanCat.includes(cleanQ) || cleanMat.includes(cleanQ)) {
            score = 100;
          }

          if (score > 0) {
            scored.push({ product: p, score });
          }
        }

        // Sort by relevance score desc, then newest
        scored.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          const timeA = a.product.createdAt ? new Date(a.product.createdAt).getTime() : 0;
          const timeB = b.product.createdAt ? new Date(b.product.createdAt).getTime() : 0;
          return timeB - timeA;
        });

        result = scored.map((s) => s.product);
      }
    }

    // 1. Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category.slug === selectedCategory);
    }

    // 2. Filter by subcategory (only if not searching with global search text)
    if (selectedSubItem && !searchQuery.trim()) {
      const q = selectedSubItem.toLowerCase().trim();

      if (q.includes("thất lân")) {
        result = result.filter((p) => p.name.toLowerCase().includes("thất lân"));
      } else if (q.includes("lọ hoa")) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes("lọ hoa") ||
            p.name.toLowerCase().includes("bình hoa")
        );
      } else if (q.includes("tam sự") || q.includes("ngũ sự")) {
        result = result.filter(
          (p) =>
            (p.name.toLowerCase().includes("tam sự") ||
            p.name.toLowerCase().includes("ngũ sự") ||
            p.name.toLowerCase().includes("đỉnh")) &&
            !p.name.toLowerCase().includes("thất lân") &&
            !p.name.toLowerCase().includes("đỉnh cao")
        );
      } else if (q.includes("đỉnh")) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes("đỉnh") &&
            !p.name.toLowerCase().includes("đỉnh cao") &&
            !p.name.toLowerCase().includes("thất lân")
        );
      } else if (q.includes("hạc")) {
        result = result.filter((p) => p.name.toLowerCase().includes("hạc"));
      } else if (q.includes("chân nến")) {
        result = result.filter((p) => p.name.toLowerCase().includes("chân nến"));
      } else if (q.includes("đèn thờ")) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes("đèn thờ") ||
            p.name.toLowerCase().includes("chân nến")
        );
      } else if (q.includes("bát hương")) {
        result = result.filter((p) => p.name.toLowerCase().includes("bát hương"));
      } else if (q.includes("ống hương")) {
        result = result.filter((p) => p.name.toLowerCase().includes("ống hương"));
      } else if (q.includes("mâm bồng")) {
        result = result.filter((p) => p.name.toLowerCase().includes("mâm bồng"));
      } else if (q.includes("đài nước") || q.includes("ngai chén")) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes("đài nước") ||
            p.name.toLowerCase().includes("ngai chén") ||
            p.name.toLowerCase().includes("ấm nước")
        );
      } else if (q.includes("chuông")) {
        result = result.filter((p) => p.name.toLowerCase().includes("chuông"));
      } else if (q.includes("hoành phi") || q.includes("câu đối") || q.includes("đại tự")) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes("hoành phi") ||
            p.name.toLowerCase().includes("câu đối") ||
            p.name.toLowerCase().includes("đại tự") ||
            p.name.toLowerCase().includes("cuốn thư")
        );
      } else if (q.includes("chiêng") || q.includes("khánh")) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes("chiêng") ||
            p.name.toLowerCase().includes("khánh")
        );
      } else if (q.includes("lục bình") || q.includes("chóe")) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes("lục bình") ||
            p.name.toLowerCase().includes("chóe")
        );
      } else {
        // Fallback: match by keywords with tone normalization
        const cleanQ = removeVietnameseTones(q);
        result = result.filter((p) => {
          const nameClean = removeVietnameseTones((p.name || "").toLowerCase());
          const descClean = removeVietnameseTones((p.description || "").toLowerCase());
          return nameClean.includes(cleanQ) || descClean.includes(cleanQ);
        });
      }
    }

    // 3. Filter by price range
    if (priceFilter === "under-1m") {
      result = result.filter((p) => p.price !== null && p.price < 1000000);
    } else if (priceFilter === "1m-3m") {
      result = result.filter(
        (p) => p.price !== null && p.price >= 1000000 && p.price < 3000000
      );
    } else if (priceFilter === "3m-5m") {
      result = result.filter(
        (p) => p.price !== null && p.price >= 3000000 && p.price < 5000000
      );
    } else if (priceFilter === "5m-10m") {
      result = result.filter(
        (p) => p.price !== null && p.price >= 5000000 && p.price < 10000000
      );
    } else if (priceFilter === "10m-20m") {
      result = result.filter(
        (p) => p.price !== null && p.price >= 10000000 && p.price < 20000000
      );
    } else if (priceFilter === "above-20m") {
      result = result.filter((p) => p.price !== null && p.price >= 20000000);
    }

    // 4. Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, selectedSubItem, searchQuery, priceFilter, sortBy]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    if (typeof window !== "undefined") {
      const basePath =
        selectedCategory !== "all"
          ? `/san-pham/${selectedCategory}`
          : "/san-pham";
      window.history.pushState(null, "", basePath);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchInput.trim();
    setSearchQuery(term);
    if (typeof window !== "undefined") {
      const basePath =
        selectedCategory !== "all"
          ? `/san-pham/${selectedCategory}`
          : "/san-pham";
      if (term) {
        window.history.pushState(
          null,
          "",
          `${basePath}?search=${encodeURIComponent(term)}`
        );
      } else {
        window.history.pushState(null, "", basePath);
      }
    }
  };

  // Determine which subcategories list to display
  const activeSubCategoriesList = useMemo(() => {
    if (currentCategoryData) {
      return currentCategoryData.subCategories;
    }
    // Default fallback to first category if in all or unknown
    return categoriesCatalog[0]?.subCategories || [];
  }, [currentCategoryData, categoriesCatalog]);

  // If user is in a category and has NOT selected a subcategory and NO search query -> RENDER HUB GRID (Image 3)
  const isHubView = selectedCategory !== "all" && !selectedSubItem && !searchQuery.trim();

  return (
    <div className="w-full bg-[#070e17] text-white min-h-screen">
      {/* ========================================================================= */}
      {/* TOP FULL-WIDTH CATEGORY BANNER (BANNER TO ĐẦU TRANG DANH MỤC)             */}
      {/* Chỉ hiển thị ở trang danh mục chính; khi bấm Xem tất cả / thẻ con thì ẩn */}
      {/* ========================================================================= */}
      {categoryBanner && selectedCategory !== "all" && isHubView && (
        <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#050a12] via-[#0b1624] to-[#050a12] border-b-2 border-[#ffd700]/30 shadow-2xl h-[calc(100vh-72px)] min-h-[500px] max-h-[1080px] flex flex-col items-center justify-center select-none">
          <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-6">
            <img
              src={categoryBanner}
              alt={activeCategoryTitle}
              className="w-full h-full object-contain object-center relative z-10 transition-transform duration-700 hover:scale-[1.01]"
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
          </div>

          {/* Bouncing Scroll Down Cue */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[#ffd700] animate-bounce pointer-events-none">
            <span className="text-[10px] sm:text-xs font-serif uppercase tracking-widest font-bold text-[#ffd700] drop-shadow-md">
              Cuộn xem sản phẩm
            </span>
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffd700]" />
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* ========================================================================= */}
        {/* BREADCRUMB                                                                */}
        {/* ========================================================================= */}
        <nav className="mb-4 sm:mb-6 text-[11px] sm:text-xs text-[#94a3b8] flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#ffd700] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          {selectedCategory !== "all" ? (
            <button
              onClick={handleBackToHub}
              className={`hover:text-[#ffd700] transition-colors ${
                !selectedSubItem && !searchQuery ? "text-[#ffd700] font-bold" : ""
              }`}
            >
              {activeCategoryTitle}
            </button>
          ) : (
            <Link
              href="/san-pham"
              onClick={handleClearSearch}
              className={`hover:text-[#ffd700] transition-colors ${
                !selectedSubItem && !searchQuery ? "text-[#ffd700] font-bold" : ""
              }`}
            >
              Tất cả sản phẩm
            </Link>
          )}
          {selectedSubItem && (
            <>
              <span>/</span>
              <span className={`text-[#ffd700] ${!searchQuery ? "font-bold" : ""}`}>
                {selectedSubItem}
              </span>
            </>
          )}
          {searchQuery.trim() && (
            <>
              <span>/</span>
              <span className="text-[#ffd700] font-bold">
                Tìm kiếm: &quot;{searchQuery}&quot;
              </span>
            </>
          )}
        </nav>

        {/* ========================================================================= */}
        {/* VIEW 1: CATEGORY HUB CARDS (IMAGE 3)                                      */}
        {/* When user clicks a main category and hasn't picked a subcategory yet       */}
        {/* ========================================================================= */}
        {isHubView ? (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Center Gold Category Title */}
            <div className="text-center">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#ffd700] tracking-wide uppercase">
                {activeCategoryTitle}
              </h1>
              <div className="w-16 h-0.5 bg-[#ffd700] mx-auto mt-2.5 rounded-full" />
              <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl mx-auto mt-2 leading-relaxed">
                Tuyển chọn các dòng sản phẩm thủ công đúc đồng mỹ nghệ cao cấp Lộc Nam - Ý Yên Nam Định
              </p>
            </div>

            {/* 3-Column Grid of Subcategory Cards (Image 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {activeSubCategoriesList.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => {
                    if (selectedCategory !== "all") {
                      window.location.href = `/san-pham/${selectedCategory}/${sub.id}`;
                    } else {
                      handleSelectSubItem(selectedCategory, sub.name);
                    }
                  }}
                  className="group bg-[#0c1825] border border-[#1e344d] hover:border-[#ffd700] rounded-xl overflow-hidden shadow-lg hover:shadow-[0_10px_35px_rgba(255,215,0,0.2)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Card Upper Image on Dark Gradient Background */}
                  <div className="aspect-[4/3] bg-[#050c14] relative p-4 flex items-center justify-center overflow-hidden border-b border-[#1c2e42]/60">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Lower Footer: White Container with Uppercase Title & Yellow Pill Button */}
                  <div className="bg-white p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-3">
                    <h3 className="font-serif text-xs sm:text-sm font-extrabold text-[#0c1825] uppercase tracking-wider line-clamp-1">
                      {sub.name}
                    </h3>

                    {/* Golden Pill Button: "XEM TẤT CẢ" */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedCategory !== "all") {
                          window.location.href = `/san-pham/${selectedCategory}/${sub.id}`;
                        } else {
                          handleSelectSubItem(selectedCategory, sub.name);
                        }
                      }}
                      className="bg-[#f0ad1b] hover:bg-[#df9c10] text-[#000000] font-black text-[11px] sm:text-xs px-6 py-2 rounded-full uppercase tracking-wider shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>XEM TẤT CẢ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: PRODUCT LISTING WITH DARK SIDEBAR (IMAGE 4)                       */
          /* When user selects "XEM TẤT CẢ" of a subcategory or navigates with ?sub=  */
          /* ========================================================================= */
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Center Gold Subcategory Title */}
            <div className="text-center mb-6">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#ffd700] tracking-wide uppercase">
                {searchQuery.trim()
                  ? `KẾT QUẢ TÌM KIẾM: "${searchQuery}"`
                  : selectedSubItem
                  ? selectedSubItem.toUpperCase()
                  : activeCategoryTitle.toUpperCase()}
              </h1>
              <div className="w-16 h-0.5 bg-[#ffd700] mx-auto mt-2 rounded-full" />
              {searchQuery.trim() && (
                <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl mx-auto mt-2 leading-relaxed">
                  Tìm thấy <span className="text-[#ffd700] font-bold">{filteredProducts.length}</span> sản phẩm phù hợp
                </p>
              )}
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden flex items-center justify-between gap-3 bg-[#0c1825] p-3 rounded-xl border border-[#1e344d]">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-2 bg-[#dfb755] text-black font-bold px-3.5 py-2 rounded-lg text-xs active:scale-95 transition-transform"
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

            {/* Main 12-Column Grid: Sidebar Left (3 cols) + Product Grid Right (9 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* ========================================================= */}
              {/* DESKTOP DARK SIDEBAR (IMAGE 4)                            */}
              {/* ========================================================= */}
              <aside className="hidden lg:block lg:col-span-3 bg-[#0a1420] border border-[#1e344d] rounded-2xl p-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto space-y-6 custom-scrollbar">
                {/* Back to Hub Button */}
                {selectedCategory !== "all" && (
                  <button
                    onClick={handleBackToHub}
                    className="flex items-center gap-2 text-xs text-[#dfb755] hover:text-white font-semibold pb-3 border-b border-[#1e344d] w-full transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span className="truncate">Trở về danh mục {activeCategoryTitle}</span>
                  </button>
                )}

                {/* 1. DANH MỤC SECTION */}
                <div>
                  <h3 className="font-serif text-xs sm:text-sm font-extrabold text-[#ffd700] uppercase tracking-wider pb-2 border-b border-[#ffd700]/30 mb-3">
                    DANH MỤC {activeCategoryTitle ? activeCategoryTitle.toUpperCase() : "SẢN PHẨM"}
                  </h3>
                  <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                    {activeSubCategoriesList.map((sub) => {
                      const isActive = selectedSubItem === sub.name;
                      return (
                        <div
                          key={sub.id}
                          onClick={() =>
                            handleSelectSubItem(selectedCategory, sub.name)
                          }
                          className={`text-xs py-1.5 px-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between group select-none ${
                            isActive
                              ? "bg-gradient-to-r from-[#ffd700]/15 to-[#ffd700]/5 text-[#ffd700] font-bold border-l-2 border-[#ffd700]"
                              : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-white/[0.04] font-medium"
                          }`}
                        >
                          <span className="truncate">{sub.name}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700] shrink-0 ml-1.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. KHOẢNG GIÁ SECTION */}
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
              {/* RIGHT CONTENT AREA: 4-COLUMN PRODUCTS GRID (IMAGE 4)      */}
              {/* ========================================================= */}
              <main className="lg:col-span-9 space-y-6">
                {/* Search Active Banner */}
                {searchQuery.trim() && (
                  <div className="bg-[#0c1825] border border-[#ffd700]/40 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#ffd700]/10 text-[#ffd700] flex items-center justify-center border border-[#ffd700]/30 shrink-0">
                        <Search className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-[#94a3b8]">Đang hiển thị kết quả cho từ khóa:</div>
                        <div className="text-sm font-bold text-[#ffd700] font-serif">
                          &quot;{searchQuery}&quot;
                          <span className="text-xs text-[#94a3b8] font-sans font-normal ml-2">
                            ({filteredProducts.length} sản phẩm)
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleClearSearch}
                      className="flex items-center gap-1.5 text-xs text-[#cbd5e1] hover:text-white bg-[#142335] hover:bg-[#1a2f48] border border-[#223952] px-3 py-1.5 rounded-lg transition-all"
                    >
                      <X className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>Xóa tìm kiếm</span>
                    </button>
                  </div>
                )}

                {/* Top Status & Sort Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#1c2e42]">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xs sm:text-sm font-extrabold text-[#ffd700] uppercase tracking-wider">
                      {filteredProducts.length} SẢN PHẨM
                    </span>
                    {searchQuery.trim() && (
                      <span className="text-[11px] text-[#94a3b8] bg-[#122234] px-2 py-0.5 rounded border border-[#ffd700]/20 hidden md:inline-block">
                        Từ khóa: &quot;{searchQuery}&quot;
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    {/* Inline instant search input */}
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64 sm:flex-initial">
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => {
                          setSearchInput(e.target.value);
                          if (!e.target.value.trim()) {
                            handleClearSearch();
                          }
                        }}
                        placeholder="Tìm sản phẩm..."
                        className="w-full pl-3 pr-8 py-1.5 bg-[#0c1825] border border-[#1e344d] focus:border-[#ffd700] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                      />
                      {searchInput ? (
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          title="Xóa tìm kiếm"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ffd700]"
                          title="Tìm kiếm"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </form>

                    <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] shrink-0">
                      <span className="hidden xl:inline">Sắp xếp:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-[#0c1825] border border-[#1e344d] text-white text-xs px-2.5 sm:px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#ffd700]"
                      >
                        <option value="newest">{searchQuery ? "Độ liên quan cao nhất" : "Mới nhất"}</option>
                        <option value="price-asc">Giá: Thấp đến Cao</option>
                        <option value="price-desc">Giá: Cao đến Thấp</option>
                        <option value="name-asc">Tên A-Z</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4-Column Product Cards Grid (Image 4) */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {filteredProducts.map((product) => (
                      <ListingProductCard
                        key={product.id}
                        product={product}
                        isWishlisted={wishlist.includes(product.id)}
                        onToggleWishlist={toggleWishlist}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="bg-[#0c1825] rounded-2xl border border-[#1e344d] p-8 sm:p-12 text-center space-y-4 shadow-md">
                    <div className="w-16 h-16 rounded-full bg-[#122234] text-[#ffd700] flex items-center justify-center mx-auto border border-[#ffd700]/30">
                      {searchQuery.trim() ? (
                        <Search className="w-8 h-8 text-[#ffd700]" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-[#ffd700]" />
                      )}
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#ffd700]">
                      {searchQuery.trim()
                        ? `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchQuery}"`
                        : "Không tìm thấy sản phẩm nào phù hợp với bộ lọc."}
                    </h3>
                    <p className="text-xs text-[#94a3b8] max-w-md mx-auto leading-relaxed">
                      {searchQuery.trim()
                        ? "Quý khách vui lòng thử tìm với từ khóa khác (ví dụ: thuyền buồm, trống đồng, tranh sen, đỉnh đồng, chuông đồng...) hoặc bấm nút bên dưới để xem toàn bộ sản phẩm."
                        : "Vui lòng chọn mức giá khác hoặc bấm 'Xóa bộ lọc' để xem tất cả sản phẩm đúc đồng thủ công Lộc Nam."}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          handleClearSearch();
                          setPriceFilter("all");
                          setSurfaceFilters([]);
                          setMaterialFilters([]);
                        }}
                        className="bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0b1622] font-bold text-xs px-5 py-2.5 rounded-lg shadow-md hover:brightness-110 transition-all active:scale-95"
                      >
                        {searchQuery.trim() ? "Xem tất cả sản phẩm" : "Xóa bộ lọc"}
                      </button>
                      <a
                        href="tel:0836122222"
                        className="bg-[#122234] border border-[#ffd700]/40 text-[#ffd700] font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#1c3550] transition-all"
                      >
                        Hotline: 0836 122 222
                      </a>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* ACCORDION FAQ (IMAGE 4)                                   */}
                {/* ========================================================= */}
                <div className="mt-12 pt-8 border-t border-[#1c2e42] space-y-3">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#ffd700] mb-4">
                    CÂU HỎI THƯỜNG GẶP VỀ SẢN PHẨM ĐỒ ĐỒNG
                  </h3>

                  {PRODUCT_FAQS.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={index}
                        className="bg-[#0c1825] border border-[#1e344d] rounded-xl overflow-hidden transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenFaqIndex(isOpen ? null : index)
                          }
                          className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between text-xs sm:text-[13px] font-bold text-[#fce9b5] hover:text-[#ffd700] transition-colors"
                        >
                          <span className="pr-4">{faq.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#dfb755] flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-[#cbd5e1] leading-relaxed border-t border-[#1e344d]/40 animate-in fade-in">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </main>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MOBILE FILTER DRAWER                                      */}
      {/* ========================================================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs h-full bg-[#08121e] text-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 border-l border-[#1e344d]">
            {/* Header */}
            <div className="p-4 border-b border-[#1e344d] flex items-center justify-between bg-[#0c1825]">
              <span className="font-serif text-sm font-bold text-[#ffd700]">
                DANH MỤC & BỘ LỌC
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Back to Hub on Mobile */}
              {selectedCategory !== "all" && (
                <button
                  onClick={() => {
                    handleBackToHub();
                    setMobileFilterOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-xs text-[#dfb755] font-bold w-full pb-2 border-b border-[#1e344d]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>‹ Trở về danh mục {activeCategoryTitle}</span>
                </button>
              )}

              {/* Subcategories list */}
              <div>
                <h4 className="font-serif text-xs font-bold text-[#ffd700] uppercase tracking-wider mb-2">
                  Danh Mục Con
                </h4>
                <div className="space-y-1">
                  {activeSubCategoriesList.map((sub) => {
                    const isActive = selectedSubItem === sub.name;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          handleSelectSubItem(selectedCategory, sub.name);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                          isActive
                            ? "bg-[#ffd700]/15 text-[#ffd700] font-bold border-l-2 border-[#ffd700]"
                            : "text-[#cbd5e1] hover:bg-[#0c1825]"
                        }`}
                      >
                        <span className="truncate">{sub.name}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700] shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price filter */}
              <div>
                <h4 className="font-serif text-xs font-bold text-[#ffd700] uppercase tracking-wider mb-2">
                  Khoảng Giá
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
                  ].map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setPriceFilter(range.id);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-lg text-xs font-semibold text-left flex items-center justify-between border ${
                        priceFilter === range.id
                          ? "bg-[#122234] text-[#ffd700] border-[#ffd700]/50"
                          : "bg-[#0c1825] text-[#cbd5e1] border-[#1e344d]"
                      }`}
                    >
                      <span>{range.label}</span>
                      {priceFilter === range.id && (
                        <Check className="w-3.5 h-3.5 text-[#ffd700]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Apply CTA */}
            <div className="p-4 border-t border-[#1e344d] flex items-center gap-3 bg-[#0c1825]">
              <button
                onClick={() => {
                  setPriceFilter("all");
                  setSurfaceFilters([]);
                  setMaterialFilters([]);
                }}
                className="w-1/3 py-2.5 rounded-lg border border-[#1e344d] text-xs font-bold text-[#cbd5e1] hover:bg-[#122234]"
              >
                Đặt Lại
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-2.5 rounded-lg bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0b1622] text-xs font-black shadow-md"
              >
                Xem {filteredProducts.length} SP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Interactive Dark Luxury Product Card with Multi-Angle Photo Switcher
// Exact styling matching user reference (Image 4 & media_1788517072728.png)
// -------------------------------------------------------------
function ListingProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}) {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images);
    if (!Array.isArray(imageList)) imageList = [product.images];
  } catch {
    imageList = product.images ? [product.images] : [];
  }
  if (imageList.length === 0) imageList = ["/images/locnam_real/locnam_bo_do_tho.jpg"];

  const hasMultiple = imageList.length > 1;
  const dotCount = hasMultiple ? Math.min(imageList.length, 5) : 4;
  const angleColors = ["#f3eee4", "#e8cf8d", "#c59239", "#784421", "#3d2314"];
  const angleLabels = [
    "Ảnh chính diện",
    "Góc nghiêng 45°",
    "Cận cảnh hoa văn",
    "Mặt sau & Chân đế",
    "Chi tiết tổng thể",
  ];

  const currentImage = hasMultiple
    ? imageList[activeAngleIndex % imageList.length]
    : imageList[0];

  return (
    <div className="group bg-[#0c1825] rounded-xl border border-[#1e344d] hover:border-[#ffd700] p-3 flex flex-col justify-between shadow-md hover:shadow-[0_8px_25px_rgba(255,215,0,0.2)] hover:-translate-y-1 transition-all duration-300">
      <div>
        {/* Product Image Window */}
        <div className="relative aspect-square overflow-hidden bg-[#050c14] rounded-lg border border-[#1c2e42] p-2 flex items-center justify-center group/img">
          <Link
            href={`/san-pham/${product.category.slug}/${product.slug}`}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={getWatermarkedImageUrl(currentImage)}
              alt={product.name}
              className="w-full h-full object-contain group-hover/img:scale-105 transition-all duration-300"
              loading="lazy"
              decoding="async"
            />
          </Link>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => onToggleWishlist(product.id, e)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-[#1e344d] flex items-center justify-center text-gray-400 hover:text-red-500 transition-all z-10"
            aria-label="Yêu thích"
          >
            <Heart
              className={`w-3 h-3 ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        </div>

        {/* Multi-angle switcher dots */}
        <div className="flex items-center gap-1.5 pt-2 pb-1 px-0.5">
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
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 relative border ${
                  isActive
                    ? "ring-1 ring-[#ffd700] ring-offset-1 scale-110 border-white"
                    : "border-black/30 opacity-70 hover:opacity-100"
                }`}
                style={{ backgroundColor: angleColors[i % angleColors.length] }}
                title={angleLabels[i] || `Góc chụp ${i + 1}`}
                aria-label={`Xem ${angleLabels[i] || `góc chụp ${i + 1}`}`}
              />
            );
          })}
        </div>

        {/* Product Info */}
        <div className="pt-1.5 pb-1 space-y-1">
          <Link
            href={`/san-pham/${product.category.slug}/${product.slug}`}
            className="block"
          >
            <h4 className="font-serif text-xs font-bold text-[#e2e8f0] group-hover:text-[#ffd700] line-clamp-2 transition-colors leading-snug min-h-[32px]">
              {product.name}
            </h4>
          </Link>

          {/* Price Box */}
          <div className="pt-1 flex items-baseline">
            {product.price && product.price > 0 ? (
              <span className="font-serif text-xs sm:text-[13px] font-extrabold text-[#ffd700]">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            ) : (
              <span className="text-[11px] font-bold text-[#ffd700]">
                Liên hệ nhận giá tốt
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
