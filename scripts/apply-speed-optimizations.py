"""
Apply Speed & Core Web Vitals Optimizations across frontend components.
Powered by jaydev
"""

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def patch_file(rel_path, replacements):
    full_path = os.path.join(BASE_DIR, rel_path)
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Normalize line endings for replacement
    is_crlf = "\r\n" in content
    normalized = content.replace("\r\n", "\n")

    for target, rep in replacements:
        target_norm = target.replace("\r\n", "\n")
        rep_norm = rep.replace("\r\n", "\n")
        if target_norm not in normalized:
            print(f"FAILED target not found in {rel_path}:\n{target_norm[:80]}...")
            return False
        normalized = normalized.replace(target_norm, rep_norm, 1)

    if is_crlf:
        final_content = normalized.replace("\n", "\r\n")
    else:
        final_content = normalized

    with open(full_path, "w", encoding="utf-8") as f:
        f.write(final_content)
    print(f"SUCCESS: Patched {rel_path}")
    return True

# 1. HomeHeroSlider.tsx
hero_slider_patches = [
    # Remove greedy 3s timer
    (
        """  // Preload all remaining slides after initial paint settles (3s delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedIndices(new Set(slides.map((_, i) => i)));
    }, 3000);
    return () => clearTimeout(timer);
  }, [slides]);""",
        ""
    ),
    # Responsive picture banner with mobile WebP
    (
        """                  {loadedIndices.has(index) && (
                    <img
                      src={slide.image}
                      alt={slide.title || "Banner Đồ Đồng Lộc Nam"}
                      className="w-full h-full object-cover object-center relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "low"}
                      decoding={index === 0 ? "sync" : "async"}
                    />
                  )}""",
        """                  {loadedIndices.has(index) && (
                    <picture className="w-full h-full block">
                      {slide.image && slide.image.endsWith(".webp") && !slide.image.includes("_m.webp") && (
                        <source
                          media="(max-width: 768px)"
                          srcSet={slide.image.replace(".webp", "_m.webp")}
                          type="image/webp"
                        />
                      )}
                      <img
                        src={slide.image}
                        alt={slide.title || "Banner Đồ Đồng Lộc Nam"}
                        className="w-full h-full object-cover object-center relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "low"}
                        decoding={index === 0 ? "sync" : "async"}
                      />
                    </picture>
                  )}"""
    )
]

# 2. ModernHeader.tsx: WebP Logo with width/height attributes
modern_header_patches = [
    # Mobile header logo
    (
        """              <img
                src="/images/logo.png"
                alt="Đồ Đồng Lộc Nam"
                className="w-full h-full object-contain"
              />""",
        """              <picture className="w-full h-full block">
                <source srcSet="/images/logo.webp" type="image/webp" />
                <img
                  src="/images/logo.png"
                  alt="Đồ Đồng Lộc Nam"
                  className="w-full h-full object-contain"
                  width="48"
                  height="48"
                />
              </picture>"""
    ),
    # Desktop header logo
    (
        """              <img
                src="/images/logo.png"
                alt="Đồ Đồng Lộc Nam"
                className="w-full h-full object-contain"
              />""",
        """              <picture className="w-full h-full block">
                <source srcSet="/images/logo.webp" type="image/webp" />
                <img
                  src="/images/logo.png"
                  alt="Đồ Đồng Lộc Nam"
                  className="w-full h-full object-contain"
                  width="44"
                  height="44"
                />
              </picture>"""
    ),
    # Mobile drawer logo
    (
        """                  <img src="/images/logo.png" alt="Lộc Nam" className="w-full h-full object-contain" />""",
        """                  <picture className="w-full h-full block">
                    <source srcSet="/images/logo.webp" type="image/webp" />
                    <img src="/images/logo.png" alt="Lộc Nam" className="w-full h-full object-contain" width="36" height="36" />
                  </picture>"""
    )
]

# 3. LocNamFavorites.tsx: WebP and responsive picture
favs_patches = [
    (
        """                    <img
                      src={getWatermarkedImageUrl(prod.image)}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("hero_golden_ship")) {
                          target.src = "/images/hero_golden_ship.jpg";
                        }
                      }}
                    />""",
        """                    <picture className="w-full h-full block">
                      {prod.image && prod.image.endsWith(".jpg") && (
                        <source srcSet={prod.image.replace(".jpg", ".webp")} type="image/webp" />
                      )}
                      <img
                        src={getWatermarkedImageUrl(prod.image)}
                        alt={prod.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                        width="243"
                        height="243"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes("hero_golden_ship")) {
                            target.src = "/images/hero_golden_ship.jpg";
                          }
                        }}
                      />
                    </picture>"""
    )
]

