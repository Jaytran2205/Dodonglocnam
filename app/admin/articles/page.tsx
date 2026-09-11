"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, RefreshCw, Eye, FileText, Calendar, CheckCircle2, XCircle, ExternalLink, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArt, setEditingArt] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    thumbnail: "",
    category: "KIẾN THỨC ĐỒ ĐỒNG",
    isPublished: true
  });
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

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
      isPublished: true
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
      isPublished: Boolean(art.isPublished)
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("Vui lòng nhập tiêu đề bài viết");

    setSaving(true);
    try {
      const res = await fetch("/api/admin/articles", {
        method: editingArt ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: editingArt?.id })
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              CẨM NANG & NỘI DUNG SEO
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide mt-1">
            QUẢN LÝ BÀI VIẾT & KIẾN THỨC ({articles.length})
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Biên tập cẩm nang phong thủy thờ cúng, kiến thức đúc tượng chân dung và tin tức làng nghề
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

      {/* Articles Table */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-400">Đang tải danh sách bài viết...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 space-y-3 text-gray-400">
            <FileText className="w-12 h-12 mx-auto text-gray-600" />
            <p className="text-sm">Chưa có bài viết nào trong cơ sở dữ liệu.</p>
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
                {articles.map((art) => (
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

      {/* CREATE / EDIT ARTICLE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#0c1420] border-2 border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-gradient-to-r from-[#111c2e] to-[#0c1420] border-b border-[#d4af37]/30 flex items-center justify-between">
              <h2 className="font-serif font-extrabold text-lg text-[#d4af37] uppercase tracking-wide">
                {editingArt ? "CHỈNH SỬA BÀI VIẾT" : "SOẠN THẢO BÀI VIẾT MỚI"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#152236] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">Tiêu Đề Bài Viết *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Bí quyết chọn bộ đỉnh đồng gia tiên chuẩn phong thủy Lỗ Ban"
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white block uppercase">Chuyên Mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                  >
                    <option value="KIẾN THỨC ĐỒ ĐỒNG">KIẾN THỨC ĐỒ ĐỒNG</option>
                    <option value="KIẾN THỨC PHONG THỦY">KIẾN THỨC PHONG THỦY</option>
                    <option value="BẠN CÓ BIẾT">BẠN CÓ BIẾT</option>
                    <option value="TIN TỨC SỰ KIỆN">TIN TỨC SỰ KIỆN</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white block uppercase">Ảnh Đại Diện (URL hoặc Tải Lên)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="/images/do-tho-cung.jpg"
                      className="flex-1 bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none font-mono"
                    />
                    <label className="px-3 py-2 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
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

              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">Mô Tả Tóm Tắt (Meta Summary)</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Đoạn trích dẫn ngắn gọn hiển thị ngoài danh sách bài viết..."
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white block uppercase">Nội Dung Chi Tiết (Hỗ trợ tiêu đề ### và gạch đầu dòng -)</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung bài viết chi tiết..."
                  className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none font-mono resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#111c2e] rounded-xl border border-[#1f2d42]">
                <input
                  type="checkbox"
                  id="publishedCheck"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-[#d4af37] rounded cursor-pointer"
                />
                <label htmlFor="publishedCheck" className="font-bold text-emerald-400 cursor-pointer">
                  Xuất Bản Ngay Lên Website
                </label>
              </div>

              <div className="pt-4 border-t border-[#1f2d42] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 hover:text-white rounded-xl font-semibold uppercase"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5b869] hover:from-[#b89628] hover:to-[#d4af37] text-[#070c14] font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : editingArt ? "Lưu Thay Đổi" : "Đăng Bài Viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
