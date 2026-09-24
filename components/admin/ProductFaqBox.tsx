"use client";

import React, { useState } from "react";
import { HelpCircle, Plus, Trash2, ChevronDown, ChevronUp, Check } from "lucide-react";

interface ProductFaqBoxProps {
  onInsertFaqToDescription: (faqText: string) => void;
}

const DEFAULT_FAQS = [
  {
    q: "Sản phẩm đúc đồng có đảm bảo phôi đồng thanh khiết không?",
    a: "Đồ Đồng Lộc Nam cam kết 100% phôi đồng nguyên chất thanh khiết, tuyển chọn khắt khe từ làng nghề Ý Yên - Nam Định. Đền bù gấp 10 lần nếu phát hiện pha tạp kim loại độc hại.",
  },
  {
    q: "Quy cách đóng gói và giao nhận hàng như thế nào?",
    a: "Sản phẩm được chèn xốp định hình chuyên dụng và bọc hộp gỗ chống va đập. Quý khách luôn có quyền mở gói hàng, kiểm tra sản phẩm ưng ý trước khi thanh toán.",
  },
  {
    q: "Xưởng có nhận chế tác kích thước Lỗ Ban theo yêu cầu không?",
    a: "Có, Đồ Đồng Lộc Nam nhận đúc tượng chân dung truyền thần, đỉnh đồng, chuông đồng, tranh đồng mạ vàng 24K theo kích thước số đo phong thủy Lỗ Ban riêng của gia chủ.",
  },
];

export function ProductFaqBox({ onInsertFaqToDescription }: ProductFaqBoxProps) {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [inserted, setInserted] = useState(false);

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) return;
    setFaqs([...faqs, { q: newQ.trim(), a: newA.trim() }]);
    setNewQ("");
    setNewA("");
    setShowAdd(false);
  };

  const handleDelete = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleInsert = () => {
    if (faqs.length === 0) return;
    const faqBlock = `\n\n[box=navy]\n### Câu Hỏi Thường Gặp Về Tác Phẩm (FAQ)\n${faqs
      .map((item) => `* **Hỏi: ${item.q}**\n  *Trả lời:* ${item.a}`)
      .join("\n\n")}\n[/box]\n\n`;

    onInsertFaqToDescription(faqBlock);
    setInserted(true);
    setTimeout(() => setInserted(false), 2500);
  };

  return (
    <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#d4af37]" />
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
            Câu Hỏi Thường Gặp (FAQ Sản Phẩm)
          </h3>
        </div>
        <button
          type="button"
          onClick={handleInsert}
          className="text-[11px] font-bold text-[#ffd700] hover:text-white bg-[#1a2b42] hover:bg-[#223957] px-2.5 py-1 rounded-lg border border-[#2b466d] flex items-center gap-1 transition-colors"
        >
          {inserted ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3" />}
          <span>{inserted ? "Đã chèn FAQ vào bài!" : "Chèn FAQ vào bài"}</span>
        </button>
      </div>

      <div className="p-4 space-y-2.5 text-xs">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className="border border-[#202f45] rounded-lg bg-[#111c2e] overflow-hidden"
          >
            <div
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#15233a] transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#ffd700] font-bold text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-semibold text-gray-200 truncate">{item.q}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(idx);
                  }}
                  className="text-gray-500 hover:text-red-400 p-0.5"
                  title="Xóa câu hỏi này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {openIndex === idx ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>
            </div>

            {openIndex === idx && (
              <div className="p-3 bg-[#0a121e] border-t border-[#1b283d] text-gray-300 text-xs leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}

        {!showAdd ? (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="text-xs text-[#ffd700] hover:underline flex items-center gap-1 font-semibold pt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm câu hỏi mới</span>
          </button>
        ) : (
          <form onSubmit={handleAddFaq} className="p-3 bg-[#111c2e] border border-[#202f45] rounded-xl space-y-2">
            <input
              type="text"
              required
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              placeholder="Câu hỏi (ví dụ: Bảo hành bao lâu?)..."
              className="w-full bg-[#0c1420] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none"
            />
            <textarea
              rows={2}
              required
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              placeholder="Câu trả lời giải đáp thắc mắc của khách..."
              className="w-full bg-[#0c1420] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-3 py-1 bg-[#d4af37] text-[#070c14] font-bold text-xs rounded-lg"
              >
                Thêm câu hỏi
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
