"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  FolderTree,
  Search,
  Plus,
  Check,
  Tag,
  Sparkles,
  Layers,
  X,
  Loader2,
  CheckCircle2,
  Star,
} from "lucide-react";
import { MainCategoryData, SubCategoryItem, DetailCategoryItem } from "@/lib/subcategories-data";
import { useToast } from "@/components/admin/AdminToast";

export interface SelectedCategoryItem {
  id: string; // db category id or subcategory id
  type: "main" | "sub" | "detail";
  name: string;
  pathText: string;
  mainSlug: string;
  subId?: string;
  dbCategoryId?: string;
  keyword?: string;
}

export interface HierarchicalCategorySelectorProps {
  categories: any[]; // DB categories: { id, name, slug }
  catalog: MainCategoryData[]; // Hierarchical catalog
  selectedCategoryId: string;
  selectedSubCategoryId?: string;
  selectedCategoryIds?: string[] | string;
  selectedSubCategoryIds?: string[] | string;
  onSelectCategory?: (categoryId: string, subCategoryId: string, pathText: string, tagsToAppend?: string) => void;
  onChangeMultiSelection?: (data: {
    primaryCategoryId: string;
    primarySubCategoryId: string;
    categoryIds: string[];
    subCategoryIds: string[];
    selectedItems: SelectedCategoryItem[];
    pathSummary: string;
    tagsToAppend: string;
  }) => void;
  onRefreshCatalog?: () => void;
  title?: string;
}

