import fs from "node:fs/promises";
import path from "node:path";

const publicDir = path.resolve("public");
const items = [];
async function scan(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await scan(full);
    else if (/\.(?:jpe?g|png|webp|avif|gif|svg|ico)$/i.test(entry.name)) {
      const url = "/" + path.relative(publicDir, full).split(path.sep).join("/");
      items.push({ url, name: entry.name });
    }
  }
}
await scan(publicDir);
items.sort((a, b) => a.url.localeCompare(b.url));
await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/media-index.json", JSON.stringify(items));
console.log(`Indexed ${items.length} public images for the admin media library.`);
