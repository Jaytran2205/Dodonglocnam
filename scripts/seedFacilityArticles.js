const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const art1 = {
  title: "Nghệ Nhân Dương Bá Tiến - 40 Năm Gìn Giữ Tinh Hoa Nghề Đúc Đồng Lộc Nam",
  slug: "nghe-nhan-duong-ba-tien",
  summary:
    "Tìm hiểu về nghệ nhân Dương Bá Tiến - Bàn tay vàng với 40 năm cống hiến cho nghề đúc đồng truyền thống tại làng nghề Ý Yên, Nam Định. Gìn giữ tinh hoa nghề xưa và đưa thương hiệu Lộc Nam vươn tầm quốc gia.",
  category: "GIỚI THIỆU CƠ SỞ & XƯỞNG ĐÚC",
  thumbnail: "/images/artisan-foundry.jpg",
  tags: "nghệ nhân đúc đồng, dương bá tiến, nghệ nhân bàn tay vàng, đúc đồng lộc nam, làng nghề ý yên",
  isPublished: true,
  content: `Giữa cái nôi của làng nghề đúc đồng Vạn Điểm – Ý Yên, Nam Định với lịch sử hơn 900 năm hưng thịnh, cái tên Nghệ nhân Dương Bá Tiến – người sáng lập [Công ty TNHH Cơ Khí Đúc Lộc Nam](/gioi-thieu) đã trở thành biểu tượng cho sự bền bỉ, tài hoa và lòng tận tụy gìn giữ ngọn lửa nghề truyền thống. Với hơn bốn thập kỷ miệt mài bên khuôn đất, lò nung, người nghệ nhân mang danh hiệu 'Bàn Tay Vàng' không chỉ kế thừa tinh hoa của tiền nhân mà còn nâng tầm từng thỏi đồng thô ráp trở thành những kiệt tác đồ thờ, tượng đồng và tranh đồng mỹ nghệ mang hồn cốt dân tộc, vang danh khắp mọi miền Tổ quốc và vươn ra bạn bè quốc tế.

## Hành Trình 40 Năm Cống Hiến Cho Nghề Đúc Đồng

Sinh ra và lớn lên trên mảnh đất địa linh nhân kiệt Ý Yên, tuổi thơ của nghệ nhân Dương Bá Tiến đã gắn liền với tiếng búa gõ lách cách, mùi đất sét làm khuôn nồng ấm và ánh lửa bập bùng từ những mẻ đồng sôi sục. Được các bậc tiền bối trong dòng tộc truyền trao ngọn lửa nhiệt huyết từ thuở niên thiếu, ông xem nghề đúc đồng thủ công không đơn thuần là kế sinh nhai, mà là nghiệp duyên cả đời phải phụng sự.

Những ngày đầu học nghề là chuỗi ngày gian nan thử thách bản lĩnh. Thời điểm đó, kỹ thuật đúc đồng hoàn toàn dựa vào kinh nghiệm thủ công truyền miệng: từ khâu chọn đất sét dẻo quánh pha trấu mục, căn chỉnh nhiệt độ lò nung bằng mắt thường ở ngưỡng trên 1.200°C, cho đến khoảnh khắc rót đồng đòi hỏi sự chuẩn xác tuyệt đối từng giây. Đã có những mẻ đồng hỏng, những pho tượng rỗ bề mặt hay nứt vỡ khuôn ép ông phải làm lại từ đầu. Nhưng chính từ những thử thách khắc nghiệt ấy, ý chí sắt đá và đôi bàn tay tài hoa của người con đất Nam Định ngày càng được tôi luyện sắc sảo.

![Bằng chứng nhận hoàn thành khóa đào tạo thợ cả điêu khắc thủ công mỹ nghệ quốc tế AusAID/HASMEA trao tặng Dương Bá Tiến](/images/locnam_real/chung-chi-dao-tao-dieu-khac-duong-ba-tien.png)

Hơn 40 năm lao động sáng tạo không ngơi nghỉ, nghệ nhân Dương Bá Tiến đã đưa tinh hoa nghề cổ truyền bước qua thăng trầm thời đại, khẳng định chỗ đứng vững chắc của Đúc đồng Lộc Nam trên bản đồ thủ công mỹ nghệ Việt Nam. Quý khách có thể tìm hiểu thêm về [Quy Mô Hệ Thống 7 Phân Xưởng Sản Xuất Khép Kín Của Lộc Nam](/tin-tuc/xuong-san-xuat-duc-dong-loc-nam) để thấy rõ năng lực chế tác vượt bậc.

## Danh Hiệu 'Nghệ Nhân Bàn Tay Vàng' - Niềm Tự Hào Của Làng Nghề

Sự tận tụy chí công vô tư và trình độ kỹ nghệ xuất sắc của ông đã được Nhà nước và các hiệp hội làng nghề ghi nhận bằng danh hiệu cao quý: Nghệ nhân Bàn Tay Vàng. Đây không chỉ là một danh xưng danh dự, mà là sự tôn vinh xứng đáng cho một đời người cống hiến trọn vẹn vì sự nghiệp bảo tồn di sản văn hóa phi vật thể của dân tộc.

![Nghệ nhân Dương Bá Tiến vinh dự nhận Cúp Bàn Tay Vàng trong Chương trình Vinh danh Thương hiệu truyền thống, Gia truyền Làng nghề Việt](/images/locnam_real/le-trao-bang-vinh-danh-cup-ban-tay-vang-loc-nam.png)

Để được phong tặng danh hiệu 'Bàn Tay Vàng', người nghệ nhân phải trải qua quá trình thẩm định nghiêm ngặt về tài năng sáng tạo, số lượng tác phẩm tiêu biểu có giá trị nghệ thuật cao và những đóng góp tích cực cho cộng đồng làng nghề Ý Yên – Nam Định. Danh hiệu cúp vàng và bằng chứng nhận là bảo chứng thép cho tài năng chạm khắc tinh xảo, khả năng truyền thần vào từng pho tượng Phật, tượng danh nhân, và các bộ đại tự câu đối trang nghiêm.

![Bằng chứng nhận Cúp Bàn Tay Vàng trao tặng cho Ông Dương Bá Tiến - Công ty TNHH Cơ Khí Đúc Lộc Nam](/images/locnam_real/bang-chung-nhan-cup-ban-tay-vang-duong-ba-tien.png)

![Cận cảnh Cúp Bàn Tay Vàng danh giá mạ vàng trao tặng Nghệ nhân Dương Bá Tiến tại Ý Yên Nam Định](/images/locnam_real/cup-ban-tay-vang-duong-ba-tien-loc-nam.png)

Đối với bà con vùng đất đúc đồng Ý Yên, nghệ nhân Dương Bá Tiến chính là niềm tự hào, là tấm gương sáng truyền cảm hứng cho lớp thợ trẻ noi theo để giữ trọn ngọn lửa cha ông để lại.

## Công Ty TNHH Cơ Khí Đúc Lộc Nam - Nơi Hội Tụ Tinh Hoa

Từ nền tảng xưởng đúc gia truyền, nghệ nhân Dương Bá Tiến đã chính thức thành lập [Công Ty TNHH Cơ Khí Đúc Lộc Nam](/gioi-thieu), tạo nên bước ngoặt chuyển mình mạnh mẽ từ mô hình sản xuất nhỏ lẻ sang quy mô doanh nghiệp chuyên nghiệp và bài bản.

Lộc Nam quy tụ hệ thống nhà xưởng sản xuất quy mô lớn tại Ý Yên, được trang bị đầy đủ từ hệ thống lò nấu đồng dung tích lớn, khu tạo khuôn chuẩn chỉ cho tới phòng mạ – thếp vàng khép kín. Dưới sự dẫn dắt trực tiếp của nghệ nhân Dương Bá Tiến, công ty quy tụ đội ngũ gần 100 nghệ nhân và thợ thủ công lành nghề bậc cao.

Mọi sản phẩm xuất xưởng đều tuân thủ nghiêm ngặt quy trình thủ công khép kín 7 bước: tạo mẫu - làm khuôn đất - nung khuôn - nấu đồng nguyên chất - rót đồng - sửa nguội chạm ám - đánh bóng hoàn thiện và phủ bảo vệ. Sự kết hợp giữa kỹ thuật gia truyền và kỷ luật quản lý hiện đại giúp Đồ Đồng Lộc Nam đáp ứng hoàn hảo mọi đơn hàng từ các bộ đồ thờ gia tiên tinh xảo đến các đại công trình tượng đài tầm cỡ quốc gia.

## Sản Phẩm Đồ Đồng Lộc Nam - Tiếng Vang Khắp Cả Nước

Trải qua nhiều thập kỷ khẳng định thương hiệu, các sản phẩm của Lộc Nam đã hiện diện trang trọng trong hàng vạn gia đình, đền miếu, từ đường và các công trình văn hóa tâm linh trọng điểm:
- [Đồ thờ bằng đồng cao cấp](/san-pham/do-tho-cung): [Bộ tam sự, ngũ sự đỉnh đồng](/san-pham/do-tho-cung), [đỉnh đồng đỏ khảm ngũ sắc](/san-pham/do-tho-cung/dinh-dong), hạc ngự long quy, bát hương, mâm bồng đúc bằng đồng đỏ, đồng vàng thanh khiết với độ bền truyền đời.
- [Tượng đồng mỹ thuật & danh nhân](/san-pham/tuong-dong): Tượng Chủ tịch Hồ Chí Minh, tượng Đức Thánh Trần, tượng Phật Thích Ca, Quan Âm; đặc biệt dịch vụ [Đúc tượng chân dung bằng đồng mạ vàng](/san-pham/tuong-dong) đạt độ thần thái truyền thần sống động trên 95%.
- [Tranh đồng & Trống đồng phong thủy](/san-pham/trong-dong): Tranh Mã Đáo Thành Công, Thuận Buồm Xuôi Gió, [Trống đồng Đông Sơn & Ngọc Lũ](/san-pham/trong-dong) dát vàng 24K sang trọng, tượng trưng cho vượng khí và phú quý.
- [Quà tặng bằng đồng đối ngoại](/qua-tang): Biểu trưng trống đồng mạ vàng, tranh chữ tri ân mạ vàng 24K làm quà tặng lưu niệm cao cấp cho doanh nghiệp và cơ quan nhà nước.

Mỗi sản phẩm mang thương hiệu Lộc Nam luôn khẳng định uy tín bằng ba yếu tố cốt lõi: Đồng nguyên chất không pha tạp - Hoa văn chạm khắc thủ công sắc sảo - Bảo hành độ bền trọn đời. Nhờ đó, sản phẩm không chỉ được săn đón tại Hà Nội, TP. Hồ Chí Minh, Đà Nẵng mà còn được kiều bào tại Mỹ, Pháp, Úc, Nhật Bản trân trọng đặt hàng mang ra nước ngoài.

![Bộ đồ thờ bằng đồng đỏ khảm tam khí cao cấp chế tác thủ công bởi Đồ Đồng Lộc Nam](/images/locnam_real/locnam_bo_do_tho.jpg)

## Giá Trị Cốt Lõi - Tâm Huyết Của Nghệ Nhân

Với nghệ nhân Dương Bá Tiến, 'Chữ Tâm quý hơn chữ Vàng'. Mỗi món đồ thờ cúng bằng đồng khi đặt lên ban thờ gia tiên hay nơi cửa thiền linh thiêng đều chứa đựng sự tôn kính của con cháu đối với nguồn cội. Do đó, người thợ đúc đồng không bao giờ được phép làm ẩu, bớt xén nguyên liệu hay pha tạp hợp kim độc hại.

> 'Nghề đúc đồng cha ông truyền lại cho mình, mình không chỉ giữ cho riêng mình mà phải làm cho nó rạng danh. Khách hàng tìm đến Lộc Nam là gửi gắm niềm tin tâm linh và lòng hiếu kính, mình phải đem hết cái tâm, cái tài đúc nên những pho tượng, món đồ thờ hoàn mỹ nhất.' — Nghệ nhân Dương Bá Tiến chia sẻ.

Trước làn sóng công nghiệp hóa và sản phẩm đồng đúc máy dập khuôn giá rẻ tràn lan, Đồ Đồng Lộc Nam kiên định con đường chế tác thủ công mỹ nghệ đỉnh cao. Đó là cách nghệ nhân Dương Bá Tiến và tập thể Lộc Nam giữ gìn căn cốt văn hóa cội nguồn của người Việt cho muôn đời sau.

## Thông Tin Liên Hệ Đồ Đồng Lộc Nam
- Công ty TNHH Cơ Khí Đúc Lộc Nam
- Xưởng đúc chính: Làng nghề đúc đồng Ý Yên, Huyện Ý Yên, Tỉnh Nam Định
- Showroom trưng bày: Thị trấn Lâm, Ý Yên, Nam Định
- Hotline tư vấn trực tiếp nghệ nhân: 0336.222.222 – 0836.122.222
- Email: contact@quatanglocnam.com
- Website chính thức: https://www.quatanglocnam.com`,
};

