"use client";

import React from "react";
import { Filter, SlidersHorizontal, RotateCcw } from "lucide-react";

interface ProductFiltersProps {
  selectedMaterial: string;
  onMaterialChange: (val: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  onReset: () => void;
}

export function ProductFilters({
  selectedMaterial,
  onMaterialChange,
  selectedPriceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
  onReset,
}: ProductFiltersProps) {
  const materials = [
    { label: "Tất cả chất liệu", value: "all" },
    { label: "Đồng đỏ nguyên chất", value: "Đồng đỏ" },
    { label: "Khảm ngũ sắc", value: "khảm 5 kim khí" },
    { label: "Mạ vàng 24K / Dát vàng", value: "vàng" },
    { label: "Đồng Catut quân sự", value: "Catut" },
  ];

  const priceRanges = [
    { label: "Tất cả mức giá", value: "all" },
    { label: "Dưới 10 triệu", value: "under-10" },
    { label: "10 - 30 triệu", value: "10-30" },
    { label: "30 - 50 triệu", value: "30-50" },
    { label: "Trên 50 triệu", value: "above-50" },
  ];

  const sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá tăng dần", value: "price-asc" },
    { label: "Giá giảm dần", value: "price-desc" },
  ];

  const hasFilter =
    selectedMaterial !== "all" || selectedPriceRange !== "all" || sortBy !== "newest";

  return (
    <div className="bg-surface-container p-4 sm:p-5 rounded-sm border border-outline-variant space-y-4 mb-8">
      <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Bộ Lọc Sản Phẩm</span>
        </div>

        {hasFilter && (
          <button
            onClick={onReset}
            className="text-xs text-secondary hover:text-primary flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Filter Material */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Chất Liệu Đồng
          </label>
          <select
            value={selectedMaterial}
            onChange={(e) => onMaterialChange(e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline rounded-sm text-xs text-on-surface focus:outline-none focus:border-primary"
          >
            {materials.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Price */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Khoảng Giá
          </label>
          <select
            value={selectedPriceRange}
            onChange={(e) => onPriceRangeChange(e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline rounded-sm text-xs text-on-surface focus:outline-none focus:border-primary"
          >
            {priceRanges.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Sắp Xếp Theo
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline rounded-sm text-xs text-on-surface focus:outline-none focus:border-primary"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}