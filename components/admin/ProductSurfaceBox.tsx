"use client";

import React, { useState } from "react";
import { Sparkles, Check, Plus, Tag } from "lucide-react";

interface ProductSurfaceBoxProps {
  selectedSurfaces: string[];
  onChange: (surfaces: string[]) => void;
}

const DEFAULT_SURFACES = [
  "Mạ - dát vàng 24K",
  "Dát vàng 9999",
  "Mạ - khảm tam khí",
  "Mạ - khảm ngũ sắc",
  "Mạ - khảm bạc",
  "Giả cổ hun nâu",
  "Làm màu giả cổ",
  "Màu mộc đồng đỏ",
  "Màu mộc đồng vàng",
  "Đồng catut quân sự",
  "2 công nghệ",
];

export function ProductSurfaceBox({
  selectedSurfaces,
  onChange,
}: ProductSurfaceBoxProps) {
  const [activeTab, setActiveTab] = useState<"all" | "popular">("all");
  const [customList, setCustomList] = useState<string[]>(DEFAULT_SURFACES);
  const [newSurface, setNewSurface] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const toggleSurface = (surface: string) => {
    if (selectedSurfaces.includes(surface)) {
      onChange(selectedSurfaces.filter((s) => s !== surface));
    } else {
      onChange([...selectedSurfaces, surface]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurface.trim()) return;
    const item = newSurface.trim();
    if (!customList.includes(item)) {
      setCustomList((prev) => [...prev, item]);
    }
    if (!selectedSurfaces.includes(item)) {
      onChange([...selectedSurfaces, item]);
    }
    setNewSurface("");
    setShowAdd(false);
  };

  return (
    <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
            Bề Mặt Hoàn Thiện & Quy Cách
          </h3>
        </div>
        <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
          {selectedSurfaces.length} đã chọn
        </span>
      </div>

      <div className="flex border-b border-[#202f45] bg-[#0c1420] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 font-semibold text-center transition-colors border-b-2 ${
            activeTab === "all"
              ? "border-[#d4af37] text-[#d4af37] bg-[#111c2e]"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          Tất cả bề mặt
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("popular")}
          className={`flex-1 py-2 font-semibold text-center transition-colors border-b-2 ${
            activeTab === "popular"
              ? "border-[#d4af37] text-[#d4af37] bg-[#111c2e]"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          Dùng nhiều nhất
        </button>
      </div>

      <div className="p-3 max-h-56 overflow-y-auto space-y-1 text-xs custom-scrollbar">
        {(activeTab === "all" ? customList : customList.slice(0, 5)).map((surface) => {
          const isSelected = selectedSurfaces.includes(surface);
          return (
            <label
              key={surface}
              className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? "bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] font-semibold"
                  : "hover:bg-[#152236] text-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSurface(surface)}
                className="w-3.5 h-3.5 rounded border-[#202f45] text-[#d4af37] focus:ring-0 accent-[#d4af37] cursor-pointer"
              />
              <span className="text-xs truncate">{surface}</span>
            </label>
          );
        })}
      </div>

      <div className="p-3 bg-[#0c1420] border-t border-[#202f45]">
        {!showAdd ? (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="text-xs text-[#ffd700] hover:underline flex items-center gap-1.5 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm bề mặt mới</span>
          </button>
        ) : (
          <form onSubmit={handleAddCustom} className="space-y-2 pt-1">
            <input
              type="text"
              required
              value={newSurface}
              onChange={(e) => setNewSurface(e.target.value)}
              placeholder="Tên bề mặt mới..."
              className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-3 py-1 bg-[#d4af37] text-[#070c14] font-bold text-xs rounded-lg"
              >
                Thêm
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
