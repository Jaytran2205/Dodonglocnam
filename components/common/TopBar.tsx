import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

interface TopBarProps {
  hotline?: string;
  email?: string;
}

export function TopBar({
  hotline = "0846.699.997",
  email = "dodonglocnam1102@gmail.com",
}: TopBarProps) {
  const cleanPhone = hotline.replace(/\./g, "").replace(/\s/g, "");

  return (
    <div className="w-full bg-[#111111] text-[#f0e5c7] text-[11px] py-1.5 px-4 sm:px-8 border-b border-[#d4af37]/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Hotline & Email */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-1.5 hover:text-[#f1d27c] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#d4af37]" />
            <span>Hotline: <strong className="text-[#f9e7b0] font-serif">{hotline}</strong> - 0846.699.997</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="hidden sm:flex items-center gap-1.5 hover:text-[#f1d27c] transition-colors"
          >
            <Mail className="w-3 h-3 text-[#d4af37]" />
            <span>{email}</span>
          </a>
        </div>

        {/* Right: Showroom & Hours */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#d4af37]" />
            <span>Giờ mở cửa: 08:00 - 21:00 (Tất cả các ngày)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#d4af37]" />
            <span>Làng nghề Ý Yên, Nam Định</span>
          </div>
        </div>
      </div>
    </div>
  );
}
