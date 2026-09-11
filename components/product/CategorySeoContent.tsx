"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";
import { FaqJsonLd } from "@/components/seo/JsonLd";

interface CategorySeoContentProps {
  categorySlug: string;
}

interface SeoArticle {
  title: string;
  subTitle: string;
  intro: string;
  sections: {
    heading: string;
    content: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

const categorySeoData: Record<string, SeoArticle> = {
  "do-tho-cung": {
    title: "ĐỒ THỜ CÚNG BẰNG ĐỒNG NAM ĐỊNH – ĐỈNH CAO LINH THIÊNG VÀ TRANG TRỌNG GIA TIÊN",
    subTitle: "Nghệ thuật đúc đồng truyền thống Ý Yên – Nam Định gìn giữ linh khí gia tộc",
    intro:
      "Trong không gian tâm linh của mỗi gia đình Việt Nam, bàn thờ gia tiên là nơi tôn nghiêm thể hiện lòng hiếu kính và đạo lý 'Uống nước nhớ nguồn'. Đồ thờ cúng bằng đồng đúc thủ công từ làng nghề Ý Yên – Nam Định của thương hiệu Đồ Đồng Lộc Nam là sự kết hợp hoàn hảo giữa kim loại đồng thanh khiết, ngọn lửa luyện kim ngàn năm và hoa văn tâm linh thuần Việt.",
    sections: [
      {
        heading: "1. Tại sao nên chọn đồ thờ cúng bằng đồng Lộc Nam?",
        content: [
          "Chất liệu phôi đồng thanh khiết 100%: Sử dụng đồng đỏ, đồng catut và đồng vàng nguyên chất không pha chì tạp chất, tạo độ dày dặn và độ bền vĩnh cửu hàng trăm năm.",
          "Chế tác thủ công đúc liền khối: Từng chiếc đỉnh đồng, lư hương, đôi hạc ngự long quy được nghệ nhân đúc nguyên khối, chạm trổ tay sắc nét từng chi tiết lông vũ, vảy rồng.",
          "Màu sắc phong phú, sang trọng: Hun màu giả cổ trang nghiêm, khảm tam khí (Bạc, Đồng đỏ, Đồng vàng), khảm ngũ sắc (Vàng 9999, Bạc, Đồng đen, Đồng xanh) hoặc mạ vàng 24k đỉnh cao.",
        ],
      },
      {
        heading: "2. Ý nghĩa phong thủy của bộ đỉnh đồng Tam Sự - Ngũ Sự",
        content: [
          "Đỉnh đồng thờ cúng: Nắp đỉnh có tượng con Nghê phong thủy mang sức mạnh trấn trạch, xua đuổi tà khí, bảo vệ sự bình an cho gia đạo. Bụng đỉnh dùng đốt trầm hương tạo không gian thanh tịnh.",
          "Đôi hạc thờ đứng trên lưng rùa: Biểu trưng cho sự trường thọ, gắn kết giữa trời và đất (thanh cao và bền vững), tượng trưng cho sự gắn bó keo sơn và hòa thuận trong gia đình.",
          "Đôi chân nến đồng: Tượng trưng cho mặt trăng (Âm) và mặt trời (Dương), giữ cho sinh khí bàn thờ luôn hài hòa, soi rọi trí tuệ và phúc đức cho con cháu.",
        ],
      },
      {
        heading: "3. Hướng dẫn chọn kích thước bộ đồ thờ theo thước Lỗ Ban",
        content: [
          "Bàn thờ kích thước 1m27 đến 1m55: Phù hợp với bộ đỉnh đồng cao 45cm hoặc 50cm (bộ tam sự hoặc ngũ sự nhỏ).",
          "Bàn thờ kích thước 1m75 đến 1m97: Phù hợp với bộ ngũ sự đỉnh đồng cao 60cm hoặc 65cm (kích thước phổ biến nhất cho gia đình).",
          "Bàn thờ kích thước trên 2m17 (từ đường, nhà thờ họ, đình chùa): Phù hợp với bộ đỉnh đồng cỡ đại cao 70cm trở lên.",
        ],
      },
    ],
    faqs: [
      {
        question: "Đồ thờ bằng đồng của Lộc Nam có bị xỉn màu hay oxy hóa theo thời gian không?",
        answer:
          "Sản phẩm đồ thờ cúng Lộc Nam được xử lý bề mặt kỹ lưỡng bằng lớp bảo vệ bóng Nano chuyên dụng hoặc mạ vàng 24k/khảm tam khí ngũ sắc. Đồ Đồng Lộc Nam cam kết bảo hành trọn đời về chất lượng phôi đồng, không hoen gỉ, bong tróc.",
      },
      {
        question: "Một bộ đồ thờ cúng gia tiên đầy đủ gồm những món gì?",
        answer:
          "Bộ cơ bản là Bộ Tam Sự (1 đỉnh đồng + 2 chân nến hoặc 2 hạc) hoặc Bộ Ngũ Sự (1 đỉnh + 2 hạc + 2 nến). Ngoài ra gia chủ có thể bổ sung: Bát hương đồng, mâm bồng, ngai chén thờ, lọ hoa, ống hương, đèn thờ và hoành phi câu đối.",
      },
      {
        question: "Xưởng Đồ Đồng Lộc Nam có hỗ trợ vận chuyển và lắp đặt tận nơi không?",
        answer:
          "Đồ Đồng Lộc Nam hỗ trợ giao hàng toàn quốc, quý khách được mở thùng kiểm tra hàng đúng mẫu mã, cân nặng và chất lượng trước khi thanh toán. Tại Hà Nội và Nam Định có kỹ thuật viên hỗ trợ sắp xếp bàn thờ chuẩn phong thủy.",
      },
    ],
  },
  "tuong-dong": {
    title: "TƯỢNG ĐỒNG PHONG THỦY, TƯỢNG DANH NHÂN & ĐÚC TƯỢNG CHÂN DUNG TRUYỀN THẦN",
    subTitle: "Nét chạm khắc có hồn – Đỉnh cao tay nghề nghệ nhân Lộc Nam",
    intro:
      "Tượng đồng không chỉ là một tác phẩm nghệ thuật điêu khắc kim loại đỉnh cao mà còn là vật phẩm phong thủy mang năng lượng trấn trạch, chiêu tài và kích hoạt vượng khí mạnh mẽ. Tại xưởng Đồ Đồng Lộc Nam, các nghệ nhân chuyên chế tác các dòng tượng đồng cao cấp: tượng Phật, tượng Bác Hồ, tượng Trần Hưng Đạo, tượng Quan Công, tượng linh vật 12 con giáp và dịch vụ đúc tượng chân dung truyền thần theo yêu cầu.",
    sections: [
      {
        heading: "1. Đúc tượng đồng chân dung truyền thần – Giống ảnh tới 99.9%",
        content: [
          "Đắp mẫu đất sét tỉ mỉ: Khách hàng được trực tiếp duyệt mẫu đất sét hoặc qua video call nhiều góc độ trước khi chuyển sang làm khuôn đúc.",
          "Chạm khắc biểu cảm tinh tế: Từng nếp nhăn đuôi mắt, ánh nhìn, nụ cười hiền hậu của ông bà, cha mẹ hay các vị lãnh đạo đều được nghệ nhân khắc họa chân thực và sống động.",
          "Lưu giữ ngàn năm: Đúc bằng đồng đỏ thanh khiết nguyên khối, phủ vàng 24k hoặc tạo màu cổ kính bền vững qua nhiều thế hệ.",
        ],
      },
      {
        heading: "2. Các dòng tượng đồng phong thủy được ưa chuộng nhất",
        content: [
          "Tượng Trần Quốc Tuấn (Hưng Đạo Đại Vương): Tượng trưng cho ý chí kiên định, bản lĩnh lãnh đạo, trấn áp tà khí và bảo vệ gia trạch.",
          "Tượng Quan Vân Trường (Quan Công): Vị thần hộ mệnh trừ tà, mang lại sự công minh, chính trực và chống tiểu nhân quấy phá cho gia chủ làm kinh doanh, quan chức.",
          "Tượng Phật Thích Ca, Quan Thế Âm Bồ Tát, Phật Di Lặc: Mang lại sự an lạc, thanh tịnh trong tâm hồn, gia đạo êm ấm và may mắn.",
          "Tượng Linh Vật Phong Thủy (Cóc Thiềm Thừ, Tỳ Hưu, Ngựa Mã Đáo Thành Công, Rồng Uy Nghi): Kích tài chiêu lộc, đón nhận vận may trong kinh doanh buôn bán.",
        ],
      },
    ],
    faqs: [
      {
        question: "Thời gian đúc một pho tượng chân dung truyền thần mất bao lâu?",
        answer:
          "Thời gian hoàn thiện từ khâu đắp mẫu đất, duyệt mẫu, làm khuôn, nấu đồng, đúc rót và chạm nguội dát vàng thông thường mất từ 15 - 25 ngày tùy theo kích thước và độ chi tiết của tượng.",
      },
      {
        question: "Nên đặt tượng phong thủy ở vị trí nào trong nhà để hút tài lộc?",
        answer:
          "Tượng phong thủy nên đặt tại phòng khách hoặc phòng làm việc ở vị trí cao ráo (trên đôn hoặc kệ bàn cao tối thiểu 80cm - 1m), mặt tượng hướng ra cửa chính hoặc hướng sinh khí của gia chủ.",
      },
    ],
  },
  "qua-tang-dong": {
    title: "QUÀ TẶNG BẰNG ĐỒNG MẠ VÀNG 24K SANG TRỌNG – ĐẲNG CẤP DOANH NGHIỆP",
    subTitle: "Món quà ngoại giao, quà biếu lãnh đạo và đối tác kinh doanh ý nghĩa",
    intro:
      "Quà tặng bằng đồng mạ vàng 24k của Đồ Đồng Lộc Nam là biểu tượng của sự trân trọng, thành công và thịnh vượng. Mỗi món quà được đúc đồng tinh xảo, mạ vàng 24k sáng bóng, gắn trên đế gỗ tự nhiên sang trọng và có lồng kính chống bụi, là lựa chọn số 1 cho các dịp khánh thành, kỷ niệm thành lập, thăng chức hoặc quà tặng đối tác nước ngoài.",
    sections: [
      {
        heading: "1. Mô hình thuyền buồm 'Thuận Buồm Xuôi Gió' mạ vàng 24k",
        content: [
          "Biểu tượng của doanh nhân: Cánh buồm căng gió vượt sóng đại dương tượng trưng cho công việc kinh doanh luôn hanh thông, vượt qua mọi khó khăn và đạt doanh thu bứt phá.",
          "Chế tác thủ công siêu tinh xảo: Từng sợi dây buồm, mỏ neo, lá cờ và thân thuyền được nghệ nhân hàn ghép và mạ vàng 24k tinh xảo, đựng trong tủ kính sang trọng.",
        ],
      },
      {
        heading: "2. Tranh đồng nghệ thuật & Tranh dát vàng phong thủy",
        content: [
          "Tranh Mã Đáo Thành Công: Bát mã phi nước đại mang lại tài lộc dồi dào, thăng tiến sự nghiệp.",
          "Tranh Thuận Buồm Xuôi Gió & Tranh Vinh Hoa Phú Quý: Mang lại sự an khang thịnh vượng cho gia chủ.",
          "Tranh Trống Đồng & Mặt Trống Mạ Vàng: Quà tặng văn hóa ngoại giao đậm đà bản sắc Việt Nam gửi tặng đối tác và kiều bào.",
        ],
      },
    ],
    faqs: [
      {
        question: "Lộc Nam có khắc tên, logo công ty lên quà tặng theo yêu cầu không?",
        answer:
          "Có, Đồ Đồng Lộc Nam miễn phí khắc laser kim loại gắn logo doanh nghiệp, lời đề tặng và thông điệp chúc mừng trên đế gỗ của mọi sản phẩm quà tặng.",
      },
      {
        question: "Sản phẩm quà tặng mạ vàng có giấy chứng nhận chất lượng vàng không?",
        answer:
          "Mọi sản phẩm mạ vàng 24k cao cấp tại Lộc Nam đều đi kèm thẻ bảo hành chính hãng và cam kết chuẩn vàng 24k thật 100%.",
      },
    ],
  },
  "duc-chuong-cong-trinh": {
    title: "TRỐNG ĐỒNG ĐÔNG SƠN & ĐÚC CHUÔNG ĐỒNG ĐẠI HỒNG CHUNG Ý YÊN",
    subTitle: "Bảo tồn di sản văn hóa dân tộc – Âm vang chuông đồng ngàn năm",
    intro:
      "Đúc chuông đồng đại hồng chung cho đền chùa, đúc đại tượng Phật và phục dựng trống đồng Đông Sơn, Ngọc Lũ là niềm tự hào của xưởng Đồ Đồng Lộc Nam. Với công thức phối trộn đồng đỏ và thiếc chuẩn xác lưu truyền qua nhiều thế hệ, chuông đồng Lộc Nam luôn đạt độ vang ngân trầm ấm, uy nghiêm và trường tồn theo năm tháng.",
    sections: [
      {
        heading: "1. Trống đồng Đông Sơn – Hồn thiêng sông núi",
        content: [
          "Mặt trống đồng với họa tiết ngôi sao 14 cánh, chim Lạc bay ngược chiều kim đồng hồ tái hiện sống động nền văn minh nông nghiệp lúa nước rực rỡ.",
          "Trưng bày trống đồng trong phòng khách, hội trường cơ quan giúp tụ vượng khí, khẳng định tầm vóc và niềm tự hào dân tộc.",
        ],
      },
      {
        heading: "2. Đúc chuông đồng nhà chùa, nhà thờ họ uy tín",
        content: [
          "Âm thanh chuẩn mực: Chuông được tính toán độ dày mỏng và vành chuông chuẩn xác để khi thỉnh chuông, âm vang bay xa hàng cây số, tiếng chuông thanh thoát, không bị đanh gắt.",
          "Đúc chuông trực tiếp tại chân công trình: Nghệ nhân Lộc Nam nhận đắp khuôn và nấu đồng đúc trực tiếp tại khuôn viên chùa chiền, từ đường trên toàn quốc.",
        ],
      },
    ],
    faqs: [
      {
        question: "Chi phí đúc một quả chuông đồng phụ thuộc vào những yếu tố nào?",
        answer:
          "Chi phí đúc chuông đồng phụ thuộc vào cân nặng (từ vài chục kg đến hàng tấn), tỷ lệ đồng đỏ - thiếc thanh khiết, hoa văn chữ Hán/kinh Phật khắc trên thân chuông và địa điểm đúc chuông.",
      },
      {
        question: "Xưởng Lộc Nam có nhận đúc tượng Phật đồng kích thước lớn cho chùa không?",
        answer:
          "Xưởng Đồ Đồng Lộc Nam đã thi công hàng trăm công trình đúc tượng Phật, đại hồng chung cho các chùa lớn trên cả nước, bảo đảm tính thẩm mỹ Phật giáo và độ bền nghìn năm.",
      },
    ],
  },
};

export function CategorySeoContent({ categorySlug }: CategorySeoContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const data = categorySeoData[categorySlug] || {
    title: "ĐỒ ĐỒNG NGHỆ THUẬT LỘC NAM – ĐỈNH CAO CHẾ TÁC Ý YÊN NAM ĐỊNH",
    subTitle: "Sản phẩm thủ công mỹ nghệ bằng đồng mạ vàng cao cấp",
    intro:
      "Xưởng Đồ Đồng Lộc Nam là địa chỉ uy tín chuyên sản xuất và phân phối các dòng sản phẩm đồ đồng thủ công mỹ nghệ, đồ thờ cúng, tượng đồng và quà tặng mạ vàng 24k cao cấp bậc nhất thị trường.",
    sections: [
      {
        heading: "Tinh hoa nghệ thuật đúc đồng truyền thống",
        content: [
          "Chất lượng đồng thanh khiết chuẩn 100%, bảo hành độ bền vĩnh cửu.",
          "Hoa văn chạm trổ thủ công sống động, giữ trọn vẹn hồn cốt văn hóa dân tộc.",
          "Hỗ trợ tư vấn kích thước phong thủy theo thước Lỗ Ban miễn phí 24/7.",
        ],
      },
    ],
    faqs: [
      {
        question: "Mua đồ đồng tại Lộc Nam có được bảo hành không?",
        answer:
          "Tất cả sản phẩm bằng đồng tại Lộc Nam đều được cam kết bảo hành trọn đời chất lượng phôi đồng và hỗ trợ đổi trả nếu có lỗi sản xuất.",
      },
      {
        question: "Cách đặt mua và kiểm tra hàng tại Đồ Đồng Lộc Nam?",
        answer:
          "Quý khách có thể đặt hàng trực tuyến hoặc gọi hotline 0846 699 997. Khách hàng nhận hàng, mở kiểm tra kỹ lưỡng đúng chất lượng mới thanh toán.",
      },
    ],
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="mt-16 pt-12 border-t border-[#e2d5bd]">
      {/* FAQ Schema Markup for Google SERP */}
      <FaqJsonLd faqs={data.faqs} />

      <div className="bg-white rounded-2xl border border-[#e2d5bd] p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header Badge & Title */}
        <div className="space-y-2 border-b border-[#e2d5bd] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fdf8ee] text-[#854d0e] border border-[#d6c7af] text-xs font-serif font-bold uppercase rounded-md tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
            <span>KIẾN THỨC & CẨM NANG CHỌN ĐỒ ĐỒNG</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a] leading-snug">
            {data.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#78350f] font-serif font-bold italic">
            {data.subTitle}
          </p>
        </div>

        {/* Intro */}
        <p className="text-xs sm:text-sm text-[#334155] leading-relaxed italic bg-[#fbf9f5] p-4 sm:p-5 rounded-xl border-l-4 border-[#b8860b] shadow-sm font-medium">
          {data.intro}
        </p>

        {/* Content Sections */}
        <div className="space-y-6">
          {data.sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-serif font-black text-sm sm:text-base text-[#0f172a] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b8860b]"></span>
                <span>{sec.heading}</span>
              </h3>
              <ul className="space-y-2.5 pl-4 text-xs sm:text-sm text-[#334155] leading-relaxed">
                {sec.content.map((item, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2.5">
                    <span className="text-[#b8860b] font-black text-base shrink-0 leading-none mt-0.5">•</span>
                    <span className="font-normal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Highlight Box */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0a1524] to-[#0f1d30] text-[#f1f5f9] rounded-2xl border-2 border-[#b8860b] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#dfb755]/15 border border-[#dfb755]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-[#ffd700]" />
            </div>
            <div>
              <h4 className="font-serif font-black text-sm sm:text-base text-[#ffd700] uppercase tracking-wide">
                CAM KẾT PHÔI ĐỒNG CHUẨN 100% – BẢO HÀNH TRỌN ĐỜI
              </h4>
              <p className="text-xs text-[#cbd5e1] mt-0.5 font-medium">
                Xưởng Đồ Đồng Lộc Nam trực tiếp chế tác tại Ý Yên, Nam Định - Giao hàng & kiểm tra toàn quốc.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <a
              href="tel:0836122222"
              className="px-4 py-2.5 bg-gradient-to-r from-[#dfb755] to-[#b8860b] hover:brightness-110 text-[#0b1622] font-serif font-black text-xs uppercase rounded-xl shadow-md transition-all whitespace-nowrap active:scale-95"
            >
              Hotline 1: 0836 122 222
            </a>
            <a
              href="tel:0846699997"
              className="px-4 py-2.5 bg-[#0b1622] hover:bg-[#122234] border border-[#dfb755] text-[#ffd700] font-serif font-black text-xs uppercase rounded-xl shadow-md transition-all whitespace-nowrap active:scale-95"
            >
              Hotline 2: 0846 699 997
            </a>
          </div>
        </div>

        {/* FAQ Accordion Section - High Contrast & Crystal Clear Readability */}
        <div className="space-y-4 pt-4 border-t border-[#e2d5bd]">
          <div className="flex items-center gap-2.5 text-[#854d0e]">
            <HelpCircle className="w-5 h-5 text-[#854d0e]" />
            <h3 className="font-serif font-black text-base sm:text-lg uppercase tracking-wide text-[#78350f]">
              CÂU HỎI THƯỜNG GẶP (FAQ)
            </h3>
          </div>

          <div className="space-y-3">
            {data.faqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? "border-[#b8860b] shadow-md bg-white"
                      : "border-[#d6c7af] hover:border-[#b8860b] bg-[#faf7f0]"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(fIdx)}
                    className="w-full text-left p-4 sm:p-5 font-serif font-bold text-sm sm:text-base text-[#1c1917] flex items-center justify-between gap-4 hover:text-[#854d0e] transition-colors"
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#854d0e] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-sm text-[#334155] leading-relaxed border-t border-[#e8dfd1] pt-3 bg-white font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
