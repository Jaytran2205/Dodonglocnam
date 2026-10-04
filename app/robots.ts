import { MetadataRoute } from "next";
import { SITE_URL, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*", allow: "/",
      // Assets and uploaded media are public. Admin pages have noindex + authentication.
      disallow: ["/api/admin/", "/api/cron/", "/api/search", "/api/orders", "/api/contact"],
    }],
    sitemap: siteUrl("/sitemap.xml"), host: SITE_URL,
  };
}
