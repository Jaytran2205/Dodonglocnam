"use client";

import React, { useState, useRef } from "react";
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
  X,
  Plus,
  Play,
  HelpCircle,
  FileText,
} from "lucide-react";
import { ProductStructuredDescription } from "@/components/product/ProductStructuredDescription";

interface ProductArticleEditorProps {
  value: string;
  onChange: (val: string) => void;
  productName?: string;
}

export function ProductArticleEditor({
  value,
  onChange,
  productName = "Sản phẩm Đồ Đồng Lộc Nam",
}: ProductArticleEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("edit");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBoxPicker, setShowBoxPicker] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Video insertion form state
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  // Image insertion form state
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Custom Color State
  const [customHexColor, setCustomHexColor] = useState("#ffd700");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to wrap selected text in textarea
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

  // Insert text at cursor
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

  // Insert Color
  const applyColor = (hex: string) => {
    wrapSelection(`[color=${hex}]`, `[/color]`, "văn bản màu sắc");
    setShowColorPicker(false);
  };

  // Insert Callout Box
  const applyBox = (type: string, placeholder: string) => {
    insertAtCursor(`\n\n[box=${type}]\n${placeholder}\n[/box]\n\n`);
    setShowBoxPicker(false);
  };

  // Handle Video insertion
  const handleInsertVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      alert("Vui lòng nhập đường dẫn video (YouTube hoặc link MP4)");
      return;
    }

    let code = "";
    if (videoTitle.trim()) {
      code = `\n\n[video title="${videoTitle.trim()}"]${videoUrl.trim()}[/video]\n\n`;
    } else {
      code = `\n\n${videoUrl.trim()}\n\n`;
    }

    insertAtCursor(code);
    setVideoUrl("");
    setVideoTitle("");
    setShowVideoModal(false);
  };

  // Handle Image Upload
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
      } else {
        alert(data.message || "Tải ảnh thất bại");
      }
    } catch {
      alert("Lỗi kết nối khi tải ảnh lên máy chủ");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle Image insertion
  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      alert("Vui lòng nhập liên kết hình ảnh hoặc tải ảnh lên");
      return;
    }

    const caption = imageCaption.trim() || productName;
    const code = `\n\n![${caption}](${imageUrl.trim()})\n\n`;

    insertAtCursor(code);
    setImageUrl("");
    setImageCaption("");
    setShowImageModal(false);
  };

  // Insert standard Lộc Nam 5-part Template
  const insertTemplate = () => {
    const template = `### Giới Thiệu & Tinh Hoa Nghệ Thuật
Tác phẩm **${productName}** được trực tiếp chế tác bởi các nghệ nhân lão luyện của thương hiệu **Đồ Đồng Lộc Nam** tại làng nghề đúc đồng truyền thống Ý Yên, Nam Định. Tác phẩm sở hữu đường nét tinh xảo, thần thái uy nghi và độ hoàn thiện bậc nhất.

* [color=#ffd700]Chất liệu phôi chuẩn[/color]: Đúc từ đồng nguyên chất thanh khiết, mạ vàng 24K hoặc khảm ngũ sắc cao cấp.
* [color=#ffd700]Quy trình thủ công[/color]: Trải qua 7 công đoạn đúc đồng cổ truyền nghiêm ngặt của nghệ nhân Ý Yên.
* [color=#ffd700]Bảo vệ bề mặt[/color]: Phủ lớp bóng 2K chuyên dụng, chống oxy hóa, giữ độ sáng bóng vĩnh cửu.

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
      if (!confirm("Thao tác này sẽ thay thế hoặc chèn mẫu bài viết vào khung soạn thảo. Bạn có muốn tiếp tục?")) {
        return;
      }
    }
    onChange(template);
  };

  return (
    <div
      className={`flex flex-col bg-[#08101a] border border-[#1e344d] rounded-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-[100] w-screen h-screen rounded-none p-4 sm:p-6 bg-[#060c14]/98 backdrop-blur-xl flex flex-col justify-between"
          : "w-full"
      }`}
    >
      {/* 1. TOP HEADER & VIEW MODE CONTROLS */}
      <div className="p-3.5 bg-gradient-to-r from-[#0c1825] via-[#112235] to-[#0c1825] border-b border-[#1e344d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700]">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Biên Tập Bài Viết & Mô Tả Sản Phẩm</span>
              <span className="text-[10px] bg-[#ffd700]/15 text-[#ffd700] px-2 py-0.5 rounded-full font-mono border border-[#ffd700]/30">
                PRO EDITOR
              </span>
            </h4>
            <p className="text-[11px] text-gray-400">
              Hỗ trợ định dạng màu sắc, đề mục, khung tông màu & video YouTube/MP4
            </p>
          </div>
        </div>

        {/* View Mode Tabs & Fullscreen Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#060c14] border border-[#1e344d] rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "edit"
                  ? "bg-[#ffd700] text-black shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Soạn Thảo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "preview"
                  ? "bg-[#ffd700] text-black shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem Trước Web</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("split")}
              className={`hidden md:flex px-3 py-1.5 rounded-lg text-xs font-bold items-center gap-1.5 transition-all ${
                activeTab === "split"
                  ? "bg-[#ffd700] text-black shadow"
                  : "text-gray-400 hover:text-white"
              }`}
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
            title={isFullscreen ? "Thu nhỏ về cửa sổ modal" : "Mở rộng toàn màn hình để viết thoải mái"}
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
      {(activeTab === "edit" || activeTab === "split") && (
        <div className="p-2 bg-[#09131f] border-b border-[#1e344d] flex flex-wrap items-center gap-1 text-xs">
          {/* Headings */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-[#1e344d]">
            <button
              type="button"
              onClick={() => insertAtCursor("\n\n### Tiêu Đề Mục (H3)\n")}
              className="p-1.5 rounded-lg text-gray-300 hover:text-[#ffd700] hover:bg-[#142339] font-bold text-xs flex items-center gap-1"
              title="Đề mục chính Lộc Nam (### Tiêu đề)"
            >
              <Heading3 className="w-4 h-4" />
              <span className="text-[10px]">Đề Mục H3</span>
            </button>

            <button
              type="button"
              onClick={() => insertAtCursor("\n\n## Tiêu Đề Lớn (H2)\n")}
              className="p-1.5 rounded-lg text-gray-300 hover:text-[#ffd700] hover:bg-[#142339] font-bold text-xs"
              title="Tiêu đề lớn (##)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
          </div>

          {/* Inline Styles */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-[#1e344d]">
            <button
              type="button"
              onClick={() => wrapSelection("**", "**", "chữ in đậm")}
              className="p-1.5 rounded-lg text-gray-300 hover:text-[#ffd700] hover:bg-[#142339]"
              title="In đậm (**chữ đậm**)"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection("*", "*", "chữ in nghiêng")}
              className="p-1.5 rounded-lg text-gray-300 hover:text-[#ffd700] hover:bg-[#142339]"
              title="In nghiêng (*chữ nghiêng*)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection("<u>", "</u>", "chữ gạch chân")}
              className="p-1.5 rounded-lg text-gray-300 hover:text-[#ffd700] hover:bg-[#142339]"
              title="Gạch chân (<u>gạch chân</u>)"
            >
              <Underline className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection("~~", "~~", "chữ gạch ngang")}
              className="p-1.5 rounded-lg text-gray-300 hover:text-[#ffd700] hover:bg-[#142339]"
              title="Gạch ngang (~~chữ~~)"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Color & Tone Palette */}
          <div className="relative flex items-center pr-2 border-r border-[#1e344d]">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowBoxPicker(false);
              }}
              className={`p-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                showColorPicker
                  ? "bg-[#ffd700] text-black"
                  : "text-[#ffd700] hover:bg-[#142339]"
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
                    onClick={() => applyColor("#ffd700")}
                    className="p-1.5 rounded-lg bg-[#ffd700]/10 hover:bg-[#ffd700]/25 text-[#ffd700] text-xs font-bold flex items-center gap-2 border border-[#ffd700]/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#ffd700] shadow" />
                    <span>Vàng Hoàng Kim</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#f59e0b")}
                    className="p-1.5 rounded-lg bg-[#f59e0b]/10 hover:bg-[#f59e0b]/25 text-[#f59e0b] text-xs font-bold flex items-center gap-2 border border-[#f59e0b]/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#f59e0b] shadow" />
                    <span>Vàng Đồng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#d97706")}
                    className="p-1.5 rounded-lg bg-[#d97706]/10 hover:bg-[#d97706]/25 text-[#d97706] text-xs font-bold flex items-center gap-2 border border-[#d97706]/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#d97706] shadow" />
                    <span>Đồng Đỏ Cổ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#10b981")}
                    className="p-1.5 rounded-lg bg-[#10b981]/10 hover:bg-[#10b981]/25 text-[#10b981] text-xs font-bold flex items-center gap-2 border border-[#10b981]/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#10b981] shadow" />
                    <span>Xanh Ngọc Bích</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#0ea5e9")}
                    className="p-1.5 rounded-lg bg-[#0ea5e9]/10 hover:bg-[#0ea5e9]/25 text-[#0ea5e9] text-xs font-bold flex items-center gap-2 border border-[#0ea5e9]/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#0ea5e9] shadow" />
                    <span>Xanh Thiên Thanh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#ef4444")}
                    className="p-1.5 rounded-lg bg-[#ef4444]/10 hover:bg-[#ef4444]/25 text-[#ef4444] text-xs font-bold flex items-center gap-2 border border-[#ef4444]/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#ef4444] shadow" />
                    <span>Đỏ Son May Mắn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#ffffff")}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20"
                  >
                    <span className="w-3 h-3 rounded-full bg-white shadow" />
                    <span>Trắng Sáng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyColor("#94a3b8")}
                    className="p-1.5 rounded-lg bg-[#94a3b8]/10 hover:bg-[#94a3b8]/20 text-[#94a3b8] text-xs font-bold flex items-center gap-2 border border-[#94a3b8]/30"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#94a3b8] shadow" />
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
          <div className="relative flex items-center pr-2 border-r border-[#1e344d]">
            <button
              type="button"
              onClick={() => {
                setShowBoxPicker(!showBoxPicker);
                setShowColorPicker(false);
              }}
              className={`p-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                showBoxPicker
                  ? "bg-[#38bdf8] text-black"
                  : "text-[#38bdf8] hover:bg-[#142339]"
              }`}
              title="Chèn khung viền tông màu nổi bật"
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
                  className="w-full text-left p-2 rounded-lg bg-[#ffd700]/5 hover:bg-[#ffd700]/15 border border-[#ffd700]/40 text-[#ffd700] text-xs font-semibold"
                >
                  🟡 Khung Vàng Hoàng Kim (Nổi Bật)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyBox("jade", "Tác phẩm mang ý nghĩa phong thủy chiêu tài tấn bảo, kích hoạt vượng khí mạnh mẽ cho gia chủ.")
                  }
                  className="w-full text-left p-2 rounded-lg bg-[#10b981]/5 hover:bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] text-xs font-semibold"
                >
                  🟢 Khung Phong Thủy Ngọc Bích
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyBox("red", "Đồ Đồng Lộc Nam cam kết bảo hành chất lượng đồng trọn đời và hỗ trợ đổi trả nếu lỗi.")
                  }
                  className="w-full text-left p-2 rounded-lg bg-[#ef4444]/5 hover:bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] text-xs font-semibold"
                >
                  🔴 Khung Cam Kết & Bảo Hành Trọn Đời
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyBox("blue", "Thông số chế tác nguyên khối theo quy chuẩn thước Lỗ Ban phong thủy.")
                  }
                  className="w-full text-left p-2 rounded-lg bg-[#0ea5e9]/5 hover:bg-[#0ea5e9]/15 border border-[#0ea5e9]/40 text-[#0ea5e9] text-xs font-semibold"
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
            className="p-1.5 rounded-lg text-[#f43f5e] hover:bg-[#142339] font-bold text-xs flex items-center gap-1.5"
            title="Chèn video thực tế (YouTube, TikTok, Facebook, MP4)"
          >
            <Video className="w-4 h-4" />
            <span>Chèn Video</span>
          </button>

          {/* Image Insertion Button */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="p-1.5 rounded-lg text-[#34d399] hover:bg-[#142339] font-bold text-xs flex items-center gap-1.5"
            title="Chèn hình ảnh hoặc tải ảnh từ máy tính"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Chèn Ảnh</span>
          </button>

          {/* Lists */}
          <div className="flex items-center gap-0.5 pl-2 border-l border-[#1e344d]">
            <button
              type="button"
              onClick={() => insertAtCursor("\n* [color=#ffd700]Đặc điểm nổi bật[/color]: Mô tả chi tiết tính năng")}
              className="p-1.5 rounded-lg text-gray-300 hover:text-[#ffd700] hover:bg-[#142339]"
              title="Danh sách gạch đầu dòng có tích xanh"
            >
              <CheckSquare className="w-4 h-4 text-[#dfb755]" />
            </button>

            <button
              type="button"
              onClick={() => insertAtCursor("\n- ")}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#142339]"
              title="Gạch đầu dòng thường (- )"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN EDITOR WORKSPACE */}
      <div className={`relative flex-grow ${isFullscreen ? "min-h-0" : ""}`}>
        {/* EDIT ONLY MODE */}
        {activeTab === "edit" && (
          <div className="p-3 sm:p-4 h-full flex flex-col">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Nhập nội dung bài viết sản phẩm tại đây... Bạn có thể dùng toolbar phía trên để chèn video YouTube, màu sắc, khung nổi bật hoặc bấm nút 'Mẫu Chuẩn Lộc Nam' để điền sẵn khung bài viết chuyên nghiệp."
              className={`w-full bg-[#060c14] border border-[#1a2c42] focus:border-[#ffd700] text-gray-100 text-xs sm:text-sm font-sans leading-relaxed p-4 rounded-xl focus:outline-none resize-y transition-colors ${
                isFullscreen ? "h-full resize-none flex-grow" : "min-h-[420px]"
              }`}
            />
          </div>
        )}

        {/* PREVIEW ONLY MODE */}
        {activeTab === "preview" && (
          <div
            className={`p-4 sm:p-6 bg-[#04080e] overflow-y-auto ${
              isFullscreen ? "h-full" : "min-h-[420px] max-h-[600px]"
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

        {/* SPLIT SCREEN MODE (SIDE-BY-SIDE) */}
        {activeTab === "split" && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 ${
              isFullscreen ? "h-full" : "min-h-[420px]"
            }`}
          >
            {/* Left: Editor */}
            <div className="flex flex-col h-full">
              <span className="text-[11px] font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>Khung Soạn Thảo (Markdown & BBCode)</span>
              </span>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Nhập nội dung bài viết..."
                className={`w-full bg-[#060c14] border border-[#1a2c42] focus:border-[#ffd700] text-gray-100 text-xs sm:text-sm font-sans leading-relaxed p-4 rounded-xl focus:outline-none resize-none flex-grow ${
                  isFullscreen ? "h-full" : "min-h-[400px]"
                }`}
              />
            </div>

            {/* Right: Live Preview */}
            <div className="flex flex-col h-full border-l border-[#1e344d]/60 pl-4 overflow-hidden">
              <span className="text-[11px] font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Xem Trước Trực Tiếp Thời Gian Thực</span>
              </span>
              <div
                className={`overflow-y-auto bg-[#04080e] p-4 rounded-xl border border-[#1a2c42] flex-grow ${
                  isFullscreen ? "h-full" : "max-h-[500px]"
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
      <div className="px-4 py-2 bg-[#09131f] border-t border-[#1e344d] flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-4">
          <span>
            Độ dài: <strong className="text-white">{value.length}</strong> ký tự
          </span>
          <span>
            Số dòng: <strong className="text-white">{value.split("\n").length}</strong>
          </span>
          <span className="hidden sm:inline text-[#ffd700]">
            ✓ Tối ưu tốc độ tải ảnh (Lazy Load) & video (YouTube Facade)
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
      {/* MODAL CHÈN VIDEO */}
      {/* ------------------------------------------------------------- */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c1825] border-2 border-[#f43f5e]/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e344d] pb-3">
              <h3 className="font-serif font-bold text-base text-[#f43f5e] uppercase tracking-wide flex items-center gap-2">
                <Video className="w-5 h-5 text-[#f43f5e]" />
                <span>Chèn Video Thực Tế Vào Bài Viết</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInsertVideo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block uppercase">
                  Đường dẫn liên kết Video (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/... hoặc file .mp4"
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#f43f5e] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none font-mono"
                />
                <p className="text-[11px] text-gray-400">
                  Hệ thống tự động tối ưu hóa tốc độ tải (YouTube Lite Facade) - không làm chậm web!
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block uppercase">
                  Tiêu Đề / Chú Thích Video (Tùy Chọn)
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Ví dụ: Quy trình đúc đồng và mạ vàng 24k trực tiếp tại xưởng"
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#f43f5e] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 rounded-xl text-xs font-bold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f43f5e] hover:bg-[#e11d48] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Chèn Video Ngay</span>
                </button>
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
