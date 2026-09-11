import React from "react";
import { ShieldCheck, Award, Handshake, Truck } from "lucide-react";

export function UspSection() {
  const usps = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-gold-dark shrink-0" />,
      title: "CHẾ TÁC TRỰC TIẾP",
      desc: "Tại xưởng, không qua trung gian",
    },
    {
      icon: <Award className="w-7 h-7 text-gold-dark shrink-0" />,
      title: "CHẤT LƯỢNG BỀN ĐẸP",
      desc: "Đồng chuẩn, kỹ thuật tinh xảo",
    },
    {
      icon: <Handshake className="w-7 h-7 text-gold-dark shrink-0" />,
      title: "GIÁ TRỊ TRUYỀN ĐỜI",
      desc: "Gìn giữ văn hóa, kết nối tâm linh",
    },
    {
      icon: <Truck className="w-7 h-7 text-gold-dark shrink-0" />,
      title: "GIAO HÀNG TOÀN QUỐC",
      desc: "Đóng gói cẩn thận, bảo hiểm đầy đủ",
    },
  ];

  return (
    <section className="bg-[#FAF4E8] border-y border-[#D6B86C]/50 py-8 relative">
      <div className="max-w-container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#D6B86C]/40">
          {usps.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 px-4 sm:px-6 py-2"
            >
              <div className="p-2 rounded-md bg-[#F4ECDA] border border-gold-border/40">
                {item.icon}
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs sm:text-[13px] text-bronze-deep tracking-wider uppercase">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-bronze-muted mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}