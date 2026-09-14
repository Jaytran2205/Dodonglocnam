"use client";

import React from "react";
import {
  Star,
  Quote,
  CheckCircle2,
  MessageSquareHeart,
  MapPin,
  Sparkles,
} from "lucide-react";

export function LocNamBrandEssence() {
  const defaultReviews = [
    {
      id: 1,
      name: "Bác Nguyễn Văn Thành",
      title: "Trưởng ban khánh tiết họ Nguyễn",
      location: "Ý Yên, Nam Định",
      avatar: "VT",
      rating: 5,
      date: "15/08/2026",
      product: "Bộ Đỉnh Đồng Ngũ Sự Cát Tút 70cm",
      image: "/images/locnam_real/locnam_bo_do_tho.jpg",
      tag: "ĐỒ THỜ GIA TIÊN",
      comment:
        "Đặt bộ ngũ sự thờ gia tiên cho nhà thờ họ, cả họ đều tấm tắc khen ngợi. Nước đồng vàng bóng đều, đúc dày dặn và chắc nịch, hoa văn rồng chạm tay sắc sảo. Giao hàng tận nơi đóng kiện gỗ rất cẩn thận.",
    },
    {
      id: 2,
      name: "Chị Lê Hoàng Mai",
      title: "Giám đốc nhân sự Tech Group",
      location: "Thanh Xuân, Hà Nội",
      avatar: "HM",
      rating: 5,
      date: "08/08/2026",
      product: "Mô hình thuyền buồm mạ vàng 24k",
      image: "/images/hero_golden_ship.jpg",
      tag: "QUÀ TẶNG PHONG THỦY",
      comment:
        "Công ty mình đặt 10 mô hình thuyền buồm mạ vàng làm quà tri ân khách hàng VIP dịp kỷ niệm thành lập. Hộp quà bọc nhung đỏ sang trọng, có chứng nhận mạ vàng 24k rõ ràng. Khách hàng nhận ai cũng ưng ý.",
    },
    {
      id: 3,
      name: "Anh Vũ Đình Khoa",
      title: "Chủ chuỗi nhà hàng ẩm thực",
      location: "Quận 1, TP. Hồ Chí Minh",
      avatar: "VK",
      rating: 5,
      date: "29/07/2026",
      product: "Tượng phong thủy mạ vàng 24k",
      image: "/images/du_an/tuong-than-tai-da-nang.jpg",
      tag: "TƯỢNG PHONG THỦY",
      comment:
        "Tượng đúc rất thần thái, từng nét chạm khắc uy dũng, mạ vàng 24k sáng bóng và mịn màng không một tì vết. Dịch vụ tư vấn của xưởng Lộc Nam rất nhiệt tình, hỗ trợ chuyển phát nhanh an toàn vào Sài Gòn.",
    },
    {
      id: 4,
      name: "Bác Phạm Minh Trí",
      title: "Cựu chiến binh - Cán bộ hưu trí",
      location: "Cầu Giấy, Hà Nội",
      avatar: "MT",
      rating: 5,
      date: "18/07/2026",
      product: "Tranh đồng Vinh Quy Bái Tổ dát vàng",
      image: "/images/locnam_real/locnam_tranh_vinh_quy.jpg",
      tag: "TRANH ĐỒNG DÁT VÀNG",
      comment:
        "Bức tranh đồng dát vàng 24k treo phòng khách rất sáng và ấm cúng. Nghệ nhân lành nghề làm tỉ mỉ từng mái đình, cây đa, đoàn rước kiệu. Rất xứng đáng là thương hiệu gia truyền số 1 làng nghề Ý Yên.",
    },
    {
      id: 5,
      name: "Anh Trần Quốc Bảo",
      title: "Tổng Giám Đốc Công Ty BĐS",
      location: "Hải Châu, Đà Nẵng",
      avatar: "QB",
      rating: 5,
      date: "05/07/2026",
      product: "Trống đồng Đông Sơn mạ vàng 1m",
      image: "/images/du_an/150-trong-dong-tong-cong-ty-dong-bac.jpg",
      tag: "TRỐNG ĐỒNG ĐÔNG SƠN",
      comment:
        "Trống đồng đặt tại sảnh công ty tạo điểm nhấn văn hóa cực kỳ uy nghiêm và trang trọng. Khách đối tác quốc tế ghé thăm đều khen ngợi tinh hoa chế tác của người Việt. Rất hài lòng!",
    },
    {
      id: 6,
      name: "Đại Đức Thích Tâm Minh",
      title: "Trụ Trì Chùa Phúc Lâm",
      location: "Gia Viễn, Ninh Bình",
      avatar: "TM",
      rating: 5,
      date: "22/06/2026",
      product: "Đúc Đại Hồng Chung 1.2 Tấn & Tượng Phật",
      image: "/images/du_an/dai-hong-chung-thai-nguyen.jpg",
      tag: "ĐÚC CHUÔNG CÔNG TRÌNH",
      comment:
        "Tiếng chuông ngân vang thanh thoát, âm thanh trầm ấm lan toả khắp làng quê. Quy trình nấu đồng rót khuôn của nghệ nhân Lộc Nam rất trang nghiêm, bài bản và chu đáo.",
    },
    {
      id: 7,
      name: "Anh Bùi Hoàng Long",
      title: "Chủ tịch HĐQT Tập đoàn Xây dựng",
      location: "Starlake Tây Hồ, Hà Nội",
      avatar: "HL",
      rating: 5,
      date: "12/06/2026",
      product: "Đỉnh Đồng Thất Lân Vờn Cầu Khảm Tam Khí",
      image: "/images/locnam_real/locnam_dinh_dong.jpg",
      tag: "ĐỈNH ĐỒNG CAO CẤP",
      comment:
        "Đỉnh đồng phong thủy cao 1m35 khảm vàng 9999, bạc trắng và đồng đỏ tam khí tinh hoa bậc nhất. Đặt vào phòng khách biệt thự toát lên đẳng cấp vương giả và phong thủy cực tốt!",
    },
    {
      id: 8,
      name: "Chị Đỗ Thu Trang",
      title: "Việt kiều Đức đặt hàng gia tiên",
      location: "Berlin, CHLB Đức",
      avatar: "TT",
      rating: 5,
      date: "01/06/2026",
      product: "Đôi Hạc Thờ Bằng Đồng Đỏ Cỡ Lớn",
      image: "/images/locnam_real/locnam_hac_tho.jpg",
      tag: "ĐỒ THỜ PHONG THỦY",
      comment:
        "Dù ở nước ngoài nhưng mình rất yên tâm khi đặt hàng của xưởng Lộc Nam. Nghệ nhân quay video đúc tượng và đóng thùng xốp gỗ chuyên nghiệp gửi sang Đức an toàn nguyên vẹn 100%.",
    },
  ];

  const [reviews, setReviews] = React.useState(defaultReviews);

  React.useEffect(() => {
    fetch("/api/admin/landing-page")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          setReviews(
            defaultReviews.map((item, idx) => {
              const prefix = `rev${idx + 1}_`;
              return {
                ...item,
                name: s[`${prefix}name`] || item.name,
                title: s[`${prefix}title`] || item.title,
                location: s[`${prefix}location`] || item.location,
                product: s[`${prefix}product`] || item.product,
                tag: s[`${prefix}tag`] || item.tag,
                image: s[`${prefix}image`] || item.image,
                comment: s[`${prefix}comment`] || item.comment,
              };
            })
          );
        }
      })
      .catch((e) => console.error("Error loading reviews:", e));
  }, []);

  // Duplicate for seamless 100% infinite marquee loop
  const loopReviews = [...reviews, ...reviews];

  return (
    <section id="du-an-thuc-te" className="bg-[#060e17] py-14 sm:py-18 border-t border-b border-[#1c2c3d] relative overflow-hidden text-[#cbd5e1] scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-[#dfb755] font-serif text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>ĐÁNH GIÁ CỦA KHÁCH HÀNG VỀ SẢN PHẨM THỰC TẾ</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-wide leading-tight">
              ĐÁNH GIÁ CỦA KHÁCH HÀNG & SẢN PHẨM THỰC TẾ
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-light max-w-2xl leading-relaxed">
              Hình ảnh sản phẩm thực tế đã bàn giao kèm đánh giá chân thực từ khách hàng trên toàn quốc – Tự động chuyển động liên tục, rê chuột để dừng lại.
            </p>
          </div>

          {/* Trust Rating Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#142337] border border-[#dfb755]/40 text-xs shadow-md self-start md:self-auto">
            <div className="flex text-[#ffd700]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-white">4.9 / 5.0</span>
            <span className="text-[#94a3b8] text-[11px]">(2,450+ Đánh giá)</span>
          </div>
        </div>

        {/* Infinite Loop Marquee Container */}
        <div className="relative w-full overflow-hidden py-2">
          <div className="animate-marquee-loop gap-5 sm:gap-6 flex items-stretch">
            {loopReviews.map((rev, idx) => (
              <div
                key={`${rev.id}-${idx}`}
                className="w-[320px] sm:w-[350px] lg:w-[370px] flex-shrink-0 rounded-2xl bg-[#fdfbf7] border-2 border-[#d4af37]/70 hover:border-[#b8860b] shadow-[0_12px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_40px_rgba(212,175,55,0.35)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Real Product Photo with Tag */}
                  <div className="aspect-[16/10] overflow-hidden bg-[#0c1825] relative border-b border-[#e8dfd1]">
                    <img
                      src={rev.image}
                      alt={rev.product}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Tag badge on image */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#08121e] shadow-md uppercase">
                      {rev.tag}
                    </span>

                    {/* 5 Stars overlay badge on image */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-md bg-[#08121e]/90 backdrop-blur-sm border border-[#dfb755]/50 flex text-[#ffd700]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="p-4 sm:p-4.5 space-y-2.5 text-left">
                    {/* Reviewer Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#dfb755] via-[#f5db8b] to-[#b8860b] text-[#08121e] font-serif font-black text-xs flex items-center justify-center shadow-md flex-shrink-0 border border-white">
                          {rev.avatar}
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm sm:text-base text-[#0c1825] group-hover:text-[#b8860b] transition-colors line-clamp-1">
                            {rev.name}
                          </div>
                          <div className="text-[11px] text-[#556477] font-medium line-clamp-1">
                            {rev.title}
                          </div>
                        </div>
                      </div>

                      <Quote className="w-5 h-5 text-[#b8860b]/30 flex-shrink-0" />
                    </div>

                    {/* Product & Location Badge */}
                    <div className="p-2.5 rounded-xl bg-[#f5ebd7] border border-[#dfb755]/50 space-y-0.5">
                      <div className="text-[11px] sm:text-xs font-bold text-[#8c6014] line-clamp-1">
                        ✓ Sản phẩm: {rev.product}
                      </div>
                      <div className="text-[10px] text-[#6b7280] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#b8860b]" />
                        <span>{rev.location}</span>
                      </div>
                    </div>

                    {/* Customer Review Quote */}
                    <p className="text-xs text-[#2d3748] font-normal leading-relaxed italic line-clamp-3">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Footer Verified Badge */}
                <div className="p-3 bg-[#f3ede1] border-t border-[#e8dfd1] flex items-center justify-between text-[10px] font-bold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã bàn giao & nghiệm thu</span>
                  </span>
                  <span className="text-[#718096] font-medium">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