// Helper to safely parse array or JSON string
function parseIds(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function HierarchicalCategorySelector({
  categories,
  catalog,
  selectedCategoryId,
  selectedSubCategoryId = "",
  selectedCategoryIds,
  selectedSubCategoryIds,
  onSelectCategory,
  onChangeMultiSelection,
  onRefreshCatalog,
  title = "Danh mục sản phẩm",
}: HierarchicalCategorySelectorProps) {
  const { toastSuccess, toastError, toastWarning } = useToast();
  const [activeTab, setActiveTab] = useState<"all" | "popular">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    "do-tho-cung": true,
    "tuong-dong": true,
    "tranh-dong": true,
    "trong-dong": true,
    "qua-tang": true,
  });

  // State for inline "+ Thêm danh mục mới"
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [parentCatSlug, setParentCatSlug] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Internal multi-selection state (supports both multi props & initial single props)
  const [selectedMainCatIds, setSelectedMainCatIds] = useState<string[]>(() => {
    const list = parseIds(selectedCategoryIds);
    if (list.length > 0) return list;
    return selectedCategoryId ? [selectedCategoryId] : [];
  });

  const [selectedSubIds, setSelectedSubIds] = useState<string[]>(() => {
    const list = parseIds(selectedSubCategoryIds);
    if (list.length > 0) return list;
    return selectedSubCategoryId ? [selectedSubCategoryId] : [];
  });

  const [primaryCatId, setPrimaryCatId] = useState<string>(selectedCategoryId || "");
  const [primarySubId, setPrimarySubId] = useState<string>(selectedSubCategoryId || "");

  // Sync external changes when props change from outside (e.g. edit different product)
  useEffect(() => {
    const incomingCatIds = parseIds(selectedCategoryIds);
    if (incomingCatIds.length > 0) {
      setSelectedMainCatIds(incomingCatIds);
    } else if (selectedCategoryId) {
      setSelectedMainCatIds((prev) => (prev.includes(selectedCategoryId) ? prev : [selectedCategoryId, ...prev]));
    }

    const incomingSubIds = parseIds(selectedSubCategoryIds);
    if (incomingSubIds.length > 0) {
      setSelectedSubIds(incomingSubIds);
    } else if (selectedSubCategoryId) {
      setSelectedSubIds((prev) => (prev.includes(selectedSubCategoryId) ? prev : [selectedSubCategoryId, ...prev]));
    }

    if (selectedCategoryId) setPrimaryCatId(selectedCategoryId);
    if (selectedSubCategoryId) setPrimarySubId(selectedSubCategoryId);
  }, [selectedCategoryId, selectedSubCategoryId, selectedCategoryIds, selectedSubCategoryIds]);

  // Toggle category collapse
  const toggleExpand = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Find DB category by slug
  const getDbCatBySlug = (slug: string) => {
    return categories.find(
      (c) => c.slug === slug || (slug === "qua-tang" && c.slug === "qua-tang-dong")
    );
  };

  // Find catalog item by DB category ID
  const getCatalogByDbId = (dbId: string) => {
    const dbCat = categories.find((c) => c.id === dbId);
    if (!dbCat) return null;
    return (
      catalog.find(
        (main) =>
          main.slug === dbCat.slug || (main.aliases && main.aliases.includes(dbCat.slug))
      ) || null
    );
  };

  // Compute selected items list for badges and callbacks
  const selectedItems = useMemo<SelectedCategoryItem[]>(() => {
    const items: SelectedCategoryItem[] = [];

    // 1. Main categories
    for (const catId of selectedMainCatIds) {
      const dbCat = categories.find((c) => c.id === catId);
      if (dbCat) {
        items.push({
          id: dbCat.id,
          type: "main",
          name: dbCat.name,
          pathText: dbCat.name,
          mainSlug: dbCat.slug,
          dbCategoryId: dbCat.id,
          keyword: dbCat.name,
        });
      }
    }

    // 2. Subcategories & Detail categories
    for (const subId of selectedSubIds) {
      let found = false;
      for (const main of catalog) {
        const dbCat = getDbCatBySlug(main.slug);
        for (const sub of main.subCategories || []) {
          if (sub.id === subId) {
            items.push({
              id: sub.id,
              type: "sub",
              name: sub.name,
              pathText: `${main.name} › ${sub.name}`,
              mainSlug: main.slug,
              subId: sub.id,
              dbCategoryId: dbCat?.id,
              keyword: `${sub.name}, ${sub.keyword || ""}`,
            });
            found = true;
            break;
          }
          if (sub.children) {
            const detail = sub.children.find((ch) => ch.id === subId);
            if (detail) {
              items.push({
                id: detail.id,
                type: "detail",
                name: detail.name,
                pathText: `${main.name} › ${sub.name} › ${detail.name}`,
                mainSlug: main.slug,
                subId: detail.id,
                dbCategoryId: dbCat?.id,
                keyword: `${detail.name}, ${sub.name}, ${detail.keyword || ""}`,
              });
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }
    }

    return items;
  }, [selectedMainCatIds, selectedSubIds, categories, catalog]);

  // Dispatch selection changes to parent
  const notifyChanges = (
    nextMainIds: string[],
    nextSubIds: string[],
    nextPrimaryCatId: string,
    nextPrimarySubId: string
  ) => {
    // Generate readable path summary
    const allNames: string[] = [];
    const allTags: string[] = [];

    for (const catId of nextMainIds) {
      const dbCat = categories.find((c) => c.id === catId);
      if (dbCat) {
        allNames.push(dbCat.name);
        allTags.push(dbCat.name);
      }
    }

    for (const subId of nextSubIds) {
      for (const main of catalog) {
        for (const sub of main.subCategories || []) {
          if (sub.id === subId) {
            allNames.push(sub.name);
            allTags.push(sub.name);
            if (sub.keyword) allTags.push(sub.keyword);
          }
          if (sub.children) {
            const detail = sub.children.find((ch) => ch.id === subId);
            if (detail) {
              allNames.push(detail.name);
              allTags.push(detail.name);
              if (detail.keyword) allTags.push(detail.keyword);
            }
          }
        }
      }
    }

    const uniqueNames = Array.from(new Set(allNames));
    const pathSummary = uniqueNames.join(", ");
    const tagsToAppend = Array.from(new Set(allTags.join(",").split(",").map((s) => s.trim()).filter(Boolean))).join(", ");

    const finalPrimaryCat = nextPrimaryCatId || nextMainIds[0] || "";
    const finalPrimarySub = nextPrimarySubId || nextSubIds[0] || "";

    if (onChangeMultiSelection) {
      onChangeMultiSelection({
        primaryCategoryId: finalPrimaryCat,
        primarySubCategoryId: finalPrimarySub,
        categoryIds: nextMainIds,
        subCategoryIds: nextSubIds,
        selectedItems,
        pathSummary,
        tagsToAppend,
      });
    }

    if (onSelectCategory) {
      onSelectCategory(finalPrimaryCat, finalPrimarySub, pathSummary, tagsToAppend);
    }
  };

  // Toggle Main Category checkbox
  const handleToggleMain = (mainSlug: string, mainName: string) => {
    const dbCat = getDbCatBySlug(mainSlug);
    if (!dbCat) return;

    let nextMainIds: string[];
    const isCurrentlyChecked = selectedMainCatIds.includes(dbCat.id);

    if (isCurrentlyChecked) {
      nextMainIds = selectedMainCatIds.filter((id) => id !== dbCat.id);
    } else {
      nextMainIds = [...selectedMainCatIds, dbCat.id];
    }

    let nextPrimaryCat = primaryCatId;
    if (!nextMainIds.includes(nextPrimaryCat)) {
      nextPrimaryCat = nextMainIds[0] || "";
    }
    if (!nextPrimaryCat && nextMainIds.length > 0) {
      nextPrimaryCat = nextMainIds[0];
    }

    setSelectedMainCatIds(nextMainIds);
    setPrimaryCatId(nextPrimaryCat);
    notifyChanges(nextMainIds, selectedSubIds, nextPrimaryCat, primarySubId);
  };

  // Toggle Subcategory checkbox (independent of main category)
  const handleToggleSub = (mainSlug: string, sub: SubCategoryItem) => {
    const dbCat = getDbCatBySlug(mainSlug);
    let nextSubIds: string[];
    let nextMainIds = [...selectedMainCatIds];

    const isCurrentlyChecked = selectedSubIds.includes(sub.id);

    if (isCurrentlyChecked) {
      nextSubIds = selectedSubIds.filter((id) => id !== sub.id);
    } else {
      nextSubIds = [...selectedSubIds, sub.id];
      // Automatically ensure parent category is also included in categoryIds
      if (dbCat && !nextMainIds.includes(dbCat.id)) {
        nextMainIds.push(dbCat.id);
      }
    }

    let nextPrimarySub = primarySubId;
    if (!nextSubIds.includes(nextPrimarySub)) {
      nextPrimarySub = nextSubIds[0] || "";
    }

    let nextPrimaryCat = primaryCatId || (dbCat ? dbCat.id : nextMainIds[0] || "");

    setSelectedSubIds(nextSubIds);
    setSelectedMainCatIds(nextMainIds);
    setPrimarySubId(nextPrimarySub);
    setPrimaryCatId(nextPrimaryCat);
    notifyChanges(nextMainIds, nextSubIds, nextPrimaryCat, nextPrimarySub);
  };

  // Toggle Detail Category checkbox
  const handleToggleDetail = (
    mainSlug: string,
    sub: SubCategoryItem,
    detail: DetailCategoryItem
  ) => {
    const dbCat = getDbCatBySlug(mainSlug);
    let nextSubIds: string[];
    let nextMainIds = [...selectedMainCatIds];

    const isCurrentlyChecked = selectedSubIds.includes(detail.id);

    if (isCurrentlyChecked) {
      nextSubIds = selectedSubIds.filter((id) => id !== detail.id);
    } else {
      nextSubIds = [...selectedSubIds, detail.id];
      if (dbCat && !nextMainIds.includes(dbCat.id)) {
        nextMainIds.push(dbCat.id);
      }
    }

    let nextPrimarySub = primarySubId;
    if (!nextSubIds.includes(nextPrimarySub)) {
      nextPrimarySub = nextSubIds[0] || "";
    }

    let nextPrimaryCat = primaryCatId || (dbCat ? dbCat.id : nextMainIds[0] || "");

    setSelectedSubIds(nextSubIds);
    setSelectedMainCatIds(nextMainIds);
    setPrimarySubId(nextPrimarySub);
    setPrimaryCatId(nextPrimaryCat);
    notifyChanges(nextMainIds, nextSubIds, nextPrimaryCat, nextPrimarySub);
  };

  // Remove a specific selected item
  const handleRemoveItem = (item: SelectedCategoryItem) => {
    if (item.type === "main") {
      const nextMain = selectedMainCatIds.filter((id) => id !== item.id);
      const nextPrimary = primaryCatId === item.id ? nextMain[0] || "" : primaryCatId;
      setSelectedMainCatIds(nextMain);
      setPrimaryCatId(nextPrimary);
      notifyChanges(nextMain, selectedSubIds, nextPrimary, primarySubId);
    } else {
      const nextSub = selectedSubIds.filter((id) => id !== item.id);
      const nextPrimary = primarySubId === item.id ? nextSub[0] || "" : primarySubId;
      setSelectedSubIds(nextSub);
      setPrimarySubId(nextPrimary);
      notifyChanges(selectedMainCatIds, nextSub, primaryCatId, nextPrimary);
    }
  };

  // Make an item primary category
  const handleSetPrimary = (item: SelectedCategoryItem) => {
    if (item.dbCategoryId) {
      setPrimaryCatId(item.dbCategoryId);
      if (item.subId) setPrimarySubId(item.subId);
      notifyChanges(selectedMainCatIds, selectedSubIds, item.dbCategoryId, item.subId || primarySubId);
    }
  };

  // Filtered categories based on search
  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return catalog;
    const q = searchQuery.toLowerCase().trim();

    return catalog
      .map((main) => {
        const mainMatches = main.name.toLowerCase().includes(q);
        const matchedSubs = (main.subCategories || []).filter((sub) => {
          const subMatches =
            sub.name.toLowerCase().includes(q) ||
            (sub.keyword && sub.keyword.toLowerCase().includes(q));
          const childMatches =
            sub.children &&
            sub.children.some(
              (ch) =>
                ch.name.toLowerCase().includes(q) ||
                (ch.keyword && ch.keyword.toLowerCase().includes(q))
            );
          return subMatches || childMatches;
        });

        if (mainMatches || matchedSubs.length > 0) {
          return {
            ...main,
            subCategories: mainMatches ? main.subCategories : matchedSubs,
          };
        }
        return null;
      })
      .filter(Boolean) as MainCategoryData[];
  }, [catalog, searchQuery]);

  // Top popular categories for "Dùng nhiều nhất"
  const popularList = useMemo(() => {
    return [
      { mainSlug: "do-tho-cung", subId: "bo-tam-su-ngu-su", label: "Bộ tam sự, ngũ sự bằng đồng" },
      { mainSlug: "do-tho-cung", subId: "den-tho", label: "Đèn thờ bằng đồng" },
      { mainSlug: "do-tho-cung", subId: "chan-nen", label: "Chân nến bằng đồng" },
      { mainSlug: "do-tho-cung", subId: "bo-suu-tap-do-tho", label: "Bộ đồ thờ cúng đầy đủ" },
      { mainSlug: "do-tho-cung", subId: "bat-huong", label: "Bát hương đồng gia tiên" },
      { mainSlug: "do-tho-cung", subId: "chuong-chieng-dong", label: "Chuông - Chiêng đồng" },
      { mainSlug: "trong-dong", subId: "qua-trong-dong-co-lon", label: "Quả trống đồng Đông Sơn" },
      { mainSlug: "trong-dong", subId: "mat-trong-dong", label: "Mặt trống đồng treo tường" },
      { mainSlug: "tranh-dong", subId: "tranh-thuan-buom", label: "Tranh Thuận Buồm Xuôi Gió" },
      { mainSlug: "tranh-dong", subId: "tranh-bat-ma", label: "Tranh Bát Mã - Mã Đáo Thành Công" },
      { mainSlug: "tranh-dong", subId: "tranh-vinh-quy", label: "Tranh Vinh Quy Bái Tổ" },
      { mainSlug: "tuong-dong", subId: "tuong-truyen-than", label: "Tượng chân dung truyền thần" },
      { mainSlug: "tuong-dong", subId: "tuong-phat", label: "Tượng Phật (Thích Ca, Quan Âm)" },
      { mainSlug: "tuong-dong", subId: "tuong-tran-hung-dao", label: "Tượng Trần Hưng Đạo" },
      { mainSlug: "tuong-dong", subId: "tuong-12-con-giap", label: "Tượng Linh vật 12 con giáp" },
      { mainSlug: "qua-tang", subId: "thuyen-buom-phong-thuy", label: "Thuyền buồm phong thủy mạ vàng" },
      { mainSlug: "qua-tang", subId: "cay-kim-ngan-phat-tai", label: "Cây kim ngân tài lộc" },
      { mainSlug: "qua-tang", subId: "qua-tang-doanh-nghiep-vip", label: "Quà tặng đối tác VIP" },
    ];
  }, []);

  // Inline submit new category/subcategory
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setAddingCat(true);
    try {
      const cleanSlug = newCatName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);

      if (!parentCatSlug) {
        // Create new Top-Level Category in DB
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newCatName.trim(),
            description: `Danh mục sản phẩm ${newCatName.trim()}`,
            image: "/images/hero_golden_ship.jpg",
            order: categories.length + 1,
          }),
        });
        const data = await res.json();
        if (data.success && data.category) {
          const updatedCatalog: MainCategoryData[] = [
            ...catalog,
            {
              name: newCatName.trim(),
              slug: data.category.slug,
              subCategories: [],
            },
          ];
          await fetch("/api/admin/subcategories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ catalog: updatedCatalog }),
          });

          if (onRefreshCatalog) onRefreshCatalog();

          const nextMain = [...selectedMainCatIds, data.category.id];
          setSelectedMainCatIds(nextMain);
          setPrimaryCatId(data.category.id);
          notifyChanges(nextMain, selectedSubIds, data.category.id, primarySubId);

          setNewCatName("");
          setShowAddForm(false);
          setAddSuccess(true);
          toastSuccess(`Đã tạo thành công danh mục mới: "${data.category.name}"!`, "Tạo danh mục");
          setTimeout(() => setAddSuccess(false), 3000);
        } else {
          toastError(data.message || "Không thể tạo danh mục mới", "Lỗi tạo danh mục");
        }
      } else {
        // Create new Subcategory branch inside selected parent
        const parentMain = catalog.find((c) => c.slug === parentCatSlug);
        if (parentMain) {
          const newSubItem: SubCategoryItem = {
            id: cleanSlug,
            name: newCatName.trim(),
            keyword: newCatName.trim().toLowerCase(),
            image: parentMain.banner || "/images/hero_golden_ship.jpg",
          };

          const updatedCatalog = catalog.map((c) => {
            if (c.slug === parentCatSlug) {
              return {
                ...c,
                subCategories: [...(c.subCategories || []), newSubItem],
              };
            }
            return c;
          });

          const res = await fetch("/api/admin/subcategories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ catalog: updatedCatalog }),
          });
          const data = await res.json();
          if (data.success) {
            const dbCat = getDbCatBySlug(parentCatSlug);
            const nextSub = [...selectedSubIds, cleanSlug];
            let nextMain = [...selectedMainCatIds];
            if (dbCat && !nextMain.includes(dbCat.id)) {
              nextMain.push(dbCat.id);
            }

            setSelectedSubIds(nextSub);
            setSelectedMainCatIds(nextMain);
            setPrimarySubId(cleanSlug);
            if (dbCat && !primaryCatId) setPrimaryCatId(dbCat.id);

            notifyChanges(nextMain, nextSub, primaryCatId || (dbCat?.id || ""), cleanSlug);

            if (onRefreshCatalog) onRefreshCatalog();
            setNewCatName("");
            setShowAddForm(false);
            setAddSuccess(true);
            toastSuccess(`Đã thêm nhánh con "${newSubItem.name}" vào danh mục "${parentMain.name}"!`, "Thêm nhánh thành công");
            setTimeout(() => setAddSuccess(false), 3000);
          } else {
            toastError(data.message || "Lỗi lưu nhánh danh mục", "Lỗi tạo nhánh");
          }
        }
      }
    } catch (err: any) {
      toastError("Lỗi khi thêm danh mục: " + err.message, "Lỗi kết nối");
    } finally {
      setAddingCat(false);
    }
  };

  const totalSelectedCount = selectedItems.length;

  return (
    <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
      {/* Box Header */}
      <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-[#d4af37]" />
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
            {title}
          </h3>
        </div>
        <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 flex items-center gap-1">
          <Layers className="w-3 h-3" />
          <span>Chọn nhiều mục</span>
        </span>
      </div>

      {/* Tabs: "Tất cả danh mục" vs "Dùng nhiều nhất" */}
      <div className="flex border-b border-[#202f45] bg-[#0c1420] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 px-3 text-center font-bold transition-colors ${
            activeTab === "all"
              ? "bg-[#142339] text-[#ffd700] border-b-2 border-[#d4af37]"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Tất cả danh mục
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("popular")}
          className={`flex-1 py-2 px-3 text-center font-bold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === "popular"
              ? "bg-[#142339] text-[#ffd700] border-b-2 border-[#d4af37]"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>Dùng nhiều nhất</span>
        </button>
      </div>

      {/* Search Input for Categories */}
      {activeTab === "all" && (
        <div className="p-2 border-b border-[#202f45] bg-[#0c1420]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm danh mục, nhánh đồ đồng..."
              className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs pl-8 pr-7 py-1.5 rounded-lg focus:outline-none placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Selected Items Badges Header */}
      {totalSelectedCount > 0 ? (
        <div className="px-3 py-2 bg-gradient-to-r from-[#d4af37]/15 to-[#ffd700]/5 border-b border-[#d4af37]/30">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-[#ffd700] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Đã chọn ({totalSelectedCount} mục):</span>
            </span>
            <span className="text-[10px] text-gray-400">
              Sản phẩm sẽ hiển thị ở tất cả các mục này
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto custom-scrollbar">
            {selectedItems.map((item) => {
              const isPrimary =
                (item.type === "main" && item.id === primaryCatId) ||
                (item.type !== "main" && item.id === primarySubId);

              return (
                <span
                  key={item.id}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] transition-all shadow-sm ${
                    isPrimary
                      ? "bg-[#d4af37] text-[#070c14] font-bold border border-[#ffd700]"
                      : "bg-[#142339] text-[#ffd700] border border-[#d4af37]/40 hover:border-[#ffd700]"
                  }`}
                  title={`${item.pathText} (Nhấp để chọn làm mục chính)`}
                >
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(item)}
                    className="flex items-center gap-1 text-left"
                  >
                    {isPrimary && <Star className="w-3 h-3 fill-current shrink-0" />}
                    <span className="truncate max-w-[150px]">{item.name}</span>
                    {isPrimary && (
                      <span className="text-[9px] bg-black/20 px-1 rounded uppercase tracking-wider font-extrabold">
                        Chính
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item);
                    }}
                    className="opacity-75 hover:opacity-100 hover:text-red-400 ml-0.5 p-0.5"
                    title="Bỏ chọn mục này"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="px-3 py-1.5 bg-[#0c1420] border-b border-[#202f45] text-[11px] text-amber-400/90 flex items-center gap-1.5">
          <span>⚠️ Chưa chọn danh mục nào. Hãy tích chọn các mục phía dưới.</span>
        </div>
      )}

      {/* TAB 1: ALL HIERARCHICAL CATEGORIES TREE */}
      {activeTab === "all" && (
        <div className="p-3 max-h-80 overflow-y-auto space-y-1.5 text-xs custom-scrollbar">
          {filteredCatalog.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs">
              Không tìm thấy danh mục nào phù hợp
            </div>
          ) : (
            filteredCatalog.map((main) => {
              const dbCat = getDbCatBySlug(main.slug);
              const isMainChecked = dbCat ? selectedMainCatIds.includes(dbCat.id) : false;

              // Check if any child subcategory is checked
              const hasChildChecked = (main.subCategories || []).some(
                (sub) =>
                  selectedSubIds.includes(sub.id) ||
                  (sub.children && sub.children.some((ch) => selectedSubIds.includes(ch.id)))
              );

              const isExpanded =
                expandedCats[main.slug] ?? (searchQuery.trim().length > 0 || hasChildChecked);
              const hasSubs = (main.subCategories || []).length > 0;

              return (
                <div key={main.slug} className="space-y-1">
                  {/* LEVEL 1: MAIN CATEGORY ROW */}
                  <div
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-colors group cursor-pointer ${
                      isMainChecked
                        ? "bg-[#d4af37]/25 border border-[#d4af37]/50 text-[#ffd700]"
                        : hasChildChecked
                        ? "bg-[#142339] border border-[#d4af37]/20 text-white"
                        : "hover:bg-[#152236] text-gray-200"
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 select-none">
                      <input
                        type="checkbox"
                        checked={isMainChecked}
                        onChange={() => handleToggleMain(main.slug, main.name)}
                        className="w-3.5 h-3.5 rounded border-[#202f45] text-[#d4af37] focus:ring-0 cursor-pointer accent-[#d4af37]"
                      />
                      <span className="font-bold text-xs truncate">
                        {main.name}
                      </span>
                    </label>

                    {hasSubs && (
                      <button
                        type="button"
                        onClick={(e) => toggleExpand(main.slug, e)}
                        className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                        title={isExpanded ? "Thu gọn" : "Mở rộng nhánh"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* LEVEL 2: SUBCATEGORIES TREE */}
                  {hasSubs && isExpanded && (
                    <div className="pl-4 pr-1 space-y-1 border-l border-[#202f45] ml-2.5">
                      {main.subCategories.map((sub) => {
                        const isSubChecked = selectedSubIds.includes(sub.id);
                        const hasSubChildChecked =
                          sub.children && sub.children.some((ch) => selectedSubIds.includes(ch.id));

                        const hasChildren = (sub.children || []).length > 0;
                        const isSubExpanded =
                          expandedCats[sub.id] ?? (searchQuery.trim().length > 0 || hasSubChildChecked);

                        return (
                          <div key={sub.id} className="space-y-1">
                            {/* Subcategory Row */}
                            <div
                              className={`flex items-center justify-between p-1 rounded-md transition-colors cursor-pointer ${
                                isSubChecked
                                  ? "bg-[#d4af37]/30 border border-[#d4af37]/60 text-[#ffd700] font-bold"
                                  : hasSubChildChecked
                                  ? "bg-[#142339] text-white font-semibold"
                                  : "hover:bg-[#152236] text-gray-300"
                              }`}
                            >
                              <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 select-none">
                                <input
                                  type="checkbox"
                                  checked={isSubChecked}
                                  onChange={() => handleToggleSub(main.slug, sub)}
                                  className="w-3 h-3 rounded border-[#202f45] text-[#d4af37] focus:ring-0 cursor-pointer accent-[#d4af37]"
                                />
                                <span className="text-[11px] truncate">
                                  {sub.name}
                                </span>
                              </label>

                              {hasChildren && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleExpand(sub.id, e)}
                                  className="p-0.5 text-gray-400 hover:text-white"
                                >
                                  {isSubExpanded ? (
                                    <ChevronDown className="w-3 h-3" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* LEVEL 3: DETAIL CATEGORIES TREE */}
                            {hasChildren && isSubExpanded && (
                              <div className="pl-4 space-y-0.5 border-l border-[#202f45] ml-2">
                                {sub.children!.map((detail) => {
                                  const isDetailChecked = selectedSubIds.includes(detail.id);

                                  return (
                                    <label
                                      key={detail.id}
                                      className={`flex items-center gap-2 p-1 rounded transition-colors cursor-pointer select-none ${
                                        isDetailChecked
                                          ? "bg-[#d4af37]/35 text-[#ffd700] font-bold border border-[#d4af37]/50"
                                          : "hover:bg-[#152236] text-gray-400 hover:text-gray-200"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isDetailChecked}
                                        onChange={() =>
                                          handleToggleDetail(main.slug, sub, detail)
                                        }
                                        className="w-2.5 h-2.5 rounded border-[#202f45] text-[#d4af37] focus:ring-0 cursor-pointer accent-[#d4af37]"
                                      />
                                      <span className="text-[10px] truncate">
                                        {detail.name}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: POPULAR / MOST USED CATEGORIES */}
      {activeTab === "popular" && (
        <div className="p-3 max-h-80 overflow-y-auto space-y-1 text-xs custom-scrollbar">
          <p className="text-[11px] text-gray-400 mb-2">
            Nhấp để chọn nhanh hoặc bỏ chọn nhiều mục được khách hàng quan tâm nhiều nhất:
          </p>
          <div className="grid grid-cols-1 gap-1">
            {popularList.map((item, idx) => {
              const dbCat = getDbCatBySlug(item.mainSlug);
              const isChecked = selectedSubIds.includes(item.subId);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const subItem: SubCategoryItem = {
                      id: item.subId,
                      name: item.label,
                      keyword: item.label.toLowerCase(),
                      image: "/images/hero_golden_ship.jpg",
                    };
                    handleToggleSub(item.mainSlug, subItem);
                  }}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isChecked
                      ? "bg-[#d4af37] text-[#070c14] font-bold shadow"
                      : "bg-[#111c2e] hover:bg-[#17253b] text-gray-200 border border-[#1f2d42]"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* BOX FOOTER: "+ Thêm danh mục mới" */}
      <div className="p-3 bg-[#0c1420] border-t border-[#202f45]">
        {!showAddForm ? (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="text-xs text-[#ffd700] hover:underline flex items-center gap-1.5 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm danh mục mới</span>
          </button>
        ) : (
          <form onSubmit={handleCreateCategory} className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-[#ffd700] uppercase">
              Thêm danh mục / Nhánh mới
            </div>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Tên danh mục mới..."
              className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            />

            <div>
              <label className="text-[10px] text-gray-400 block mb-0.5">
                Danh mục cha (Trống = Tạo mục chính):
              </label>
              <select
                value={parentCatSlug}
                onChange={(e) => setParentCatSlug(e.target.value)}
                className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-2 py-1.5 rounded-lg focus:outline-none"
              >
                <option value="">-- Không có (Tạo Mục chính lớn) --</option>
                {catalog.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={addingCat || !newCatName.trim()}
                className="px-3 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#e5b869] text-[#070c14] font-bold text-xs rounded-lg flex items-center gap-1 disabled:opacity-50"
              >
                {addingCat ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                <span>Thêm</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCatName("");
                }}
                className="px-2.5 py-1.5 text-xs text-gray-400 hover:text-white"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {addSuccess && (
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã thêm và kích hoạt danh mục mới thành công!</span>
          </div>
        )}
      </div>
    </div>
  );
}
