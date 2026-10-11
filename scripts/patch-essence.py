import os

path = "components/home/LocNamBrandEssence.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

norm = text.replace("\r\n", "\n")

target = """  React.useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          setReviews(
            DEFAULT_HOME_REVIEWS.map((item, idx) => {
              const prefix = `rev${idx + 1}_`;
              return {
                ...item,
                name: s[`${prefix}name`] || item.name,
                title: s[`${prefix}title`] || item.title,
                location: s[`${prefix}location`] || item.location,
                product: s[`${prefix}product`] || item.product,
                tag: s[`${prefix}tag`] || item.tag,
                image: s[`${prefix}image`] || item.image,
                comment: s[`${prefix}comment`] || item.comment,
              };
            })
          );
        }
      })
      .catch((e) => console.error("Error loading reviews:", e));
  }, []);"""

rep = """  React.useEffect(() => {
    getClientSettings()
      .then((s) => {
        if (s && Object.keys(s).length) {
          setReviews(
            DEFAULT_HOME_REVIEWS.map((item, idx) => {
              const prefix = `rev${idx + 1}_`;
              return {
                ...item,
                name: s[`${prefix}name`] || item.name,
                title: s[`${prefix}title`] || item.title,
                location: s[`${prefix}location`] || item.location,
                product: s[`${prefix}product`] || item.product,
                tag: s[`${prefix}tag`] || item.tag,
                image: s[`${prefix}image`] || item.image,
                comment: s[`${prefix}comment`] || item.comment,
              };
            })
          );
        }
      })
      .catch((e) => console.error("Error loading reviews:", e));
  }, []);"""

if target in norm:
    norm = norm.replace(target, rep, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(norm.replace("\n", "\r\n"))
    print("LocNamBrandEssence patched!")
else:
    print("target NOT found")
