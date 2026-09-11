import React from "react";
import { ShieldCheck, Award, Handshake, Truck } from "lucide-react";

export function ServiceBar() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "CHẾ TÁC TRỰC TIẾP",
      desc: "Tại xưởng, không qua trung gian",
    },
    {
      icon: Award,
      title: "CHẤT LƯỢNG BỀN ĐẸP",
      desc: "Đồng chuẩn, kỹ thuật tinh xảo",
    },
    {
      icon: Handshake,
      title: "GIÁ TRỊ TRUYỀN ĐỜI",
      desc: "Gìn giữ văn hóa, kết nối tâm linh",
    },
    {
      icon: Truck,
      title: "GIAO HÀNG TOÀN QUỐC",
      desc: "Đóng gói cẩn thận, bảo hiểm đầy đủ",
    },
  ];

  return (
    <section className="w-full bg-[#FAF6ED] border-y border-[#E5DAC3] py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {pillars.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-2"
            >
              <div className="w-12 h-12 rounded-sm border border-[#8B6B38]/40 bg-[#F4EDE0] flex items-center justify-center shrink-0 shadow-sm">
                <IconComponent className="w-6 h-6 text-[#8B6B38]" strokeWidth={1.75} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1a1a1a] tracking-wider uppercase">
                  {item.title}
                </h4>
                <p className="text-xs text-[#6B5342]">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}