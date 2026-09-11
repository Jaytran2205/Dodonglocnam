export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  client: string;
  location: string;
  geo?: {
    region: string;
    city: string;
    landmark: string;
  };
  category: string;
  image: string;
  gallery: string[];
  desc: string;
  content: string[];
  tags: string[];
}

export const projectsData: ProjectItem[] = [
  {
    "id": "chua-dong-yen-tu",
    "slug": "chua-dong-yen-tu-tinh-hoa-duc-dong-non-thieng",
    "title": "Công Trình Chùa Đồng Yên Tử – Đỉnh Thiêng Non Nước Với Sự Chung Sức Của Nghệ Nhân Lộc Nam",
    "date": "15/01/2026",
    "client": "Giáo Hội Phật Giáo Việt Nam & Ban Quản Lý Khu Di Tích Danh Thắng Yên Tử",
    "location": "Đỉnh thiêng Yên Tử (độ cao 1.068m), TP. Uông Bí, Tỉnh Quảng Ninh",
    "geo": {
      "region": "Đông Bắc Bộ - Quảng Ninh",
      "city": "TP. Uông Bí",
      "landmark": "Quần thể di tích danh thắng Yên Tử"
    },
    "category": "Công trình Phật giáo thế kỷ",
    "image": "/images/du_an_thucte/chua-dong-yen-tu/duc-chua-dong-yen-tu-1.jpeg",
    "gallery": [
      "/images/du_an_thucte/chua-dong-yen-tu/duc-chua-dong-yen-tu-1.jpeg",
      "/images/du_an_thucte/chua-dong-yen-tu/duc-chua-dong-yen-tu-2.jpeg",
      "/images/du_an_thucte/chua-dong-yen-tu/duc-chua-dong-yen-tu-3.jpeg",
      "/images/du_an_thucte/chua-dong-yen-tu/duc-chua-dong-yen-tu-4.jpeg",
      "/images/du_an_thucte/chua-dong-yen-tu/kinh-nghiem-du-lich-yen-tu.jpg",
      "/images/du_an_thucte/chua-dong-yen-tu/ngoi-chua-bang-dong-lon-nhat-chau-a.jpg"
    ],
    "desc": "Công trình Chùa Đồng trên đỉnh Phù Vân Yên Tử được đúc bằng đồng nguyên khối nặng hàng chục tấn, là kết tinh trí tuệ và sự đóng góp tâm huyết của toàn thể nghệ nhân làng nghề đúc đồng truyền thống, trong đó có sự tham gia tích cực và trách nhiệm của các nghệ nhân xưởng Đúc Đồng Lộc Nam.",
    "content": [
      "Chùa Đồng (tên chữ là Thiên Trúc Tự) tọa lạc trên đỉnh non thiêng Yên Tử ở độ cao 1.068m so với mực nước biển, thuộc địa phận thành phố Uông Bí, tỉnh Quảng Ninh. Đây được mệnh danh là 'kỳ quan bằng đồng' độc nhất vô nhị trên đỉnh núi cao tại Việt Nam và khu vực châu Á.",
      "Để kiến tạo nên một ngôi chùa hoàn toàn bằng hợp kim đồng chịu được sức gió bão khắc nghiệt, sương muối và thời tiết quanh năm mây mù trên đỉnh Phù Vân, công trình là sự hội tụ tinh hoa, công sức và trí tuệ của toàn thể nghệ nhân các làng nghề đúc đồng truyền thống Việt Nam, trong đó có sự đóng góp tâm huyết, tay nghề xuất sắc của các nghệ nhân đến từ xưởng Đúc Đồng Lộc Nam (Ý Yên, Nam Định).",
      "Quy chuẩn kiến trúc và kỹ thuật đúc: Ngôi chùa mô phỏng đài sen nở ngát, toàn bộ cấu kiện từ cột trụ, xà ngang, vì kèo, mái ngói âm dương, vách bưng đến ngai thờ, tượng Phật Thích Ca và tam tổ Trúc Lâm đều được đúc từ hợp kim đồng thanh khiết tỷ lệ cao, áp dụng kỹ thuật ghép mộng đồng âm dương chính xác tuyệt đối không dùng ốc vít sắt.",
      "Quy trình vận chuyển và lắp dựng: Hàng chục tấn đồng được chia thành các phân đoạn đúc tỉ mỉ dưới chân núi, sau đó các nghệ nhân và công binh gùi từng cấu kiện đồng vượt qua hàng nghìn bậc đá cheo leo lên đỉnh núi để lắp dựng hoàn thiện.",
      "Xưởng Đúc Đồng Lộc Nam luôn xem đây là niềm vinh hạnh và tự hào sâu sắc của những người con làng nghề đúc đồng truyền thống Ý Yên – Nam Định khi được góp sức mình vào biểu tượng tâm linh vĩnh cửu của Phật giáo Trúc Lâm và hồn thiêng sông núi nước Việt."
    ],
    "tags": [
      "Chùa Đồng Yên Tử",
      "Đúc đồng Quảng Ninh",
      "Nghệ nhân Lộc Nam",
      "Phật giáo Trúc Lâm",
      "Uông Bí",
      "Ý Yên Nam Định",
      "Kỳ quan đúc đồng"
    ]
  },
  {
    "id": "hoan-thien-lo-100-tuong-ran-bang-dong",
    "slug": "hoan-thien-100-tuong-ran-dong-linh-vat-qua-tang-doanh-nghiep",
    "title": "Hoàn Thiện Lô 100 Tượng Rắn Bằng Đồng – Linh Vật Phong Thủy Quà Tặng Doanh Nghiệp Đối Tác",
    "date": "18/12/2025",
    "client": "Tập Đoàn Tài Chính & Công Nghệ Đa Quốc Gia",
    "location": "Hà Nội – TP. Hồ Chí Minh – Đà Nẵng",
    "geo": {
      "region": "Toàn quốc",
      "city": "Hà Nội - TP.HCM",
      "landmark": "Quà tặng đối ngoại VIP"
    },
    "category": "Linh vật phong thủy & Quà VIP",
    "image": "/images/du_an_thucte/hoan-thien-lo-100-tuong-ran-bang-dong-linh-vat-qua/1788340187255-1783231567086153023-371304.jpg",
    "gallery": [
      "/images/du_an_thucte/hoan-thien-lo-100-tuong-ran-bang-dong-linh-vat-qua/1788340187255-1783231567086153023-371304.jpg",
      "/images/du_an_thucte/hoan-thien-lo-100-tuong-ran-bang-dong-linh-vat-qua/1788340187271-1783231567086153023-371304.jpg",
      "/images/du_an_thucte/hoan-thien-lo-100-tuong-ran-bang-dong-linh-vat-qua/1788340187284-1783231567086153023-371304.jpg",
      "/images/du_an_thucte/hoan-thien-lo-100-tuong-ran-bang-dong-linh-vat-qua/1788340187296-1783231567086153023-371304.jpg"
    ],
    "desc": "Chế tác và bàn giao thần tốc 100 tượng Rắn phong thủy bằng đồng mạ vàng 24k và hun màu giả cổ tinh xảo, phục vụ quà tặng ngoại giao tri ân khách hàng đối tác nhân dịp Tết Ất Tỵ 2025.",
    "content": [
      "Linh vật Rắn (Tỵ) trong văn hóa phương Đông và phong thủy ngũ hành đại diện cho sự uyển chuyển, mưu lược, may mắn và khả năng tái sinh vượt qua mọi thử thách.",
      "Đồ Đồng Lộc Nam tiếp nhận hợp đồng chế tác đồng loạt 100 sản phẩm tượng Rắn phong thủy từ tập đoàn đa quốc gia với yêu cầu khắt khe về độ tinh xảo hoa văn và tiến độ hoàn thiện trước thềm năm mới Ất Tỵ.",
      "Sản phẩm được ứng dụng công nghệ đúc đồng hút chân không kết hợp chạm khắc thủ công: từng lớp vảy rắn, đôi mắt sắc sảo, mình uốn lượn ngậm gậy như ý và đài sen tiền vàng chiêu tài tấn bảo.",
      "Bề mặt được điện phân mạ vàng ròng 24k sáng bóng kết hợp phủ bóng chống oxy hóa tuyệt đối, gắn chắc chắn trên đế gỗ óc chó khắc laser logo đối tác tinh tế.",
      "100 tác phẩm đã được đóng gói hộp lót lụa cao cấp, vận chuyển hỏa tốc đến các văn phòng đại diện tại Hà Nội, Đà Nẵng và TP. Hồ Chí Minh đúng hạn."
    ],
    "tags": [
      "Linh vật rắn bằng đồng",
      "Quà tặng Tết Ất Tỵ",
      "Mạ vàng 24k",
      "Phong thủy chiêu tài",
      "Ý Yên Nam Định",
      "Quà tặng doanh nghiệp"
    ]
  },
  {
    "id": "hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gia",
    "slug": "hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gia",
    "title": "Hoàn Thiện Lô Trống Đồng Lưu Niệm Biểu Trưng Cho Trung Tâm Dữ Liệu Quốc Gia",
    "date": "10/11/2025",
    "client": "Trung Tâm Dữ Liệu Quốc Gia (Bộ Công An)",
    "location": "Thủ đô Hà Nội",
    "geo": {
      "region": "Bắc Bộ - Hà Nội",
      "city": "Hà Nội",
      "landmark": "Trung tâm Dữ liệu Quốc gia"
    },
    "category": "Trống đồng lưu niệm đối ngoại",
    "image": "/images/du_an_thucte/hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gi/photo_01.jpg",
    "gallery": [
      "/images/du_an_thucte/hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gi/photo_01.jpg",
      "/images/du_an_thucte/hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gi/photo_02.jpg",
      "/images/du_an_thucte/hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gi/photo_03.jpg",
      "/images/du_an_thucte/hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gi/photo_04.jpg",
      "/images/du_an_thucte/hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gi/photo_05.jpg",
      "/images/du_an_thucte/hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gi/photo_06.jpg",
      "/images/du_an_thucte/hoan-thien-lo-trong-dong-trung-tam-du-lieu-quoc-gi/photo_07.jpg"
    ],
    "desc": "Bộ sưu tập trống đồng Đông Sơn thu nhỏ tinh xảo đúc bằng đồng vàng nguyên khối, đặt trên đế gỗ hương khắc biểu trưng logo Trung Tâm Dữ Liệu Quốc Gia.",
    "content": [
      "Trung tâm Dữ liệu Quốc gia (Bộ Công An) là công trình công nghệ trọng điểm của đất nước trong kỷ nguyên số hóa. Việc lựa chọn quà tặng đối ngoại mang tính biểu tượng văn hóa dân tộc luôn được ưu tiên hàng đầu.",
      "Xưởng Đúc Đồng Lộc Nam được vinh dự giao trọng trách đúc toàn bộ lô quà tặng trống đồng Đông Sơn và Ngọc Lũ thu nhỏ đường kính 15cm, 20cm làm quà biếu các phái đoàn quốc tế.",
      "Từng chi tiết trên mặt trống: mặt trời 14 tia sáng rực rỡ, vòng chim Lạc bay ngược chiều kim đồng hồ, cảnh giã gạo, múa cồng chiêng và thuyền chiến Đông Sơn đều được các nghệ nhân Ý Yên chạm lộng thủ công vô cùng tỉ mỉ.",
      "Vỏ trống được đúc bằng đồng vàng nguyên chất, hun màu giả cổ trang nghiêm hoặc mạ vàng 24k rực rỡ, lồng trong hộp mica trong suốt sang trọng.",
      "Dự án bàn giao hoàn hảo, góp phần quảng bá văn hóa ngàn năm văn hiến của Việt Nam đến bạn bè năm châu."
    ],
    "tags": [
      "Trống đồng Đông Sơn",
      "Trung tâm Dữ liệu Quốc gia",
      "Bộ Công An",
      "Quà đối ngoại",
      "Đồng vàng Ý Yên",
      "Hà Nội"
    ]
  },
  {
    "id": "lap-dat-tuong-thanh-mau-tu-phi-nguyen-thi-sen",
    "slug": "lap-dat-tuong-thanh-mau-to-nghe-may-mac-tam-coc-ninh-binh",
    "title": "Lắp Đặt Tượng Thánh Mẫu Tổ Nghề May Mặc Tứ Phi Nguyễn Thị Sen Tại Tam Cốc – Ninh Bình",
    "date": "05/10/2025",
    "client": "Hiệp Hội Dệt May Việt Nam & Ban Quản Lý Khu Du Lịch Tam Cốc - Bích Động",
    "location": "Khu du lịch Tam Cốc, Hoa Lư, Tỉnh Ninh Bình",
    "geo": {
      "region": "Bắc Trung Bộ - Ninh Bình",
      "city": "TP. Ninh Bình - Hoa Lư",
      "landmark": "Khu du lịch sinh thái Tam Cốc Bích Động"
    },
    "category": "Tượng đài danh nhân & Tôn vinh làng nghề",
    "image": "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/lap-dat-tuong-thanh-mau-to-nghe-may-mac-.jpg",
    "gallery": [
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/lap-dat-tuong-thanh-mau-to-nghe-may-mac-.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/photo_02.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/photo_03.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/photo_04.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/photo_05.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/photo_06.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/photo_07.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/photo_08.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/thanh-mau-1.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/thanh-mau-2.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/thanh-mau-3.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/thanh-mau-4.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/thanh-mau-5.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/thanh-mau-6.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/thanh-mau-7.jpg",
      "/images/du_an_thucte/lap-dat-tuong-thanh-mau-to-nghe-may-mac-tu-phi-hoa/thanh-mau-8.jpg"
    ],
    "desc": "Đúc và dát vàng tượng Thánh Mẫu Tứ Phi Hoàng Hậu Nguyễn Thị Sen – Tổ nghề may Việt Nam, an vị trang nghiêm tại khuôn viên danh thắng Tam Cốc - Ninh Bình.",
    "content": [
      "Đức Thánh Mẫu Nguyễn Thị Sen (Tứ phi Hoàng Hậu của vua Đinh Tiên Hoàng) là người đã có công khai sáng và truyền dạy nghề may mặc cho người dân Đại Cồ Việt, được muôn đời tôn xưng là Thánh Mẫu Tổ Nghề May Mặc Việt Nam.",
      "Công trình đúc tôn tượng Thánh Mẫu do xưởng Đồ Đồng Lộc Nam thực hiện đúc bằng đồng đỏ nguyên khối cao hơn 2m, trọng lượng gần 2 tấn, an vị trang trọng tại Đền thờ Tổ nghề may khu du lịch Tam Cốc - Ninh Bình.",
      "Toàn thân tôn tượng được dát vàng quỳ 24k thủ công truyền thống, toát lên diện mạo đoan trang, phúc hậu, đôi mắt nhân từ và dáng ngồi thanh thoát của bậc Quốc Mẫu.",
      "Từng tà áo phượng hoàng cung, hoa văn thêu dệt và chiếc kéo vàng trên tay Đức Thánh Mẫu được bàn tay nghệ nhân Ý Yên đẽo gọt sống động như thật.",
      "Công trình khánh thành là điểm hội tụ tâm linh của hàng triệu con dân ngành may mặc trên khắp dải đất hình chữ S mỗi dịp hành hương về cội nguồn Hoa Lư."
    ],
    "tags": [
      "Thánh Mẫu Nguyễn Thị Sen",
      "Tổ nghề may",
      "Tam Cốc Ninh Bình",
      "Hoa Lư",
      "Tượng đồng dát vàng 24k",
      "Đúc đồng Lộc Nam"
    ]
  },
  {
    "id": "mo-than-ha-lam",
    "slug": "duc-tuong-tho-mo-tai-mo-than-ha-lam-quang-ninh",
    "title": "Đúc Tượng Truyền Thần Người Thợ Mỏ Tại Công Ty Than Hà Lầm – TKV Quảng Ninh",
    "date": "12/08/2025",
    "client": "Công Ty Cổ Phần Than Hà Lầm – Tập Đoàn Công Nghiệp Than Khoáng Sản Việt Nam (TKV)",
    "location": "Phường Hà Lầm, TP. Hạ Long, Tỉnh Quảng Ninh",
    "geo": {
      "region": "Đông Bắc Bộ - Quảng Ninh",
      "city": "TP. Hạ Long",
      "landmark": "Công ty Than Hà Lầm TKV"
    },
    "category": "Tượng đài công nghiệp & Truyền thống",
    "image": "/images/du_an_thucte/mo-than-ha-lam/duc-tuong-tai-mo-than-ha-lam-1.jpg",
    "gallery": [
      "/images/du_an_thucte/mo-than-ha-lam/duc-tuong-tai-mo-than-ha-lam-1.jpg",
      "/images/du_an_thucte/mo-than-ha-lam/duc-tuong-tai-mo-than-ha-lam-2.jpg",
      "/images/du_an_thucte/mo-than-ha-lam/duc-tuong-tai-mo-than-ha-lam-3.jpg",
      "/images/du_an_thucte/mo-than-ha-lam/duc-tuong-tai-mo-than-ha-lam-4.jpg",
      "/images/du_an_thucte/mo-than-ha-lam/duc-tuong-tai-mo-than-ha-lam-5.jpg",
      "/images/du_an_thucte/mo-than-ha-lam/duc-tuong-tai-mo-than-ha-lam-6.jpg",
      "/images/du_an_thucte/mo-than-ha-lam/duc-tuong-tai-mo-than-ha-lam-7.jpg",
      "/images/du_an_thucte/mo-than-ha-lam/duc-tuong-tai-mo-than-ha-lam-8.jpg"
    ],
    "desc": "Dự án đúc tượng đồng người thợ mỏ Hà Lầm kiên cường, bất khuất bằng chất liệu đồng đỏ nguyên khối, thể hiện tinh thần 'Kỷ luật và Đồng tâm' của giai cấp công nhân Vùng mỏ.",
    "content": [
      "Công ty Than Hà Lầm - TKV là cái nôi giàu truyền thống cách mạng của giai cấp công nhân Vùng mỏ Quảng Ninh, nơi sở hữu những giếng than sâu hàng trăm mét dưới lòng đất.",
      "Để tri ân và ghi danh các thế hệ thợ mỏ kiên cường, Đồ Đồng Lộc Nam đã vinh dự được lựa chọn đúc pho tượng đồng biểu tượng người chiến sĩ thợ mỏ Hà Lầm.",
      "Bức tượng đặc tả hình tượng người thợ mỏ trong trang phục bảo hộ lao động, tay cầm búa khoan, đầu đội mũ lò gắn đèn chiếu sáng, nụ cười rạng ngời vượt lên trên sự khắc nghiệt của hầm lò than.",
      "Tượng được đúc bằng hợp kim đồng đỏ tiêu chuẩn độ bền ngoài trời, chống chịu tốt trước hơi muối biển Hạ Long và thời tiết khắc nghiệt.",
      "Pho tượng sừng sững tại quảng trường trung tâm điều hành mỏ, là niềm tự hào và nguồn động lực to lớn cho hàng ngàn cán bộ công nhân mỏ Than Hà Lầm."
    ],
    "tags": [
      "Than Hà Lầm",
      "Thợ mỏ Quảng Ninh",
      "Hạ Long",
      "TKV",
      "Đồng đỏ Ý Yên",
      "Tượng truyền thần công nghiệp"
    ]
  },
  {
    "id": "thi-cong-duc-tuong-bac-ho-trung-tam-quoc-gia-ha-noi",
    "slug": "duc-tuong-bac-ho-phong-tho-trung-tam-quoc-gia-ha-noi",
    "title": "Thi Công Đúc Tượng Bác Hồ Dát Vàng Tại Phòng Thờ Trung Tâm Quốc Gia Hà Nội",
    "date": "15/07/2025",
    "client": "Văn Phòng Trung Tâm Hội Nghị & Dữ Liệu Quốc Gia",
    "location": "Quận Nam Từ Liêm, Thủ đô Hà Nội",
    "geo": {
      "region": "Bắc Bộ - Hà Nội",
      "city": "Hà Nội",
      "landmark": "Trung tâm Quốc gia Hà Nội"
    },
    "category": "Tượng Bác Hồ & Không gian thờ tự",
    "image": "/images/du_an_thucte/thi-cong-duc-tuong-bac-ho-tai-phong-tho-trung-tam-/photo_01.jpg",
    "gallery": [
      "/images/du_an_thucte/thi-cong-duc-tuong-bac-ho-tai-phong-tho-trung-tam-/photo_01.jpg",
      "/images/du_an_thucte/thi-cong-duc-tuong-bac-ho-tai-phong-tho-trung-tam-/photo_02.jpg",
      "/images/du_an_thucte/thi-cong-duc-tuong-bac-ho-tai-phong-tho-trung-tam-/photo_03.jpg",
      "/images/du_an_thucte/thi-cong-duc-tuong-bac-ho-tai-phong-tho-trung-tam-/photo_04.jpg",
      "/images/du_an_thucte/thi-cong-duc-tuong-bac-ho-tai-phong-tho-trung-tam-/photo_05.jpg",
      "/images/du_an_thucte/thi-cong-duc-tuong-bac-ho-tai-phong-tho-trung-tam-/photo_06.jpg"
    ],
    "desc": "Chế tác và an vị tượng Chủ tịch Hồ Chí Minh ngồi ngai dát vàng 9999 trang nghiêm cùng bộ đồ thờ thất lân khảm tam khí tại phòng thờ tưởng niệm Trung tâm Quốc gia.",
    "content": [
      "Phòng thờ tưởng niệm Chủ tịch Hồ Chí Minh tại Trung tâm Quốc gia Hà Nội là địa điểm tôn nghiêm bậc nhất phục vụ các nghi lễ dâng hương, báo công của các phái đoàn Trung ương và quốc tế.",
      "Đồ Đồng Lộc Nam đảm nhiệm toàn bộ khâu chế tác tôn tượng Bác Hồ ngồi ghế mây đăm chiêu nghĩ việc nước bằng đồng đỏ thanh khiết, bề mặt dát kín từng lá vàng quỳ 9999 rực rỡ.",
      "Đi kèm là hệ thống đồ thờ đồng đúc đỉnh cao: Đôi hạc ngự long quy cao 1m8, đỉnh đồng chạm rồng vờn cầu khảm tam khí, bát hương rồng chầu mặt nguyệt và đôi chân nến tứ linh.",
      "Không gian thờ tự hoàn thành toát lên vẻ trang trọng, ấm cúng và uy nghiêm, thể hiện tấm lòng tôn kính vô hạn của muôn triệu người dân đối với vị Cha già kính yêu của dân tộc."
    ],
    "tags": [
      "Tượng Bác Hồ dát vàng",
      "Hà Nội",
      "Trung tâm Quốc gia",
      "Đồ thờ khảm tam khí",
      "Đồng đỏ Ý Yên"
    ]
  },
  {
    "id": "duc-tuong-bac-ho-hoc-vien-chinh-tri",
    "slug": "duc-tuong-chu-tich-ho-chi-minh-hoc-vien-chinh-tri",
    "title": "Đúc Tượng Chủ Tịch Hồ Chí Minh Bằng Đồng Tại Học Viện Chính Trị",
    "date": "19/05/2025",
    "client": "Học Viện Chính Trị – Bộ Quốc Phòng",
    "location": "Quận Hà Đông, TP. Hà Nội",
    "geo": {
      "region": "Bắc Bộ - Hà Nội",
      "city": "Hà Đông, Hà Nội",
      "landmark": "Học viện Chính trị Bộ Quốc Phòng"
    },
    "category": "Tượng danh nhân & Quân đội",
    "image": "/images/du_an_thucte/duc-tuong-bac-ho-hoc-vien-chinh-tri/duc-tuong-chu-tich-ho-chi-minh-hoc-vien-.jpg",
    "gallery": [
      "/images/du_an_thucte/duc-tuong-bac-ho-hoc-vien-chinh-tri/duc-tuong-chu-tich-ho-chi-minh-hoc-vien-.jpg",
      "/images/du_an_thucte/duc-tuong-bac-ho-hoc-vien-chinh-tri/photo_01.jpg",
      "/images/du_an_thucte/duc-tuong-bac-ho-hoc-vien-chinh-tri/photo_02.jpg",
      "/images/du_an_thucte/duc-tuong-bac-ho-hoc-vien-chinh-tri/photo_03.jpg",
      "/images/du_an_thucte/duc-tuong-bac-ho-hoc-vien-chinh-tri/photo_04.jpg",
      "/images/du_an_thucte/duc-tuong-bac-ho-hoc-vien-chinh-tri/photo_05.jpg"
    ],
    "desc": "Công trình đúc tượng Bác Hồ bán thân bằng đồng catut thanh khiết chào mừng ngày sinh nhật Bác tại hội trường lớn Học viện Chính trị.",
    "content": [
      "Kỷ niệm ngày sinh nhật Bác 19/5, Học viện Chính trị (Bộ Quốc Phòng) đã tổ chức lễ đón nhận và an vị tượng đồng Chủ tịch Hồ Chí Minh do Đồ Đồng Lộc Nam chế tác.",
      "Tôn tượng Bác được đúc bằng đồng catut (vỏ đạn quân sự) nguyên chất, sở hữu sắc vàng ánh kim đặc trưng, độ dẻo dai và khả năng chống oxy hóa vượt trội.",
      "Khuôn mặt Bác toát lên vầng trán mênh mông, chòm râu hiền từ, ánh mắt sáng ngời soi rọi lý tưởng cộng sản cho các thế hệ học viên quân đội.",
      "Tượng được đặt trang trọng tại lễ đài hội trường trung tâm, là điểm tựa tinh thần vững chắc cho công tác giáo dục chính trị tư tưởng toàn quân."
    ],
    "tags": [
      "Tượng Bác Hồ",
      "Học viện Chính trị",
      "Bộ Quốc Phòng",
      "Đồng catut",
      "Hà Đông Hà Nội"
    ]
  },
  {
    "id": "duc-tuong-va-dat-vang-tai-chua-hai-phong",
    "slug": "duc-tuong-phat-va-dat-vang-toan-bo-do-tho-tai-hai-phong",
    "title": "Đúc Tượng Phật Và Thi Công Dát Vàng Toàn Bộ Đồ Thờ Tại Chùa – Hải Phòng",
    "date": "25/04/2025",
    "client": "Ban Trị Sự Chùa Cổ & Phật Tử Thập Phương",
    "location": "Quận Lê Chân, TP. Hải Phòng",
    "geo": {
      "region": "Duyên hải Bắc Bộ - Hải Phòng",
      "city": "TP. Hải Phòng",
      "landmark": "Chùa cổ Lê Chân Hải Phòng"
    },
    "category": "Tượng Phật & Dát vàng đồ thờ",
    "image": "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/duc-va-thi-cong-dat-vang-toan-bo-do-tho-.jpg",
    "gallery": [
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/duc-va-thi-cong-dat-vang-toan-bo-do-tho-.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_01.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_02.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_03.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_04.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_05.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_06.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_07.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_08.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_09.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_10.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_11.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_12.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_13.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_14.jpg",
      "/images/du_an_thucte/duc-tuong-va-dat-vang-tai-chua-hai-phong/photo_15.jpg"
    ],
    "desc": "Dự án đúc bộ tượng Phật Tam Thế, tượng Quan Âm Bồ Tát bằng đồng đỏ và dát vàng toàn bộ hệ thống đại đỉnh đồng, đôi hạc, cuốn thư câu đối trong chánh điện.",
    "content": [
      "Tại thành phố hoa phượng đỏ Hải Phòng, xưởng Đồ Đồng Lộc Nam đã hoàn tất đại dự án đúc tượng Phật và dát vàng toàn bộ không gian nội tự ngôi chùa cổ trăm năm tuổi.",
      "Công trình bao gồm: Đúc tôn tượng Tam Thế Phật cao 2m5 bằng đồng đỏ nguyên khối, tượng Bồ Tát Quán Thế Âm ngự đài sen và hệ thống bát bộ kim cương uy nghiêm.",
      "Các nghệ nhân dát vàng làng nghề Ý Yên đã thếp vàng 24k thủ công toàn bộ bàn thờ, cuốn thư câu đối chữ Hán khảm nổi và cặp hạc thờ chầu đỉnh đồng.",
      "Không gian chánh điện sau khi hoàn thành rực rỡ ánh hào quang kim sắc, mang đến sự thanh tịnh vô biên cho hàng vạn Tăng Ni Phật tử hành hương chiêm bái."
    ],
    "tags": [
      "Tượng Phật Hải Phòng",
      "Tam Thế Phật",
      "Dát vàng 24k chánh điện",
      "Đồ thờ đồng đỏ",
      "Lê Chân Hải Phòng"
    ]
  },
  {
    "id": "tuong-bac-ho-son-la",
    "slug": "duc-tuong-bac-ho-vay-tay-chao-tai-son-la",
    "title": "Đúc Tượng Bác Hồ Vẫy Tay Chào Bằng Đồng Đỏ Cỡ Lớn Tại Quảng Trường Sơn La",
    "date": "18/05/2024",
    "client": "Tỉnh Ủy & HĐND & UBND Tỉnh Sơn La",
    "location": "Quảng trường Tây Bắc, TP. Sơn La",
    "geo": {
      "region": "Tây Bắc Bộ - Sơn La",
      "city": "TP. Sơn La",
      "landmark": "Quảng trường Tây Bắc"
    },
    "category": "Tượng đài công trình cấp quốc gia",
    "image": "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-1.jpg",
    "gallery": [
      "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-1.jpg",
      "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-2.jpg",
      "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-3.jpg",
      "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-4.jpg",
      "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-5.jpg",
      "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-6.jpg",
      "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-7.jpg",
      "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-8.jpg",
      "/images/du_an_thucte/tuong-bac-ho-son-la/duc-tuong-bac-ho-chao-tai-son-la-9.jpg"
    ],
    "desc": "Công trình tượng đài Chủ tịch Hồ Chí Minh với đồng bào các dân tộc Tây Bắc đúc bằng hợp kim đồng đỏ tiêu chuẩn tượng đài quốc gia nặng hàng chục tấn.",
    "content": [
      "Tượng đài 'Bác Hồ với đồng bào các dân tộc Tây Bắc' tại Quảng trường Tây Bắc, TP. Sơn La là công trình biểu tượng trường tồn mang tầm vóc quốc gia.",
      "Tượng khắc họa hình ảnh Bác Hồ kính yêu trong bộ âu phục giản dị, tay vẫy chào ấm áp tình thương yêu dành cho đồng bào các dân tộc miền rẻo cao Tây Bắc.",
      "Đồ Đồng Lộc Nam cùng các nghệ nhân hàng đầu đúc pho tượng bằng hợp kim đồng đỏ chất lượng cao, nặng hàng chục tấn, đảm bảo vững chãi trước gió núi mây mù biên cương.",
      "Bề mặt tượng được xử lý hóa học tạo màu cánh gián trầm ấm, phủ lớp bảo vệ bề mặt chống ăn mòn thời tiết, bảo hành vĩnh cửu hàng trăm năm."
    ],
    "tags": [
      "Tượng đài Bác Hồ",
      "Sơn La",
      "Quảng trường Tây Bắc",
      "Đồng đỏ nguyên khối",
      "Tượng đài quốc gia"
    ]
  },
  {
    "id": "tuong-than-tai-da-nang",
    "slug": "duc-tuong-than-tai-bang-dong-da-nang",
    "title": "Đúc Tượng Thần Tài Bằng Đồng Số Lượng Lớn Tại Khu Du Lịch Đà Nẵng",
    "date": "04/05/2024",
    "client": "Tập Đoàn Du Lịch & Khách Sạn Đà Nẵng",
    "location": "Huyện Hòa Vang, TP. Đà Nẵng",
    "geo": {
      "region": "Duyên hải Nam Trung Bộ - Đà Nẵng",
      "city": "TP. Đà Nẵng",
      "landmark": "Khu du lịch tâm linh Núi Thần Tài"
    },
    "category": "Tượng phong thủy tâm linh",
    "image": "/images/du_an_thucte/tuong-than-tai-da-nang/photo_01.jpg",
    "gallery": [
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_01.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_02.jpeg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_03.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_04.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_05.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_06.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_07.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_08.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_09.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_10.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_11.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_12.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_13.jpg",
      "/images/du_an_thucte/tuong-than-tai-da-nang/photo_14.jpg"
    ],
    "desc": "Đúc đồng loạt bộ tượng Thần Tài chiêu tài tấn bảo bằng đồng thau nguyên khối mạ vàng sáng bóng phục vụ không gian tâm linh và du khách thập phương.",
    "content": [
      "Đà Nẵng – thủ phủ du lịch miền Trung nơi đón hàng triệu lượt du khách trong và ngoài nước mỗi năm, việc kiến tạo không gian văn hóa tâm linh cầu may tài lộc là điểm nhấn đặc biệt.",
      "Xưởng Đồ Đồng Lộc Nam đã hoàn thành xuất sắc hợp đồng đúc hàng chục pho tượng Thần Tài cỡ lớn và trung bình bằng đồng vàng thanh khiết.",
      "Tượng Thần Tài với dáng ngồi ung dung trên đống tiền vàng, tay cầm như ý, nụ cười hoan hỷ mang năng lượng an lạc, vượng khí hanh thông cho du khách chiêm bái.",
      "Toàn bộ bề mặt được mạ vàng 24k bảo vệ chống muối biển miền Trung, bền bỉ cùng thời gian."
    ],
    "tags": [
      "Tượng Thần Tài",
      "Đà Nẵng",
      "Hòa Vang",
      "Đồng mạ vàng 24k",
      "Phong thủy tài lộc"
    ]
  },
  {
    "id": "bien-dong-cau-cha-la-ninh-binh",
    "slug": "bien-dong-khanh-thanh-cau-cha-la-ninh-binh",
    "title": "Biển Đồng Khánh Thành Cầu Chà Là – Công Trình Chào Mừng Đại Hội Đảng Bộ Ninh Bình",
    "date": "09/10/2025",
    "client": "UBND Tỉnh Ninh Bình & Ban Quản Lý Dự Án Giao Thông",
    "location": "Thành phố Hoa Lư, Tỉnh Ninh Bình",
    "geo": {
      "region": "Đồng bằng sông Hồng - Ninh Bình",
      "city": "Hoa Lư, Ninh Bình",
      "landmark": "Cầu Chà Là - Trung tâm Ninh Bình"
    },
    "category": "Biển đồng công trình",
    "image": "/images/du_an_thucte/bien-dong-khanh-thanh-cau-cha-la-cong-trinh-chao-m/bien-dong-cong-trinh-1-1.jpg",
    "gallery": [
      "/images/du_an_thucte/bien-dong-khanh-thanh-cau-cha-la-cong-trinh-chao-m/bien-dong-cong-trinh-1-1.jpg",
      "/images/du_an_thucte/bien-dong-khanh-thanh-cau-cha-la-cong-trinh-chao-m/bien-dong-cong-trinh-2-1.jpg",
      "/images/du_an_thucte/bien-dong-khanh-thanh-cau-cha-la-cong-trinh-chao-m/bien-dong-cong-trinh-3-1.jpg",
      "/images/du_an_thucte/bien-dong-khanh-thanh-cau-cha-la-cong-trinh-chao-m/bien-dong-cong-trinh-4-1.jpg",
      "/images/du_an_thucte/bien-dong-khanh-thanh-cau-cha-la-cong-trinh-chao-m/bien-dong-cong-trinh-5-1.jpg"
    ],
    "desc": "Công trình đúc biển đồng khánh thành Cầu Chà Là nặng gần 1 tấn bằng đồng đỏ thanh khiết, bề mặt gia công phủ bóng chống ăn mòn thời tiết.",
    "content": [
      "Biển đồng Cầu Chà Là (Cha La Bridge) là công trình biểu tượng chào mừng Đại hội Đảng bộ tỉnh Ninh Bình.",
      "Đồ Đồng Lộc Nam vinh dự đúc nguyên khối tấm biển bằng đồng đỏ dày 15mm, chạm khắc hình tượng sông núi Tràng An và biểu trưng cầu thế kỷ mới.",
      "Bề mặt được xử lý bằng 3 lớp màng bảo vệ 2K ngoài trời chịu nắng mưa sương muối, bảo hành độ bóng sáng hơn 50 năm.",
      "Công trình hoàn thành nhận được sự đánh giá tuyệt đối từ lãnh đạo tỉnh và nhân dân địa phương."
    ],
    "tags": [
      "Biển đồng Cầu Chà Là",
      "Ninh Bình",
      "Hoa Lư",
      "Đồng đỏ nguyên chất",
      "Công trình giao thông"
    ]
  },
  {
    "id": "tuong-bac-ho-thanh-tra-nghe-an",
    "slug": "lap-dat-tuong-bac-ho-do-tho-thanh-tra-nghe-an",
    "title": "Thi Công Lắp Đặt Tượng Bác Hồ & Đồ Thờ Cho Thanh Tra Tỉnh Nghệ An",
    "date": "16/11/2023",
    "client": "Cơ Quan Thanh Tra Tỉnh Nghệ An",
    "location": "TP. Vinh, Tỉnh Nghệ An",
    "geo": {
      "region": "Bắc Trung Bộ - Nghệ An",
      "city": "TP. Vinh",
      "landmark": "Thanh tra Tỉnh Nghệ An"
    },
    "category": "Tượng danh nhân & Phòng truyền thống",
    "image": "/images/du_an_thucte/thi-cong-lap-dat-tuong-bac-ho-do-tho-bang-dong-cho/photo_01.jpg",
    "gallery": [
      "/images/du_an_thucte/thi-cong-lap-dat-tuong-bac-ho-do-tho-bang-dong-cho/photo_01.jpg",
      "/images/du_an_thucte/thi-cong-lap-dat-tuong-bac-ho-do-tho-bang-dong-cho/photo_02.jpg",
      "/images/du_an_thucte/thi-cong-lap-dat-tuong-bac-ho-do-tho-bang-dong-cho/photo_03.jpg",
      "/images/du_an_thucte/thi-cong-lap-dat-tuong-bac-ho-do-tho-bang-dong-cho/photo_04.jpg",
      "/images/du_an_thucte/thi-cong-lap-dat-tuong-bac-ho-do-tho-bang-dong-cho/photo_05.jpg"
    ],
    "desc": "Đúc tượng Bác Hồ bán thân cao 1m2 bằng đồng đỏ thanh khiết, diện mạo chân thực cùng bộ đồ thờ khảm tam khí uy nghiêm tại phòng tưởng niệm.",
    "content": [
      "Tại quê hương Nam Đàn - Nghệ An của Bác Hồ kính yêu, Đồ Đồng Lộc Nam hoàn thành dự án chế tác không gian tưởng niệm Chủ tịch Hồ Chí Minh tại trụ sở Thanh tra tỉnh.",
      "Tượng Bác Hồ bán thân được đúc bằng đồng đỏ dây điện nguyên chất, ánh mắt sáng ngời nhân từ và chòm râu hiền hậu.",
      "Bộ đồ thờ đi kèm bao gồm đỉnh đồng thất lân, đôi hạc ngự long quy và bát hương khảm tam khí tinh xảo.",
      "Là nơi cán bộ công chức cơ quan báo công dâng Bác trong các dịp lễ lớn của ngành."
    ],
    "tags": [
      "Tượng Bác Hồ",
      "Thanh tra Nghệ An",
      "TP Vinh",
      "Đồ thờ khảm tam khí",
      "Đồng đỏ Ý Yên"
    ]
  },
  {
    "id": "qua-tang-banh-pia-tan-hue-vien",
    "slug": "thi-cong-qua-tang-dong-tan-hue-vien",
    "title": "Thi Công Số Lượng Lớn Quà Tặng Cho Công Ty Bánh Pía Tân Huê Viên",
    "date": "24/09/2023",
    "client": "Công Ty Chế Biến Thực Phẩm Bánh Pía Lạp Xưởng Tân Huê Viên",
    "location": "Huyện Châu Thành, Tỉnh Sóc Trăng",
    "geo": {
      "region": "Đồng bằng sông Cửu Long - Sóc Trăng",
      "city": "Sóc Trăng",
      "landmark": "Khu du lịch Tân Huê Viên Sóc Trăng"
    },
    "category": "Quà tặng doanh nghiệp",
    "image": "/images/du_an_thucte/thi-cong-so-luong-lon-san-pham-qua-tang-cho-cong-t/photo_01.jpg",
    "gallery": [
      "/images/du_an_thucte/thi-cong-so-luong-lon-san-pham-qua-tang-cho-cong-t/photo_01.jpg",
      "/images/du_an_thucte/thi-cong-so-luong-lon-san-pham-qua-tang-cho-cong-t/photo_02.jpg",
      "/images/du_an_thucte/thi-cong-so-luong-lon-san-pham-qua-tang-cho-cong-t/photo_03.jpg",
      "/images/du_an_thucte/thi-cong-so-luong-lon-san-pham-qua-tang-cho-cong-t/photo_04.jpg"
    ],
    "desc": "Sản xuất đồng loạt 500 bộ quà tặng mô hình đúc đồng dát vàng kỷ niệm 40 năm thành lập thương hiệu bánh pía lạp xưởng hàng đầu Việt Nam.",
    "content": [
      "Doanh nghiệp bánh pía Tân Huê Viên (Sóc Trăng) – thương hiệu ẩm thực danh tiếng miền Tây đã tin tưởng lựa chọn xưởng Lộc Nam chế tác quà tặng tri ân đối tác.",
      "500 sản phẩm biểu trưng đúc đồng mạ vàng 24k sáng bóng, gắn đế pha lê đen sang trọng khắc logo thương hiệu sắc nét.",
      "Từng sản phẩm đi kèm hộp quà lụa đỏ cao cấp in nhũ vàng, thể hiện lòng hiếu khách và vị thế của doanh nghiệp.",
      "Bàn giao thành công đúng hẹn toàn bộ 500 bộ quà tặng tại Sóc Trăng."
    ],
    "tags": [
      "Tân Huê Viên",
      "Sóc Trăng",
      "Miền Tây",
      "Quà tặng mạ vàng 24k",
      "Doanh nghiệp đối ngoại"
    ]
  },
  {
    "id": "50-doi-loc-binh-tong-cuc-cong-nghiep-bo-quoc-phong",
    "slug": "50-doi-loc-binh-dong-tong-cuc-cong-nghiep-bo-quoc-phong",
    "title": "Đúc Và Thi Công 50 Đôi Lọ Lộc Bình Bằng Đồng Cho Tổng Cục Công Nghiệp Bộ Quốc Phòng",
    "date": "23/09/2023",
    "client": "Tổng Cục Công Nghiệp Quốc Phòng (Bộ Quốc Phòng)",
    "location": "Thủ đô Hà Nội",
    "geo": {
      "region": "Bắc Bộ - Hà Nội",
      "city": "Hà Nội",
      "landmark": "Tổng cục Công nghiệp Quốc phòng"
    },
    "category": "Lộc bình đồng công trình",
    "image": "/images/du_an_thucte/duc-va-thi-cong-50-doi-lo-loc-binh-bang-dong-cho-t/lo-loc-binh-bang-dong-kham-2.jpg",
    "gallery": [
      "/images/du_an_thucte/duc-va-thi-cong-50-doi-lo-loc-binh-bang-dong-cho-t/lo-loc-binh-bang-dong-kham-2.jpg",
      "/images/du_an_thucte/duc-va-thi-cong-50-doi-lo-loc-binh-bang-dong-cho-t/lo-loc-binh-bang-dong-kham-3.jpg",
      "/images/du_an_thucte/duc-va-thi-cong-50-doi-lo-loc-binh-bang-dong-cho-t/lo-loc-binh-bang-dong-kham-4.jpg",
      "/images/du_an_thucte/duc-va-thi-cong-50-doi-lo-loc-binh-bang-dong-cho-t/lo-loc-binh-bang-dong-kham-5.jpg",
      "/images/du_an_thucte/duc-va-thi-cong-50-doi-lo-loc-binh-bang-dong-cho-t/lo-loc-binh-bang-dong-kham-6.jpg"
    ],
    "desc": "Đúc 50 đôi lọ lộc bình khảm ngũ sắc cao 1m55 chạm khắc cảnh Tứ Quý và Tứ Linh uy nghiêm bố trí tại các nhà truyền thống quân đội trên cả nước.",
    "content": [
      "Tổng cục Công nghiệp Quốc phòng với yêu cầu sản phẩm trưng bày khắt khe về tính bền vững và sự uy nghiêm.",
      "Xưởng Đồ Đồng Lộc Nam hoàn thành xuất sắc hợp đồng đúc và khảm thủ công 50 đôi lộc bình cỡ lớn cao 1m55, mỗi đôi nặng trên 200kg.",
      "Chất liệu đồng đỏ khảm ngũ sắc: Vàng 9999, Bạc lá 999, Đồng đỏ, Đồng xanh và Đồng đen huyền bí.",
      "Phân bổ an toàn đến các đơn vị trực thuộc Tổng cục trên toàn quốc."
    ],
    "tags": [
      "Lộc bình ngũ sắc",
      "Bộ Quốc Phòng",
      "Hà Nội",
      "Đồng đỏ nguyên khối",
      "Quân đội nhân dân"
    ]
  }
];
