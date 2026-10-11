import os

path = "components/home/LocNamVideos.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

norm = text.replace("\r\n", "\n")

target = """                    <img
                      src={vid.image || "/images/hero_golden_ship.jpg"}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                      loading="lazy"
                      decoding="async"
                    />"""

rep = """                    <picture className="w-full h-full block">
                      {vid.image && vid.image.endsWith(".jpg") && (
                        <source srcSet={vid.image.replace(".jpg", ".webp")} type="image/webp" />
                      )}
                      <img
                        src={vid.image || "/images/hero_golden_ship.jpg"}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                        loading="lazy"
                        decoding="async"
                        width="320"
                        height="200"
                      />
                    </picture>"""

if target in norm:
    norm = norm.replace(target, rep, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(norm.replace("\n", "\r\n"))
    print("LocNamVideos patched!")
else:
    print("target NOT found")
