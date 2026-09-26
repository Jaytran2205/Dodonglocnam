"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Layers,
  Package,
  ExternalLink,
  Sparkles,
  Save,
  ArrowUp,
  ArrowDown,
  Upload,
  Search,
  CheckCircle2,
  Image as ImageIcon,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
  FolderTree,
  CornerDownRight,
} from "lucide-react";
import Link from "next/link";
import {
  DEFAULT_HIERARCHICAL_CATEGORIES,
  MainCategoryData,
  SubCategoryItem,
  DetailCategoryItem,
} from "@/lib/subcategories-data";
import { useToast } from "@/components/admin/AdminToast";

export default function AdminCategoriesPage() {
  const { toastSuccess, toastError, toastWarning, confirm: showConfirm } = useToast();
  // Navigation Tab
  const [activeTab, setActiveTab] = useState<"main" | "subcategories">("subcategories");

  // TAB 1: MAIN CATEGORIES STATE
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    order: 0,
  });
  const [savingMain, setSavingMain] = useState(false);

  // TAB 2: SUBCATEGORIES CATALOG STATE
  const [catalog, setCatalog] = useState<MainCategoryData[]>(DEFAULT_HIERARCHICAL_CATEGORIES);
  const [selectedMainSlug, setSelectedMainSlug] = useState<string>("tranh-dong");
  const [subSearch, setSubSearch] = useState<string>("");
  const [savingSub, setSavingSub] = useState(false);
  const [subSaveSuccess, setSubSaveSuccess] = useState(false);

  // Modal create new parent subcategory
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [uploadingSubImage, setUploadingSubImage] = useState(false);
  const [newSubData, setNewSubData] = useState({
    name: "",
    keyword: "",
    image: "/images/locnam_real/locnam_tranh_thuan_buom.jpg",
  });

  // Modal create new child (leaf) subcategory
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [targetParentSubId, setTargetParentSubId] = useState<string>("");
  const [targetParentSubName, setTargetParentSubName] = useState<string>("");
  const [uploadingChildImage, setUploadingChildImage] = useState(false);
  const [newChildData, setNewChildData] = useState({
    name: "",
    keyword: "",
    image: "/images/hero_golden_ship.jpg",
  });
  const [expandedSubIds, setExpandedSubIds] = useState<Record<string, boolean>>({});

  // Modal edit single subcategory
  const [editingSubIndex, setEditingSubIndex] = useState<number | null>(null);

  // Fetch Main Categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Subcategories Catalog
  const fetchSubcategories = async () => {
    try {
      const res = await fetch("/api/admin/subcategories");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setCatalog(data.data);
      }
    } catch (e) {
      console.error("Error fetching subcategories:", e);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Handlers for Main Categories
  const openCreate = () => {
    setEditingCat(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "/images/hero_golden_ship.jpg",
      order: categories.length + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image: cat.image || "/images/hero_golden_ship.jpg",
      order: cat.order || 0,
    });
    setModalOpen(true);
  };

  const handleSaveMain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toastWarning("Vui lòng nhập tên danh mục!", "Thiếu thông tin");

    setSavingMain(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: editingCat ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: editingCat?.id }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCategories();
        toastSuccess(editingCat ? `Đã cập nhật danh mục "${formData.name}"!` : `Đã tạo danh mục mới "${formData.name}"!`, "Thành công 🎉");
      } else {
        toastError(data.message || "Lỗi lưu danh mục", "Lỗi lưu");
      }
    } catch (e) {
      toastError("Lỗi kết nối máy chủ", "Lỗi mạng");
    } finally {
      setSavingMain(false);
    }
  };

  const handleDeleteMain = async (id: string, name: string) => {
    showConfirm({
      title: "Xác nhận xóa danh mục",
      message: `Bạn có chắc muốn xóa danh mục "${name}"? Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng.`,
      confirmText: "Xóa Danh Mục",
      cancelText: "Hủy Bỏ",
      type: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
          const data = await res.json();
          if (data.success) {
            fetchCategories();
            toastSuccess(`Đã xóa danh mục "${name}" thành công!`, "Đã xóa");
          } else {
            toastError(data.message || "Lỗi xóa danh mục", "Xóa thất bại");
          }
        } catch (e) {
          toastError("Lỗi kết nối máy chủ khi xóa", "Lỗi mạng");
        }
      },
    });
  };

  // Handlers for Subcategories (Tab 2)
  const currentCategoryData = useMemo(() => {
    return (
      catalog.find((c) => c.slug === selectedMainSlug) ||
      catalog[0] || { name: "", slug: "", subCategories: [] }
    );
  }, [catalog, selectedMainSlug]);

  const filteredSubCategories = useMemo(() => {
    if (!subSearch.trim()) return currentCategoryData.subCategories;
    const q = subSearch.toLowerCase().trim();
    return currentCategoryData.subCategories.filter((s) => {
      const matchParent = s.name.toLowerCase().includes(q) || s.keyword.toLowerCase().includes(q);
      const matchChild = s.children?.some(
        (c) => c.name.toLowerCase().includes(q) || c.keyword.toLowerCase().includes(q)
      );
      return matchParent || matchChild;
    });
  }, [currentCategoryData, subSearch]);

  const handleUpdateCategoryBanner = (newBannerUrl: string) => {
    setCatalog((prev) =>
      prev.map((cat) => {
        if (cat.slug !== selectedMainSlug) return cat;
        return { ...cat, banner: newBannerUrl };
      })
    );
  };

  const handleUploadBannerForCategory = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSubImage(true);
    const uploadForm = new FormData();
    uploadForm.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (data.success && data.url) {
        handleUpdateCategoryBanner(data.url);
        toastSuccess("Đã cập nhật ảnh banner danh mục!", "Tải ảnh thành công");
      } else {
        toastError(data.message || "Tải ảnh thất bại", "Lỗi tải ảnh");
      }
    } catch {
      toastError("Lỗi tải ảnh lên máy chủ", "Lỗi mạng");
    } finally {
      setUploadingSubImage(false);
      e.target.value = "";
    }
  };

  const handleUpdateSubField = (
    subId: string,
    field: "name" | "keyword" | "image",
    value: string
  ) => {
    setCatalog((prev) =>
      prev.map((cat) => {
        if (cat.slug !== selectedMainSlug) return cat;
        return {
          ...cat,
          subCategories: cat.subCategories.map((sub) =>
            sub.id === subId ? { ...sub, [field]: value } : sub
          ),
        };
      })
    );
  };

  const handleMoveSub = (subId: string, direction: "up" | "down") => {
    setCatalog((prev) =>
      prev.map((cat) => {
        if (cat.slug !== selectedMainSlug) return cat;
        const list = [...cat.subCategories];
        const idx = list.findIndex((s) => s.id === subId);
        if (idx === -1) return cat;
        if (direction === "up" && idx > 0) {
          const temp = list[idx - 1];
          list[idx - 1] = list[idx];
          list[idx] = temp;
        } else if (direction === "down" && idx < list.length - 1) {
          const temp = list[idx + 1];
          list[idx + 1] = list[idx];
          list[idx] = temp;
        }
        return { ...cat, subCategories: list };
      })
    );
  };

  const handleDeleteSub = (subId: string, subName: string) => {
    showConfirm({
      title: "Xác nhận xóa thẻ con",
      message: `Bạn có chắc muốn xóa thẻ nhánh con "${subName}" khỏi danh mục hiện tại?`,
      confirmText: "Xóa Thẻ Con",
      cancelText: "Hủy Bỏ",
      type: "danger",
      onConfirm: () => {
        setCatalog((prev) =>
          prev.map((cat) => {
            if (cat.slug !== selectedMainSlug) return cat;
            return {
              ...cat,
              subCategories: cat.subCategories.filter((s) => s.id !== subId),
            };
          })
        );
        toastSuccess(`Đã xóa thẻ con "${subName}"!`, "Đã xóa");
      },
    });
  };

  // --- CHILD CATEGORY HANDLERS (CẤP CON / CẤP CUỐI) ---
  const toggleExpandSub = (subId: string) => {
    setExpandedSubIds((prev) => ({
      ...prev,
      [subId]: prev[subId] === undefined ? false : !prev[subId],
    }));
  };

  const handleUpdateChildField = (
    subId: string,
    childId: string,
    field: "name" | "keyword" | "image",
    value: string
  ) => {
    setCatalog((prev) =>
      prev.map((cat) => {
        if (cat.slug !== selectedMainSlug) return cat;
        return {
          ...cat,
          subCategories: cat.subCategories.map((sub) => {
            if (sub.id !== subId) return sub;
            const updatedChildren = (sub.children || []).map((ch) =>
              ch.id === childId ? { ...ch, [field]: value } : ch
            );
            return { ...sub, children: updatedChildren };
          }),
        };
      })
    );
  };

  const handleMoveChild = (subId: string, childId: string, direction: "up" | "down") => {
    setCatalog((prev) =>
      prev.map((cat) => {
        if (cat.slug !== selectedMainSlug) return cat;
        return {
          ...cat,
          subCategories: cat.subCategories.map((sub) => {
            if (sub.id !== subId || !sub.children) return sub;
            const list = [...sub.children];
            const idx = list.findIndex((c) => c.id === childId);
            if (idx === -1) return sub;
            if (direction === "up" && idx > 0) {
              const temp = list[idx - 1];
              list[idx - 1] = list[idx];
              list[idx] = temp;
            } else if (direction === "down" && idx < list.length - 1) {
              const temp = list[idx + 1];
              list[idx + 1] = list[idx];
              list[idx] = temp;
            }
            return { ...sub, children: list };
          }),
        };
      })
    );
  };

  const handleDeleteChild = (subId: string, childId: string, childName: string) => {
    showConfirm({
      title: "Xác nhận xóa thẻ con cấp cuối",
      message: `Bạn có chắc muốn xóa thẻ con cấp cuối "${childName}"?`,
      confirmText: "Xóa Thẻ Con",
      cancelText: "Hủy Bỏ",
      type: "danger",
      onConfirm: () => {
        setCatalog((prev) =>
          prev.map((cat) => {
            if (cat.slug !== selectedMainSlug) return cat;
            return {
              ...cat,
              subCategories: cat.subCategories.map((sub) => {
                if (sub.id !== subId || !sub.children) return sub;
                return {
                  ...sub,
                  children: sub.children.filter((c) => c.id !== childId),
                };
              }),
            };
          })
        );
        toastSuccess(`Đã xóa thẻ con "${childName}"!`, "Đã xóa");
      },
    });
  };

  const handleOpenAddChildModal = (subId: string, subName: string) => {
    setTargetParentSubId(subId);
    setTargetParentSubName(subName);
    setNewChildData({
      name: "",
      keyword: "",
      image: "/images/hero_golden_ship.jpg",
    });
    setChildModalOpen(true);
  };

  const handleAddChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildData.name.trim()) {
      return toastWarning("Vui lòng nhập tên thẻ con cấp cuối!", "Thiếu thông tin");
    }

    const newId =
      "child-" +
      newChildData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-") +
      "-" +
      Date.now().toString().slice(-4);

    const newChild: DetailCategoryItem = {
      id: newId,
      name: newChildData.name.trim(),
      keyword: newChildData.keyword.trim() || newChildData.name.trim(),
      image: newChildData.image.trim() || "/images/hero_golden_ship.jpg",
    };

    setCatalog((prev) =>
      prev.map((cat) => {
        if (cat.slug !== selectedMainSlug) return cat;
        return {
          ...cat,
          subCategories: cat.subCategories.map((sub) => {
            if (sub.id !== targetParentSubId) return sub;
            return {
              ...sub,
              children: [...(sub.children || []), newChild],
            };
          }),
        };
      })
    );

    setChildModalOpen(false);
    toastSuccess(`Đã thêm thẻ con cấp cuối "${newChild.name}" thành công!`, "Thêm thẻ con");
  };

  const handleUploadImageForChild = async (
    e: React.ChangeEvent<HTMLInputElement>,
    subId: string,
    childId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingChildImage(true);
    const uploadForm = new FormData();
    uploadForm.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (childId) {
          handleUpdateChildField(subId, childId, "image", data.url);
        } else {
          setNewChildData((prev) => ({ ...prev, image: data.url }));
        }
        toastSuccess(`Đã tải ảnh "${file.name}" cho thẻ con thành công!`, "Tải ảnh");
      } else {
        toastError(data.message || "Tải ảnh thất bại", "Lỗi tải ảnh");
      }
    } catch {
      toastError("Lỗi tải ảnh lên máy chủ", "Lỗi mạng");
    } finally {
      setUploadingChildImage(false);
      e.target.value = "";
    }
  };

  const handleUploadImageForSub = async (
    e: React.ChangeEvent<HTMLInputElement>,
    subId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSubImage(true);
    const uploadForm = new FormData();
    uploadForm.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (subId) {
          handleUpdateSubField(subId, "image", data.url);
        } else {
          setNewSubData((prev) => ({ ...prev, image: data.url }));
        }
        toastSuccess(`Đã tải ảnh "${file.name}" lên thành công!`, "Tải ảnh");
      } else {
        toastError(data.message || "Tải ảnh thất bại", "Lỗi tải ảnh");
      }
    } catch (err) {
      toastError("Lỗi tải ảnh lên máy chủ", "Lỗi mạng");
    } finally {
      setUploadingSubImage(false);
      e.target.value = "";
    }
  };

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubData.name.trim()) {
      return toastWarning("Vui lòng nhập tên thẻ con!", "Thiếu thông tin");
    }

    const newId =
      "sub-" +
      newSubData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-") +
      "-" +
      Date.now().toString().slice(-4);

    const newItem: SubCategoryItem = {
      id: newId,
      name: newSubData.name.trim(),
      keyword: newSubData.keyword.trim() || newSubData.name.trim(),
      image: newSubData.image.trim() || "/images/hero_golden_ship.jpg",
    };

    setCatalog((prev) =>
      prev.map((cat) => {
        if (cat.slug !== selectedMainSlug) return cat;
        return {
          ...cat,
          subCategories: [...cat.subCategories, newItem],
        };
      })
    );

    setSubModalOpen(false);
    toastSuccess(`Đã thêm thẻ nhánh "${newItem.name}" thành công!`, "Thêm thẻ nhánh");
    setNewSubData({
      name: "",
      keyword: "",
      image: "/images/locnam_real/locnam_tranh_thuan_buom.jpg",
    });
  };

  const handleSaveAllSubcategories = async () => {
    setSavingSub(true);
    setSubSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalog }),
      });
      const data = await res.json();
      if (data.success) {
        setSubSaveSuccess(true);
        toastSuccess("Đã lưu toàn bộ cấu hình cây danh mục nhánh thành công!", "Cập nhật thành công 🎉");
        setTimeout(() => setSubSaveSuccess(false), 4000);
      } else {
        toastError(data.message || "Lỗi lưu cấu hình thẻ con", "Lỗi lưu");
      }
    } catch (e: any) {
      toastError("Lỗi kết nối khi lưu: " + e.message, "Lỗi mạng");
    } finally {
      setSavingSub(false);
    }
  };

  const handleResetToDefault = () => {
    showConfirm({
      title: "Xác nhận khôi phục mặc định",
      message: "Bạn có chắc muốn khôi phục toàn bộ danh sách thẻ con về mặc định ban đầu? Các thay đổi chưa lưu sẽ bị hủy.",
      confirmText: "Khôi Phục Mặc Định",
      cancelText: "Hủy Bỏ",
      type: "warning",
      onConfirm: () => {
        setCatalog(DEFAULT_HIERARCHICAL_CATEGORIES);
        toastSuccess("Đã khôi phục cây danh mục về cấu trúc mặc định Lộc Nam!", "Khôi phục thành công");
      },
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header with Title & Main Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2d42] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              TRUNG TÂM QUẢN TRỊ DANH MỤC & THẺ CON
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide mt-1">
            QUẢN LÝ DANH MỤC & THẺ SẢN PHẨM
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            Chỉnh sửa 100% hình ảnh, tên gọi, từ khóa tìm kiếm và thêm/xóa các thẻ con hiển thị trên website.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1.5 bg-[#0c1420] border border-[#d4af37]/30 rounded-2xl shadow-lg">
          <button
            onClick={() => setActiveTab("subcategories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "subcategories"
                ? "bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#070c14] shadow-md"
                : "text-[#cbd5e1] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Thẻ Nhóm Con (Sub-Categories)</span>
          </button>

          <button
            onClick={() => setActiveTab("main")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "main"
                ? "bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#070c14] shadow-md"
                : "text-[#cbd5e1] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Danh Mục Chính ({categories.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 2: QUẢN LÝ THẺ NHÓM CON (SUBCATEGORIES - THE CARDS USER POINTED TO)   */}
      {/* ========================================================================= */}
      {activeTab === "subcategories" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Category Pill Selector */}
          <div className="bg-[#0c1420] border border-[#1f2d42] p-3 sm:p-4 rounded-2xl shadow-xl">
            <div className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              <span>CHỌN DANH MỤC CHA ĐỂ QUẢN LÝ THẺ CON:</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {catalog.map((cat) => {
                const isSelected = selectedMainSlug === cat.slug;
                const count = cat.subCategories?.length || 0;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedMainSlug(cat.slug)}
                    className={`px-4 py-2.5 rounded-xl font-serif text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? "bg-[#dfb755] text-[#070c14] shadow-lg shadow-[#dfb755]/20 scale-105"
                        : "bg-[#111c2e] hover:bg-[#15243b] text-[#cbd5e1] border border-[#1f2d42]"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-black ${
                        isSelected
                          ? "bg-[#070c14] text-[#dfb755]"
                          : "bg-[#070c14]/60 text-[#94a3b8]"
                      }`}
                    >
                      {count} thẻ
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Banner Management Card */}
          <div className="bg-[#0c1420] border border-[#ffd700]/30 p-4 sm:p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2 text-[#ffd700]">
                <ImageIcon className="w-4 h-4" />
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider">
                  Banner Khổ Lớn Đầu Trang: {currentCategoryData.name}
                </h4>
              </div>
              <span className="text-[10px] text-[#94a3b8]">
                Hiển thị toàn màn hình ở đầu trang danh mục ngoài website
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-5">
                <div className="aspect-[24/8] max-h-36 rounded-xl overflow-hidden bg-[#111c2e] border border-[#1f2d42] relative flex items-center justify-center">
                  {currentCategoryData.banner ? (
                    <img
                      src={currentCategoryData.banner}
                      alt={`Banner ${currentCategoryData.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-[#64748b] text-xs">
                      <ImageIcon className="w-5 h-5" />
                      <span>Chưa có banner</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-7 space-y-2">
                <label className="block text-[#94a3b8] text-xs font-semibold">
                  Đường dẫn ảnh banner hoặc bấm tải lên từ máy tính:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentCategoryData.banner || ""}
                    onChange={(e) => handleUpdateCategoryBanner(e.target.value)}
                    placeholder="/images/trong-dong-viet-nam.jpg"
                    className="flex-1 px-3.5 py-2.5 bg-[#111c2e] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#ffd700] font-mono"
                  />
                  <label className="px-3.5 py-2.5 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                    {uploadingSubImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#ffd700]" />
                    )}
                    <span>Tải Lên</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadBannerForCategory}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-[#64748b]">
                  Khuyên dùng ảnh khổ ngang tỉ lệ 21:9 hoặc 24:8 để hiển thị bề thế nhất trên máy tính và điện thoại.
                </p>
              </div>
            </div>
          </div>

          {/* Action & Filter Bar for Subcategories */}
          <div className="bg-[#0c1420] border border-[#1f2d42] p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                placeholder={`Tìm trong ${currentCategoryData.name}...`}
                className="w-full bg-[#111c2e] border border-[#1f2d42] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#dfb755]"
              />
              {subSearch && (
                <button
                  onClick={() => setSubSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
              <button
                onClick={handleResetToDefault}
                className="px-3.5 py-2 bg-[#111c2e] hover:bg-[#15243b] text-[#94a3b8] hover:text-white border border-[#1f2d42] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Khôi phục thẻ mặc định của hệ thống"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục</span>
              </button>

              <button
                onClick={() => setSubModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#dfb755] to-[#b8860b] hover:brightness-110 text-[#070c14] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Thẻ Con Mới</span>
              </button>

              <button
                onClick={handleSaveAllSubcategories}
                disabled={savingSub}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {savingSub ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Lưu Tất Cả Thẻ Con</span>
              </button>
            </div>
          </div>

          {/* Success Toast */}
          {subSaveSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/60 p-3.5 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Đã lưu thành công danh mục thẻ con! Mọi thay đổi đã hiển thị trực tiếp lên website.
              </span>
            </div>
          )}

          {/* Subcategories Grid: Matches Exactly the Visual Appearance in the Screenshot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#94a3b8] px-1">
              <span>
                Đang hiển thị:{" "}
                <strong className="text-[#ffd700]">{filteredSubCategories.length} thẻ</strong> thuộc{" "}
                <strong className="text-white">{currentCategoryData.name}</strong>
              </span>
              <span className="text-[11px] hidden sm:inline">
                * Bạn có thể sửa trực tiếp Tên và Từ khóa ngay tại mỗi thẻ dưới đây, rồi bấm &quot;Lưu&quot;.
              </span>
            </div>

            {filteredSubCategories.length === 0 ? (
              <div className="text-center py-16 bg-[#0c1420] rounded-2xl border border-[#1f2d42] text-gray-400 space-y-2">
                <Package className="w-10 h-10 mx-auto text-gray-600" />
                <p className="text-sm font-semibold">Chưa có thẻ con nào hoặc không tìm thấy.</p>
                <button
                  onClick={() => setSubModalOpen(true)}
                  className="px-4 py-1.5 bg-[#dfb755] text-black font-bold text-xs rounded-lg"
                >
                  Thêm Thẻ Con Ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubCategories.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="bg-[#0c1420] border-2 border-[#1f2d42] hover:border-[#dfb755] rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between group relative"
                  >
                    {/* Upper Bar: Index, Move & Delete Controls */}
                    <div className="p-2.5 bg-[#111c2e] border-b border-[#1f2d42] flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-[#dfb755] font-bold bg-[#070c14] px-2 py-0.5 rounded border border-[#dfb755]/30">
                        #{idx + 1}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Move Left / Up */}
                        <button
                          onClick={() => handleMoveSub(sub.id, "up")}
                          disabled={idx === 0}
                          className="p-1 text-gray-400 hover:text-white hover:bg-[#1f2d42] rounded disabled:opacity-30"
                          title="Di chuyển lên trước"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        {/* Move Right / Down */}
                        <button
                          onClick={() => handleMoveSub(sub.id, "down")}
                          disabled={idx === filteredSubCategories.length - 1}
                          className="p-1 text-gray-400 hover:text-white hover:bg-[#1f2d42] rounded disabled:opacity-30"
                          title="Di chuyển xuống sau"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteSub(sub.id, sub.name)}
                          className="p-1 text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 rounded ml-1"
                          title="Xóa thẻ này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image Box */}
                    <div className="aspect-[4/3] bg-[#050c14] relative p-3 flex items-center justify-center overflow-hidden border-b border-[#1f2d42]">
                      <img
                        src={sub.image || "/images/hero_golden_ship.jpg"}
                        alt={sub.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Change Image Button Overlay */}
                      <label className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 hover:bg-[#dfb755] text-white hover:text-black rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-md border border-white/20">
                        <Upload className="w-3 h-3" />
                        <span>Đổi Ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadImageForSub(e, sub.id)}
                        />
                      </label>
                    </div>

                    {/* Lower Form Fields */}
                    <div className="bg-white p-4 space-y-3">
                      {/* Name Input */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#0c1825] uppercase mb-1">
                          Tên Thẻ Con (Hiển thị ngoài web):
                        </label>
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) =>
                            handleUpdateSubField(sub.id, "name", e.target.value)
                          }
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] focus:border-[#dfb755] text-[#0c1825] font-serif font-extrabold text-xs px-3 py-1.5 rounded-lg focus:outline-none uppercase"
                        />
                      </div>

                      {/* Keyword Input */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                          Từ Khóa Lọc Sản Phẩm (Keyword):
                        </label>
                        <input
                          type="text"
                          value={sub.keyword}
                          onChange={(e) =>
                            handleUpdateSubField(sub.id, "keyword", e.target.value)
                          }
                          placeholder="Ví dụ: bát mã, thuận buồm..."
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] focus:border-[#dfb755] text-[#334155] text-xs px-3 py-1.5 rounded-lg focus:outline-none"
                        />
                      </div>

                      {/* Image URL Input */}
                      <div>
                        <label className="block text-[10px] font-medium text-[#64748b] mb-1">
                          Đường dẫn ảnh (URL):
                        </label>
                        <input
                          type="text"
                          value={sub.image}
                          onChange={(e) =>
                            handleUpdateSubField(sub.id, "image", e.target.value)
                          }
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] text-[#64748b] text-[11px] px-2.5 py-1 rounded-lg focus:outline-none font-mono"
                        />
                      </div>

                      {/* Button Preview "XEM TẤT CẢ" */}
                      <div className="pt-1 flex items-center justify-center">
                        <span className="bg-[#f0ad1b] text-black font-black text-[10px] px-5 py-1.5 rounded-full uppercase tracking-wider shadow-sm select-none pointer-events-none">
                          XEM TẤT CẢ (DEMO)
                        </span>
                      </div>
                    </div>

                    {/* HIERARCHICAL CHILD CARDS: "THẺ CON CẤP CUỐI" */}
                    <div className="border-t-2 border-[#1f2d42] bg-[#070e17] p-3.5 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleExpandSub(sub.id)}
                            className="flex items-center gap-1.5 text-xs font-serif font-black uppercase text-[#ffd700] hover:text-white transition-colors"
                          >
                            <FolderTree className="w-3.5 h-3.5 text-[#ffd700]" />
                            <span>Thẻ Con Cấp Cuối ({sub.children?.length || 0})</span>
                            {expandedSubIds[sub.id] === false ? (
                              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            ) : (
                              <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </button>
                          {sub.children && sub.children.length > 0 && (
                            <span className="text-[9px] bg-[#ffd700]/15 text-[#ffd700] px-2 py-0.5 rounded-full font-bold border border-[#ffd700]/30 uppercase">
                              Lưới Cấp 2
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenAddChildModal(sub.id, sub.name)}
                          className="px-2.5 py-1 bg-[#1e2d42] hover:bg-[#ffd700] text-gray-200 hover:text-black rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border border-gray-700 shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Thêm Thẻ Con Cấp Cuối</span>
                        </button>
                      </div>

                      {/* Expanded Child List */}
                      {expandedSubIds[sub.id] !== false && (
                        <>
                          {sub.children && sub.children.length > 0 ? (
                            <div className="space-y-3 pt-1">
                              {sub.children.map((child, cIdx) => (
                                <div
                                  key={child.id}
                                  className="bg-[#0c1420] border border-[#2a3d58] hover:border-[#ffd700]/60 rounded-xl p-3 space-y-2.5 shadow-md transition-all relative group/child"
                                >
                                  {/* Child Upper Bar: Index & Move & Delete */}
                                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#1f2d42]">
                                    <div className="flex items-center gap-1.5">
                                      <CornerDownRight className="w-3 h-3 text-[#ffd700]" />
                                      <span className="font-mono text-[10px] font-bold text-[#ffd700] bg-[#111c2e] px-1.5 py-0.5 rounded border border-[#ffd700]/30">
                                        #{idx + 1}.{cIdx + 1}
                                      </span>
                                      <span className="text-[11px] font-bold text-white truncate max-w-[140px]">
                                        {child.name}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleMoveChild(sub.id, child.id, "up")}
                                        disabled={cIdx === 0}
                                        className="p-1 text-gray-400 hover:text-white hover:bg-[#1f2d42] rounded disabled:opacity-30"
                                        title="Di chuyển lên"
                                      >
                                        <ArrowUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleMoveChild(sub.id, child.id, "down")}
                                        disabled={cIdx === sub.children!.length - 1}
                                        className="p-1 text-gray-400 hover:text-white hover:bg-[#1f2d42] rounded disabled:opacity-30"
                                        title="Di chuyển xuống"
                                      >
                                        <ArrowDown className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteChild(sub.id, child.id, child.name)}
                                        className="p-1 text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 rounded ml-1"
                                        title="Xóa thẻ con này"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Child Image & Inputs Row */}
                                  <div className="grid grid-cols-12 gap-2.5 items-center">
                                    {/* Child Image Preview with Upload */}
                                    <div className="col-span-4 aspect-[4/3] rounded-lg overflow-hidden bg-[#050c14] border border-[#1f2d42] relative group/img flex items-center justify-center">
                                      <img
                                        src={child.image || "/images/hero_golden_ship.jpg"}
                                        alt={child.name}
                                        className="w-full h-full object-contain"
                                      />
                                      <label className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                                        <Upload className="w-4 h-4 text-[#ffd700] mb-0.5" />
                                        <span className="text-[9px] font-bold">Đổi ảnh</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => handleUploadImageForChild(e, sub.id, child.id)}
                                        />
                                      </label>
                                    </div>

                                    {/* Child Inputs */}
                                    <div className="col-span-8 space-y-1.5">
                                      <div>
                                        <label className="block text-[9px] font-bold text-gray-400 uppercase">
                                          Tên Thẻ Con Cấp Cuối:
                                        </label>
                                        <input
                                          type="text"
                                          value={child.name}
                                          onChange={(e) =>
                                            handleUpdateChildField(sub.id, child.id, "name", e.target.value)
                                          }
                                          className="w-full bg-[#111c2e] border border-[#2a3d58] focus:border-[#ffd700] text-white font-bold text-[11px] px-2 py-1 rounded focus:outline-none"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[9px] font-bold text-gray-400 uppercase">
                                          Từ Khóa Lọc (Keyword):
                                        </label>
                                        <input
                                          type="text"
                                          value={child.keyword}
                                          onChange={(e) =>
                                            handleUpdateChildField(sub.id, child.id, "keyword", e.target.value)
                                          }
                                          placeholder="Từ khóa..."
                                          className="w-full bg-[#111c2e] border border-[#2a3d58] focus:border-[#ffd700] text-gray-300 text-[10px] px-2 py-1 rounded focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Child Image URL Input */}
                                  <div>
                                    <input
                                      type="text"
                                      value={child.image}
                                      onChange={(e) =>
                                        handleUpdateChildField(sub.id, child.id, "image", e.target.value)
                                      }
                                      placeholder="/images/..."
                                      className="w-full bg-[#070c14] border border-[#1f2d42] text-[#94a3b8] text-[9px] px-2 py-0.5 rounded focus:outline-none font-mono"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-2.5 px-3 bg-[#0a121e] rounded-xl border border-dashed border-[#1f2d42] text-[10px] text-gray-400">
                              Đây là thẻ đơn trực tiếp. Bấm &quot;+ Thêm Thẻ Con Cấp Cuối&quot; để phân nhánh thẻ này.
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Bottom Save Bar */}
          <div className="sticky bottom-4 z-20 bg-[#0c1420]/95 backdrop-blur-xl border-2 border-[#dfb755]/50 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#cbd5e1] text-center sm:text-left">
              Đang chỉnh sửa danh mục:{" "}
              <strong className="text-[#ffd700]">{currentCategoryData.name}</strong>. Bấm nút bên
              phải để lưu toàn bộ thay đổi.
            </div>
            <button
              type="button"
              onClick={handleSaveAllSubcategories}
              disabled={savingSub}
              className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-[#dfb755] via-[#f5db8b] to-[#b8860b] text-[#070c14] font-serif font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_15px_rgba(223,183,85,0.4)] hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {savingSub ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>LƯU TẤT CẢ THẺ CON VÀO WEBSITE</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: DANH MỤC CHÍNH (MAIN CATEGORIES)                                    */}
      {/* ========================================================================= */}
      {activeTab === "main" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between bg-[#0c1420] border border-[#1f2d42] p-4 rounded-2xl">
            <div className="text-xs text-[#94a3b8]">
              Quản lý các nhóm danh mục chính cấp 1 (Menu và trang chủ).
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchCategories}
                className="p-2 bg-[#111c2e] hover:bg-[#152236] text-[#d4af37] border border-[#d4af37]/30 rounded-xl"
                title="Tải lại"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={openCreate}
                className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#e5b869] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Danh Mục Cha</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-8 h-8 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-gray-400">Đang tải danh mục...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 bg-[#0c1420] rounded-2xl border border-[#d4af37]/20 text-gray-400">
              <Layers className="w-12 h-12 mx-auto text-gray-600 mb-2" />
              <p className="text-sm">Chưa có danh mục nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const subCatItem = catalog.find((c) => c.slug === cat.slug);
                const subCount = subCatItem?.subCategories.length || 0;
                return (
                  <div
                    key={cat.id}
                    className="bg-[#0c1420] border border-[#d4af37]/25 hover:border-[#d4af37]/60 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[16/10] rounded-xl overflow-hidden bg-white/5 relative p-2 border border-[#1f2d42]">
                        <img
                          src={cat.image || "/images/hero_golden_ship.jpg"}
                          alt={cat.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#070c14]/90 text-[#d4af37] text-[10px] font-bold border border-[#d4af37]/40">
                          Thứ tự: {cat.order}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-base text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2">
                          {cat.description || "Danh mục đồ đồng cao cấp chế tác tại Ý Yên Nam Định"}
                        </p>
                      </div>

                      {/* Shortcut to manage subcategories */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMainSlug(cat.slug);
                          setActiveTab("subcategories");
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#111c2e] hover:bg-[#192b45] text-[#dfb755] border border-[#dfb755]/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Quản lý {subCount} thẻ con</span>
                      </button>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#1f2d42] flex items-center justify-between">
                      <Link
                        href={`/san-pham/${cat.slug}`}
                        target="_blank"
                        className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Xem Web</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-1.5 bg-[#152236] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#070c14] rounded-lg transition-colors"
                          title="Sửa danh mục"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMain(cat.id, cat.name)}
                          className="p-1.5 bg-rose-950/60 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-colors"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM THẺ CON MỚI (ADD SUBCATEGORY MODAL)                           */}
      {/* ========================================================================= */}
      {subModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0c1420] border-2 border-[#dfb755] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-[#111c2e] to-[#0c1420] border-b border-[#dfb755]/30 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-extrabold text-base text-[#dfb755] uppercase">
                  THÊM THẺ CON MỚI
                </h3>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  Thêm vào danh mục: <strong className="text-white">{currentCategoryData.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setSubModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#152236]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSub} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">
                  Tên Thẻ Con * (Ví dụ: Tranh Cá Chép Hoa Sen)
                </label>
                <input
                  type="text"
                  required
                  value={newSubData.name}
                  onChange={(e) => setNewSubData({ ...newSubData, name: e.target.value })}
                  placeholder="Nhập tên thẻ..."
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#dfb755] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">
                  Từ Khóa Tìm Kiếm (Dùng để lọc sản phẩm)
                </label>
                <input
                  type="text"
                  value={newSubData.keyword}
                  onChange={(e) => setNewSubData({ ...newSubData, keyword: e.target.value })}
                  placeholder="Ví dụ: cá chép, hoa sen"
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#dfb755] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">
                  Hình Ảnh Đại Diện Của Thẻ
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubData.image}
                    onChange={(e) => setNewSubData({ ...newSubData, image: e.target.value })}
                    placeholder="/images/... hoặc dán link ảnh"
                    className="flex-1 bg-[#111c2e] border border-[#1f2d42] focus:border-[#dfb755] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none font-mono"
                  />
                  <label className="px-3.5 py-2.5 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                    {uploadingSubImage ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>Tải Lên</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadImageForSub(e)}
                    />
                  </label>
                </div>
              </div>

              {/* Preview Image */}
              {newSubData.image && (
                <div className="space-y-1">
                  <span className="text-[10px] text-[#94a3b8]">Xem trước ảnh:</span>
                  <div className="w-24 h-20 bg-black/50 rounded-xl border border-[#1f2d42] overflow-hidden p-1 flex items-center justify-center">
                    <img
                      src={newSubData.image}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#1f2d42] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSubModalOpen(false)}
                  className="px-4 py-2 bg-[#152236] hover:bg-[#1c2c42] text-white rounded-xl text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
                >
                  Thêm Thẻ Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM THẺ CON CẤP CUỐI (ADD CHILD / LEAF SUBCATEGORY MODAL)         */}
      {/* ========================================================================= */}
      {childModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0c1420] border-2 border-[#ffd700] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-[#111c2e] to-[#0c1420] border-b border-[#ffd700]/30 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-extrabold text-base text-[#ffd700] uppercase">
                  THÊM THẺ CON CẤP CUỐI
                </h3>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  Thuộc nhánh: <strong className="text-white">{targetParentSubName}</strong> ({currentCategoryData.name})
                </p>
              </div>
              <button
                onClick={() => setChildModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#152236]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChildSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">
                  Tên Thẻ Con Cấp Cuối * (Ví dụ: Tượng Bác Võ Nguyên Giáp, Tượng Chuột, v.v.)
                </label>
                <input
                  type="text"
                  required
                  value={newChildData.name}
                  onChange={(e) => setNewChildData({ ...newChildData, name: e.target.value })}
                  placeholder="Nhập tên thẻ con..."
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#ffd700] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">
                  Từ Khóa Lọc Sản Phẩm (Keyword) *
                </label>
                <input
                  type="text"
                  required
                  value={newChildData.keyword}
                  onChange={(e) => setNewChildData({ ...newChildData, keyword: e.target.value })}
                  placeholder="Ví dụ: võ nguyên giáp, bác giáp..."
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#ffd700] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              {/* Child Image Preview & Upload */}
              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">
                  Ảnh Đại Diện Thẻ Con (4:3)
                </label>

                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#070c14] border border-[#1f2d42] relative flex items-center justify-center p-2">
                  <img
                    src={newChildData.image || "/images/hero_golden_ship.jpg"}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  {uploadingChildImage && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[#ffd700] text-xs font-bold gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tải ảnh lên...</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newChildData.image}
                    onChange={(e) => setNewChildData({ ...newChildData, image: e.target.value })}
                    placeholder="/images/..."
                    className="flex-1 bg-[#111c2e] border border-[#1f2d42] focus:border-[#ffd700] text-white text-[11px] px-3 py-2 rounded-xl focus:outline-none font-mono"
                  />
                  <label className="px-3.5 py-2 bg-[#1f2d42] hover:bg-[#ffd700] text-white hover:text-black rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadImageForChild(e, targetParentSubId)}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1f2d42] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setChildModalOpen(false)}
                  className="px-4 py-2 bg-[#152236] hover:bg-[#1c2c42] text-white font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#ffd700] to-[#e5b869] text-black font-extrabold uppercase rounded-xl shadow-lg hover:brightness-110 active:scale-95"
                >
                  Thêm Thẻ Con
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM / SỬA DANH MỤC CHÍNH                                          */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0c1420] border-2 border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-gradient-to-r from-[#111c2e] to-[#0c1420] border-b border-[#d4af37]/30 flex items-center justify-between">
              <h2 className="font-serif font-extrabold text-lg text-[#d4af37] uppercase tracking-wide">
                {editingCat ? "CHỈNH SỬA DANH MỤC CHA" : "THÊM DANH MỤC CHA MỚI"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#152236] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMain} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">Tên Danh Mục *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Đồ Thờ Cúng Bằng Đồng"
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">Đường Dẫn Ảnh Đại Diện</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/hero_golden_ship.jpg"
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">Mô Tả Danh Mục</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả tóm tắt chuẩn SEO..."
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">Thứ Tự Hiển Thị (Số)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#1f2d42] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-[#152236] hover:bg-[#1c2c42] text-white font-bold text-xs uppercase rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingMain}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5b869] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {savingMain ? "Đang lưu..." : "Lưu Danh Mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