# 4. LocNamCategories.tsx: WebP and width/height
cats_patches = [
    # Mobile category image
    (
        """                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("hero_golden_ship")) {
                      target.src = "/images/hero_golden_ship.jpg";
                    }
                  }}
                />""",
        """                <picture className="w-full h-full block">
                  {cat.image && cat.image.includes(".jpg") && (
                    <source srcSet={cat.image.split("?")[0].replace(".jpg", ".webp")} type="image/webp" />
                  )}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="200"
                    height="200"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes("hero_golden_ship")) {
                        target.src = "/images/hero_golden_ship.jpg";
                      }
                    }}
                  />
                </picture>"""
    ),
    # Desktop category image
    (
        """                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("hero_golden_ship")) {
                      target.src = "/images/hero_golden_ship.jpg";
                    }
                  }}
                />""",
        """                <picture className="w-full h-full block">
                  {cat.image && cat.image.includes(".jpg") && (
                    <source srcSet={cat.image.split("?")[0].replace(".jpg", ".webp")} type="image/webp" />
                  )}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                    width="342"
                    height="342"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes("hero_golden_ship")) {
                        target.src = "/images/hero_golden_ship.jpg";
                      }
                    }}
                  />
                </picture>"""
    )
]

# 5. LocNamPartners.tsx: WebP, dedicated mini thumbnails (2.6 KB) instead of 200 KB
partners_patches = [
    # Mini photo thumbnail
    (
        """                    <img
                      src={b.image || "/images/showroom_1.jpg"}
                      alt={b.name}
                      className="w-full h-full object-cover"
                    />""",
        """                    <img
                      src={(b.image || "/images/showroom_1.jpg").replace(".jpg", "_thumb.webp")}
                      alt={b.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width="40"
                      height="32"
                    />"""
    ),
    # Main facility image
    (
        """                <img
                  src={current.image || "/images/showroom_1.jpg"}
                  alt={current.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("showroom_1")) {
                      target.src = "/images/showroom_1.jpg";
                    }
                  }}
                />""",
        """                <picture className="w-full h-full block">
                  {current.image && current.image.endsWith(".jpg") && (
                    <source srcSet={current.image.replace(".jpg", ".webp")} type="image/webp" />
                  )}
                  <img
                    src={current.image || "/images/showroom_1.jpg"}
                    alt={current.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes("showroom_1")) {
                        target.src = "/images/showroom_1.jpg";
                      }
                    }}
                  />
                </picture>"""
    )
]

# 6. app/layout.tsx: Font optimization and non-render-blocking GA/GTM
layout_patches = [
    # Font definition
    (
        """const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});""",
        """const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});"""
    ),
    # Non-blocking defer GA4/GTM script
    (
        """        {/* Google Analytics 4 (GA4) loaded lazily on idle */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-QW69056L1B"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QW69056L1B', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />""",
        """        {/* Google Analytics 4 (GA4) non-blocking deferred load for Core Web Vitals [jaydev] */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var gtmLoaded = false;
                function loadGTM() {
                  if (gtmLoaded) return;
                  gtmLoaded = true;
                  window.removeEventListener('scroll', loadGTM);
                  window.removeEventListener('mousemove', loadGTM);
                  window.removeEventListener('touchstart', loadGTM);
                  var s = document.createElement('script');
                  s.async = true;
                  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-QW69056L1B';
                  document.head.appendChild(s);
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-QW69056L1B');
                }
                if (typeof window !== 'undefined') {
                  window.addEventListener('scroll', loadGTM, { passive: true, once: true });
                  window.addEventListener('mousemove', loadGTM, { passive: true, once: true });
                  window.addEventListener('touchstart', loadGTM, { passive: true, once: true });
                  if ('requestIdleCallback' in window) {
                    requestIdleCallback(function() { setTimeout(loadGTM, 3500); });
                  } else {
                    setTimeout(loadGTM, 3500);
                  }
                }
              })();
            `
          }}
        />"""
    )
]

def main():
    patch_file("components/home/HomeHeroSlider.tsx", hero_slider_patches)
    patch_file("components/common/ModernHeader.tsx", modern_header_patches)
    patch_file("components/home/LocNamFavorites.tsx", favs_patches)
    patch_file("components/home/LocNamCategories.tsx", cats_patches)
    patch_file("components/home/LocNamPartners.tsx", partners_patches)
    patch_file("app/layout.tsx", layout_patches)
    print("=== All speed patches applied successfully! ===")

if __name__ == "__main__":
    main()
