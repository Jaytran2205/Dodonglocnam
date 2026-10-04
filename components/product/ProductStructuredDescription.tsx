"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Award,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Play,
  Video,
} from "lucide-react";
import { ArticleVideoPlayer } from "@/components/common/ArticleVideoPlayer";
import { isRawFilename } from "@/lib/videoUtils";
import { isSafeUrl } from "@/lib/security";

interface ProductStructuredDescriptionProps {
  description?: string | null;
  productName: string;
}

// Extract YouTube ID from various YouTube URL formats
function getYouTubeId(url: string): string | null {
  const cleanUrl = url.trim();
  const match = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// Check if string is a standalone video URL or tag
function parseVideoTag(text: string): { url: string; title?: string } | null {
  const trimmed = text.trim();

  // [video=URL] or [video title="..."]URL[/video] or [video]URL[/video]
  const tagMatch = trimmed.match(/\[video(?:=([^\]\s]+)|\s+title="([^"]*)")?\]([\s\S]*?)\[\/video\]/i);
  if (tagMatch) {
    const url = (tagMatch[1] || tagMatch[3] || "").trim();
    const title = (tagMatch[2] || "").trim() || undefined;
    if (url) return { url, title };
  }

  // Raw YouTube URL
  if (
    trimmed.startsWith("https://www.youtube.com/") ||
    trimmed.startsWith("https://youtube.com/") ||
    trimmed.startsWith("https://youtu.be/")
  ) {
    return { url: trimmed };
  }

  // Raw MP4/WebM/MOV URL or local/API uploaded video
  if (
    trimmed.startsWith("/api/videos/") ||
    trimmed.startsWith("/uploads/videos/") ||
    trimmed.startsWith("/uploads/") ||
    /\.(mp4|webm|ogg|mov|mkv|avi|m4v)(\?.*)?$/i.test(trimmed)
  ) {
    return { url: trimmed };
  }

  return null;
}

// Check if string is an image tag ![alt](url)
function parseImageTag(text: string): { url: string; caption?: string } | null {
  const trimmed = text.trim();
  const mdMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
  if (mdMatch) {
    return { caption: mdMatch[1] || undefined, url: mdMatch[2].trim() };
  }
  return null;
}

// Check if string is a Callout Box [box=gold]...[/box]
function parseBoxTag(text: string): { type: string; content: string } | null {
  const trimmed = text.trim();
  const match = trimmed.match(/^\[box=([a-zA-Z0-9_-]+)\]([\s\S]*?)\[\/box\]$/i);
  if (match) {
    return { type: match[1].toLowerCase(), content: match[2].trim() };
  }
  return null;
}

// Parse markdown table to responsive, luxury React table
export function parseMarkdownTableToReact(tableLines: string[]): React.ReactNode {
  if (tableLines.length < 2) return null;
  const parseRow = (line: string) =>
    line.split("|").slice(1, -1).map((c) => c.trim());

  const headers = parseRow(tableLines[0]);
  const isDivider = (line: string) => /^\s*\|?(\s*:?-+:?\s*\|)+\s*$/.test(line);
  const startRow = isDivider(tableLines[1]) ? 2 : 1;
  const rows = tableLines.slice(startRow).map(parseRow);

  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-[#22384f] bg-[#070e17]/95 shadow-xl">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        {headers.length > 0 && (
          <thead>
            <tr className="bg-[#122234] border-b border-[#22384f] text-[#ffd700] font-serif font-bold">
              {headers.map((h, i) => (
                <th key={i} className="p-3 sm:p-3.5 border-r border-[#22384f] last:border-r-0 tracking-wide">
                  {renderFormattedInline(h)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-[#1c2c3d]/60">
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={rIdx % 2 === 1 ? "bg-[#0b1422]/60 hover:bg-[#122234]/50 transition-colors" : "bg-[#070e17] hover:bg-[#122234]/50 transition-colors"}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-3 sm:p-3.5 border-r border-[#1c2c3d]/60 last:border-r-0 text-[#cbd5e1] leading-relaxed">
                  {renderFormattedInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// High-Performance YouTube Facade: Zero iframes loaded until clicked!
function OptimizedVideoPlayer({ url, title }: { url: string; title?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ytId = getYouTubeId(url);

  if (ytId) {
    if (isPlaying) {
      return (
        <div className="my-6 aspect-video w-full rounded-2xl overflow-hidden border border-[#ffd700]/30 shadow-2xl bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
            title={title || "Video sản phẩm Đồ Đồng Lộc Nam"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      );
    }

    const showCaption = Boolean(title && !isRawFilename(title));

    return (
      <div className="my-6 w-full">
        <div
          onClick={() => setIsPlaying(true)}
          className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-[#1e344d] hover:border-[#ffd700] transition-all duration-300 cursor-pointer shadow-2xl bg-[#060c14] flex items-center justify-center"
        >
          {/* Lazy loaded thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
            alt={showCaption ? title : "Xem video thực tế tác phẩm"}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
          />

          {/* Dark Overlay with luxury gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:via-black/25 transition-opacity" />

          {/* Golden Play Button with pulsing glow */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#dfb755] to-[#ffd700] text-[#070c14] flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(255,215,0,0.8)] transition-all duration-300">
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
            </div>
            <div className="text-center px-4">
              <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ffd700] drop-shadow-md bg-black/60 px-4 py-1.5 rounded-full border border-[#ffd700]/30 backdrop-blur-sm">
                {showCaption ? title : "Xem Video Thực Tế Tác Phẩm"}
              </span>
            </div>
          </div>

          {/* Video badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/75 border border-[#ffd700]/40 text-[#ffd700] text-[11px] font-bold">
            <Video className="w-3.5 h-3.5" />
            <span>HD Video</span>
          </div>
        </div>
        {showCaption && (
          <p className="text-center text-xs text-[#94a3b8] italic mt-2">
            {title}
          </p>
        )}
      </div>
    );
  }

  // Native HTML5 Video
  return <ArticleVideoPlayer url={url} title={title} />;
}

function sanitizeColor(val: string, fallback: string): string {
  if (!val) return fallback;
  const clean = val.trim();
  if (/^(#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?)\([0-9.,\s%]+\)|[a-zA-Z]+)$/.test(clean)) {
    return clean;
  }
  return fallback;
}

// Advanced Markdown & BBCode Visual Parser - Engine by jaydev
// Inline Formatter supporting bold, italic, highlights, font-sizes, colors, links, underlines
export function renderFormattedInline(text: string): React.ReactNode {
  if (!text) return null;

  const regex = /(<mark(?:\s+style=["'][^"']*["'])?>[\s\S]*?<\/mark>|\[highlight=[^\]]+\][\s\S]*?\[\/highlight\]|==[\s\S]*?==|\[size=\d+(?:px)?\][\s\S]*?\[\/size\]|<span\s+style=["'][^"']*font-size:\s*\d+px;?[^"']*["']>[\s\S]*?<\/span>|\[color=[^\]]+\][\s\S]*?\[\/color\]|\[(?:gold|bronze|jade|sky|red|white)\][\s\S]*?\[\/(?:gold|bronze|jade|sky|red|white)\]|<span\s+style=["'][^"']*color:\s*[^"']+["']>[\s\S]*?<\/span>|\[[^\]]+\]\([^)]+\)|<a\s+[^>]*>[\s\S]*?<\/a>|\*\*[\s\S]*?\*\*|<strong>[\s\S]*?<\/strong>|<b>[\s\S]*?<\/b>|\*[\s\S]*?\*|<em>[\s\S]*?<\/em>|<i>[\s\S]*?<\/i>|<u>[\s\S]*?<\/u>|~~[\s\S]*?~~|<s>[\s\S]*?<\/s>|<del>[\s\S]*?<\/del>)/gi;

  const parts = text.split(regex).filter(Boolean);

  return parts.map((part, i) => {
    // 1. Highlight / Bút dạ quang: [highlight=#fef08a]text[/highlight] or [highlight=rgb(...)]text[/highlight]
    const hlMatch = part.match(/^\[highlight=([^\]]+)\]([\s\S]*?)\[\/highlight\]$/i);
    if (hlMatch) {
      const bg = sanitizeColor(hlMatch[1], "#fef08a");
      return (
        <mark
          key={i}
          style={{ backgroundColor: bg, color: "#0f172a" }}
          className="px-1.5 py-0.5 rounded font-semibold inline"
        >
          {renderFormattedInline(hlMatch[2])}
        </mark>
      );
    }

    // 2. Highlight shortcut: ==text==
    if (part.startsWith("==") && part.endsWith("==") && part.length >= 4) {
      return (
        <mark
          key={i}
          className="bg-[#fef08a] text-[#0f172a] px-1.5 py-0.5 rounded font-semibold inline"
        >
          {renderFormattedInline(part.slice(2, -2))}
        </mark>
      );
    }

    // 3. HTML mark tag: <mark ...>text</mark>
    const markTagMatch = part.match(/^<mark(?:\s+style=["'](?:background-color:\s*)?([^"']+)["'])?>([\s\S]*?)<\/mark>$/i);
    if (markTagMatch) {
      const bg = markTagMatch[1] || "#fef08a";
      return (
        <mark
          key={i}
          style={{ backgroundColor: bg, color: "#0f172a" }}
          className="px-1.5 py-0.5 rounded font-semibold inline"
        >
          {renderFormattedInline(markTagMatch[2])}
        </mark>
      );
    }

    // 4. Font size tag: [size=18]text[/size] or [size=22px]text[/size]
    const sizeMatch = part.match(/^\[size=(\d+)(?:px)?\]([\s\S]*?)\[\/size\]$/i);
    if (sizeMatch) {
      const px = parseInt(sizeMatch[1]);
      return (
        <span key={i} style={{ fontSize: `${px}px` }} className="inline">
          {renderFormattedInline(sizeMatch[2])}
        </span>
      );
    }

    // 5. HTML font-size span: <span style="font-size: 18px">text</span>
    const spanSizeMatch = part.match(/^<span\s+style=["'][^"']*font-size:\s*(\d+)px;?[^"']*["']>([\s\S]*?)<\/span>$/i);
    if (spanSizeMatch) {
      const px = parseInt(spanSizeMatch[1]);
      return (
        <span key={i} style={{ fontSize: `${px}px` }} className="inline">
          {renderFormattedInline(spanSizeMatch[2])}
        </span>
      );
    }

    // 6. Markdown link: [text](url)
    const mdLinkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLinkMatch) {
      const label = mdLinkMatch[1];
      const url = mdLinkMatch[2].trim();
      if (!isSafeUrl(url)) {
        return <span key={i}>{renderFormattedInline(label)}</span>;
      }
      const isExternal = url.startsWith("http://") || url.startsWith("https://");
      return (
        <a
          key={i}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[#ffd700] hover:text-[#ffe57f] underline decoration-[#ffd700]/70 hover:decoration-[#ffe57f] underline-offset-4 font-semibold transition-all inline cursor-pointer"
        >
          {renderFormattedInline(label)}
        </a>
      );
    }

    // 7. HTML link: <a href="url"...>label</a>
    const htmlLinkMatch = part.match(/^<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>$/i);
    if (htmlLinkMatch) {
      const url = htmlLinkMatch[1].trim();
      const label = htmlLinkMatch[2];
      if (!isSafeUrl(url)) {
        return <span key={i}>{renderFormattedInline(label)}</span>;
      }
      const isExternal = url.startsWith("http://") || url.startsWith("https://");
      return (
        <a
          key={i}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[#ffd700] hover:text-[#ffe57f] underline decoration-[#ffd700]/70 hover:decoration-[#ffe57f] underline-offset-4 font-semibold transition-all inline cursor-pointer"
        >
          {renderFormattedInline(label)}
        </a>
      );
    }

    // 8. Custom color tag: [color=#ffd700]content[/color] or [color=rgb(...)]content[/color]
    const colorMatch = part.match(/^\[color=([^\]]+)\]([\s\S]*?)\[\/color\]$/i);
    if (colorMatch) {
      const colorVal = sanitizeColor(colorMatch[1], "#ffd700");
      const content = colorMatch[2];
      return (
        <span key={i} style={{ color: colorVal }} className="font-semibold inline">
          {renderFormattedInline(content)}
        </span>
      );
    }

    // 9. HTML span color: <span style="color: #hex">content</span>
    const spanColorMatch = part.match(/^<span\s+style=["'][^"']*color:\s*([^"']+)["']>([\s\S]*?)<\/span>$/i);
    if (spanColorMatch) {
      const colorVal = spanColorMatch[1];
      const content = spanColorMatch[2];
      return (
        <span key={i} style={{ color: colorVal }} className="font-semibold inline">
          {renderFormattedInline(content)}
        </span>
      );
    }

    // 10. Color preset tags: [gold], [bronze], [jade], [sky], [red], [white]
    const presetMatch = part.match(/^\[(gold|bronze|jade|sky|red|white)\]([\s\S]*?)\[\/\1\]$/i);
    if (presetMatch) {
      const preset = presetMatch[1].toLowerCase();
      const content = presetMatch[2];
      const colorMap: Record<string, string> = {
        gold: "#ffd700",
        bronze: "#f59e0b",
        jade: "#10b981",
        sky: "#0ea5e9",
        red: "#ef4444",
        white: "#ffffff",
      };
      return (
        <span key={i} style={{ color: colorMap[preset] || "#ffd700" }} className="font-semibold inline">
          {renderFormattedInline(content)}
        </span>
      );
    }

    // 11. Bold: **content** or <strong>content</strong> or <b>content</b>
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.startsWith("<strong>") && part.endsWith("</strong>")) ||
      (part.startsWith("<b>") && part.endsWith("</b>"))
    ) {
      const inner = part.startsWith("**")
        ? part.slice(2, -2)
        : part.startsWith("<strong>")
        ? part.slice(8, -9)
        : part.slice(3, -4);
      return (
        <strong key={i} className="text-[#f1f5f9] font-bold">
          {renderFormattedInline(inner)}
        </strong>
      );
    }

    // 12. Italic: *content* or <em>content</em> or <i>content</i>
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.startsWith("**")) ||
      (part.startsWith("<em>") && part.endsWith("</em>")) ||
      (part.startsWith("<i>") && part.endsWith("</i>"))
    ) {
      const inner = part.startsWith("*")
        ? part.slice(1, -1)
        : part.startsWith("<em>")
        ? part.slice(4, -5)
        : part.slice(3, -4);
      return (
        <em key={i} className="text-[#e2e8f0] italic">
          {renderFormattedInline(inner)}
        </em>
      );
    }

    // 13. Underline: <u>content</u>
    if (part.startsWith("<u>") && part.endsWith("</u>")) {
      return (
        <u key={i} className="underline decoration-[#dfb755] underline-offset-4">
          {renderFormattedInline(part.slice(3, -4))}
        </u>
      );
    }

    // 14. Strikethrough: ~~content~~ or <s>content</s> or <del>content</del>
    if (
      (part.startsWith("~~") && part.endsWith("~~") && part.length >= 4) ||
      (part.startsWith("<s>") && part.endsWith("</s>")) ||
      (part.startsWith("<del>") && part.endsWith("</del>"))
    ) {
      const inner = part.startsWith("~~")
        ? part.slice(2, -2)
        : part.startsWith("<s>")
        ? part.slice(3, -4)
        : part.slice(5, -6);
      return (
        <del key={i} className="line-through text-gray-500">
          {renderFormattedInline(inner)}
        </del>
      );
    }

    return part;
  });
}

// Callout Box Component: Refined editorial pull-quote style
function CalloutBox({ type, content }: { type: string; content: string }) {
  let borderColor = "border-[#ffd700]";
  let bgColor = "bg-[#ffd700]/5";
  let titleColor = "text-[#ffd700]";
  let BoxIcon = Sparkles;
  let titleText = "Đặc Điểm Nổi Bật";

  switch (type) {
    case "jade":
    case "green":
    case "phongthuy":
      borderColor = "border-[#10b981]";
      bgColor = "bg-[#10b981]/5";
      titleColor = "text-[#10b981]";
      BoxIcon = Star;
      titleText = "Ý Nghĩa Phong Thủy";
      break;
    case "red":
    case "ruby":
    case "camket":
    case "baohanh":
      borderColor = "border-[#ef4444]";
      bgColor = "bg-[#ef4444]/5";
      titleColor = "text-[#ef4444]";
      BoxIcon = ShieldCheck;
      titleText = "Cam Kết & Bảo Hành Trọn Đời";
      break;
    case "blue":
    case "sky":
    case "thongso":
      borderColor = "border-[#0ea5e9]";
      bgColor = "bg-[#0ea5e9]/5";
      titleColor = "text-[#0ea5e9]";
      BoxIcon = Award;
      titleText = "Quy Cách Kỹ Thuật";
      break;
    case "gold":
    default:
      borderColor = "border-[#ffd700]";
      bgColor = "bg-[#ffd700]/5";
      titleColor = "text-[#ffd700]";
      BoxIcon = Sparkles;
      titleText = "Tinh Hoa Nghệ Thuật";
      break;
  }

  return (
    <div className={`my-5 p-4 sm:p-5 rounded-r-xl border-l-4 ${borderColor} ${bgColor} border-y border-r border-white/5 shadow-sm space-y-2`}>
      <div className="flex items-center gap-2 font-serif font-bold text-xs sm:text-sm uppercase tracking-wider pb-2 border-b border-white/10">
        <BoxIcon className={`w-4 h-4 ${titleColor} shrink-0`} />
        <span className={titleColor}>{titleText}</span>
      </div>
      <div className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed pt-1">
        {renderFormattedInline(content)}
      </div>
    </div>
  );
}

export function ProductStructuredDescription({
  description,
  productName,
}: ProductStructuredDescriptionProps) {
  // Normalize content: only fallback to 5-section template if description is completely empty
  const rawText = useMemo(() => {
    if (!description || !description.trim()) {
      return `## 1. Giới Thiệu Tác Phẩm & Cảm Quan Nghệ Thuật
Tác phẩm **${productName}** được trực tiếp chế tác bởi các nghệ nhân lão luyện của thương hiệu **Đồ Đồng Lộc Nam** tại làng nghề đúc đồng truyền thống Ý Yên, Nam Định. Tác phẩm toát lên thần thái trang nghiêm, sang trọng và giá trị thẩm mỹ đỉnh cao với phom dáng cổ kính, đường nét uy nghi và hoa văn đục chạm tinh hoa sâu sắc.

---

## 2. Thông Số Quy Cách & Kỹ Thuật Chế Tác
* **Tên tác phẩm:** ${productName}
* **Chất liệu chế tác:** Đồng nguyên khối thanh khiết chuẩn tuổi Ý Yên
* **Quy trình sản xuất:** Đúc thủ công liền khối, đục tỉa hoa văn thủ công, xử lý bề mặt kỹ lưỡng và phủ nano bảo vệ chống oxy hóa vượt thời gian.
* **Xưởng sản xuất:** Đồ Đồng Lộc Nam - Nam Định

---

## 3. Ý Nghĩa Phong Thủy & Giá Trị Tâm Linh
Đồ đồng mang hành Kim vững bền, giúp dung hòa ngũ hành không gian, thu hút sinh khí đất trời, giữ cho linh khí gia tiên luôn ấm cúng, phù hộ độ trì cho gia chủ bình an, vượng tài đắc lộc và hưng thịnh đời đời.

---

## 4. Vị Trí & Hướng Dẫn Bài Trí Chuẩn Phong Thủy
* **Vị trí bài trí:** An vị tại vị trí trang trọng trong không gian phòng khách, phòng thờ hoặc phòng làm việc theo phong thủy phương vị tài lộc.
* **Vệ sinh bảo quản:** Dùng khăn cotton mềm, khô ráo để lau bụi định kỳ. Tránh dùng chất tẩy rửa hóa học có tính axit mạnh.

---

## 5. Cam Kết Uy Tín Từ Thương Hiệu Đồ Đồng Lộc Nam
* **100% Đồng Chuẩn Thanh Khiết:** Cam kết đồng nguyên chất chuẩn làng nghề Ý Yên – Nam Định, bảo hành chất liệu phôi đồng trọn đời.
* **Kỹ Nghệ Thủ Công Tinh Hoa:** Mỗi tác phẩm là đứa con tinh thần được gọt giũa tỉ mỉ bởi các nghệ nhân giàu kinh nghiệm, đảm bảo tính độc bản và có hồn.
* **Giao Hàng & Kiểm Tra Tận Nơi:** Vận chuyển an toàn toàn quốc, quý khách được mở hàng kiểm tra ưng ý trước khi thanh toán.`;
    }

    return description.trim();
  }, [description, productName]);

  // Parse lines into clean editorial blocks
  const blocks = useMemo(() => {
    const lines = rawText.split("\n");
    const result: React.ReactNode[] = [];

    let currentList: string[] = [];
    let currentTable: string[] = [];
    let inBox: { type: string; lines: string[] } | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        result.push(
          <ul
            key={`list-${result.length}`}
            className="my-3 space-y-2.5 pl-2 text-xs sm:text-[15px] text-[#cbd5e1] leading-relaxed"
          >
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dfb755] shrink-0 mt-2" />
                <span className="flex-1">{renderFormattedInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const flushTable = () => {
      if (currentTable.length > 0) {
        const tableNode = parseMarkdownTableToReact(currentTable);
        if (tableNode) {
          result.push(
            <React.Fragment key={`table-${result.length}`}>
              {tableNode}
            </React.Fragment>
          );
        }
        currentTable = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) {
        flushList();
        flushTable();
        continue;
      }

      // 1. Table rows: | col 1 | col 2 |
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        flushList();
        currentTable.push(trimmed);
        continue;
      } else {
        flushTable();
      }

      // 2. Callout Box: [box=gold] ... [/box]
      const boxStart = trimmed.match(/^\[box=([a-zA-Z0-9_-]+)\]$/i);
      if (boxStart) {
        flushList();
        inBox = { type: boxStart[1].toLowerCase(), lines: [] };
        continue;
      }
      if (trimmed === "[/box]" && inBox) {
        result.push(
          <CalloutBox
            key={`box-${result.length}`}
            type={inBox.type}
            content={inBox.lines.join("\n")}
          />
        );
        inBox = null;
        continue;
      }
      if (inBox) {
        inBox.lines.push(line);
        continue;
      }

      // 3. Single-line Callout Box: [box=gold]content[/box]
      const singleBox = parseBoxTag(trimmed);
      if (singleBox) {
        flushList();
        result.push(
          <CalloutBox
            key={`box-${result.length}`}
            type={singleBox.type}
            content={singleBox.content}
          />
        );
        continue;
      }

      // 4. Standalone Video
      const videoData = parseVideoTag(trimmed);
      if (videoData) {
        flushList();
        result.push(
          <OptimizedVideoPlayer
            key={`v-${result.length}`}
            url={videoData.url}
            title={videoData.title}
          />
        );
        continue;
      }

      // 5. Standalone Image: ![alt](url)
      const imageData = parseImageTag(trimmed);
      if (imageData) {
        flushList();
        result.push(
          <div key={`img-${result.length}`} className="my-6 text-center">
            <img
              src={imageData.url}
              alt={imageData.caption || productName}
              loading="lazy"
              decoding="async"
              className="rounded-xl border border-[#22384f] max-h-[550px] mx-auto object-contain shadow-xl"
            />
            {imageData.caption && (
              <p className="text-center text-xs text-[#94a3b8] italic mt-2.5">
                {imageData.caption}
              </p>
            )}
          </div>
        );
        continue;
      }

      // 6. Horizontal Divider: --- or ***
      if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
        flushList();
        result.push(
          <hr key={`hr-${result.length}`} className="my-8 border-t border-[#1c2c3d]/80" />
        );
        continue;
      }

      // 7. Headings: #, ##, ###, ####
      if (trimmed.startsWith("## ")) {
        flushList();
        const hText = trimmed.replace(/^##\s+/, "");
        result.push(
          <h2
            key={`h2-${result.length}`}
            className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#ffd700] mt-8 mb-4 pb-2 border-b border-[#ffd700]/30 flex items-center gap-3 tracking-wide"
          >
            <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#ffd700] to-[#b8860b] shrink-0" />
            <span>{renderFormattedInline(hText)}</span>
          </h2>
        );
        continue;
      }

      if (trimmed.startsWith("### ")) {
        flushList();
        const hText = trimmed.replace(/^###\s+/, "");
        result.push(
          <h3
            key={`h3-${result.length}`}
            className="font-serif font-bold text-base sm:text-lg md:text-xl text-[#fce9b5] mt-6 mb-3 pb-1.5 border-b border-[#1c2c3d] flex items-center gap-2.5"
          >
            <span className="w-1.5 h-4 rounded-full bg-[#dfb755] shrink-0" />
            <span>{renderFormattedInline(hText)}</span>
          </h3>
        );
        continue;
      }

      if (trimmed.startsWith("#### ")) {
        flushList();
        const hText = trimmed.replace(/^####\s+/, "");
        result.push(
          <h4
            key={`h4-${result.length}`}
            className="font-serif font-semibold text-sm sm:text-base text-[#f1f5f9] mt-4 mb-2"
          >
            {renderFormattedInline(hText)}
          </h4>
        );
        continue;
      }

      // 8. Bullet Lists: * item or - item
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        currentList.push(trimmed.replace(/^[\*\-]\s+/, ""));
        continue;
      } else {
        flushList();
      }

      // 9. Text alignment wrapper: <p style="text-align: (center|justify|right|left)">...<\/p>
      const alignMatch = trimmed.match(/^<p style="text-align:\s*(center|justify|right|left);?">([\s\S]*?)<\/p>$/i);
      if (alignMatch) {
        result.push(
          <p
            key={`p-align-${result.length}`}
            style={{ textAlign: alignMatch[1] as any }}
            className="my-3.5 leading-[1.8] text-xs sm:text-[15px] text-[#cbd5e1]"
          >
            {renderFormattedInline(alignMatch[2])}
          </p>
        );
        continue;
      }

      // 10. Standard Paragraph
      result.push(
        <p
          key={`p-${result.length}`}
          className="my-3.5 leading-[1.8] text-xs sm:text-[15px] text-[#cbd5e1] tracking-normal"
        >
          {renderFormattedInline(trimmed)}
        </p>
      );
    }

    flushList();
    flushTable();

    return result;
  }, [rawText, productName]);

  return (
    <article className="editorial-content max-w-none text-[#cbd5e1] selection:bg-[#dfb755]/30">
      {blocks}
    </article>
  );
}
