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
  ChevronDown
} from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [angleImages, setAngleImages] = useState<{ id: string; label: string; url: string }[]>([]);
  const [uploadingAngle, setUploadingAngle] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    material: "",
    dimensions: "",
    weight: "",
    shortDescription: "",
    description: "",
    images: "",
    isFeatured: true,
    inStock: true
  });
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);

      const catRes = await fetch("/api/admin/categories");
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.categories);
        if (!formData.categoryId && catData.categories.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: catData.categories[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      categoryId: categories[0]?.id || "",
      material: "Đồng đỏ thanh khiết mạ vàng 24K",
      dimensions: "Kích thước theo thước Lỗ Ban",
      weight: "5kg",
      shortDescription: "",
      description: "",
      images: "/images/hero_golden_ship.jpg",
      isFeatured: true,
      inStock: true
    });
    setAngleImages([
      { id: "1", label: "Ảnh chính / Mặt trước", url: "/images/hero_golden_ship.jpg" },
      { id: "2", label: "Góc nghiêng 45°", url: "" },
      { id: "3", label: "Cận cảnh chi tiết hoa văn", url: "" },
      { id: "4", label: "Mặt sau & Chân đế", url: "" },
    ]);
    setModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    let parsedImgs: string[] = [];
    try {
      const parsed = JSON.parse(prod.images);
      parsedImgs = Array.isArray(parsed) ? parsed : [prod.images];
    } catch {
      parsedImgs = prod.images ? prod.images.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
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

    setFormData({
      name: prod.name || "",
      price: prod.price ? String(prod.price) : "",
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : "",
      categoryId: prod.categoryId || categories[0]?.id || "",
      material: prod.material || "",
      dimensions: prod.dimensions || "",
      weight: prod.weight || "",
      shortDescription: prod.shortDescription || "",
      description: prod.description || "",
      images: parsedImgs.join(", "),
      isFeatured: Boolean(prod.isFeatured),
      inStock: Boolean(prod.inStock)
    });
    setModalOpen(true);
  };

  const handleFileUploadForAngle = async (index: number, file: File) => {
    setUploadingAngle(index);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success && result.url) {
        setAngleImages((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], url: result.url };
          return next;
        });
      } else {
        alert(result.message || "Lỗi tải ảnh lên");
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên máy chủ");
    } finally {
      setUploadingAngle(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert("Vui lòng nhập tên sản phẩm");

    setSaving(true);
    try {
      // Collect valid non-empty URLs from angleImages
      const validUrls = angleImages.map((a) => a.url.trim()).filter(Boolean);
      const imageList = validUrls.length > 0 ? validUrls : ["/images/hero_golden_ship.jpg"];

      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        images: JSON.stringify(imageList),
        id: editingProduct?.id
      };

      const res = await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setModalOpen(false);
        fetchProducts();
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
        fetchProducts();
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
        body: JSON.stringify({ id: prod.id, inStock: !prod.inStock })
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
        body: JSON.stringify({ id: prod.id, isFeatured: !prod.isFeatured })
      });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q))
      );
    }

    if (selectedCat !== "ALL") {
      list = list.filter((p) => p.categoryId === selectedCat || p.category?.slug === selectedCat);
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
  }, [products, search, selectedCat, stockFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              KHO SẢN PHẨM LỘC NAM
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide mt-1">
            QUẢN LÝ SẢN PHẨM ({products.length} MẶT HÀNG)
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Danh mục sản phẩm đồng đúc thủ công đã được làm sạch, đồng bộ ảnh đại diện chính diện
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
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
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên sản phẩm, chất liệu, kích thước..."
              className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none transition-all placeholder:text-gray-500"
            />
          </div>

          {/* Category Selector */}
          <div className="lg:col-span-3">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất Cả Danh Mục ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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
              <option value="ALL">Tất Cả Tình Trạng</option>
              <option value="IN_STOCK">Còn Hàng</option>
              <option value="OUT_OF_STOCK">Hết Hàng</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="newest">Mới Nhất</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="name-asc">Tên: A → Z</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        <div className="flex items-center justify-between text-xs text-[#94a3b8] pt-1 border-t border-[#1f2d42]">
          <span>
            Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} sản phẩm
          </span>
          {(search || selectedCat !== "ALL" || stockFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCat("ALL");
                setStockFilter("ALL");
              }}
              className="text-[#d4af37] hover:underline font-semibold"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-400">Đang tải danh sách sản phẩm...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-3 text-gray-400">
            <Package className="w-12 h-12 mx-auto text-gray-600" />
            <p className="text-sm">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111c2e] text-[#d4af37] uppercase font-serif tracking-wider text-[11px] border-b border-[#1f2d42]">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">Ảnh</th>
                  <th className="py-3.5 px-4">Tên Sản Phẩm</th>
                  <th className="py-3.5 px-4">Danh Mục</th>
                  <th className="py-3.5 px-4">Giá Bán</th>
                  <th className="py-3.5 px-4 text-center">Tồn Kho</th>
                  <th className="py-3.5 px-4 text-center">Nổi Bật</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d42]/60">
                {filteredProducts.map((prod) => {
                  let imgList: string[] = [];
                  try {
                    imgList = JSON.parse(prod.images);
                  } catch {
                    imgList = [prod.images || "/images/hero_golden_ship.jpg"];
                  }
                  const thumb = imgList[0] || "/images/hero_golden_ship.jpg";

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-[#111c2e]/60 transition-colors group"
                    >
                      {/* Thumbnail with zoom */}
                      <td className="py-3 px-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-[#1f2d42] overflow-hidden relative mx-auto p-1">
                          <img
                            src={thumb}
                            alt={prod.name}
                            className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-300"
                          />
                        </div>
                      </td>

                      {/* Product Name & Specs */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-serif font-semibold text-white group-hover:text-[#d4af37] transition-colors leading-snug line-clamp-2">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-[#94a3b8] mt-1 flex items-center gap-2">
                          {prod.dimensions && <span>KT: {prod.dimensions}</span>}
                          {prod.material && <span>• {prod.material}</span>}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-[#152236] border border-[#d4af37]/25 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">
                          {prod.category?.name || "Chưa gán"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-sm text-[#d4af37]">
                          {prod.price ? `${prod.price.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                        </div>
                        {prod.originalPrice && prod.originalPrice > (prod.price || 0) && (
                          <div className="text-[10px] text-gray-500 line-through">
                            {prod.originalPrice.toLocaleString("vi-VN")} đ
                          </div>
                        )}
                      </td>

                      {/* Stock Switch */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStock(prod)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1 ${
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

                      {/* Featured Switch */}
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

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/san-pham/${prod.category?.slug || "qua-tang-dong"}/${prod.slug}`}
                            target="_blank"
                            title="Xem trang sản phẩm"
                            className="p-1.5 rounded-lg bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => openEditModal(prod)}
                            title="Chỉnh sửa"
                            className="p-1.5 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#070c14] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            title="Xóa"
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

      {/* CREATE / EDIT PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0c1420] border-2 border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#111c2e] to-[#0c1420] border-b border-[#d4af37]/30 flex items-center justify-between">
              <div>
                <h2 className="font-serif font-extrabold text-lg text-[#d4af37] uppercase tracking-wide">
                  {editingProduct ? "CHỈNH SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
                </h2>
                <p className="text-xs text-gray-400">
                  Cập nhật thông tin, kích thước Lỗ Ban và hình ảnh chi tiết
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#152236] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-white block uppercase">
                    Tên Sản Phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Tượng Ngựa Phong Vân Dát Vàng 24K"
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block uppercase">
                    Danh Mục *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block uppercase">
                    Chất Liệu
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Ví dụ: Đồng đỏ nguyên chất mạ vàng 24K"
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block uppercase">
                    Giá Bán (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Để trống nếu là giá Liên hệ"
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block uppercase">
                    Giá Gốc / Giá Niêm Yết (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="Giá trước giảm"
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                {/* Dimensions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block uppercase">
                    Kích Thước Phong Thủy
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="Ví dụ: Cao 60cm, Rộng 38cm"
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block uppercase">
                    Khối Lượng / Cân Nặng
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Ví dụ: 12kg"
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                {/* Multi-Angle Image Upload Manager */}
                <div className="sm:col-span-2 space-y-3 bg-[#0a121e] p-4 rounded-2xl border border-[#1e2d42]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2d42] pb-3">
                    <div>
                      <label className="text-xs font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>Các Góc Chụp Của Sản Phẩm (Đa Góc Nhìn)</span>
                      </label>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Tải ảnh từ máy tính hoặc nhập URL. Khách hàng có thể bấm vào các chấm tròn trên thẻ để xem từng góc cạnh.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setAngleImages((prev) => [
                          ...prev,
                          { id: String(Date.now()), label: `Góc chụp ${prev.length + 1}`, url: "" },
                        ])
                      }
                      className="px-3 py-1.5 bg-[#142339] hover:bg-[#1d3251] text-xs font-semibold text-[#ffd700] rounded-xl border border-[#263e60] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Góc Chụp</span>
                    </button>
                  </div>

                  {/* Grid of Angle Slots */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                    {angleImages.map((angle, idx) => (
                      <div
                        key={angle.id || idx}
                        className="bg-[#111c2e] p-2.5 rounded-xl border border-[#1f2d42] flex flex-col justify-between space-y-2 relative group/slot hover:border-[#d4af37]/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="text"
                            value={angle.label}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAngleImages((prev) => {
                                const next = [...prev];
                                next[idx] = { ...next[idx], label: val };
                                return next;
                              });
                            }}
                            placeholder="Tên góc chụp"
                            className="text-[11px] font-bold text-gray-200 bg-transparent border-b border-transparent focus:border-[#d4af37] focus:outline-none w-full"
                          />
                          {idx >= 4 && (
                            <button
                              type="button"
                              onClick={() =>
                                setAngleImages((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="text-gray-500 hover:text-red-400 p-0.5"
                              title="Xóa góc này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Thumbnail Preview Area */}
                        <div className="relative aspect-square w-full rounded-lg bg-[#070c14] border border-[#1f2d42] overflow-hidden flex items-center justify-center">
                          {angle.url ? (
                            <img
                              src={angle.url}
                              alt={angle.label}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="text-center p-2">
                              <Package className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                              <span className="text-[10px] text-gray-500 block">Chưa có ảnh</span>
                            </div>
                          )}

                          {/* Overlay Upload Button on Hover */}
                          <label className="absolute inset-0 bg-black/70 opacity-0 group-hover/slot:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[11px] font-semibold gap-1 z-10">
                            <Upload className="w-4 h-4 text-[#ffd700]" />
                            <span>{uploadingAngle === idx ? "Đang tải lên..." : "Tải ảnh từ máy"}</span>
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

                        {/* Input URL & Action Footer */}
                        <div className="space-y-1.5">
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
                            placeholder="URL ảnh hoặc upload tệp..."
                            className="w-full bg-[#070c14] border border-[#1f2d42] focus:border-[#d4af37] text-gray-300 text-[10px] px-2 py-1.5 rounded-lg focus:outline-none truncate font-mono"
                          />
                          <div className="flex items-center justify-between pt-0.5">
                            <label className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 cursor-pointer font-semibold">
                              <Upload className="w-3 h-3" />
                              <span>{uploadingAngle === idx ? "Đang tải..." : "Tải tệp"}</span>
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
                            {angle.url && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAngleImages((prev) => {
                                    const next = [...prev];
                                    next[idx] = { ...next[idx], url: "" };
                                    return next;
                                  });
                                }}
                                className="text-[10px] text-gray-400 hover:text-red-400 font-medium"
                              >
                                Xóa ảnh
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Short Description */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-white block uppercase">
                    Mô Tả Ngắn Tóm Tắt
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Tóm tắt ngắn gọn hiển thị dưới giá bán..."
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Full Description */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-white block uppercase">
                    Ý Nghĩa Phong Thủy & Quy Trình Chế Tác
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả nguồn phôi đồng, ý nghĩa phong thủy và cam kết bảo hành trọn đời..."
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Switches: InStock & IsFeatured */}
                <div className="flex items-center gap-3 p-3 bg-[#111c2e] rounded-xl border border-[#1f2d42]">
                  <input
                    type="checkbox"
                    id="inStockCheck"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 text-[#d4af37] rounded focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="inStockCheck" className="text-xs font-bold text-white cursor-pointer">
                    Còn Hàng Trong Kho
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#111c2e] rounded-xl border border-[#1f2d42]">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#d4af37] rounded focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="featuredCheck" className="text-xs font-bold text-amber-300 cursor-pointer flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Hiển Thị Sản Phẩm Nổi Bật</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="pt-4 border-t border-[#1f2d42] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 hover:text-white rounded-xl text-xs font-semibold uppercase"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5b869] hover:from-[#b89628] hover:to-[#d4af37] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? "ĐANG LƯU..." : editingProduct ? "LƯU THAY ĐỔI" : "TẠO SẢN PHẨM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
