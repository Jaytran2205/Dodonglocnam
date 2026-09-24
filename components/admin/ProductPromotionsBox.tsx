"use client";

import React, { useState } from "react";
import { Gift, ShieldCheck, Truck, Sparkles, Hammer, Check, Plus, Trash2 } from "lucide-react";

interface ProductPromotionsBoxProps {
  description: string;
  onAppendPromotionToDescription: (promoText: string) => void;
}

export function ProductPromotionsBox({
  description,
  onAppendPromotionToDescription,
}: ProductPromotionsBoxProps) {
  const [promos, setPromos] = useState([
    {
      title: "Bảo hành trọn đời",
      desc: "Cam kết đồng chuẩn thanh khiết 100%, bảo hành chất lượng phôi đúc dài lâu.",
      enabled: true,
    },
    {
      title: "Miễn phí vận chuyển",
      desc: "Hỗ trợ đóng gói chuyên dụng, giao hàng toàn quốc và kiểm tra hàng trước khi thanh toán.",
      enabled: true,
    },
    {
      title: "Tặng quà lưu niệm",
      desc: "Tặng kèm vật phẩm phong thủy giá trị khi thỉnh trọn bộ tác phẩm.",
      enabled: true,
    },
    {
      title: "Chế tác theo yêu cầu",
      desc: "Nhận đúc dát vàng 9999, khảm tam khí, ngũ sắc theo kích thước Lỗ Ban phong thủy.",
      enabled: true,
    },
  ]);

  const [copied, setCopied] = useState(false);

  const handleInsertIntoEditor = () => {
    const activePromos = promos.filter((p) => p.enabled);
    if (activePromos.length === 0) return;

    const promoBlock = `\n\n[box=gold]\n### Chính Sách Khuyến Mại & Cam Kết Từ Đồ Đồng Lộc Nam\n${activePromos
      .map((p) => `* **${p.title}:** ${p.desc}`)
      .join("\n")}\n[/box]\n\n`;

    onAppendPromotionToDescription(promoBlock);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-[#d4af37]" />
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
            Khuyến Mại & Chính Sách Ưu Đãi
          </h3>
        </div>
        <button
          type="button"
          onClick={handleInsertIntoEditor}
          className="text-[11px] font-bold text-[#ffd700] hover:text-white bg-[#1a2b42] hover:bg-[#223957] px-2.5 py-1 rounded-lg border border-[#2b466d] flex items-center gap-1 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3" />}
          <span>{copied ? "Đã chèn vào bài viết!" : "Chèn vào bài viết"}</span>
        </button>
      </div>

      <div className="p-4 space-y-2.5 text-xs">
        {promos.map((p, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-lg border transition-colors flex items-start gap-2.5 ${
              p.enabled
                ? "bg-[#111c2e] border-[#202f45]"
                : "bg-black/20 border-transparent opacity-60"
            }`}
          >
            <input
              type="checkbox"
              checked={p.enabled}
              onChange={(e) => {
                const next = [...promos];
                next[idx].enabled = e.target.checked;
                setPromos(next);
              }}
              className="w-3.5 h-3.5 mt-0.5 rounded border-[#202f45] text-[#d4af37] focus:ring-0 accent-[#d4af37] cursor-pointer"
            />
            <div className="flex-1 space-y-0.5">
              <input
                type="text"
                value={p.title}
                onChange={(e) => {
                  const next = [...promos];
                  next[idx].title = e.target.value;
                  setPromos(next);
                }}
                className="font-bold text-white bg-transparent border-b border-transparent focus:border-[#d4af37] focus:outline-none w-full text-xs"
              />
              <input
                type="text"
                value={p.desc}
                onChange={(e) => {
                  const next = [...promos];
                  next[idx].desc = e.target.value;
                  setPromos(next);
                }}
                className="text-gray-400 bg-transparent border-b border-transparent focus:border-[#d4af37] focus:outline-none w-full text-[11px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
