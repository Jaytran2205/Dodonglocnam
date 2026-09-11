"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#e2d5bd] shadow-sm">
      <h2 className="font-serif font-bold text-lg sm:text-xl text-[#0c1825] uppercase tracking-wide">
        GỬI YÊU CẦU TƯ VẤN & BÁO GIÁ
      </h2>

      {submitted ? (
        <div className="p-8 bg-[#fbf9f5] border border-emerald-500 rounded-xl text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-[#0c1825]">Gửi thông tin thành công!</h3>
          <p className="text-xs sm:text-sm text-[#4b5563]">
            Cảm ơn quý khách. Nghệ nhân Đồ Đồng Lộc Nam sẽ liên hệ lại qua số điện thoại của quý khách trong vòng 15 phút.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", phone: "", email: "", message: "" });
            }}
            className="px-6 py-2 bg-[#b8860b] text-white font-serif font-bold text-xs uppercase rounded-lg hover:bg-[#9b6f1e]"
          >
            Gửi yêu cầu khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-[#0c1825] block">
              Họ và tên của bạn *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Nguyễn Văn An"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#fbf9f5] text-[#1a1a1a] text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-[#e2d5bd] focus:outline-none focus:border-[#b8860b]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-serif font-bold text-[#0c1825] block">
                Số điện thoại *
              </label>
              <input
                type="tel"
                required
                placeholder="Ví dụ: 0846 699 997"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#fbf9f5] text-[#1a1a1a] text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-[#e2d5bd] focus:outline-none focus:border-[#b8860b]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-serif font-bold text-[#0c1825] block">
                Email (không bắt buộc)
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#fbf9f5] text-[#1a1a1a] text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-[#e2d5bd] focus:outline-none focus:border-[#b8860b]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-[#0c1825] block">
              Nội dung yêu cầu *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Mô tả sản phẩm bạn đang quan tâm (bộ đồ thờ, tượng đồng, kích thước bàn thờ...)"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#fbf9f5] text-[#1a1a1a] text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-[#e2d5bd] focus:outline-none focus:border-[#b8860b] resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3 bg-[#b8860b] hover:bg-[#9b6f1e] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all shadow-sm"
            >
              <span>GỬI LIÊN HỆ NGAY</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
