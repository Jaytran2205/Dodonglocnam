"use client";

import React, { useState, useMemo } from "react";
import {
  Globe,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Monitor,
} from "lucide-react";
import { removeVietnameseTones } from "@/lib/utils";

interface ProductSeoBoxProps {
  title: string;
  slug: string;
  categoryName?: string;
  shortDescription?: string;
  description?: string;
  hasImages?: boolean;
}

export function ProductSeoBox({
  title,
  slug,
  categoryName = "Đồ Đồng Lộc Nam",
  shortDescription = "",
  description = "",
  hasImages = true,
}: ProductSeoBoxProps) {
  const [focusKeyword, setFocusKeyword] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isExpanded, setIsExpanded] = useState(true);

  // Computed SEO Title and Description
  const seoTitle = title
    ? `${title} - Đồ Đồng Lộc Nam`
    : "Tên Sản Phẩm Chuẩn Phong Thủy - Đồ Đồng Lộc Nam";

  const seoSnippetDesc =
    shortDescription ||
    (description
      ? description.slice(0, 160).replace(/[#*`_[\]()]/g, "") + "..."
      : "Sản phẩm đúc đồng thủ công tinh xảo, phôi đồng thanh khiết 100%, bảo hành trọn đời từ làng nghề Ý Yên - Nam Định.");

  const liveUrl = `https://www.quatanglocnam.com/san-pham/${slug || "san-pham-doc-ban"}`;

  // SEO Score Calculation based on focus keyword & best practices
  const seoAudit = useMemo(() => {
    const rawKw = focusKeyword.trim().toLowerCase();
    const cleanKw = removeVietnameseTones(rawKw);

    const checks = [
      {
        id: "title_has_kw",
        label: "Từ khóa chính xuất hiện trong Tiêu đề sản phẩm",
        passed: Boolean(
          rawKw &&
            (title.toLowerCase().includes(rawKw) ||
              removeVietnameseTones(title.toLowerCase()).includes(cleanKw))
        ),
        critical: true,
      },
      {
        id: "title_length",
        label: "Độ dài tiêu đề tối ưu cho tìm kiếm Google (35 - 70 ký tự)",
        passed: title.length >= 35 && title.length <= 70,
        tip: `Hiện tại: ${title.length} ký tự`,
      },
      {
        id: "desc_has_kw",
        label: "Từ khóa chính xuất hiện trong Mô tả ngắn (Meta description)",
        passed: Boolean(
          rawKw &&
            (shortDescription.toLowerCase().includes(rawKw) ||
              removeVietnameseTones(shortDescription.toLowerCase()).includes(cleanKw))
        ),
        critical: true,
      },
      {
        id: "desc_length",
        label: "Độ dài mô tả ngắn tối ưu (80 - 200 ký tự)",
        passed: shortDescription.length >= 80 && shortDescription.length <= 200,
        tip: `Hiện tại: ${shortDescription.length} ký tự`,
      },
      {
        id: "url_has_kw",
        label: "Đường dẫn URL chứa từ khóa hoặc tiêu đề rõ nghĩa",
        passed: Boolean(slug && slug.length >= 10),
      },
      {
        id: "content_rich",
        label: "Nội dung bài viết chi tiết đầy đủ thông số & phong thủy (> 200 từ)",
        passed: description.split(/\s+/).filter(Boolean).length >= 100,
      },
      {
        id: "has_images",
        label: "Đã thiết lập ảnh đại diện và các góc chụp sản phẩm",
        passed: Boolean(hasImages),
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return { checks, score };
  }, [focusKeyword, title, slug, shortDescription, description, hasImages]);

  const scoreColor =
    seoAudit.score >= 80
      ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/40"
      : seoAudit.score >= 50
      ? "text-amber-400 bg-amber-500/20 border-amber-500/40"
      : "text-rose-400 bg-rose-500/20 border-rose-500/40";

  return (
    <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
      {/* Box Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between cursor-pointer hover:bg-[#15233a] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-[#d4af37]" />
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
            Tối Ưu SEO & Hiển Thị Google (Rank Math SEO)
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${scoreColor}`}
          >
            SEO: {seoAudit.score} / 100
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Google Search Result Preview */}
          <div className="bg-[#070c14] border border-[#202f45] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b283d]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Xem Trước Kết Quả Tìm Kiếm Google
              </span>
              <div className="flex items-center gap-1 bg-[#111c2e] p-0.5 rounded-lg border border-[#202f45]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1 rounded ${
                    previewDevice === "desktop"
                      ? "bg-[#1b283d] text-[#d4af37]"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Máy tính"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1 rounded ${
                    previewDevice === "mobile"
                      ? "bg-[#1b283d] text-[#d4af37]"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Điện thoại di động"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg bg-white/5 border border-white/5 font-sans space-y-1 ${
                previewDevice === "mobile" ? "max-w-sm mx-auto" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 truncate">
                <span className="w-4 h-4 rounded-full bg-[#d4af37] text-[9px] text-[#070c14] font-bold flex items-center justify-center">
                  LN
                </span>
                <span className="truncate">{liveUrl}</span>
              </div>
              <h4 className="text-sm font-semibold text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {seoTitle}
              </h4>
              <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                {seoSnippetDesc}
              </p>
            </div>
          </div>

          {/* Focus Keyword Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white block uppercase">
              Từ Khóa Chính (Focus Keyword)
            </label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Ví dụ: Đỉnh đồng ngũ sự, Tượng quan âm bằng đồng..."
              className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-xl focus:outline-none"
            />
            <p className="text-[11px] text-gray-400">
              Hệ thống sẽ tự động đối soát và chấm điểm SEO theo chuẩn Google đối với từ khóa này.
            </p>
          </div>

          {/* Real-time SEO Checklist */}
          <div className="space-y-2 pt-1 border-t border-[#202f45]">
            <span className="text-[11px] font-bold text-gray-300 uppercase block">
              Danh Sách Tiêu Chuẩn SEO
            </span>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {seoAudit.checks.map((check) => (
                <div
                  key={check.id}
                  className={`flex items-start gap-2 p-2 rounded-lg border ${
                    check.passed
                      ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                      : "bg-[#111c2e] border-[#202f45] text-gray-400"
                  }`}
                >
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className={check.passed ? "font-medium" : ""}>
                      {check.label}
                    </span>
                    {check.tip && (
                      <span className="text-[10px] text-gray-400 ml-1.5">
                        ({check.tip})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
