"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: account, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c14] flex items-center justify-center p-4 selection:bg-[#d4af37] selection:text-[#070c14]">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-[#0c1420] border-2 border-[#d4af37]/40 rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-2xl border border-[#d4af37]/60 p-2 bg-white shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center justify-center">
            <img src="/images/logo.png" alt="Logo Lộc Nam" className="w-full h-full object-contain" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>CỔNG QUẢN TRỊ BẢO MẬT</span>
          </div>
          <h1 className="font-serif font-extrabold text-xl sm:text-2xl text-white tracking-wide uppercase">
            ĐỒ ĐỒNG LỘC NAM
          </h1>
          <p className="text-xs text-[#94a3b8]">
            Hệ thống quản lý xưởng đúc & showroom phân phối
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/60 text-rose-300 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-white block uppercase">Tài Khoản / Email Quản Trị</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Nhập tài khoản hoặc email quản trị..."
                className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-white block uppercase">Mật Khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#111c2e] border border-[#1f2d42] focus:border-[#d4af37] text-white text-xs pl-10 pr-10 py-3 rounded-xl focus:outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#d4af37] transition-colors"
              >
                {showPassword ? (
                  <span className="text-[10px] font-semibold">ẨN</span>
                ) : (
                  <span className="text-[10px] font-semibold">HIỆN</span>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#e5b869] hover:from-[#b89628] hover:to-[#d4af37] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50"
          >
            <span>{loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP HỆ THỐNG"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
