"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";
import { HomeCategory, homeCategories } from "@/lib/home-content";
import { categoryPath } from "@/lib/site";
import { AdminImage } from "./AdminImage";
import { useToast } from "./AdminToast";

export function HomeCategoryEditor({ settings, onChange, onBusyChange }: {
  settings: Record<string, string>; onChange: (key: string, value: string) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const cards = homeCategories(settings);
  const [choices, setChoices] = useState<HomeCategory[]>([]);
  const [selected, setSelected] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const { toastError } = useToast();
  useEffect(() => {
    fetch("/api/admin/subcategories").then(res => res.json()).then(data => {
      if (!data.success) throw new Error(data.message);
      const options: HomeCategory[] = [];
      for (const cat of data.data) {
        const prefix = categoryPath(cat.slug);
        options.push({ id: cat.slug, title: cat.name, subtitle: cat.description || "", image: cat.banner, href: prefix });
        for (const sub of cat.subCategories) {
          options.push({ id: `${cat.slug}-${sub.id}`, title: sub.name, subtitle: "", image: sub.image, href: `${prefix}/${sub.id}` });
          for (const child of sub.children || []) options.push({ id: `${cat.slug}-${sub.id}-${child.id}`, title: child.name,
            subtitle: "", image: child.image, href: `${prefix}/${sub.id}/${child.id}` });
        }
      }
      setChoices(options);
    }).catch(() => toastError("Không tải được danh mục để chọn. Vui lòng tải lại trang."));
  }, []);
  const save = (next: HomeCategory[]) => onChange("home_featured_categories", JSON.stringify(next));
  const update = (index: number, key: keyof HomeCategory, value: string) => save(cards.map((card, i) => i === index ? { ...card, [key]: value } : card));
  const move = (index: number, direction: number) => {
    const next = [...cards]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; save(next);
  };
  const upload = async (index: number, file: File) => {
    setUploading(cards[index].id);
    onBusyChange?.(true);
    try {
      const body = new FormData(); body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body }); const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Không tải được ảnh");
      update(index, "image", data.url);
    } catch (error) { toastError(error instanceof Error ? error.message : "Tải ảnh thất bại"); }
    finally { setUploading(null); onBusyChange?.(false); }
  };
  const inputClass = "w-full px-3 py-2 bg-[#111c2e] border border-[#34465e] rounded-lg text-sm text-white focus:outline-none focus:border-[#dfb755]";
  return <div id="home-categories" className="space-y-4">
    <p className="text-sm text-[#cbd5e1]">Chọn danh mục, thêm vào danh sách rồi bấm Lưu cài đặt. Ảnh, tiêu đề và thứ tự dưới đây được dùng trên trang chủ.</p>
    <div className="flex flex-wrap gap-2">
      <select aria-label="Chọn danh mục đưa lên trang chủ" className={`${inputClass} flex-1 min-w-48`} value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="">Chọn danh mục có sẵn…</option>
        {choices.map(choice => <option key={choice.id} value={choice.id}>{choice.title}</option>)}
      </select>
      <button type="button" disabled={!selected || uploading !== null} className="px-4 py-2 bg-[#dfb755] text-[#0c1420] rounded-lg font-semibold disabled:opacity-50"
        onClick={() => { const choice = choices.find(c => c.id === selected); if (choice) save([...cards, { ...choice, id: `${choice.id}-${Date.now()}` }]); }}><Plus className="inline w-4 h-4 mr-1" />Thêm danh mục</button>
    </div>
    {!cards.length && <p className="text-[#cbd5e1] text-sm">Chưa có danh mục nổi bật. Chọn một danh mục ở trên để thêm.</p>}
    <div className="grid gap-4 lg:grid-cols-2">
      {cards.map((card, index) => <div key={card.id} className="border border-[#34465e] rounded-xl p-4 space-y-3">
        <div className="flex gap-3 items-start">
          <a href={card.image} target="_blank" rel="noreferrer" className="shrink-0"><AdminImage src={card.image} alt={card.title} className="w-24 h-24 object-contain bg-[#111c2e] rounded-lg" /></a>
          <div className="min-w-0 flex-1 space-y-2">
            <label className="block text-sm text-[#cbd5e1]">Tiêu đề<input disabled={uploading !== null} className={inputClass} value={card.title} onChange={e => update(index, "title", e.target.value)} /></label>
            <label className="block text-sm text-[#cbd5e1]">Mô tả<input disabled={uploading !== null} className={inputClass} value={card.subtitle} onChange={e => update(index, "subtitle", e.target.value)} /></label>
          </div>
        </div>
        <label className="block text-sm text-[#cbd5e1]">Ảnh<input disabled={uploading !== null} className={inputClass} value={card.image} onChange={e => update(index, "image", e.target.value)} /></label>
        <label className="block text-sm text-[#cbd5e1]">Liên kết<input disabled={uploading !== null} className={inputClass} value={card.href} onChange={e => update(index, "href", e.target.value)} /></label>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer text-sm text-[#dfb755] mr-auto"><Upload className="inline w-4 h-4 mr-1" />{uploading === card.id ? "Đang tải…" : "Tải ảnh"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploading !== null}
              onChange={e => { const file = e.target.files?.[0]; if (file) void upload(index, file); e.target.value = ""; }} /></label>
          <button type="button" aria-label="Đưa lên trước" disabled={index === 0 || uploading !== null} className="p-2 disabled:opacity-30" onClick={() => move(index, -1)}><ArrowUp className="w-4 h-4" /></button>
          <button type="button" aria-label="Đưa xuống sau" disabled={index === cards.length - 1 || uploading !== null} className="p-2 disabled:opacity-30" onClick={() => move(index, 1)}><ArrowDown className="w-4 h-4" /></button>
          <button type="button" aria-label={`Bỏ ${card.title} khỏi trang chủ`} disabled={uploading !== null} className="p-2 text-red-400 disabled:opacity-30" onClick={() => save(cards.filter((_, i) => i !== index))}><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>)}
    </div>
  </div>;
}
