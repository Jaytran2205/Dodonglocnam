"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Phone,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  MapPin,
  ExternalLink,
  MessageCircle,
  User,
} from "lucide-react";

export function ModernHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // Instant Prefetch on Mount for Zero-Latency Navigation
  useEffect(() => {
    const popularRoutes = [
      "/san-pham/do-tho-cung",
      "/san-pham/tuong-dong",
      "/san-pham/tranh-dong",
      "/san-pham/trong-dong",
      "/san-pham",
      "/qua-tang",
      "/du-an",
      "/tin-tuc",
      "/gioi-thieu",
    ];
    popularRoutes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch {}
    });
  }, [router]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [hotlineData, setHotlineData] = useState({
    hotline1: "0836 122 222",
    hotline2: "0846 699 997",
    cleanPhone1: "0836122222",
    cleanPhone2: "0846699997",
    zalo: "0846699997",
  });

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("cart");
        if (stored) {
          const items = JSON.parse(stored);
          const total = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const h1 = data.settings.hotline1 || data.settings.hotline || "0836 122 222";
          const h2 = data.settings.hotline2 || "0846 699 997";
          setHotlineData({
            hotline1: h1,
            hotline2: h2,
            cleanPhone1: h1.replace(/\D/g, "") || "0836122222",
            cleanPhone2: h2.replace(/\D/g, "") || "0846699997",
            zalo: (data.settings.zalo || h2 || "0846699997").replace(/\D/g, ""),
          });
        }
      })
      .catch((err) => console.error("Error fetching header settings:", err));
  }, []);

  // Close mobile menu and scroll to top on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordion((prev) => (prev === key ? null : key));
  };

  // =========================================================================
  // INTERACTIVE DEMO PREVIEW STATES (ẢNH CHUẨN TỪ BELUX & DODONGLOCNAM)
  // =========================================================================
  const defaultProductPreview = {
    title: "Bộ Đồ Thờ Đầy Đủ Bằng Đồng Vàng Đúc Thủ Công Lộc Nam",
    desc: "Đỉnh đồng, đôi hạc ngự long quy, chân nến đúc thủ công Ý Yên Nam Định nguyên khối.",
    image: "/images/locnam_real/locnam_bo_do_tho.jpg",
    href: "/san-pham/do-tho-cung",
    tag: "Đồ Thờ Lộc Nam",
  };

  const [productPreview, setProductPreview] = useState(defaultProductPreview);

  const defaultGiftPreview = {
    title: "Mô Hình Thuyền Buồm Mạ Vàng 24K Lộc Nam",
    desc: "Quà tặng ngoại giao, khai trương & đại hội mạ vàng điện phân 24k trường tồn đẳng cấp.",
    image: "/images/locnam_real/locnam_thuyen_buom.jpg",
    href: "/san-pham/qua-tang-dong",
    tag: "Quà Tặng Đối Tác",
  };

  const [giftPreview, setGiftPreview] = useState(defaultGiftPreview);

  // =========================================================================
  // TAXONOMY CHUẨN XÁC 100% THEO YÊU CẦU
  // ẢNH QUÀ TẶNG: BELUX (ĐÃ XÓA WATERMARK) | ẢNH ĐỒ ĐỒNG, CHIÊNG: DODONGLOCNAM
  // =========================================================================

  const [hoveredProductCategory, setHoveredProductCategory] = useState("do-tho-cung");
  const [hoveredGiftCategory, setHoveredGiftCategory] = useState("qua-tang-doi-tuong");
  const [hoveredProductSubItem, setHoveredProductSubItem] = useState<{
    image: string;
    previewTitle: string;
    previewDesc: string;
    href: string;
    tag?: string;
  } | null>(null);
  const [hoveredGiftSubItem, setHoveredGiftSubItem] = useState<{
    image: string;
    previewTitle: string;
    previewDesc: string;
    href: string;
    tag?: string;
  } | null>(null);

  const productNavigationCategories = [
    {
      id: "do-tho-cung",
      title: "ĐỒ THỜ CÚNG",
      href: "/san-pham/do-tho-cung",
      image: "/images/do-tho-cung/bo-suu-tap-do-tho.webp",
      previewTitle: "Bộ Sưu Tập Đồ Thờ Đầy Đủ Bằng Đồng Cao Cấp Lộc Nam",
      previewDesc: "Đỉnh đồng, tam sự, ngũ sự, bát hương, hạc thờ đúc thủ công gia truyền Ý Yên Nam Định bảo hành trọn đời.",
      subItems: [
        {
          label: "BỘ SƯU TẬP ĐỒ THỜ ĐẦY ĐỦ",
          href: "/san-pham/do-tho-cung/bo-suu-tap-do-tho",
          query: "Bộ sưu tập đồ thờ đầy đủ",
          image: "/images/do-tho-cung/bo-suu-tap-do-tho.webp",
          previewTitle: "Bộ Sưu Tập Đồ Thờ Đầy Đủ Bằng Đồng Lộc Nam",
          previewDesc: "Bộ sưu tập đồ thờ cúng đầy đủ bằng đồng vàng catut, đồng đỏ khảm tam khí, ngũ sắc cao cấp.",
        },
        {
          label: "BỘ TAM SỰ, NGŨ SỰ BẰNG ĐỒNG",
          href: "/san-pham/do-tho-cung/bo-tam-su-ngu-su",
          query: "Bộ tam sự bằng đồng",
          image: "/images/do-tho-cung/bo-tam-su-ngu-su.webp",
          previewTitle: "Bộ Tam Sự, Ngũ Sự Bằng Đồng Cao Cấp",
          previewDesc: "Đỉnh đồng kết hợp đôi hạc ngự long quy hoặc đôi chân nến đúc đồng thủ công tinh xảo.",
        },
        {
          label: "CHÂN NẾN",
          href: "/san-pham/do-tho-cung/chan-nen",
          query: "Chân nến",
          image: "/images/do-tho-cung/chan-nen.webp",
          previewTitle: "Chân Nến Bằng Đồng Thờ Cúng Gia Tiên",
          previewDesc: "Đôi chân nến thờ bằng đồng đúc nổi họa tiết rồng phượng, hoa sen trang nghiêm.",
        },
        {
          label: "HẠC THỜ",
          href: "/san-pham/do-tho-cung/hac-tho",
          query: "Hạc thờ",
          image: "/images/do-tho-cung/hac-tho.webp",
          previewTitle: "Đôi Hạc Thờ Ngậm Hoa Sen Ngự Long Quy",
          previewDesc: "Đôi hạc đồng chầu bàn thờ gia tiên và từ đường biểu tượng của sự thanh cao và trường thọ.",
        },
        {
          label: "ĐÈN THỜ",
          href: "/san-pham/do-tho-cung/den-tho",
          query: "Đèn thờ",
          image: "/images/do-tho-cung/den-tho.webp",
          previewTitle: "Đèn Thờ Bằng Đồng Thắp Sáng Không Gian Thờ",
          previewDesc: "Đôi đèn thờ cắm điện hoặc thắp dầu bằng đồng cao cấp đúc hoa văn tứ linh, sen tinh tế.",
        },
        {
          label: "BÁT HƯƠNG ĐỒNG",
          href: "/san-pham/do-tho-cung/bat-huong",
          query: "Bát hương đồng",
          image: "/images/do-tho-cung/bat-huong.webp",
          previewTitle: "Bát Hương Đồng Đúc Rồng Chầu Mặt Nguyệt",
          previewDesc: "Vật phẩm linh thiêng trung tâm bàn thờ, đúc nổi lưỡng long chầu nguyệt giữ trọn vượng khí.",
        },
        {
          label: "LỌ HOA ĐỒNG",
          href: "/san-pham/do-tho-cung/lo-hoa",
          query: "Lọ hoa đồng",
          image: "/images/do-tho-cung/lo-hoa.webp",
          previewTitle: "Lọ Hoa Bằng Đồng Dâng Hoa Cúng Phật & Gia Tiên",
          previewDesc: "Đôi lọ hoa đồng đúc họa tiết hoa sen, tùng hạc mang lại vẻ tôn nghiêm cho bàn thờ.",
        },
        {
          label: "ỐNG HƯƠNG",
          href: "/san-pham/do-tho-cung/ong-huong",
          query: "Ống hương",
          image: "/images/do-tho-cung/ong-huong.webp",
          previewTitle: "Ống Đựng Hương Bằng Đồng Gọn Gàng Bàn Thờ",
          previewDesc: "Ống cắm nhang bằng đồng đúc hoa văn rồng phượng giúp không gian thờ tự ngăn nắp, trang trọng.",
        },
        {
          label: "MÂM BỒNG",
          href: "/san-pham/do-tho-cung/mam-bong",
          query: "Mâm bồng",
          image: "/images/do-tho-cung/mam-bong.webp",
          previewTitle: "Mâm Bồng Đồng Đựng Ngũ Quả Dâng Lễ",
          previewDesc: "Đĩa mâm bồng đựng hoa quả chạm rồng phượng, chữ Phúc bằng đồng vàng nguyên chất.",
        },
        {
          label: "ĐÀI NƯỚC",
          href: "/san-pham/do-tho-cung/dai-nuoc",
          query: "Đài nước",
          image: "/images/do-tho-cung/dai-nuoc.webp",
          previewTitle: "Bộ Đài Nước Thờ Cúng Bằng Đồng (Nước - Rượu - Muối)",
          previewDesc: "Bộ ba đài thờ đựng nước tinh khiết, rượu và muối dâng cúng tổ tiên chu toàn lễ nghi.",
        },
        {
          label: "NGAI CHÉN",
          href: "/san-pham/do-tho-cung/ngai-chen",
          query: "Ngai chén",
          image: "/images/do-tho-cung/ngai-chen.webp",
          previewTitle: "Kỷ Ngai Chén Thờ Bằng Đồng (3 Chén / 5 Chén)",
          previewDesc: "Bộ kỷ ngai chén nước dâng hương đúc đồng nguyên khối chạm hoa văn cổ truyền.",
        },
        {
          label: "ẤM NƯỚC",
          href: "/san-pham/do-tho-cung/am-nuoc",
          query: "Ấm nước",
          image: "/images/do-tho-cung/am-nuoc.webp",
          previewTitle: "Ấm Nước Thờ Bằng Đồng Đúc Tinh Xảo",
          previewDesc: "Ấm dâng rượu dâng trà thờ cúng gia tiên và thần linh đúc đồng thủ công dày dặn.",
        },
        {
          label: "CHUÔNG THỜ CỠ NHỎ",
          href: "/san-pham/do-tho-cung/chuong-tho",
          query: "Chuông thờ cỡ nhỏ",
          image: "/images/do-tho-cung/chuong-tho.webp",
          previewTitle: "Chuông Thờ Bằng Đồng Cỡ Nhỏ Tiếng Trong Vang",
          previewDesc: "Chuông gia trì, chuông bát thờ tại gia và phòng thờ niệm Phật âm vang trầm ấm.",
        },
        {
          label: "CỬU HUYỀN THẤT TỔ",
          href: "/san-pham/do-tho-cung/cuu-huyen-that-to",
          query: "Cửu huyền thất tổ",
          image: "/images/do-tho-cung/cuu-huyen-that-to.webp",
          previewTitle: "Bài Vị Cửu Huyền Thất Tổ Bằng Đồng Sơn Son Mạ Vàng",
          previewDesc: "Tấm hoành phi bài vị Cửu Huyền Thất Tổ phụng thờ tổ tiên ngàn đời hiển vinh.",
        },
        {
          label: "NGAI THỜ",
          href: "/san-pham/do-tho-cung/ngai-tho",
          query: "Ngai thờ",
          image: "/images/do-tho-cung/ngai-tho.webp",
          previewTitle: "Ngai Thờ Gia Tiên - Ỷ Thờ Bằng Đồng Đúc",
          previewDesc: "Ngai thờ chạm rồng chầu tôn nghiêm dành cho vị tổ tôn kính nhất trong dòng họ.",
        },
        {
          label: "BÀI VỊ",
          href: "/san-pham/do-tho-cung/bai-vi",
          query: "Bài vị",
          image: "/images/do-tho-cung/bai-vi.webp",
          previewTitle: "Bài Vị Thờ Cúng Bằng Đồng Chế Tác Theo Yêu Cầu",
          previewDesc: "Bài vị đồng chữ Hán - Việt khắc tên gia tiên, tiền nhân phụng thờ trang nghiêm vĩnh cửu.",
        },
        {
          label: "CUỐN THƯ CÂU ĐỐI",
          href: "/san-pham/do-tho-cung/cuon-thu-cau-doi",
          query: "Cuốn thư câu đối",
          image: "/images/do-tho-cung/cuon-thu-cau-doi.webp",
          previewTitle: "Cuốn Thư Câu Đối - Hoành Phi Cửa Võng Bằng Đồng",
          previewDesc: "Đức Lưu Quang, Phụng Tổ Đường thúc thủ công đồng tấm dày dặn thếp vàng sang trọng.",
        },
        {
          label: "ĐẠI TỰ BẰNG ĐỒNG",
          href: "/san-pham/do-tho-cung/dai-tu",
          query: "Đại tự bằng đồng",
          image: "/images/do-tho-cung/dai-tu.webp",
          previewTitle: "Đại Tự Câu Đối Khung Đồng Chữ Nổi Mạ Vàng",
          previewDesc: "Bức đại tự vuông khắc chữ cổ truyền thếp vàng 9999 cho nhà thờ họ, từ đường tôn kính.",
        },
        {
          label: "CHIÊNG - KHÁNH ĐỒNG",
          href: "/san-pham/do-tho-cung/chieng-khanh",
          query: "Chiêng - Khánh Đồng",
          image: "/images/do-tho-cung/chieng-khanh.webp",
          previewTitle: "Chiêng Đồng - Khánh Đồng Đúc Thủ Công Tiếng Ngân",
          previewDesc: "Chiêng khánh chạm mặt trống đồng, hoa văn cổ truyền gõ âm vang rền xa.",
        },
        {
          label: "ĐÚC ĐẠI HỒNG CHUNG",
          href: "/san-pham/do-tho-cung/dai-hong-chung",
          query: "Đúc đại hồng chung",
          image: "/images/do-tho-cung/dai-hong-chung.webp",
          previewTitle: "Đúc Đại Hồng Chung Nhà Chùa & Đền Miếu",
          previewDesc: "Nhận đúc đại hồng chung từ hàng trăm kg đến hàng chục tấn trực tiếp tại chùa làng.",
        },
        {
          label: "ĐỈNH - LƯ HƯƠNG CỠ LỚN",
          href: "/san-pham/do-tho-cung/dinh-lu-huong",
          query: "Đỉnh - lư hương cỡ lớn",
          image: "/images/do-tho-cung/dinh-lu-huong.webp",
          previewTitle: "Đỉnh Lư Hương Đồng Cỡ Lớn Đặt Sân Đình Chùa",
          previewDesc: "Lư hương đỉnh tròn, đỉnh vuông cắm nhang ngoài trời đúc đồng đỏ nguyên khối bền thế kỷ.",
        },
        {
          label: "ĐỈNH THẤT LÂN VỜN CẦU",
          href: "/san-pham/do-tho-cung/dinh-that-lan",
          query: "Đỉnh thất lân vờn cầu",
          image: "/images/do-tho-cung/dinh-that-lan.webp",
          previewTitle: "Đỉnh Thất Lân Vờn Cầu Khảm Tam Khí, Ngũ Sắc",
          previewDesc: "Tuyệt tác đỉnh cầu 7 nghê vờn ngọc khảm bạc, vàng 9999 trấn trạch trừ tà đắc tài đắc lộc.",
        },
        {
          label: "LỤC BÌNH - CHÓE ĐỒNG",
          href: "/san-pham/do-tho-cung/luc-binh-choe",
          query: "Lục bình - Chóe đồng",
          image: "/images/do-tho-cung/luc-binh-choe.webp",
          previewTitle: "Đôi Lục Bình & Chóe Thờ Bằng Đồng Cao Cấp",
          previewDesc: "Lục bình cắm hoa cắm cành đào và chóe đựng tài lộc dáng phong thủy tụ lộc sinh khí.",
        },
      ],
    },
    {
      id: "tuong-dong",
      title: "TƯỢNG ĐỒNG",
      href: "/san-pham/tuong-dong",
      image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg",
      previewTitle: "Tượng Đồng Phong Thủy & Đúc Tượng Chân Dung",
      previewDesc: "Đắp mẫu đất sét truyền thần, đúc phôi đồng nguyên khối chuẩn 99%, tượng danh nhân và tượng Phật.",
      subItems: [
        {
          label: "TƯỢNG CHÂN DUNG, TRUYỀN THẦN",
          href: "/san-pham/tuong-dong/tuong-truyen-than",
          query: "Tượng chân dung, truyền thần",
          image: "/images/locnam_real/locnam_bac_giap.jpg",
          previewTitle: "Đúc Tượng Chân Dung Bằng Đồng Truyền Thần",
          previewDesc: "Đắp mẫu đất sét chuẩn xác giống người thật trên 95%, đúc đồng đỏ nguyên khối bền vững muôn đời.",
        },
        {
          label: "TƯỢNG PHẬT",
          href: "/san-pham/tuong-dong/tuong-phat",
          query: "Tượng Phật",
          image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg",
          previewTitle: "Tượng Phật Thích Ca, Quan Âm, A Di Đà Bằng Đồng",
          previewDesc: "Đúc tượng Phật cho chùa chiền và phòng thờ tư gia diện mạo từ bi, uy nghiêm.",
        },
        {
          label: "TƯỢNG DANH NHÂN",
          href: "/san-pham/tuong-dong/tuong-danh-nhan",
          query: "Tượng danh nhân",
          image: "/images/locnam_real/locnam_bac_ho.jpg",
          previewTitle: "Tượng Bác Hồ, Trần Hưng Đạo, Võ Nguyên Giáp",
          previewDesc: "Tượng đồng danh nhân lịch sử dân tộc mạ vàng, đúc thủ công tinh xảo.",
        },
        {
          label: "TƯỢNG THẦN - THÁNH",
          href: "/san-pham/tuong-dong/tuong-than-thanh",
          query: "Tượng thần - thánh",
          image: "/images/locnam_real/locnam_quan_cong.jpg",
          previewTitle: "Tượng Quan Thánh Đế Quân, Thánh Gióng Bằng Đồng",
          previewDesc: "Tượng thần linh trấn trạch, xua tan hung khí, hộ trì gia chủ bình an thịnh vượng.",
        },
        {
          label: "TƯỢNG VUA",
          href: "/san-pham/tuong-dong/tuong-vua",
          query: "Tượng vua",
          image: "/images/locnam_real/locnam_tuong_vua.jpg",
          previewTitle: "Tượng Vua Hùng, Vua Quang Trung Bằng Đồng",
          previewDesc: "Tượng các bậc hoàng đế anh minh dựng nước và giữ nước đúc đồng nguyên chất.",
        },
        {
          label: "TƯỢNG LINH VẬT 12 CON GIÁP",
          href: "/san-pham/tuong-dong/tuong-12-con-giap",
          query: "Tượng Linh vật 12 con giáp",
          image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg",
          previewTitle: "Tượng 12 Con Giáp Bằng Đồng Mạ Vàng 24K",
          previewDesc: "Tượng linh vật theo tuổi bản mệnh, linh vật phong thủy chiêu tài hút lộc.",
        },
      ],
    },
    {
      id: "tranh-dong",
      title: "TRANH ĐỒNG",
      href: "/san-pham/tranh-dong",
      image: "/images/locnam_real/locnam_tranh_thuan_buom.jpg",
      previewTitle: "Tranh Đồng Mỹ Nghệ & Dát Vàng 24K",
      previewDesc: "Tranh Thuận Buồm Xuôi Gió, Bát Mã, Vinh Quy Bái Tổ, Tranh Đồng Quê chạm thủ công tinh xảo.",
      subItems: [
        {
          label: "TRANH BÁT MÃ",
          href: "/san-pham/tranh-dong/tranh-bat-ma",
          query: "Tranh bát mã",
          image: "/images/locnam_real/locnam_tranh_bat_ma.jpg",
          previewTitle: "Tranh Đồng Bát Mã Truy Phong Mạ Vàng 24K",
          previewDesc: "Bức tranh tám chú tuấn mã phi nước đại mang ý nghĩa thành công thần tốc và thịnh vượng.",
        },
        {
          label: "TRANH THUẬN BUỒM XUÔI GIÓ",
          href: "/san-pham/tranh-dong/tranh-thuan-buom",
          query: "Tranh thuận buồm xuôi gió",
          image: "/images/locnam_real/locnam_tranh_thuan_buom.jpg",
          previewTitle: "Tranh Thuận Buồm Xuôi Gió Bằng Đồng Mạ Vàng",
          previewDesc: "Biểu tượng của sự hanh thông tài lộc, kích hoạt vận may cho gia chủ kinh doanh.",
        },
        {
          label: "TRANH VINH QUY BÁI TỔ",
          href: "/san-pham/tranh-dong/tranh-vinh-quy",
          query: "Tranh vinh quy bái tổ",
          image: "/images/locnam_real/locnam_tranh_vinh_quy.jpg",
          previewTitle: "Tranh Đồng Vinh Quy Bái Tổ Chạm Tay Tinh Tế",
          previewDesc: "Tái hiện cảnh tân khoa đỗ đạt rạng danh dòng họ, hiếu kính tổ tiên nơi quê nhà.",
        },
        {
          label: "TRANH ĐỒNG QUÊ",
          href: "/san-pham/tranh-dong/tranh-dong-que",
          query: "Tranh đồng quê",
          image: "/images/locnam_real/locnam_tranh_dong_que.jpg",
          previewTitle: "Tranh Đồng Cảnh Làng Quê Việt Nam Thanh Bình",
          previewDesc: "Cây đa giếng nước sân đình, mùa gặt quê hương chạm nổi tinh xảo trên phôi đồng tấm dày.",
        },
        {
          label: "TRANH TỨ QUÝ",
          href: "/san-pham/tranh-dong/tranh-tu-quy",
          query: "Tranh tứ quý",
          image: "/images/locnam_real/locnam_tranh_tu_quy.jpg",
          previewTitle: "Bộ Tranh Tứ Quý Tùng Cúc Trúc Mai Bằng Đồng",
          previewDesc: "Bốn mùa sinh sôi nảy nở, tài lộc sum vầy dát vàng 24k đẳng cấp nghệ nhân.",
        },
        {
          label: "TRANH CÁ CHÉP",
          href: "/san-pham/tranh-dong/tranh-ca-chep",
          query: "Tranh cá chép",
          image: "/images/locnam_real/locnam_tranh_ca_chep.jpg",
          previewTitle: "Tranh Cửu Ngư Quần Hội Bằng Đồng Khảm Tam Khí",
          previewDesc: "Chín chú cá chép bơi lội trong hồ sen biểu trưng cho sự trường cửu và tài lộc dư dả.",
        },
        {
          label: "TRANH BÁCH HẠC QUẦN TÙNG",
          href: "/san-pham/tranh-dong/tranh-bach-hac",
          query: "Tranh bách hạc quần tùng",
          image: "/images/belux/belux_tranh_bach_hac.jpg",
          previewTitle: "Tranh Đồng Bách Hạc Quần Tùng - Bách Niên Giai Lão",
          previewDesc: "Cây tùng cổ thụ che chở bầy chim hạc, ngụ ý trường thọ an khang cho gia đạo.",
        },
        {
          label: "TRANH CHÙA MỘT CỘT & KHUÊ VĂN CÁC",
          href: "/san-pham/tranh-dong/tranh-chua-mot-cot",
          query: "Tranh chùa một cột",
          image: "/images/demo/demo_tranh_chua_mot_cot.jpg",
          previewTitle: "Tranh Biểu Trưng Văn Hóa Hà Nội Bằng Đồng",
          previewDesc: "Quà tặng lưu niệm mang dấu ấn văn hiến ngàn năm Thăng Long mạ vàng sang trọng.",
        },
        {
          label: "TRANH CHỮ BẰNG ĐỒNG",
          href: "/san-pham/tranh-dong/tranh-chu",
          query: "Tranh chữ bằng đồng",
          image: "/images/locnam_real/locnam_tranh_chu.jpg",
          previewTitle: "Tranh Chữ Phúc - Lộc - Thọ - Tâm - Nhẫn Bằng Đồng",
          previewDesc: "Nét chữ thư pháp uốn lượn thếp vàng, bức tranh ý nghĩa lưu truyền đạo lý sống.",
        },
        {
          label: "TRANH DANH NHÂN BẰNG ĐỒNG",
          href: "/san-pham/tranh-dong/tranh-danh-nhan",
          query: "Tranh danh nhân (Bác Hồ, Bác Giáp)",
          image: "/images/locnam_real/locnam_tranh_bac_ho.jpg",
          previewTitle: "Tranh Đồng Chân Dung Bác Hồ & Đại Tướng Võ Nguyên Giáp",
          previewDesc: "Chân dung các bậc vĩ nhân chạm khắc truyền thần đúc đồng vàng cao cấp.",
        },
        {
          label: "TRANH PHẬT BẰNG ĐỒNG",
          href: "/san-pham/tranh-dong/tranh-phat",
          query: "Tranh Phật bằng đồng",
          image: "/images/locnam_real/locnam_a_di_da.jpg",
          previewTitle: "Tranh Phật Bà Quan Âm & Phật A Di Đà Bằng Đồng",
          previewDesc: "Hình ảnh đức Phật từ bi cứu khổ cứu nạn ban phúc lành cho muôn nơi.",
        },
        {
          label: "TRANH MẶT TRỐNG ĐỒNG",
          href: "/san-pham/tranh-dong/tranh-mat-trong",
          query: "Tranh mặt trống đồng",
          image: "/images/trong-dong/mat-trong-dong.webp",
          previewTitle: "Tranh Khung Gỗ Mặt Trống Đồng Mạ Vàng Cao Cấp",
          previewDesc: "Tranh mặt trống đồng Đông Sơn lồng khung kính sang trọng cho sảnh lớn và phòng họp.",
        },
      ],
    },
    {
      id: "trong-dong",
      title: "TRỐNG ĐỒNG",
      href: "/san-pham/trong-dong",
      image: "/images/trong-dong/qua-trong-dong-co-lon.webp",
      previewTitle: "Trống Đồng Đông Sơn Đúc Thủ Công Lộc Nam",
      previewDesc: "Bảo vật văn hóa quốc gia, quả trống đồng cỡ lớn và mặt trống phong thủy đúc thủ công Ý Yên Nam Định.",
      subItems: [
        {
          label: "QUẢ TRỐNG ĐỒNG CỠ LỚN",
          href: "/san-pham/trong-dong/qua-trong-dong-co-lon",
          query: "Quả trống đồng cỡ lớn",
          image: "/images/trong-dong/qua-trong-dong-co-lon.webp",
          previewTitle: "Quả Trống Đồng Cỡ Lớn Đúc Thủ Công Đồng Đỏ",
          previewDesc: "Trống đồng Ngọc Lũ, Đông Sơn đúc thủ công đường kính từ 50cm đến 2 mét bề thế uy nghiêm.",
        },
        {
          label: "TRỐNG ĐỒNG LƯU NIỆM",
          href: "/san-pham/trong-dong/trong-dong-luu-niem",
          query: "Trống đồng lưu niệm",
          image: "/images/trong-dong/trong-dong-luu-niem.webp",
          previewTitle: "Mô Hình Trống Đồng Lưu Niệm Để Bàn Mạ Vàng",
          previewDesc: "Quà tặng văn hóa lưu niệm ngoại giao cao cấp, mạ vàng 24k gắn đế gỗ sang trọng.",
        },
        {
          label: "MẶT TRỐNG ĐỒNG",
          href: "/san-pham/trong-dong/mat-trong-dong",
          query: "Mặt trống đồng",
          image: "/images/trong-dong/mat-trong-dong.webp",
          previewTitle: "Mặt Trống Đồng Treo Tường Phong Thủy Bản Chuẩn",
          previewDesc: "Mặt trống chạm khắc tinh xảo bản đồ Việt Nam, họa tiết Đông Sơn mang vượng khí cát tường.",
        },
        {
          label: "TRANH MẶT TRỐNG",
          href: "/san-pham/trong-dong/tranh-mat-trong",
          query: "Tranh mặt trống đồng",
          image: "/images/trong-dong/mat-trong-dong.webp",
          previewTitle: "Tranh Khung Mặt Trống Đồng Dát Vàng 24K",
          previewDesc: "Tranh mặt trống đóng khung gỗ hương cao cấp gắn đèn led tôn vinh không gian phòng khách, phòng họp.",
        },
      ],
    },
    {
      id: "cup-golf",
      title: "CUP GOLF",
      href: "/san-pham/qua-tang-dong?sub=Cúp%20vinh%20danh%20bằng%20đồng",
      image: "/images/cup-golf-le-gia.jpg",
      previewTitle: "Cúp Golf & Kỷ Niệm Chương Bằng Đồng Mạ Vàng",
      previewDesc: "Cúp giải thi đấu golf, kỷ niệm chương đúc thủ công mạ vàng 24k đẳng cấp vương giả.",
      subItems: [
        {
          label: "CÚP GOLF MẠ VÀNG 24K",
          query: "Cúp vinh danh bằng đồng",
          image: "/images/cup-golf-le-gia.jpg",
          previewTitle: "Cúp Golf Đúc Đồng Mạ Vàng 24K",
          previewDesc: "Chế tác độc bản theo từng giải đấu golf, tinh hoa mạ vàng 24k đẳng cấp quý tộc.",
        },
        {
          label: "CÚP GOLF THỦ CÔNG ĐỘC BẢN",
          query: "Cúp vinh danh bằng đồng",
          image: "/images/cup-golf-le-gia.jpg",
          previewTitle: "Cúp Golf Thủ Công Độc Bản Theo Yêu Cầu",
          previewDesc: "Thiết kế đúc đồng nguyên khối khắc tên giải đấu và tên vận động viên xuất sắc.",
        },
        {
          label: "KỶ NIỆM CHƯƠNG GOLF",
          query: "Huy chương bằng đồng",
          image: "/images/demo/demo_cup_vinh_danh.jpg",
          previewTitle: "Kỷ Niệm Chương Giải Golf Danh Giá",
          previewDesc: "Biểu trưng golf kết hợp pha lê và đồng mạ vàng sang trọng.",
        },
        {
          label: "BIỂU TRƯNG GOLF ĐỂ BÀN",
          query: "Biển chức danh để bàn",
          image: "/images/qua-tang-su-kien-hoi-nghi-bang-dong.jpg",
          previewTitle: "Biểu Trưng Golf Để Bàn Làm Việc",
          previewDesc: "Vật phẩm lưu niệm mạ vàng để bàn làm việc lãnh đạo, doanh nhân yêu thể thao.",
        },
      ],
    },
    {
      id: "vat-pham-my-nghe",
      title: "VẬT PHẨM MỸ NGHỆ KHÁC",
      href: "/san-pham/qua-tang-dong",
      image: "/images/locnam_real/locnam_thuyen_buom.jpg",
      previewTitle: "Vật Phẩm Mỹ Nghệ & Quà Tặng Phong Thủy",
      previewDesc: "Thuyền buồm phong thủy mạ vàng, cóc thiềm thừ, tỳ hưu hút tài lộc và tháp văn xương.",
      subItems: [
        {
          label: "MÔ HÌNH THUYỀN BUỒM MẠ VÀNG",
          query: "Quà tặng doanh nghiệp",
          image: "/images/locnam_real/locnam_thuyen_buom.jpg",
          previewTitle: "Mô Hình Thuyền Buồm Phong Thủy Mạ Vàng 24K",
          previewDesc: "Biểu tượng Thuận Buồm Xuôi Gió vươn khơi đại ngàn chiêu tài đón lộc.",
        },
        {
          label: "CÓC THIỀM THỪ NGẬM TIỀN",
          query: "Cóc thiềm thừ bằng đồng",
          image: "/images/locnam_real/locnam_thiem_thu.jpg",
          previewTitle: "Cóc Thiềm Thừ Ba Chân Ngậm Tiền Mạ Vàng",
          previewDesc: "Linh vật giữ của cải, nhả tiền vàng vào nhà mang lại sung túc dồi dào.",
        },
        {
          label: "TỲ HƯU CHIÊU TÀI HÚT LỘC",
          query: "Tỳ hưu bằng đồng",
          image: "/images/locnam_real/locnam_thiem_thu.jpg",
          previewTitle: "Cặp Tỳ Hưu Bằng Đồng Chiêu Tài Hút Vượng Khí",
          previewDesc: "Linh thú số 1 về phong thủy tài chính, không có hậu môn chỉ ăn vàng bạc.",
        },
        {
          label: "THÁP VĂN XƯƠNG CÔNG DANH",
          query: "Tháp văn xương bằng đồng",
          image: "/images/locnam_real/locnam_thap_van_xuong.jpg",
          previewTitle: "Tháp Văn Xương 9 Tầng Bằng Đồng Đúc",
          previewDesc: "Vật phẩm phù trợ học hành thi cử, phát triển con đường quan lộ sự nghiệp.",
        },
        {
          label: "ĐỒNG HỒ ĐỒNG NGHỆ THUẬT",
          query: "Các mẫu phong thủy khác",
          image: "/images/belux/belux_phong_thuy.jpg",
          previewTitle: "Đồng Hồ Quả Lắc Bằng Đồng Nghệ Thuật",
          previewDesc: "Đồng hồ cơ đúc đồng mang vẻ đẹp tân cổ điển đẳng cấp châu Âu quý phái.",
        },
      ],
    },
    {
      id: "thi-cong-tu-duong",
      title: "THI CÔNG TỪ ĐƯỜNG",
      href: "/san-pham/do-tho-cung",
      image: "/images/thiet-ke-thi-cong-tu-duong.jpg",
      previewTitle: "Thiết Kế & Thi Công Không Gian Từ Đường Dòng Họ",
      previewDesc: "Tư vấn bài trí không gian thờ tự từ đường, nhà thờ họ, đúc chuông đồng đại hồng chung, cuốn thư câu đối.",
      subItems: [
        {
          label: "THIẾT KẾ NỘI THẤT PHÒNG THỜ GIA TIÊN",
          query: "Cuốn thư câu đối",
          image: "/images/do-tho-cung/cuon-thu-cau-doi.webp",
          previewTitle: "Thiết Kế Nội Thất Phòng Thờ Gia Tiên Chuẩn Phong Thủy",
          previewDesc: "Tư vấn kích thước Lỗ Ban, bài trí bộ ngũ sự, cuốn thư câu đối hài hòa tôn nghiêm.",
        },
        {
          label: "THI CÔNG TỪ ĐƯỜNG DÒNG HỌ",
          query: "Đại tự bằng đồng",
          image: "/images/do-tho-cung/dai-tu.webp",
          previewTitle: "Thi Công Không Gian Nhà Thờ Họ, Từ Đường",
          previewDesc: "Chế tác trọn bộ đại tự, hoành phi câu đối đồng đỏ mạ vàng cho từ đường dòng tộc.",
        },
        {
          label: "ĐÚC CHUÔNG ĐẠI HỒNG CHUNG NHÀ CHÙA",
          query: "Đúc đại hồng chung",
          image: "/images/do-tho-cung/dai-hong-chung.webp",
          previewTitle: "Đúc Chuông Đồng Đại Hồng Chung Cho Đình Chùa",
          previewDesc: "Nấu rót đồng trực tiếp tại công trình, thử tiếng ngân vang rền đạt chuẩn tâm linh.",
        },
        {
          label: "PHỤC DỰNG ĐỒ THỜ ĐÌNH CHÙA MIẾU MẠO",
          query: "Đỉnh - Lư hương cỡ lớn",
          image: "/images/do-tho-cung/dinh-lu-huong.webp",
          previewTitle: "Phục Dựng & Chế Tác Đồ Thờ Di Tích Lịch Sử",
          previewDesc: "Đúc đỉnh hương, chuông khánh, bài vị và tượng thờ cho các di tích quốc gia.",
        },
      ],
    },
  ];

  // Sheet SẢN PHẨM: 1. Đồ thờ cúng, 2. Tượng đồng, 3. Tranh đồng, 4. Trống đồng
  const productMegaMenu = productNavigationCategories;

  // Sheet QUÀ TẶNG: Quà tặng đối tượng, Quà tặng sự kiện, Quà tặng phong thủy
  const giftMegaMenu = [
    {
      id: "qua-tang-doi-tuong",
      title: "QUÀ TẶNG ĐỐI TƯỢNG",
      href: "/qua-tang/qua-tang-doi-tuong",
      desc: "Quà biếu tặng doanh nghiệp, khách hàng, lãnh đạo & người thân",
      defaultDemo: {
        title: "Bộ Quà Tặng Doanh Nghiệp Mạ Vàng 24K Lộc Nam",
        desc: "Bộ quà tặng đúc đồng mạ vàng 24k mang đậm dấu ấn thương hiệu và đẳng cấp ngoại giao.",
        image: "/images/locnam_real/locnam_qua_doanh_nghiep.jpg",
        href: "/qua-tang/qua-tang-doi-tuong/qua-tang-doanh-nghiep",
        tag: "Quà Tặng Lộc Nam",
      },
      items: [
        { label: "Quà tặng doanh nghiệp", href: "/qua-tang/qua-tang-doi-tuong/qua-tang-doanh-nghiep", demoTitle: "Quà Tặng Doanh Nghiệp Mạ Vàng 24K Lộc Nam", demoDesc: "Khắc logo laser và mạ vàng 24k sang trọng trao tặng đối tác chiến lược.", demoImage: "/images/locnam_real/locnam_qua_doanh_nghiep.jpg" },
        { label: "Quà tặng khách hàng", href: "/qua-tang/qua-tang-doi-tuong/qua-tang-khach-hang", demoTitle: "Trống Đồng Lưu Niệm Quà Tặng Khách Hàng Lộc Nam", demoDesc: "Mô hình trống đồng mạ vàng để bàn tinh xảo quà tặng tri ân khách hàng.", demoImage: "/images/locnam_real/locnam_trong_dong_luu_niem.jpg" },
        { label: "Quà tặng sếp nữ", href: "/qua-tang/qua-tang-doi-tuong/qua-tang-sep-nu", demoTitle: "Biểu Trưng Đôi Chim Công Mạ Vàng Quà Tặng Sếp Nữ Lộc Nam", demoDesc: "Tranh hoa sen và biểu trưng đôi công dát vàng thanh lịch quý phái.", demoImage: "/images/locnam_real/locnam_qua_sep_nu.jpg" },
        { label: "Quà tặng sếp nam", href: "/qua-tang/qua-tang-doi-tuong/qua-tang-sep-nam", demoTitle: "Quà Tặng Sếp Nam & Lãnh Đạo Cao Cấp Lộc Nam", demoDesc: "Mô hình thuyền buồm mạ vàng, tượng linh vật phong thủy uy quyền người dẫn đầu.", demoImage: "/images/locnam_real/locnam_qua_sep_nam.jpg" },
        { label: "Quà tặng cha mẹ", href: "/qua-tang/qua-tang-doi-tuong/qua-tang-cha-me", demoTitle: "Quà Mừng Thọ Cha Mẹ Dát Vàng 24K Lộc Nam", demoDesc: "Tranh chim công mẫu đơn, tranh chữ Thọ hiếu kính cha mẹ an khang trường thọ.", demoImage: "/images/locnam_real/locnam_qua_cha_me.jpg" },
        { label: "Quà tặng thầy cô", href: "/qua-tang/qua-tang-doi-tuong/qua-tang-thay-co", demoTitle: "Tranh Tri Ân Thầy Cô Dát Vàng 24K Lộc Nam", demoDesc: "Tranh chữ Tri Ân, tranh Khuê Văn Các mạ vàng tinh tế và sâu sắc.", demoImage: "/images/locnam_real/locnam_qua_thay_co.jpg" },
      ],
    },
    {
      id: "qua-tang-su-kien",
      title: "QUÀ TẶNG SỰ KIỆN",
      href: "/qua-tang/qua-tang-su-kien",
      desc: "Quà lưu niệm các dịp đại lễ & ngày kỷ niệm Lộc Nam",
      defaultDemo: {
        title: "Cúp Đồng Vinh Danh & Quà Tặng Sự Kiện",
        desc: "Cúp thể thao vinh danh, kỷ niệm chương đúc đồng mạ vàng chế tác độc bản.",
        image: "/images/demo/demo_cup_vinh_danh.jpg",
        href: "/qua-tang/qua-tang-su-kien",
        tag: "Quà Tặng Sự Kiện",
      },
      items: [
        { label: "Quà tặng tết", href: "/qua-tang/qua-tang-su-kien/qua-tang-tet", demoTitle: "Thuyền Buồm Phong Thủy Quà Tết Tân Niên Lộc Nam", demoDesc: "Biểu trưng đại cát đầu năm mới, mang lại tài lộc và hanh thông sự nghiệp.", demoImage: "/images/locnam_real/locnam_qua_tet.jpg" },
        { label: "Quà tặng tân gia", href: "/qua-tang/qua-tang-su-kien/qua-tang-tan-gia", demoTitle: "Mô Hình Thuyền Buồm Dát Vàng Quà Mừng Tân Gia Lộc Nam", demoDesc: "Thuận buồm xuôi gió đón tài nạp phúc cho gia chủ về nhà mới.", demoImage: "/images/locnam_real/locnam_thuyen_buom.jpg" },
        { label: "Quà tặng kỉ niệm ngày cưới", href: "/qua-tang/qua-tang-su-kien/qua-tang-ki-niem-ngay-cuoi", demoTitle: "Cây Mai Vàng Uyên Ương Quà Kỷ Niệm Ngày Cưới Lộc Nam", demoDesc: "Biểu tượng trăm năm hạnh phúc bền chặt, hoa mai nở rộ dát vàng hoàng gia.", demoImage: "/images/locnam_real/locnam_qua_cuoi.jpg" },
        { label: "Quà tặng mừng thọ", href: "/qua-tang/qua-tang-su-kien/qua-tang-mung-tho", demoTitle: "Quà Mừng Thọ Ông Bà Cha Mẹ Dát Vàng Lộc Nam", demoDesc: "Tranh chữ Thọ, khánh vàng mừng thọ chúc phúc lộc thọ toàn vẹn.", demoImage: "/images/locnam_real/locnam_qua_cha_me.jpg" },
        { label: "Quà tặng 20/11", href: "/qua-tang/qua-tang-su-kien/qua-tang-20-11", demoTitle: "Tranh Chữ Tri Ân Ngày Nhà Giáo 20/11 Lộc Nam", demoDesc: "Ghi nhớ công ơn người đưa đò, dát vàng 24k sang trọng và trang nhã.", demoImage: "/images/locnam_real/locnam_qua_thay_co.jpg" },
        { label: "Quà tặng 20/10 và 8/3", href: "/qua-tang/qua-tang-su-kien/qua-tang-20-10-va-8-3", demoTitle: "Tranh Chim Công Quà Tặng Phụ Nữ 20/10 & 8/3 Lộc Nam", demoDesc: "Vẻ đẹp quý phái, chim công hoa mẫu đơn mạ vàng tôn vinh nét đẹp phái nữ.", demoImage: "/images/belux/belux_qua_tang_phu_nu.jpg" },
        { label: "Cúp", href: "/qua-tang/qua-tang-su-kien/cup", demoTitle: "Cúp Đồng Vinh Danh Mạ Vàng", demoDesc: "Đúc phôi đồng mạ vàng 24k trao tặng giải thi đấu và sự kiện vinh danh.", demoImage: "/images/demo/demo_cup_vinh_danh.jpg" },
        { label: "Huy chương", href: "/qua-tang/qua-tang-su-kien/huy-chuong", demoTitle: "Huy Chương Kỷ Niệm Mạ Vàng", demoDesc: "Huy chương đúc thủ công tinh xảo trao tặng cá nhân và tập thể xuất sắc.", demoImage: "/images/demo/demo_cup_vinh_danh.jpg" },
        { label: "Biển chức danh", href: "/qua-tang/qua-tang-su-kien/bien-chuc-danh", demoTitle: "Biển Chức Danh Đồng Mạ Vàng Để Bàn", demoDesc: "Đế gỗ hương chạm hoa văn tinh tế, mặt đồng mạ vàng 24k bề thế phòng giám đốc.", demoImage: "/images/qua-tang-su-kien-hoi-nghi-bang-dong.jpg" },
      ],
    },
    {
      id: "qua-tang-phong-thuy",
      title: "QUÀ TẶNG PHONG THỦY",
      href: "/qua-tang/qua-tang-phong-thuy",
      desc: "Vật phẩm phong thủy chiêu tài, hộ thân & thăng tiến",
      defaultDemo: {
        title: "Mô Hình Thuyền Buồm Mạ Vàng 24K Lộc Nam",
        desc: "Kích hoạt cung tài lộc, giúp công việc kinh doanh buôn may bán đắt, vạn sự hanh thông.",
        image: "/images/locnam_real/locnam_thuyen_buom.jpg",
        href: "/qua-tang/qua-tang-phong-thuy",
        tag: "Phong Thủy Lộc Nam",
      },
      items: [
        { label: "Linh vật 12 con giáp", href: "/qua-tang/qua-tang-phong-thuy/linh-vat-12-con-giap", demoTitle: "Tượng Ngựa Túi Tiền Tài Lộc Mạ Vàng Lộc Nam", demoDesc: "Tượng linh vật theo tuổi bản mệnh mạ vàng 24k bảo hộ bình an, thu hút vượng khí.", demoImage: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
        { label: "Tỳ hưu", href: "/qua-tang/qua-tang-phong-thuy/ty-huu", demoTitle: "Cóc Ngậm Tiền Mạ Vàng 24K Lộc Nam", demoDesc: "Linh vật chiêu tài số 1 của làng nghề Lộc Nam mạ vàng điện phân 24k.", demoImage: "/images/locnam_real/locnam_thiem_thu.jpg" },
        { label: "Tháp văn xương", href: "/qua-tang/qua-tang-phong-thuy/thap-van-xuong", demoTitle: "Tháp Văn Xương Bằng Đồng 9 Tầng", demoDesc: "Phù trợ thi cử đỗ đạt, học hành tiến tới và thăng tiến công danh sự nghiệp.", demoImage: "/images/locnam_real/locnam_thap_van_xuong.jpg" },
        { label: "Cóc thiềm thừ", href: "/qua-tang/qua-tang-phong-thuy/coc-thiem-thu", demoTitle: "Cóc Thiềm Thừ Ngậm Tiền Mạ Vàng 24K Lộc Nam", demoDesc: "Ảnh thật chế tác tại xưởng Lộc Nam, ngậm đồng tiền vàng mang của cải dồi dào.", demoImage: "/images/locnam_real/locnam_thiem_thu.jpg" },
        { label: "Các mẫu phong thủy khác", href: "/qua-tang/qua-tang-phong-thuy/cac-mau-phong-thuy-khac", demoTitle: "Tượng Cá Chép Vượt Vũ Môn Dát Vàng Lộc Nam", demoDesc: "Ý chí kiên định vượt mọi sóng gió vươn tới thành công rực rỡ.", demoImage: "/images/belux/belux_phong_thuy.jpg" },
      ],
    },
  ];

  // Sheet 1: VỀ CHÚNG TÔI
  const aboutMenuItems = [
    {
      title: "1. Giới thiệu công ty & nghệ nhân",
      href: "/gioi-thieu",
      desc: "Lịch sử xưởng đúc đồng Lộc Nam & nghệ nhân đúc đồng bàn tay vàng",
    },
    {
      title: "2. Dịch vụ phục vụ chăm sóc khách hàng",
      href: "/gioi-thieu#dich-vu",
      desc: "Chính sách bảo hành trọn đời, đúc theo yêu cầu & giao hàng toàn quốc",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const navBoxBaseClass =
    "group relative inline-flex items-center gap-1 2xl:gap-1.5 px-2 xl:px-2.5 2xl:px-4 py-2 rounded-xl text-[11px] xl:text-xs 2xl:text-[13px] font-extrabold tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0 select-none";

  const getNavBoxClass = (path: string) => {
    const active = isActive(path);
    if (active) {
      return `${navBoxBaseClass} bg-[#dfb755]/20 text-[#ffd700] border-2 border-[#dfb755] shadow-[0_0_15px_rgba(223,183,85,0.45)]`;
    }
    return `${navBoxBaseClass} text-[#e2e8f0] bg-[#122234]/80 border border-[#1c2c3d] hover:border-[#dfb755] hover:bg-gradient-to-r hover:from-[#dfb755]/25 hover:to-[#b8860b]/20 hover:text-[#ffd700] hover:shadow-[0_0_16px_rgba(223,183,85,0.4)] hover:-translate-y-0.5 active:translate-y-0`;
  };

  return (
    <>
      <header className="w-full bg-[#070e17] border-b border-[#1c2c3d] sticky top-0 z-50 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        {/* ============================================================ */}
        {/* 1. MOBILE HEADER BAR (lg:hidden) - For mobile phones & tablets */}
        {/* ============================================================ */}
        <div className="lg:hidden flex items-center justify-between gap-3 px-3.5 sm:px-5 py-3.5 sm:py-4 bg-[#070e17] border-b border-[#1c2c3d] shadow-md">
          {/* Round Circle Logo (Bigger & Clearer) */}
          <Link href="/" className="shrink-0 flex items-center group" aria-label="Trang chủ Đồ Đồng Lộc Nam">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#122234] border-2 border-[#dfb755] p-1 flex items-center justify-center shadow-md overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/images/logo.png"
                alt="Đồ Đồng Lộc Nam"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Center Search Pill Input (Taller & Roomier) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            className="flex-1 relative"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bạn muốn tìm gì?"
                className="w-full pl-4 sm:pl-5 pr-11 py-2.5 sm:py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#dfb755] shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-3.5 text-gray-600 hover:text-[#b8860b] flex items-center justify-center transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right Hamburger Menu Icon (Bigger & Clearer) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white hover:text-[#ffd700] active:scale-95 transition-all"
            aria-label="Mở menu điều hướng"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 sm:w-8 sm:h-8 text-[#ffd700]" />
            ) : (
              <Menu className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.4]" />
            )}
          </button>
        </div>

        {/* ============================================================ */}
        {/* 2. DESKTOP NAVIGATION BAR (hidden lg:flex)                  */}
        {/* ============================================================ */}
        <div className="hidden lg:flex max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-3 2xl:px-6 py-2.5 sm:py-3 items-center justify-between gap-2 2xl:gap-5 relative">
          {/* Logo LỘC NAM */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 p-1 rounded-lg bg-[#122234] border border-[#c59b4e]/40 flex items-center justify-center group-hover:border-[#ffd700] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] group-hover:scale-105 transition-all duration-300 flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Đồ Đồng Lộc Nam"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="font-serif text-base sm:text-lg 2xl:text-xl font-black tracking-widest bg-gradient-to-r from-[#fce9b5] via-[#ffd700] to-[#dfb755] bg-clip-text text-transparent group-hover:brightness-125 transition-all">
                  LỘC NAM
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#dfb755]/20 text-[#ffd700] font-bold border border-[#dfb755]/40 hidden xs:inline-block">
                  Ý YÊN
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-[#cbd5e1] font-medium tracking-wide hidden xl:inline-block">
                Quà tặng tinh hoa - Nâng tầm giá trị
              </span>
            </div>
          </Link>

          {/* ============================================================ */}
          {/* DESKTOP NAVIGATION BAR (EXACT 6 ITEMS FROM EXCEL FILE)        */}
          {/* ============================================================ */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-3 flex-nowrap">
            {/* 1. TRANG CHỦ */}
            <Link href="/" className={getNavBoxClass("/")}>
              <span>TRANG CHỦ</span>
            </Link>

            {/* ============================================================ */}
            {/* 2. SẢN PHẨM MEGA MENU (1. Đồ thờ cúng, 2. Tượng đồng, 3. Tranh đồng, 4. Trống đồng) */}
            {/* ============================================================ */}
            <div
              className="flex-shrink-0"
              onMouseEnter={() => handleMouseEnter("products")}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/san-pham" className={getNavBoxClass("/san-pham")}>
                <span>SẢN PHẨM</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 text-[#dfb755] group-hover:text-[#ffd700] ${
                    activeDropdown === "products" ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {activeDropdown === "products" && (
                <div className="absolute top-full left-2 right-2 lg:left-3 lg:right-3 max-w-[1240px] 2xl:max-w-[1360px] mx-auto mt-2 bg-[#070e17] border-2 border-[#b8860b] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']">
                  {(() => {
                    const activeGroup =
                      productNavigationCategories.find(
                        (c) => c.id === hoveredProductCategory
                      ) || productNavigationCategories[0];

                    return (
                      <div className="grid grid-cols-12 min-h-[390px] items-stretch">
                        {/* Cột 1: Danh mục chính (Left Column - 3 cols) */}
                        <div className="col-span-3 bg-[#050c14] border-r border-[#1c2e42] p-3 space-y-1">
                          {productNavigationCategories.map((cat) => {
                            const isSelected = hoveredProductCategory === cat.id;
                            return (
                              <Link
                                key={cat.id}
                                href={cat.href}
                                prefetch={true}
                                onMouseEnter={() => {
                                  setHoveredProductCategory(cat.id);
                                  setHoveredProductSubItem(null);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#122234] text-[#ffd700] border-l-4 border-[#ffd700] shadow-sm"
                                    : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-[#0c1825]"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {isSelected ? (
                                    <span className="text-[#ffd700] text-xs">🔗</span>
                                  ) : (
                                    <span className="text-[#64748b] text-[10px]">›</span>
                                  )}
                                  <span>{cat.title}</span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Cột 2: Danh mục con (Middle Column - 5 cols, hiển thị đầy đủ chữ không bị cắt) */}
                        <div
                          className="col-span-5 p-4 xl:p-5 bg-[#070e17] border-r border-[#1c2e42] flex flex-col justify-start"
                          onMouseLeave={() => setHoveredProductSubItem(null)}
                        >
                          <div className="border-b border-[#1c2e42] pb-2 mb-3 flex items-center justify-between">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ffd700]">
                              {activeGroup.title}
                            </span>
                            <Link
                              href={activeGroup.href}
                              prefetch={true}
                              className="text-[11px] text-[#dfb755] hover:underline font-semibold"
                            >
                              Xem tất cả ›
                            </Link>
                          </div>

                          <div
                            className={`overflow-y-auto max-h-[340px] pr-2 ${
                              activeGroup.subItems.length > 8
                                ? "grid grid-cols-2 gap-x-3.5 gap-y-1.5"
                                : "space-y-1.5"
                            }`}
                          >
                            {activeGroup.subItems.map((sub, i) => {
                              const subTargetHref =
                                (sub as any).href ||
                                `${activeGroup.href}${
                                  activeGroup.href.includes("?") ? "&" : "?"
                                }sub=${encodeURIComponent(sub.query)}`;

                              return (
                                <Link
                                  key={i}
                                  prefetch={true}
                                  href={subTargetHref}
                                  onMouseEnter={() => {
                                    setHoveredProductSubItem({
                                      image: (sub as any).image || activeGroup.image,
                                      previewTitle: (sub as any).previewTitle || sub.label,
                                      previewDesc: (sub as any).previewDesc || activeGroup.previewDesc,
                                      href: subTargetHref,
                                      tag: sub.label,
                                    });
                                  }}
                                  className="text-[11px] xl:text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:translate-x-0.5 transition-all py-1.5 border-b border-[#1c2e42]/35 block uppercase tracking-wide leading-snug break-words"
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Cột 3: Ảnh minh họa lớn & nút hành động (Right Column - 4 cols) */}
                        {(() => {
                          const currentPreview = hoveredProductSubItem || {
                            image: activeGroup.image,
                            previewTitle: activeGroup.previewTitle,
                            previewDesc: activeGroup.previewDesc,
                            href: activeGroup.href,
                            tag: activeGroup.title,
                          };

                          return (
                            <div className="col-span-4 p-4 xl:p-5 bg-[#0a1524] flex flex-col justify-between">
                              <div>
                                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-[#050c14] border border-[#1c2e42] relative shadow-md">
                                  <img
                                    key={currentPreview.image}
                                    src={currentPreview.image}
                                    alt={currentPreview.previewTitle}
                                    className="w-full h-full object-cover animate-fadeIn transition-transform duration-500 hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                  <div className="absolute bottom-2.5 left-3 right-3">
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#dfb755] text-black uppercase tracking-wider">
                                      {currentPreview.tag || activeGroup.title}
                                    </span>
                                  </div>
                                </div>

                                <h4 className="font-serif text-sm font-bold text-[#ffd700] leading-snug line-clamp-2">
                                  {currentPreview.previewTitle}
                                </h4>
                                <p className="text-[11px] text-[#94a3b8] mt-1 leading-relaxed line-clamp-2">
                                  {currentPreview.previewDesc}
                                </p>
                              </div>

                              <Link
                                href={currentPreview.href}
                                prefetch={true}
                                className="mt-3.5 text-center text-xs font-black uppercase text-[#0b1622] bg-gradient-to-r from-[#dfb755] via-[#f5db8b] to-[#b8860b] hover:brightness-110 py-2.5 px-4 rounded-xl transition-all shadow-[0_2px_15px_rgba(223,183,85,0.4)] active:scale-95 block w-full"
                              >
                                {hoveredProductSubItem ? "Xem chi tiết sản phẩm ›" : "Xem tất cả sản phẩm"}
                              </Link>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* 3. QUÀ TẶNG MEGA MENU (QUÀ TẶNG ĐỐI TÁC - NGUỒN ẢNH BELUX)   */}
            {/* ============================================================ */}
            <div
              className="flex-shrink-0"
              onMouseEnter={() => handleMouseEnter("gifts")}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/qua-tang" className={getNavBoxClass("/qua-tang")}>
                <span>QUÀ TẶNG</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 text-[#dfb755] group-hover:text-[#ffd700] ${
                    activeDropdown === "gifts" ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {activeDropdown === "gifts" && (
                <div className="absolute top-full left-2 right-2 lg:left-3 lg:right-3 max-w-[1240px] 2xl:max-w-[1360px] mx-auto mt-2 bg-[#070e17] border-2 border-[#b8860b] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']">
                  {(() => {
                    const activeGift =
                      giftMegaMenu.find((g) => g.id === hoveredGiftCategory) ||
                      giftMegaMenu[0];

                    return (
                      <div className="grid grid-cols-12 min-h-[390px] items-stretch">
                        {/* Cột 1: Nhóm quà tặng chính (Left Column - 3 cols) */}
                        <div className="col-span-3 bg-[#050c14] border-r border-[#1c2e42] p-3 space-y-1">
                          {giftMegaMenu.map((group) => {
                            const isSelected = hoveredGiftCategory === group.id;
                            return (
                              <Link
                                key={group.id}
                                href={group.href}
                                prefetch={true}
                                onMouseEnter={() => {
                                  setHoveredGiftCategory(group.id);
                                  setHoveredGiftSubItem(null);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#122234] text-[#ffd700] border-l-4 border-[#ffd700] shadow-sm"
                                    : "text-[#cbd5e1] hover:text-[#ffd700] hover:bg-[#0c1825]"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {isSelected ? (
                                    <span className="text-[#ffd700] text-xs">🔗</span>
                                  ) : (
                                    <span className="text-[#64748b] text-[10px]">›</span>
                                  )}
                                  <span>{group.title}</span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Cột 2: Danh sách mục con theo nhóm (Middle Column - 5 cols, hiển thị đầy đủ chữ không bị cắt) */}
                        <div
                          className="col-span-5 p-4 xl:p-5 bg-[#070e17] border-r border-[#1c2e42] flex flex-col justify-start"
                          onMouseLeave={() => setHoveredGiftSubItem(null)}
                        >
                          <div className="border-b border-[#1c2e42] pb-2 mb-3 flex items-center justify-between">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ffd700]">
                              {activeGift.title}
                            </span>
                            <Link
                              href={activeGift.href}
                              prefetch={true}
                              className="text-[11px] text-[#dfb755] hover:underline font-semibold"
                            >
                              Xem tất cả ›
                            </Link>
                          </div>

                          <div
                            className={`overflow-y-auto max-h-[340px] pr-2 ${
                              activeGift.items.length > 7
                                ? "grid grid-cols-2 gap-x-3.5 gap-y-1.5"
                                : "space-y-1.5"
                            }`}
                          >
                            {activeGift.items.map((item, i) => (
                              <Link
                                key={i}
                                href={item.href}
                                prefetch={true}
                                onMouseEnter={() => {
                                  setHoveredGiftSubItem({
                                    image: (item as any).demoImage || activeGift.defaultDemo.image,
                                    previewTitle: (item as any).demoTitle || item.label,
                                    previewDesc: (item as any).demoDesc || activeGift.defaultDemo.desc,
                                    href: item.href,
                                    tag: item.label,
                                  });
                                }}
                                className="text-[11px] xl:text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:translate-x-0.5 transition-all py-1.5 border-b border-[#1c2e42]/35 block uppercase tracking-wide leading-snug break-words"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Cột 3: Ảnh minh họa lớn & nút hành động (Right Column - 4 cols) */}
                        {(() => {
                          const currentGiftPreview = hoveredGiftSubItem || {
                            image: activeGift.defaultDemo.image,
                            previewTitle: activeGift.defaultDemo.title,
                            previewDesc: activeGift.defaultDemo.desc,
                            href: activeGift.href,
                            tag: activeGift.title,
                          };

                          return (
                            <div className="col-span-4 p-4 xl:p-5 bg-[#0a1524] flex flex-col justify-between">
                              <div>
                                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-[#050c14] border border-[#1c2e42] relative shadow-md">
                                  <img
                                    key={currentGiftPreview.image}
                                    src={currentGiftPreview.image}
                                    alt={currentGiftPreview.previewTitle}
                                    className="w-full h-full object-cover animate-fadeIn transition-transform duration-500 hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                  <div className="absolute bottom-2.5 left-3 right-3">
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#dfb755] text-black uppercase tracking-wider">
                                      {currentGiftPreview.tag || activeGift.title}
                                    </span>
                                  </div>
                                </div>

                                <h4 className="font-serif text-sm font-bold text-[#ffd700] leading-snug line-clamp-2">
                                  {currentGiftPreview.previewTitle}
                                </h4>
                                <p className="text-[11px] text-[#94a3b8] mt-1 leading-relaxed line-clamp-2">
                                  {currentGiftPreview.previewDesc}
                                </p>
                              </div>

                              <Link
                                href={currentGiftPreview.href}
                                prefetch={true}
                                className="mt-3.5 text-center text-xs font-black uppercase text-[#0b1622] bg-gradient-to-r from-[#dfb755] via-[#f5db8b] to-[#b8860b] hover:brightness-110 py-2.5 px-4 rounded-xl transition-all shadow-[0_2px_15px_rgba(223,183,85,0.4)] active:scale-95 block w-full"
                              >
                                {hoveredGiftSubItem ? "Xem chi tiết quà tặng ›" : "Xem tất cả quà tặng"}
                              </Link>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* 4. DỰ ÁN (Công trình, sản phẩm đã hoàn thiện) */}
            <Link
              href="/du-an"
              className={getNavBoxClass("/du-an")}
              title="Công trình, sản phẩm đã hoàn thiện"
            >
              <span>DỰ ÁN</span>
            </Link>

            {/* TIN TỨC */}
            <Link
              href="/tin-tuc"
              prefetch={true}
              className={getNavBoxClass("/tin-tuc")}
              title="Tin tức, cẩm nang phong thủy & kiến thức đồ đồng"
            >
              <span>TIN TỨC</span>
            </Link>

            {/* 5. VỀ CHÚNG TÔI (Dropdown: Giới thiệu công ty & Dịch vụ CSKH) */}
            <div
              className="relative flex-shrink-0"
              onMouseEnter={() => handleMouseEnter("about")}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/gioi-thieu" className={getNavBoxClass("/gioi-thieu")}>
                <span>VỀ CHÚNG TÔI</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 text-[#dfb755] group-hover:text-[#ffd700] ${
                    activeDropdown === "about" ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {activeDropdown === "about" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#0a1420] border-2 border-[#b8860b] rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-3 z-50 space-y-2 animate-in fade-in slide-in-from-top-2">
                  {aboutMenuItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="block p-2.5 rounded-lg bg-[#101c2b] border border-[#1e3147] hover:border-[#dfb755] hover:bg-[#dfb755]/15 transition-all text-left group"
                    >
                      <div className="text-xs font-bold text-[#ffd700] group-hover:text-white transition-colors">
                        {item.title}
                      </div>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 6. LIÊN HỆ */}
            <Link href="/lien-he" className={getNavBoxClass("/lien-he")}>
              <span>LIÊN HỆ</span>
            </Link>
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Search Icon Box */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Mở khung tìm kiếm"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md border flex items-center justify-center transition-all duration-300 ${
                searchOpen
                  ? "bg-[#dfb755] text-[#0b1622] border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                  : "bg-[#122234]/70 border-[#1c2c3d] text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700]"
              }`}
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Cart Icon Box */}
            <Link
              href="/san-pham"
              aria-label="Giỏ hàng"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-[#122234]/70 border border-[#1c2c3d] flex items-center justify-center text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] hover:scale-105 active:scale-95 transition-all duration-300 relative flex-shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#0b1622] shadow-md">
                {cartCount}
              </span>
            </Link>

            {/* Hotline Box Buttons (0836 122 222 - 0846 699 997) */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <a
                href={`tel:${hotlineData.cleanPhone1}`}
                title="Gọi Hotline 1"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-[#dfb755] via-[#f5db8b] to-[#b8860b] text-[#0b1622] px-2.5 2xl:px-3 py-1.5 rounded-md font-serif text-xs font-black tracking-wider shadow-[0_4px_15px_rgba(223,183,85,0.35)] hover:brightness-110 active:scale-95 border border-[#ffe082] transition-all whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 fill-[#0b1622] text-[#0b1622] flex-shrink-0" />
                <span>{hotlineData.hotline1}</span>
              </a>
              <a
                href={`tel:${hotlineData.cleanPhone2}`}
                title="Gọi Hotline 2"
                className="hidden 2xl:inline-flex items-center gap-1 bg-[#122234] hover:bg-[#1a2f48] text-[#ffd700] hover:text-white px-2.5 py-1.5 rounded-md font-serif text-xs font-black tracking-wider border border-[#dfb755]/50 shadow-sm transition-all whitespace-nowrap active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-[#dfb755] flex-shrink-0" />
                <span>{hotlineData.hotline2}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="border-t border-[#1c2c3d] bg-[#081018] px-3 sm:px-8 py-3 animate-in fade-in slide-in-from-top-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                }
              }}
              className="max-w-[800px] mx-auto flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm đồ thờ cúng, tượng đồng, tranh dát vàng, trống đồng..."
                  className="w-full px-3.5 py-2 bg-[#122234] border border-[#1c2c3d] rounded-md text-xs sm:text-sm text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd700]/30 transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0b1622] px-4 py-2 rounded-md text-xs font-bold hover:brightness-110 transition-all flex-shrink-0 whitespace-nowrap active:scale-95"
              >
                Tìm Kiếm
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* MOBILE DRAWER NAVIGATION (ALIGNED 100% WITH EXCEL TAXONOMY)  */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Content */}
          <div className="relative ml-auto w-full max-w-[340px] sm:max-w-sm h-full bg-[#081018] text-[#f1f5f9] border-l border-[#1c2c3d] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#1c2c3d] bg-[#0b1622] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#122234] border border-[#c59b4e]/40 p-1 flex items-center justify-center">
                  <img src="/images/logo.png" alt="Lộc Nam" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="font-serif text-sm font-black tracking-widest bg-gradient-to-r from-[#fce9b5] via-[#ffd700] to-[#dfb755] bg-clip-text text-transparent">
                    ĐỒ ĐỒNG LỘC NAM
                  </div>
                  <div className="text-[9px] text-[#94a3b8]">Ý Yên, Nam Định</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-md bg-[#122234] border border-[#1c2c3d] flex items-center justify-center text-gray-300 hover:text-white"
                aria-label="Đóng menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* 1. TRANG CHỦ */}
              <Link
                href="/"
                className="flex items-center justify-between p-3 rounded-md bg-[#122234]/70 border border-[#1c2c3d] text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] transition-all"
              >
                <span>TRANG CHỦ</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>

              {/* 2. SẢN PHẨM (Accordion với 4 nhóm từ Excel) */}
              <div className="rounded-md bg-[#122234]/70 border border-[#1c2c3d] overflow-hidden">
                <button
                  onClick={() => toggleMobileAccordion("products")}
                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>SẢN PHẨM</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#dfb755]/20 text-[#ffd700]">4 Danh mục</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#dfb755] transition-transform duration-200 ${
                      mobileAccordion === "products" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileAccordion === "products" && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#1c2c3d]/60 space-y-2 bg-[#081018]/80 animate-in fade-in">
                    <Link
                      href="/san-pham"
                      className="block p-2 rounded text-xs font-semibold text-[#ffd700] bg-[#dfb755]/10 border border-[#dfb755]/30"
                    >
                      › Xem tất cả sản phẩm
                    </Link>
                    {productNavigationCategories.map((group) => (
                      <div key={group.id} className="p-2 rounded bg-[#122234]/40 border border-[#1c2c3d]/50 space-y-1">
                        <Link
                          href={group.href}
                          className="font-serif text-xs font-bold text-[#ffd700] flex items-center justify-between"
                        >
                          <span>{group.title}</span>
                          <span className="text-[9px] text-[#dfb755]">Xem tất cả ›</span>
                        </Link>
                        <div className="space-y-1 pt-1">
                          {group.subItems.slice(0, 6).map((sub, i) => (
                            <Link
                              key={i}
                              href={(sub as any).href || `${group.href}${group.href.includes("?") ? "&" : "?"}sub=${encodeURIComponent(sub.query)}`}
                              className="text-[11px] text-[#94a3b8] hover:text-[#ffd700] block pl-2"
                            >
                              - {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. QUÀ TẶNG (Accordion với QUÀ TẶNG ĐỐI TÁC, SỰ KIỆN, PHONG THỦY) */}
              <div className="rounded-md bg-[#122234]/70 border border-[#1c2c3d] overflow-hidden">
                <button
                  onClick={() => toggleMobileAccordion("gifts")}
                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>QUÀ TẶNG</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-300">Cao cấp</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#dfb755] transition-transform duration-200 ${
                      mobileAccordion === "gifts" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileAccordion === "gifts" && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#1c2c3d]/60 space-y-2 bg-[#081018]/80 animate-in fade-in">
                    <Link href="/qua-tang" className="block p-2 rounded text-xs font-semibold text-[#ffd700] bg-[#dfb755]/10 border border-[#dfb755]/30"
                    >
                      › Xem tất cả quà tặng
                    </Link>
                    {giftMegaMenu.map((group) => (
                      <div key={group.id} className="p-2 rounded bg-[#122234]/40 border border-[#1c2c3d]/50 space-y-1">
                        <Link
                          href={group.href}
                          className="font-serif text-xs font-bold text-[#ffd700] flex items-center justify-between"
                        >
                          <span>{group.title}</span>
                          <span className="text-[9px] text-[#94a3b8]">Xem thêm</span>
                        </Link>
                        <div className="space-y-1 pt-1">
                          {group.items.slice(0, 4).map((item, i) => (
                            <Link
                              key={i}
                              href={item.href}
                              className="text-[11px] text-[#94a3b8] hover:text-[#ffd700] block pl-2"
                            >
                              - {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. DỰ ÁN */}
              <Link
                href="/du-an"
                className="flex items-center justify-between p-3 rounded-md bg-[#122234]/70 border border-[#1c2c3d] text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] transition-all"
              >
                <span>DỰ ÁN</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>

              {/* TIN TỨC */}
              <Link
                href="/tin-tuc"
                prefetch={true}
                className="flex items-center justify-between p-3 rounded-md bg-[#122234]/70 border border-[#1c2c3d] text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] transition-all"
              >
                <span className="flex items-center gap-2">
                  <span>TIN TỨC</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#dfb755]/20 text-[#ffd700]">Cẩm nang</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>

              {/* 5. VỀ CHÚNG TÔI (Accordion 2 mục) */}
              <div className="rounded-md bg-[#122234]/70 border border-[#1c2c3d] overflow-hidden">
                <button
                  onClick={() => toggleMobileAccordion("about")}
                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] transition-colors"
                >
                  <span>VỀ CHÚNG TÔI</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#dfb755] transition-transform duration-200 ${
                      mobileAccordion === "about" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileAccordion === "about" && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#1c2c3d]/60 space-y-1.5 bg-[#081018]/80 animate-in fade-in">
                    {aboutMenuItems.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="block p-2 rounded text-xs text-[#cbd5e1] hover:text-[#ffd700] hover:bg-[#122234] transition-all"
                      >
                        › {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. LIÊN HỆ */}
              <Link
                href="/lien-he"
                className="flex items-center justify-between p-3 rounded-md bg-[#122234]/70 border border-[#1c2c3d] text-xs font-bold text-[#e2e8f0] hover:text-[#ffd700] hover:border-[#ffd700] transition-all"
              >
                <span>LIÊN HỆ & SHOWROOM</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>

              {/* Quick Info Box */}
              <div className="p-3.5 rounded-md bg-[#0b1622] border border-[#1c2c3d] space-y-2 mt-4 text-[11px] text-[#94a3b8]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#dfb755] flex-shrink-0 mt-0.5" />
                  <span>Xưởng đúc & 3 Showroom lớn Ý Yên, Ninh Bình & Hà Nội</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#dfb755] flex-shrink-0" />
                  <span>Hotline 24/7: 0846 699 997</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#1c2c3d] bg-[#0b1622] space-y-2.5">
              <a
                href="tel:0846699997"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#dfb755] to-[#b8860b] text-[#0b1622] py-2.5 rounded-md text-xs font-bold shadow-[0_4px_15px_rgba(223,183,85,0.4)] border border-[#ffe082] active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4 fill-[#0b1622] text-[#0b1622]" />
                <span>GỌI HOTLINE: 0846 699 997</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://zalo.me/0846699997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#0068FF] text-white text-xs font-bold active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat Zalo</span>
                </a>
                <Link
                  href="/admin/login"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#122234] border border-[#1c2c3d] text-[#e2e8f0] text-xs font-semibold hover:text-[#ffd700] active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Quản trị</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
