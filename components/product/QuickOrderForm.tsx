"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, ShieldCheck } from "lucide-react";

interface QuickOrderFormProps {
  productName: string;
  hotline?: string;
}

export function QuickOrderForm({ productName, hotline = "0846 699 997" }: QuickOrderFormProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
          content: `Đặt hàng/Tư vấn: ${productName}. Địa chỉ: ${address}. Ghi chú: ${note}`,
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
      setErrorMsg("Không thể gửi thông tin, vui lòng gọi trực tiếp hotline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#070e17] p-5 sm:p-7 rounded-xl border border-[#1c2c3d] shadow-lg">
      <div className="border-b border-[#1c2c3d] pb-3 mb-5">
        <h4 className="font-serif font-black text-base sm:text-lg text-[#ffd700] uppercase tracking-wide">
          Đặt Hàng Nhanh & Tư Vấn Kỹ Thuật
        </h4>
        <p className="text-xs text-[#94a3b8] mt-1 font-light">
          Chuyên viên tư vấn Lộc Nam sẽ liên hệ lại báo giá và hỗ trợ kích thước phong thủy miễn phí
        </p>
      </div>

      {success ? (
        <div className="text-center py-6 space-y-3 bg-[#0b1422] p-5 rounded-xl border border-emerald-500 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
          <h5 className="font-serif font-bold text-base text-[#f1f5f9]">
            Đã Gửi Yêu Cầu Thành Công!
          </h5>
          <p className="text-xs text-[#cbd5e1]">
            Lộc Nam đã tiếp nhận thông tin yêu cầu cho sản phẩm <strong className="text-[#ffd700]">{productName}</strong> và sẽ liên hệ quý khách qua số <strong className="text-[#ffd700]">{phone}</strong> trong vòng 15 phút.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-yellow-950/60 border border-yellow-500 text-yellow-200 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-serif font-bold text-[#f1f5f9] mb-1">
                Họ và Tên <span className="text-[#ffd700]">*</span>
              </label>
              <input
                id="order-customer-name"
                type="text"
                required
                placeholder="Ví dụ: Bác Trần Văn Hưng"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b1422] border border-[#1c2c3d] rounded-lg text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-[#f1f5f9] mb-1">
                Số Điện Thoại / Zalo <span className="text-[#ffd700]">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ví dụ: 0846 699 997"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b1422] border border-[#1c2c3d] rounded-lg text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-[#f1f5f9] mb-1">
              Địa Chỉ Nhận Hàng (Tỉnh / Thành phố)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Quận Cầu Giấy, Hà Nội"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0b1422] border border-[#1c2c3d] rounded-lg text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-[#f1f5f9] mb-1">
              Yêu Cầu Riêng (Khắc chữ lưu niệm, mạ vàng 24k, kích thước...)
            </label>
            <textarea
              rows={2}
              placeholder="Ví dụ: Yêu cầu khắc tên gia tộc lên chân nến, chọn ngày đẹp bàn giao..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0b1422] border border-[#1c2c3d] rounded-lg text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/30 transition-all resize-none"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#e11d48] via-[#dc2626] to-[#b91c1c] hover:brightness-110 disabled:opacity-60 text-white text-xs sm:text-sm font-serif font-black uppercase tracking-wider rounded-lg transition-all shadow-[0_4px_20px_rgba(225,29,72,0.4)] border border-[#f43f5e] flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "ĐANG XỬ LÝ..." : "GỬI YÊU CẦU TƯ VẤN & ĐẶT HÀNG"}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#94a3b8] pt-1 font-light">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cam kết giữ bảo mật thông tin • Khách kiểm tra hàng trước khi nhận</span>
          </div>
        </form>
      )}
    </div>
  );
}