// One public origin for metadata, structured data and sitemap URLs.
// A developer's localhost setting must never enter production SEO metadata.
const DEFAULT_SITE_URL = "https://www.quatanglocnam.com";
export function canonicalOrigin(configured?: string): string {
  try {
    const url = new URL(configured || DEFAULT_SITE_URL);
    if (!["http:", "https:"].includes(url.protocol) ||
      ["localhost", "0.0.0.0", "[::1]"].includes(url.hostname) || /^127\./.test(url.hostname)) {
      return DEFAULT_SITE_URL;
    }
    if (["quatanglocnam.com", "www.quatanglocnam.com"].includes(url.hostname)) return DEFAULT_SITE_URL;
    return url.origin;
  } catch { return DEFAULT_SITE_URL; }
}
export const SITE_URL = canonicalOrigin(process.env.NEXT_PUBLIC_SITE_URL);

export function siteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).href;
}

export function productPath(slug: string): string {
  return `/san-pham/${slug}`;
}

export function categoryPath(slug: string): string {
  if (["qua-tang", "qua-tang-dong"].includes(slug)) return "/qua-tang";
  if (slug === "vat-pham-my-nghe") return "/qua-tang/qua-tang-phong-thuy";
  if (slug === "cup-golf") return "/qua-tang/qua-tang-su-kien/cup";
  return `/san-pham/${slug}`;
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function contentDate(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  const vietnameseDate = typeof value === "string" && value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const date = vietnameseDate
    ? new Date(`${vietnameseDate[3]}-${vietnameseDate[2]}-${vietnameseDate[1]}T00:00:00+07:00`)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
