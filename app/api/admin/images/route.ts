import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { loadCatalog } from "@/lib/catalog";
import { loadSettings } from "@/lib/settings";
import { parseImageList } from "@/lib/utils";
import staticImages from "@/data/media-index.json";
import { projectsData } from "@/data/projects";
import { articlesData } from "@/app/tin-tuc/articlesData";

export const dynamic = "force-dynamic";
const loadImages = unstable_cache(async () => {
  const [uploads, products, articles, settings, catalog] = await Promise.all([
    prisma.uploadedImage.findMany({ select: { id: true, filename: true }, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ select: { name: true, images: true, description: true } }),
    prisma.article.findMany({ select: { title: true, thumbnail: true, content: true } }),
    loadSettings(), loadCatalog(),
  ]);
  const images = new Map<string, { url: string; name: string; source: string }>();
  const add = (url: string, name: string, source: string) => {
    if (url && !url.startsWith("data:") && /^(?:https?:\/\/|\/)/i.test(url)) images.set(url, { url, name, source });
  };
  staticImages.forEach(image => add(image.url, image.name, "Ảnh có sẵn"));
  uploads.forEach(image => add(`/api/images/${image.id}/${image.filename}`, image.filename, "Ảnh tải lên"));
  const collect = (value: unknown, label: string) => {
    if (typeof value === "string") {
      try { collect(JSON.parse(value), label); } catch {
        if (/\.(?:jpe?g|png|webp|avif|gif|svg)(?:[?#].*)?$/i.test(value) || value.startsWith("/api/images/")) add(value, label, "Đang dùng trên web");
        for (const match of Array.from(value.matchAll(/(?:<img\b[^>]*\bsrc=["']|!\[[^\]]*\]\(|\[(?:img|image)=)([^"'\s)>\]]+)/gi))) {
          add(match[1].replace(/&amp;/g, "&"), label, "Ảnh trong nội dung");
        }
      }
    } else if (Array.isArray(value)) value.forEach(item => collect(item, label));
    else if (value && typeof value === "object") Object.values(value).forEach(item => collect(item, label));
  };
  Object.entries(settings).forEach(([key, value]) => collect(value, key));
  catalog.forEach(cat => collect(cat, cat.name));
  projectsData.forEach(project => collect(project, project.title));
  articlesData.forEach(article => collect(article, article.title));
  products.forEach(product => {
    parseImageList(product.images).forEach(url => add(url, product.name, "Sản phẩm"));
    collect(product.description, product.name);
  });
  articles.forEach(article => {
    if (article.thumbnail) add(article.thumbnail, article.title, "Bài viết");
    collect(article.content, article.title);
  });
  return Array.from(images.values());
}, ["admin-image-library-v1"], { revalidate: 300, tags: ["media", "settings", "catalog", "products", "articles"] });

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) return NextResponse.json({ success: false, message: "Cần đăng nhập." }, { status: 401 });
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.role) && !session.permissions?.some(p => ["products", "articles", "categories", "landing"].includes(p))) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền xem thư viện ảnh." }, { status: 403 });
  }
  try {
    const params = req.nextUrl.searchParams;
    const query = (params.get("q") || "").trim().toLocaleLowerCase("vi");
    const all = await loadImages();
    const filtered = all.filter(image => `${image.name} ${image.url} ${image.source}`.toLocaleLowerCase("vi").includes(query));
    const pageCount = Math.max(1, Math.ceil(filtered.length / 48));
    const page = Math.min(pageCount, Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1));
    return NextResponse.json({ success: true, images: filtered.slice((page - 1) * 48, page * 48), total: filtered.length, page, pageCount });
  } catch (error) {
    console.error("Media library error:", error);
    return NextResponse.json({ success: false, message: "Không tải được thư viện ảnh. Vui lòng thử lại." }, { status: 500 });
  }
}
