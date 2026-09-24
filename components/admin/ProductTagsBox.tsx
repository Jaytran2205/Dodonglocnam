"use client";

import React, { useState } from "react";
import { Tag, Plus, X } from "lucide-react";

interface ProductTagsBoxProps {
  tagsString: string;
  onChange: (tagsString: string) => void;
}

const COMMON_TAGS = [
  "Đồ thờ cúng cao cấp",
  "Đỉnh đồng ngũ sự",
  "Chuông chiêng đồng",
  "Bát hương gia tiên",
  "Mạ vàng 24K",
  "Dát vàng 9999",
  "Chuẩn thước Lỗ Ban",
  "Đồng đỏ thanh khiết",
  "Làng nghề Ý Yên",
  "Quà tặng phong thủy",
  "Trống đồng Đông Sơn",
  "Tượng phật bằng đồng",
  "Tượng danh nhân",
  "Tranh đồng phong thủy",
];

export function ProductTagsBox({ tagsString, onChange }: ProductTagsBoxProps) {
  const [inputVal, setInputVal] = useState("");

  const currentTags = (tagsString || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const addTag = (tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    if (!currentTags.includes(clean)) {
      const next = [...currentTags, clean];
      onChange(next.join(", "));
    }
  };

  const removeTag = (tag: string) => {
    const next = currentTags.filter((t) => t !== tag);
    onChange(next.join(", "));
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    inputVal
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach(addTag);
    setInputVal("");
  };

  return (
    <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#d4af37]" />
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
            Thẻ Sản Phẩm (Tags)
          </h3>
        </div>
        <span className="text-[10px] text-gray-400">
          {currentTags.length} thẻ
        </span>
      </div>

      <div className="p-4 space-y-3 text-xs">
        {/* Input & Add Button */}
        <form onSubmit={handleInputSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Nhập thẻ, cách nhau bằng dấu phẩy..."
            className="flex-1 bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-xl focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#1b2a40] hover:bg-[#253957] text-[#d4af37] border border-[#d4af37]/30 font-bold rounded-xl transition-colors shrink-0"
          >
            Thêm
          </button>
        </form>

        <p className="text-[11px] text-gray-400">
          Phân tách các thẻ bằng dấu phẩy (,).
        </p>

        {/* Selected Tags Pills */}
        {currentTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#142339] border border-[#d4af37]/30 text-amber-300 text-[11px] font-medium"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 p-0.5"
                  title="Xóa thẻ"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Popular Tags List */}
        <div className="space-y-1.5 pt-2 border-t border-[#202f45]">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Chọn từ các thẻ được sử dụng nhiều nhất:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_TAGS.map((tag) => {
              const isSelected = currentTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => (isSelected ? removeTag(tag) : addTag(tag))}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                    isSelected
                      ? "bg-[#d4af37]/20 border-[#d4af37]/50 text-[#ffd700] font-semibold"
                      : "bg-[#0c1420] hover:bg-[#152236] border-[#202f45] text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
