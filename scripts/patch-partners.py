import os

path = "components/home/LocNamPartners.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

norm = text.replace("\r\n", "\n")

target_thumb = """                    <img
                      src={b.image || "/images/showroom_1.jpg"}
                      alt={b.name}
                      className="w-full h-full object-cover"
                    />"""

rep_thumb = """                    <img
                      src={(b.image || "/images/showroom_1.jpg").replace(".jpg", "_thumb.webp")}
                      alt={b.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width="40"
                      height="32"
                    />"""

if target_thumb in norm:
    norm = norm.replace(target_thumb, rep_thumb, 1)
    print("Thumbnail patched!")
else:
    print("target_thumb NOT found")

target_main = """              <img
                key={current.id}
                src={current.image || "/images/showroom_1.jpg"}
                alt={current.name}
                className={`w-full h-full object-cover ${current.objectPos || "object-center"} transition-all duration-700 animate-fadeIn`}
                loading="lazy"
                decoding="async"
              />"""

rep_main = """              <picture className="w-full h-full block">
                {current.image && current.image.endsWith(".jpg") && (
                  <source srcSet={current.image.replace(".jpg", ".webp")} type="image/webp" />
                )}
                <img
                  key={current.id}
                  src={current.image || "/images/showroom_1.jpg"}
                  alt={current.name}
                  className={`w-full h-full object-cover ${current.objectPos || "object-center"} transition-all duration-700 animate-fadeIn`}
                  loading="lazy"
                  decoding="async"
                />
              </picture>"""

if target_main in norm:
    norm = norm.replace(target_main, rep_main, 1)
    print("Main image patched!")
else:
    print("target_main NOT found")

with open(path, "w", encoding="utf-8") as f:
    f.write(norm.replace("\n", "\r\n"))
