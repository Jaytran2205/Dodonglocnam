"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If it is a chunk load error from a new deployment, auto reload once
    const msg = error?.message || "";
    if (
      msg.includes("Loading chunk") ||
      msg.includes("ChunkLoadError") ||
      msg.includes("Failed to fetch dynamically imported module")
    ) {
      const key = "chunk_error_reload";
      const last = sessionStorage.getItem(key);
      const now = Date.now();
      if (!last || now - parseInt(last, 10) > 10000) {
        sessionStorage.setItem(key, now.toString());
        window.location.reload();
        return;
      }
    }
    console.error("Client error captured by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#071322] text-[#fbf9f5] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-[#0c1c2e] border border-[#1e344d] rounded-2xl p-8 shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#dfb755]/10 border border-[#dfb755]/30 flex items-center justify-center">
          <RotateCcw className="w-8 h-8 text-[#dfb755]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#dfb755] mb-3">
          Đang cập nhật phiên bản mới
        </h2>
        <p className="text-sm text-[#cbd5e1] mb-8 leading-relaxed">
          Hệ thống vừa được nâng cấp tính năng mới. Quý khách vui lòng tải lại trang để trải nghiệm đầy đủ nhất.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#b8860b] hover:bg-[#996515] text-white font-medium rounded-xl transition-colors shadow-lg shadow-[#b8860b]/20"
          >
            <RotateCcw className="w-4 h-4" />
            Tải lại trang
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#13283f] hover:bg-[#1a3654] text-[#cbd5e1] hover:text-white font-medium rounded-xl transition-colors border border-[#224060]"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
