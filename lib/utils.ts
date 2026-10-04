import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) {
    return "Liên hệ báo giá";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getWatermarkedImageUrl(url: string | null | undefined): string {
  if (!url) return "/images/logo.png";
  return url;
}

export function parseImageList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && !!item.trim()).map(item => item.trim());
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parseImageList(parsed);
    if (typeof parsed === "string") return parsed.trim() ? [parsed.trim()] : [];
  } catch { /* Legacy records can contain a plain URL or newline-separated URLs. */ }
  // Do not split comma-containing query strings or data URLs.
  return value.split(/\r?\n|,\s*(?=(?:https?:\/\/|\/images\/|\/api\/images\/|\/uploads\/))/).map(item => item.trim()).filter(Boolean);
}

export function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim();
}

