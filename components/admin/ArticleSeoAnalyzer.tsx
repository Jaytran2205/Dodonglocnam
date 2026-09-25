"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Smartphone,
  Monitor,
  HelpCircle,
  Wand2,
  ArrowRight,
  TrendingUp,
  Search,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Hash
} from "lucide-react";

interface ArticleSeoAnalyzerProps {
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  slug?: string;
  category?: string;
  onApplyOutline?: (outlineMarkdown: string) => void;
  onSetFocusKeyword?: (kw: string) => void;
}

export function ArticleSeoAnalyzer({
  title,
  summary,
  content,
  thumbnail,
  slug = "",
  category = "KIẾN THỨC ĐỒ ĐỒNG",
  onApplyOutline,
  onSetFocusKeyword,
}: ArticleSeoAnalyzerProps) {
  const [focusKeyword, setFocusKeyword] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [showTips, setShowTips] = useState(false);
  const [activeTab, setActiveTab] = useState<"checklist" | "preview" | "outline">("checklist");

  // Category-based keyword suggestions
  const suggestedKeywords = useMemo(() => {
    switch (category) {
      case "KIẾN THỨC ĐỒ ĐỒNG":
        return [
          "đồ thờ cúng bằng đồng",
          "đỉnh đồng gia tiên",
          "quy trình đúc đồng thủ công",
          "cách phân biệt đồng nguyên chất",
          "đồ đồng ý yên nam định",
        ];
      case "KIẾN THỨC PHONG THỦY":
        return [
          "bố trí bàn thờ gia tiên chuẩn phong thủy",
          "ý nghĩa tượng ngựa mã đáo thành công",
          "linh vật phong thủy chiêu tài",
          "vị trí đặt tượng đồng phong thủy",
        ];
      case "BẠN CÓ BIẾT":
        return [
          "lịch sử làng nghề đúc đồng ý yên",
          "ý nghĩa hoa văn trống đồng đông sơn",
          "nghệ nhân bàn tay vàng dương bá tiến",
        ];
      case "TIN TỨC SỰ KIỆN":
        return [
          "xưởng đúc đồng lộc nam",
          "công trình đúc đồng tiêu biểu",
          "quà tặng trống đồng mạ vàng 24k",
        ];
      default:
        return [
          "đồ đồng lộc nam",
          "đồ thờ bằng đồng",
          "đúc đồng ý yên",
          "trống đồng đông sơn",
        ];
    }
  }, [category]);

  // Strip HTML / Markdown tags for clean text analysis
  const plainText = useMemo(() => {
    if (!content) return "";
    return content
      .replace(/<[^>]*>/g, " ")
      .replace(/!\[.*?\]\(.*?\)/g, " ")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[#*_~`>]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, [content]);

  // Word count
  const wordCount = useMemo(() => {
    if (!plainText) return 0;
    return plainText.split(/\s+/).filter(Boolean).length;
  }, [plainText]);

  // Headings analysis
  const headings = useMemo(() => {
    const h2Md = content.match(/##\s+[^\n]+/g) || [];
    const h2Html = content.match(/<h2[^>]*>.*?<\/h2>/gi) || [];
    const h2Matches = [...h2Md, ...h2Html];

    const h3Md = content.match(/###\s+[^\n]+/g) || [];
    const h3Html = content.match(/<h3[^>]*>.*?<\/h3>/gi) || [];
    const h3Matches = [...h3Md, ...h3Html];

    return {
      h2Count: h2Matches.length,
      h3Count: h3Matches.length,
      h2Texts: h2Matches.map((h) => h.replace(/##\s+|<h2[^>]*>|<\/h2>/gi, "").trim()),
    };
  }, [content]);

  // Image count inside content
  const contentImagesCount = useMemo(() => {
    const mdImages = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    const htmlImages = (content.match(/<img[^>]+>/gi) || []).length;
    return mdImages + htmlImages;
  }, [content]);

  // Clean keyword for search
  const cleanKeyword = focusKeyword.trim().toLowerCase();

  // Keyword density
  const keywordStats = useMemo(() => {
    if (!cleanKeyword || wordCount === 0) return { count: 0, density: 0 };
    const regex = new RegExp(cleanKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = plainText.match(regex);
    const count = matches ? matches.length : 0;
    const density = Number(((count / wordCount) * 100).toFixed(1));
    return { count, density };
  }, [plainText, cleanKeyword, wordCount]);

  // First paragraph keyword check
  const keywordInFirstParagraph = useMemo(() => {
    if (!cleanKeyword) return false;
    const first100Words = plainText.split(/\s+/).slice(0, 100).join(" ").toLowerCase();
    return first100Words.includes(cleanKeyword);
  }, [plainText, cleanKeyword]);

  // Keyword in H2 check
  const keywordInH2 = useMemo(() => {
    if (!cleanKeyword || headings.h2Count === 0) return false;
    return headings.h2Texts.some((h) => h.toLowerCase().includes(cleanKeyword));
  }, [headings, cleanKeyword]);

  // Individual Checks
  const checks = useMemo(() => {
    const hasKw = Boolean(cleanKeyword);
    const titleLower = title.toLowerCase();
    const summaryLower = summary.toLowerCase();

    return [
      {
        id: "title_kw",
        group: "Tiêu Đề",
        label: "Từ khóa chính xuất hiện trong Tiêu đề bài viết",
        pass: hasKw && titleLower.includes(cleanKeyword),
        warning: !hasKw,
        message: !hasKw
          ? "Vui lòng nhập Từ khóa chính để hệ thống kiểm tra tiêu đề"
          : titleLower.includes(cleanKeyword)
          ? "Tiêu đề đã chứa từ khóa chính chuẩn SEO"
          : `Tiêu đề chưa chứa từ khóa "${cleanKeyword}"`,
        points: 15,
      },
      {
        id: "title_len",
        group: "Tiêu Đề",
        label: `Độ dài tiêu đề tối ưu (${title.length}/60 ký tự)`,
        pass: title.length >= 40 && title.length <= 65,
        warning: title.length > 0 && (title.length < 40 || (title.length > 65 && title.length <= 75)),
        message:
          title.length === 0
            ? "Chưa nhập tiêu đề bài viết"
            : title.length >= 40 && title.length <= 65
            ? "Độ dài tiêu đề đạt chuẩn hiển thị trên Google (40 - 65 ký tự)"
            : title.length < 40
            ? `Tiêu đề hơi ngắn (${title.length} ký tự). Nên dài từ 40 - 65 ký tự để tăng CTR`
            : `Tiêu đề quá dài (${title.length} ký tự). Có thể bị Google cắt bớt trên trang tìm kiếm`,
        points: 10,
      },
      {
        id: "summary_kw",
        group: "Mô Tả",
        label: "Từ khóa chính xuất hiện trong Đoạn tóm tắt (Meta Description)",
        pass: hasKw && summaryLower.includes(cleanKeyword),
        warning: !hasKw,
        message: !hasKw
          ? "Nhập từ khóa chính để kiểm tra mô tả tóm tắt"
          : summaryLower.includes(cleanKeyword)
          ? "Đoạn mô tả tóm tắt đã chứa từ khóa chính"
          : `Đoạn tóm tắt chưa chứa từ khóa "${cleanKeyword}"`,
        points: 10,
      },
      {
        id: "summary_len",
        group: "Mô Tả",
        label: `Độ dài mô tả tóm tắt chuẩn Google (${summary.length}/155 ký tự)`,
        pass: summary.length >= 120 && summary.length <= 165,
        warning: summary.length > 0 && (summary.length < 120 || (summary.length > 165 && summary.length <= 180)),
        message:
          summary.length === 0
            ? "Chưa nhập mô tả tóm tắt Meta Description"
            : summary.length >= 120 && summary.length <= 165
            ? "Độ dài mô tả đạt chuẩn hiển thị đoạn trích Google (120 - 165 ký tự)"
            : summary.length < 120
            ? `Mô tả tóm tắt hơi ngắn (${summary.length} ký tự). Khuyến nghị từ 120 - 160 ký tự`
            : `Mô tả dài (${summary.length} ký tự). Sẽ bị Google cắt ngắn lại bằng dấu '...'`,
        points: 10,
      },
      {
        id: "first_paragraph",
        group: "Nội Dung",
        label: "Từ khóa chính xuất hiện trong 100 từ đầu tiên (Đoạn mở bài)",
        pass: hasKw && keywordInFirstParagraph,
        warning: !hasKw,
        message: !hasKw
          ? "Chưa có từ khóa để kiểm tra đoạn mở đầu"
          : keywordInFirstParagraph
          ? "Từ khóa chính đã xuất hiện sớm trong đoạn mở đầu bài viết"
          : `Nên nhắc đến từ khóa "${cleanKeyword}" ngay trong 1-2 câu đầu tiên`,
        points: 10,
      },
      {
        id: "word_count",
        group: "Nội Dung",
        label: `Độ sâu nội dung bài viết (${wordCount} từ)`,
        pass: wordCount >= 600,
        warning: wordCount >= 300 && wordCount < 600,
        message:
          wordCount >= 1000
            ? `Nội dung rất chuyên sâu (${wordCount} từ) - Tối ưu cho bài viết SEO trụ cột!`
            : wordCount >= 600
            ? `Nội dung đạt chuẩn tối thiểu (${wordCount} từ)`
            : `Bài viết mới có ${wordCount} từ. Khuyến nghị tối thiểu 600 từ để được Google xếp hạng cao`,
        points: wordCount >= 1000 ? 20 : wordCount >= 600 ? 15 : wordCount >= 300 ? 8 : 0,
      },
      {
        id: "keyword_density",
        group: "Nội Dung",
        label: `Mật độ từ khóa chính (${keywordStats.density}%, lặp lại ${keywordStats.count} lần)`,
        pass: hasKw && keywordStats.density >= 0.8 && keywordStats.density <= 2.5,
        warning:
          hasKw &&
          ((keywordStats.density > 0 && keywordStats.density < 0.8) ||
            (keywordStats.density > 2.5 && keywordStats.density <= 3.5)),
        message: !hasKw
          ? "Nhập từ khóa chính để đo mật độ phân bổ"
          : keywordStats.count === 0
          ? `Chưa thấy từ khóa "${cleanKeyword}" trong nội dung bài viết`
          : keywordStats.density >= 0.8 && keywordStats.density <= 2.5
          ? `Mật độ từ khóa hoàn hảo (${keywordStats.density}% - xuất hiện ${keywordStats.count} lần)`
          : keywordStats.density < 0.8
          ? `Mật độ hơi thấp (${keywordStats.density}%). Nên bổ sung tự nhiên từ khóa vào các đoạn văn`
          : `Mật độ quá cao (${keywordStats.density}%). Cảnh báo nhồi nhét từ khóa!`,
        points: hasKw && keywordStats.density >= 0.8 && keywordStats.density <= 2.5 ? 10 : 3,
      },
      {
        id: "headings_h2",
        group: "Cấu Trúc",
        label: `Phân đoạn thẻ đề mục H2 & H3 (${headings.h2Count} thẻ H2, ${headings.h3Count} thẻ H3)`,
        pass: headings.h2Count >= 2,
        warning: headings.h2Count === 1,
        message:
          headings.h2Count >= 2
            ? `Bài viết có cấu trúc rõ ràng với ${headings.h2Count} thẻ đề mục H2`
            : headings.h2Count === 1
            ? "Mới có 1 thẻ H2. Khuyến nghị chia bài viết thành ít nhất 2 - 4 mục lớn (##)"
            : "Chưa có thẻ H2 nào. Sử dụng ## hoặc chọn Thẻ Tiêu Đề 2 trong trình soạn thảo",
        points: headings.h2Count >= 2 ? 8 : headings.h2Count === 1 ? 4 : 0,
      },
      {
        id: "heading_kw",
        group: "Cấu Trúc",
        label: "Từ khóa chính xuất hiện trong ít nhất 1 thẻ đề mục H2",
        pass: hasKw && keywordInH2,
        warning: !hasKw || (hasKw && headings.h2Count > 0 && !keywordInH2),
        message: !hasKw
          ? "Nhập từ khóa chính để kiểm tra đề mục"
          : keywordInH2
          ? "Đã có thẻ H2 chứa từ khóa chính"
          : `Nên lồng từ khóa "${cleanKeyword}" vào ít nhất một tiêu đề H2`,
        points: hasKw && keywordInH2 ? 7 : 0,
      },
      {
        id: "thumbnail",
        group: "Đa Phương Tiện",
        label: "Hình ảnh đại diện và ảnh minh họa trong bài viết",
        pass: Boolean(thumbnail) && contentImagesCount > 0,
        warning: Boolean(thumbnail) && contentImagesCount === 0,
        message:
          Boolean(thumbnail) && contentImagesCount > 0
            ? `Đã có ảnh bìa đại diện và ${contentImagesCount} ảnh minh họa trong bài`
            : Boolean(thumbnail)
            ? "Đã có ảnh bìa đại diện. Nên chèn thêm 1 - 2 ảnh tác phẩm thực tế vào bài viết"
            : "Chưa tải ảnh bìa đại diện bài viết",
        points: Boolean(thumbnail) && contentImagesCount > 0 ? 10 : Boolean(thumbnail) ? 6 : 0,
      },
    ];
  }, [
    title,
    summary,
    cleanKeyword,
    wordCount,
    keywordStats,
    keywordInFirstParagraph,
    headings,
    thumbnail,
    contentImagesCount,
  ]);

  // Overall Score Calculation (0 - 100)
  const seoScore = useMemo(() => {
    let earned = 0;
    checks.forEach((c) => {
      earned += c.points;
    });
    return Math.min(100, Math.max(0, earned));
  }, [checks]);

  // Score label and colors
  const scoreBadge = useMemo(() => {
    if (seoScore >= 80) {
      return {
        label: "Chuẩn SEO Xuất Sắc",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/20 border-emerald-500/40",
        barColor: "bg-emerald-500",
        desc: "Bài viết tối ưu rất tốt, sẵn sàng cạnh tranh thứ hạng cao trên Google!",
      };
    }
    if (seoScore >= 60) {
      return {
        label: "Khá Chuẩn SEO",
        color: "text-amber-400",
        bgColor: "bg-amber-500/20 border-amber-500/40",
        barColor: "bg-amber-500",
        desc: "Đạt yêu cầu cơ bản, cần cải thiện một vài tiêu chí màu đỏ/vàng bên dưới.",
      };
    }
    return {
      label: "Cần Tối Ưu Thêm",
      color: "text-rose-400",
      bgColor: "bg-rose-500/20 border-rose-500/40",
      barColor: "bg-rose-500",
      desc: "Nội dung còn thiếu các yếu tố cốt lõi để Google đánh giá cao.",
    };
  }, [seoScore]);

  // SEO Outline Template tailored for Đồ Đồng Lộc Nam
  const outlineTemplate = `## 1. Ý Nghĩa Phong Thủy & Giá Trị Văn Hóa Của ${title || focusKeyword || "Sản Phẩm Đồ Đồng"}
Chia sẻ nguồn gốc lịch sử, giá trị tâm linh và lý do vì sao người Việt luôn coi trọng vật phẩm này trong không gian thờ tự hoặc phòng khách gia đình...

## 2. Quy Cách Chế Tác & Kỹ Nghệ Đúc Đồng Thủ Công Lộc Nam
Mô tả chi tiết chất liệu đồng đỏ/đồng vàng nguyên chất, kỹ thuật đúc thủ công Ý Yên Nam Định, bề mặt chạm ám tinh xảo, mạ vàng 24K hoặc khảm tam khí, ngũ sắc...

### 2.1. Chất Liệu Đồng Thanh Khiết Không Pha Tạp
Điểm nhấn về hàm lượng đồng trên 90%, độ bền truyền đời và khả năng chống oxy hóa bề mặt...

### 2.2. Kích Thước Lỗ Ban Chuẩn Thước Phong Thủy
Bảng kích thước chuẩn cung cát lành: 45cm, 50cm, 60cm, 65cm, 70cm phù hợp mọi kích thước bàn thờ gia tiên...

## 3. Hướng Dẫn Cách Bài Trí Chuẩn Phong Thủy Rước Tài Lộc
Các bước sắp đặt đúng thứ tự phong thủy gia tiên, hướng an vị, những điều kiêng kỵ cần tránh để gia đạo bình an, phúc lộc trường tồn...

## 4. Báo Giá & Địa Chỉ Mua Tại Xưởng Đúc Đồ Đồng Lộc Nam
Chính sách bảo hành trọn đời, vận chuyển toàn quốc kiểm tra trước thanh toán, cam kết trực tiếp từ nghệ nhân Dương Bá Tiến...`;

  return (
    <div className="bg-[#0e1726] border border-[#d4af37]/30 rounded-2xl overflow-hidden shadow-xl space-y-4">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#111c2e] to-[#0c1420] border-b border-[#d4af37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                Chấm Điểm & Gợi Ý Chuẩn SEO Bài Viết
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${scoreBadge.bgColor} ${scoreBadge.color}`}>
                {scoreBadge.label}
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              Phân tích theo tiêu chuẩn thuật toán Google Search & Rank Math 2026
            </p>
          </div>
        </div>

        {/* Big Score Display */}
        <div className="flex items-center gap-3 bg-[#070c14] px-4 py-2 rounded-xl border border-[#d4af37]/20 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-[10px] uppercase text-[#94a3b8] font-bold">Điểm SEO</div>
            <div className="text-[11px] text-gray-400">Thang điểm 100</div>
          </div>
          <div className={`text-2xl sm:text-3xl font-serif font-black ${scoreBadge.color}`}>
            {seoScore}
            <span className="text-xs font-normal text-gray-400">/100</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4">
        <div className="w-full bg-[#111c2e] h-2 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${scoreBadge.barColor}`}
            style={{ width: `${seoScore}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#94a3b8] mt-1.5">
          <span>{scoreBadge.desc}</span>
          <span>{checks.filter((c) => c.pass).length}/{checks.length} Tiêu chí đạt chuẩn</span>
        </div>
      </div>

      {/* Focus Keyword Input & Suggestions */}
      <div className="px-4 pt-2">
        <div className="p-3.5 bg-[#111c2e] border border-[#d4af37]/20 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Từ Khóa Chính Mục Tiêu (Focus Keyword)</span>
            </label>
            <span className="text-[10px] text-[#94a3b8]">Trọng tâm cần đẩy Top Google</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => {
                setFocusKeyword(e.target.value);
                if (onSetFocusKeyword) onSetFocusKeyword(e.target.value);
              }}
              placeholder="Ví dụ: đồ thờ cúng bằng đồng, quy trình đúc đồng, đỉnh đồng gia tiên..."
              className="w-full px-3.5 py-2 bg-[#0c1420] border border-[#d4af37]/30 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
            {focusKeyword && (
              <button
                type="button"
                onClick={() => setFocusKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Keyword Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-[#94a3b8] flex items-center gap-1">
              <Hash className="w-3 h-3 text-[#d4af37]" /> Gợi ý nhanh:
            </span>
            {suggestedKeywords.map((kw) => (
              <button
                type="button"
                key={kw}
                onClick={() => {
                  setFocusKeyword(kw);
                  if (onSetFocusKeyword) onSetFocusKeyword(kw);
                }}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                  focusKeyword.toLowerCase() === kw.toLowerCase()
                    ? "bg-[#d4af37] text-black font-bold border-[#d4af37]"
                    : "bg-[#070c14] text-[#d4af37] border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#d4af37]/10"
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="px-4">
        <div className="flex border-b border-[#202f45] gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("checklist")}
            className={`pb-2 transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === "checklist"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Bảng Tiêu Chí SEO ({checks.filter((c) => c.pass).length}/{checks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`pb-2 transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === "preview"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem Trước Google SERP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("outline")}
            className={`pb-2 transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === "outline"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Dàn Ý Chuẩn SEO Mẫu</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHECKLIST */}
      {activeTab === "checklist" && (
        <div className="px-4 pb-4 space-y-2.5">
          <div className="divide-y divide-[#202f45]/50 bg-[#111c2e]/60 rounded-xl border border-[#202f45] overflow-hidden">
            {checks.map((item) => (
              <div
                key={item.id}
                className="p-3 sm:p-3.5 flex items-start gap-3 hover:bg-[#152236]/50 transition-colors"
              >
                <div className="mt-0.5 shrink-0">
                  {item.pass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : item.warning ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white truncate">{item.label}</span>
                    <span className="text-[10px] text-[#94a3b8] px-1.5 py-0.5 rounded bg-black/30 border border-white/5 shrink-0">
                      {item.group}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mt-0.5 leading-relaxed ${
                      item.pass
                        ? "text-emerald-400/90"
                        : item.warning
                        ? "text-amber-300/90"
                        : "text-rose-400/90"
                    }`}
                  >
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE SERP PREVIEW */}
      {activeTab === "preview" && (
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#94a3b8]">
              Mô phỏng hiển thị trên trang kết quả tìm kiếm Google (SERP Preview):
            </span>
            <div className="flex items-center gap-1 bg-[#111c2e] p-1 rounded-lg border border-[#202f45]">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1 rounded ${
                  previewDevice === "desktop"
                    ? "bg-[#d4af37] text-black"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Giao diện máy tính"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1 rounded ${
                  previewDevice === "mobile"
                    ? "bg-[#d4af37] text-black"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Giao diện di động"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            className={`bg-white rounded-xl p-4 border border-gray-300 shadow-sm text-left transition-all ${
              previewDevice === "mobile" ? "max-w-sm mx-auto" : "w-full"
            }`}
          >
            {/* SERP URL with breadcrumbs */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-[#0c1825] flex items-center justify-center text-[9px] text-[#d4af37] font-bold">
                LN
              </div>
              <div className="text-[11px] text-[#202124] leading-tight">
                <span className="font-semibold block sm:inline">quatanglocnam.com</span>
                <span className="text-[#5f6368] text-[10px] ml-1">
                  › tin-tuc › {slug || "duong-dan-bai-viet"}
                </span>
              </div>
            </div>

            {/* SERP Title */}
            <h4 className="text-[#1a0dab] hover:underline font-normal text-base sm:text-lg leading-snug cursor-pointer font-sans mb-1 line-clamp-2">
              {title || "Tiêu Đề Bài Viết Chuẩn SEO"} | Đồ Đồng Lộc Nam
            </h4>

            {/* SERP Description */}
            <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2 font-sans">
              {summary ||
                "Đoạn tóm tắt bài viết cẩm nang đồ đồng phong thủy, kinh nghiệm chọn mua đồ thờ cúng gia tiên và kỹ thuật đúc đồng truyền thống từ nghệ nhân Lộc Nam..."}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: OUTLINE TEMPLATE */}
      {activeTab === "outline" && (
        <div className="px-4 pb-4 space-y-3">
          <div className="p-3 bg-[#111c2e] rounded-xl border border-[#d4af37]/20 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-white block">Dàn Ý Chuẩn SEO Nghề Đúc Đồng</span>
              <span className="text-[11px] text-[#94a3b8]">
                Bố cục 4 phần chuẩn chuyên gia: Ý nghĩa phong thủy → Kỹ nghệ đúc → Hướng dẫn bài trí → Báo giá & Bảo hành
              </span>
            </div>
            {onApplyOutline && (
              <button
                type="button"
                onClick={() => onApplyOutline(outlineTemplate)}
                className="px-3.5 py-1.5 bg-[#d4af37] hover:bg-[#b89628] text-black font-bold text-xs rounded-lg transition-all shadow shrink-0 flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Chèn Vào Bài Viết</span>
              </button>
            )}
          </div>

          <pre className="text-[11px] font-mono bg-[#070c14] text-emerald-300 p-3.5 rounded-xl border border-[#202f45] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-56">
            {outlineTemplate}
          </pre>
        </div>
      )}
    </div>
  );
}
