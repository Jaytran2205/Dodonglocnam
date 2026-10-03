/**
 * Security & Sanitization Utilities for Đồ Đồng Lộc Nam
 */

export function isSafeUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.trim();
  if (!clean) return false;

  const lower = clean.toLowerCase();
  // Disallow execution schemes
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("blob:")
  ) {
    return false;
  }

  // Allow standard web protocols, contact schemes, or relative internal links
  if (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:") ||
    clean.startsWith("/") ||
    clean.startsWith("#") ||
    clean.startsWith("./")
  ) {
    return true;
  }

  return false;
}

export function escapeAttribute(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  let sanitized = html;

  // 1. Remove <script> tags and contents
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Remove inline on* event handlers (onerror, onload, onclick, onmouseover, etc.)
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*(['"]).*?\1/gi, "");
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*[^>\s]+/gi, "");

  // 3. Strip href/src containing javascript: or vbscript:
  sanitized = sanitized.replace(/(href|src)\s*=\s*(['"])\s*(javascript|vbscript):[^'"]*\2/gi, '$1="#"');

  return sanitized;
}
