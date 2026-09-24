"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Eye,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Upload,
  Loader2,
  Search,
  FolderTree,
  Tag,
  Save,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ProductArticleEditor } from "@/components/admin/ProductArticleEditor";

// Hierarchical Article Topics / Categories Structure
const ARTICLE_CATEGORIES_TREE = [
  {
    name: "KIẾN THỨC ĐỒ ĐỒNG",
    slug: "kien-thuc-do-dong",
    children: [
      "Cẩm nang đồ thờ cúng gia tiên",
      "Kỹ nghệ đúc đồng Ý Yên",
      "Mạ vàng 24K & Dát vàng 9999",
      "Kích thước Lỗ Ban phong thủy",
      "Cách phân biệt đồng nguyên chất",
    ],
  },
  {
    name: "KIẾN THỨC PHONG THỦY",
    slug: "kien-thuc-phong-thuy",
    children: [
      "Bố trí ban thờ gia tiên chuẩn phong thủy",
      "Ý nghĩa 12 con giáp & Linh vật chiêu tài",
      "Vị trí an vị tượng danh nhân & Phật bản mệnh",
      "Vật phẩm phong thủy tụ tài phòng khách & văn phòng",
    ],
  },
  {
    name: "BẠN CÓ BIẾT",
    slug: "ban-co-biet",
    children: [
      "Lịch sử ngàn năm làng nghề Ý Yên",
      "Ý nghĩa hoa văn trống đồng Đông Sơn & Ngọc Lũ",
      "Sự tích Đại Hồng Chung & Chuông chùa",
    ],
  },
  {
    name: "TIN TỨC SỰ KIỆN",
    slug: "tin-tuc-su-kien",
    children: [
      "Hoạt động chế tác xưởng đúc Lộc Nam",
      "Khánh thành công trình & Tượng đài",
      "Ưu đãi tri ân & Khuyến mại",
    ],
  },
];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArt, setEditingArt] = useState<any>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [selectedFilterCat, setSelectedFilterCat] = useState("ALL");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    thumbnail: "",
    category: "KIẾN THỨC ĐỒ ĐỒNG",
    tags: "",
    isPublished: true,
  });

  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Category Tree UI State inside modal
  const [catTab, setCatTab] = useState<"all" | "popular">("all");
  const [catSearch, setCatSearch] = useState("");
  const [expandedMain, setExpandedMain] = useState<Record<string, boolean>>({
    "kien-thuc-do-dong": true,
    "kien-thuc-phong-thuy": true,
    "ban-co-biet": true,
    "tin-tuc-su-kien": true,
  });
  const [showAddCat, setShowAddCat] = useState(false);
  const [customCatName, setCustomCatName] = useState("");

  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumbnail(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, thumbnail: data.url }));
      } else {
        alert(data.message || "Tải ảnh thất bại");
      }
    } catch {
      alert("Lỗi tải ảnh");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      if (data.success) setArticles(data.articles);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreate = () => {
    setEditingArt(null);
    setFormData({
      title: "",
      summary: "",
      content: "",
      thumbnail: "/images/do-tho-cung.jpg",
      category: "KIẾN THỨC ĐỒ ĐỒNG",
      tags: "đồ đồng lộc nam, phong thủy thờ cúng, kiến thức đồ đồng",
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEdit = (art: any) => {
    setEditingArt(art);
    setFormData({
      title: art.title || "",
      summary: art.summary || "",
      content: art.content || "",
      thumbnail: art.thumbnail || "/images/do-tho-cung.jpg",
      category: art.category || "KIẾN THỨC ĐỒ ĐỒNG",
      tags: art.tags || "",
      isPublished: Boolean(art.isPublished),
    });
    setModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent, forcePublish?: boolean) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) return alert("Vui lòng nhập tiêu đề bài viết");
    if (!formData.content.trim()) return alert("Vui lòng nhập nội dung bài viết");

    setSaving(true);
    try {
      const payload = {
        ...formData,
        isPublished: forcePublish !== undefined ? forcePublish : formData.isPublished,
        id: editingArt?.id,
      };

      const res = await fetch("/api/admin/articles", {
        method: editingArt ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchArticles();
      } else {
        alert(data.message || "Lỗi lưu bài viết");
      }
    } catch (e) {
      alert("Lỗi kết nối");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchArticles();
      } else {
        alert(data.message || "Lỗi xóa bài viết");
      }
    } catch (e) {
      alert("Lỗi khi xóa");
    }
  };

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    let list = [...articles];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.summary && a.summary.toLowerCase().includes(q)) ||
          (a.category && a.category.toLowerCase().includes(q))
      );
    }
    if (selectedFilterCat !== "ALL") {
      list = list.filter((a) => a.category === selectedFilterCat);
    }
    return list;
  }, [articles, search, selectedFilterCat]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              CẨM NANG & NỘI DUNG SEO LỘC NAM
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide mt-1">
            QUẢN LÝ BÀI VIẾT & KIẾN THỨC ({articles.length})
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Biên tập cẩm nang phong thủy thờ cúng, kiến thức đúc tượng chân dung và tin tức làng nghề Ý Yên
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchArticles}
            className="p-2.5 bg-[#111c2e] hover:bg-[#152236] text-[#d4af37] border border-[#d4af37]/30 rounded-xl transition-all shadow"
            title="Tải lại"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5b869] hover:from-[#b89628] hover:to-[#d4af37] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Viết Bài Mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm bài viết theo tiêu đề, tóm tắt hoặc chuyên mục..."
            className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none transition-all placeholder:text-gray-500"
          />
        </div>

        <div className="w-full sm:w-72">
          <select
            value={selectedFilterCat}
            onChange={(e) => setSelectedFilterCat(e.target.value)}
            className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="ALL">Tất Cả Chuyên Mục</option>
            {ARTICLE_CATEGORIES_TREE.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-400">Đang tải danh sách bài viết...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 space-y-3 text-gray-400">
            <FileText className="w-12 h-12 mx-auto text-gray-600" />
            <p className="text-sm">Không tìm thấy bài viết nào phù hợp.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111c2e] text-[#d4af37] uppercase font-serif tracking-wider text-[11px] border-b border-[#1f2d42]">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">Ảnh</th>
                  <th className="py-3.5 px-4">Tiêu Đề Bài Viết</th>
                  <th className="py-3.5 px-4">Chuyên Mục</th>
                  <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                  <th className="py-3.5 px-4">Ngày Đăng</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d42]/60">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-[#111c2e]/60 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <div className="w-12 h-12 rounded-lg bg-white/5 border border-[#1f2d42] overflow-hidden p-1">
                        <img
                          src={art.thumbnail || "/images/do-tho-cung.jpg"}
                          alt={art.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-md">
                      <div className="font-serif font-semibold text-white leading-snug line-clamp-2">
                        {art.title}
                      </div>
                      <div className="text-[10px] text-[#94a3b8] line-clamp-1 mt-0.5">
                        {art.summary}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#152236] border border-[#d4af37]/25 text-[#d4af37] text-[10px] font-bold uppercase">
                        {art.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          art.isPublished
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/40"
                        }`}
                      >
                        {art.isPublished ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã Xuất Bản</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Bản Nháp</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-400">
                      {new Date(art.publishedAt || art.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/tin-tuc/${art.slug}`}
                          target="_blank"
                          className="p-1.5 bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 hover:text-white rounded-lg transition-colors"
                          title="Xem trên web"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEdit(art)}
                          className="p-1.5 bg-[#d4af37]/15 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#070c14] rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 bg-rose-950/60 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-colors"
                          title="Xóa bài"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MODULAR BOX ARTICLE EDITOR MODAL                                 */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-7xl bg-[#0c1420] border-2 border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#111c2e] via-[#142339] to-[#0c1420] border-b border-[#d4af37]/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#d4af37] animate-pulse"></div>
                <div>
                  <h2 className="font-serif font-extrabold text-base sm:text-lg text-[#d4af37] uppercase tracking-wide">
                    {editingArt ? "CHỈNH SỬA BÀI VIẾT" : "SOẠN THẢO BÀI VIẾT CẨM NANG MỚI"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Phần soạn thảo chuyên nghiệp theo cấu trúc modular box
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#152236] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2-Column Layout */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT COLUMN: MAIN CONTENT (8 COLS) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Title Box */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl p-4 shadow-lg space-y-3">
                    <label className="text-xs font-bold text-white block uppercase">
                      Tiêu Đề Bài Viết *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ví dụ: Bí Quyết Bố Trí Ban Thờ Gia Tiên Chuẩn Phong Thủy Rước Tài Lộc"
                      className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-sm sm:text-base font-serif font-bold px-4 py-3 rounded-xl focus:outline-none"
                    />

                    {editingArt && (
                      <div className="p-2.5 bg-[#070c14] rounded-lg border border-[#1b283d] flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Đường dẫn bài viết:</span>
                        <a
                          href={`/tin-tuc/${editingArt.slug}`}
                          target="_blank"
                          className="font-mono text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <span>{`/tin-tuc/${editingArt.slug}`}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45]">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                        Mô Tả Tóm Tắt (Meta Summary)
                      </h3>
                    </div>
                    <div className="p-4">
                      <textarea
                        rows={3}
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Đoạn văn ngắn gọn trích dẫn ngoài danh sách bài viết và tối ưu thẻ Meta Description..."
                        className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Detailed Content with Rich Editor */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#d4af37]" />
                        <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                          Nội Dung Chi Tiết Bài Viết
                        </h3>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        Hỗ trợ Markdown, chèn bảng, hộp thông tin & video
                      </span>
                    </div>
                    <div className="p-4">
                      <ProductArticleEditor
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val })}
                        productName={formData.title || "Cẩm nang Đồ Đồng Lộc Nam"}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: SIDEBAR BOXES (4 COLS) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Publish Box */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                        Xuất Bản
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Sẵn sàng</span>
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#111c2e] border border-[#202f45]">
                        <span className="text-gray-300 font-medium">Trạng thái bài viết:</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                          className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors ${
                            formData.isPublished
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : "bg-gray-500/20 text-gray-400 border border-gray-500/40"
                          }`}
                        >
                          {formData.isPublished ? "Đã Xuất Bản" : "Bản Nháp"}
                        </button>
                      </div>

                      <div className="pt-2 border-t border-[#202f45] space-y-2">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleSave(undefined, true)}
                          className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] via-[#e5b869] to-[#d4af37] hover:brightness-110 text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{saving ? "ĐANG LƯU..." : editingArt ? "LƯU THAY ĐỔI" : "ĐĂNG BÀI VIẾT"}</span>
                        </button>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSave(undefined, false)}
                            disabled={saving}
                            className="flex-1 py-2 bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 hover:text-white rounded-lg font-semibold text-xs transition-colors"
                          >
                            Lưu Nháp
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 bg-[#1f2d42] hover:bg-[#2b3e5a] text-gray-400 hover:text-white rounded-lg font-semibold text-xs transition-colors"
                          >
                            Hủy Bỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Box with Hierarchical Selection */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-[#d4af37]" />
                        <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                          Chuyên Mục Bài Viết
                        </h3>
                      </div>
                      <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                        Đa nhánh
                      </span>
                    </div>

                    <div className="p-3 bg-[#0c1420] border-b border-[#202f45] text-xs">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={catSearch}
                          onChange={(e) => setCatSearch(e.target.value)}
                          placeholder="Tìm nhánh chuyên mục..."
                          className="w-full bg-[#111c2e] border border-[#202f45] text-white text-xs pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div className="p-3 max-h-64 overflow-y-auto space-y-1.5 custom-scrollbar text-xs">
                      {ARTICLE_CATEGORIES_TREE.map((main) => {
                        const isMainActive = formData.category === main.name;
                        const hasActiveChild = main.children.some(
                          (ch) => formData.category === ch || formData.tags.includes(ch)
                        );
                        const isExpanded = expandedMain[main.slug] ?? true;

                        return (
                          <div key={main.slug} className="space-y-1">
                            <div
                              className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isMainActive
                                  ? "bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700]"
                                  : hasActiveChild
                                  ? "bg-[#142339] text-white"
                                  : "hover:bg-[#152236] text-gray-200"
                              }`}
                            >
                              <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 select-none">
                                <input
                                  type="checkbox"
                                  checked={isMainActive || hasActiveChild}
                                  onChange={() => {
                                    setFormData((prev) => {
                                      const tagsArr = (prev.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
                                      if (prev.category === main.name) {
                                        return { ...prev, category: tagsArr[0] || "KIẾN THỨC ĐỒ ĐỒNG" };
                                      } else {
                                        if (!tagsArr.includes(main.name)) tagsArr.push(main.name);
                                        return { ...prev, category: main.name, tags: tagsArr.join(", ") };
                                      }
                                    });
                                  }}
                                  className="w-3.5 h-3.5 accent-[#d4af37] cursor-pointer"
                                />
                                <span className="font-bold text-xs truncate">{main.name}</span>
                              </label>

                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedMain((prev) => ({
                                    ...prev,
                                    [main.slug]: !prev[main.slug],
                                  }))
                                }
                                className="p-0.5 text-gray-400 hover:text-white"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="pl-4 space-y-1 border-l border-[#202f45] ml-2.5">
                                {main.children
                                  .filter(
                                    (ch) =>
                                      !catSearch.trim() ||
                                      ch.toLowerCase().includes(catSearch.toLowerCase().trim())
                                  )
                                  .map((childName) => {
                                    const isChildSelected =
                                      formData.category === childName ||
                                      (formData.tags || "").includes(childName);

                                    return (
                                      <label
                                        key={childName}
                                        className={`flex items-center gap-2 p-1 rounded transition-colors cursor-pointer select-none ${
                                          isChildSelected
                                            ? "bg-[#d4af37]/25 text-[#ffd700] font-semibold border border-[#d4af37]/35"
                                            : "hover:bg-[#152236] text-gray-300"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChildSelected}
                                          onChange={() => {
                                            setFormData((prev) => {
                                              let tagsArr = (prev.tags || "")
                                                .split(",")
                                                .map((s) => s.trim())
                                                .filter(Boolean);
                                              if (tagsArr.includes(childName)) {
                                                tagsArr = tagsArr.filter((t) => t !== childName);
                                              } else {
                                                tagsArr.push(childName);
                                              }
                                              return {
                                                ...prev,
                                                category: prev.category || main.name,
                                                tags: tagsArr.join(", "),
                                              };
                                            });
                                          }}
                                          className="w-3 h-3 accent-[#d4af37] cursor-pointer"
                                        />
                                        <span className="text-[11px] truncate">{childName}</span>
                                      </label>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-[#0c1420] border-t border-[#202f45]">
                      {!showAddCat ? (
                        <button
                          type="button"
                          onClick={() => setShowAddCat(true)}
                          className="text-xs text-[#ffd700] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Thêm chuyên mục mới</span>
                        </button>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            value={customCatName}
                            onChange={(e) => setCustomCatName(e.target.value)}
                            placeholder="Nhập tên chuyên mục mới..."
                            className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (customCatName.trim()) {
                                  setFormData({ ...formData, category: customCatName.trim() });
                                  setCustomCatName("");
                                  setShowAddCat(false);
                                }
                              }}
                              className="px-3 py-1 bg-[#d4af37] text-[#070c14] font-bold text-xs rounded-lg"
                            >
                              Đặt làm chuyên mục
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddCat(false)}
                              className="text-xs text-gray-400 hover:text-white"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Image Box */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45]">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                        Ảnh Đại Diện Bài Viết
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="relative aspect-video w-full rounded-lg bg-[#070c14] border border-[#1f2d42] overflow-hidden flex items-center justify-center">
                        {formData.thumbnail ? (
                          <img
                            src={formData.thumbnail}
                            alt="Ảnh bài viết"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">Chưa có ảnh đại diện</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.thumbnail}
                          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                          placeholder="/images/do-tho-cung.jpg"
                          className="flex-1 bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none font-mono"
                        />
                        <label className="px-3 py-1.5 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                          {uploadingThumbnail ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>Tải Lên</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadThumbnail}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tags Box */}
                  <div className="bg-[#0e1726] border border-[#202f45] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 bg-[#111c2e] border-b border-[#202f45] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#d4af37]" />
                        <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                          Thẻ Bài Viết (SEO Tags)
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <textarea
                        rows={2}
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="đồ thờ, phong thủy, kích thước lỗ ban, ý yên..."
                        className="w-full bg-[#111c2e] border border-[#202f45] focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-xl focus:outline-none resize-none"
                      />
                      <p className="text-[10px] text-gray-400">
                        Phân tách các thẻ bằng dấu phẩy (,). Thẻ giúp tăng cường SEO và tìm kiếm liên quan.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
