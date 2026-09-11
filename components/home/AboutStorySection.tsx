import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { BronzeDivider, BronzeCorner } from "../common/BronzePattern";

export function AboutStorySection() {
  const steps = [
    { step: "01", title: "Tạo Mẫu Đất Sét", desc: "Nghệ nhân tạo dáng tượng và họa tiết tỉ mỉ chuẩn diện mạo." },
    { step: "02", title: "Làm Khuôn Đúc", desc: "Tạo khuôn 2 nửa bằng đất sét chịu nhiệt và bột trấu rơm truyền thống." },
    { step: "03", title: "Nấu & Rót Đồng", desc: "Đồng đỏ nấu chảy ở 1.200°C rồi rót đều tay vào khuôn kín." },
    { step: "04", title: "Chạm Tỉa Hoa Văn", desc: "Đục tỉa từng đường nét, mắt mũi, râu tóc, khảm bạc và vàng lá." },
    { step: "05", title: "Làm Màu & Bảo Vệ", desc: "Hun màu giả cổ hoặc phủ bóng nano bảo vệ vĩnh cửu theo thời gian." },
  ];

  return (
    <section className="py-16 sm:py-20 max-w-container mx-auto px-4 sm:px-6">
      <BronzeDivider
        subtitle="NGHỆ THUẬT LÀNG NGHỀ"
        title="CÂU CHUYỆN ĐÚC ĐỒNG LỘC NAM"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Workshop Image Showcase */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-lg overflow-hidden border-2 border-bronze-gold shadow-2xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTrJEcLUMYnp_Lxlr9s3KdTG6bx57VuzUZ66lOlXUIXiKILkwOYLsRw69Pp8UTunG0tyGwUXNEU_xzCvxuhpmjsMuLj-sOaCiTkKweGCxauPCNisJHmY630D_4LvMKzNLW630h8aY--tMzRo553g5iIYuhuViASuKFhO1zaNTiPeZHi15S4QG2sCTdtuw5TIRWoaUn0w8rnjTyVepo51B2KeeljwQhkLYze4nZHSIbTbuXnzhzPD5VUA"
              alt="Xưởng đúc đồng Lộc Nam Ý Yên Nam Định"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
              <div className="flex items-center gap-2 text-bronze-light text-xs font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-bordeaux" />
                <span>Ý Yên, Nam Định</span>
              </div>
              <h4 className="font-serif font-bold text-lg text-white">
                Xưởng Đúc Thủ Công & Showroom Trưng Bày
              </h4>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-6 -right-6 bg-kem-light border-2 border-bronze-gold p-4 rounded-lg shadow-xl hidden sm:block max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bordeaux text-white flex items-center justify-center font-serif font-bold text-xl shrink-0">
                30+
              </div>
              <div>
                <span className="font-serif font-bold text-sm text-bronze-accent block">Năm Kinh Nghiệm</span>
                <span className="text-xs text-bronze-dark/80">Hàng vạn công trình tâm linh trên khắp cả nước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Story & 5 Steps */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-bronze-dark/90 leading-relaxed">
              Tọa lạc tại cái nôi của làng nghề đúc đồng truyền thống <strong>Vạn Điểm (Ý Yên, Nam Định)</strong>, xưởng đúc đồng <strong>Lộc Nam</strong> tự hào quy tụ những nghệ nhân bậc thầy với hơn 30 năm kinh nghiệm trong nghề.
            </p>
            <p className="text-sm sm:text-base text-bronze-dark/90 leading-relaxed">
              Chúng tôi không sản xuất đại trà theo khuôn mẫu công nghiệp mà kiên định gìn giữ phương pháp đúc thủ công bí truyền, tạo nên những pho tượng có thần thái sống động, những bộ đồ thờ tôn nghiêm và những món quà tặng đối ngoại đẳng cấp.
            </p>
          </div>

          {/* 5-Step Process */}
          <div className="pt-2">
            <h4 className="font-serif font-bold text-base text-bronze-accent uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-bronze-gold" />
              <span>Quy Trình 5 Bước Chế Tác Đúc Đồng Chuẩn Mực</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="bg-white/80 p-3 rounded border border-bronze-gold/30 flex items-start gap-3"
                >
                  <span className="font-serif font-extrabold text-lg text-bordeaux shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h5 className="font-serif font-bold text-xs sm:text-sm text-bronze-accent">
                      {item.title}
                    </h5>
                    <p className="text-xs text-bronze-dark/75 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learn More Link */}
          <div className="pt-4">
            <Link
              href="/ve-chung-toi"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-bordeaux hover:text-bordeaux-hover uppercase tracking-wider hover:underline"
            >
              <span>TÌM HIỂU THÊM VỀ LỊCH SỬ XƯỞNG LỘC NAM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}