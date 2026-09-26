"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Film,
  UploadCloud,
  Search,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Play,
  FileVideo,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/admin/AdminToast";

interface VideoItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  sizeFormatted: string;
  createdAt: string;
  url: string;
}

export default function AdminVideosPage() {
  const { toastSuccess, toastError, toastWarning, confirm } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadMeta, setUploadMeta] = useState<{ name: string; size: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const totalBytes = useMemo(() => videos.reduce((acc, v) => acc + (v.size || 0), 0), [videos]);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);
  const MAX_STORAGE_MB = 500;
  const storagePercent = Math.min(100, Math.round((parseFloat(totalMB) / MAX_STORAGE_MB) * 100));

  const fetchVideos = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      if (data.success && Array.isArray(data.videos)) {
        setVideos(data.videos);
      }
    } catch {
      if (!silent) toastError("Không thể tải danh sách video từ máy chủ.", "Lỗi tải dữ liệu");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    if (!search.trim()) return videos;
    const q = search.toLowerCase();
    return videos.filter((v) => v.filename.toLowerCase().includes(q));
  }, [videos, search]);

  // Upload handler with chunking
  const handleUploadFile = async (file: File) => {
    if (!file) return;

    const validExts = [".mp4", ".webm", ".mov", ".ogg", ".avi", ".mkv", ".m4v"];
    const ext = ("." + file.name.split(".").pop()).toLowerCase();
    const isVideoType = file.type.startsWith("video/") || validExts.includes(ext);

    if (!isVideoType) {
      toastWarning("Vui lòng chọn tệp video hợp lệ (MP4, WebM, MOV, OGG, AVI, MKV).", "Định dạng không hợp lệ");
      return;
    }

    const MAX_SIZE = 150 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toastWarning("Dung lượng video vượt quá 150MB. Vui lòng nén video hoặc chọn tệp nhỏ hơn.", "Tệp quá lớn");
      return;
    }

    const formatSize = (bytes: number) => {
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus("Đang khởi tạo tải lên...");
    setUploadMeta({ name: file.name, size: formatSize(file.size) });

    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = "up_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunkBlob = file.slice(start, end);

        let chunkSuccess = false;
        let lastErrorMsg = "";

        for (let attempt = 1; attempt <= 3; attempt++) {
          setUploadStatus(
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
                lastErrorMsg = resData?.message || "Lỗi lưu phần video.";
              }
            } else {
              lastErrorMsg = `Máy chủ phản hồi mã lỗi ${res.status}.`;
            }
          } catch (e: any) {
            lastErrorMsg = e?.message || "Lỗi kết nối khi tải phần video.";
          }

          if (attempt < 3) {
            await new Promise((r) => setTimeout(r, 1000));
          }
        }

        if (!chunkSuccess) {
          throw new Error(lastErrorMsg || `Không thể tải phần ${i + 1}/${totalChunks}.`);
        }

        const percent = Math.round(((i + 1) / totalChunks) * 88);
        setUploadProgress(percent);
      }

      setUploadStatus("Đang ghép và tối ưu hóa video trên hệ thống...");
      setUploadProgress(92);

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
        setUploadProgress(100);
        setUploadStatus("Hoàn tất!");
        toastSuccess(`Đã tải video "${file.name}" lên kho lưu trữ thành công!`, "Tải video thành công");
        fetchVideos(true);
      } else {
        throw new Error(completeData?.message || "Lỗi hoàn tất xử lý video trên máy chủ.");
      }
    } catch (err: any) {
      console.error("Video Upload Error:", err);
      toastError(err?.message || "Lỗi tải video lên máy chủ.", "Lỗi tải video");
    } finally {
      setUploading(false);
      setUploadMeta(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = (video: VideoItem) => {
    confirm({
      title: "Xóa Video Khỏi Kho Lưu Trữ?",
      message: `Bạn có chắc chắn muốn xóa video "${video.filename}" (${video.sizeFormatted})? Thao tác này sẽ giải phóng dung lượng và không thể hoàn tác.`,
      confirmText: "Xác Nhận Xóa",
      cancelText: "Hủy Bỏ",
      type: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/videos?id=${video.id}`, { method: "DELETE" });
          const data = await res.json();
          if (data.success) {
            toastSuccess(data.message, "Đã xóa video");
            setVideos((prev) => prev.filter((v) => v.id !== video.id));
          } else {
            toastError(data.message || "Xóa video thất bại.", "Lỗi xóa video");
          }
        } catch {
          toastError("Lỗi kết nối khi xóa video.", "Lỗi mạng");
        }
      },
    });
  };

  const handleCopyUrl = (video: VideoItem) => {
    navigator.clipboard.writeText(window.location.origin + video.url);
    setCopiedId(video.id);
    toastSuccess("Đã sao chép liên kết video vào bộ nhớ tạm!", "Sao chép");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCode = (video: VideoItem) => {
    const cleanTitle = video.filename.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
    const code = `[video title="${cleanTitle}"]${video.url}[/video]`;
    navigator.clipboard.writeText(code);
    setCopiedCodeId(video.id);
    toastSuccess("Đã sao chép mã chèn [video] vào bộ nhớ tạm!", "Sao chép mã chèn");
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER & STATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              ĐỒ ĐỒNG LỘC NAM • KHO MEDIA
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide mt-1 flex items-center gap-3">
            <span>QUẢN LÝ KHO VIDEO TẢI LÊN</span>
            <span className="text-sm font-sans font-bold px-3 py-1 rounded-full bg-[#152236] text-rose-400 border border-rose-500/30">
              {videos.length} video
            </span>
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Quản lý video thực tế quay tác phẩm, quy trình đúc đồng, sao chép mã chèn bài viết và theo dõi dung lượng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchVideos()}
            className="p-2.5 bg-[#111c2e] hover:bg-[#152236] text-[#d4af37] border border-[#d4af37]/30 rounded-xl transition-all shadow"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105 disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Tải Video Mới</span>
          </button>
        </div>
      </div>

      {/* STORAGE & CDN STATUS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Storage Card */}
        <div className="bg-[#0c1420] border border-[#d4af37]/25 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Dung lượng đã dùng:</span>
              </span>
              <span className="font-mono font-bold text-[#d4af37]">
                {totalMB} MB / {MAX_STORAGE_MB} MB ({storagePercent}%)
              </span>
            </div>
            <div className="w-full bg-[#152236] rounded-full h-2 overflow-hidden border border-[#1e344d]">
              <div
                className="bg-gradient-to-r from-emerald-500 via-[#d4af37] to-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Video Count Card */}
        <div className="bg-[#0c1420] border border-rose-500/25 p-4 rounded-2xl shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block uppercase font-medium">Tổng số video sẵn sàng</span>
            <div className="text-lg font-bold text-white font-mono">{videos.length} tệp video</div>
          </div>
        </div>

        {/* CDN Stream Ready Card */}
        <div className="bg-[#0c1420] border border-emerald-500/25 p-4 rounded-2xl shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-emerald-400 font-bold block uppercase">Edge CDN & HTTP 206</span>
            <div className="text-xs text-gray-300">Phát trực tuyến mượt mà, hỗ trợ tua nhanh</div>
          </div>
        </div>
      </div>

      {/* DROPZONE UPLOAD AREA */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/ogg,video/x-msvideo,.mp4,.webm,.mov,.avi,.mkv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUploadFile(file);
        }}
        disabled={uploading}
      />

      {uploading ? (
        <div className="p-6 rounded-2xl bg-[#0c1420] border-2 border-rose-500/50 shadow-2xl flex flex-col items-center justify-center gap-3 text-center">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
            <Film className="w-6 h-6 text-rose-300 absolute" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              Đang tải lên: <span className="text-rose-400">{uploadMeta?.name}</span>
            </p>
            <p className="text-xs text-gray-400">
              {uploadMeta?.size} • {uploadStatus || "Máy chủ đang xử lý và phân mảnh dữ liệu..."}
            </p>
          </div>
          <div className="w-full max-w-md bg-[#152236] rounded-full h-3 overflow-hidden border border-[#1e344d]">
            <div
              className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400 h-full transition-all duration-200 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-rose-400">{uploadProgress}% Hoàn tất</span>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleUploadFile(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-4 group ${
            isDragOver
              ? "border-rose-400 bg-rose-500/10 scale-[1.01]"
              : "border-[#203752] hover:border-rose-500/70 bg-[#0c1420] hover:bg-[#0f1b2d]"
          }`}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform shrink-0">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Kéo thả hoặc bấm vào đây để tải video mới lên kho
              </p>
              <p className="text-xs text-gray-400">
                Hỗ trợ MP4, WebM, MOV (Khuyên dùng dưới 50MB để tải nhanh nhất)
              </p>
            </div>
          </div>
          <span className="px-4 py-2 bg-[#152236] group-hover:bg-rose-600 text-gray-300 group-hover:text-white rounded-xl text-xs font-bold transition-all shrink-0 border border-[#1e344d]">
            Chọn Tệp Từ Máy Tính
          </span>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-[#0c1420] border border-[#d4af37]/20 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm video theo tên tệp..."
            className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none transition-all placeholder:text-gray-500"
          />
        </div>
        <div className="text-xs text-gray-400 font-mono shrink-0">
          Hiển thị: <span className="font-bold text-white">{filteredVideos.length}</span> video
        </div>
      </div>

      {/* VIDEO GRID */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin" />
          <p className="text-xs text-gray-400">Đang tải kho video Lộc Nam...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-16 bg-[#0c1420] border border-[#1e344d] rounded-2xl text-center space-y-3">
          <FileVideo className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Chưa Có Video Nào Trong Kho</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {search
              ? `Không tìm thấy video nào khớp với từ khóa "${search}".`
              : "Bạn có thể bấm 'Tải Video Mới' ở trên để bắt đầu đưa video tác phẩm lên kho lưu trữ."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const cleanTitle = video.filename.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
            const isCopied = copiedId === video.id;
            const isCodeCopied = copiedCodeId === video.id;

            return (
              <div
                key={video.id}
                className="bg-[#0c1420] border border-[#1e344d] hover:border-rose-500/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Video Player */}
                <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden border-b border-[#1e344d]">
                  <video
                    src={video.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2.5 left-2.5 pointer-events-none">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-black/80 border border-rose-500/40 text-rose-300 backdrop-blur-sm">
                      {video.sizeFormatted}
                    </span>
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs text-white truncate group-hover:text-rose-400 transition-colors" title={video.filename}>
                      {video.filename}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{new Date(video.createdAt).toLocaleString("vi-VN")}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-[#152236]">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(video)}
                        className={`py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isCodeCopied
                            ? "bg-emerald-600 text-white"
                            : "bg-[#152236] hover:bg-rose-600 text-gray-300 hover:text-white border border-[#1e344d]"
                        }`}
                        title="Sao chép cú pháp [video] để dán vào bài viết"
                      >
                        {isCodeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCodeCopied ? "Đã chép mã" : "Chép mã chèn"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyUrl(video)}
                        className={`py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isCopied
                            ? "bg-emerald-600 text-white"
                            : "bg-[#152236] hover:bg-[#1d2f4a] text-gray-300 hover:text-white border border-[#1e344d]"
                        }`}
                        title="Sao chép đường dẫn trực tiếp"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Đã chép link" : "Chép link URL"}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(video)}
                      className="w-full py-1.5 px-3 rounded-lg text-[10px] font-bold text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa video này khỏi kho</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
