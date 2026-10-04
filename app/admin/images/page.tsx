"use client";

import React, { useEffect, useState } from "react";
import { AdminImage } from "@/components/admin/AdminImage";
import { useToast } from "@/components/admin/AdminToast";

export default function AdminImagesPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<{ images: { url: string; name: string; source: string }[]; total: number; pageCount: number }>({ images: [], total: 0, pageCount: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const { toastSuccess, toastError } = useToast();
  useEffect(() => {
    const abort = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setError("");
      try {
        const res = await fetch(`/api/admin/images?page=${page}&q=${encodeURIComponent(query)}`, { signal: abort.signal });
        const data = await res.json(); if (!res.ok || !data.success) throw new Error(data.message);
        setResult(data);
      } catch (err) { if (!abort.signal.aborted) setError(err instanceof Error ? err.message : "Không tải được ảnh."); }
      finally { if (!abort.signal.aborted) setLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); abort.abort(); };
  }, [page, query, retry]);
  return <main className="space-y-5 text-white">
    <h1 className="font-serif text-3xl font-bold">Thư viện ảnh website</h1>
    <p className="text-[#cbd5e1]">Xem ảnh gốc, ảnh tải lên và ảnh đang dùng trong danh mục, sản phẩm, bài viết, dự án và trang chủ. Bấm ảnh để mở nguyên bản hoặc sao chép đường dẫn vào ô ảnh của phần cần chỉnh.</p>
    <input aria-label="Tìm ảnh" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm theo tên, đường dẫn hoặc sản phẩm…"
      className="w-full max-w-xl px-4 py-3 bg-[#111c2e] border border-[#34465e] rounded-lg focus:outline-none focus:border-[#dfb755]" />
    {error ? <div role="alert" className="text-red-300">{error}<button type="button" className="ml-3 underline" onClick={() => setRetry(n => n + 1)}>Thử lại</button></div> : <>
      <div className="flex flex-wrap items-center gap-3 text-sm text-[#cbd5e1]" aria-live="polite">
        <span>{loading ? "Đang tải ảnh…" : `${result.total} ảnh — Trang ${page}/${result.pageCount}`}</span>
        <button type="button" disabled={page <= 1 || loading} className="px-3 py-2 border border-[#34465e] rounded-lg disabled:opacity-40" onClick={() => setPage(p => p - 1)}>Trang trước</button>
        <button type="button" disabled={page >= result.pageCount || loading} className="px-3 py-2 border border-[#34465e] rounded-lg disabled:opacity-40" onClick={() => setPage(p => p + 1)}>Trang sau</button>
      </div>
      {!loading && !result.images.length && <p>Không tìm thấy ảnh phù hợp.</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" aria-busy={loading}>
        {result.images.map(image => <article key={image.url} className="border border-[#34465e] rounded-xl overflow-hidden">
          <a href={image.url} target="_blank" rel="noreferrer"><AdminImage src={image.url} alt={image.name} className="w-full h-44 object-contain bg-[#111c2e]" /></a>
          <div className="p-3 space-y-2 text-sm"><p className="break-words">{image.name}</p><p className="text-[#cbd5e1]">{image.source}</p>
            <p className="break-all text-xs text-[#cbd5e1]">{image.url}</p>
            <button type="button" className="text-[#dfb755] underline underline-offset-4" onClick={async () => {
              try { await navigator.clipboard.writeText(image.url); toastSuccess("Đã sao chép đường dẫn ảnh."); }
              catch { toastError("Không sao chép được. Hãy chọn đường dẫn bên trên để sao chép."); }
            }}>Sao chép đường dẫn</button>
          </div>
        </article>)}
      </div>
    </>}
  </main>;
}
