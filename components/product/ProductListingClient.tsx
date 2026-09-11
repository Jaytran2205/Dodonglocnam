"use client";

import React, { useState, useMemo } from "react";
import { ProductCard, ProductData } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { PackageOpen } from "lucide-react";

interface ProductListingClientProps {
  initialProducts: ProductData[];
  hotline?: string;
  zalo?: string;
}

export function ProductListingClient({
  initialProducts,
  hotline,
  zalo,
}: ProductListingClientProps) {
  const [material, setMaterial] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter Material
    if (material !== "all") {
      result = result.filter((p) =>
        (p.material || "").toLowerCase().includes(material.toLowerCase())
      );
    }

    // Filter Price
    if (priceRange !== "all") {
      result = result.filter((p) => {
        const price = p.price || 0;
        if (priceRange === "under-10") return price < 10000000;
        if (priceRange === "10-30") return price >= 10000000 && price <= 30000000;
        if (priceRange === "30-50") return price > 30000000 && price <= 50000000;
        if (priceRange === "above-50") return price > 50000000;
        return true;
      });
    }

    // Sort By
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [initialProducts, material, priceRange, sortBy]);

  const handleReset = () => {
    setMaterial("all");
    setPriceRange("all");
    setSortBy("newest");
  };

  return (
    <div>
      {/* Filter Control Bar */}
      <ProductFilters
        selectedMaterial={material}
        onMaterialChange={setMaterial}
        selectedPriceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onReset={handleReset}
      />

      {/* Product Results Count */}
      <div className="mb-6 flex justify-between items-center text-xs text-on-surface-variant font-medium">
        <span>Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm</span>
      </div>

      {/* Grid or Empty */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-surface-container rounded-sm border border-outline-variant p-6 space-y-3">
          <PackageOpen className="w-12 h-12 text-outline mx-auto" />
          <h3 className="font-serif font-bold text-lg text-primary">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Vui lòng thay đổi tiêu chí lọc chất liệu hoặc khoảng giá để xem các sản phẩm khác.
          </p>
          <button
            onClick={handleReset}
            className="mt-3 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-sm hover:bg-tertiary transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} hotline={hotline} zalo={zalo} />
          ))}
        </div>
      )}
    </div>
  );
}