const art2 = {
  title: "Xưởng Đúc Đồng Lộc Nam - Hệ Thống 7 Phân Xưởng Chuyên Sâu Khép Kín",
  slug: "xuong-san-xuat-duc-dong-loc-nam",
  summary:
    "Khám phá xưởng đúc đồng Lộc Nam tại Ý Yên Nam Định: 3 trụ sở sản xuất quy mô lớn, 7 phân xưởng chức năng khép kín, gần 100 thợ thủ công lành nghề và công nghệ mạ dát vàng 9999 đỉnh cao.",
  category: "GIỚI THIỆU CƠ SỞ & XƯỞNG ĐÚC",
  thumbnail: "/images/xuong_duc.jpg",
  tags: "xưởng đúc đồng, sản xuất đồ đồng, xưởng đồng lộc nam, đúc đồng trực tiếp, quy trình đúc đồng, mạ vàng 9999, thợ đúc đồng, xưởng đồng nam định, đúc đồng ý yên",
  isPublished: true,
  content: `Trong bối cảnh thị trường thủ công mỹ nghệ xuất hiện nhiều đơn vị thương mại trung gian phân phối hàng gia công trôi nổi, Xưởng đúc đồng Lộc Nam tự hào khẳng định vị thế xưởng sản xuất trực tiếp hàng đầu tại làng nghề truyền thống Ý Yên, Nam Định. Dưới sự sáng lập và dẫn dắt tài hoa của [Nghệ Nhân Dương Bá Tiến - Bàn Tay Vàng 40 Năm Nghề](/tin-tuc/nghe-nhan-duong-ba-tien), Lộc Nam sở hữu hệ thống 3 cơ sở sản xuất quy mô bề thế, đội ngũ gần 100 công nhân viên kỹ thuật cao và dây chuyền 7 phân xưởng chức năng riêng biệt, tự chủ 100% quy trình sản xuất từ khâu đắp mẫu đất sét ban đầu đến khi xuất xưởng những tuyệt tác mạ vàng 9999 hoàn mỹ.

![Toàn cảnh không gian sản xuất quy mô lớn tại hệ thống xưởng đúc đồng Lộc Nam Ý Yên Nam Định](/images/xuong_duc.jpg)

## Quy Mô Xưởng Sản Xuất Hiện Đại Tại Cái Nôi Ý Yên

Tọa lạc tại vùng lõi của làng nghề đúc đồng nức tiếng Nam Định, cơ ngơi sản xuất của [Công ty TNHH Cơ Khí Đúc Lộc Nam](/gioi-thieu) được đầu tư bài bản trên diện tích hàng trăm mét vuông, bao gồm 3 trụ sở xưởng sản xuất đồng bộ và hệ thống cửa hàng showroom trưng bày sản phẩm khang trang.

Xưởng được trang bị hệ thống giàn cẩu trục chịu tải hàng chục tấn, các cụm lò luyện đồng công suất lớn, máy nén khí, máy cắt Plasma cùng hệ thống xử lý khói bụi đảm bảo an toàn lao động và bảo vệ môi trường làng nghề. Quy mô vững chắc cùng sự quy tụ của gần 100 công nhân viên có tay nghề bậc cao chính là năng lực cốt lõi giúp Lộc Nam sẵn sàng đảm đương những dự án đúc tượng đài vĩ mô hàng chục tấn lẫn các đơn hàng quà tặng doanh nghiệp hàng nghìn sản phẩm theo tiến độ chuẩn xác.

## 7 Phân Xưởng Chuyên Biệt - Quy Trình Sản Xuất Hoàn Hảo Từ A Đến Z

Để mỗi sản phẩm đồ thờ, tranh đồng hay tượng đồng đạt đến độ tinh xảo đỉnh cao, quy trình chế tác tại Lộc Nam được tổ chức khoa học qua 7 phân xưởng chuyên biệt:

### Phân Xưởng 1: Khu Vực Điêu Khắc & Làm Mẫu Tạo Hình
Mọi kiệt tác đều khởi nguồn từ chiếc phôi mẫu chuẩn xác. Tại phân xưởng làm mẫu, các nghệ nhân điêu khắc hàng đầu trực tiếp nhào nặn đất sét hoặc đục đẽo thạch cao theo tỉ lệ nhân trắc học và đường nét cổ truyền. Từng khóe mắt, nụ cười trên tượng chân dung hay từng vảy rồng trên đỉnh đồng đều được gọt giũa tỉ mẩn, bảo đảm độ sắc nét và cái hồn sống động trước khi đem chuyển thể sang phôi đúc.

### Phân Xưởng 2: Khu Vực Tạo Khuôn Đất Thủ Công Truyền Thống
Làm khuôn là khâu then chốt quyết định sự thành bại của mẻ đúc. Phân xưởng khuôn sử dụng loại đất sét mịn được chọn lọc kỹ càng, phối trộn cùng trấu mục băm nhỏ và bột giấy bản theo tỷ lệ bí truyền nhằm tạo độ dai, xốp và khả năng chịu nhiệt cao. Khuôn gồm hai phần: khuôn âm bản (khuôn ngoài) và khuôn cốt (khuôn lõi trong). Sau khi đắp khuôn, các khối khuôn được đưa vào buồng sấy khô kiệt bằng than củi liên tục nhiều ngày đêm để loại bỏ hoàn toàn hơi ẩm, ngăn ngừa triệt để nguy cơ nứt vỡ hay rỗ khí khi rót đồng nóng chảy.

### Phân Xưởng 3: Khu Vực Đúc Đồng Thủ Công Mỹ Nghệ
Đây là trái tim rực lửa của xưởng Lộc Nam. Nơi đây bố trí các lò nung truyền thống được duy trì ở nhiệt độ cực đại trên 1.200°C. Nguyên liệu đưa vào lò là đồng đỏ thanh khiết, đồng vàng (thau) nguyên chất cùng các hợp chất dẫn dòng được tính toán tỉ mỉ. Khi mẻ đồng chuyển sang màu đỏ rực trong suốt, các nghệ nhân cả đời kinh nghiệm sẽ phối hợp nhịp nhàng vận hành gáo múc và tiến hành rót đồng vào khuôn. Dòng đồng nóng chảy cuồn cuộn lấp đầy từng ngóc ngách hoa văn trong sự nín thở và tập trung cao độ của người thợ.

![Công đoạn rót đồng sôi đỏ rực ở nhiệt độ trên 1200 độ C vào khuôn đúc thủ công](/images/artisan-foundry.jpg)

### Phân Xưởng 4: Khu Vực Đúc Đồng Công Nghiệp & Khuôn Mẫu Cháy Hiện Đại
Bên cạnh phương pháp đúc thủ công cho các sản phẩm đơn chiếc, Lộc Nam tiên phong ứng dụng công nghệ đúc khuôn mẫu cháy và máy móc hỗ trợ đúc áp lực cao. Phân xưởng này chuyên trách gia công hàng loạt các dòng [quà tặng bằng đồng lưu niệm](/qua-tang), biểu trưng đại hội, linh vật phong thủy với độ đồng đều kích thước tuyệt đối đến từng milimet, bề mặt mịn màng và năng suất vượt trội.

### Phân Xưởng 5: Khu Vực Gia Công Nguội & Chạm Khảm Tinh Xảo
Sau khi dỡ khuôn và phá bỏ lớp đất bám ngoài, phôi đồng trần được chuyển về xưởng nguội. Tại đây, những người thợ chạm bậc thầy dùng búa, ve đục chuyên dụng để mài nhẵn bavia thừa, đục rãnh và tiến hành nghệ thuật khảm tam khí (bạc, đồng đỏ, đồng vàng) hoặc khảm ngũ sắc (thêm vàng 9999 và đồng xanh). Từng sợi bạc trắng, chỉ vàng 24K được nạm sâu vào thớ đồng, miết chặt phẳng lì, tạo nên những bức họa đồ lộng lẫy và sống động cho các [Bộ đồ thờ bằng đồng ngũ sự](/san-pham/do-tho-cung).

### Phân Xưởng 6: Khu Vực Hoàn Thiện Bề Mặt & Tạo Màu Cổ Truyền
Sản phẩm sau khi chạm khắc được đưa vào quy trình đánh bóng cơ học bằng quả phớt nỉ và bột cát chuyên dụng. Tiếp đó, thợ tạo màu sẽ áp dụng các phương pháp hun màu gia truyền để tạo nên những gam màu trầm mặc cổ kính như: màu cánh gián, màu hun đen giả cổ, màu xanh rêu phong ba hoặc màu đồng đỏ nguyên bản. Cuối cùng, toàn bộ bề mặt được phủ 2 lớp sơn bảo vệ 2K bóng mờ cao cấp, chống oxy hóa, ngăn chặn tuyệt đối tình trạng ố xanh do thời tiết nóng ẩm tại Việt Nam.

### Phân Xưởng 7: Khu Vực Mạ Vàng Điện Phân & Thếp Vàng Quỳ 9999
Phân xưởng khép kín đạt tiêu chuẩn cao cấp chuyên phục vụ các đơn hàng xa xỉ. Lộc Nam ứng dụng công nghệ mạ vàng điện phân nhúng bể 24K đa lớp giúp vàng bám sâu, bóng mịn không tì vết. Đối với [Đồ thờ cúng mạ vàng 24K](/san-pham/do-tho-cung) và tượng tâm linh, các nghệ nhân tiến hành dán thếp từng lá vàng quỳ 9999 thủ công truyền thống, mang lại sắc vàng rực rỡ, ánh kim ấm áp và linh khí tôn nghiêm trường tồn cùng thời gian.

![Sản phẩm đỉnh đồng ngũ sự mạ vàng dát vàng 9999 hoàn thiện sáng bóng lộng lẫy](/images/bo-do-tho-ma-vang.jpg)

## Đội Ngũ 100 Công Nhân Viên Lành Nghề & Đầy Nhiệt Huyết

Tài sản lớn nhất làm nên uy tín thương hiệu Lộc Nam chính là con người. Xưởng quy tụ gần 100 công nhân viên, trong đó có hơn 20 nghệ nhân kinh nghiệm trên 20 - 30 năm tuổi nghề dưới sự chỉ đạo của [Nghệ Nhân Bàn Tay Vàng Dương Bá Tiến](/tin-tuc/nghe-nhan-duong-ba-tien). Đội ngũ thợ của Lộc Nam được đào tạo bài bản từ cốt cách làng nghề, luôn làm việc với tinh thần tôn kính tâm linh và trách nhiệm cao nhất với từng nét chạm trổ.

## Danh Mục Tác Phẩm Chế Tác Trực Tiếp Tại Xưởng
- [Đồ thờ bằng đồng cao cấp](/san-pham/do-tho-cung): Bộ ngũ sự, tam sự, đỉnh đồng đỏ khảm tam khí, khảm ngũ sắc.
- [Tượng đồng & Tượng Phật](/san-pham/tuong-dong): Tượng Thích Ca Mâu Ni, Quan Thế Âm Bồ Tát, tượng danh nhân, tượng chân dung thếp vàng 9999.
- [Trống đồng Đông Sơn & Ngọc Lũ](/san-pham/trong-dong): Đúc thủ công chuẩn hoa văn di sản văn hóa Việt Nam.
- [Tranh đồng phong thủy mỹ nghệ](/san-pham/tranh-dong): Tranh Vinh Quy Bái Tổ, Đồng Quê, Bát Mã Truy Phong khảm vàng bạc.
- [Đại Hồng Chung & Chuông đồng](/san-pham/dai-hong-chung): Đúc chuông chùa đại hồng chung nặng từ vài trăm kg đến hàng chục tấn, âm thanh ngân vang thanh thoát.
- [Quà tặng đối ngoại & phong thủy](/qua-tang): Tượng linh vật mạ vàng 24K, đĩa đồng lưu niệm chạm khắc theo yêu cầu.

## Cam Kết Chất Lượng Vàng Từ Đơn Vị Sản Xuất Trực Tiếp
- Sản xuất trực tiếp tại xưởng: Không qua bất kỳ khâu trung gian thương mại nào, tiết kiệm 15 - 30% chi phí cho khách hàng.
- Chuẩn chất liệu đồng: Cam kết sử dụng đồng đỏ cáp điện, đồng thau loại 1, tỷ lệ đồng trên 90 - 95%, nói không với đồng nát ve chai pha tạp chì.
- Mạ vàng thật 100%: Kiểm định chất lượng tuổi vàng 24K, 9999 theo yêu cầu của khách hàng.
- Bảo hành dài hạn: Bảo hành bề mặt 5 - 10 năm và cam kết độ bền chất liệu đồng vĩnh cửu truyền đời.

## Liên Hệ Đặt Hàng Trực Tiếp Từ Xưởng Sản Xuất Lộc Nam
- Hotline đặt hàng tận xưởng: 0336.222.222 – 0836.122.222
- Xưởng sản xuất: Cụm làng nghề đúc đồng Ý Yên, Huyện Ý Yên, Tỉnh Nam Định
- Website: https://www.quatanglocnam.com`,
};

async function seed() {
  console.log("Seeding facility articles with rich internal links into database...");
  for (const art of [art1, art2]) {
    const upserted = await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        summary: art.summary,
        content: art.content,
        thumbnail: art.thumbnail,
        category: art.category,
        tags: art.tags,
        isPublished: true,
      },
      create: art,
    });
    console.log(`[UPSERTED] ${upserted.title} (id: ${upserted.id})`);
  }
}

seed()
  .then(() => {
    console.log("Seeding completed!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
