"use client";

import { HomeCategoryEditor } from "@/components/admin/HomeCategoryEditor";

import { AdminImage } from "@/components/admin/AdminImage";

import { DEFAULT_HOME_SETTINGS, DEFAULT_HOME_SLIDES, DEFAULT_HOME_VIDEOS } from "@/lib/home-content";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  ExternalLink,
  CheckCircle,
  Phone,
  MapPin,
  Mail,
  Store,
  Factory,
  Share2,
  Image as ImageIcon,
  Navigation,
  Globe,
  Loader2,
  Layers,
  Star,
  Sparkles,
  Award,
  Upload,
  Film,
  Play,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Video,
  X,
  Clock,
  Eye,
  BookOpen,
  FileEdit,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/admin/AdminToast";
import { ProductArticleEditor } from "@/components/admin/ProductArticleEditor";

export default function AdminLandingPageManager() {
  const { toastSuccess, toastError, toastWarning, confirm: showConfirm } = useToast();
  const [settings, setSettings] = useState<any>(DEFAULT_HOME_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [modifiedKeys, setModifiedKeys] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<
    | "hero"
    | "featured_categories"
    | "favorite_products"
    | "videos"
    | "reviews"
    | "branches"
    | "artisan"
    | "social"
    | "general"
  >("hero");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  useEffect(() => {
    const openLinkedTab = () => {
      if (window.location.hash === "#home-categories" || new URLSearchParams(window.location.search).get("tab") === "featured_categories") {
        setActiveTab("featured_categories");
      }
    };
    openLinkedTab();
    window.addEventListener("hashchange", openLinkedTab);
    return () => window.removeEventListener("hashchange", openLinkedTab);
  }, []);


  // 2 Facility Articles (Nghệ nhân & Xưởng đúc)
  const [facilityArticles, setFacilityArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [editingArticleModal, setEditingArticleModal] = useState<any | null>(null);
  const [savingArticleId, setSavingArticleId] = useState<string | null>(null);
  const [savingModalArticle, setSavingModalArticle] = useState(false);

  const fetchFacilityArticles = async () => {
    try {
      setLoadingArticles(true);
      const res = await fetch("/api/admin/articles?facilityOnly=1");
      const data = await res.json();
      if (data.success && data.articles) {
        const filtered = data.articles.filter((a: any) =>
          ["nghe-nhan-duong-ba-tien", "xuong-san-xuat-duc-dong-loc-nam"].includes(a.slug)
        );
        setFacilityArticles(filtered);
      }
    } catch (err) {
      console.error("Error loading facility articles:", err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleUpdateArticleQuick = async (articleId: string, updates: Partial<any>) => {
    setSavingArticleId(articleId);
    try {
      const art = facilityArticles.find((a) => a.id === articleId);
      if (!art) return;

      const payload = {
        ...art,
        ...updates,
      };

      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toastSuccess(`Đã lưu bài viết "${payload.title}" thành công!`, "Cập nhật bài viết");
        setFacilityArticles((prev) =>
          prev.map((a) => (a.id === articleId ? { ...a, ...updates } : a))
        );
      } else {
        toastError(data.message || "Không thể lưu bài viết", "Lỗi");
      }
    } catch {
      toastError("Lỗi kết nối khi lưu bài viết", "Lỗi mạng");
    } finally {
      setSavingArticleId(null);
    }
  };

  const handleUploadArticleThumbnail = async (articleId: string, file: File) => {
    const uploadKey = `article_thumb_${articleId}`;
    setUploadingKey(uploadKey);
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (data.success && data.url) {
        await handleUpdateArticleQuick(articleId, { thumbnail: data.url });
        toastSuccess(`Đã cập nhật ảnh đại diện bài viết!`, "Tải ảnh");
      } else {
        toastError(data.message || "Tải ảnh thất bại", "Lỗi tải ảnh");
      }
    } catch {
      toastError("Lỗi tải ảnh lên máy chủ", "Lỗi mạng");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSaveModalArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticleModal) return;
    setSavingModalArticle(true);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArticleModal),
      });
      const data = await res.json();
      if (data.success) {
        toastSuccess(`Đã lưu toàn bộ bài viết "${editingArticleModal.title}" thành công!`, "Cập nhật bài viết");
        setFacilityArticles((prev) =>
          prev.map((a) => (a.id === editingArticleModal.id ? editingArticleModal : a))
        );
        setEditingArticleModal(null);
      } else {
        toastError(data.message || "Không thể lưu bài viết", "Lỗi");
      }
    } catch {
      toastError("Lỗi kết nối khi lưu bài viết", "Lỗi mạng");
    } finally {
      setSavingModalArticle(false);
    }
  };

  const [sliderBanners, setSliderBanners] = useState<any[]>(DEFAULT_HOME_SLIDES);

  const handleUpdateBanner = (index: number, field: string, val: any) => {
    setSliderBanners((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      handleChange("home_slider_banners", JSON.stringify(updated));
      return updated;
    });
  };

  const handleMoveBanner = (index: number, direction: "up" | "down") => {
    setSliderBanners((prev) => {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      handleChange("home_slider_banners", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteBanner = (index: number) => {
    if (sliderBanners.length <= 1) {
      toastWarning("Cần giữ lại ít nhất 1 banner trong hệ thống!", "Không thể xóa");
      return;
    }
    showConfirm({
      title: "Xác nhận xóa banner",
      message: "Bạn có chắc chắn muốn xóa banner này khỏi hệ thống trang chủ?",
      confirmText: "Xóa Banner",
      cancelText: "Hủy Bỏ",
      type: "danger",
      onConfirm: () => {
        setSliderBanners((prev) => {
          const updated = prev.filter((_, idx) => idx !== index);
          handleChange("home_slider_banners", JSON.stringify(updated));
          return updated;
        });
        toastSuccess("Đã xóa banner khỏi danh sách!", "Đã xóa");
      },
    });
  };

  const handleAddBanner = () => {
    setSliderBanners((prev) => {
      const newBanner = {
        id: Date.now().toString(),
        title: "Banner mới " + (prev.length + 1),
        subtitle: "",
        image: "/images/banners/banner_he_thong_xuong_moi.jpg",
        link: "/san-pham",
        active: true,
      };
      const updated = [...prev, newBanner];
      handleChange("home_slider_banners", JSON.stringify(updated));
      return updated;
    });
  };

  const handleUploadBannerImage = async (index: number, file: File) => {
    const uploadKey = `slider_banner_${index}`;
    setUploadingKey(uploadKey);
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (data.success && data.url) {
        handleUpdateBanner(index, "image", data.url);
        toastSuccess(`Đã tải ảnh banner "${file.name}" lên thành công!`, "Tải ảnh");
      } else {
        toastError(data.message || "Tải ảnh thất bại", "Lỗi tải ảnh");
      }
    } catch {
      toastError("Lỗi tải ảnh lên máy chủ", "Lỗi mạng");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleUploadImage = async (key: string, file: File) => {
    setUploadingKey(key);
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (data.success && data.url) {
        handleChange(key, data.url);
        toastSuccess(`Đã tải ảnh "${file.name}" lên thành công!`, "Tải ảnh");
      } else {
        toastError(data.message || "Tải ảnh thất bại", "Lỗi tải ảnh");
      }
    } catch {
      toastError("Lỗi tải ảnh lên máy chủ", "Lỗi mạng");
    } finally {
      setUploadingKey(null);
    }
  };

  const defaultHomeVideos = [
    {
      id: "v1",
      title: "Trực Tiếp Quy Trình Rót Đồng Đại Hồng Chung 1 Tấn - Chuông Đồng Đỏ Nguyên Chất Ý Yên",
      category: "QUY TRÌNH ĐÚC ĐỒNG",
      duration: "05:32",
      views: "15.420",
      image: "/images/videos/NUnVlHO1mEU.jpg",
      videoUrl: "https://www.youtube.com/watch?v=NUnVlHO1mEU",
      desc: "Cận cảnh quy trình nghệ nhân nấu đồng đỏ nguyên chất và rót khuôn đúc Đại Hồng Chung 1 tấn tại xưởng đúc đồng Lộc Nam.",
      active: true,
    },
    {
      id: "v2",
      title: "Nghệ Nhân Chạm Khắc Long Phụng Trên Bề Mặt Trống Đồng Đông Sơn - Tinh Xảo Từng Chi Tiết",
      category: "CHẠM KHẮC THỦ CÔNG",
      duration: "08:15",
      views: "28.910",
      image: "/images/videos/wmWQK2MBn3c.jpg",
      videoUrl: "https://www.youtube.com/watch?v=wmWQK2MBn3c",
      desc: "Từng đường nét hoa văn chạm tỉ mỉ bằng tay thể hiện tay nghề thượng thừa của nghệ nhân gia truyền.",
      active: true,
    },
    {
      id: "v3",
      title: "Hướng Dẫn Phân Biệt Đồng Thật Chuẩn Cát Tút Với Đồng Pha Kém Chất Lượng Ngoài Thị Trường",
      category: "KIẾN THỨC ĐỒ THỜ",
      duration: "04:45",
      views: "42.150",
      image: "/images/videos/o-vHwLilgjM.jpg",
      videoUrl: "https://www.youtube.com/watch?v=o-vHwLilgjM",
      desc: "Kinh nghiệm thực tế chọn đồng chuẩn, giữ màu bền đẹp hàng trăm năm không bị oxy hóa hay hoen gỉ.",
      active: true,
    },
    {
      id: "v4",
      title: "Bàn Giao Bộ Đỉnh Đồng Cát Tút Cao Cấp Cho Biệt Thự Gia Chủ Tại Starlake Tây Hồ",
      category: "BÀN GIAO CÔNG TRÌNH",
      duration: "06:20",
      views: "19.800",
      image: "/images/videos/ctwWCrZZwk4.jpg",
      videoUrl: "https://www.youtube.com/watch?v=ctwWCrZZwk4",
      desc: "Trọn bộ đỉnh đồng cát tút ngũ sự an vị trang nghiêm trên ban thờ gia tiên của khách hàng VIP tại Hà Nội.",
      active: true,
    },
  ];

  const [homeVideos, setHomeVideos] = useState<any[]>(DEFAULT_HOME_VIDEOS);
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
  const [loadingUploadedVideos, setLoadingUploadedVideos] = useState(false);
  const [videoPickerIndex, setVideoPickerIndex] = useState<number | null>(null);
  const [previewModalVideo, setPreviewModalVideo] = useState<{ title: string; url: string } | null>(null);

  const fetchUploadedVideos = async () => {
    setLoadingUploadedVideos(true);
    try {
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      if (data.success && data.videos) {
        setUploadedVideos(data.videos);
      }
    } catch (err) {
      console.error("Error fetching uploaded videos:", err);
    } finally {
      setLoadingUploadedVideos(false);
    }
  };

  const openVideoPicker = (index: number) => {
    setVideoPickerIndex(index);
    if (uploadedVideos.length === 0) {
      fetchUploadedVideos();
    }
  };

  const handleUpdateVideo = (index: number, field: string, val: any) => {
    setHomeVideos((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      handleChange("home_videos", JSON.stringify(updated));
      return updated;
    });
  };

  const handleMoveVideo = (index: number, direction: "up" | "down") => {
    setHomeVideos((prev) => {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      handleChange("home_videos", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteVideo = (index: number) => {
    if (homeVideos.length <= 1) {
      toastWarning("Cần giữ lại ít nhất 1 video trong hệ thống!", "Không thể xóa");
      return;
    }
    showConfirm({
      title: "Xác nhận xóa video",
      message: "Bạn có chắc chắn muốn xóa video này khỏi danh sách hiển thị trên trang chủ?",
      confirmText: "Xóa Video",
      cancelText: "Hủy Bỏ",
      type: "danger",
      onConfirm: () => {
        setHomeVideos((prev) => {
          const updated = prev.filter((_, idx) => idx !== index);
          handleChange("home_videos", JSON.stringify(updated));
          return updated;
        });
        toastSuccess("Đã xóa video khỏi danh sách!", "Đã xóa");
      },
    });
  };

  const handleAddVideo = () => {
    setHomeVideos((prev) => {
      const newVideo = {
        id: "v_" + Date.now().toString(),
        title: "Video mới " + (prev.length + 1),
        category: "QUY TRÌNH CHẾ TÁC",
        duration: "05:00",
        views: "10.000",
        image: "/images/hero_golden_ship.jpg",
        videoUrl: "",
        desc: "Mô tả ngắn gọn về video quy trình đúc đồng hoặc sản phẩm thực tế.",
        active: true,
      };
      const updated = [...prev, newVideo];
      handleChange("home_videos", JSON.stringify(updated));
      return updated;
    });
  };

  const handleUploadVideoThumbnail = async (index: number, file: File) => {
    const uploadKey = `video_thumb_${index}`;
    setUploadingKey(uploadKey);
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (data.success && data.url) {
        handleUpdateVideo(index, "image", data.url);
        toastSuccess(`Đã tải ảnh đại diện video thành công!`, "Tải ảnh");
      } else {
        toastError(data.message || "Tải ảnh thất bại", "Lỗi tải ảnh");
      }
    } catch {
      toastError("Lỗi tải ảnh lên máy chủ", "Lỗi mạng");
    } finally {
      setUploadingKey(null);
    }
  };

  const getEmbedHelper = (url: string) => {
    if (!url) return { type: "youtube" as const, src: "" };
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return {
        type: "youtube" as const,
        src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`,
      };
    }
    if (url.includes("youtube.com/embed")) {
      const src = url.includes("autoplay=1") ? url : `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;
      return { type: "youtube" as const, src };
    }
    return { type: "video" as const, src: url };
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/landing-page", { signal: controller.signal, cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (controller.signal.aborted) return;
        if (data.success && data.settings) {
          setSettings((prev: any) => ({ ...prev, ...data.settings }));
          if (data.settings.home_slider_banners) {
            try {
              const parsed = JSON.parse(data.settings.home_slider_banners);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setSliderBanners(parsed);
              }
            } catch (err) {
              console.error("Error parsing home_slider_banners:", err);
            }
          }
          if (data.settings.home_videos) {
            try {
              const parsed = JSON.parse(data.settings.home_videos);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setHomeVideos(parsed);
              }
            } catch (err) {
              console.error("Error parsing home_videos:", err);
            }
          }
        }
      })
      .catch((e) => { if (!controller.signal.aborted) console.error("Load settings error:", e); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    fetchFacilityArticles();
    return () => controller.abort();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    setModifiedKeys((prev) => new Set(prev).add(key));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadingKey !== null || saving) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      // Nếu có các trường đã chỉnh sửa thì chỉ gửi các trường đó, nếu chưa có thì gửi toàn bộ settings
      const payload: Record<string, any> = {};
      if (modifiedKeys.size > 0) {
        modifiedKeys.forEach((k) => {
          payload[k] = settings[k];
        });
      }

      const res = await fetch("/api/admin/landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: modifiedKeys.size > 0 ? payload : settings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModifiedKeys(new Set());
        setSavedSuccess(true);
        toastSuccess("Đã lưu toàn bộ cài đặt giao diện trang chủ thành công!", "Cập nhật thành công 🎉");
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        toastError(data.message || "Lỗi lưu cài đặt", "Lưu thất bại");
      }
    } catch (e) {
      toastError("Lỗi kết nối máy chủ khi lưu", "Lỗi mạng");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#d4af37]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-3 text-sm font-semibold">Đang tải cấu hình hệ thống...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span className="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">
              TRUNG TÂM QUẢN TRỊ NỘI DUNG
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide mt-1">
            QUẢN LÝ TRANG CHỦ & NỘI DUNG WEBSITE
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Tùy chỉnh hình ảnh, tên gọi 5 Danh mục nổi bật, 5 Sản phẩm yêu thích, 8 Dự án & đánh giá khách hàng, hệ thống Showroom và Hotline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111c2e] hover:bg-[#152236] text-[#d4af37] border border-[#d4af37]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Xem Website</span>
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs rounded-2xl flex items-center gap-3 animate-fadeIn shadow-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <strong className="text-emerald-300">Lưu cấu hình thành công!</strong> Các thay đổi đã được áp dụng tức thì lên Trang Chủ và các mục hiển thị.
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1f2d42] pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === "hero"
              ? "bg-[#d4af37] text-[#0c1420] shadow-md"
              : "bg-[#121c2b] text-[#94a3b8] hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Banner Slide Trang Chủ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("featured_categories")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === "featured_categories"
              ? "bg-[#d4af37] text-[#0c1420] shadow-md"
              : "bg-[#121c2b] text-[#94a3b8] hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Danh Mục Nổi Bật Trang Chủ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("favorite_products")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === "favorite_products"
              ? "bg-[#d4af37] text-[#0c1420] shadow-md"
              : "bg-[#121c2b] text-[#94a3b8] hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Sản Phẩm Yêu Thích (5 Mẫu)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("videos")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === "videos"
              ? "bg-[#d4af37] text-[#0c1420] shadow-md"
              : "bg-[#121c2b] text-[#94a3b8] hover:text-white"
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Video Trang Chủ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === "reviews"
              ? "bg-[#d4af37] text-[#0c1420] shadow-md"
              : "bg-[#121c2b] text-[#94a3b8] hover:text-white"
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Dự Án & Đánh Giá Khách Hàng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("branches")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === "branches"
              ? "bg-[#d4af37] text-[#0c1420] shadow-md"
              : "bg-[#121c2b] text-[#94a3b8] hover:text-white"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>4 Cơ Sở & Xưởng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("artisan")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === "artisan"
              ? "bg-[#d4af37] text-[#0c1420] shadow-md"
              : "bg-[#121c2b] text-[#94a3b8] hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Giới Thiệu Cơ Sở & Nghệ Nhân</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === "social"
              ? "bg-[#d4af37] text-[#0c1420] shadow-md"
              : "bg-[#121c2b] text-[#94a3b8] hover:text-white"
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Hotline & MXH</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === "general"
              ? "bg-[#d4af37] text-[#0c1420] shadow-md"
              : "bg-[#121c2b] text-[#94a3b8] hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Thông Tin Chung</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* TAB: BANNER SLIDE TRANG CHỦ & HERO */}
        {activeTab === "hero" && (
          <div className="space-y-8 animate-fadeIn">
            {/* SECTION 1: BANNER SLIDE CAROUSEL TRANG CHỦ */}
            <div className="bg-[#0c1420] border-2 border-[#d4af37]/40 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2d42] pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <ImageIcon className="w-5 h-5" />
                    <h3 className="font-serif font-bold text-base uppercase tracking-wide">
                      Banner Slide Đầu Trang Chủ (Carousel 4 Banner)
                    </h3>
                  </div>
                  <p className="text-xs text-[#94a3b8]">
                    Quản lý danh sách banner trượt tự động trên đầu trang chủ. Quý khách có thể đổi ảnh, sửa link đích, đổi tiêu đề, tắt/bật hoặc thêm banner mới.
                  </p>
                </div>

                {/* Autoplay Delay Control */}
                <div className="flex items-center gap-3 shrink-0 bg-[#121c2b] px-4 py-2 rounded-xl border border-[#1f2d42]">
                  <span className="text-xs text-[#94a3b8] whitespace-nowrap font-medium">Tốc độ tự chuyển:</span>
                  <select
                    value={settings.home_slider_autoplay || "5000"}
                    onChange={(e) => handleChange("home_slider_autoplay", e.target.value)}
                    className="bg-[#0c1420] text-[#d4af37] text-xs font-bold px-2.5 py-1.5 rounded-lg border border-[#d4af37]/40 focus:outline-none"
                  >
                    <option value="3000">3 Giây</option>
                    <option value="4000">4 Giây</option>
                    <option value="5000">5 Giây (Chuẩn)</option>
                    <option value="6000">6 Giây</option>
                    <option value="8000">8 Giây</option>
                    <option value="0">Tắt tự động chuyển</option>
                  </select>
                </div>
              </div>

              {/* Slide Cards List */}
              <div className="space-y-5">
                {sliderBanners.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className={`border rounded-xl p-4 sm:p-5 transition-all ${
                      slide.active !== false
                        ? "bg-[#121c2b]/90 border-[#22354e] hover:border-[#d4af37]/60"
                        : "bg-[#0f1722]/50 border-dashed border-[#1f2d42] opacity-60"
                    }`}
                  >
                    {/* Top Bar of Card: Index, Title & Controls */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#1f2d42] mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0c1420] font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-serif font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                          Banner {idx + 1}: {slide.title || "Chưa đặt tiêu đề"}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            slide.active !== false
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {slide.active !== false ? "Đang hiển thị" : "Đã tạm ẩn"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveBanner(idx, "up")}
                          className="px-2 py-1 rounded-lg bg-[#1f2d42] hover:bg-[#2d415f] text-[#94a3b8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors"
                          title="Di chuyển lên trước"
                        >
                          ▲ Lên
                        </button>
                        <button
                          type="button"
                          disabled={idx === sliderBanners.length - 1}
                          onClick={() => handleMoveBanner(idx, "down")}
                          className="px-2 py-1 rounded-lg bg-[#1f2d42] hover:bg-[#2d415f] text-[#94a3b8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors"
                          title="Di chuyển xuống sau"
                        >
                          ▼ Xuống
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(idx)}
                          className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-xs font-bold transition-colors"
                          title="Xóa banner này"
                        >
                          ✕ Xóa
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {/* Image Preview & Upload */}
                      <div className="lg:col-span-5 space-y-2.5">
                        <label className="block text-[#d4af37] font-bold text-xs uppercase tracking-wider">
                          Hình Ảnh Banner:
                        </label>
                        <div className="aspect-[24/9] rounded-xl overflow-hidden bg-[#0c1420] border border-[#1f2d42] relative flex items-center justify-center group/preview">
                          {slide.image ? (
                            <AdminImage
                              src={slide.image}
                              alt={slide.title}
                              className="w-full h-full object-contain object-center"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-[#94a3b8]/40" />
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={slide.image || ""}
                              onChange={(e) => handleUpdateBanner(idx, "image", e.target.value)}
                              placeholder="/images/banners/banner_he_thong_xuong_moi.jpg"
                              className="flex-1 px-3 py-1.5 bg-[#0c1420] border border-[#1f2d42] rounded-lg text-white text-xs focus:outline-none focus:border-[#d4af37]"
                            />
                            <label className="px-3 py-1.5 bg-[#d4af37] hover:bg-[#bfa035] text-[#0c1420] rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0 transition-colors shadow-sm">
                              {uploadingKey === `slider_banner_${idx}` ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Đổi Ảnh</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadBannerImage(idx, f);
                                }}
                              />
                            </label>
                          </div>
                          <p className="text-[10px] text-[#64748b]">
                            Khuyên dùng ảnh tỷ lệ 3:1 (1024x341 hoặc 1920x640px) để hiển thị đẹp nhất.
                          </p>
                        </div>
                      </div>

                      {/* Title & Link Inputs */}
                      <div className="lg:col-span-7 space-y-3">
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                            Tiêu đề Banner / Chú thích SEO:
                          </label>
                          <input
                            type="text"
                            value={slide.title || ""}
                            onChange={(e) => handleUpdateBanner(idx, "title", e.target.value)}
                            placeholder="Nhập tiêu đề banner..."
                            className="w-full px-3 py-2 bg-[#0c1420] border border-[#1f2d42] rounded-lg text-white text-xs focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                            Đường dẫn khi khách click (Link đích):
                          </label>
                          <input
                            type="text"
                            value={slide.link || ""}
                            onChange={(e) => handleUpdateBanner(idx, "link", e.target.value)}
                            placeholder="/san-pham/tuong-dong"
                            className="w-full px-3 py-2 bg-[#0c1420] border border-[#1f2d42] rounded-lg text-[#d4af37] font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                          />

                          {/* Quick destination selectors */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-[#64748b] mr-1">Chọn nhanh:</span>
                            {[
                              { label: "Trang Chủ", path: "/" },
                              { label: "Đồ Thờ Cúng", path: "/san-pham/do-tho-cung" },
                              { label: "Tượng Đồng", path: "/san-pham/tuong-dong" },
                              { label: "Tranh Đồng", path: "/san-pham/tranh-dong" },
                              { label: "Trống Đồng", path: "/san-pham/trong-dong" },
                              { label: "Quà Tặng", path: "/san-pham/qua-tang-dong" },
                              { label: "Giới Thiệu", path: "/gioi-thieu" },
                              { label: "Liên Hệ", path: "/lien-he" },
                            ].map((dest) => (
                              <button
                                key={dest.path}
                                type="button"
                                onClick={() => handleUpdateBanner(idx, "link", dest.path)}
                                className={`text-[10px] px-2 py-0.5 rounded transition-all ${
                                  slide.link === dest.path
                                    ? "bg-[#d4af37] text-[#0c1420] font-bold shadow-sm"
                                    : "bg-[#1f2d42] text-[#94a3b8] hover:text-white hover:bg-[#2d415f]"
                                }`}
                              >
                                {dest.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={slide.active !== false}
                              onChange={(e) => handleUpdateBanner(idx, "active", e.target.checked)}
                              className="w-4 h-4 rounded text-[#d4af37] focus:ring-[#d4af37] bg-[#0c1420] border-[#1f2d42]"
                            />
                            <span className="text-xs text-white font-medium">
                              Bật hiển thị banner này trên trang chủ
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Slide Button */}
              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={handleAddBanner}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f2d42] hover:bg-[#2d415f] text-[#d4af37] border border-[#d4af37]/40 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
                >
                  <span>+ Thêm Banner Slide Mới</span>
                </button>
              </div>
            </div>

            {/* SECTION 2: HERO BANNER GIỚI THIỆU (THUYỀN BUỒM PHONG THỦY) */}
            <div className="bg-[#0c1420] border border-[#1f2d42] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <ImageIcon className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  Cấu Hình Khối Giới Thiệu Quà Tặng Tinh Hoa (Thuyền Buồm Mạ Vàng)
                </h3>
              </div>
              <p className="text-[#94a3b8]">
                Thông điệp thương hiệu quà tặng cao cấp, đồ mỹ nghệ trang trí cho doanh nghiệp, đối tác và lãnh đạo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start pt-2">
                {/* Left: Image preview & upload */}
                <div className="sm:col-span-5 space-y-3">
                  <label className="block text-[#d4af37] font-bold text-xs uppercase tracking-wider">
                    Hình ảnh Thuyền Buồm Phong Thủy:
                  </label>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#121c2b] border border-[#1f2d42] relative flex items-center justify-center">
                    {settings.hero_image ? (
                      <AdminImage
                        src={settings.hero_image}
                        alt="Hero Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-[#94a3b8]/40" />
                    )}
                  </div>
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Đường dẫn ảnh:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.hero_image || ""}
                        onChange={(e) => handleChange("hero_image", e.target.value)}
                        placeholder="/images/hero_golden_ship.jpg"
                        className="flex-1 px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                      <label className="px-3 py-2 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                        {uploadingKey === "hero_image" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Tải Lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUploadImage("hero_image", f);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right: Text fields */}
                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Tagline nhỏ (trên cùng):</label>
                    <input
                      type="text"
                      value={settings.hero_tagline || ""}
                      onChange={(e) => handleChange("hero_tagline", e.target.value)}
                      placeholder="QUÀ TẶNG TINH HOA"
                      className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Tiêu đề lớn dòng 1:</label>
                      <input
                        type="text"
                        value={settings.hero_title1 || ""}
                        onChange={(e) => handleChange("hero_title1", e.target.value)}
                        placeholder="NÂNG TẦM"
                        className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white font-serif font-bold text-base focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Tiêu đề lớn dòng 2:</label>
                      <input
                        type="text"
                        value={settings.hero_title2 || ""}
                        onChange={(e) => handleChange("hero_title2", e.target.value)}
                        placeholder="GIÁ TRỊ"
                        className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-[#d4af37] font-serif font-bold text-base focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Đoạn mô tả ngắn:</label>
                    <textarea
                      rows={3}
                      value={settings.hero_desc || ""}
                      onChange={(e) => handleChange("hero_desc", e.target.value)}
                      placeholder="Chuyên chế tác và cung cấp quà tặng cao cấp..."
                      className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Nút 1 (Chữ & Link):</label>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={settings.hero_btn1_text || ""}
                          onChange={(e) => handleChange("hero_btn1_text", e.target.value)}
                          placeholder="KHÁM PHÁ NGAY"
                          className="w-full px-3 py-1.5 bg-[#121c2b] border border-[#1f2d42] rounded-lg text-white text-xs focus:outline-none focus:border-[#d4af37]"
                        />
                        <input
                          type="text"
                          value={settings.hero_btn1_link || ""}
                          onChange={(e) => handleChange("hero_btn1_link", e.target.value)}
                          placeholder="/san-pham"
                          className="w-full px-3 py-1.5 bg-[#121c2b] border border-[#1f2d42] rounded-lg text-white text-xs focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Nút 2 (Chữ & Link):</label>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={settings.hero_btn2_text || ""}
                          onChange={(e) => handleChange("hero_btn2_text", e.target.value)}
                          placeholder="TƯ VẤN QUÀ TẶNG"
                          className="w-full px-3 py-1.5 bg-[#121c2b] border border-[#1f2d42] rounded-lg text-white text-xs focus:outline-none focus:border-[#d4af37]"
                        />
                        <input
                          type="text"
                          value={settings.hero_btn2_link || ""}
                          onChange={(e) => handleChange("hero_btn2_link", e.target.value)}
                          placeholder="/lien-he"
                          className="w-full px-3 py-1.5 bg-[#121c2b] border border-[#1f2d42] rounded-lg text-white text-xs focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SẢN PHẨM NỔI BẬT (5 DANH MỤC TRANG CHỦ) */}
        {activeTab === "featured_categories" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0c1420] border border-[#d4af37]/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Layers className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  Danh Mục Nổi Bật Trên Trang Chủ
                </h3>
              </div>
              <p className="text-[#94a3b8]">
                Mỗi thẻ danh mục hiển thị một hình ảnh đại diện, tiêu đề, mô tả phụ và đường dẫn trang tương ứng.
              </p>
            </div>

            <HomeCategoryEditor settings={settings} onChange={handleChange} onBusyChange={busy => setUploadingKey(busy ? "featured-category" : null)} />
          </div>
        )}

        {/* TAB: SẢN PHẨM ĐƯỢC YÊU THÍCH (5 MẪU) */}
        {activeTab === "favorite_products" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0c1420] border border-[#d4af37]/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  Tùy chỉnh 5 Sản Phẩm Được Yêu Thích Trên Trang Chủ
                </h3>
              </div>
              <p className="text-[#94a3b8]">
                Hiển thị trong thanh trượt sản phẩm được yêu thích, bao gồm hình ảnh, tên sản phẩm, giá bán và liên kết chi tiết.
              </p>
            </div>

            {[1, 2, 3, 4, 5].map((idx) => {
              const nameKey = `fav${idx}_name`;
              const priceKey = `fav${idx}_price`;
              const imgKey = `fav${idx}_image`;
              const linkKey = `fav${idx}_link`;
              const currentImg = settings[imgKey] || "";

              return (
                <div
                  key={idx}
                  className="bg-[#0c1420] border border-[#1f2d42] hover:border-[#d4af37]/50 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-[#1f2d42] pb-3">
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#d4af37]">
                      Mẫu {idx}: {settings[nameKey] || `Sản phẩm ${idx}`}
                    </h4>
                    <span className="text-[#d4af37] font-bold">{settings[priceKey] || "Chưa có giá"}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-3">
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#121c2b] border border-[#1f2d42] relative flex items-center justify-center">
                        {currentImg ? (
                          <AdminImage
                            src={currentImg}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-[#94a3b8]/40" />
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-9 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold">Tên Sản Phẩm:</label>
                          <input
                            type="text"
                            value={settings[nameKey] || ""}
                            onChange={(e) => handleChange(nameKey, e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold">Giá Bán Hiển Thị:</label>
                          <input
                            type="text"
                            value={settings[priceKey] || ""}
                            onChange={(e) => handleChange(priceKey, e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                            placeholder="8.500.000đ"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold">Đường dẫn ảnh:</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={settings[imgKey] || ""}
                              onChange={(e) => handleChange(imgKey, e.target.value)}
                              className="flex-1 px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                              placeholder="/images/..."
                            />
                            <label className="px-3 py-2 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                              {uploadingKey === imgKey ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Tải Lên</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadImage(imgKey, f);
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold">Đường dẫn chuyển trang (Link):</label>
                          <input
                            type="text"
                            value={settings[linkKey] || ""}
                            onChange={(e) => handleChange(linkKey, e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                            placeholder="/san-pham/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: VIDEO TRANG CHỦ (THƯ VIỆN VIDEO THỰC TẾ) */}
        {activeTab === "videos" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header info */}
            <div className="bg-[#0c1420] border-2 border-[#d4af37]/40 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2d42] pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <Film className="w-5 h-5" />
                    <h3 className="font-serif font-bold text-base uppercase tracking-wide">
                      Thư Viện Video Thực Tế (Quy Trình Chế Tác & Sản Phẩm)
                    </h3>
                  </div>
                  <p className="text-xs text-[#94a3b8]">
                    Quản lý danh sách video hiển thị ngoài trang chủ (khu vực "THƯ VIỆN VIDEO THỰC TẾ") và trang xem tất cả video (/video). Bạn có thể chọn video tải lên trực tiếp từ hệ thống hoặc dán link YouTube.
                  </p>
                </div>

                <Link
                  href="/admin/videos"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121c2b] hover:bg-[#1a2b3d] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0"
                >
                  <Film className="w-4 h-4 text-[#dfb755]" />
                  <span>Kho Video Tải Lên</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Header texts controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[#d4af37] mb-1 font-semibold text-xs">
                    Phụ đề mục (Subtitle):
                  </label>
                  <input
                    type="text"
                    value={settings.video_section_subtitle || ""}
                    onChange={(e) => handleChange("video_section_subtitle", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="THƯ VIỆN VIDEO THỰC TẾ"
                  />
                </div>
                <div>
                  <label className="block text-[#d4af37] mb-1 font-semibold text-xs">
                    Tiêu đề chính (Title lớn):
                  </label>
                  <input
                    type="text"
                    value={settings.video_section_title || ""}
                    onChange={(e) => handleChange("video_section_title", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="VIDEO QUY TRÌNH CHẾ TÁC & SẢN PHẨM"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#d4af37] mb-1 font-semibold text-xs">
                    Đoạn mô tả ngắn dưới tiêu đề:
                  </label>
                  <textarea
                    rows={2}
                    value={settings.video_section_desc || ""}
                    onChange={(e) => handleChange("video_section_desc", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="Kênh truyền hình & tư liệu trực quan giúp quý khách an tâm tuyệt đối về chất lượng đúc đồng thủ công"
                  />
                </div>
              </div>
            </div>

            {/* List of Videos */}
            <div className="space-y-5">
              {homeVideos.map((vid, idx) => (
                <div
                  key={vid.id || idx}
                  className={`border rounded-xl p-4 sm:p-5 transition-all ${
                    vid.active !== false
                      ? "bg-[#121c2b]/90 border-[#22354e] hover:border-[#d4af37]/60"
                      : "bg-[#0f1722]/50 border-dashed border-[#1f2d42] opacity-60"
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1f2d42] mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0c1420] font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-serif font-bold text-xs sm:text-sm text-white uppercase tracking-wider line-clamp-1">
                        Video {idx + 1}: {vid.title || "Chưa đặt tiêu đề"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateVideo(idx, "active", vid.active === false ? true : false)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                          vid.active !== false
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                        }`}
                      >
                        {vid.active !== false ? "● Đang hiển thị" : "○ Đã tạm ẩn"}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveVideo(idx, "up")}
                        className="px-2 py-1 rounded-lg bg-[#1f2d42] hover:bg-[#2d415f] text-[#94a3b8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors"
                        title="Di chuyển lên trước"
                      >
                        ▲ Lên
                      </button>
                      <button
                        type="button"
                        disabled={idx === homeVideos.length - 1}
                        onClick={() => handleMoveVideo(idx, "down")}
                        className="px-2 py-1 rounded-lg bg-[#1f2d42] hover:bg-[#2d415f] text-[#94a3b8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors"
                        title="Di chuyển xuống sau"
                      >
                        ▼ Xuống
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(idx)}
                        className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-xs font-bold transition-colors"
                        title="Xóa video này"
                      >
                        ✕ Xóa
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Left: Thumbnail & Video Source */}
                    <div className="lg:col-span-5 space-y-3">
                      <div>
                        <label className="block text-[#d4af37] font-bold text-xs uppercase tracking-wider mb-1.5">
                          Ảnh Bìa Thumbnail:
                        </label>
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#0c1420] border border-[#1f2d42] relative flex items-center justify-center group/preview">
                          {vid.image ? (
                            <AdminImage
                              src={vid.image}
                              alt={vid.title}
                              className="w-full h-full object-cover object-center"
                            />
                          ) : (
                            <div className="text-center text-[#64748b] p-4">
                              <ImageIcon className="w-8 h-8 mx-auto mb-1 text-[#334155]" />
                              <span>Chưa có ảnh bìa</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-[#dfb755] text-[#0c1420] flex items-center justify-center shadow-lg">
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Upload & Link for Thumbnail */}
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={vid.image || ""}
                            onChange={(e) => handleUpdateVideo(idx, "image", e.target.value)}
                            className="flex-1 px-3 py-2 bg-[#0c1420] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                            placeholder="/images/videos/..."
                          />
                          <label className="px-3 py-2 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                            {uploadingKey === `video_thumb_${idx}` ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span>Tải Ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleUploadVideoThumbnail(idx, f);
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Video Source */}
                      <div className="pt-2 border-t border-[#1f2d42] space-y-2">
                        <label className="block text-[#d4af37] font-bold text-xs uppercase tracking-wider">
                          Đường Dẫn Video:
                        </label>
                        <input
                          type="text"
                          value={vid.videoUrl || ""}
                          onChange={(e) => handleUpdateVideo(idx, "videoUrl", e.target.value)}
                          className="w-full px-3 py-2 bg-[#0c1420] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                          placeholder="https://www.youtube.com/watch?v=... hoặc /api/videos/..."
                        />

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => openVideoPicker(idx)}
                            className="px-3 py-1.5 rounded-lg bg-[#dfb755]/20 hover:bg-[#dfb755]/30 text-[#dfb755] border border-[#dfb755]/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Film className="w-3.5 h-3.5" />
                            <span>Chọn từ Kho Video</span>
                          </button>

                          {vid.videoUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewModalVideo({ title: vid.title, url: vid.videoUrl })}
                              className="px-3 py-1.5 rounded-lg bg-[#1f2d42] hover:bg-[#2d415f] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Play className="w-3.5 h-3.5 text-[#dfb755]" />
                              <span>Xem Thử</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Info */}
                    <div className="lg:col-span-7 space-y-3.5">
                      <div>
                        <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                          Tiêu Đề Video:
                        </label>
                        <input
                          type="text"
                          value={vid.title || ""}
                          onChange={(e) => handleUpdateVideo(idx, "title", e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0c1420] border border-[#1f2d42] rounded-xl text-white font-medium text-xs focus:outline-none focus:border-[#d4af37]"
                          placeholder="Ví dụ: Quy trình rót đồng Đại Hồng Chung..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                            Huy Hiệu (Badge):
                          </label>
                          <input
                            type="text"
                            value={vid.category || ""}
                            onChange={(e) => handleUpdateVideo(idx, "category", e.target.value)}
                            className="w-full px-3 py-2 bg-[#0c1420] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                            placeholder="QUY TRÌNH ĐÚC ĐỒNG"
                          />
                        </div>

                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                            Thời Lượng:
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={vid.duration || ""}
                              onChange={(e) => handleUpdateVideo(idx, "duration", e.target.value)}
                              className="w-full px-3 py-2 pl-7 bg-[#0c1420] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                              placeholder="05:32"
                            />
                            <Clock className="w-3.5 h-3.5 text-[#dfb755] absolute left-2.5 top-2.5" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                            Lượt Xem Mô Phỏng:
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={vid.views || ""}
                              onChange={(e) => handleUpdateVideo(idx, "views", e.target.value)}
                              className="w-full px-3 py-2 pl-7 bg-[#0c1420] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                              placeholder="15.420"
                            />
                            <Eye className="w-3.5 h-3.5 text-[#dfb755] absolute left-2.5 top-2.5" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                          Mô Tả Tóm Tắt Video:
                        </label>
                        <textarea
                          rows={3}
                          value={vid.desc || ""}
                          onChange={(e) => handleUpdateVideo(idx, "desc", e.target.value)}
                          className="w-full px-3.5 py-2 bg-[#0c1420] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37] leading-relaxed"
                          placeholder="Cận cảnh quy trình nghệ nhân nấu đồng đỏ nguyên chất và rót khuôn..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Video Button */}
            <button
              type="button"
              onClick={handleAddVideo}
              className="w-full py-4 rounded-xl border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] bg-[#121c2b]/60 hover:bg-[#121c2b] text-[#d4af37] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Video Mới Vào Thư Viện</span>
            </button>
          </div>
        )}

        {/* TAB: NGHỆ NHÂN & GIỚI THIỆU XƯỞNG / CƠ SỞ */}
        {activeTab === "artisan" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0c1420] border border-[#d4af37]/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <Award className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                    Tùy Chỉnh Giới Thiệu Cơ Sở, Nghệ Nhân & Xưởng Đúc Đồng
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/gioi-thieu"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#152236] hover:bg-[#1d2f4a] text-[#d4af37] hover:text-white rounded-xl text-xs font-semibold border border-[#d4af37]/30 transition-all shadow-sm"
                  >
                    <span>Xem Trang /gioi-thieu</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/admin/articles"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] rounded-xl text-xs font-bold border border-[#d4af37]/40 transition-all shadow-sm"
                  >
                    <span>Viết Bài Viết Chi Tiết</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                Nội dung và hình ảnh tại đây được hiển thị đồng bộ trên cả <strong className="text-white">Phần Giới Thiệu Trang Chủ</strong> và <strong className="text-white">Trang Về Chúng Tôi (/gioi-thieu)</strong>. Khi thay đổi ảnh đại diện hay nội dung giới thiệu tại đây và bấm Lưu, website sẽ tự động cập nhật ngay lập tức.
              </p>
            </div>

            <div className="bg-[#0c1420] border border-[#1f2d42] hover:border-[#d4af37]/50 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 transition-all">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Left: Image Preview & Upload */}
                <div className="sm:col-span-4 space-y-3">
                  <label className="block text-[#d4af37] font-bold text-xs uppercase tracking-wider">
                    Hình ảnh Nghệ Nhân / Phân Xưởng:
                  </label>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#121c2b] border border-[#1f2d42] relative flex items-center justify-center">
                    {settings.artisan_image ? (
                      <AdminImage
                        src={settings.artisan_image}
                        alt="Nghệ nhân"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-[#94a3b8]/40" />
                    )}
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Đường dẫn ảnh:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.artisan_image || ""}
                        onChange={(e) => handleChange("artisan_image", e.target.value)}
                        placeholder="/images/..."
                        className="flex-1 px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                      <label className="px-3 py-2 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                        {uploadingKey === "artisan_image" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Tải Lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUploadImage("artisan_image", f);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right: Info Fields */}
                <div className="sm:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Tên Nghệ Nhân:</label>
                      <input
                        type="text"
                        value={settings.artisan_name || ""}
                        onChange={(e) => handleChange("artisan_name", e.target.value)}
                        placeholder="Nghệ Nhân Dương Bá Tiến"
                        className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Chức danh / Xuất xứ:</label>
                      <input
                        type="text"
                        value={settings.artisan_title || ""}
                        onChange={(e) => handleChange("artisan_title", e.target.value)}
                        placeholder="Làng nghề đúc đồng Vạn Điểm, Ý Yên"
                        className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Tên Doanh Nghiệp / Tiêu Đề:</label>
                    <input
                      type="text"
                      value={settings.artisan_company || ""}
                      onChange={(e) => handleChange("artisan_company", e.target.value)}
                      placeholder="CÔNG TY TNHH CƠ KHÍ ĐÚC LỘC NAM"
                      className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Nội dung câu chuyện / Giới thiệu:</label>
                    <textarea
                      rows={5}
                      value={settings.artisan_desc || ""}
                      onChange={(e) => handleChange("artisan_desc", e.target.value)}
                      placeholder="Nội dung chi tiết giới thiệu..."
                      className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37] text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PHẦN 2: 2 BÀI VIẾT CHUYÊN SÂU VỀ CƠ SỞ & NGHỆ NHÂN (CẤU HÌNH LÀ TIN TỨC) */}
            <div className="bg-[#0c1420] border border-[#d4af37]/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1f2d42] pb-4">
                <div className="flex items-center gap-2.5 text-[#d4af37]">
                  <BookOpen className="w-5 h-5 text-[#d4af37]" />
                  <div>
                    <h3 className="font-serif font-bold text-sm uppercase tracking-wide text-white">
                      2 Bài Viết Chuyên Sâu Về Cơ Sở & Nghệ Nhân (Thuộc Mục Tin Tức)
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-0.5">
                      Được cấu hình trong mục Tin Tức (<span className="text-[#d4af37] font-semibold">GIỚI THIỆU CƠ SỞ & XƯỞNG ĐÚC</span>), hiển thị trực tiếp trên trang Giới Thiệu (/gioi-thieu).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchFacilityArticles}
                    className="p-2 rounded-xl bg-[#152236] hover:bg-[#1d2f4a] text-[#94a3b8] hover:text-white transition-colors"
                    title="Tải lại bài viết"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingArticles ? "animate-spin" : ""}`} />
                  </button>
                  <Link
                    href="/admin/articles"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#152236] hover:bg-[#1d2f4a] text-[#d4af37] rounded-xl text-xs font-bold border border-[#d4af37]/30 transition-all"
                  >
                    <span>Mở Quản Lý Bài Viết</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {loadingArticles ? (
                <div className="py-8 text-center text-[#94a3b8]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#d4af37] mx-auto mb-2" />
                  <p className="text-xs">Đang tải thông tin bài viết cơ sở...</p>
                </div>
              ) : facilityArticles.length === 0 ? (
                <div className="py-6 text-center text-[#94a3b8]">
                  <p className="text-xs">Chưa tìm thấy bài viết trong cơ sở dữ liệu. Bấm nút Tải lại hoặc kiểm tra /admin/articles.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {facilityArticles.map((art, idx) => (
                    <div
                      key={art.id}
                      className="bg-[#09101a] border border-[#1f2d42] hover:border-[#d4af37]/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] uppercase">
                            Bài viết {idx + 1}: {art.category || "TIN TỨC CƠ SỞ"}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Đã xuất bản
                          </span>
                        </div>

                        {/* Thumbnail image with upload */}
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                            Ảnh Đại Diện Bài Viết:
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#121c2b] border border-[#1f2d42] shrink-0 relative flex items-center justify-center">
                              {art.thumbnail ? (
                                <AdminImage src={art.thumbnail} alt={art.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-[#94a3b8]/40" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <input
                                type="text"
                                value={art.thumbnail || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFacilityArticles((prev) =>
                                    prev.map((a) => (a.id === art.id ? { ...a, thumbnail: val } : a))
                                  );
                                }}
                                placeholder="/images/..."
                                className="w-full px-2.5 py-1.5 bg-[#121c2b] border border-[#1f2d42] rounded-lg text-white text-xs focus:outline-none focus:border-[#d4af37]"
                              />
                              <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-lg text-xs font-semibold cursor-pointer">
                                {uploadingKey === `article_thumb_${art.id}` ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Upload className="w-3 h-3" />
                                )}
                                <span>Tải Ảnh Mới</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleUploadArticleThumbnail(art.id, f);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Title input */}
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                            Tiêu Đề Bài Viết:
                          </label>
                          <input
                            type="text"
                            value={art.title || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFacilityArticles((prev) =>
                                prev.map((a) => (a.id === art.id ? { ...a, title: val } : a))
                              );
                            }}
                            className="w-full px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-lg text-white text-xs font-serif font-bold focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>

                        {/* Summary input */}
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                            Đoạn Tóm Tắt (Hiển thị ngoài trang chủ & trang giới thiệu):
                          </label>
                          <textarea
                            rows={3}
                            value={art.summary || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFacilityArticles((prev) =>
                                prev.map((a) => (a.id === art.id ? { ...a, summary: val } : a))
                              );
                            }}
                            className="w-full px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-lg text-white text-xs focus:outline-none focus:border-[#d4af37] leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-[#1a2638] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={savingArticleId === art.id}
                            onClick={() => handleUpdateArticleQuick(art.id, { title: art.title, summary: art.summary, thumbnail: art.thumbnail })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d4af37] hover:bg-[#b8860b] text-[#0a111c] font-bold rounded-lg text-xs transition-all disabled:opacity-50"
                          >
                            {savingArticleId === art.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            <span>Lưu Nhanh</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingArticleModal(art)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#152236] hover:bg-[#1f2f47] text-[#d4af37] font-semibold rounded-lg text-xs border border-[#d4af37]/30 transition-all"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            <span>Sửa Toàn Bộ Nội Dung & Ảnh</span>
                          </button>
                        </div>

                        <Link
                          href={`/tin-tuc/${art.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-[#94a3b8] hover:text-white"
                        >
                          <span>Xem trên web</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: DỰ ÁN TIÊU BIỂU & ĐÁNH GIÁ KHÁCH HÀNG (8 DỰ ÁN) */}
        {activeTab === "reviews" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0c1420] border border-[#d4af37]/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Star className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  Tùy chỉnh 8 Thẻ Dự Án Tiêu Biểu & Đánh Giá Khách Hàng
                </h3>
              </div>
              <p className="text-[#94a3b8]">
                Chỉnh sửa trực tiếp hình ảnh thực tế, tên khách hàng, tên công trình/dự án và lời nhận xét đánh giá.
              </p>
            </div>

            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
              const nameKey = `rev${idx}_name`;
              const titleKey = `rev${idx}_title`;
              const locKey = `rev${idx}_location`;
              const prodKey = `rev${idx}_product`;
              const tagKey = `rev${idx}_tag`;
              const imgKey = `rev${idx}_image`;
              const commKey = `rev${idx}_comment`;
              const currentImg = settings[imgKey] || "";

              return (
                <div
                  key={idx}
                  className="bg-[#0c1420] border border-[#1f2d42] hover:border-[#d4af37]/50 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-[#1f2d42] pb-3">
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#d4af37]">
                      Đánh Giá #{idx}: {settings[nameKey]} – {settings[prodKey]}
                    </h4>
                    <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-2.5 py-0.5 rounded-full border border-[#d4af37]/40 font-bold">
                      {settings[tagKey] || "DỰ ÁN THỰC TẾ"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    <div className="sm:col-span-3">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#121c2b] border border-[#1f2d42] relative flex items-center justify-center">
                        {currentImg ? (
                          <AdminImage
                            src={currentImg}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-[#94a3b8]/40" />
                        )}
                      </div>
                      <div className="mt-2">
                        <label className="block text-[#94a3b8] mb-1 font-semibold text-[11px]">Đường dẫn ảnh:</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={settings[imgKey] || ""}
                            onChange={(e) => handleChange(imgKey, e.target.value)}
                            className="flex-1 px-2.5 py-1.5 bg-[#121c2b] border border-[#1f2d42] rounded-lg text-white text-[11px] focus:outline-none focus:border-[#d4af37]"
                            placeholder="/images/..."
                          />
                          <label className="px-2 py-1.5 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 shrink-0">
                            {uploadingKey === imgKey ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Upload className="w-3 h-3" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleUploadImage(imgKey, f);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-9 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold">Tên Khách Hàng / Đối tác:</label>
                          <input
                            type="text"
                            value={settings[nameKey] || ""}
                            onChange={(e) => handleChange(nameKey, e.target.value)}
                            className="w-full px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold">Chức danh / Đơn vị:</label>
                          <input
                            type="text"
                            value={settings[titleKey] || ""}
                            onChange={(e) => handleChange(titleKey, e.target.value)}
                            className="w-full px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold">Địa phương / Tỉnh thành:</label>
                          <input
                            type="text"
                            value={settings[locKey] || ""}
                            onChange={(e) => handleChange(locKey, e.target.value)}
                            className="w-full px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold">Tên Dự Án / Tên Sản Phẩm:</label>
                          <input
                            type="text"
                            value={settings[prodKey] || ""}
                            onChange={(e) => handleChange(prodKey, e.target.value)}
                            className="w-full px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#94a3b8] mb-1 font-semibold">Tag Nhãn (ví dụ: ĐỒ THỜ GIA TIÊN):</label>
                          <input
                            type="text"
                            value={settings[tagKey] || ""}
                            onChange={(e) => handleChange(tagKey, e.target.value)}
                            className="w-full px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#94a3b8] mb-1 font-semibold">Lời nhận xét / Đánh giá thực tế:</label>
                        <textarea
                          rows={2}
                          value={settings[commKey] || ""}
                          onChange={(e) => handleChange(commKey, e.target.value)}
                          className="w-full px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37] leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: 4 CƠ SỞ & SHOWROOM */}
        {activeTab === "branches" && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. XƯỞNG SẢN XUẤT */}
            <div className="bg-[#0c1420] border border-[#d4af37]/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#1f2d42] pb-3 text-[#d4af37]">
                <Factory className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  1. Xưởng Sản Xuất Đúc Đồng
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Tên cơ sở:</label>
                  <input
                    type="text"
                    value={settings.factory_name || ""}
                    onChange={(e) => handleChange("factory_name", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Hotline / Số điện thoại:</label>
                  <input
                    type="text"
                    value={settings.factory_hotline || ""}
                    onChange={(e) => handleChange("factory_hotline", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Địa chỉ:</label>
                  <input
                    type="text"
                    value={settings.factory_address || ""}
                    onChange={(e) => handleChange("factory_address", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Link Google Maps (Chỉ đường):</label>
                  <input
                    type="text"
                    value={settings.factory_map_url || ""}
                    onChange={(e) => handleChange("factory_map_url", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="https://maps.app.goo.gl/..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Hình ảnh xưởng sản xuất:</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#121c2b] border border-[#1f2d42] shrink-0 relative flex items-center justify-center">
                      {settings.factory_image ? (
                        <AdminImage src={settings.factory_image} alt="Xưởng sản xuất" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-[#94a3b8]/40" />
                      )}
                    </div>
                    <div className="flex-1 w-full flex gap-2">
                      <input
                        type="text"
                        value={settings.factory_image || ""}
                        onChange={(e) => handleChange("factory_image", e.target.value)}
                        placeholder="/images/..."
                        className="flex-1 px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                      <label className="px-3 py-2 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                        {uploadingKey === "factory_image" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Tải Ảnh Lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUploadImage("factory_image", f);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Mô tả ngắn:</label>
                  <input
                    type="text"
                    value={settings.factory_desc || ""}
                    onChange={(e) => handleChange("factory_desc", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* 2. SHOWROOM 1 */}
            <div className="bg-[#0c1420] border border-[#1f2d42] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#1f2d42] pb-3 text-[#d4af37]">
                <Store className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  2. Showroom 1 - Cơ Sở Chính
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Tên cơ sở:</label>
                  <input
                    type="text"
                    value={settings.cs1_name || ""}
                    onChange={(e) => handleChange("cs1_name", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Hotline / Số điện thoại:</label>
                  <input
                    type="text"
                    value={settings.cs1_hotline || ""}
                    onChange={(e) => handleChange("cs1_hotline", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Địa chỉ:</label>
                  <input
                    type="text"
                    value={settings.cs1_address || ""}
                    onChange={(e) => handleChange("cs1_address", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Link Google Maps (Chỉ đường):</label>
                  <input
                    type="text"
                    value={settings.cs1_map_url || ""}
                    onChange={(e) => handleChange("cs1_map_url", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Hình ảnh Showroom 1:</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#121c2b] border border-[#1f2d42] shrink-0 relative flex items-center justify-center">
                      {settings.cs1_image ? (
                        <AdminImage src={settings.cs1_image} alt="Showroom 1" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-[#94a3b8]/40" />
                      )}
                    </div>
                    <div className="flex-1 w-full flex gap-2">
                      <input
                        type="text"
                        value={settings.cs1_image || ""}
                        onChange={(e) => handleChange("cs1_image", e.target.value)}
                        placeholder="/images/..."
                        className="flex-1 px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                      <label className="px-3 py-2 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                        {uploadingKey === "cs1_image" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Tải Ảnh Lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUploadImage("cs1_image", f);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Mô tả ngắn:</label>
                  <input
                    type="text"
                    value={settings.cs1_desc || ""}
                    onChange={(e) => handleChange("cs1_desc", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* 3. SHOWROOM 2 */}
            <div className="bg-[#0c1420] border border-[#1f2d42] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#1f2d42] pb-3 text-[#d4af37]">
                <Store className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  3. Showroom 2 - KCN Ý Yên
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Tên cơ sở:</label>
                  <input
                    type="text"
                    value={settings.cs2_name || ""}
                    onChange={(e) => handleChange("cs2_name", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Hotline / Số điện thoại:</label>
                  <input
                    type="text"
                    value={settings.cs2_hotline || ""}
                    onChange={(e) => handleChange("cs2_hotline", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Địa chỉ:</label>
                  <input
                    type="text"
                    value={settings.cs2_address || ""}
                    onChange={(e) => handleChange("cs2_address", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Link Google Maps (Chỉ đường):</label>
                  <input
                    type="text"
                    value={settings.cs2_map_url || ""}
                    onChange={(e) => handleChange("cs2_map_url", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Hình ảnh Showroom 2:</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#121c2b] border border-[#1f2d42] shrink-0 relative flex items-center justify-center">
                      {settings.cs2_image ? (
                        <AdminImage src={settings.cs2_image} alt="Showroom 2" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-[#94a3b8]/40" />
                      )}
                    </div>
                    <div className="flex-1 w-full flex gap-2">
                      <input
                        type="text"
                        value={settings.cs2_image || ""}
                        onChange={(e) => handleChange("cs2_image", e.target.value)}
                        placeholder="/images/..."
                        className="flex-1 px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                      <label className="px-3 py-2 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                        {uploadingKey === "cs2_image" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Tải Ảnh Lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUploadImage("cs2_image", f);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Mô tả ngắn:</label>
                  <input
                    type="text"
                    value={settings.cs2_desc || ""}
                    onChange={(e) => handleChange("cs2_desc", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* 4. SHOWROOM 3 */}
            <div className="bg-[#0c1420] border border-[#1f2d42] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#1f2d42] pb-3 text-[#d4af37]">
                <Store className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  4. Showroom 3 - Hà Nội
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Tên cơ sở:</label>
                  <input
                    type="text"
                    value={settings.cs3_name || ""}
                    onChange={(e) => handleChange("cs3_name", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Hotline / Số điện thoại:</label>
                  <input
                    type="text"
                    value={settings.cs3_hotline || ""}
                    onChange={(e) => handleChange("cs3_hotline", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Địa chỉ:</label>
                  <input
                    type="text"
                    value={settings.cs3_address || ""}
                    onChange={(e) => handleChange("cs3_address", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Link Google Maps (Chỉ đường):</label>
                  <input
                    type="text"
                    value={settings.cs3_map_url || ""}
                    onChange={(e) => handleChange("cs3_map_url", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">Hình ảnh Showroom 3:</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#121c2b] border border-[#1f2d42] shrink-0 relative flex items-center justify-center">
                      {settings.cs3_image ? (
                        <AdminImage src={settings.cs3_image} alt="Showroom 3" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-[#94a3b8]/40" />
                      )}
                    </div>
                    <div className="flex-1 w-full flex gap-2">
                      <input
                        type="text"
                        value={settings.cs3_image || ""}
                        onChange={(e) => handleChange("cs3_image", e.target.value)}
                        placeholder="/images/..."
                        className="flex-1 px-3 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                      <label className="px-3 py-2 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                        {uploadingKey === "cs3_image" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Tải Ảnh Lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUploadImage("cs3_image", f);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Mô tả ngắn:</label>
                  <input
                    type="text"
                    value={settings.cs3_desc || ""}
                    onChange={(e) => handleChange("cs3_desc", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HOTLINE & MẠNG XÃ HỘI */}
        {activeTab === "social" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0c1420] border border-[#d4af37]/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#1f2d42] pb-3 text-[#d4af37]">
                <Share2 className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  Liên Kết Mạng Xã Hội, Hotline & Zalo
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Hotline 1 (Chính - Toàn Quốc):</label>
                  <input
                    type="text"
                    value={settings.hotline || ""}
                    onChange={(e) => handleChange("hotline", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="0836 122 222"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Hotline 2 (Hỗ Trợ & Tư Vấn):</label>
                  <input
                    type="text"
                    value={settings.hotline2 || ""}
                    onChange={(e) => handleChange("hotline2", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="0846 699 997"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Số Zalo Tư Vấn:</label>
                  <input
                    type="text"
                    value={settings.zalo || ""}
                    onChange={(e) => handleChange("zalo", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="0846699997"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Email Liên Hệ:</label>
                  <input
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="dodonglocnam1102@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Facebook Fanpage URL:</label>
                  <input
                    type="text"
                    value={settings.facebook_url || ""}
                    onChange={(e) => handleChange("facebook_url", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="https://facebook.com/dodonglocnam"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">YouTube Channel URL:</label>
                  <input
                    type="text"
                    value={settings.youtube_url || ""}
                    onChange={(e) => handleChange("youtube_url", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="https://youtube.com/dodonglocnam"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Messenger URL:</label>
                  <input
                    type="text"
                    value={settings.messenger_url || ""}
                    onChange={(e) => handleChange("messenger_url", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="https://m.me/dodonglocnam"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: THÔNG TIN CHUNG & CHÂN TRANG */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0c1420] border border-[#d4af37]/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#1f2d42] pb-3 text-[#d4af37]">
                <Globe className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wide">
                  Thông Tin Thương Hiệu & Giới Thiệu Chân Trang
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Tên Website / Thương hiệu:</label>
                  <input
                    type="text"
                    value={settings.site_name || ""}
                    onChange={(e) => handleChange("site_name", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Slogan Thương Hiệu:</label>
                  <input
                    type="text"
                    value={settings.slogan || ""}
                    onChange={(e) => handleChange("slogan", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold">Đoạn giới thiệu ngắn ở Footer (Chân trang):</label>
                  <textarea
                    rows={3}
                    value={settings.footer_about || ""}
                    onChange={(e) => handleChange("footer_about", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white focus:outline-none focus:border-[#d4af37] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button Bar */}
        <div className="sticky bottom-4 z-20 bg-[#0c1420]/95 backdrop-blur-xl border border-[#d4af37]/40 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
          <div className="text-[#94a3b8] hidden sm:flex items-center gap-2">
            {modifiedKeys.size > 0 ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Có {modifiedKeys.size} trường dữ liệu thay đổi chưa lưu
              </span>
            ) : (
              <span>Mọi thay đổi sẽ được cập nhật trực tiếp lên website ngay sau khi bấm lưu.</span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving || uploadingKey !== null}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#dfb755] to-[#b8860b] hover:brightness-110 text-[#0c1420] font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_15px_rgba(223,183,85,0.4)] disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>
                  {modifiedKeys.size > 0
                    ? `Lưu ${modifiedKeys.size} Thay Đổi`
                    : "Lưu Cấu Hình"}
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* MODAL 1: CHỌN TỪ KHO VIDEO TẢI LÊN */}
      {videoPickerIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setVideoPickerIndex(null)}
        >
          <div
            className="bg-[#0c1420] border-2 border-[#d4af37]/60 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1f2d42] pb-3 shrink-0">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Film className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm uppercase tracking-wider">
                  Chọn Video Cho Thẻ #{videoPickerIndex + 1}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVideoPickerIndex(null)}
                className="w-8 h-8 rounded-full bg-[#121c2b] text-[#94a3b8] hover:text-white flex items-center justify-center border border-[#1f2d42]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-[#94a3b8] shrink-0">
              <span>Danh sách video đã tải lên máy chủ:</span>
              <Link
                href="/admin/videos"
                target="_blank"
                className="text-[#dfb755] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Tải thêm video mới</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {loadingUploadedVideos ? (
                <div className="py-12 text-center text-[#d4af37]">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <span className="text-xs">Đang tải danh sách video...</span>
                </div>
              ) : uploadedVideos.length === 0 ? (
                <div className="py-10 text-center text-[#94a3b8] border border-dashed border-[#1f2d42] rounded-xl p-6">
                  <Film className="w-8 h-8 mx-auto mb-2 text-[#475569]" />
                  <p className="font-semibold text-white text-xs mb-1">Chưa có video nào được tải lên!</p>
                  <p className="text-[11px] mb-3">Vui lòng truy cập trang Kho Video để tải lên các file video MP4.</p>
                  <Link
                    href="/admin/videos"
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#0c1420] text-xs font-bold"
                  >
                    <span>Mở Kho Video Tải Lên</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                uploadedVideos.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#121c2b] border border-[#1f2d42] hover:border-[#d4af37]/60 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#0c1420] border border-[#1f2d42] flex items-center justify-center shrink-0 text-[#dfb755]">
                        <Video className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-white truncate">
                          {item.title || item.originalName}
                        </div>
                        <div className="text-[10px] text-[#94a3b8] flex items-center gap-2 mt-0.5">
                          <span>{item.sizeFormatted}</span>
                          <span>•</span>
                          <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : ""}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewModalVideo({ title: item.title || item.originalName, url: item.url })}
                        className="p-1.5 rounded-lg bg-[#1f2d42] hover:bg-[#2d415f] text-white text-xs"
                        title="Xem trước"
                      >
                        <Play className="w-3.5 h-3.5 text-[#dfb755]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateVideo(videoPickerIndex, "videoUrl", item.url);
                          toastSuccess(`Đã chọn video "${item.title || item.originalName}" cho thẻ #${videoPickerIndex + 1}!`, "Đã chọn");
                          setVideoPickerIndex(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0c1420] text-xs font-bold hover:brightness-110 transition-all shadow-sm cursor-pointer"
                      >
                        Chọn Video
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM THỬ VIDEO TRƯỚC KHI LƯU */}
      {previewModalVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewModalVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#0c1420] rounded-2xl overflow-hidden border-2 border-[#d4af37]/60 shadow-2xl p-4 sm:p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2d42]">
              <div className="font-serif font-bold text-xs sm:text-sm text-white line-clamp-1 pr-3">
                {previewModalVideo.title}
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalVideo(null)}
                className="w-7 h-7 rounded-full bg-[#121c2b] text-white hover:text-[#dfb755] flex items-center justify-center border border-[#1f2d42]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner flex items-center justify-center">
              {(() => {
                const helper = getEmbedHelper(previewModalVideo.url);
                if (helper.type === "video") {
                  return (
                    <video
                      src={helper.src}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    >
                      Trình duyệt không hỗ trợ thẻ video này.
                    </video>
                  );
                }
                return (
                  <iframe
                    src={helper.src}
                    title={previewModalVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CHỈNH SỬA TOÀN BỘ NỘI DUNG BÀI VIẾT CƠ SỞ & NGHỆ NHÂN (TIN TỨC) */}
      {editingArticleModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
          onClick={() => setEditingArticleModal(null)}
        >
          <div
            className="bg-[#0c1420] border-2 border-[#d4af37]/60 rounded-3xl max-w-6xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[94vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1f2d42] pb-3 shrink-0">
              <div className="flex items-center gap-2.5 text-[#d4af37]">
                <BookOpen className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base uppercase tracking-wider text-white">
                    Chỉnh Sửa Bài Viết: {editingArticleModal.title}
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    Chuyên mục: <strong className="text-[#d4af37]">{editingArticleModal.category || "GIỚI THIỆU CƠ SỞ & XƯỞNG ĐÚC"}</strong> • Slug: <span className="font-mono text-cyan-300">/tin-tuc/{editingArticleModal.slug}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingArticleModal(null)}
                className="w-8 h-8 rounded-full bg-[#121c2b] text-[#94a3b8] hover:text-white flex items-center justify-center border border-[#1f2d42]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveModalArticle} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="block text-[#d4af37] mb-1 font-bold text-xs uppercase tracking-wider">
                  Tiêu Đề Bài Viết:
                </label>
                <input
                  type="text"
                  required
                  value={editingArticleModal.title || ""}
                  onChange={(e) => setEditingArticleModal({ ...editingArticleModal, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white font-serif font-bold text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                    Ảnh Đại Diện (Thumbnail):
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-[#121c2b] border border-[#1f2d42] shrink-0 relative flex items-center justify-center">
                      {editingArticleModal.thumbnail ? (
                        <AdminImage src={editingArticleModal.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-[#94a3b8]/40" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={editingArticleModal.thumbnail || ""}
                        onChange={(e) => setEditingArticleModal({ ...editingArticleModal, thumbnail: e.target.value })}
                        placeholder="/images/..."
                        className="w-full px-2.5 py-1.5 bg-[#121c2b] border border-[#1f2d42] rounded-lg text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                      <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1f2d42] hover:bg-[#2d415f] text-white rounded-lg text-xs font-semibold cursor-pointer">
                        {uploadingKey === `modal_thumb_${editingArticleModal.id}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3" />
                        )}
                        <span>Tải Ảnh Mới</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const uploadKey = `modal_thumb_${editingArticleModal.id}`;
                              setUploadingKey(uploadKey);
                              const uploadForm = new FormData();
                              uploadForm.append("file", f);
                              try {
                                const res = await fetch("/api/admin/upload", { method: "POST", body: uploadForm });
                                const data = await res.json();
                                if (data.success && data.url) {
                                  setEditingArticleModal((prev: any) => ({ ...prev, thumbnail: data.url }));
                                  toastSuccess("Đã tải ảnh đại diện lên thành công!", "Tải ảnh");
                                }
                              } catch {
                                toastError("Lỗi tải ảnh lên", "Lỗi");
                              } finally {
                                setUploadingKey(null);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                    Chuyên Mục (Cấu hình là Tin Tức):
                  </label>
                  <input
                    type="text"
                    value={editingArticleModal.category || "GIỚI THIỆU CƠ SỞ & XƯỞNG ĐÚC"}
                    onChange={(e) => setEditingArticleModal({ ...editingArticleModal, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-[#d4af37]"
                  />
                  <span className="text-[10px] text-[#94a3b8] block mt-1">
                    Thuộc danh mục Tin tức giới thiệu xưởng Lộc Nam
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1 font-semibold text-xs">
                  Đoạn Tóm Tắt Ngắn:
                </label>
                <textarea
                  rows={3}
                  value={editingArticleModal.summary || ""}
                  onChange={(e) => setEditingArticleModal({ ...editingArticleModal, summary: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#121c2b] border border-[#1f2d42] rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[#d4af37] font-bold text-xs uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Nội Dung Bài Viết Chi Tiết:</span>
                  <span className="text-[11px] text-gray-400 font-normal">
                    Hỗ trợ soạn thảo trực quan (WYSIWYG), Gắn Link SEO, Chèn Video/Ảnh & Markdown
                  </span>
                </label>

                <div className="bg-[#080e18] border border-[#1f2d42] rounded-2xl overflow-hidden p-2">
                  <ProductArticleEditor
                    value={editingArticleModal.content || ""}
                    onChange={(val) => setEditingArticleModal({ ...editingArticleModal, content: val })}
                    productName={editingArticleModal.title || "Bài viết cơ sở"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1f2d42] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setEditingArticleModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#152236] hover:bg-[#1d2f4a] text-white text-xs font-semibold transition-all"
                >
                  Hủy Bỏ
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/tin-tuc/${editingArticleModal.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[#152236] text-[#d4af37] text-xs font-semibold hover:bg-[#1d2f4a] border border-[#d4af37]/30 transition-all"
                  >
                    <span>Xem Trang Hiện Tại</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="submit"
                    disabled={savingModalArticle}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#dfb755] to-[#b8860b] hover:brightness-110 text-[#0c1420] font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {savingModalArticle ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Lưu Toàn Bộ Bài Viết</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
