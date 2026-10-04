"use client";

// Share concurrent GETs (including React StrictMode's duplicate mount requests).
// Settled requests are removed: permissions and saved data never get a stale TTL.
const pending = new Map<string, Promise<any>>();
export class AdminRequestError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}
export function adminGet<T = any>(url: string): Promise<T> {
  const existing = pending.get(url);
  if (existing) return existing;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  const request = fetch(url, { cache: "no-store", signal: controller.signal })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok || data.success === false)
        throw new AdminRequestError(
          data.message || "Không tải được dữ liệu. Vui lòng thử lại.",
          response.status
        );
      return data;
    })
    .finally(() => {
      clearTimeout(timer);
      if (pending.get(url) === request) pending.delete(url);
    });
  pending.set(url, request);
  return request;
}
