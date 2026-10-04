// Shared defaults prevent admin previews and storefront assets from drifting.
export const DEFAULT_HOME_CATEGORIES = [
  {
    id: "trong-dong",
    title: "TRỐNG ĐỒNG",
    subtitle: "Trống đồng lưu niệm, quà tặng ngoại giao",
    image: "/images/collections/cat_trong_dong.jpg?v=clean_cat_v6",
    href: "/san-pham/trong-dong",
  },
  {
    id: "tranh-dong",
    title: "TRANH ĐỒNG CAO CẤP",
    subtitle: "Tranh Thuận Buồm Xuôi Gió mạ vàng 24k",
    image: "/images/collections/cat_tranh_dong.jpg?v=clean_cat_v6",
    href: "/san-pham/tranh-dong",
  },
  {
    id: "tuong-dong",
    title: "TƯỢNG ĐỒNG",
    subtitle: "Tượng Phật Bà Quan Âm mạ vàng tòa sen",
    image: "/images/collections/cat_tuong_dong.jpg?v=clean_cat_v6",
    href: "/san-pham/tuong-dong",
  },
  {
    id: "do-tho",
    title: "ĐỒ THỜ CÚNG",
    subtitle: "Đỉnh đồng, tam sự, ngũ sự gia truyền",
    image: "/images/collections/cat_do_tho.jpg?v=clean_cat_v6",
    href: "/san-pham/do-tho-cung",
  },
  {
    id: "qua-tang",
    title: "QUÀ TẶNG DOANH NGHIỆP",
    subtitle: "Mô hình thuyền buồm mạ vàng, quà tặng đối tác",
    image: "/images/collections/cat_cup_golf.jpg?v=clean_cat_v6",
    href: "/qua-tang",
  },
  {
    id: "linh-vat-12-con-giap",
    title: "LINH VẬT 12 CON GIÁP",
    subtitle: "Bộ tượng phong thủy, mã thượng phong hầu",
    image: "/images/collections/cat_linh_vat_12_con_giap.jpg?v=clean_cat_v6",
    href: "/san-pham/tuong-dong/tuong-12-con-giap",
  },
];

export const DEFAULT_HOME_SLIDES = [
  {
    id: "banner-he-thong-showroom",
    title: "HỆ THỐNG 1 XƯỞNG SẢN XUẤT & 3 CỬA HÀNG TRƯNG BÀY",
    subtitle: "Đúc Đồng Gia Truyền Dương Bá Tiến - Hà Nội, Nam Định, Ninh Bình",
    image: "/images/banners/banner_he_thong_showroom_xuong_v3.webp",
    link: "/gioi-thieu",
    active: true,
  },
  {
    id: "banner-thiet-ke-thi-cong",
    title: "THIẾT KẾ - ĐÚC - THI CÔNG CÁC CÔNG TRÌNH TRÊN TOÀN QUỐC",
    subtitle: "Hotline: 0836 122 222 - 0846 699 997 | Đúc Đồng Lộc Nam",
    image: "/images/banners/banner_thiet_ke_thi_cong_toan_quoc_v3.webp",
    link: "/du-an",
    active: true,
  },
  {
    id: "3",
    title: "THIẾT KẾ CHẾ TÁC QUÀ TẶNG THEO YÊU CẦU - KIẾN TẠO DẤU ẤN THƯƠNG HIỆU",
    subtitle: "Quà Tặng Doanh Nghiệp, Hội Nghị, Cúp Vinh Danh, Thuyền Buồm Mạ Vàng",
    image: "/images/banners/banner_che_tac_qua_tang_v2.webp",
    link: "/qua-tang",
    active: true,
  },
  {
    id: "banner-dat-vang-thi-cong",
    title: "NHẬN DÁT VÀNG - THI CÔNG DỰ ÁN TRÊN TOÀN QUỐC",
    subtitle: "Hotline: 0836 122 222 - 0846 699 997 | Đúc Đồng Lộc Nam",
    image: "/images/banners/banner_dat_vang_thi_cong_v2.webp",
    link: "/san-pham/do-tho-cung",
    active: true,
  },
];

