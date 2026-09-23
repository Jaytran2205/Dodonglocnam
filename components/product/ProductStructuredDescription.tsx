"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Award,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Play,
  Video,
  Info,
  Layers,
  ChevronRight,
} from "lucide-react";

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

  // [video=URL] or [video title="..."]URL[/video]
  const tagMatch = trimmed.match(/^\[video(?:=([^\]\s]+)|\s+title="([^"]+)")?\](?:([^\[]+)\[\/video\])?$/i);
  if (tagMatch) {
    const url = (tagMatch[1] || tagMatch[3] || "").trim();
    const title = tagMatch[2] || undefined;
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

  // Raw MP4/WebM URL
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
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

// High-Performance YouTube Facade: Zero iframes loaded until clicked!
function OptimizedVideoPlayer({ url, title }: { url: string; title?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ytId = getYouTubeId(url);

  if (ytId) {
    if (isPlaying) {
      return (
        <div className="my-5 aspect-video w-full rounded-2xl overflow-hidden border border-[#ffd700]/30 shadow-2xl bg-black">
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

    return (
      <div className="my-5 w-full">
        <div
          onClick={() => setIsPlaying(true)}
          className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-[#1e344d] hover:border-[#ffd700] transition-all duration-300 cursor-pointer shadow-2xl bg-[#060c14] flex items-center justify-center"
        >
          {/* Lazy loaded thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
            alt={title || "Xem video thực tế tác phẩm"}
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
                {title || "Xem Video Thực Tế Tác Phẩm"}
              </span>
            </div>
          </div>

          {/* Video badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/75 border border-[#ffd700]/40 text-[#ffd700] text-[11px] font-bold">
            <Video className="w-3.5 h-3.5" />
            <span>HD Video</span>
          </div>
        </div>
        {title && (
          <p className="text-center text-xs text-[#94a3b8] italic mt-2">
            {title}
          </p>
        )}
      </div>
    );
  }

  // Native HTML5 Video
  return (
    <div className="my-5 w-full">
      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#1e344d] bg-black shadow-2xl">
        <video
          src={url}
          controls
          preload="none"
          playsInline
          className="w-full h-full object-contain"
        >
          Trình duyệt của bạn không hỗ trợ phát video HTML5.
        </video>
      </div>
      {title && (
        <p className="text-center text-xs text-[#94a3b8] italic mt-2">{title}</p>
      )}
    </div>
  );
}

// Inline Formatter supporting bold, italic, colors, underlines
export function renderFormattedInline(text: string): React.ReactNode {
  const regex = /(\[color=(#[a-fA-F0-9]{3,8}|[a-zA-Z]+)\][\s\S]*?\[\/color\]|\[(gold|bronze|jade|sky|red|white)\][\s\S]*?\[\/\2\]|\*\*[\s\S]*?\*\*|\*[\s\S]*?\*|<u>[\s\S]*?<\/u>|~~[\s\S]*?~~)/g;

  const parts = text.split(regex).filter(Boolean);

  return parts.map((part, i) => {
    // Custom color tag: [color=#ffd700]content[/color]
    const colorMatch = part.match(/^\[color=(#[a-fA-F0-9]{3,8}|[a-zA-Z]+)\]([\s\S]*?)\[\/color\]$/i);
    if (colorMatch) {
      const colorVal = colorMatch[1];
      const content = colorMatch[2];
      return (
        <span key={i} style={{ color: colorVal }} className="font-semibold">
          {renderFormattedInline(content)}
        </span>
      );
    }

    // Color preset tags: [gold], [bronze], [jade], [sky], [red], [white]
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
        <span key={i} style={{ color: colorMap[preset] || "#ffd700" }} className="font-semibold">
          {renderFormattedInline(content)}
        </span>
      );
    }

    // Bold: **content**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="text-[#ffd700] font-bold">
          {renderFormattedInline(part.slice(2, -2))}
        </strong>
      );
    }

    // Italic: *content*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.startsWith("**")) {
      return (
        <em key={i} className="text-[#f1f5f9] italic">
          {renderFormattedInline(part.slice(1, -1))}
        </em>
      );
    }

    // Underline: <u>content</u>
    if (part.startsWith("<u>") && part.endsWith("</u>")) {
      return (
        <u key={i} className="underline decoration-[#dfb755] underline-offset-4">
          {renderFormattedInline(part.slice(3, -4))}
        </u>
      );
    }

    // Strikethrough: ~~content~~
    if (part.startsWith("~~") && part.endsWith("~~") && part.length >= 4) {
      return (
        <del key={i} className="line-through text-gray-500">
          {renderFormattedInline(part.slice(2, -2))}
        </del>
      );
    }

    return part;
  });
}

// Callout Box Component
function CalloutBox({ type, content }: { type: string; content: string }) {
  let borderColor = "border-[#ffd700]/40";
  let bgColor = "bg-[#ffd700]/5";
  let titleColor = "text-[#ffd700]";
  let BoxIcon = Sparkles;
  let titleText = "Đặc Điểm Nổi Bật";

  switch (type) {
    case "jade":
    case "green":
    case "phongthuy":
      borderColor = "border-[#10b981]/40";
      bgColor = "bg-[#10b981]/5";
      titleColor = "text-[#10b981]";
      BoxIcon = Star;
      titleText = "Ý Nghĩa Phong Thủy";
      break;
    case "red":
    case "ruby":
    case "camket":
    case "baohanh":
      borderColor = "border-[#ef4444]/40";
      bgColor = "bg-[#ef4444]/5";
      titleColor = "text-[#ef4444]";
      BoxIcon = ShieldCheck;
      titleText = "Cam Kết & Bảo Hành Trọn Đời";
      break;
    case "blue":
    case "sky":
    case "thongso":
      borderColor = "border-[#0ea5e9]/40";
      bgColor = "bg-[#0ea5e9]/5";
      titleColor = "text-[#0ea5e9]";
      BoxIcon = Award;
      titleText = "Quy Cách Kỹ Thuật";
      break;
    case "gold":
    default:
      borderColor = "border-[#ffd700]/40";
      bgColor = "bg-[#ffd700]/5";
      titleColor = "text-[#ffd700]";
      BoxIcon = Sparkles;
      titleText = "Tinh Hoa Nghệ Thuật";
      break;
  }

  return (
    <div className={`my-4 p-4 sm:p-5 rounded-2xl border ${borderColor} ${bgColor} shadow-lg space-y-2`}>
      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-wider pb-2 border-b border-white/10">
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
  if (!description || !description.trim()) {
    return (
      <div className="rounded-xl bg-[#070e17]/85 border border-[#1c2c3d] p-5">
        <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
          Tác phẩm <strong className="text-[#ffd700]">{productName}</strong> được trực tiếp chế tác bởi các nghệ nhân lão luyện của thương hiệu <strong className="text-[#ffd700]">Đồ Đồng Lộc Nam</strong> tại làng nghề đúc đồng truyền thống Ý Yên, Nam Định. Sản phẩm được đúc từ nguồn đồng chuẩn thanh khiết, trải qua đầy đủ quy trình nghiêm ngặt: tạo mẫu đắp đất, làm khuôn chịu nhiệt 2 lớp, nấu đồng ở nhiệt độ cao trên 1200 độ C, rót đồng nguyên khối, chạm trổ hoa văn tinh xảo thủ công và xử lý mạ vàng 24k hoặc phun bóng bảo vệ bề mặt chống oxy hóa vượt thời gian.
        </p>
      </div>
    );
  }

  // Parse sections based on "###" headers
  const rawSections = description.split(/(?=###\s+)/g).filter(Boolean);

  if (rawSections.length <= 1 && !description.includes("###")) {
    const paragraphs = description.split(/\n\s*\n|\n(?=[*-]\s)/g).filter((p) => p.trim());
    return (
      <div className="space-y-4 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
        {paragraphs.map((p, idx) => {
          const trimmed = p.trim();

          // Check if paragraph is a video
          const videoData = parseVideoTag(trimmed);
          if (videoData) {
            return (
              <OptimizedVideoPlayer
                key={idx}
                url={videoData.url}
                title={videoData.title}
              />
            );
          }

          // Check if paragraph is an image
          const imageData = parseImageTag(trimmed);
          if (imageData) {
            return (
              <div key={idx} className="my-4 text-center">
                <img
                  src={imageData.url}
                  alt={imageData.caption || productName}
                  loading="lazy"
                  decoding="async"
                  className="rounded-2xl border border-[#1e344d] max-h-[550px] mx-auto object-contain shadow-2xl"
                />
                {imageData.caption && (
                  <p className="text-xs text-[#94a3b8] italic mt-2">
                    {imageData.caption}
                  </p>
                )}
              </div>
            );
          }

          // Check if paragraph is a Callout Box
          const boxData = parseBoxTag(trimmed);
          if (boxData) {
            return (
              <CalloutBox
                key={idx}
                type={boxData.type}
                content={boxData.content}
              />
            );
          }

          // Bullet list items
          if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            const items = trimmed
              .split(/\n[*-]\s+/)
              .map((it) => it.replace(/^[*-]\s+/, "").trim())
              .filter(Boolean);
            return (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                {items.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#070e17]/85 border border-[#1c2c3d]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#dfb755] shrink-0 mt-0.5" />
                    <span>{renderFormattedInline(it)}</span>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div key={idx} className="rounded-xl bg-[#070e17]/85 border border-[#1c2c3d] p-4 sm:p-5">
              <p>{renderFormattedInline(trimmed)}</p>
            </div>
          );
        })}
      </div>
    );
  }

  // Structured multi-section rendering
  return (
    <div className="space-y-4">
      {rawSections.map((sec, secIdx) => {
        const lines = sec.trim().split("\n");
        let headerText = "";
        let contentLines: string[] = [];

        if (lines[0].startsWith("###")) {
          headerText = lines[0].replace(/^###\s+/, "").trim();
          contentLines = lines.slice(1);
        } else {
          contentLines = lines;
        }

        const filteredContent = contentLines.filter((l) => l.trim() !== "---");
        const hLower = headerText.toLowerCase();

        let SectionIcon = Sparkles;
        let iconColor = "text-[#ffd700]";
        let badgeText = "Chi Tiết";

        if (hLower.includes("tổng quan") || hLower.includes("giới thiệu")) {
          SectionIcon = Sparkles;
          iconColor = "text-[#ffd700]";
          badgeText = "Nghệ Thuật";
        } else if (
          hLower.includes("chế tác") ||
          hLower.includes("thông số") ||
          hLower.includes("quy cách") ||
          hLower.includes("kỹ thuật")
        ) {
          SectionIcon = Award;
          iconColor = "text-[#38bdf8]";
          badgeText = "Kỹ Thuật";
        } else if (
          hLower.includes("tâm linh") ||
          hLower.includes("phong thủy") ||
          hLower.includes("ý nghĩa") ||
          hLower.includes("giá trị")
        ) {
          SectionIcon = Star;
          iconColor = "text-[#fbbf24]";
          badgeText = "Phong Thủy";
        } else if (
          hLower.includes("an vị") ||
          hLower.includes("bài trí") ||
          hLower.includes("vị trí") ||
          hLower.includes("không gian")
        ) {
          SectionIcon = MapPin;
          iconColor = "text-[#34d399]";
          badgeText = "Bài Trí";
        } else if (
          hLower.includes("cam kết") ||
          hLower.includes("uy tín") ||
          hLower.includes("bảo hành")
        ) {
          SectionIcon = ShieldCheck;
          iconColor = "text-[#f43f5e]";
          badgeText = "Cam Kết";
        }

        const listItems: string[] = [];
        const nonListBlocks: React.ReactNode[] = [];

        let currentParagraph = "";

        const flushParagraph = () => {
          if (currentParagraph.trim()) {
            const p = currentParagraph.trim();
            const videoData = parseVideoTag(p);
            if (videoData) {
              nonListBlocks.push(
                <OptimizedVideoPlayer
                  key={`v-${nonListBlocks.length}`}
                  url={videoData.url}
                  title={videoData.title}
                />
              );
            } else {
              const imageData = parseImageTag(p);
              if (imageData) {
                nonListBlocks.push(
                  <div key={`img-${nonListBlocks.length}`} className="my-4 text-center">
                    <img
                      src={imageData.url}
                      alt={imageData.caption || productName}
                      loading="lazy"
                      decoding="async"
                      className="rounded-2xl border border-[#1e344d] max-h-[550px] mx-auto object-contain shadow-2xl"
                    />
                    {imageData.caption && (
                      <p className="text-xs text-[#94a3b8] italic mt-2">
                        {imageData.caption}
                      </p>
                    )}
                  </div>
                );
              } else {
                const boxData = parseBoxTag(p);
                if (boxData) {
                  nonListBlocks.push(
                    <CalloutBox
                      key={`box-${nonListBlocks.length}`}
                      type={boxData.type}
                      content={boxData.content}
                    />
                  );
                } else {
                  nonListBlocks.push(
                    <p key={`p-${nonListBlocks.length}`} className="leading-relaxed">
                      {renderFormattedInline(p)}
                    </p>
                  );
                }
              }
            }
            currentParagraph = "";
          }
        };

        for (const line of filteredContent) {
          const t = line.trim();
          if (!t) {
            flushParagraph();
            continue;
          }

          if (t.startsWith("* ") || t.startsWith("- ")) {
            flushParagraph();
            listItems.push(t.replace(/^[*-]\s+/, ""));
          } else {
            if (parseVideoTag(t) || parseImageTag(t) || parseBoxTag(t)) {
              flushParagraph();
              currentParagraph = t;
              flushParagraph();
            } else {
              if (currentParagraph) currentParagraph += " " + t;
              else currentParagraph = t;
            }
          }
        }
        flushParagraph();

        return (
          <div
            key={secIdx}
            className="rounded-2xl bg-[#070e17]/85 border border-[#1c2c3d] p-5 sm:p-6 shadow-md hover:border-[#dfb755]/50 transition-colors"
          >
            {headerText && (
              <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-[#1c2c3d]">
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#ffd700] flex items-center gap-2">
                  <SectionIcon className={`w-4 h-4 ${iconColor} shrink-0`} />
                  <span>{headerText}</span>
                </h4>
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#122234] border border-[#1c2c3d] text-[#94a3b8] font-semibold hidden sm:inline-block">
                  {badgeText}
                </span>
              </div>
            )}

            {nonListBlocks.length > 0 && (
              <div className="space-y-3 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mb-3">
                {nonListBlocks}
              </div>
            )}

            {listItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#cbd5e1] pt-1">
                {listItems.map((item, itIdx) => (
                  <div
                    key={itIdx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0b1422]/80 border border-[#1c2c3d]/60 hover:border-[#ffd700]/30 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb755] shrink-0 mt-0.5" />
                    <span className="leading-snug">{renderFormattedInline(item)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
