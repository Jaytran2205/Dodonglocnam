import {
  MainCategoryData,
  SubCategoryItem,
  getSubCatInfoForProduct,
  removeVietnameseTones,
} from "@/lib/subcategories-data";

export interface AdminProductFilters {
  search: string;
  selectedCat: string;
  selectedSubCat: string;
  stockFilter: string;
  sortBy: string;
}

export function adminSubcategoryOptions(
  catalog: MainCategoryData[],
  categories: any[],
  selectedCat: string
) {
  interface FilterSubOption {
    id: string;
    name: string;
    displayName: string;
    parentId?: string | null;
    childIds?: string[];
    keyword?: string;
  }

  const result: FilterSubOption[] = [];

  const appendSub = (sub: SubCategoryItem) => {
    const childIds = sub.children?.map((c) => c.id) || [];
    result.push({
      id: sub.id,
      name: sub.name,
      displayName: `└─ ${sub.name}`,
      childIds,
      keyword: sub.keyword,
    });

    if (sub.children && sub.children.length > 0) {
      sub.children.forEach((ch) => {
        result.push({
          id: ch.id,
          name: ch.name,
          displayName: `   └── ${ch.name}`,
          parentId: sub.id,
          keyword: ch.keyword,
        });
      });
    }
  };

  if (selectedCat === "ALL") {
    const seenIds = new Set<string>();
    catalog.forEach((c) => {
      (c.subCategories || []).forEach((sub) => {
        if (!seenIds.has(sub.id)) {
          seenIds.add(sub.id);
          appendSub(sub);
          (sub.children || []).forEach((ch) => seenIds.add(ch.id));
        }
      });
    });
    return result;
  }

  const selectedDbCat = categories.find(
    (c) => c.id === selectedCat || c.slug === selectedCat
  );
  if (!selectedDbCat) return [];

  const matchedCatalog = catalog.find(
    (c) =>
      c.slug === selectedDbCat.slug ||
      (c.aliases && c.aliases.includes(selectedDbCat.slug))
  );
  if (!matchedCatalog) return [];

  matchedCatalog.subCategories.forEach((sub) => appendSub(sub));
  return result;
}

export function filterAdminProducts(
  products: any[],
  catalog: MainCategoryData[],
  categories: any[],
  filters: AdminProductFilters
) {
  const { search, selectedCat, selectedSubCat, stockFilter, sortBy } = filters;
  const availableSubcategoriesForFilter = adminSubcategoryOptions(
    catalog,
    categories,
    selectedCat
  );

  let list = [...products];

  if (search.trim()) {
    const rawQ = search.trim().toLowerCase();
    const cleanQ = removeVietnameseTones(rawQ);

    list = list.filter((p) => {
      const pName = (p.name || "").toLowerCase();
      const pNameClean = removeVietnameseTones(pName);
      const pSlug = (p.slug || "").toLowerCase();
      const pMaterial = (p.material || "").toLowerCase();
      const pMaterialClean = removeVietnameseTones(pMaterial);
      const pTags = (p.tags || "").toLowerCase();
      const pTagsClean = removeVietnameseTones(pTags);

      const subInfo = p._subInfo || getSubCatInfoForProduct(p, catalog);
      const subName = (subInfo?.name || "").toLowerCase();
      const subNameClean = removeVietnameseTones(subName);

      const catName = (p.category?.name || "").toLowerCase();
      const catNameClean = removeVietnameseTones(catName);

      return (
        pName.includes(rawQ) ||
        pNameClean.includes(cleanQ) ||
        pSlug.includes(cleanQ) ||
        pMaterial.includes(rawQ) ||
        pMaterialClean.includes(cleanQ) ||
        pTags.includes(rawQ) ||
        pTagsClean.includes(cleanQ) ||
        subName.includes(rawQ) ||
        subNameClean.includes(cleanQ) ||
        catName.includes(rawQ) ||
        catNameClean.includes(cleanQ)
      );
    });
  }

  if (selectedCat !== "ALL") {
    list = list.filter((p) => {
      if (p.categoryId === selectedCat) return true;
      if (p.category?.slug === selectedCat) return true;
      if (p.categoryIds) {
        try {
          const parsed = JSON.parse(p.categoryIds);
          if (Array.isArray(parsed) && parsed.includes(selectedCat))
            return true;
        } catch {
          const parts = p.categoryIds.split(",").map((s: string) => s.trim());
          if (parts.includes(selectedCat)) return true;
        }
      }
      return false;
    });
  }

  if (selectedSubCat !== "ALL") {
    const selectedSubObj = availableSubcategoriesForFilter.find(
      (s) => s.id === selectedSubCat
    );
    const targetIds = [selectedSubCat, ...(selectedSubObj?.childIds || [])];

    list = list.filter((p) => {
      // 1. Direct subCategoryId match
      if (p.subCategoryId && targetIds.includes(p.subCategoryId)) return true;

      // 2. subCategoryIds match
      if (p.subCategoryIds) {
        try {
          const parsed = JSON.parse(p.subCategoryIds);
          if (
            Array.isArray(parsed) &&
            parsed.some((id: string) => targetIds.includes(id))
          )
            return true;
        } catch {
          for (let i = 0; i < targetIds.length; i++) {
            if (p.subCategoryIds.includes(targetIds[i])) return true;
          }
        }
      }

      // 3. Resolved subcategory info match
      const subInfo = p._subInfo || getSubCatInfoForProduct(p, catalog);
      if (subInfo) {
        if (targetIds.includes(subInfo.id)) return true;
        if (subInfo.parentId && targetIds.includes(subInfo.parentId))
          return true;
      }

      // 4. Keyword match for selected subcategory - only if product has NO explicit conflicting subCategoryId
      if (selectedSubObj && !p.subCategoryId) {
        const pName = (p.name || "").toLowerCase();
        const pNameClean = removeVietnameseTones(pName);
        const kws = (selectedSubObj.keyword || "")
          .split(",")
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean);
        kws.push(selectedSubObj.name.toLowerCase());

        for (const kw of kws) {
          const kwClean = removeVietnameseTones(kw);
          const literalKw = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const literalClean = kwClean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          // If keyword has Vietnamese tones, enforce tone matching so "hổ" does not match "Bác Hồ"
          if (
            /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/.test(
              kw
            )
          ) {
            const regexRaw = new RegExp(
              `(^|[^a-z0-9àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ])${literalKw}([^a-z0-9àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]|$)`,
              "i"
            );
            if (regexRaw.test(pName)) return true;
          } else {
            const regexClean = new RegExp(
              `(^|[^a-z0-9])${literalClean}([^a-z0-9]|$)`,
              "i"
            );
            if (regexClean.test(pNameClean)) return true;
          }
        }
      }

      return false;
    });
  }

  if (stockFilter === "IN_STOCK") {
    list = list.filter((p) => p.inStock);
  } else if (stockFilter === "OUT_OF_STOCK") {
    list = list.filter((p) => !p.inStock);
  }

  if (sortBy === "price-asc") {
    list.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === "price-desc") {
    list.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  } else if (sortBy === "name-desc") {
    list.sort((a, b) => b.name.localeCompare(a.name, "vi"));
  } else {
    list.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
  }

  return list;
}
