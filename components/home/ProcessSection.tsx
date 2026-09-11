import React from "react";
import { Hammer, Flame, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Tạo Mẫu Đất Sét",
      desc: "Nghệ nhân Dương Bá Tiến trực tiếp đắp mẫu đất sét, tạo hình chi tiết và chỉnh sửa diện mạo chuẩn xác theo nhân tướng học.",
    },
    {
      step: "02",
      title: "Làm Khuôn Chịu Nhiệt",
      desc: "Sử dụng đất sét mịn pha trấu và giấy bản, tạo khuôn âm bản và dương bản, sấy khô trong lò nung đạt độ cứng tiêu chuẩn.",
    },
    {
      step: "03",
      title: "Nấu & Rót Đồng 1.200°C",
      desc: "Hợp kim đồng đỏ thanh khiết được nấu chảy lỏng đều, rót đồng liền khối vào khuôn với kỹ thuật kiểm soát dòng chảy tuyệt đối.",
    },
    {
      step: "04",
      title: "Sửa Nguội & Chạm Tỉa",
      desc: "Dỡ khuôn, làm sạch bề mặt, nghệ nhân dùng ve búa đục tỉa tỉ mỉ từng sợi lông, đường chỉ và hoa văn hoa sen, rồng phượng.",
    },
    {
      step: "05",
      title: "Khảm Kim Khí & Dát Vàng",
      desc: "Chạm khảm 5 kim khí (Vàng 9999, Bạc, Đồng đỏ, Đồng vàng, Đồng đen) hoặc dát vàng 24K, phủ lớp bảo vệ chống oxy hóa trọn đời.",
    },
  ];

  return (
    <section className="w-full bg-[#F4EDE0] py-12 lg:py-16 px-4 sm:px-8 border-t border-b border-[#E5DAC3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-[#8B6B38] text-xs uppercase tracking-wider font-semibold">
            <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
            <span>Tinh Hoa Làng Nghề Ý Yên</span>
            <span className="w-8 h-[1px] bg-[#8B6B38]"></span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] tracking-wide uppercase">
            QUY TRÌNH ĐÚC ĐỒNG THỦ CÔNG 5 BƯỚC
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5342] max-w-2xl mx-auto leading-relaxed">
            Mỗi tác phẩm tại Đồ Đồng Lộc Nam là sự kết tinh của kỹ thuật luyện kim cổ truyền và bàn tay tài hoa của nghệ nhân.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF6ED] border border-[#E5DAC3] rounded-sm p-5 flex flex-col justify-between relative shadow-sm hover:border-[#7B1E2B] transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                <div className="font-serif font-bold text-2xl sm:text-3xl text-[#8B6B38] mb-2 group-hover:text-[#7B1E2B] transition-colors">
                  {item.step}
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#3A2418] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B5342] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5DAC3]/50 mt-4 flex items-center gap-1 text-[11px] font-semibold text-[#8B6B38]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Nghiệm thu chuẩn xưởng</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-10 bg-[#3A2418] text-white p-6 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-4 text-left">
            <ShieldCheck className="w-10 h-10 text-[#C5A876] shrink-0" />
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                CAM KẾT 100% ĐỒNG THANH KHIẾT – BẢO HÀNH TRỌN ĐỜI
              </h4>
              <p className="text-xs text-[#E6D5C3]">
                Khách hàng được trực tiếp về thăm xưởng, theo dõi mẻ nấu đồng và kiểm tra sản phẩm trước khi thanh toán.
              </p>
            </div>
          </div>

          <Link
            href="/lien-he"
            className="px-6 py-2.5 bg-[#7B1E2B] hover:bg-[#611722] text-white text-xs font-bold uppercase tracking-wider rounded-sm shrink-0 flex items-center gap-2 shadow-sm transition-transform hover:scale-105"
          >
            <span>ĐẶT LỊCH THĂM XƯỞNG</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
