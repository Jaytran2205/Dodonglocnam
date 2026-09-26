export function isRawFilename(title?: string): boolean {
  if (!title) return true;
  const t = title.trim().toLowerCase();
  if (
    !t ||
    t === "video sản phẩm" ||
    t === "video tải lên" ||
    t === "video bài viết đồ đồng lộc nam" ||
    t.includes("snaptik") ||
    t.includes("tiktok") ||
    t.startsWith("vid_") ||
    t.startsWith("video_") ||
    t.endsWith(".mp4") ||
    t.endsWith(".mov") ||
    t.endsWith(".webm") ||
    /^\d{6,}$/.test(t.replace(/[\s_-]/g, ""))
  ) {
    return true;
  }
  return false;
}
