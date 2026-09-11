import React from "react";
import Link from "next/link";
import { Flame, Crown, Gift, Bell, Image as ImageIcon, Sparkles } from "lucide-react";

export function CategoryIconsBar() {
  const items = [
    {
      name: "Đồ Thờ Bằng Đồng",
      href: "/san-pham/do-tho-cung",
      icon: <Flame className="w-6 h-6 text-[#FFD700]" />,
      desc: "Bộ ngũ sự, đỉnh đồng",
    },
    {
      name: "Tượng Đồng Danh Nhân",
      href: "/san-pham/tuong-dong",
      icon: <Crown className="w-6 h-6 text-[#FFD700]" />,
      desc: "Quan Công, Bác Hồ, Phật",
    },
    {
      name: "Tranh Đồng Mạ Vàng",
      href: "/san-pham/tranh-dong",
      icon: <ImageIcon className="w-6 h-6 text-[#FFD700]" />,
      desc: "Mạ vàng 24k cao cấp",
    },
    {
      name: "Trống Đồng Đông Sơn",
      href: "/san-pham/trong-dong",
      icon: <Sparkles className="w-6 h-6 text-[#FFD700]" />,
      desc: "Quà tặng lưu niệm",
    },
    {
      name: "Đúc Chuông Tận Nơi",
      href: "/san-pham/duc-chuong-cong-trinh",
      icon: <Bell className="w-6 h-6 text-[#FFD700]" />,
      desc: "Đại Hồng Chung đình chùa",
    },
    {
      name: "Quà Tặng Đối Ngoại",
      href: "/san-pham/qua-tang-dong",
      icon: <Gift className="w-6 h-6 text-[#FFD700]" />,
      desc: "Sang trọng, đẳng cấp",
    },
  ];

  return (
    <section className="bg-[#2A1408] border-b-2 border-[#D6B86C]/40 py-6 px-4">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center text-center p-3 rounded-lg bg-[#1a1a2e]/80 hover:bg-[#2a2a3e] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 hover-lift group"
            >
              <div className="w-12 h-12 rounded-full bg-[#2A1408] group-hover:bg-[#3D1F0D] border border-[#FFD700]/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="font-serif font-bold text-xs text-white group-hover:text-[#FFD700] uppercase tracking-wide block">
                {item.name}
              </span>
              <span className="text-[10px] text-[#EBD18D] mt-0.5 block">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}