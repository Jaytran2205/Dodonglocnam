import React from "react";
import { Award, Sparkles, Truck, ShieldCheck } from "lucide-react";

export function ModernFeatures() {
  const features = [
    {
      icon: Award,
      title: "CHẤT LƯỢNG CAO CẤP",
      description: "Chế tác tinh xảo, bền đẹp vượt thời gian",
    },
    {
      icon: Sparkles,
      title: "THIẾT KẾ ĐỘC QUYỀN",
      description: "Mẫu mã độc quyền, không đụng hàng",
    },
    {
      icon: Truck,
      title: "GIAO HÀNG TOÀN QUỐC",
      description: "Miễn phí vận chuyển đơn từ 2 triệu",
    },
    {
      icon: ShieldCheck,
      title: "BẢO HÀNH TRỌN ĐỜI",
      description: "Bảo hành chất lượng trọn đời sản phẩm",
    },
  ];

  return (
    <section className="bg-[#0b1622] py-8 sm:py-10 px-4 sm:px-8 border-y border-[#1c2c3d]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-4 group"
            >
              {/* Gold Ring Icon Container */}
              <div className="w-12 h-12 rounded-full border border-[#c59b4e]/50 flex items-center justify-center flex-shrink-0 bg-[#122234] group-hover:border-[#c59b4e] group-hover:scale-105 transition-all shadow-inner">
                <Icon className="w-5 h-5 text-[#d4af37]" />
              </div>

              {/* Text */}
              <div className="space-y-0.5">
                <h3 className="text-[#f1f5f9] font-serif font-bold text-xs sm:text-[13px] tracking-wider uppercase">
                  {feature.title}
                </h3>
                <p className="text-[#94a3b8] text-[11px] sm:text-xs leading-tight font-light">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
