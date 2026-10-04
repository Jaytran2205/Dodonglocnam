"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const msg = error?.message || "";
    if (
      msg.includes("Loading chunk") ||
      msg.includes("ChunkLoadError") ||
      msg.includes("Failed to fetch dynamically imported module")
    ) {
      const key = "chunk_global_error_reload";
      const last = sessionStorage.getItem(key);
      const now = Date.now();
      if (!last || now - parseInt(last, 10) > 10000) {
        sessionStorage.setItem(key, now.toString());
        window.location.reload();
        return;
      }
    }
    console.error("Global client error:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="bg-[#071322] text-[#fbf9f5] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-[#0c1c2e] border border-[#1e344d] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-[#dfb755] mb-3">
            Hệ thống đang hoàn tất cập nhật
          </h2>
          <p className="text-sm text-[#cbd5e1] mb-6 leading-relaxed">
            Phiên bản mới đã sẵn sàng. Vui lòng nhấn nút bên dưới để làm mới trình duyệt.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#b8860b] hover:bg-[#996515] text-white font-medium rounded-xl transition-colors shadow-lg"
          >
            Tải lại trang ngay
          </button>
        </div>
      </body>
    </html>
  );
}