export const DEFAULT_HOME_FAVORITES = [
  {
    id: 1,
    name: "Thuyền buồm thuận buồm xuôi gió mạ vàng 24k",
    price: "8.500.000đ",
    image: "/images/prod_thuyen_buom.jpg",
    href: "/qua-tang",
    isHighlighted: false,
  },
  {
    id: 2,
    name: "Tượng ngựa phong thủy mạ vàng",
    price: "6.800.000đ",
    image: "/images/prod_tuong_ngua.jpg",
    href: "/san-pham/tuong-dong",
    isHighlighted: false,
  },
  {
    id: 3,
    name: "Tranh thuận buồm xuôi gió mạ vàng",
    price: "5.200.000đ",
    image: "/images/prod_tranh_dong.jpg",
    href: "/san-pham/tranh-dong",
    isHighlighted: true,
  },
  {
    id: 4,
    name: "Tượng Di Lặc mạ vàng phúc lộc",
    price: "4.800.000đ",
    image: "/images/prod_di_lac.jpg",
    href: "/san-pham/tuong-dong",
    isHighlighted: false,
  },
  {
    id: 5,
    name: "Mặt trống đồng đường kính 80cm khung gỗ",
    price: "7.900.000đ",
    image: "/images/prod_mat_trong.jpg",
    href: "/san-pham/trong-dong",
    isHighlighted: false,
  },
];

export const DEFAULT_HOME_VIDEOS = [
  {
    id: "v1",
    title: "Trực Tiếp Quy Trình Rót Đồng Đại Hồng Chung 1 Tấn - Chuông Đồng Đỏ Nguyên Chất Ý Yên",
    category: "QUY TRÌNH ĐÚC ĐỒNG",
    duration: "05:32",
    views: "15,420",
    image: "/images/videos/NUnVlHO1mEU.jpg",
    videoUrl: "https://www.youtube.com/watch?v=NUnVlHO1mEU",
    desc: "Cận cảnh quy trình nghệ nhân nấu đồng đỏ nguyên chất và rót khuôn đúc Tôn Tượng Phật & Đại Hồng Chung bằng đồng tại xưởng đúc đồng Lộc Nam.",
  },
  {
    id: "v2",
    title: "Nghệ Nhân Chạm Khắc Long Phụng Trên Bề Mặt Trống Đồng Đông Sơn - Tinh Xảo Từng Chi Tiết",
    category: "CHẠM KHẮC THỦ CÔNG",
    duration: "08:15",
    views: "28,910",
    image: "/images/videos/wmWQK2MBn3c.jpg",
    videoUrl: "https://www.youtube.com/watch?v=wmWQK2MBn3c",
    desc: "Từng đường nét hoa văn chạm tỉ mỉ bằng tay thể hiện tay nghề thượng thừa của nghệ nhân đúc đồng Lộc Nam.",
  },
  {
    id: "v3",
    title: "Hướng Dẫn Phân Biệt Đồng Thật Chuẩn Cát Tút Với Đồng Pha Kém Chất Lượng Ngoài Thị Trường",
    category: "KIẾN THỨC ĐỒ THỜ",
    duration: "04:45",
    views: "42,150",
    image: "/images/videos/o-vHwLilgjM.jpg",
    videoUrl: "https://www.youtube.com/watch?v=o-vHwLilgjM",
    desc: "Kinh nghiệm thực tế chọn đồng chuẩn, giữ màu bền đẹp hàng trăm năm không bị oxy hóa hay hoen gỉ.",
  },
  {
    id: "v4",
    title: "Bàn Giao Bộ Đỉnh Đồng Cát Tút Cao Cấp Cho Biệt Thự Gia Chủ Tại Starlake Tây Hồ",
    category: "BÀN GIAO CÔNG TRÌNH",
    duration: "06:20",
    views: "19,800",
    image: "/images/videos/ctwWCrZZwk4.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ctwWCrZZwk4",
    desc: "Trọn bộ đỉnh đồng cát tút ngũ sự an vị trang nghiêm trên ban thờ gia tiên của khách hàng VIP tại Hà Nội.",
  },
];

