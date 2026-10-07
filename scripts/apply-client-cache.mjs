import fs from "fs";

const files = [
  "components/common/FloatingContact.tsx",
  "components/common/ModernFooter.tsx",
  "components/common/ModernHeader.tsx",
  "components/home/HomeHeroSlider.tsx",
  "components/home/LocNamFavorites.tsx",
  "components/home/LocNamPartners.tsx",
  "components/home/LocNamVideos.tsx",
  "components/home/LocNamBrandEssence.tsx",
  "components/product/LeGiaProductListing.tsx",
];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  // Ensure "use client"; is line 1 if present
  if (content.includes('"use client";')) {
    content = content.replace(/import\s*\{\s*getClientSettings\s*\}\s*from\s*"@\/lib\/client-cache";\r?\n/g, "");
    content = content.replace(/import\s*\{\s*getClientCatalog\s*\}\s*from\s*"@\/lib\/client-cache";\r?\n/g, "");
    content = content.replace(/"use client";\r?\n/g, "");
    content = '"use client";\nimport { getClientSettings, getClientCatalog } from "@/lib/client-cache";\n' + content.trimStart();
    fs.writeFileSync(file, content, "utf8");
  }
}

console.log("All components updated with use client on top");
