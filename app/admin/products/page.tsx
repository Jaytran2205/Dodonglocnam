"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  X,
  Upload,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Copy,
  Link2,
  Tag,
  FolderTree,
  FileText,
  Save,
  Check,
  Globe,
  Gift,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { ProductArticleEditor } from "@/components/admin/ProductArticleEditor";
import { HierarchicalCategorySelector } from "@/components/admin/HierarchicalCategorySelector";
import { ProductSeoBox } from "@/components/admin/ProductSeoBox";
import { ProductPromotionsBox } from "@/components/admin/ProductPromotionsBox";
import { ProductSurfaceBox } from "@/components/admin/ProductSurfaceBox";
import { ProductTagsBox } from "@/components/admin/ProductTagsBox";
import { ProductFaqBox } from "@/components/admin/ProductFaqBox";
import { DEFAULT_HIERARCHICAL_CATEGORIES, MainCategoryData } from "@/lib/subcategories-data";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<MainCategoryData[]>(DEFAULT_HIERARCHICAL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [selectedSubCat, setSelectedSubCat] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [angleImages, setAngleImages] = useState<{ id: string; label: string; url: string }[]>([]);
  const [uploadingAngle, setUploadingAngle] = useState<number | null>(null);

  // Main Form Data State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    subCategoryId: "",
    categoryIds: "",
    subCategoryIds: "",
    tags: "",
    material: "",
    dimensions: "",
    weight: "",
    shortDescription: "",
    description: "",
    images: "",
    isFeatured: true,
    inStock: true,
  });

  // Selected Finishing Surfaces
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch Categories & Catalog
  const fetchCatalog = async () => {
    try {
      const res = await fetch("/api/admin/subcategories");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setCatalog(data.data);
      }
    } catch (e) {
      console.error("Error fetching subcategories catalog:", e);
    }
  };

  const fetchProducts = async (forceRefresh = false) => {
    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem("locnam_admin_products_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.products && Array.isArray(parsed.products)) {
            setProducts(parsed.products);
            if (parsed.categories && Array.isArray(parsed.categories)) {
              setCategories(parsed.categories);
            }
            setLoading(false);
          }
        }
      } catch (_) {}
    } else {
      setLoading(true);
    }

    try {
      const [res, catRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);
      const [data, catData] = await Promise.all([res.json(), catRes.json()]);

      if (data.success) {
        setProducts(data.products);
      }
      if (catData.success) {
        setCategories(catData.categories);
        if (!formData.categoryId && catData.categories.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: catData.categories[0].id }));
        }
      }

      if (data.success && catData.success) {
        try {
          sessionStorage.setItem(
            "locnam_admin_products_cache",
            JSON.stringify({
              products: data.products,
              categories: catData.categories,
            })
          );
        } catch (_) {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCatalog();
  }, []);

  // Available Subcategories for the filter dropdown
  const availableSubcategoriesForFilter = useMemo(() => {
    if (selectedCat === "ALL") {
      const allSubs: { id: string; name: string }[] = [];
      catalog.forEach((c) => {
        (c.subCategories || []).forEach((sub) => {
          if (!allSubs.some((s) => s.id === sub.id)) {
            allSubs.push({ id: sub.id, name: sub.name });
          }
        });
      });
      return allSubs;
    }

    const selectedDbCat = categories.find((c) => c.id === selectedCat || c.slug === selectedCat);
    if (!selectedDbCat) return [];

    const matchedCatalog = catalog.find(
      (c) =>
        c.slug === selectedDbCat.slug ||
        (c.aliases && c.aliases.includes(selectedDbCat.slug))
    );
    return matchedCatalog ? matchedCatalog.subCategories || [] : [];
  }, [selectedCat, categories, catalog]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProduct(null);
    const initialCatId = categories[0]?.id || "";
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      categoryId: initialCatId,
      subCategoryId: "",
      categoryIds: initialCatId ? JSON.stringify([initialCatId]) : "[]",
      subCategoryIds: "[]",
      tags: "Đồ đồng cao cấp, Làng nghề Ý Yên, Mạ vàng 24K",
      material: "Đồng đỏ nguyên chất thanh khiết mạ vàng 24K",
      dimensions: "Kích thước theo thước Lỗ Ban",
      weight: "5kg",
      shortDescription: "",
      description: "",
      images: "/images/hero_golden_ship.jpg",
      isFeatured: true,
      inStock: true,
    });
    setSelectedSurfaces(["Mạ - dát vàng 24K"]);
    setAngleImages([
      { id: "1", label: "Ảnh chính / Mặt trước", url: "/images/hero_golden_ship.jpg" },
      { id: "2", label: "Góc nghiêng 45°", url: "" },
      { id: "3", label: "Cận cảnh chi tiết hoa văn", url: "" },
      { id: "4", label: "Mặt sau & Chân đế", url: "" },
    ]);
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (prod: any) => {
    setEditingProduct(prod);

    let parsedImgs: string[] = [];
    try {
      const parsed = JSON.parse(prod.images);
      parsedImgs = Array.isArray(parsed) ? parsed : [prod.images];
    } catch {
      parsedImgs = prod.images
        ? prod.images.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
    }

    const defaultLabels = [
      "Ảnh chính / Mặt trước",
      "Góc nghiêng 45°",
      "Cận cảnh chi tiết hoa văn",
      "Mặt sau & Chân đế",
    ];

    const initialSlots = [0, 1, 2, 3].map((i) => ({
      id: String(i + 1),
      label: defaultLabels[i],
      url: parsedImgs[i] || "",
    }));

    if (parsedImgs.length > 4) {
      for (let i = 4; i < parsedImgs.length; i++) {
        initialSlots.push({
          id: String(i + 1),
          label: `Góc chụp ${i + 1}`,
          url: parsedImgs[i],
        });
      }
    }

    setAngleImages(initialSlots);

    // Auto-detect subcategory if not explicitly stored
    let detectedSubCat = prod.subCategoryId || "";
    if (!detectedSubCat) {
      const catSlug = prod.category?.slug;
      const main = catalog.find((c) => c.slug === catSlug || (c.aliases && c.aliases.includes(catSlug)));
      if (main && main.subCategories) {
        const pName = (prod.name || "").toLowerCase();
        for (const sub of main.subCategories) {
          if (sub.children) {
            const matchedChild = sub.children.find((ch) =>
              pName.includes(ch.name.toLowerCase())
            );
            if (matchedChild) {
              detectedSubCat = matchedChild.id;
              break;
            }
          }
          if (pName.includes(sub.name.toLowerCase())) {
            detectedSubCat = sub.id;
            break;
          }
        }
      }
    }

    // Extract surfaces from material and tags
    const surfaces: string[] = [];
    const matAndTags = `${prod.material || ""} ${prod.tags || ""}`.toLowerCase();
    if (matAndTags.includes("mạ vàng") || matAndTags.includes("dát vàng 24k")) surfaces.push("Mạ - dát vàng 24K");
    if (matAndTags.includes("9999")) surfaces.push("Dát vàng 9999");
    if (matAndTags.includes("tam khí")) surfaces.push("Mạ - khảm tam khí");
    if (matAndTags.includes("ngũ sắc")) surfaces.push("Mạ - khảm ngũ sắc");
    if (matAndTags.includes("khảm bạc")) surfaces.push("Mạ - khảm bạc");
    if (matAndTags.includes("giả cổ") || matAndTags.includes("hun nâu")) surfaces.push("Giả cổ hun nâu");
    if (matAndTags.includes("màu mộc")) surfaces.push("Màu mộc đồng đỏ");
    if (matAndTags.includes("catut")) surfaces.push("Đồng catut quân sự");

    setSelectedSurfaces(surfaces.length > 0 ? surfaces : ["Mạ - dát vàng 24K"]);

    const initialCatId = prod.categoryId || categories[0]?.id || "";
    const resolvedCatIds = prod.categoryIds || (initialCatId ? JSON.stringify([initialCatId]) : "[]");
    const resolvedSubIds = prod.subCategoryIds || (detectedSubCat ? JSON.stringify([detectedSubCat]) : "[]");

    setFormData({
      name: prod.name || "",
      price: prod.price ? String(prod.price) : "",
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : "",
      categoryId: initialCatId,
      subCategoryId: detectedSubCat,
      categoryIds: resolvedCatIds,
      subCategoryIds: resolvedSubIds,
      tags: prod.tags || "",
      material: prod.material || "Đồng đỏ nguyên chất mạ vàng 24K",
      dimensions: prod.dimensions || "Kích thước theo thước Lỗ Ban",
      weight: prod.weight || "Theo yêu cầu",
      shortDescription: prod.shortDescription || "",
      description: prod.description || "",
      images: prod.images || "/images/hero_golden_ship.jpg",
      isFeatured: Boolean(prod.isFeatured),
      inStock: prod.inStock !== undefined ? Boolean(prod.inStock) : true,
    });

    setModalOpen(true);
  };

  // Upload image handler for angle slots
  const handleFileUploadForAngle = async (idx: number, file: File) => {
    setUploadingAngle(idx);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (result.success && result.url) {
        setAngleImages((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], url: result.url };
          return next;
        });
        if (idx === 0) {
          setFormData((prev) => ({ ...prev, images: result.url }));
        }
      } else {
        alert(result.message || "Lỗi tải ảnh lên");
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên máy chủ");
    } finally {
      setUploadingAngle(null);
    }
  };

  // Save Product (Create or Edit)
  const handleSave = async (e?: React.FormEvent, forceStatus?: boolean) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) return alert("Vui lòng nhập tên sản phẩm");
    if (!formData.categoryId) return alert("Vui lòng chọn danh mục sản phẩm");

    setSaving(true);
    try {
      const validUrls = angleImages.map((a) => a.url.trim()).filter(Boolean);
      const imageList = validUrls.length > 0 ? validUrls : ["/images/hero_golden_ship.jpg"];

      // Merge selected surfaces into tags if not present
      const currentTagsList = (formData.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      selectedSurfaces.forEach((s) => {
        if (!currentTagsList.includes(s)) currentTagsList.push(s);
      });

      const payload = {
        ...formData,
        tags: currentTagsList.join(", "),
        inStock: forceStatus !== undefined ? forceStatus : formData.inStock,
        price: formData.price ? parseFloat(formData.price) : null,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        images: JSON.stringify(imageList),
        id: editingProduct?.id,
      };

      const res = await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setModalOpen(false);
        fetchProducts(true);
      } else {
        alert(data.message || "Lỗi lưu sản phẩm");
      }
    } catch (e) {
      alert("Lỗi kết nối máy chủ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchProducts(true);
      } else {
        alert(data.message || "Lỗi xóa sản phẩm");
      }
    } catch (e) {
      alert("Lỗi khi xóa");
    }
  };

  const toggleStock = async (prod: any) => {
    try {
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prod.id, inStock: !prod.inStock }),
      });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFeatured = async (prod: any) => {
    try {
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prod.id, isFeatured: !prod.isFeatured }),
      });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to find Subcategory Name for a product
  const getSubCatNameForProduct = (prod: any) => {
    if (!prod) return null;
    const catSlug = prod.category?.slug;
    const main = catalog.find((c) => c.slug === catSlug || (c.aliases && c.aliases.includes(catSlug)));
    if (!main || !main.subCategories) return null;

    if (prod.subCategoryId) {
      for (const sub of main.subCategories) {
        if (sub.id === prod.subCategoryId) return sub.name;
        if (sub.children) {
          const ch = sub.children.find((c) => c.id === prod.subCategoryId);
          if (ch) return `${sub.name} › ${ch.name}`;
        }
      }
    }

    // Fallback: match by keywords
    const pName = (prod.name || "").toLowerCase();
    for (const sub of main.subCategories) {
      if (sub.children) {
        const ch = sub.children.find((c) => pName.includes(c.name.toLowerCase()));
        if (ch) return `${sub.name} › ${ch.name}`;
      }
      if (pName.includes(sub.name.toLowerCase())) return sub.name;
    }
    return null;
  };

  // Filter & Sort Products for Listing Table
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q)) ||
          (p.tags && p.tags.toLowerCase().includes(q))
      );
    }

    if (selectedCat !== "ALL") {
      list = list.filter(
        (p) => p.categoryId === selectedCat || p.category?.slug === selectedCat
      );
    }

    if (selectedSubCat !== "ALL") {
      list = list.filter((p) => {
        if (p.subCategoryId === selectedSubCat) return true;
        const subName = getSubCatNameForProduct(p);
        const subObj = availableSubcategoriesForFilter.find((s) => s.id === selectedSubCat);
        if (subObj && subName && subName.toLowerCase().includes(subObj.name.toLowerCase())) {
          return true;
        }
        return false;
      });
    }

    if (stockFilter === "IN_STOCK") {
      list = list.filter((p) => p.inStock);
    } else if (stockFilter === "OUT_OF_STOCK") {
      list = list.filter((p) => !p.inStock);
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, search, selectedCat, selectedSubCat, stockFilter, sortBy, availableSubcategoriesForFilter]);

  const activeCatSlug =
    categories.find((c) => c.id === formData.categoryId)?.slug ||
    editingProduct?.category?.slug ||
    "tuong-dong";

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              HỆ THỐNG QUẢN TRỊ BÀI VIẾT & SẢN PHẨM LỘC NAM
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide mt-1">
            QUẢN LÝ SẢN PHẨM ({products.length} MẶT HÀNG)
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Cấu hình danh mục nhánh nhỏ, biên tập nội dung chuẩn SEO và kiểm soát kho hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProducts(true)}
            className="p-2.5 bg-[#111c2e] hover:bg-[#152236] text-[#d4af37] border border-[#d4af37]/30 rounded-xl transition-all shadow"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5b869] hover:from-[#b89628] hover:to-[#d4af37] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 p-4 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, chất liệu, nhánh nhỏ, từ khóa..."
              className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none transition-all placeholder:text-gray-500"
            />
          </div>

          {/* Main Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedCat}
              onChange={(e) => {
                setSelectedCat(e.target.value);
                setSelectedSubCat("ALL");
              }}
              className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất Cả Danh Mục Chính ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Branch Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedSubCat}
              onChange={(e) => setSelectedSubCat(e.target.value)}
              className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất Cả Nhánh Nhỏ ({availableSubcategoriesForFilter.length})</option>
              {availableSubcategoriesForFilter.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  └─ {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="lg:col-span-2">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất Cả Kho</option>
              <option value="IN_STOCK">Còn Hàng</option>
              <option value="OUT_OF_STOCK">Hết Hàng</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        <div className="flex items-center justify-between text-xs text-[#94a3b8] pt-1 border-t border-[#1f2d42]">
          <span>
            Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} sản phẩm
          </span>
          {(search || selectedCat !== "ALL" || selectedSubCat !== "ALL" || stockFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCat("ALL");
                setSelectedSubCat("ALL");
                setStockFilter("ALL");
              }}
              className="text-[#d4af37] hover:underline font-semibold"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-400">Đang tải cơ sở dữ liệu sản phẩm...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-3 text-gray-400">
            <Package className="w-12 h-12 mx-auto text-gray-600" />
            <p className="text-sm">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111c2e] text-[#d4af37] uppercase font-serif tracking-wider text-[11px] border-b border-[#1f2d42]">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">Ảnh</th>
                  <th className="py-3.5 px-4">Tên Sản Phẩm</th>
                  <th className="py-3.5 px-4">Danh Mục & Nhánh Nhỏ</th>
                  <th className="py-3.5 px-4">Giá Bán</th>
                  <th className="py-3.5 px-4 text-center">Kho Hàng</th>
                  <th className="py-3.5 px-4 text-center">Nổi Bật</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d42]/60">
                {filteredProducts.map((prod) => {
                  let img = "/images/hero_golden_ship.jpg";
                  try {
                    const parsed = JSON.parse(prod.images);
                    img = Array.isArray(parsed) && parsed[0] ? parsed[0] : prod.images;
                  } catch {
                    img = prod.images || "/images/hero_golden_ship.jpg";
                  }

                  const subBranchName = getSubCatNameForProduct(prod);

                  return (
                    <tr key={prod.id} className="hover:bg-[#111c2e]/60 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-[#1f2d42] overflow-hidden p-1 flex items-center justify-center">
                          <img
                            src={img}
                            alt={prod.name}
                            className="w-full h-full object-contain rounded"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs sm:max-w-md">
                        <div className="font-serif font-semibold text-white leading-snug line-clamp-2">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-[#94a3b8] line-clamp-1 mt-0.5">
                          {prod.material || "Đồng nguyên chất"} {prod.dimensions && `• ${prod.dimensions}`}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#152236] border border-[#d4af37]/25 text-[#d4af37] text-[10px] font-bold uppercase">
                            {prod.category?.name || "Chưa phân loại"}
                          </span>
                          {subBranchName && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-medium">
                              <span className="text-gray-500">└─</span>
                              <span className="truncate max-w-[180px]">{subBranchName}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                        {prod.price ? formatPrice(prod.price) : "Liên hệ"}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStock(prod)}
                          title="Bấm để đổi trạng thái kho"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            prod.inStock
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          }`}
                        >
                          {prod.inStock ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Còn Hàng</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Hết Hàng</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleFeatured(prod)}
                          title="Bật/Tắt hiển thị nổi bật"
                          className={`p-1.5 rounded-lg transition-colors ${
                            prod.isFeatured
                              ? "text-amber-400 bg-amber-400/20 border border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                              : "text-gray-500 hover:text-gray-300"
                          }`}
                        >
                          <Star className={`w-4 h-4 ${prod.isFeatured ? "fill-current" : ""}`} />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/san-pham/${prod.category?.slug || "tuong-dong"}/${prod.slug}`}
                            target="_blank"
                            title="Xem trang sản phẩm thực tế"
                            className="p-1.5 rounded-lg bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => openEditModal(prod)}
                            title="Chỉnh sửa sản phẩm"
                            className="p-1.5 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#070c14] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            title="Xóa sản phẩm"
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-400 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN WORDPRESS / WOOCOMMERCE-STYLE MODAL BOX EDITOR                   */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-7xl bg-[#0c1420] border-2 border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#111c2e] via-[#142339] to-[#0c1420] border-b border-[#d4af37]/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#d4af37] animate-pulse"></div>
                <div>
                  <h2 className="font-serif font-extrabold text-base sm:text-lg text-[#d4af37] uppercase tracking-wide">
                    {editingProduct ? "CHỈNH SỬA BÀI VIẾT SẢN PHẨM" : "SOẠN THẢO BÀI VIẾT SẢN PHẨM MỚI"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Giao diện chuyên nghiệp dạng modular boxes — Cấu hình đa nhánh, nội dung & SEO
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#152236] transition-colors"
                  title="Đóng cửa sổ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ============================================================= */}
                {/* LEFT COLUMN: MAIN CONTENT BOXES (8 COLS)                      */}
                {/* ============================================================= */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* BOX 1: TITLE & PERMALINK PREVIEW */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl p-4 shadow-lg space-y-3">
                    <div>
                      <label className="text-xs font-bold text-white block uppercase mb-1">
                        Tên Sản Phẩm / Tiêu Đề Bài Viết *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ví dụ: Bộ Ngũ Sự Đỉnh Đồng Thờ Cúng Bằng Đồng Đỏ Mạ Vàng 24K"
                        className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-sm sm:text-base font-serif font-bold px-4 py-3 rounded-xl focus:outline-none"
                      />
                    </div>

                    {/* URL Permalink display */}
                    {editingProduct && (
                      <div className="p-3 bg-[#070c14] rounded-lg border border-[#1b283d] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5 min-w-0 text-gray-300">
                          <Link2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          <span className="text-gray-400 font-semibold">Liên kết cố định:</span>
                          <span className="font-mono text-amber-300 truncate">
                            {`/san-pham/${activeCatSlug}/${editingProduct.slug}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const fullUrl = `${window.location.origin}/san-pham/${activeCatSlug}/${editingProduct.slug}`;
                              navigator.clipboard.writeText(fullUrl);
                              alert("Đã sao chép liên kết vào bộ nhớ tạm!");
                            }}
                            className="px-2.5 py-1 bg-[#152236] hover:bg-[#1d2f4a] text-[#d4af37] border border-[#d4af37]/30 rounded text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </button>
                          <a
                            href={`/san-pham/${activeCatSlug}/${editingProduct.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-gradient-to-r from-[#d4af37] to-[#e5b869] text-[#070c14] hover:brightness-110 rounded text-[11px] font-bold flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Xem thực tế</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOX 2: FULL PRODUCT ARTICLE & RICH DESCRIPTION */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#d4af37]" />
                        <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                          Mô Tả Sản Phẩm (Nội Dung Bài Viết Chi Tiết)
                        </h3>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        Hỗ trợ định dạng, chèn bảng, hộp quà tặng, video & ảnh
                      </span>
                    </div>

                    <div className="p-4">
                      <ProductArticleEditor
                        value={formData.description}
                        onChange={(val) => setFormData({ ...formData, description: val })}
                        productName={formData.name || "Sản phẩm Đồ Đồng Lộc Nam"}
                      />
                    </div>
                  </div>

                  {/* BOX 3: PROMOTIONS & POLICIES (From screenshot 2) */}
                  <ProductPromotionsBox
                    description={formData.description}
                    onAppendPromotionToDescription={(promoText) => {
                      setFormData((prev) => ({
                        ...prev,
                        description: prev.description + promoText,
                      }));
                    }}
                  />

                  {/* BOX 4: SHORT DESCRIPTION */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                        Mô Tả Ngắn Của Sản Phẩm
                      </h3>
                      <span className="text-[10px] text-gray-400">
                        Hiển thị ngay dưới giá bán & trong thẻ meta tóm tắt
                      </span>
                    </div>
                    <div className="p-4">
                      <textarea
                        rows={3}
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        placeholder="Đoạn văn ngắn gọn 2 - 3 câu nêu bật phôi đồng thanh khiết, xuất xứ làng nghề Ý Yên..."
                        className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* BOX 5: PRODUCT DATA / SPECIFICATIONS (From screenshot 6) */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#d4af37]" />
                        <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                          Dữ Liệu Sản Phẩm & Quy Cách Kỹ Thuật
                        </h3>
                      </div>
                      <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                        Sản phẩm tiêu chuẩn
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Regular Price */}
                        <div className="space-y-1">
                          <label className="font-bold text-white block uppercase">
                            Giá Bán Thông Thường (VNĐ)
                          </label>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="Để trống nếu là giá Liên hệ"
                            className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none font-mono"
                          />
                        </div>

                        {/* Original Price */}
                        <div className="space-y-1">
                          <label className="font-bold text-white block uppercase">
                            Giá Gốc / Giá Khuyến Mãi (VNĐ)
                          </label>
                          <input
                            type="number"
                            value={formData.originalPrice}
                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                            placeholder="Giá niêm yết trước giảm (nếu có)"
                            className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none font-mono"
                          />
                        </div>

                        {/* Dimensions */}
                        <div className="space-y-1">
                          <label className="font-bold text-white block uppercase">
                            Kích Thước Thước Lỗ Ban
                          </label>
                          <input
                            type="text"
                            value={formData.dimensions}
                            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                            placeholder="Ví dụ: Cao 60cm, Rộng 38cm chuẩn cung Phú Quý"
                            className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                          />
                        </div>

                        {/* Weight */}
                        <div className="space-y-1">
                          <label className="font-bold text-white block uppercase">
                            Khối Lượng / Cân Nặng
                          </label>
                          <input
                            type="text"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            placeholder="Ví dụ: 12kg hoặc Theo kích thước phôi đúc"
                            className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                          />
                        </div>

                        {/* Material */}
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-bold text-white block uppercase">
                            Chất Liệu Phôi Đúc
                          </label>
                          <input
                            type="text"
                            value={formData.material}
                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                            placeholder="Ví dụ: Đồng đỏ nguyên chất thanh khiết Ý Yên, mạ vàng 24K"
                            className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOX 6: RANK MATH SEO AUDIT (From screenshot 4 & 5) */}
                  <ProductSeoBox
                    title={formData.name}
                    slug={editingProduct?.slug || ""}
                    categoryName={categories.find((c) => c.id === formData.categoryId)?.name}
                    shortDescription={formData.shortDescription}
                    description={formData.description}
                    hasImages={angleImages.some((a) => a.url)}
                  />

                  {/* BOX 7: FAQ (From screenshot 6) */}
                  <ProductFaqBox
                    onInsertFaqToDescription={(faqText) => {
                      setFormData((prev) => ({
                        ...prev,
                        description: prev.description + faqText,
                      }));
                    }}
                  />
                </div>

                {/* ============================================================= */}
                {/* RIGHT COLUMN: SIDEBAR META-BOXES (4 COLS)                    */}
                {/* ============================================================= */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* BOX 1: PUBLISH META-BOX (From screenshot 1) */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                        Xuất Bản
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Sẵn sàng</span>
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Status / Visibility Switches */}
                      <div className="space-y-2.5 text-xs">
                        {/* InStock switch */}
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#111c2e] border border-[#202f45]">
                          <span className="text-gray-300 font-medium">Tình trạng kho hàng:</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                            className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors ${
                              formData.inStock
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            }`}
                          >
                            {formData.inStock ? "Còn Hàng" : "Hết Hàng"}
                          </button>
                        </div>

                        {/* Featured Star Switch */}
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#111c2e] border border-[#202f45]">
                          <span className="text-gray-300 font-medium">Sản phẩm nổi bật:</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                            className={`p-1.5 rounded-lg transition-colors ${
                              formData.isFeatured
                                ? "bg-amber-400/20 text-amber-400 border border-amber-400/40"
                                : "bg-gray-800 text-gray-500"
                            }`}
                          >
                            <Star className={`w-4 h-4 ${formData.isFeatured ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Main Action Buttons */}
                      <div className="pt-2 border-t border-[#202f45] space-y-2">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleSave(undefined, true)}
                          className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] via-[#e5b869] to-[#d4af37] hover:brightness-110 text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{saving ? "ĐANG LƯU..." : editingProduct ? "CẬP NHẬT SẢN PHẨM" : "XUẤT BẢN NGAY"}</span>
                        </button>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSave(undefined, false)}
                            disabled={saving}
                            className="flex-1 py-2 bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 hover:text-white rounded-lg font-semibold text-xs transition-colors"
                          >
                            Lưu Bản Nháp
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 bg-[#1f2d42] hover:bg-[#2b3e5a] text-gray-400 hover:text-white rounded-lg font-semibold text-xs transition-colors"
                          >
                            Hủy Bỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOX 2: HIERARCHICAL CATEGORY SELECTOR (From screenshot 1, 2, 3 - TRỌNG TÂM YÊU CẦU) */}
                  <HierarchicalCategorySelector
                    categories={categories}
                    catalog={catalog}
                    selectedCategoryId={formData.categoryId}
                    selectedSubCategoryId={formData.subCategoryId}
                    selectedCategoryIds={formData.categoryIds}
                    selectedSubCategoryIds={formData.subCategoryIds}
                    onChangeMultiSelection={({ primaryCategoryId, primarySubCategoryId, categoryIds, subCategoryIds, tagsToAppend }) => {
                      setFormData((prev) => {
                        let updatedTags = prev.tags;
                        if (tagsToAppend) {
                          const existingList = (prev.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
                          const newItems = tagsToAppend.split(",").map((s) => s.trim()).filter(Boolean);
                          newItems.forEach((item) => {
                            if (!existingList.includes(item)) existingList.push(item);
                          });
                          updatedTags = existingList.join(", ");
                        }
                        return {
                          ...prev,
                          categoryId: primaryCategoryId,
                          subCategoryId: primarySubCategoryId,
                          categoryIds: JSON.stringify(categoryIds),
                          subCategoryIds: JSON.stringify(subCategoryIds),
                          tags: updatedTags,
                        };
                      });
                    }}
                    onSelectCategory={(catId, subId, pathText, tagsToAppend) => {
                      setFormData((prev) => {
                        let updatedTags = prev.tags;
                        if (tagsToAppend) {
                          const existingList = (prev.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
                          const newItems = tagsToAppend.split(",").map((s) => s.trim()).filter(Boolean);
                          newItems.forEach((item) => {
                            if (!existingList.includes(item)) existingList.push(item);
                          });
                          updatedTags = existingList.join(", ");
                        }
                        return {
                          ...prev,
                          categoryId: catId,
                          subCategoryId: subId,
                          tags: updatedTags,
                        };
                      });
                    }}
                    onRefreshCatalog={fetchCatalog}
                    title="Danh mục sản phẩm (Chọn nhiều mục)"
                  />

                  {/* BOX 3: FINISHING SURFACES & CRAFTSMANSHIP (From screenshot 6) */}
                  <ProductSurfaceBox
                    selectedSurfaces={selectedSurfaces}
                    onChange={(surfaces) => {
                      setSelectedSurfaces(surfaces);
                      // Auto-update material string with primary surface
                      if (surfaces.length > 0) {
                        const surfaceText = surfaces.join(", ");
                        setFormData((prev) => ({
                          ...prev,
                          material: prev.material.includes("Đồng")
                            ? `Đồng đỏ thanh khiết ${surfaceText}`
                            : surfaceText,
                        }));
                      }
                    }}
                  />

                  {/* BOX 4: PRODUCT IMAGES & MULTI-ANGLE GALLERY (From screenshot 2) */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                        Ảnh Sản Phẩm & Album Đa Góc
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          setAngleImages((prev) => [
                            ...prev,
                            { id: String(Date.now()), label: `Góc chụp ${prev.length + 1}`, url: "" },
                          ])
                        }
                        className="text-[10px] text-[#ffd700] hover:underline font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm góc</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Grid of Slots */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {angleImages.map((angle, idx) => (
                          <div
                            key={angle.id || idx}
                            className="bg-[#111c2e] p-2 rounded-xl border border-[#202f45] flex flex-col justify-between space-y-1.5 relative group hover:border-[#d4af37]/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gray-300 truncate">
                                {angle.label}
                              </span>
                              {idx >= 4 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAngleImages((prev) => prev.filter((_, i) => i !== idx))
                                  }
                                  className="text-gray-500 hover:text-red-400 p-0.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            {/* Thumbnail */}
                            <div className="relative aspect-square w-full rounded-lg bg-[#070c14] border border-[#1f2d42] overflow-hidden flex items-center justify-center">
                              {angle.url ? (
                                <img
                                  src={angle.url}
                                  alt={angle.label}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="text-center p-1">
                                  <Package className="w-5 h-5 text-gray-600 mx-auto mb-0.5" />
                                  <span className="text-[9px] text-gray-500 block">Chưa có ảnh</span>
                                </div>
                              )}

                              {/* Hover overlay upload */}
                              <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-semibold gap-1 z-10">
                                <Upload className="w-3.5 h-3.5 text-[#ffd700]" />
                                <span>{uploadingAngle === idx ? "Tải lên..." : "Tải ảnh từ máy"}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingAngle === idx}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUploadForAngle(idx, file);
                                  }}
                                />
                              </label>
                            </div>

                            {/* URL Input */}
                            <input
                              type="text"
                              value={angle.url}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAngleImages((prev) => {
                                  const next = [...prev];
                                  next[idx] = { ...next[idx], url: val };
                                  return next;
                                });
                              }}
                              placeholder="URL ảnh..."
                              className="w-full bg-[#070c14] border border-[#1f2d42] text-gray-300 text-[10px] px-1.5 py-1 rounded focus:outline-none font-mono truncate"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOX 5: PRODUCT TAGS (From screenshot 2) */}
                  <ProductTagsBox
                    tagsString={formData.tags}
                    onChange={(val) => setFormData({ ...formData, tags: val })}
                  />
                </div>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