export const DEFAULT_HOME_REVIEWS = [
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

const LEGACY_DEFAULT_SETTINGS: Record<string, string> = {
    site_name: "Đồ Đồng Lộc Nam - Quà Tặng Tinh Hoa, Nâng Tầm Giá Trị",
    slogan: "Quà tặng tinh hoa - Nâng tầm giá trị",
    hotline: "0836 122 222",
    hotline2: "0846 699 997",
    zalo: "0846699997",
    email: "dodonglocnam1102@gmail.com",
    facebook_url: "https://facebook.com/dodonglocnam",
    youtube_url: "https://youtube.com/dodonglocnam",
    // Hero Banner Đầu Trang Chủ (Thuyền Buồm Phong Thủy)
    hero_tagline: "QUÀ TẶNG TINH HOA",
    hero_title1: "NÂNG TẦM",
    hero_title2: "GIÁ TRỊ",
    hero_desc: "Chuyên chế tác và cung cấp quà tặng cao cấp, đồ mỹ nghệ trang trí, quà biếu tặng dành cho doanh nghiệp, đối tác và lãnh đạo.",
    hero_image: "/images/hero_golden_ship.jpg",
    hero_btn1_text: "KHÁM PHÁ NGAY",
    hero_btn1_link: "/san-pham",
    hero_btn2_text: "TƯ VẤN QUÀ TẶNG",
    hero_btn2_link: "/lien-he",

    // 6 Featured Categories (Sản phẩm nổi bật)
    cat1_title: "TRỐNG ĐỒNG",
    cat1_desc: "Trống đồng lưu niệm, quà tặng ngoại giao",
    cat1_image: "/images/collections/cat_trong_dong.jpg?v=clean_cat_v6",
    cat1_link: "/san-pham/trong-dong",

    cat2_title: "TRANH ĐỒNG CAO CẤP",
    cat2_desc: "Tranh Thuận Buồm Xuôi Gió mạ vàng 24k",
    cat2_image: "/images/collections/cat_tranh_dong.jpg?v=clean_cat_v6",
    cat2_link: "/san-pham/tranh-dong",

    cat3_title: "TƯỢNG ĐỒNG",
    cat3_desc: "Tượng Phật Bà Quan Âm mạ vàng tòa sen",
    cat3_image: "/images/collections/cat_tuong_dong.jpg?v=clean_cat_v6",
    cat3_link: "/san-pham/tuong-dong",

    cat4_title: "ĐỒ THỜ CÚNG",
    cat4_desc: "Đỉnh đồng, tam sự, ngũ sự gia truyền",
    cat4_image: "/images/collections/cat_do_tho.jpg?v=clean_cat_v6",
    cat4_link: "/san-pham/do-tho-cung",

    cat5_title: "QUÀ TẶNG DOANH NGHIỆP",
    cat5_desc: "Mô hình thuyền buồm mạ vàng, quà tặng đối tác",
    cat5_image: "/images/collections/cat_cup_golf.jpg?v=clean_cat_v6",
    cat5_link: "/qua-tang",

    cat6_title: "LINH VẬT 12 CON GIÁP",
    cat6_desc: "Bộ tượng phong thủy, mã thượng phong hầu",
    cat6_image: "/images/collections/cat_linh_vat_12_con_giap.jpg?v=clean_cat_v6",
    cat6_link: "/san-pham/tuong-dong/tuong-12-con-giap",

    // 5 Favorite Products (Sản phẩm được yêu thích - Ảnh 2)
    fav1_name: "Thuyền buồm thuận buồm xuôi gió mạ vàng 24k",
    fav1_price: "8.500.000đ",
    fav1_image: "/images/prod_thuyen_buom.jpg",
    fav1_link: "/qua-tang",

    fav2_name: "Tượng ngựa phong thủy mạ vàng",
    fav2_price: "6.800.000đ",
    fav2_image: "/images/prod_tuong_ngua.jpg",
    fav2_link: "/san-pham/tuong-dong",

    fav3_name: "Tranh thuận buồm xuôi gió mạ vàng",
    fav3_price: "5.200.000đ",
    fav3_image: "/images/prod_tranh_dong.jpg",
    fav3_link: "/san-pham/tranh-dong",

    fav4_name: "Tượng Di Lặc mạ vàng phúc lộc",
    fav4_price: "4.800.000đ",
    fav4_image: "/images/prod_di_lac.jpg",
    fav4_link: "/san-pham/tuong-dong",

    fav5_name: "Mặt trống đồng đường kính 80cm khung gỗ",
    fav5_price: "7.900.000đ",
    fav5_image: "/images/prod_mat_trong.jpg",
    fav5_link: "/san-pham/trong-dong",

    // 8 Reviews (Dự án tiêu biểu & Đánh giá - Ảnh 1)
    rev1_name: "Bác Nguyễn Văn Thành",
    rev1_title: "Trưởng ban khánh tiết họ Nguyễn",
    rev1_location: "Ý Yên, Nam Định",
    rev1_product: "Bộ Đỉnh Đồng Ngũ Sự Cát Tút 70cm",
    rev1_tag: "ĐỒ THỜ GIA TIÊN",
    rev1_image: "/images/locnam_real/locnam_bo_do_tho.jpg",
    rev1_comment: "Đặt bộ ngũ sự thờ gia tiên cho nhà thờ họ, cả họ đều tấm tắc khen ngợi. Nước đồng vàng bóng đều, đúc dày dặn và chắc nịch, hoa văn rồng chạm tay sắc sảo. Giao hàng tận nơi đóng kiện gỗ rất cẩn thận.",

    rev2_name: "Chị Lê Hoàng Mai",
    rev2_title: "Giám đốc nhân sự Tech Group",
    rev2_location: "Thanh Xuân, Hà Nội",
    rev2_product: "Mô hình thuyền buồm mạ vàng 24k",
    rev2_tag: "QUÀ TẶNG PHONG THỦY",
    rev2_image: "/images/hero_golden_ship.jpg",
    rev2_comment: "Công ty mình đặt 10 mô hình thuyền buồm mạ vàng làm quà tri ân khách hàng VIP dịp kỷ niệm thành lập. Hộp quà bọc nhung đỏ sang trọng, có chứng nhận mạ vàng 24k rõ ràng. Khách hàng nhận ai cũng ưng ý.",

    rev3_name: "Anh Vũ Đình Khoa",
    rev3_title: "Chủ chuỗi nhà hàng ẩm thực",
    rev3_location: "Quận 1, TP. Hồ Chí Minh",
    rev3_product: "Tượng phong thủy mạ vàng 24k",
    rev3_tag: "TƯỢNG PHONG THỦY",
    rev3_image: "/images/du_an/tuong-than-tai-da-nang.jpg",
    rev3_comment: "Tượng đúc rất thần thái, từng nét chạm khắc uy dũng, mạ vàng 24k sáng bóng và mịn màng không một tì vết. Dịch vụ tư vấn của xưởng Lộc Nam rất nhiệt tình, hỗ trợ chuyển phát nhanh an toàn vào Sài Gòn.",

    rev4_name: "Bác Phạm Minh Trí",
    rev4_title: "Cựu chiến binh - Cán bộ hưu trí",
    rev4_location: "Cầu Giấy, Hà Nội",
    rev4_product: "Tranh đồng Vinh Quy Bái Tổ dát vàng",
    rev4_tag: "TRANH ĐỒNG DÁT VÀNG",
    rev4_image: "/images/locnam_real/locnam_tranh_vinh_quy.jpg",
    rev4_comment: "Bức tranh đồng dát vàng 24k treo phòng khách rất sáng và ấm cúng. Nghệ nhân lành nghề làm tỉ mỉ từng mái đình, cây đa, đoàn rước kiệu. Rất xứng đáng là thương hiệu gia truyền số 1 làng nghề Ý Yên.",

    rev5_name: "Anh Trần Quốc Bảo",
    rev5_title: "Tổng Giám Đốc Công Ty BĐS",
    rev5_location: "Hải Châu, Đà Nẵng",
    rev5_product: "Trống đồng Đông Sơn mạ vàng 1m",
    rev5_tag: "TRỐNG ĐỒNG ĐÔNG SƠN",
    rev5_image: "/images/du_an/150-trong-dong-tong-cong-ty-dong-bac.jpg",
    rev5_comment: "Trống đồng đặt tại sảnh công ty tạo điểm nhấn văn hóa cực kỳ uy nghiêm và trang trọng. Khách đối tác quốc tế ghé thăm đều khen ngợi tinh hoa chế tác của người Việt. Rất hài lòng!",

    rev6_name: "Đại Đức Thích Tâm Minh",
    rev6_title: "Trụ Trì Chùa Phúc Lâm",
    rev6_location: "Gia Viễn, Ninh Bình",
    rev6_product: "Đúc Đại Hồng Chung 1.2 Tấn & Tượng Phật",
    rev6_tag: "ĐÚC CHUÔNG CÔNG TRÌNH",
    rev6_image: "/images/du_an/dai-hong-chung-thai-nguyen.jpg",
    rev6_comment: "Tiếng chuông ngân vang thanh thoát, âm thanh trầm ấm lan toả khắp làng quê. Quy trình nấu đồng rót khuôn của nghệ nhân Lộc Nam rất trang nghiêm, bài bản và chu đáo.",

    rev7_name: "Anh Bùi Hoàng Long",
    rev7_title: "Chủ tịch HĐQT Tập đoàn Xây dựng",
    rev7_location: "Starlake Tây Hồ, Hà Nội",
    rev7_product: "Đỉnh Đồng Thất Lân Vờn Cầu Khảm Tam Khí",
    rev7_tag: "ĐỈNH ĐỒNG CAO CẤP",
    rev7_image: "/images/locnam_real/locnam_dinh_dong.jpg",
    rev7_comment: "Đỉnh đồng phong thủy cao 1m35 khảm vàng 9999, bạc trắng và đồng đỏ tam khí tinh hoa bậc nhất. Đặt vào phòng khách biệt thự toát lên đẳng cấp vương giả và phong thủy cực tốt!",

    rev8_name: "Chị Đỗ Thu Trang",
    rev8_title: "Việt kiều Đức đặt hàng gia tiên",
    rev8_location: "Berlin, CHLB Đức",
    rev8_product: "Đôi Hạc Thờ Bằng Đồng Đỏ Cỡ Lớn",
    rev8_tag: "ĐỒ THỜ PHONG THỦY",
    rev8_image: "/images/locnam_real/locnam_hac_tho.jpg",
    rev8_comment: "Dù ở nước ngoài nhưng mình rất yên tâm khi đặt hàng của xưởng Lộc Nam. Nghệ nhân quay video đúc tượng và đóng thùng xốp gỗ chuyên nghiệp gửi sang Đức an toàn nguyên vẹn 100%.",

    // Factory
    factory_name: "Xưởng Sản Xuất Đúc Đồng",
    factory_address: "829C+CJ5, Ý Yên, Ninh Bình, Việt Nam",
    factory_hotline: "0846 699 997",
    factory_map_url: "https://maps.app.goo.gl/5rQAVSTNhDzQtMebA",
    factory_image: "/images/xuong_duc.jpg",
    factory_desc: "Xưởng đúc quy mô lớn với lò đúc thủ công & đội ngũ nghệ nhân truyền thống.",

    // Showroom 1
    cs1_name: "Showroom 1 - Cơ Sở Chính",
    cs1_address: "Đường 57A - Thị trấn Lâm - Ý Yên - Nam Định",
    cs1_hotline: "0846.699.997",
    cs1_map_url: "https://maps.google.com/?q=Đường+57A,+Thị+trấn+Lâm,+Ý+Yên,+Nam+Định",
    cs1_image: "/images/showroom_1.jpg",
    cs1_desc: "Showroom chính trưng bày tượng đồng chân dung, đồ thờ ngũ sự, đỉnh đồng gia truyền.",

    // Showroom 2
    cs2_name: "Showroom 2 - KCN Ý Yên",
    cs2_address: "Khu Công Nghiệp - Ý Yên - Ninh Bình",
    cs2_hotline: "0846 699 997",
    cs2_map_url: "https://maps.app.goo.gl/JkVaZ9c9g4jGfoyH7",
    cs2_image: "/images/showroom_2.jpg",
    cs2_desc: "Tòa nhà trưng bày quy mô lớn: tượng phật, đồ đồng mỹ nghệ mạ vàng và trống đồng.",

    // Showroom 3
    cs3_name: "Showroom 3 - Hà Nội",
    cs3_address: "164A4 Nguyễn Cảnh Dị - Hoàng Mai - Hà Nội",
    cs3_hotline: "0846 699 997",
    cs3_map_url: "https://maps.google.com/?q=164A4+Nguyễn+Cảnh+Dị,+Định+Công,+Hoàng+Mai,+Hà+Nội",
    cs3_image: "/images/showroom_3.jpg",
    cs3_desc: "Trung tâm quà tặng mạ vàng 24k, mô hình thuyền buồm phong thủy & quà biếu VIP.",

    // Footer Description
    footer_about: "Xưởng đúc đồng Lộc Nam chuyên đúc tượng chân dung truyền thần, đồ thờ cúng gia tiên, quà tặng mạ vàng 24k, mô hình thuyền buồm phong thủy và trống đồng Đông Sơn cao cấp.",

    // Video Trang Chủ (Thư Viện Video Thực Tế)
    video_section_subtitle: "THƯ VIỆN VIDEO THỰC TẾ",
    video_section_title: "VIDEO QUY TRÌNH CHẾ TÁC & SẢN PHẨM",
    video_section_desc: "Kênh truyền hình & tư liệu trực quan giúp quý khách an tâm tuyệt đối về chất lượng đúc đồng thủ công"
  };

export const DEFAULT_FACILITY_SETTINGS: Record<string, string> = {
    factory_name: "Xưởng Sản Xuất Đúc Đồng Gia Truyền",
    factory_address: "829C+CJ5, Ý Yên, Ninh Bình, Việt Nam",
    factory_hotline: "0846 699 997",
    factory_map_url: "https://maps.app.goo.gl/5rQAVSTNhDzQtMebA",
    factory_image: "/images/xuong_duc.jpg",
    factory_desc: "Xưởng đúc quy mô lớn hơn 2.000m² với lò đúc thủ công truyền thống và đội ngũ hơn 30 nghệ nhân đúc tượng đồng, đồ thờ ngũ sự và đúc Đại Hồng Chung bậc nhất Việt Nam.",

    cs1_name: "Showroom 1 - Cơ Sở Chính Nam Định",
    cs1_address: "Đường 57A - Thị trấn Lâm - Ý Yên - Nam Định",
    cs1_hotline: "0846.699.997",
    cs1_map_url: "https://maps.google.com/?q=Đường+57A,+Thị+trấn+Lâm,+Ý+Yên,+Nam+Định",
    cs1_image: "/images/showroom_1.jpg",
    cs1_desc: "Showroom chính 4 tầng bề thế trưng bày hàng nghìn bộ đồ thờ đồng cát tút ngũ sự, tượng đồng chân dung truyền thần, đỉnh đồng khảm ngũ sắc và các tác phẩm đúc đồng độc bản.",

    cs2_name: "Showroom 2 - KCN Ý Yên Ninh Bình",
    cs2_address: "Khu Công Nghiệp - Ý Yên - Ninh Bình",
    cs2_hotline: "0846 699 997",
    cs2_map_url: "https://maps.app.goo.gl/JkVaZ9c9g4jGfoyH7",
    cs2_image: "/images/showroom_2.jpg",
    cs2_desc: "Tòa nhà trung tâm trưng bày quy mô lớn hiện đại: tượng Phật cỡ lớn, trống đồng Đông Sơn đúc dày dặn, tranh đồng dát vàng 24k và đồ đồng mỹ nghệ hoàng gia.",

    cs3_name: "Showroom 3 - Thủ Đô Hà Nội",
    cs3_address: "164A4 Nguyễn Cảnh Dị - Hoàng Mai - Hà Nội",
    cs3_hotline: "0846 699 997",
    cs3_map_url: "https://maps.google.com/?q=164A4+Nguyễn+Cảnh+Dị,+Định+Công,+Hoàng+Mai,+Hà+Nội",
    cs3_image: "/images/showroom_3.jpg",
    cs3_desc: "Trung tâm quà tặng mạ vàng 24k, mô hình thuyền buồm phong thủy 'Thuận Buồm Xuôi Gió', tranh dát vàng và quà biếu đối tác doanh nghiệp, ngoại giao cao cấp.",
  };

export const DEFAULT_HOME_SETTINGS: Record<string, string> = { ...LEGACY_DEFAULT_SETTINGS, ...DEFAULT_FACILITY_SETTINGS,
  home_slider_banners: JSON.stringify(DEFAULT_HOME_SLIDES), home_videos: JSON.stringify(DEFAULT_HOME_VIDEOS),
};
DEFAULT_HOME_CATEGORIES.forEach((cat, i) => {
  Object.assign(DEFAULT_HOME_SETTINGS, { [`cat${i+1}_title`]: cat.title, [`cat${i+1}_desc`]: cat.subtitle,
    [`cat${i+1}_image`]: cat.image, [`cat${i+1}_link`]: cat.href });
});
DEFAULT_HOME_REVIEWS.forEach((review, i) => {
  for (const key of ["name", "title", "location", "product", "tag", "image", "comment"] as const) {
    DEFAULT_HOME_SETTINGS[`rev${i+1}_${key}`] = review[key];
  }
});
export interface HomeCategory { id: string; title: string; subtitle: string; image: string; href: string; }
export function homeCategories(settings: Record<string, string>): HomeCategory[] {
  if (settings.home_featured_categories) {
    try { const saved = JSON.parse(settings.home_featured_categories);
      if (Array.isArray(saved)) return saved.filter(cat => cat && typeof cat.id === "string" && typeof cat.title === "string" && typeof cat.image === "string" && typeof cat.href === "string").map(cat => ({ ...cat, subtitle: cat.subtitle || "" }));
    } catch { /* Fall back to existing six-slot configuration. */ }
  }
  return DEFAULT_HOME_CATEGORIES.map((cat, idx) => ({ ...cat,
    title: settings[`cat${idx+1}_title`] || cat.title,
    subtitle: settings[`cat${idx+1}_desc`] || settings[`cat${idx+1}_subtitle`] || cat.subtitle,
    image: settings[`cat${idx+1}_image`] || cat.image,
    href: settings[`cat${idx+1}_link`] || settings[`cat${idx+1}_href`] || cat.href,
  }));
}
