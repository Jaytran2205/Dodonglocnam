import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeaderGold } from "../common/BronzePattern";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface FeaturedCategoriesProps {
  categories: CategoryItem[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  // Mockup cards info
  const cardData = [
    {
      title: "TƯỢNG ĐỒNG",
      subtitle: "Tượng danh nhân, tượng Phật, tượng phong thủy",
      slug: "tuong-dong",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzmklt7eRBjBIdojXLEHR-1b2XoOaDKROCA4XpnIBpWxY3MSRPgdTFpsi83lOToiaT7oMcPQqKHNj0MeEmeZZ_INNTGojHZodJj5DloUcr21QXfkwnHeW4zpqWTm5IxsMyxLkvpHqmot8UE-ajenviwqGcqjAl2OvSuZz9Yx7QdxFMbs4s3rMSwABtm0gDhQahExCIGaSC1xQwxwQDnUdwjWOHiP11vewTYgJmPbYf-TH0r5-RYSaauQ",
    },
    {
      title: "ĐỒ THỜ CÚNG",
      subtitle: "Bộ ngũ sự, đỉnh đồng, đồ thờ truyền thống",
      slug: "do-tho-cung",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs0uIhuTl2qCxpyWrK_BKdgxWCbsWNI3-hgjzFAexflOsizAOnAuuz2EsfqX7eWCKcAyUknxYq0fDJsyfnxbQy0kh02-PkUC91A0_qHjLeOS0eoK-RQq1ybhx2z4Sq9nRpJ7gshFObztiWgg7dHKaUg2wxUKtgVyRgteow1CHmM3m9_km1BODx5nDzkzY0ou6aep7r6wUs73wOg8ZexjOdw4mzdTCgMPG05qgBZy06a4zGMrLrcQnDUw",
    },
    {
      title: "QUÀ TẶNG ĐỒNG",
      subtitle: "Quà tặng cao cấp, quà biếu, vật phẩm lưu niệm",
      slug: "qua-tang-dong",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKmcNZM8kn9EljJ6mQONNGUOKgz87B9SVp8Rdxxe-meTs-zlCaTD7SvgeEj-2hzs6TwB1OnI9DRHBHL7cQcgfMNkpUw4SKJYJlP7ClqungUbAhlbLPnqEUuOwQ16Dyi07trssAQsBdTiU76egiE6dhF3F8jl7Wiy8q1Ka2bMOG7WrAhsuuyW4neH2JSc1Gm7hZqyecT31LNu1SDjBSbdwUy4n6JcL6hrP7j_1rwk7XP7lWdbHfmS0IRw",
    },
  ];

  return (
    <section className="py-12 sm:py-16 max-w-container mx-auto px-4 sm:px-8 relative">
      {/* Golden Section Header */}
      <SectionHeaderGold title="SẢN PHẨM NỔI BẬT" />

      {/* 3 Featured Horizontal/Square Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {cardData.map((item, idx) => (
          <Link
            key={idx}
            href={`/san-pham/${item.slug}`}
            className="group relative bg-[#F7F0E1] border border-[#D6B86C]/70 rounded-lg p-5 sm:p-6 hover-lift transition-all duration-300 shadow-card flex flex-col justify-between overflow-hidden"
          >
            {/* Top Text & Arrow */}
            <div className="space-y-2 relative z-10">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-bronze-deep uppercase tracking-wider group-hover:text-gold-dark transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-bronze-muted max-w-[200px] leading-relaxed">
                {item.subtitle}
              </p>
              
              <div className="pt-2">
                <span className="w-8 h-8 rounded-full bg-gold/20 group-hover:bg-gold text-bronze-deep group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Product Image on Right / Bottom */}
            <div className="relative aspect-[4/3] w-full rounded overflow-hidden mt-4 bg-[#EDE3D0]/60 border border-gold-border/30">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}