"use client";
import { DEFAULT_HIERARCHICAL_CATEGORIES, MainCategoryData } from "@/lib/subcategories-data";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Phone,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  MapPin,
  ExternalLink,
  MessageCircle,
  User,
} from "lucide-react";
import { formatPrice, getWatermarkedImageUrl } from "@/lib/utils";
import { getClientSettings, getClientCatalog } from "@/lib/client-cache";

export function ModernHeader() {
  const [catalog, setCatalog] = useState<MainCategoryData[]>(DEFAULT_HIERARCHICAL_CATEGORIES);
  useEffect(() => { getClientCatalog().then(data => { if (Array.isArray(data) && data.length) setCatalog(data); }); }, []);
  const pathname = usePathname();
  const router = useRouter();

  // Instant Prefetch on Mount for Zero-Latency Navigation
  useEffect(() => {
    const popularRoutes = [
      "/san-pham/do-tho-cung",
      "/san-pham/tuong-dong",
      "/san-pham/tranh-dong",
      "/san-pham/trong-dong",
      "/san-pham",
      "/qua-tang",
      "/du-an",
      "/tin-tuc",
      "/gioi-thieu",
    ];
    popularRoutes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch {}
    });
  }, [router]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [liveResults, setLiveResults] = useState<
    {
      id: string;
      name: string;
      slug: string;
      price: number | null;
      image: string;
      categorySlug: string;
    }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [liveSearchVisible, setLiveSearchVisible] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveResults([]);
      setIsSearching(false);
      setLiveSearchVisible(false);
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    const abortController = new AbortController();

    searchDebounceRef.current = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`, {
        signal: abortController.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.products)) {
            setLiveResults(data.products);
            setLiveSearchVisible(true);
          } else {
            setLiveResults([]);
          }
        })
        .catch((err) => {
          if (err?.name !== "AbortError") {
            setLiveResults([]);
          }
        })
        .finally(() => setIsSearching(false));
    }, 180);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      abortController.abort();
    };
  }, [searchQuery]);

  const [hotlineData, setHotlineData] = useState({
    hotline1: "0836 122 222",
    hotline2: "0846 699 997",
    cleanPhone1: "0836122222",
    cleanPhone2: "0846699997",
    zalo: "0846699997",
  });

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("cart");
        if (stored) {
          const items = JSON.parse(stored);
          const total = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  useEffect(() => {
    getClientSettings().then((settings) => {
      if (settings && Object.keys(settings).length) {
        const h1 = settings.hotline1 || settings.hotline || "0836 122 222";
        const h2 = settings.hotline2 || "0846 699 997";
        setHotlineData({
          hotline1: h1,
          hotline2: h2,
          cleanPhone1: h1.replace(/\D/g, "") || "0836122222",
          cleanPhone2: h2.replace(/\D/g, "") || "0846699997",
          zalo: (settings.zalo || h2 || "0846699997").replace(/\D/g, ""),
        });
      }
    }).catch(() => {});
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordion((prev) => (prev === key ? null : key));
  };

  // =========================================================================
  // INTERACTIVE DEMO PREVIEW STATES (ẢNH CHUẨN TỪ BELUX & DODONGLOCNAM)
  // =========================================================================
  const defaultProductPreview = {
    title: "Bộ Đồ Thờ Đầy Đủ Bằng Đồng Vàng Đúc Thủ Công Lộc Nam",
    desc: "Đỉnh đồng, đôi hạc ngự long quy, chân nến đúc thủ công Ý Yên Nam Định nguyên khối.",
    image: "/images/locnam_real/locnam_bo_do_tho.jpg",
    href: "/san-pham/do-tho-cung",
    tag: "Đồ Thờ Lộc Nam",
  };

  const [productPreview, setProductPreview] = useState(defaultProductPreview);

  const defaultGiftPreview = {
    title: "Mô Hình Thuyền Buồm Mạ Vàng 24K Lộc Nam",
    desc: "Quà tặng ngoại giao, khai trương & đại hội mạ vàng điện phân 24k trường tồn đẳng cấp.",
    image: "/images/locnam_real/locnam_thuyen_buom.jpg",
    href: "/san-pham/qua-tang-dong",
    tag: "Quà Tặng Đối Tác",
  };

  const [giftPreview, setGiftPreview] = useState(defaultGiftPreview);

  // =========================================================================
  // TAXONOMY CHUẨN XÁC 100% THEO YÊU CẦU
  // ẢNH QUÀ TẶNG: BELUX (ĐÃ XÓA WATERMARK) | ẢNH ĐỒ ĐỒNG, CHIÊNG: DODONGLOCNAM
  // =========================================================================

  const [hoveredProductCategory, setHoveredProductCategory] = useState("do-tho-cung");
  const [hoveredGiftCategory, setHoveredGiftCategory] = useState("qua-tang-doanh-nghiep");
  const [hoveredProductSubItem, setHoveredProductSubItem] = useState<{
    image: string;
    previewTitle: string;
    previewDesc: string;
    href: string;
    tag?: string;
  } | null>(null);
  const [hoveredGiftSubItem, setHoveredGiftSubItem] = useState<{
    image: string;
    previewTitle: string;
    previewDesc: string;
    href: string;
    tag?: string;
  } | null>(null);

  const productNavigationCategories = catalog.filter(cat => cat.slug !== "qua-tang" && !cat.aliases?.includes("qua-tang-dong")).map(cat => ({
 id: cat.slug, title: cat.name.toUpperCase(), href: `/san-pham/${cat.slug}`, image: cat.banner || "/images/hero_golden_ship.jpg",
 previewTitle: cat.name, previewDesc: cat.description || "",
 subItems: cat.subCategories.map(sub => ({ label: sub.name.toUpperCase(), href: `/san-pham/${cat.slug}/${sub.id}`,
   query: sub.name, image: sub.image, previewTitle: sub.name, previewDesc: sub.keyword })),
}));

  // Sheet SẢN PHẨM: 1. Đồ thờ cúng, 2. Tượng đồng, 3. Tranh đồng, 4. Trống đồng
  const productMegaMenu = productNavigationCategories;

  // Sheet QUÀ TẶNG: 1. Quà tặng doanh nghiệp, 2. Quà tặng sự kiện, 3. Quà tặng phong thủy, 4. Quà tặng lưu niệm
  const giftMegaMenu = (catalog.find(cat => cat.slug === "qua-tang" || cat.aliases?.includes("qua-tang-dong"))?.subCategories || []).map(sub => ({
 id: sub.id, title: sub.name.toUpperCase(), href: `/qua-tang/${sub.id}`, desc: sub.keyword,
 defaultDemo: { title: sub.name, desc: sub.keyword, image: sub.image, href: `/qua-tang/${sub.id}`, tag: sub.name },
 items: (sub.children || []).map(child => ({ label: child.name, href: `/qua-tang/${sub.id}/${child.id}`,
   demoTitle: child.name, demoDesc: child.keyword, demoImage: child.image })),
}));

  // Sheet 1: VỀ CHÚNG TÔI
  const aboutMenuItems = [
    {
      title: "1. Giới thiệu công ty & nghệ nhân",
      href: "/gioi-thieu",
      desc: "Lịch sử xưởng đúc đồng Lộc Nam & nghệ nhân đúc đồng bàn tay vàng",
    },
    {
      title: "2. Dịch vụ phục vụ chăm sóc khách hàng",
      href: "/gioi-thieu#dich-vu",
      desc: "Chính sách bảo hành trọn đời, đúc theo yêu cầu & giao hàng toàn quốc",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const navBoxBaseClass =
    "group relative inline-flex items-center gap-1 2xl:gap-1.5 px-2 xl:px-2.5 2xl:px-4 py-2 rounded-xl text-[11px] xl:text-xs 2xl:text-[13px] font-extrabold tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0 select-none";

  const getNavBoxClass = (path: string) => {
    const active = isActive(path);
    if (active) {
      return `${navBoxBaseClass} bg-[#dfb755]/20 text-[#ffd700] border-2 border-[#dfb755] shadow-[0_0_15px_rgba(223,183,85,0.45)]`;
    }
    return `${navBoxBaseClass} text-[#e2e8f0] bg-[#122234]/80 border border-[#1c2c3d] hover:border-[#dfb755] hover:bg-gradient-to-r hover:from-[#dfb755]/25 hover:to-[#b8860b]/20 hover:text-[#ffd700] hover:shadow-[0_0_16px_rgba(223,183,85,0.4)] hover:-translate-y-0.5 active:translate-y-0`;
  };

  return (
    <>
      <header className="w-full bg-[#070e17] border-b border-[#1c2c3d] sticky top-0 z-50 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        {/* ============================================================ */}
        {/* 1. MOBILE HEADER BAR (lg:hidden) - For mobile phones & tablets */}
        {/* ============================================================ */}
        <div className="lg:hidden flex items-center justify-between gap-3 px-3.5 sm:px-5 py-3.5 sm:py-4 bg-[#070e17] border-b border-[#1c2c3d] shadow-md">
          {/* Round Circle Logo (Bigger & Clearer) */}
          <Link href="/" className="shrink-0 flex items-center group" aria-label="Trang chủ Đồ Đồng Lộc Nam">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#122234] border-2 border-[#dfb755] p-1 flex items-center justify-center shadow-md overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/images/logo.png"
                alt="Đồ Đồng Lộc Nam"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Center Search Pill Input (Taller & Roomier) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            className="flex-1 relative"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim() && liveResults.length > 0) {
                    setLiveSearchVisible(true);
                  }
                }}
                placeholder="Bạn muốn tìm gì?"
                className="w-full pl-4 sm:pl-5 pr-12 py-2.5 sm:py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#dfb755] shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 text-gray-600 hover:text-[#b8860b] flex items-center justify-center transition-colors rounded-full"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Live Autocomplete Dropdown */}
            {liveSearchVisible && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1825] border border-[#ffd700]/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 max-h-[360px] overflow-y-auto custom-scrollbar">
                {isSearching ? (
                  <div className="p-3 text-center text-xs text-[#94a3b8] flex items-center justify-center gap-2">
                    <span className="animate-spin text-[#ffd700]">◷</span> Đang tìm kiếm sản phẩm...
                  </div>
                ) : liveResults.length > 0 ? (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-[#ffd700] uppercase tracking-wider border-b border-[#1e344d]">
                      Gợi ý ({liveResults.length})
                    </div>
                    {liveResults.map((item) => (
                      <Link
                        key={item.id}
                        href={item.categorySlug === "qua-tang" || item.categorySlug === "qua-tang-dong" ? `/qua-tang/${item.slug}` : `/san-pham/${item.slug}`}
                        onClick={() => setLiveSearchVisible(false)}
                        className="flex items-center gap-2.5 p-2 hover:bg-[#122234] rounded-xl transition-colors group"
                      >
                        <div className="w-11 h-11 rounded-lg bg-[#050c14] border border-[#1e344d] overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                          <img
                            src={getWatermarkedImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-bold text-white group-hover:text-[#ffd700] truncate transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-[#ffd700] font-semibold mt-0.5">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setLiveSearchVisible(false);
                        router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="w-full mt-1 py-2 text-center text-xs text-[#dfb755] hover:text-white font-bold bg-[#142335] hover:bg-[#1c3550] rounded-lg transition-colors"
                    >
                      Xem tất cả kết quả cho &quot;{searchQuery}&quot; →
                    </button>
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-[#94a3b8]">
                    Không tìm thấy sản phẩm phù hợp. Nhấn Enter để tìm đầy đủ.
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Right Hamburger Menu Icon (Bigger & Clearer) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="shrink-0 w-12 h-12 flex items-center justify-center text-white hover:text-[#ffd700] active:scale-95 transition-all"
            aria-label="Mở menu điều hướng"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 sm:w-8 sm:h-8 text-[#ffd700]" />
            ) : (
              <Menu className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.4]" />
            )}
          </button>
        </div>

        {/* ============================================================ */}
        {/* 2. DESKTOP NAVIGATION BAR (hidden lg:flex)                  */}
        {/* ============================================================ */}
        <div className="hidden lg:flex max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-3 2xl:px-6 py-2.5 sm:py-3 items-center justify-between gap-2 2xl:gap-5 relative">
          {/* Logo LỘC NAM */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 p-1 rounded-lg bg-[#122234] border border-[#c59b4e]/40 flex items-center justify-center group-hover:border-[#ffd700] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] group-hover:scale-105 transition-all duration-300 flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Đồ Đồng Lộc Nam"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="font-serif text-base sm:text-lg 2xl:text-xl font-black tracking-widest bg-gradient-to-r from-[#fce9b5] via-[#ffd700] to-[#dfb755] bg-clip-text text-transparent group-hover:brightness-125 transition-all">
                  LỘC NAM
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#dfb755]/20 text-[#ffd700] font-bold border border-[#dfb755]/40 hidden xs:inline-block">
                  Ý YÊN
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-[#cbd5e1] font-medium tracking-wide hidden xl:inline-block">
                Quà tặng tinh hoa - Nâng tầm giá trị
              </span>
            </div>
          </Link>

          {/* ============================================================ */}
          {/* DESKTOP NAVIGATION BAR (EXACT 6 ITEMS FROM EXCEL FILE)        */}
          {/* ============================================================ */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-3 flex-nowrap">
            {/* 1. TRANG CHỦ */}
            <Link href="/" className={getNavBoxClass("/")}>
              <span>TRANG CHỦ</span>
            </Link>

            {/* ============================================================ */}
            {/* 2. SẢN PHẨM MEGA MENU (1. Đồ thờ cúng, 2. Tượng đồng, 3. Tranh đồng, 4. Trống đồng) */}
            {/* ============================================================ */}
            <div
              className="flex-shrink-0"
              onMouseEnter={() => handleMouseEnter("products")}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/san-pham" className={getNavBoxClass("/san-pham")}>
                <span>SẢN PHẨM</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 text-[#dfb755] group-hover:text-[#ffd700] ${
                    activeDropdown === "products" ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {activeDropdown === "products" && (
                <div className="absolute top-full left-2 right-2 lg:left-3 lg:right-3 max-w-[1240px] 2xl:max-w-[1360px] mx-auto mt-2 bg-[#070e17] border-2 border-[#b8860b] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']">
                  {(() => {
                    const activeGroup =
                      productNavigationCategories.find(
                        (c) => c.id === hoveredProductCategory
                      ) || productNavigationCategories[0];

                    return (
                      <div className="grid grid-cols-12 min-h-[390px] items-stretch">
                        {/* Cột 1: Danh mục chính (Left Column - 3 cols) */}
                        <div className="col-span-3 bg-[#050c14] border-r border-[#1c2e42] p-3 space-y-1">
                          {productNavigationCategories.map((cat) => {
                            const isSelected = hoveredProductCategory === cat.id;
                            return (
                              <Link
                                key={cat.id}
                                href={cat.href}
                                prefetch={true}
                                onMouseEnter={() => {
                                  setHoveredProductCategory(cat.id);
                                  setHoveredProductSubItem(null);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#122234] text-[#ffd700] border-l-4 border-[#ffd700] shadow-sm"
                                    : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-[#0c1825]"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className={`text-[10px] ${isSelected ? "text-[#ffd700] font-bold" : "text-[#64748b]"}`}>›</span>
                                  <span>{cat.title}</span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Cột 2: Danh mục con (Middle Column - 5 cols, hiển thị đầy đủ chữ không bị cắt) */}
                        <div
                          className="col-span-5 p-4 xl:p-5 bg-[#070e17] border-r border-[#1c2e42] flex flex-col justify-start"
                          onMouseLeave={() => setHoveredProductSubItem(null)}
                        >
                          <div className="border-b border-[#1c2e42] pb-2 mb-3 flex items-center justify-between">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ffd700]">
                              {activeGroup.title}
                            </span>
                            <Link
                              href={activeGroup.href}
                              prefetch={true}
                              className="text-[11px] text-[#dfb755] hover:underline font-semibold"
                            >
                              Xem tất cả ›
                            </Link>
                          </div>

                          <div
                            className={`overflow-y-auto max-h-[340px] pr-2 ${
                              activeGroup.subItems.length > 8
                                ? "grid grid-cols-2 gap-x-3.5 gap-y-1.5"
                                : "space-y-1.5"
                            }`}
                          >
                            {activeGroup.subItems.map((sub, i) => {
                              const subTargetHref =
                                (sub as any).href ||
                                `${activeGroup.href}${
                                  activeGroup.href.includes("?") ? "&" : "?"
                                }sub=${encodeURIComponent(sub.query)}`;

                              return (
                                <Link
                                  key={i}
                                  prefetch={true}
                                  href={subTargetHref}
                                  onMouseEnter={() => {
                                    setHoveredProductSubItem({
                                      image: (sub as any).image || activeGroup.image,
                                      previewTitle: (sub as any).previewTitle || sub.label,
                                      previewDesc: (sub as any).previewDesc || activeGroup.previewDesc,
                                      href: subTargetHref,
                                      tag: sub.label,
                                    });
                                  }}
                                  className="text-[11px] xl:text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:translate-x-0.5 transition-all py-1.5 border-b border-[#1c2e42]/35 block uppercase tracking-wide leading-snug break-words"
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Cột 3: Ảnh minh họa lớn & nút hành động (Right Column - 4 cols) */}
                        {(() => {
                          const currentPreview = hoveredProductSubItem || {
                            image: activeGroup.image,
                            previewTitle: activeGroup.previewTitle,
                            previewDesc: activeGroup.previewDesc,
                            href: activeGroup.href,
                            tag: activeGroup.title,
                          };

                          return (
                            <div className="col-span-4 p-4 xl:p-5 bg-[#0a1524] flex flex-col justify-between">
                              <div>
                                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-[#03070d] border border-[#1c2e42] relative shadow-md group flex items-center justify-center">
                                  {/* Lớp nền mờ ambient sang trọng phủ kín khung 16/10 */}
                                  <img
                                    src={currentPreview.image}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none select-none"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1524] via-transparent to-black/20 pointer-events-none" />

                                  {/* Ảnh chính thể hiện trọn vẹn sản phẩm: object-contain đảm bảo KHÔNG mất đầu, KHÔNG mất chân tượng */}
                                  <img
                                    key={currentPreview.image}
                                    src={currentPreview.image}
                                    alt={currentPreview.previewTitle}
                                    className="relative z-10 w-full h-full object-contain p-1.5 animate-fadeIn transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)]"
                                  />
                                  <div className="absolute bottom-2.5 left-3 right-3 z-20 pointer-events-none">
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#dfb755] text-black uppercase tracking-wider shadow">
                                      {currentPreview.tag || activeGroup.title}
                                    </span>
                                  </div>
                                </div>

                                <h4 className="font-serif text-sm font-bold text-[#ffd700] leading-snug line-clamp-2">
                                  {currentPreview.previewTitle}
                                </h4>
                                <p className="text-[11px] text-[#94a3b8] mt-1 leading-relaxed line-clamp-2">
                                  {currentPreview.previewDesc}
                                </p>
                              </div>

                              <Link
                                href={currentPreview.href}
                                prefetch={true}
                                className="mt-3.5 text-center text-xs font-black uppercase text-[#0b1622] bg-gradient-to-r from-[#dfb755] via-[#f5db8b] to-[#b8860b] hover:brightness-110 py-2.5 px-4 rounded-xl transition-all shadow-[0_2px_15px_rgba(223,183,85,0.4)] active:scale-95 block w-full"
                              >
                                {hoveredProductSubItem ? "Xem chi tiết sản phẩm ›" : "Xem tất cả sản phẩm"}
                              </Link>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* 3. QUÀ TẶNG MEGA MENU (QUÀ TẶNG ĐỐI TÁC - NGUỒN ẢNH BELUX)   */}
            {/* ============================================================ */}
            <div
              className="flex-shrink-0"
              onMouseEnter={() => handleMouseEnter("gifts")}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/qua-tang" className={getNavBoxClass("/qua-tang")}>
                <span>QUÀ TẶNG</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 text-[#dfb755] group-hover:text-[#ffd700] ${
                    activeDropdown === "gifts" ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {activeDropdown === "gifts" && (
                <div className="absolute top-full left-2 right-2 lg:left-3 lg:right-3 max-w-[1240px] 2xl:max-w-[1360px] mx-auto mt-2 bg-[#070e17] border-2 border-[#b8860b] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']">
                  {(() => {
                    const activeGift =
                      giftMegaMenu.find((g) => g.id === hoveredGiftCategory) ||
                      giftMegaMenu[0];

                    return (
                      <div className="grid grid-cols-12 min-h-[390px] items-stretch">
                        {/* Cột 1: Nhóm quà tặng chính (Left Column - 3 cols) */}
                        <div className="col-span-3 bg-[#050c14] border-r border-[#1c2e42] p-3 space-y-1">
                          {giftMegaMenu.map((group) => {
                            const isSelected = hoveredGiftCategory === group.id;
                            return (
                              <Link
                                key={group.id}
                                href={group.href}
                                prefetch={true}
                                onMouseEnter={() => {
                                  setHoveredGiftCategory(group.id);
                                  setHoveredGiftSubItem(null);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#122234] text-[#ffd700] border-l-4 border-[#ffd700] shadow-sm"
                                    : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-[#0c1825]"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className={`text-[10px] ${isSelected ? "text-[#ffd700] font-bold" : "text-[#64748b]"}`}>›</span>
                                  <span>{group.title}</span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Cột 2: Danh sách mục con theo nhóm (Middle Column - 5 cols, hiển thị đầy đủ chữ không bị cắt) */}
                        <div
                          className="col-span-5 p-4 xl:p-5 bg-[#070e17] border-r border-[#1c2e42] flex flex-col justify-start"
                          onMouseLeave={() => setHoveredGiftSubItem(null)}
                        >
                          <div className="border-b border-[#1c2e42] pb-2 mb-3 flex items-center justify-between">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ffd700]">
                              {activeGift.title}
                            </span>
                            <Link
                              href={activeGift.href}
                              prefetch={true}
                              className="text-[11px] text-[#dfb755] hover:underline font-semibold"
                            >
                              Xem tất cả ›
                            </Link>
                          </div>

                          <div
                            className={`overflow-y-auto max-h-[340px] pr-2 ${
                              activeGift.items.length > 7
                                ? "grid grid-cols-2 gap-x-3.5 gap-y-1.5"
                                : "space-y-1.5"
                            }`}
                          >
                            {activeGift.items.map((item, i) => (
                              <Link
                                key={i}
                                href={item.href}
                                prefetch={true}
                                onMouseEnter={() => {
                                  setHoveredGiftSubItem({
                                    image: (item as any).demoImage || activeGift.defaultDemo.image,
                                    previewTitle: (item as any).demoTitle || item.label,
                                    previewDesc: (item as any).demoDesc || activeGift.defaultDemo.desc,
                                    href: item.href,
                                    tag: item.label,
                                  });
                                }}
                                className="text-[11px] xl:text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:translate-x-0.5 transition-all py-1.5 border-b border-[#1c2e42]/35 block uppercase tracking-wide leading-snug break-words"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Cột 3: Ảnh minh họa lớn & nút hành động (Right Column - 4 cols) */}
                        {(() => {
                          const currentGiftPreview = hoveredGiftSubItem || {
                            image: activeGift.defaultDemo.image,
                            previewTitle: activeGift.defaultDemo.title,
                            previewDesc: activeGift.defaultDemo.desc,
                            href: activeGift.href,
                            tag: activeGift.title,
                          };

                          return (
                            <div className="col-span-4 p-4 xl:p-5 bg-[#0a1524] flex flex-col justify-between">
                              <div>
                                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-[#03070d] border border-[#1c2e42] relative shadow-md group flex items-center justify-center">
                                  {/* Lớp nền mờ ambient sang trọng phủ kín khung 16/10 */}
                                  <img
                                    src={currentGiftPreview.image}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none select-none"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1524] via-transparent to-black/20 pointer-events-none" />

                                  {/* Ảnh chính thể hiện trọn vẹn sản phẩm: object-contain đảm bảo KHÔNG mất đầu, KHÔNG mất chân */}
                                  <img
                                    key={currentGiftPreview.image}
                                    src={currentGiftPreview.image}
                                    alt={currentGiftPreview.previewTitle}
                                    className="relative z-10 w-full h-full object-contain p-1.5 animate-fadeIn transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)]"
                                  />
                                  <div className="absolute bottom-2.5 left-3 right-3 z-20 pointer-events-none">
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#dfb755] text-black uppercase tracking-wider shadow">
                                      {currentGiftPreview.tag || activeGift.title}
                                    </span>
                                  </div>
                                </div>

                                <h4 className="font-serif text-sm font-bold text-[#ffd700] leading-snug line-clamp-2">
                                  {currentGiftPreview.previewTitle}
                                </h4>
                                <p className="text-[11px] text-[#94a3b8] mt-1 leading-relaxed line-clamp-2">
                                  {currentGiftPreview.previewDesc}
                                </p>
                              </div>

                              <Link
                                href={currentGiftPreview.href}
                                prefetch={true}
                                className="mt-3.5 text-center text-xs font-black uppercase text-[#0b1622] bg-gradient-to-r from-[#dfb755] via-[#f5db8b] to-[#b8860b] hover:brightness-110 py-2.5 px-4 rounded-xl transition-all shadow-[0_2px_15px_rgba(223,183,85,0.4)] active:scale-95 block w-full"
                              >
                                {hoveredGiftSubItem ? "Xem chi tiết quà tặng ›" : "Xem tất cả quà tặng"}
                              </Link>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* 4. DỰ ÁN (Công trình, sản phẩm đã hoàn thiện) */}
            <Link
              href="/du-an"
              className={getNavBoxClass("/du-an")}
              title="Công trình, sản phẩm đã hoàn thiện"
            >
              <span>DỰ ÁN</span>
            </Link>

            {/* TIN TỨC */}
            <Link
              href="/tin-tuc"
              prefetch={true}
              className={getNavBoxClass("/tin-tuc")}
              title="Tin tức, cẩm nang phong thủy & kiến thức đồ đồng"
            >
              <span>TIN TỨC</span>
            </Link>

            {/* 5. VỀ CHÚNG TÔI (Dropdown: Giới thiệu công ty & Dịch vụ CSKH) */}
            <div
              className="relative flex-shrink-0"
              onMouseEnter={() => handleMouseEnter("about")}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/gioi-thieu" className={getNavBoxClass("/gioi-thieu")}>
                <span>VỀ CHÚNG TÔI</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 text-[#dfb755] group-hover:text-[#ffd700] ${
                    activeDropdown === "about" ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {activeDropdown === "about" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#0a1420] border-2 border-[#b8860b] rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-3 z-50 space-y-2 animate-in fade-in slide-in-from-top-2">
                  {aboutMenuItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="block p-2.5 rounded-lg bg-[#101c2b] border border-[#1e3147] hover:border-[#dfb755] hover:bg-[#dfb755]/15 transition-all text-left group"
                    >
                      <div className="text-xs font-bold text-[#ffd700] group-hover:text-white transition-colors">
                        {item.title}
                      </div>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 6. LIÊN HỆ */}
            <Link href="/lien-he" className={getNavBoxClass("/lien-he")}>
              <span>LIÊN HỆ</span>
            </Link>
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Search Icon Box */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Mở khung tìm kiếm"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md border flex items-center justify-center transition-all duration-300 ${
                searchOpen
                  ? "bg-[#dfb755] text-[#0b1622] border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                  : "bg-[#122234]/70 border-[#1c2c3d] text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700]"
              }`}
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Cart Icon Box */}
            <Link
              href="/san-pham"
              aria-label="Giỏ hàng"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-[#122234]/70 border border-[#1c2c3d] flex items-center justify-center text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] hover:scale-105 active:scale-95 transition-all duration-300 relative flex-shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#0b1622] shadow-md">
                {cartCount}
              </span>
            </Link>

            {/* Hotline Box Buttons (0836 122 222 - 0846 699 997) */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <a
                href={`tel:${hotlineData.cleanPhone1}`}
                title="Gọi Hotline 1"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-[#dfb755] via-[#f5db8b] to-[#b8860b] text-[#0b1622] px-2.5 2xl:px-3 py-1.5 rounded-md font-serif text-xs font-black tracking-wider shadow-[0_4px_15px_rgba(223,183,85,0.35)] hover:brightness-110 active:scale-95 border border-[#ffe082] transition-all whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 fill-[#0b1622] text-[#0b1622] flex-shrink-0" />
                <span>{hotlineData.hotline1}</span>
              </a>
              <a
                href={`tel:${hotlineData.cleanPhone2}`}
                title="Gọi Hotline 2"
                className="hidden 2xl:inline-flex items-center gap-1 bg-[#122234] hover:bg-[#1a2f48] text-[#ffd700] hover:text-white px-2.5 py-1.5 rounded-md font-serif text-xs font-black tracking-wider border border-[#dfb755]/50 shadow-sm transition-all whitespace-nowrap active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-[#dfb755] flex-shrink-0" />
                <span>{hotlineData.hotline2}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="border-t border-[#1c2c3d] bg-[#081018] px-3 sm:px-8 py-3 animate-in fade-in slide-in-from-top-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setLiveSearchVisible(false);
                  router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                }
              }}
              className="max-w-[800px] mx-auto flex items-center gap-2 relative"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim() && liveResults.length > 0) {
                      setLiveSearchVisible(true);
                    }
                  }}
                  placeholder="Tìm đồ thờ cúng, tượng đồng, tranh dát vàng, trống đồng..."
                  className="w-full px-3.5 py-2 bg-[#122234] border border-[#1c2c3d] rounded-md text-xs sm:text-sm text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd700]/30 transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setLiveResults([]);
                      setLiveSearchVisible(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0b1622] px-4 py-2 rounded-md text-xs font-bold hover:brightness-110 transition-all flex-shrink-0 whitespace-nowrap active:scale-95"
              >
                Tìm Kiếm
              </button>

              {/* Desktop Live Autocomplete Dropdown */}
              {liveSearchVisible && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1825] border border-[#ffd700]/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {isSearching ? (
                    <div className="p-3 text-center text-xs text-[#94a3b8] flex items-center justify-center gap-2">
                      <span className="animate-spin text-[#ffd700]">◷</span> Đang tìm kiếm sản phẩm...
                    </div>
                  ) : liveResults.length > 0 ? (
                    <div className="p-2.5 space-y-1">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-[#ffd700] uppercase tracking-wider border-b border-[#1e344d] flex justify-between items-center">
                        <span>Gợi ý ({liveResults.length})</span>
                        <span className="text-[10px] text-gray-400 font-normal">Nhấn Enter để xem danh sách đầy đủ</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {liveResults.map((item) => (
                          <Link
                            key={item.id}
                            href={item.categorySlug === "qua-tang" || item.categorySlug === "qua-tang-dong" ? `/qua-tang/${item.slug}` : `/san-pham/${item.slug}`}
                            onClick={() => {
                              setLiveSearchVisible(false);
                              setSearchOpen(false);
                            }}
                            className="flex items-center gap-2.5 p-2 hover:bg-[#122234] rounded-xl transition-colors group border border-transparent hover:border-[#dfb755]/30"
                          >
                            <div className="w-12 h-12 rounded-lg bg-[#050c14] border border-[#1e344d] overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                              <img
                                src={getWatermarkedImageUrl(item.image)}
                                alt={item.name}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="text-xs font-bold text-white group-hover:text-[#ffd700] truncate transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#ffd700] font-semibold mt-0.5">
                                {formatPrice(item.price)}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLiveSearchVisible(false);
                          setSearchOpen(false);
                          router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
                        }}
                        className="w-full mt-2 py-2 text-center text-xs text-[#dfb755] hover:text-white font-bold bg-[#142335] hover:bg-[#1c3550] rounded-lg transition-colors"
                      >
                        Xem tất cả kết quả cho &quot;{searchQuery}&quot; →
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs text-[#94a3b8]">
                      Không tìm thấy sản phẩm phù hợp. Nhấn Enter để tìm kiếm đầy đủ.
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* MOBILE DRAWER NAVIGATION (ALIGNED 100% WITH EXCEL TAXONOMY)  */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Content */}
          <div className="relative ml-auto w-full max-w-[340px] sm:max-w-sm h-full bg-[#081018] text-[#f1f5f9] border-l border-[#1c2c3d] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#1c2c3d] bg-[#0b1622] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#122234] border border-[#c59b4e]/40 p-1 flex items-center justify-center">
                  <img src="/images/logo.png" alt="Lộc Nam" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="font-serif text-sm font-black tracking-widest bg-gradient-to-r from-[#fce9b5] via-[#ffd700] to-[#dfb755] bg-clip-text text-transparent">
                    ĐỒ ĐỒNG LỘC NAM
                  </div>
                  <div className="text-[9px] text-[#94a3b8]">Ý Yên, Nam Định</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-md bg-[#122234] border border-[#1c2c3d] flex items-center justify-center text-gray-300 hover:text-white"
                aria-label="Đóng menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* 1. TRANG CHỦ */}
              <Link
                href="/"
                className="flex items-center justify-between p-3 rounded-md bg-[#122234]/70 border border-[#1c2c3d] text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] transition-all"
              >
                <span>TRANG CHỦ</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>

              {/* 2. SẢN PHẨM (Accordion với 4 nhóm từ Excel) */}
              <div className="rounded-md bg-[#122234]/70 border border-[#1c2c3d] overflow-hidden">
                <button
                  onClick={() => toggleMobileAccordion("products")}
                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>SẢN PHẨM</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#dfb755]/20 text-[#ffd700]">4 Danh mục</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#dfb755] transition-transform duration-200 ${
                      mobileAccordion === "products" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileAccordion === "products" && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#1c2c3d]/60 space-y-2 bg-[#081018]/80 animate-in fade-in">
                    <Link
                      href="/san-pham"
                      className="block p-2 rounded text-xs font-semibold text-[#ffd700] bg-[#dfb755]/10 border border-[#dfb755]/30"
                    >
                      › Xem tất cả sản phẩm
                    </Link>
                    {productNavigationCategories.map((group) => (
                      <div key={group.id} className="p-2 rounded bg-[#122234]/40 border border-[#1c2c3d]/50 space-y-1">
                        <Link
                          href={group.href}
                          className="font-serif text-xs font-bold text-[#ffd700] flex items-center justify-between"
                        >
                          <span>{group.title}</span>
                          <span className="text-[9px] text-[#dfb755]">Xem tất cả ›</span>
                        </Link>
                        <div className="space-y-1 pt-1">
                          {group.subItems.slice(0, 6).map((sub, i) => (
                            <Link
                              key={i}
                              href={(sub as any).href || `${group.href}${group.href.includes("?") ? "&" : "?"}sub=${encodeURIComponent(sub.query)}`}
                              className="text-[11px] text-[#94a3b8] hover:text-[#ffd700] block pl-2"
                            >
                              - {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. QUÀ TẶNG (Accordion với QUÀ TẶNG ĐỐI TÁC, SỰ KIỆN, PHONG THỦY) */}
              <div className="rounded-md bg-[#122234]/70 border border-[#1c2c3d] overflow-hidden">
                <button
                  onClick={() => toggleMobileAccordion("gifts")}
                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>QUÀ TẶNG</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-300">Cao cấp</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#dfb755] transition-transform duration-200 ${
                      mobileAccordion === "gifts" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileAccordion === "gifts" && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#1c2c3d]/60 space-y-2 bg-[#081018]/80 animate-in fade-in">
                    <Link href="/qua-tang" className="block p-2 rounded text-xs font-semibold text-[#ffd700] bg-[#dfb755]/10 border border-[#dfb755]/30"
                    >
                      › Xem tất cả quà tặng
                    </Link>
                    {giftMegaMenu.map((group) => (
                      <div key={group.id} className="p-2 rounded bg-[#122234]/40 border border-[#1c2c3d]/50 space-y-1">
                        <Link
                          href={group.href}
                          className="font-serif text-xs font-bold text-[#ffd700] flex items-center justify-between"
                        >
                          <span>{group.title}</span>
                          <span className="text-[9px] text-[#94a3b8]">Xem thêm</span>
                        </Link>
                        <div className="space-y-1 pt-1">
                          {group.items.slice(0, 4).map((item, i) => (
                            <Link
                              key={i}
                              href={item.href}
                              className="text-[11px] text-[#94a3b8] hover:text-[#ffd700] block pl-2"
                            >
                              - {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. DỰ ÁN */}
              <Link
                href="/du-an"
                className="flex items-center justify-between p-3 rounded-md bg-[#122234]/70 border border-[#1c2c3d] text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] transition-all"
              >
                <span>DỰ ÁN</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>

              {/* TIN TỨC */}
              <Link
                href="/tin-tuc"
                prefetch={true}
                className="flex items-center justify-between p-3 rounded-md bg-[#122234]/70 border border-[#1c2c3d] text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] transition-all"
              >
                <span className="flex items-center gap-2">
                  <span>TIN TỨC</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#dfb755]/20 text-[#ffd700]">Cẩm nang</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>

              {/* 5. VỀ CHÚNG TÔI (Accordion 2 mục) */}
              <div className="rounded-md bg-[#122234]/70 border border-[#1c2c3d] overflow-hidden">
                <button
                  onClick={() => toggleMobileAccordion("about")}
                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] transition-colors"
                >
                  <span>VỀ CHÚNG TÔI</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#dfb755] transition-transform duration-200 ${
                      mobileAccordion === "about" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileAccordion === "about" && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#1c2c3d]/60 space-y-1.5 bg-[#081018]/80 animate-in fade-in">
                    {aboutMenuItems.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="block p-2 rounded text-xs text-[#cbd5e1] hover:text-[#ffd700] hover:bg-[#122234] transition-all"
                      >
                        › {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. LIÊN HỆ */}
              <Link
                href="/lien-he"
                className="flex items-center justify-between p-3 rounded-md bg-[#122234]/70 border border-[#1c2c3d] text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] transition-all"
              >
                <span>LIÊN HỆ & SHOWROOM</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>

              {/* Quick Info Box */}
              <div className="p-3.5 rounded-md bg-[#0b1622] border border-[#1c2c3d] space-y-2 mt-4 text-[11px] text-[#94a3b8]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#dfb755] flex-shrink-0 mt-0.5" />
                  <span>Xưởng đúc & 3 Showroom lớn Ý Yên, Ninh Bình & Hà Nội</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#dfb755] flex-shrink-0" />
                  <span>Hotline 24/7: 0846 699 997</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#1c2c3d] bg-[#0b1622] space-y-2.5">
              <a
                href="tel:0846699997"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0b1622] py-2.5 rounded-md text-xs font-bold shadow-[0_4px_15px_rgba(223,183,85,0.4)] border border-[#ffe082] active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4 fill-[#0b1622] text-[#0b1622]" />
                <span>GỌI HOTLINE: 0846 699 997</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://zalo.me/0846699997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#0068FF] text-white text-xs font-bold active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat Zalo</span>
                </a>
                <Link
                  href="/admin/login"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#122234] border border-[#1c2c3d] text-[#e2e8f0] text-xs font-semibold hover:text-[#ffd700] active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Quản trị</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
