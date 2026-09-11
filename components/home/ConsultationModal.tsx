"use client";

import React, { useState } from "react";
import { X, CheckCircle2, PhoneCall, Send, Sparkles } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export function ConsultationModal({ isOpen, onClose, productName }: ConsultationModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          content: content || (productName ? `Yêu cầu tư vấn sản phẩm: ${productName}` : "Yêu cầu tư vấn chung"),
          productInterest: productName,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch {
      setErrorMsg("Không thể kết nối đến máy chủ, vui lòng gọi trực tiếp hotline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-kem-light border-2 border-bronze-gold rounded-lg shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Decorative corner motifs */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-bronze-gold"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-bronze-gold"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-bronze-gold"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-bronze-gold"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-bronze-dark/70 hover:text-bordeaux transition-colors rounded-full hover:bg-kem-subtle"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-bronze-accent">
              Gửi Yêu Cầu Thành Công!
            </h3>
            <p className="text-bronze-dark/80 text-sm max-w-sm mx-auto">
              Nghệ nhân xưởng <strong>Đúc Đồng Lộc Nam</strong> sẽ liên hệ lại với quý khách qua số điện thoại <strong>{phone}</strong> trong thời gian sớm nhất.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-bordeaux hover:bg-bordeaux-hover text-white text-sm font-semibold rounded shadow-bordeaux transition-all"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-kem-subtle border border-bronze-gold/40 text-bronze-accent text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-bronze-gold" />
                Tư Vấn Tận Tâm 24/7
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-bronze-accent">
                Đăng Ký Nhận Tư Vấn
              </h3>
              <p className="text-xs sm:text-sm text-bronze-dark/70 mt-1">
                {productName ? `Tư vấn chi tiết về: ${productName}` : "Để lại thông tin để nghệ nhân trực tiếp liên hệ và gửi báo giá xưởng"}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs rounded">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bronze-accent mb-1">
                  Họ và tên <span className="text-bordeaux">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-bronze-gold/50 rounded text-sm text-bronze-dark focus:outline-none focus:ring-2 focus:ring-bordeaux/40 focus:border-bordeaux transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bronze-accent mb-1">
                  Số điện thoại / Zalo <span className="text-bordeaux">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0986 258 999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-bronze-gold/50 rounded text-sm text-bronze-dark focus:outline-none focus:ring-2 focus:ring-bordeaux/40 focus:border-bordeaux transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bronze-accent mb-1">
                  Nội dung yêu cầu / Kích thước cần đúc
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Cần tư vấn bộ ngũ sự 60cm cho bàn thờ gia tiên 1m97..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ resize: "none" }}
                  className="w-full px-3.5 py-2.5 bg-white border border-bronze-gold/50 rounded text-sm text-bronze-dark focus:outline-none focus:ring-2 focus:ring-bordeaux/40 focus:border-bordeaux transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-bordeaux hover:bg-bordeaux-hover disabled:opacity-70 text-white font-semibold text-sm rounded shadow-bordeaux transition-all flex items-center justify-center gap-2 hover-lift"
                >
                  {loading ? (
                    <span>Đang gửi thông tin...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>GỬI YÊU CẦU TƯ VẤN NGAY</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-xs text-bronze-dark/70">
                <PhoneCall className="w-3.5 h-3.5 text-bordeaux" />
                <span>Hoặc gọi nhanh: <strong className="text-bordeaux">0986.258.999</strong></span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}