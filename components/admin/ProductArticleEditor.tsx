"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  CheckSquare,
  Video,
  Image as ImageIcon,
  Palette,
  Layout,
  Maximize2,
  Minimize2,
  Eye,
  Edit3,
  Columns,
  Sparkles,
  Link as LinkIcon,
  Upload,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Film,
  FileVideo,
  Loader2,
  X,
  Plus,
  Play,
  HelpCircle,
  FileText,
  Code,
  Type,
} from "lucide-react";
import { ProductStructuredDescription } from "@/components/product/ProductStructuredDescription";
import { useToast } from "@/components/admin/AdminToast";

interface ProductArticleEditorProps {
  value: string;
  onChange: (val: string) => void;
  productName?: string;
}

// ---------------------------------------------------------------------------
// CONVERTER 1: Markdown / BBCode -> HTML for Visual WYSIWYG Editor
// ---------------------------------------------------------------------------
export function markdownToHtml(md: string): string {
  if (!md) return "<p><br></p>";

  const lines = md.split("\n");
  const htmlBlocks: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      htmlBlocks.push(
        `<ul class="list-disc pl-6 my-2 space-y-1">${listItems
          .map((item) => `<li>${formatInline(item)}</li>`)
          .join("")}</ul>`
      );
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (text: string): string => {
    let res = text;

    // Color tags: [color=#hex]text[/color]
    res = res.replace(
      /\[color=(#[a-fA-F0-9]{3,8}|[a-zA-Z]+)\]([\s\S]*?)\[\/color\]/gi,
      '<span style="color: $1; font-weight: 600;">$2</span>'
    );

    // Preset color tags: [gold]...[/gold]
    const colorMap: Record<string, string> = {
      gold: "#b45309",
      bronze: "#d97706",
      jade: "#059669",
      sky: "#0284c7",
      red: "#dc2626",
      white: "#1e293b",
    };
    res = res.replace(
      /\[(gold|bronze|jade|sky|red|white)\]([\s\S]*?)\[\/\1\]/gi,
      (m, color, content) =>
        `<span style="color: ${colorMap[color.toLowerCase()] || "#b45309"}; font-weight: 600;">${content}</span>`
    );

    // Bold: **text**
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');

    // Italic: *text* (not surrounded by other asterisks)
    res = res.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em class="italic text-slate-700">$2</em>$3');

    // Underline: <u>text</u>
    res = res.replace(/<u>([\s\S]*?)<\/u>/gi, '<u class="underline decoration-amber-500 underline-offset-4">$1</u>');

    // Strikethrough: ~~text~~
    res = res.replace(/~~([\s\S]*?)~~/g, '<s class="line-through text-slate-400">$1</s>');

    return res;
  };

  let inBox: { type: string; lines: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check for callout box [box=gold]...[/box]
    const boxStartMatch = trimmed.match(/^\[box=([a-zA-Z0-9_-]+)\]$/i);
    if (boxStartMatch) {
      flushList();
      inBox = { type: boxStartMatch[1].toLowerCase(), lines: [] };
      continue;
    }
    if (trimmed === "[/box]" && inBox) {
      const boxType = inBox.type;
      const content = inBox.lines.join("<br/>");
      const boxClasses: Record<string, string> = {
        gold: "bg-amber-50/90 border-amber-400 text-amber-950",
        jade: "bg-emerald-50/90 border-emerald-400 text-emerald-950",
        red: "bg-rose-50/90 border-rose-400 text-rose-950",
        blue: "bg-sky-50/90 border-sky-400 text-sky-950",
      };
      const cls = boxClasses[boxType] || "bg-amber-50/90 border-amber-400 text-amber-950";
      htmlBlocks.push(
        `<div data-box="${boxType}" class="my-4 p-4 rounded-xl border-2 ${cls} font-medium shadow-sm leading-relaxed">${formatInline(
          content
        )}</div>`
      );
      inBox = null;
      continue;
    }
    if (inBox) {
      inBox.lines.push(rawLine);
      continue;
    }

    // Inline box single-line: [box=gold]content[/box]
    const singleBoxMatch = trimmed.match(/^\[box=([a-zA-Z0-9_-]+)\]([\s\S]*?)\[\/box\]$/i);
    if (singleBoxMatch) {
      flushList();
      const bType = singleBoxMatch[1].toLowerCase();
      htmlBlocks.push(
        `<div data-box="${bType}" class="my-4 p-4 rounded-xl border-2 bg-amber-50 border-amber-400 text-amber-950 font-medium shadow-sm">${formatInline(
          singleBoxMatch[2]
        )}</div>`
      );
      continue;
    }

    // Video tag: [video title="..."]URL[/video] or [video=URL] or raw YouTube or uploaded video
    const videoMatch = trimmed.match(/^\[video(?:=([^\]\s]+)|\s+title="([^"]+)")?\](?:([^\[]+)\[\/video\])?$/i);
    if (videoMatch) {
      flushList();
      const vUrl = (videoMatch[1] || videoMatch[3] || "").trim();
      const vTitle = videoMatch[2] || "Video sản phẩm";
      const isDirectVideo = !vUrl.includes("youtube.com") && !vUrl.includes("youtu.be");
      htmlBlocks.push(
        `<div data-video="${vUrl}" data-title="${vTitle}" class="my-5 p-3 rounded-2xl border-2 border-rose-500/40 bg-[#0c1825] text-white shadow-xl select-none">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-rose-500/30 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>${isDirectVideo ? "Video Tải Lên" : "Video YouTube"}: ${vTitle}</span>
            </div>
            <span class="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">${vUrl}</span>
          </div>
          ${isDirectVideo ? `
            <div class="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <video src="${vUrl}" controls playsinline preload="metadata" class="w-full h-full object-contain"></video>
            </div>
          ` : `
            <div class="p-3 bg-rose-950/40 rounded-xl text-xs text-rose-200 font-medium">▶ [Video YouTube: ${vTitle} - ${vUrl}]</div>
          `}
          ${vTitle ? `<p class="text-center text-xs text-rose-200/80 italic mt-2">${vTitle}</p>` : ""}
        </div>`
      );
      continue;
    }
    if (
      trimmed.startsWith("https://www.youtube.com/") ||
      trimmed.startsWith("https://youtube.com/") ||
      trimmed.startsWith("https://youtu.be/")
    ) {
      flushList();
      htmlBlocks.push(
        `<div data-video="${trimmed}" class="my-4 p-3 rounded-xl border-2 border-rose-400 bg-rose-50 text-rose-900 font-semibold flex items-center gap-2 shadow-sm cursor-pointer select-none">▶ [Video YouTube: ${trimmed}]</div>`
      );
      continue;
    }
    if (
      trimmed.startsWith("/api/videos/") ||
      trimmed.startsWith("/uploads/videos/") ||
      /\.(mp4|webm|ogg|mov|mkv|avi)(\?.*)?$/i.test(trimmed)
    ) {
      flushList();
      htmlBlocks.push(
        `<div data-video="${trimmed}" data-title="Video tải lên" class="my-5 p-3 rounded-2xl border-2 border-rose-500/40 bg-[#0c1825] text-white shadow-xl select-none">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-rose-500/30 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Video Tải Lên</span>
            </div>
            <span class="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">${trimmed}</span>
          </div>
          <div class="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
            <video src="${trimmed}" controls playsinline preload="metadata" class="w-full h-full object-contain"></video>
          </div>
        </div>`
      );
      continue;
    }

    // Image tag: ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushList();
      const alt = imgMatch[1];
      const src = imgMatch[2];
      htmlBlocks.push(
        `<div class="my-4 text-center"><img src="${src}" alt="${alt}" class="max-h-72 rounded-xl mx-auto shadow-md border border-slate-200 object-contain" />${
          alt ? `<p class="text-xs text-slate-500 italic mt-1.5">${alt}</p>` : ""
        }</div>`
      );
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushList();
      const hText = trimmed.replace(/^###\s+/, "");
      htmlBlocks.push(
        `<h3 class="text-lg font-bold text-amber-800 mt-5 mb-2 pb-1 border-b border-amber-200 flex items-center gap-2">${formatInline(
          hText
        )}</h3>`
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      const hText = trimmed.replace(/^##\s+/, "");
      htmlBlocks.push(
        `<h2 class="text-xl font-bold text-amber-900 mt-6 mb-3 pb-1.5 border-b-2 border-amber-400 flex items-center gap-2">${formatInline(
          hText
        )}</h2>`
      );
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      flushList();
      const hText = trimmed.replace(/^####\s+/, "");
      htmlBlocks.push(
        `<h4 class="text-base font-bold text-slate-800 mt-4 mb-1.5">${formatInline(hText)}</h4>`
      );
      continue;
    }

    // Bullet List Items: * item or - item
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      inList = true;
      listItems.push(trimmed.replace(/^[\*\-]\s+/, ""));
      continue;
    } else {
      flushList();
    }

    // Empty line
    if (!trimmed) {
      continue;
    }

    // Standard Paragraph
    htmlBlocks.push(
      `<p class="my-2.5 leading-relaxed text-slate-800">${formatInline(trimmed)}</p>`
    );
  }

  flushList();

  return htmlBlocks.length > 0 ? htmlBlocks.join("\n") : "<p><br></p>";
}

// ---------------------------------------------------------------------------
// CONVERTER 2: HTML DOM -> Markdown / BBCode for Saving & Public Viewing
// ---------------------------------------------------------------------------
export function htmlToMarkdown(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function nodeToMd(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    // Check custom data attributes first
    const boxType = el.getAttribute("data-box");
    if (boxType) {
      const boxText = Array.from(el.childNodes).map(nodeToMd).join("").trim();
      return `\n\n[box=${boxType}]\n${boxText}\n[/box]\n\n`;
    }

    const videoUrl = el.getAttribute("data-video");
    if (videoUrl) {
      const videoTitle = el.getAttribute("data-title");
      if (videoTitle && videoTitle !== "Video sản phẩm") {
        return `\n\n[video title="${videoTitle}"]${videoUrl}[/video]\n\n`;
      }
      return `\n\n[video]${videoUrl}[/video]\n\n`;
    }

    // Recursive child markdown
    const childrenMd = Array.from(el.childNodes).map(nodeToMd).join("");

    if (tag === "h2") {
      const text = childrenMd.trim();
      return text ? `\n\n## ${text}\n\n` : "";
    }
    if (tag === "h3") {
      const text = childrenMd.trim();
      return text ? `\n\n### ${text}\n\n` : "";
    }
    if (tag === "h4") {
      const text = childrenMd.trim();
      return text ? `\n\n#### ${text}\n\n` : "";
    }

    if (tag === "strong" || tag === "b") {
      if (!childrenMd.trim()) return "";
      return `**${childrenMd}**`;
    }
    if (tag === "em" || tag === "i") {
      if (!childrenMd.trim()) return "";
      return `*${childrenMd}*`;
    }
    if (tag === "u") {
      if (!childrenMd.trim()) return "";
      return `<u>${childrenMd}</u>`;
    }
    if (tag === "s" || tag === "strike" || tag === "del") {
      if (!childrenMd.trim()) return "";
      return `~~${childrenMd}~~`;
    }

    if (tag === "img") {
      const src = el.getAttribute("src") || "";
      const alt = el.getAttribute("alt") || "";
      return `\n\n![${alt}](${src})\n\n`;
    }

    if (tag === "li") {
      const text = childrenMd.trim();
      return text ? `\n* ${text}` : "";
    }
    if (tag === "ul" || tag === "ol") {
      return `\n${childrenMd}\n\n`;
    }
    if (tag === "p") {
      const text = childrenMd.trim();
      return text ? `\n\n${text}\n\n` : "";
    }
    if (tag === "br") {
      return "\n";
    }
    if (tag === "div") {
      const text = childrenMd.trim();
      return text ? `\n\n${text}\n\n` : "";
    }

    // Color span
    if (tag === "span" || tag === "font") {
      const color = el.style.color || el.getAttribute("color");
      if (color) {
        return `[color=${color}]${childrenMd}[/color]`;
      }
    }

    return childrenMd;
  }

  const rawMd = Array.from(doc.body.childNodes).map(nodeToMd).join("");

  // Clean up excessive empty lines
  return rawMd
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+/, "")
    .replace(/\s+$/, "");
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT: ProductArticleEditor
// ---------------------------------------------------------------------------
export function ProductArticleEditor({
  value,
  onChange,
  productName = "Sản phẩm Đồ Đồng Lộc Nam",
}: ProductArticleEditorProps) {
  const { toastSuccess, toastError, toastWarning, confirm: showConfirm } = useToast();
  // Tabs: "visual" (WYSIWYG - default), "code" (raw Markdown), "preview" (web preview), "split" (side-by-side)
  const [activeTab, setActiveTab] = useState<"visual" | "code" | "preview" | "split">("visual");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBoxPicker, setShowBoxPicker] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Video modal form state
  const [videoTab, setVideoTab] = useState<"upload" | "link">("upload");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadStatus, setVideoUploadStatus] = useState<string>("");
  const [videoFileMeta, setVideoFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [isDragOverVideo, setIsDragOverVideo] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Image modal form state
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Custom Color State
  const [customHexColor, setCustomHexColor] = useState("#b45309");

  // DOM Refs
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isUpdatingFromInternalRef = useRef(false);

  // Sync value to visual editor when value changes externally (e.g. template inserted or product loaded)
  useEffect(() => {
    if (isUpdatingFromInternalRef.current) {
      isUpdatingFromInternalRef.current = false;
      return;
    }
    if (visualEditorRef.current) {
      const newHtml = markdownToHtml(value);
      if (visualEditorRef.current.innerHTML !== newHtml) {
        visualEditorRef.current.innerHTML = newHtml;
      }
    }
  }, [value, activeTab]);

  // Handle Visual Editor Input (typing or pasting)
  const handleVisualInput = useCallback(() => {
    if (!visualEditorRef.current) return;
    isUpdatingFromInternalRef.current = true;
    const currentHtml = visualEditorRef.current.innerHTML;
    const newMarkdown = htmlToMarkdown(currentHtml);
    onChange(newMarkdown);
  }, [onChange]);

  // Execute formatting command in Visual Mode
  const execVisualCmd = (command: string, arg: string | undefined = undefined) => {
    if (activeTab === "visual" || activeTab === "split") {
      visualEditorRef.current?.focus();
      document.execCommand(command, false, arg);
      handleVisualInput();
    }
  };

  // Helper to wrap selected text in Textarea (Code mode)
  const wrapSelection = (before: string, after: string, defaultPlaceholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultPlaceholder;

    const replacement = `${before}${selectedText}${after}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 10);
  };

  // Insert text at cursor (Code mode)
  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.substring(0, start) + textToInsert + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 10);
  };

  // Unified Formatting Handlers (Work for both Visual and Code mode)
  const handleBold = () => {
    if (activeTab === "visual" || activeTab === "split") {
      execVisualCmd("bold");
    } else {
      wrapSelection("**", "**", "chữ in đậm");
    }
  };

  const handleItalic = () => {
    if (activeTab === "visual" || activeTab === "split") {
      execVisualCmd("italic");
    } else {
      wrapSelection("*", "*", "chữ in nghiêng");
    }
  };

  const handleUnderline = () => {
    if (activeTab === "visual" || activeTab === "split") {
      execVisualCmd("underline");
    } else {
      wrapSelection("<u>", "</u>", "chữ gạch chân");
    }
  };

  const handleStrikethrough = () => {
    if (activeTab === "visual" || activeTab === "split") {
      execVisualCmd("strikeThrough");
    } else {
      wrapSelection("~~", "~~", "chữ gạch ngang");
    }
  };

  const handleHeading3 = () => {
    if (activeTab === "visual" || activeTab === "split") {
      execVisualCmd("formatBlock", "<h3>");
    } else {
      insertAtCursor("\n\n### Tiêu Đề Mục (H3)\n");
    }
  };

  const handleHeading2 = () => {
    if (activeTab === "visual" || activeTab === "split") {
      execVisualCmd("formatBlock", "<h2>");
    } else {
      insertAtCursor("\n\n## Tiêu Đề Lớn (H2)\n");
    }
  };

  const handleList = () => {
    if (activeTab === "visual" || activeTab === "split") {
      execVisualCmd("insertUnorderedList");
    } else {
      insertAtCursor("\n* ");
    }
  };

  const applyColor = (hex: string) => {
    if (activeTab === "visual" || activeTab === "split") {
      execVisualCmd("foreColor", hex);
    } else {
      wrapSelection(`[color=${hex}]`, `[/color]`, "văn bản màu sắc");
    }
    setShowColorPicker(false);
  };

  const applyBox = (type: string, placeholder: string) => {
    if (activeTab === "visual" || activeTab === "split") {
      const boxHtml = `<div data-box="${type}" class="my-4 p-4 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-950 font-medium shadow-sm">${placeholder}</div><p><br></p>`;
      visualEditorRef.current?.focus();
      document.execCommand("insertHTML", false, boxHtml);
      handleVisualInput();
    } else {
      insertAtCursor(`\n\n[box=${type}]\n${placeholder}\n[/box]\n\n`);
    }
    setShowBoxPicker(false);
  };

  // Resilient Chunked Video Upload Handler (bypasses Vercel 4.5MB limit, auto-retries, supports large videos)
  const handleUploadVideoFile = async (file: File) => {
    if (!file) return;

    const validExts = [".mp4", ".webm", ".mov", ".ogg", ".avi", ".mkv", ".m4v"];
    const ext = ("." + file.name.split(".").pop()).toLowerCase();
    const isVideoType = file.type.startsWith("video/") || validExts.includes(ext);

    if (!isVideoType) {
      toastWarning("Vui lòng chọn tệp video hợp lệ (MP4, WebM, MOV, OGG, AVI, MKV).", "Định dạng không hợp lệ");
      return;
    }

    const MAX_SIZE = 150 * 1024 * 1024; // 150MB
    if (file.size > MAX_SIZE) {
      toastWarning("Dung lượng video vượt quá 150MB. Vui lòng nén video hoặc chọn tệp nhỏ hơn.", "Tệp quá lớn");
      return;
    }

    const formatSize = (bytes: number) => {
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    setUploadingVideo(true);
    setVideoUploadProgress(0);
    setVideoUploadStatus("Đang khởi tạo tải lên...");
    setVideoFileMeta({ name: file.name, size: formatSize(file.size) });

    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk (safely below Vercel's 4.5MB serverless limit)
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = "up_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunkBlob = file.slice(start, end);

        let chunkSuccess = false;
        let lastErrorMsg = "";

        // Retry chunk up to 3 times on temporary network hiccup
        for (let attempt = 1; attempt <= 3; attempt++) {
          setVideoUploadStatus(
            totalChunks > 1
              ? `Đang tải phần ${i + 1}/${totalChunks}${attempt > 1 ? ` (thử lại lần ${attempt})` : ""}...`
              : "Đang tải video lên máy chủ..."
          );

          try {
            const formData = new FormData();
            formData.append("uploadId", uploadId);
            formData.append("chunkIndex", i.toString());
            formData.append("totalChunks", totalChunks.toString());
            formData.append("chunk", chunkBlob, `chunk-${i}.bin`);

            const res = await fetch("/api/admin/upload-video/chunk", {
              method: "POST",
              body: formData,
            });

            if (res.ok) {
              const resData = await res.json().catch(() => null);
              if (resData && resData.success) {
                chunkSuccess = true;
                break;
              } else {
                lastErrorMsg = resData?.message || "Lỗi lưu phần video tải lên.";
              }
            } else {
              if (res.status === 413) {
                lastErrorMsg = "Phần video vượt giới hạn payload máy chủ.";
              } else if (res.status === 401) {
                lastErrorMsg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
              } else {
                lastErrorMsg = `Máy chủ phản hồi mã lỗi ${res.status}.`;
              }
            }
          } catch (e: any) {
            lastErrorMsg = e?.message || "Lỗi kết nối khi tải phần video.";
          }

          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        if (!chunkSuccess) {
          throw new Error(lastErrorMsg || `Không thể tải phần ${i + 1}/${totalChunks}.`);
        }

        const percent = Math.round(((i + 1) / totalChunks) * 88);
        setVideoUploadProgress(percent);
      }

      // Step 2: Finalize and assemble chunks into streaming video
      setVideoUploadStatus("Đang ghép và tối ưu hóa video trên hệ thống...");
      setVideoUploadProgress(92);

      const completeRes = await fetch("/api/admin/upload-video/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadId,
          filename: file.name,
          mimeType: file.type || "video/mp4",
          size: file.size,
          totalChunks,
        }),
      });

      const completeData = await completeRes.json().catch(() => null);

      if (completeRes.ok && completeData && completeData.success && completeData.url) {
        setVideoUploadProgress(100);
        setVideoUploadStatus("Hoàn tất!");
        setVideoUrl(completeData.url);
        if (!videoTitle.trim()) {
          const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
          setVideoTitle(cleanTitle);
        }
        toastSuccess(`Đã tải video "${file.name}" lên thành công!`, "Tải video hoàn tất");
      } else {
        throw new Error(completeData?.message || "Lỗi hoàn tất xử lý video trên máy chủ.");
      }
    } catch (err: any) {
      console.error("Video Upload Error:", err);
      toastError(err?.message || "Lỗi tải video lên máy chủ.", "Lỗi tải video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverVideo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadVideoFile(file);
    }
  };

  // Video insertion
  const handleInsertVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      toastWarning("Vui lòng tải lên tệp video hoặc nhập đường dẫn video.", "Chưa có video");
      return;
    }

    const title = videoTitle.trim() || "Video thực tế sản phẩm";
    const url = videoUrl.trim();

    if (activeTab === "visual" || activeTab === "split") {
      const isDirectVideo = !url.includes("youtube.com") && !url.includes("youtu.be");
      const vHtml = `<div data-video="${url}" data-title="${title}" class="my-5 p-3 rounded-2xl border-2 border-rose-500/40 bg-[#0c1825] text-white shadow-xl select-none">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-rose-500/30 text-rose-400 font-bold text-xs uppercase tracking-wider">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>${isDirectVideo ? "Video Đã Tải Lên" : "Video YouTube"}: ${title}</span>
          </div>
          <span class="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">${url}</span>
        </div>
        ${isDirectVideo ? `
          <div class="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
            <video src="${url}" controls playsinline preload="metadata" class="w-full h-full object-contain"></video>
          </div>
        ` : `
          <div class="p-3 bg-rose-950/40 rounded-xl text-xs text-rose-200 font-medium">▶ [Video YouTube: ${title} - ${url}]</div>
        `}
        ${title ? `<p class="text-center text-xs text-rose-200/80 italic mt-2">${title}</p>` : ""}
      </div><p><br></p>`;

      visualEditorRef.current?.focus();
      document.execCommand("insertHTML", false, vHtml);
      handleVisualInput();
    } else {
      let code = "";
      if (videoTitle.trim()) {
        code = `\n\n[video title="${videoTitle.trim()}"]${url}[/video]\n\n`;
      } else {
        code = `\n\n[video]${url}[/video]\n\n`;
      }
      insertAtCursor(code);
    }

    toastSuccess("Đã chèn video vào bài viết thành công!", "Chèn video");
    setVideoUrl("");
    setVideoTitle("");
    setVideoFileMeta(null);
    setVideoUploadProgress(0);
    setShowVideoModal(false);
  };

  // Image Upload
  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
        toastSuccess(`Đã tải ảnh "${file.name}" lên thành công!`, "Tải ảnh hoàn tất");
      } else {
        toastError(data.message || "Tải ảnh thất bại", "Tải ảnh thất bại");
      }
    } catch {
      toastError("Lỗi kết nối khi tải ảnh lên máy chủ", "Lỗi mạng");
    } finally {
      setUploadingImage(false);
    }
  };

  // Image Insertion
  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toastWarning("Vui lòng nhập liên kết hình ảnh hoặc tải ảnh lên", "Thiếu ảnh");
      return;
    }

    const caption = imageCaption.trim() || productName;
    const url = imageUrl.trim();

    if (activeTab === "visual" || activeTab === "split") {
      const imgHtml = `<div class="my-4 text-center"><img src="${url}" alt="${caption}" class="max-h-72 rounded-xl mx-auto shadow-md border border-slate-200 object-contain" /><p class="text-xs text-slate-500 italic mt-1.5">${caption}</p></div><p><br></p>`;
      visualEditorRef.current?.focus();
      document.execCommand("insertHTML", false, imgHtml);
      handleVisualInput();
    } else {
      const code = `\n\n![${caption}](${url})\n\n`;
      insertAtCursor(code);
    }

    toastSuccess("Đã chèn ảnh vào bài viết thành công!", "Chèn ảnh");
    setImageUrl("");
    setImageCaption("");
    setShowImageModal(false);
  };

  // Insert standard Lộc Nam 5-part Template
  const insertTemplate = () => {
    const template = `### Giới Thiệu & Tinh Hoa Nghệ Thuật
Tác phẩm **${productName}** được trực tiếp chế tác bởi các nghệ nhân lão luyện của thương hiệu **Đồ Đồng Lộc Nam** tại làng nghề đúc đồng truyền thống Ý Yên, Nam Định. Tác phẩm sở hữu đường nét tinh xảo, thần thái uy nghi và độ hoàn thiện bậc nhất.

* [color=#b45309]Chất liệu phôi chuẩn[/color]: Đúc từ đồng nguyên chất thanh khiết, mạ vàng 24K hoặc khảm ngũ sắc cao cấp.
* [color=#b45309]Quy trình thủ công[/color]: Trải qua 7 công đoạn đúc đồng cổ truyền nghiêm ngặt của nghệ nhân Ý Yên.
* [color=#b45309]Bảo vệ bề mặt[/color]: Phủ lớp bóng 2K chuyên dụng, chống oxy hóa, giữ độ sáng bóng vĩnh cửu.

### Ý Nghĩa Phong Thủy & Giá Trị Tâm Linh
[box=jade]
Trong phong thủy, tác phẩm mang nguồn năng lượng kim khí dương mạnh mẽ, giúp gia chủ kích hoạt tài lộc, chiêu cát tị hung, củng cố sinh khí và sự hanh thông cho con đường công danh sự nghiệp.
[/box]

* Hóa giải tà khí, bảo vệ trạch gia bình an và thịnh vượng.
* Tụ lộc tụ tài, gia tăng vượng khí cho gia đạo và doanh nghiệp.
* Biểu tượng của quyền uy, sự phát triển bền vững và đỉnh cao thành công.

### Quy Cách Kỹ Thuật & Thông Số Chế Tác
* **Chất liệu**: Đồng đỏ / Đồng vàng nguyên chất thanh khiết
* **Công nghệ hoàn thiện**: Mạ vàng 24K điện phân cao cấp / Dát vàng 9999
* **Quy cách**: Đúc nguyên khối thủ công 100%

### Vị Trí Bài Trí & Không Gian Thích Hợp
* **Phòng khách**: Đặt tại vị trí trung tâm, cung tài lộc hoặc bàn trà tiếp khách sang trọng.
* **Phòng làm việc**: Đặt trên bàn làm việc hoặc kệ sách sau lưng để tạo thế vững chắc tựa núi.
* **Quà tặng ngoại giao**: Món quà biếu tặng đối tác, khách hàng VIP, quà tân gia ý nghĩa và đẳng cấp.

### Cam Kết Uy Tín & Bảo Hành Lộc Nam
[box=red]
Đồ Đồng Lộc Nam cam kết 100% sản phẩm chuẩn đồng thanh khiết, chế tác thủ công tinh hoa làng nghề Ý Yên. Bảo hành chất lượng đồng trọn đời và hỗ trợ giao hàng toàn quốc an toàn tuyệt đối.
[/box]`;

    if (value.trim()) {
      showConfirm({
        title: "Chèn Mẫu Chuẩn Lộc Nam",
        message: "Thao tác này sẽ thay thế nội dung bài viết hiện tại bằng khung Mẫu Chuẩn 5 phần phong thủy Lộc Nam. Bạn có muốn tiếp tục?",
        confirmText: "Đồng Ý Thay Thế",
        cancelText: "Hủy Bỏ",
        type: "warning",
        onConfirm: () => {
          onChange(template);
          toastSuccess("Đã chèn khung mẫu bài viết chuẩn phong thủy Lộc Nam!", "Mẫu bài viết");
        },
      });
      return;
    }
    onChange(template);
    toastSuccess("Đã chèn khung mẫu bài viết chuẩn phong thủy Lộc Nam!", "Mẫu bài viết");
  };

  return (
    <div
      className={`flex flex-col bg-[#0b1320] border border-[#202f45] rounded-2xl overflow-hidden transition-all duration-300 shadow-xl ${
        isFullscreen
          ? "fixed inset-0 z-[100] w-screen h-screen rounded-none p-4 sm:p-6 bg-[#08101a]/98 backdrop-blur-xl flex flex-col justify-between"
          : "w-full"
      }`}
    >
      {/* 1. TOP HEADER & VIEW MODE CONTROLS */}
      <div className="p-3.5 bg-gradient-to-r from-[#0d1726] via-[#142339] to-[#0d1726] border-b border-[#202f45] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/40 flex items-center justify-center text-[#ffd700]">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Soạn Thảo Bài Viết & Mô Tả</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                WYSIWYG TRỰC QUAN
              </span>
            </h4>
            <p className="text-[11px] text-gray-400">
              Định dạng trực quan in đậm, in nghiêng, tiêu đề lớn & màu sắc trên nền trắng dễ nhìn
            </p>
          </div>
        </div>

        {/* View Mode Tabs: Trực quan (Visual), Mã (Code), Xem trước (Preview), Chia đôi (Split) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#060c14] border border-[#1e344d] rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "visual"
                  ? "bg-[#ffd700] text-black shadow font-extrabold"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Soạn thảo hiển thị trực quan (in đậm, in nghiêng, tiêu đề, nền trắng)"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Trực Quan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "code"
                  ? "bg-[#ffd700] text-black shadow font-extrabold"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Xem và chỉnh sửa mã Markdown / Văn bản gốc"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Văn Bản / Mã</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "preview"
                  ? "bg-[#ffd700] text-black shadow font-extrabold"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Xem trước hiển thị thực tế trên website khách xem"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem Trước Web</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("split")}
              className={`hidden md:flex px-3 py-1.5 rounded-lg text-xs font-bold items-center gap-1.5 transition-all ${
                activeTab === "split"
                  ? "bg-[#ffd700] text-black shadow font-extrabold"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Chia đôi: Soạn thảo bên trái, xem trước bên phải"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Chia Đôi</span>
            </button>
          </div>

          {/* Quick Template Button */}
          <button
            type="button"
            onClick={insertTemplate}
            title="Điền khung bài viết 5 phần chuẩn phong thủy Lộc Nam"
            className="px-3 py-1.5 bg-[#142339] hover:bg-[#1f3657] text-[#ffd700] border border-[#ffd700]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
            <span className="hidden sm:inline">Mẫu Chuẩn Lộc Nam</span>
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Thu nhỏ về cửa sổ modal" : "Mở rộng toàn màn hình để viết bài thoải mái"}
            className="p-2 bg-[#142339] hover:bg-[#1f3657] text-white border border-[#263e60] rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-[#ffd700]" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 2. RICH FORMATTING TOOLBAR */}
      {(activeTab === "visual" || activeTab === "code" || activeTab === "split") && (
        <div className="p-2.5 bg-[#0e1726] border-b border-[#202f45] flex flex-wrap items-center gap-1 text-xs">
          {/* Headings */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-[#202f45]">
            <button
              type="button"
              onClick={handleHeading3}
              className="p-1.5 rounded-lg text-gray-200 hover:text-[#ffd700] hover:bg-[#16253b] font-bold text-xs flex items-center gap-1"
              title="Đề mục chính Lộc Nam (H3)"
            >
              <Heading3 className="w-4 h-4" />
              <span className="text-[11px]">Đề Mục H3</span>
            </button>

            <button
              type="button"
              onClick={handleHeading2}
              className="p-1.5 rounded-lg text-gray-200 hover:text-[#ffd700] hover:bg-[#16253b] font-bold text-xs"
              title="Tiêu đề lớn (H2)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
          </div>

          {/* Inline Styles (Bold, Italic, Underline, Strike) */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-[#202f45]">
            <button
              type="button"
              onClick={handleBold}
              className="p-1.5 rounded-lg text-gray-200 hover:text-[#ffd700] hover:bg-[#16253b]"
              title="In đậm chữ trực tiếp (Bold)"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleItalic}
              className="p-1.5 rounded-lg text-gray-200 hover:text-[#ffd700] hover:bg-[#16253b]"
              title="In nghiêng chữ trực tiếp (Italic)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleUnderline}
              className="p-1.5 rounded-lg text-gray-200 hover:text-[#ffd700] hover:bg-[#16253b]"
              title="Gạch chân chữ (Underline)"
            >
              <Underline className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleStrikethrough}
              className="p-1.5 rounded-lg text-gray-200 hover:text-[#ffd700] hover:bg-[#16253b]"
              title="Gạch ngang chữ"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Color & Tone Palette */}
          <div className="relative flex items-center pr-2 border-r border-[#202f45]">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowBoxPicker(false);
              }}
              className={`p-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                showColorPicker
                  ? "bg-[#ffd700] text-black"
                  : "text-[#ffd700] hover:bg-[#16253b]"
              }`}
              title="Chọn màu sắc chữ & tông màu phong thủy"
            >
              <Palette className="w-4 h-4" />
              <span>Màu Chữ</span>
            </button>

            {/* Color Dropdown */}
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 z-50 p-3 bg-[#0c1825] border border-[#ffd700]/40 rounded-xl shadow-2xl w-64 space-y-3">
                <div className="flex items-center justify-between border-b border-[#1e344d] pb-2">
                  <span className="text-[11px] font-bold text-[#ffd700] uppercase tracking-wider">
                    Bảng Màu Phong Thủy
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyColor("#b45309")}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 text-xs font-bold flex items-center gap-2 border border-amber-500/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-amber-500 shadow" />
                    <span>Vàng Hoàng Kim</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#d97706")}
                    className="p-1.5 rounded-lg bg-amber-600/10 hover:bg-amber-600/25 text-amber-500 text-xs font-bold flex items-center gap-2 border border-amber-600/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#d97706] shadow" />
                    <span>Vàng Đồng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#92400e")}
                    className="p-1.5 rounded-lg bg-[#92400e]/10 hover:bg-[#92400e]/25 text-[#f59e0b] text-xs font-bold flex items-center gap-2 border border-[#92400e]/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#92400e] shadow" />
                    <span>Đồng Đỏ Cổ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#059669")}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold flex items-center gap-2 border border-emerald-500/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#059669] shadow" />
                    <span>Xanh Ngọc Bích</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#0284c7")}
                    className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/25 text-sky-400 text-xs font-bold flex items-center gap-2 border border-sky-500/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#0284c7] shadow" />
                    <span>Xanh Thiên Thanh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#dc2626")}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 text-xs font-bold flex items-center gap-2 border border-rose-500/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#dc2626] shadow" />
                    <span>Đỏ Son May Mắn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#0f172a")}
                    className="p-1.5 rounded-lg bg-slate-500/10 hover:bg-slate-500/25 text-slate-300 text-xs font-bold flex items-center gap-2 border border-slate-500/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-400 shadow" />
                    <span>Đen Huyền Vũ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#475569")}
                    className="p-1.5 rounded-lg bg-[#475569]/10 hover:bg-[#475569]/25 text-[#94a3b8] text-xs font-bold flex items-center gap-2 border border-[#475569]/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#475569] shadow" />
                    <span>Xám Ghi Tinh Tế</span>
                  </button>
                </div>

                {/* Custom Hex Picker */}
                <div className="pt-2 border-t border-[#1e344d] flex items-center gap-2">
                  <input
                    type="color"
                    value={customHexColor}
                    onChange={(e) => setCustomHexColor(e.target.value)}
                    className="w-7 h-7 rounded border border-gray-600 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customHexColor}
                    onChange={(e) => setCustomHexColor(e.target.value)}
                    className="flex-1 bg-[#142339] border border-[#263e60] text-xs px-2 py-1 rounded text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => applyColor(customHexColor)}
                    className="px-2.5 py-1 bg-[#ffd700] text-black text-xs font-bold rounded hover:brightness-110"
                  >
                    Áp Dụng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Callout Boxes (Khung Tông Màu) */}
          <div className="relative flex items-center pr-2 border-r border-[#202f45]">
            <button
              type="button"
              onClick={() => {
                setShowBoxPicker(!showBoxPicker);
                setShowColorPicker(false);
              }}
              className={`p-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                showBoxPicker
                  ? "bg-[#38bdf8] text-black"
                  : "text-[#38bdf8] hover:bg-[#16253b]"
              }`}
              title="Chèn khung viền tông màu phong thủy nổi bật"
            >
              <Layout className="w-4 h-4" />
              <span>Khung Tông Màu</span>
            </button>

            {/* Box Dropdown */}
            {showBoxPicker && (
              <div className="absolute top-full left-0 mt-2 z-50 p-3 bg-[#0c1825] border border-[#38bdf8]/40 rounded-xl shadow-2xl w-64 space-y-2">
                <div className="flex items-center justify-between border-b border-[#1e344d] pb-2">
                  <span className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider">
                    Chọn Kiểu Khung Tông Màu
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBoxPicker(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    applyBox("gold", "Tác phẩm được đúc từ nguồn đồng chuẩn thanh khiết và dát vàng 24K thủ công tinh xảo.")
                  }
                  className="w-full text-left p-2 rounded-lg bg-[#ffd700]/10 hover:bg-[#ffd700]/20 border border-[#ffd700]/40 text-[#ffd700] text-xs font-semibold"
                >
                  🟡 Khung Vàng Hoàng Kim (Nổi Bật)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyBox("jade", "Tác phẩm mang ý nghĩa phong thủy chiêu tài tấn bảo, kích hoạt vượng khí mạnh mẽ cho gia chủ.")
                  }
                  className="w-full text-left p-2 rounded-lg bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-xs font-semibold"
                >
                  🟢 Khung Phong Thủy Ngọc Bích
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyBox("red", "Đồ Đồng Lộc Nam cam kết bảo hành chất lượng đồng trọn đời và hỗ trợ đổi trả nếu lỗi.")
                  }
                  className="w-full text-left p-2 rounded-lg bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] text-xs font-semibold"
                >
                  🔴 Khung Cam Kết & Bảo Hành Trọn Đời
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyBox("blue", "Thông số chế tác nguyên khối theo quy chuẩn thước Lỗ Ban phong thủy.")
                  }
                  className="w-full text-left p-2 rounded-lg bg-[#0ea5e9]/10 hover:bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 text-[#0ea5e9] text-xs font-semibold"
                >
                  🔵 Khung Thông Số & Kỹ Thuật
                </button>
              </div>
            )}
          </div>

          {/* Video Insertion Button */}
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="p-1.5 rounded-lg text-[#f43f5e] hover:bg-[#16253b] font-bold text-xs flex items-center gap-1.5"
            title="Chèn video thực tế (YouTube, TikTok, Facebook, MP4)"
          >
            <Video className="w-4 h-4" />
            <span>Chèn Video</span>
          </button>

          {/* Image Insertion Button */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="p-1.5 rounded-lg text-[#34d399] hover:bg-[#16253b] font-bold text-xs flex items-center gap-1.5"
            title="Chèn hình ảnh hoặc tải ảnh từ máy tính"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Chèn Ảnh</span>
          </button>

          {/* Lists */}
          <div className="flex items-center gap-0.5 pl-2 border-l border-[#202f45]">
            <button
              type="button"
              onClick={handleList}
              className="p-1.5 rounded-lg text-gray-200 hover:text-white hover:bg-[#16253b]"
              title="Danh sách gạch đầu dòng"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN EDITOR WORKSPACE */}
      <div className={`relative flex-grow ${isFullscreen ? "min-h-0" : ""}`}>
        {/* MODE 1: VISUAL (WYSIWYG) - DEFAULT WITH CRISP WHITE BACKGROUND */}
        {activeTab === "visual" && (
          <div className="p-3 sm:p-4 h-full flex flex-col bg-[#0c1524]">
            <div className="mb-2 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5 font-medium text-amber-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Chế độ Soạn Thảo Trực Quan (Nền trắng, hiển thị trực tiếp chữ in đậm, in nghiêng, tiêu đề)
              </span>
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className="text-gray-400 hover:text-[#ffd700] underline"
              >
                Chuyển sang chế độ xem Mã / Markdown
              </button>
            </div>

            <div
              ref={visualEditorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleVisualInput}
              onBlur={handleVisualInput}
              className={`w-full bg-white text-slate-900 border border-slate-300 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30 text-sm sm:text-base font-sans leading-relaxed p-6 rounded-xl focus:outline-none overflow-y-auto shadow-inner ${
                isFullscreen ? "h-full flex-grow" : "min-h-[440px] max-h-[700px]"
              }`}
              style={{ minHeight: isFullscreen ? "100%" : "440px" }}
            />
          </div>
        )}

        {/* MODE 2: CODE (RAW MARKDOWN) WITH HIGH CONTRAST WHITE BACKGROUND */}
        {activeTab === "code" && (
          <div className="p-3 sm:p-4 h-full flex flex-col bg-[#0c1524]">
            <div className="mb-2 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5 font-medium text-gray-300">
                <Code className="w-3.5 h-3.5 text-[#ffd700]" />
                Chế độ Mã / Văn Bản Gốc (Dành cho việc chỉnh sửa trực tiếp các thẻ cú pháp)
              </span>
              <button
                type="button"
                onClick={() => setActiveTab("visual")}
                className="text-[#ffd700] hover:underline font-bold"
              >
                Chuyển về Soạn Thảo Trực Quan
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Nhập nội dung bài viết sản phẩm tại đây..."
              className={`w-full bg-white text-slate-900 border border-slate-300 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30 text-xs sm:text-sm font-mono leading-relaxed p-5 rounded-xl focus:outline-none resize-y transition-colors shadow-inner ${
                isFullscreen ? "h-full resize-none flex-grow" : "min-h-[440px]"
              }`}
            />
          </div>
        )}

        {/* MODE 3: PREVIEW ONLY (WEB VIEW ON DARK LUXURY FRONTEND) */}
        {activeTab === "preview" && (
          <div
            className={`p-4 sm:p-6 bg-[#04080e] overflow-y-auto ${
              isFullscreen ? "h-full" : "min-h-[440px] max-h-[650px]"
            }`}
          >
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-3 rounded-xl bg-[#0c1825] border border-[#ffd700]/30 text-xs text-[#ffd700] flex items-center justify-between gap-2">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Xem trước hiển thị thực tế trên website</span>
                </span>
                <span className="text-[11px] text-gray-400">
                  Giao diện đồng bộ 100% với trang chi tiết sản phẩm
                </span>
              </div>

              <ProductStructuredDescription
                description={value}
                productName={productName}
              />
            </div>
          </div>
        )}

        {/* MODE 4: SPLIT SCREEN (VISUAL ON LEFT, WEB PREVIEW ON RIGHT) */}
        {activeTab === "split" && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#0c1524] ${
              isFullscreen ? "h-full" : "min-h-[440px]"
            }`}
          >
            {/* Left: Visual Editor */}
            <div className="flex flex-col h-full">
              <span className="text-[11px] font-bold uppercase text-gray-300 mb-2 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>Soạn Thảo Trực Quan (Nền trắng)</span>
              </span>
              <div
                ref={visualEditorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleVisualInput}
                onBlur={handleVisualInput}
                className={`w-full bg-white text-slate-900 border border-slate-300 focus:border-[#d4af37] text-xs sm:text-sm font-sans leading-relaxed p-4 rounded-xl focus:outline-none overflow-y-auto shadow-inner flex-grow ${
                  isFullscreen ? "h-full" : "min-h-[420px]"
                }`}
              />
            </div>

            {/* Right: Live Preview */}
            <div className="flex flex-col h-full border-l border-[#202f45] pl-4 overflow-hidden">
              <span className="text-[11px] font-bold uppercase text-gray-300 mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Xem Trước Thời Gian Thực Trên Web</span>
              </span>
              <div
                className={`overflow-y-auto bg-[#04080e] p-4 rounded-xl border border-[#1a2c42] flex-grow ${
                  isFullscreen ? "h-full" : "max-h-[520px]"
                }`}
              >
                <ProductStructuredDescription
                  description={value}
                  productName={productName}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. FOOTER STATUS BAR */}
      <div className="px-4 py-2 bg-[#0c1420] border-t border-[#202f45] flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-4">
          <span>
            Độ dài: <strong className="text-white">{value.length}</strong> ký tự
          </span>
          <span>
            Số dòng: <strong className="text-white">{value.split("\n").length}</strong>
          </span>
          <span className="hidden sm:inline text-[#ffd700]">
            ✓ Hiển thị trực tiếp in đậm, in nghiêng & màu sắc phong thủy
          </span>
        </div>

        {isFullscreen && (
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="px-3 py-1 bg-[#ffd700] text-black font-bold text-xs rounded-lg hover:brightness-110"
          >
            Đóng Toàn Màn Hình
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL CHÈN / TẢI VIDEO LÊN */}
      {/* ------------------------------------------------------------- */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0c1825] border-2 border-rose-500/50 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e344d] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-rose-400 uppercase tracking-wide">
                    Đăng Video Thực Tế Vào Bài Viết
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Tải trực tiếp video từ máy tính hoặc chèn đường dẫn YouTube
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowVideoModal(false);
                  setVideoFileMeta(null);
                  setVideoUploadProgress(0);
                }}
                className="w-8 h-8 rounded-lg bg-[#152236] hover:bg-[#1d2f4a] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex rounded-xl bg-[#070e17] p-1 border border-[#1e344d]">
              <button
                type="button"
                onClick={() => setVideoTab("upload")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  videoTab === "upload"
                    ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md shadow-rose-900/40"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Tải Video Từ Máy Tính</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 font-mono">
                  Ưu tiên
                </span>
              </button>
              <button
                type="button"
                onClick={() => setVideoTab("link")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  videoTab === "link"
                    ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md shadow-rose-900/40"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Hoặc Nhập Link Video</span>
              </button>
            </div>

            <form onSubmit={handleInsertVideo} className="space-y-4">
              {/* TAB 1: UPLOAD VIDEO TỪ MÁY TÍNH */}
              {videoTab === "upload" && (
                <div className="space-y-3">
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/ogg,video/x-msvideo,.mp4,.webm,.mov,.avi,.mkv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadVideoFile(file);
                    }}
                    disabled={uploadingVideo}
                  />

                  {/* DROPZONE / UPLOADING / PREVIEW STATE */}
                  {uploadingVideo ? (
                    /* Uploading progress card */
                    <div className="p-6 rounded-2xl bg-[#070e17] border-2 border-rose-500/50 shadow-inner flex flex-col items-center justify-center gap-3 text-center">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
                        <FileVideo className="w-6 h-6 text-rose-300 absolute" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">
                          Đang tải lên: <span className="text-rose-400">{videoFileMeta?.name}</span>
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {videoFileMeta?.size} • {videoUploadStatus || "Đang xử lý và lưu trữ video..."}
                        </p>
                      </div>
                      {/* Real-time Progress Bar */}
                      <div className="w-full bg-[#152236] rounded-full h-3 overflow-hidden border border-[#1e344d]">
                        <div
                          className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400 h-full transition-all duration-200 rounded-full"
                          style={{ width: `${videoUploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {videoUploadProgress}% Hoàn tất
                      </span>
                    </div>
                  ) : videoUrl && !videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be") ? (
                    /* Video Uploaded Preview Card */
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Video Đã Sẵn Sàng</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (videoFileInputRef.current) {
                              videoFileInputRef.current.value = "";
                              videoFileInputRef.current.click();
                            }
                          }}
                          className="text-rose-400 hover:text-rose-300 underline text-xs font-semibold"
                        >
                          Chọn tệp video khác
                        </button>
                      </div>

                      {/* Video Player Preview */}
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-rose-500/40 shadow-lg relative flex items-center justify-center">
                        <video
                          src={videoUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#070e17] border border-[#1e344d] flex items-center justify-between text-[11px] text-gray-300 font-mono">
                        <div className="truncate pr-2">
                          <span className="text-gray-500 mr-1">File:</span>
                          <span className="text-white">{videoFileMeta?.name || videoUrl.split("/").pop()}</span>
                          {videoFileMeta?.size && (
                            <span className="text-gray-400 ml-2">({videoFileMeta.size})</span>
                          )}
                        </div>
                        <span className="text-emerald-400 shrink-0 font-sans font-bold text-[10px] bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Đã lưu máy chủ
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Empty Dropzone Area */
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOverVideo(true);
                      }}
                      onDragLeave={() => setIsDragOverVideo(false)}
                      onDrop={handleVideoDrop}
                      onClick={() => videoFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 group ${
                        isDragOverVideo
                          ? "border-rose-400 bg-rose-500/10 scale-[1.01]"
                          : "border-[#203752] hover:border-rose-500/70 bg-[#070e17] hover:bg-[#0b1726]"
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-950 to-rose-900/50 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                          Bấm vào đây để chọn video từ máy tính
                        </p>
                        <p className="text-xs text-gray-400">
                          hoặc kéo & thả tệp video vào khung này
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#152236] border border-[#1e344d] text-[11px] text-gray-300">
                        <Film className="w-3.5 h-3.5 text-rose-400" />
                        <span>Hỗ trợ MP4, WebM, MOV, AVI, MKV (Tối đa 150MB)</span>
                      </div>
                      <button
                        type="button"
                        className="mt-1 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-900/30 transition-all pointer-events-none"
                      >
                        Chọn Tệp Video Ngay
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: NHẬP LINK NGOÀI / YOUTUBE */}
              {videoTab === "link" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white block uppercase">
                    Đường dẫn liên kết Video (YouTube hoặc link MP4) *
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setVideoFileMeta(null);
                    }}
                    placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/... hoặc https://.../video.mp4"
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-rose-500 text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-gray-400">
                    Hệ thống tự động nhúng YouTube siêu tốc (Lite Facade - không làm chậm web).
                  </p>
                </div>
              )}

              {/* TIÊU ĐỀ / CHÚ THÍCH VIDEO */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-white block uppercase flex items-center justify-between">
                  <span>Tiêu Đề / Chú Thích Video (Hiển thị dưới video)</span>
                  <span className="text-[10px] text-gray-400 lowercase font-normal">Tùy chọn</span>
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Ví dụ: Quy trình đúc tượng đồng đỏ nguyên khối và mạ vàng 24k trực tiếp tại xưởng Lộc Nam"
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-rose-500 text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-3 border-t border-[#1e344d] flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  {videoUrl ? "✓ Đã sẵn sàng chèn video" : "Chọn video để tiếp tục"}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowVideoModal(false);
                      setVideoFileMeta(null);
                      setVideoUploadProgress(0);
                    }}
                    className="px-4 py-2.5 bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={!videoUrl.trim() || uploadingVideo}
                    className="px-6 py-2.5 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-900/40 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Chèn Video Vào Bài Viết</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL CHÈN HÌNH ẢNH */}
      {/* ------------------------------------------------------------- */}
      {showImageModal && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1825] border-2 border-[#34d399]/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e344d] pb-3">
              <h3 className="font-serif font-bold text-base text-[#34d399] uppercase tracking-wide flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#34d399]" />
                <span>Chèn Hình Ảnh Vào Bài Viết</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInsertImage} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block uppercase">
                  Tải Ảnh Lên Từ Máy Tính HOẶC Nhập URL Ảnh
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... hoặc /images/..."
                    className="flex-1 bg-[#111c2e] border border-[#1f2d42] focus:border-[#34d399] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none font-mono"
                  />
                  <label className="px-3.5 py-2.5 bg-[#1f3657] hover:bg-[#284873] text-[#ffd700] rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0 border border-[#2f5587]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Đang tải..." : "Tải Lên"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadImageFile}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block uppercase">
                  Mô Tả / Chú Thích Dưới Ảnh
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder={`Ví dụ: Cận cảnh hoa văn chạm khắc thủ công của ${productName}`}
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#34d399] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              {imageUrl && (
                <div className="p-2 rounded-xl bg-black/50 border border-[#1e344d] text-center">
                  <p className="text-[11px] text-gray-400 mb-1">Xem trước ảnh:</p>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-32 mx-auto rounded-lg object-contain"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 rounded-xl text-xs font-bold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Chèn Ảnh Ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
