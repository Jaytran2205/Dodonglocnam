"use client";

import React, { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { BronzeDivider } from "../common/BronzePattern";

export function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: "Bác Trần Hùng",
      role: "Trưởng họ Trần (Hà Đông, Hà Nội)",
      product: "Bộ Ngũ Sự Khảm Tam Khí 65cm",
      rating: 5,
      comment:
        "Gia tộc tôi rất kỹ tính khi chọn đồ thờ cho nhà thờ tổ. Khi nhận bộ ngũ sự của xưởng Lộc Nam, cả họ ai cũng tấm tắc khen. Đường khảm bạc sắc nét, đỉnh đồng dày dặn, tiếng chuông đồng ngân vang. Rất xứng đáng với sự tin tưởng.",
    },
    {
      id: 2,
      name: "Anh Nguyễn Quốc Tuấn",
      role: "Giám Đốc Doanh Nghiệp (Quận 1, TP.HCM)",
      product: "Tượng Quan Công Trảm Rồng 68cm",
      rating: 5,
      comment:
        "Tượng đúc diện mạo uy phong, thần thái sắc sảo đến từng sợi râu, vạt áo. Giao hàng từ Nam Định vào Sài Gòn đóng kiện gỗ cực kỳ cẩn thận, không một vết xước. Phong thủy phòng làm việc từ khi thỉnh tượng rất vượng khí.",
    },
    {
      id: 3,
      name: "Chị Lê Mai Hương",
      role: "Đại Diện Tập Đoàn Bất Động Sản (Đà Nẵng)",
      product: "30 Trống Đồng Đông Sơn Mạ Vàng 24K",
      rating: 5,
      comment:
        "Chúng tôi đặt làm quà tặng ngoại giao cho đối tác Hàn Quốc và Nhật Bản. Từng chiếc trống đồng kèm hộp gỗ nhung sang trọng, giấy chứng nhận vàng 24k đầy đủ. Đối tác nước ngoài rất trân trọng giá trị văn hóa này.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-kem-subtle/50 py-16 sm:py-20 border-t border-bronze-gold/30 relative">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <BronzeDivider
          subtitle="Ý KIẾN KHÁCH HÀNG"
          title="SỰ HÀI LÒNG CỦA KHÁCH HÀNG LÀ TÀI SẢN LỚN NHẤT"
        />

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {reviews.map((rev, index) => (
            <div
              key={rev.id}
              className={`relative bg-white p-6 sm:p-8 rounded-lg border-2 border-bronze-gold/30 hover:border-bronze-gold transition-all duration-300 hover-lift flex flex-col justify-between shadow-sm ${
                index === activeIndex ? "ring-2 ring-bordeaux/20" : ""
              }`}
            >
              <div className="absolute top-4 right-4 text-bronze-gold/30">
                <Quote className="w-8 h-8" />
              </div>

              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-bronze-dark/90 leading-relaxed italic mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author & Product */}
              <div className="border-t border-bronze-gold/20 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bordeaux/10 border border-bordeaux text-bordeaux font-serif font-bold text-sm flex items-center justify-center">
                    {rev.name.charAt(rev.name.lastIndexOf(" ") + 1)}
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-sm text-bronze-accent">
                      {rev.name}
                    </h5>
                    <span className="text-[11px] text-bronze-dark/70 block">
                      {rev.role}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã mua: <strong>{rev.product}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}