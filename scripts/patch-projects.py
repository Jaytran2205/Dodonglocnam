import os

path = "components/home/LocNamProjectsSection.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

norm = text.replace("\r\n", "\n")

target = """              <img
                src={mainProject.image}
                alt={mainProject.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("hero_golden_ship")) {
                    target.src = "/images/hero_golden_ship.jpg";
                  }
                }}
              />"""

rep = """              <picture className="w-full h-full block">
                {mainProject.image && (mainProject.image.endsWith(".jpeg") || mainProject.image.endsWith(".jpg")) && (
                  <source srcSet={mainProject.image.replace(".jpeg", ".webp").replace(".jpg", ".webp")} type="image/webp" />
                )}
                <img
                  src={mainProject.image}
                  alt={mainProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                  width="658"
                  height="411"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("hero_golden_ship")) {
                      target.src = "/images/hero_golden_ship.jpg";
                    }
                  }}
                />
              </picture>"""

if target in norm:
    norm = norm.replace(target, rep, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(norm.replace("\n", "\r\n"))
    print("LocNamProjectsSection patched!")
else:
    print("target NOT found")
