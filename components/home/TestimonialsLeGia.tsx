import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export function TestimonialsLeGia() {
  const reviews = [
    {
      name: "Thượng Tọa Thích Minh Tâm",
      role: "Trụ trì Chùa Phúc Lâm (Bắc Ninh)",
      content: "Đại Hồng Chung 2.5 tấn do xưởng Lộc Nam nấu đúc trực tiếp tại chùa có âm thanh rất trầm ấm, ngân vang xa hàng chục dặm. Hoa văn chạm khắc kinh Phật vô cùng tinh xảo.",
      rating: 5,
    },
    {
      name: "Ông Nguyễn Văn Hùng",
      role: "Chủ tịch Tập đoàn Bất Động Sản (Hà Nội)",
      content: "Bộ đỉnh đồng thất lân khảm ngũ sắc 70cm đặt tại bàn thờ gia tiên họ Nguyễn bề thế và uy nghiêm. Nét chạm rồng phượng sống động, từng chi tiết dát vàng sắc nét.",
      rating: 5,
    },
    {
      name: "Bà Trần Thu Trang",
      role: "Giám đốc Đối ngoại Doanh nghiệp (TP.HCM)",
      content: "Chúng tôi đặt 100 quả trống đồng Đông Sơn mạ vàng 24K làm quà biếu đối tác quốc tế. Hộp gỗ nhung và chứng thư vàng rất trang trọng, đối tác đánh giá rất cao.",
      rating: 5,
    },
  ];

  return (
    <section className="w-full bg-[#FAF6ED] py-12 lg:py-16 px-4 sm:px-8 border-b border-[#E5DAC3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-[#8B6B38] text-xs uppercase tracking-wider font-semibold">
            <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
            <span>Khách Hàng Nói Về Chúng Tôi</span>
            <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] uppercase tracking-wide">
            Ý KIẾN & ĐÁNH GIÁ THỰC TẾ
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5342] max-w-xl mx-auto">
            Sự hài lòng và tin cậy của quý khách hàng là tài sản quý báu nhất của Đúc Đồng Lộc Nam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F4EDE0] border border-[#E5DAC3] rounded-sm p-6 flex flex-col justify-between shadow-sm relative group hover:border-[#8B6B38] transition-colors"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A876] text-[#C5A876]" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-[#8B6B38]/30 mb-2" />

                <p className="text-xs sm:text-sm text-[#5C4535] leading-relaxed italic mb-4">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5DAC3]/60 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#3A2418]">
                    {item.name}
                  </h4>
                  <span className="text-[11px] text-[#8B6B38] font-medium block">
                    {item.role}
                  </span>
                </div>

                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
