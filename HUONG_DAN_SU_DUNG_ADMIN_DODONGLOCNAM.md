# SỔ TAY HƯỚNG DẪN QUẢN TRỊ NỘI DUNG VÀ VẬN HÀNH WEBSITE
## ĐỒ ĐỒNG LỘC NAM (Ý YÊN - NAM ĐỊNH)
*Phiên bản hệ thống: 2.0 (High Performance Engine) | Bản quyền phát triển: jaydev*

---

## MỤC LỤC TỔNG QUAN

1. **[PHẦN 1: ĐĂNG NHẬP & TỔNG QUAN GIAO DIỆN](#phan-1)**
   - 1.1. Đường dẫn truy cập và đăng nhập hệ thống
   - 1.2. Phân cấp quyền tài khoản (Super Admin / Admin / Editor)
   - 1.3. Cấu trúc thanh điều hướng chính (Admin Sidebar)
2. **[PHẦN 2: BẢNG ĐIỀU KHIỂN & BÁO CÁO (DASHBOARD)](#phan-2)**
   - 2.1. Ý nghĩa 4 thẻ chỉ số then chốt
   - 2.2. Biểu đồ doanh thu và hành trình khách hàng
   - 2.3. Lối tắt thao tác nhanh
3. **[PHẦN 3: QUẢN LÝ SẢN PHẨM (TRỌNG TÂM CHI TIẾT)](#phan-3)**
   - 3.1. Danh sách sản phẩm: Tìm kiếm, lọc và phân trang
   - 3.2. Thêm mới một sản phẩm chuẩn từ A - Z
   - 3.3. Tải và quản lý thư viện hình ảnh đa góc chụp
   - 3.4. Thiết lập bề mặt đồng, chất liệu và kích thước
   - 3.5. Soạn thảo mô tả chi tiết & quy trình đúc thủ công
   - 3.6. Tối ưu hóa SEO Google & Bộ câu hỏi thường gặp (FAQ Schema)
   - 3.7. Ghim sản phẩm nổi bật / Cập nhật nhanh kho hàng
4. **[PHẦN 4: QUẢN LÝ DANH MỤC & ĐỒNG BỘ CÂY PHÂN CẤP](#phan-4)**
   - 4.1. Cấu trúc cây danh mục 3 cấp độ
   - 4.2. Thêm mới và chỉnh sửa danh mục
   - 4.3. Quy trình đồng bộ ảnh đại diện danh mục (Tránh lệch ảnh trang chủ và admin)
5. **[PHẦN 5: QUẢN TRỊ TRANG CHỦ & CẤU HÌNH THƯƠNG HIỆU](#phan-5)**
   - 5.1. Quản lý Banner Slider (Banner máy tính & Banner di động)
   - 5.2. Cấu hình 6 Danh mục sản phẩm nổi bật
   - 5.3. Cấu hình 5 Tuyệt tác chế tác được yêu thích
   - 5.4. Cấu hình Hệ thống Xưởng sản xuất & 3 Showroom trưng bày
   - 5.5. Cấu hình Video quy trình đúc đồng YouTube
   - 5.6. Cấu hình Đánh giá của khách hàng về sản phẩm thực tế
   - 5.7. Thông tin liên hệ (Hotline, Zalo, Email) & SEO Trang chủ
6. **[PHẦN 6: QUẢN LÝ ĐƠN HÀNG & YÊU CẦU BÁO GIÁ](#phan-6)**
   - 6.1. Tiếp nhận và phân loại đơn hàng mới
   - 6.2. Xem thông tin khách hàng và chi tiết sản phẩm
   - 6.3. Cập nhật tiến trình xử lý đơn hàng
7. **[PHẦN 7: BÀI VIẾT, TIN TỨC & DỰ ÁN CÔNG TRÌNH](#phan-7)**
   - 7.1. Đăng bài viết chia sẻ kiến thức đồ đồng & cúng lễ
   - 7.2. Kiểm tra thang điểm SEO tự động trước khi xuất bản
   - 7.3. Đăng tải hồ sơ năng lực & công trình tiêu biểu
8. **[PHẦN 8: THƯ VIỆN HÌNH ẢNH (MEDIA LIBRARY) & QUY CHUẨN TỐI ƯU](#phan-8)**
   - 8.1. Hướng dẫn tải ảnh và tái sử dụng ảnh
   - 8.2. Quy chuẩn kích thước chuẩn giúp web load tức thì
   - 8.3. Cơ chế đóng dấu bản quyền thương hiệu Lộc Nam
9. **[PHẦN 9: QUẢN TRỊ TÀI KHOẢN VÀ BẢO MẬT](#phan-9)**
   - 9.1. Thêm mới tài khoản nhân viên
   - 9.2. Đổi mật khẩu an toàn và phân quyền
   - 9.3. Nhật ký hoạt động hệ thống (Logs)
10. **[PHẦN 10: XỬ LÝ SỰ CỐ & CÂU HỎI THƯỜNG GẶP (FAQ)](#phan-10)**

---

<a name="phan-1"></a>
## PHẦN 1: ĐĂNG NHẬP & TỔNG QUAN GIAO DIỆN

### 1.1. Đường dẫn truy cập và đăng nhập hệ thống
- **Địa chỉ đăng nhập quản trị:**  
  `https://www.quatanglocnam.com/admin/login`  
  *(Hoặc `https://quatanglocnam.com/admin/login`)*
- **Giao diện đăng nhập:**
  - **Tên đăng nhập / Email:** Điền tài khoản được cấp (Ví dụ: `admin@quatanglocnam.com` hoặc `superadmin`).
  - **Mật khẩu:** Nhập mật khẩu bảo mật.
  - Bấm nút **"Đăng Nhập Hệ Thống"**.
- **Cơ chế an toàn:** Hệ thống tự động tạo mã phiên mã hóa JWT an toàn (HttpOnly Cookie), tự động gia hạn khi thao tác và chặn các đợt tấn công dò quét mật khẩu.

### 1.2. Phân cấp quyền tài khoản
Hệ thống Đồ Đồng Lộc Nam phân tách 3 cấp bậc quyền hạn rõ ràng:
1. **Super Admin (Quản trị tối cao):**
   - Toàn quyền cấu hình hệ thống: Quản lý tài khoản nhân viên, cấu hình trang chủ, phân quyền, xem toàn bộ doanh thu và nhật ký hệ thống.
   - Huy hiệu hiển thị góc trên cùng: `SUPER ADMIN (TOÀN QUYỀN)`.
2. **Admin (Quản trị viên):**
   - Quản lý toàn bộ Sản phẩm, Danh mục, Đơn hàng, Khách hàng, Bài viết, Đánh giá và Thư viện ảnh.
3. **Editor (Biên tập viên):**
   - Chỉ có quyền đăng tải và cập nhật nội dung Sản phẩm, Tin tức, Dự án; không thể xóa tài khoản hay đổi cấu hình hệ thống.

### 1.3. Cấu trúc thanh điều hướng chính (Admin Sidebar)
Thanh thực đơn bên trái được thiết kế khoa học, bố trí theo các nhóm nghiệp vụ thực tế:
- **TỔNG QUAN:**
  - `Bảng điều khiển`: Xem số liệu thống kê nhanh và biểu đồ truy cập.
- **BÁN HÀNG & KHO:**
  - `Sản phẩm`: Quản lý kho 120+ sản phẩm, giá bán, bề mặt, ảnh đại diện.
  - `Danh mục`: Quản lý danh mục 3 cấp, đồng bộ hiển thị và ảnh bìa.
  - `Đơn hàng`: Tiếp nhận đơn đặt mua và yêu cầu tư vấn báo giá.
  - `Khách hàng`: Quản lý danh sách khách hàng và lịch sử mua sắm.
- **NỘI DUNG & THƯƠNG HIỆU:**
  - `Quản trị Trang chủ`: Cấu hình Banner, 6 danh mục, 5 sản phẩm hot, Showroom, Video.
  - `Bài viết & Tin tức`: Quản lý bài viết cẩm nang, phong thủy, tin làng nghề.
  - `Thư viện Hình ảnh`: Lưu trữ và tìm kiếm 4.000+ bức ảnh sản phẩm đã tải lên.
  - `Video Xưởng đúc`: Quản lý video quy trình đúc đồng YouTube.
- **HỆ THỐNG:**
  - `Quản trị viên`: Quản lý danh sách tài khoản được phép truy cập.
  - `Nhật ký hoạt động`: Xem lịch sử ai đã thêm, sửa, xóa dữ liệu gì vào lúc nào.

---

<a name="phan-2"></a>
## PHẦN 2: BẢNG ĐIỀU KHIỂN & BÁO CÁO (DASHBOARD)

Ngay sau khi đăng nhập thành công, bạn sẽ được đưa về trang Bảng điều khiển (`/admin`):

### 2.1. Bốn thẻ chỉ số then chốt (Key Metrics)
1. **Doanh thu tạm tính (VNĐ):** Tổng giá trị các đơn hàng thành công trong tháng.
2. **Đơn hàng mới:** Số lượng đơn hàng mới đang chờ duyệt và xử lý liên hệ.
3. **Sản phẩm đang bán:** Tổng số sản phẩm đang hiển thị trên web.
4. **Lượt truy cập & Khách hàng:** Số lượng người dùng truy cập web theo thời gian thực.

### 2.2. Biểu đồ thống kê và nhật ký đơn hàng
- **Biểu đồ cột/đường:** Thể hiện lượng đơn hàng và doanh số theo từng ngày trong tuần.
- **Bảng 5 đơn hàng gần nhất:** Cho phép chủ xưởng bấm trực tiếp vào tên khách hàng để gọi điện tư vấn ngay khi vừa có người đặt.

---

<a name="phan-3"></a>
## PHẦN 3: QUẢN LÝ SẢN PHẨM (TRỌNG TÂM CHI TIẾT)

Truy cập: **Menu trái > Sản phẩm** (`/admin/products`).

### 3.1. Danh sách sản phẩm
- **Ô tìm kiếm thông minh:** Gõ tên sản phẩm không dấu hoặc có dấu (Ví dụ: `dinh dong`, `ngu su`, `thuyen buom`) hệ thống tìm ra ngay tức thì.
- **Bộ lọc danh mục:** Lọc nhanh theo Đồ thờ cúng, Tượng đồng, Tranh đồng, Trống đồng, Quà tặng.
- **Bộ lọc trạng thái:** Còn hàng / Hết hàng / Nổi bật.
- **Nút thao tác nhanh trên mỗi dòng:**
  - Nút **Sửa (Bút chì)**: Mở bộ soạn thảo đầy đủ.
  - Nút **Xem thử (Mắt)**: Mở trực tiếp trang sản phẩm ngoài web.
  - Nút **Bật/Tắt còn hàng**: Bấm chuyển đổi nhanh mà không cần vào trong sửa.
  - Nút **Xóa (Thùng rác)**: Xóa sản phẩm kèm hộp thoại xác nhận an toàn.

### 3.2. Quy trình thêm mới một sản phẩm từ A - Z
Bấm nút **"+ Thêm sản phẩm mới"** góc trên bên phải màn hình:

#### Bước 1: Thông tin cơ bản
- **Tên sản phẩm:** Đặt tên rõ ràng, đầy đủ (Ví dụ: `Bộ Đỉnh Đồng Cát Tút Ngũ Sự Cao 60cm Hoa Văn Sòi`).
  *Mẹo:* Tên nên chứa [Loại sản phẩm] + [Chất liệu] + [Kích thước].
- **Đường dẫn thân thiện (Slug):** Hệ thống tự động tạo từ tên (Ví dụ: `bo-dinh-dong-cat-tut-ngu-su-cao-60cm-hoa-van-soi`).
- **Danh mục sản phẩm:** Chọn đúng Danh mục chính (Ví dụ: `Đồ thờ cúng`) và Danh mục con (Ví dụ: `Bộ ngũ sự bằng đồng`).
- **Giá bán hiển thị:**
  - Nhập số tiền cụ thể (Ví dụ: `18500000` -> Web tự format thành `18.500.000đ`).
  - Hoặc bỏ trống / nhập `0` nếu muốn hiển thị chữ `"Liên hệ báo giá"`.
- **Giá thị trường (Giá gốc trước khi giảm):** Giúp hiển thị huy hiệu giảm giá (Ví dụ: `21000000`).

#### Bước 2: Quản lý hình ảnh sản phẩm
- **Ảnh đại diện chính:**
  - Bấm **"Chọn ảnh đại diện"** hoặc tải ảnh mới từ máy tính.
  - Ảnh này là ảnh đầu tiên khách nhìn thấy trên danh sách sản phẩm.
- **Bộ sưu tập ảnh đa góc chụp (Gallery):**
  - Bấm nút **"Thêm ảnh góc chụp"** để tải lên từ 3 - 6 ảnh thực tế:
    - Góc chụp chính diện toàn cảnh.
    - Góc chụp cận cảnh hoa văn chạm khắc tay (tai mây, chân nghê).
    - Góc chụp đáy đỉnh, nắp đỉnh hoặc mộc đồng thương hiệu Lộc Nam.
  - Bạn có thể kéo thả chuột để sắp xếp đổi vị trí thứ tự ảnh.

#### Bước 3: Thiết lập chất liệu, bề mặt và thông số kỹ thuật
- **Loại đồng / Bề mặt hoàn thiện (Surface Box):** Tích chọn các tùy chọn:
  - Đồng đỏ thanh khiết
  - Đồng vàng (đồng thau)
  - Đồng vỏ đạn cát tút chuẩn Quân sự
  - Mạ vàng 24k điện phân cao cấp
  - Dát vàng ròng 9999
  - Khảm tam khí (Bạc, Đồng đỏ, Đồng vàng)
  - Khảm ngũ sắc cao cấp (Vàng 9999, Bạc, Đồng đỏ, Đồng đen, Đồng xanh)
- **Thông số kỹ thuật:**
  - Chiều cao (cm), Chiều ngang/Đường kính (cm), Trọng lượng ước tính (kg).
  - Xuất xứ: Xưởng đúc đồng Lộc Nam - Ý Yên, Nam Định.
  - Bảo hành: Trọn đời chất lượng phôi đồng.

#### Bước 4: Soạn thảo mô tả chi tiết sản phẩm
- Sử dụng khung soạn thảo đa năng:
  - Chèn tiêu đề đề mục **H2, H3**.
  - Định dạng in đậm, gạch đầu dòng ý nổi bật.
  - Chèn bảng thông số kỹ thuật chuẩn.
  - Chèn trực tiếp các ảnh chụp thực tế bàn giao tại nhà khách hàng.
  - Chèn video quy trình đúc tại xưởng để tăng 100% độ tin cậy.

#### Bước 5: Cấu hình SEO và Hỏi đáp thường gặp (FAQ)
- **Khung SEO Snippet Preview:**
  - **Meta Title:** Hệ thống tự điền theo tên sản phẩm, nên bổ sung đuôi `| Đồ Đồng Lộc Nam`.
  - **Meta Description:** Viết 1-2 câu tóm tắt (120-155 ký tự) hấp dẫn khách bấm vào từ Google.
- **Khung FAQ Schema Box:**
  - Thêm 2-3 câu hỏi thường gặp:
    *Hỏi:* Bộ đỉnh ngũ sự 60cm phù hợp bàn thờ kích thước bao nhiêu?  
    *Đáp:* Phù hợp nhất cho ban thờ gia tiên kích thước từ 1m97 đến 2m17.  
  - *Lợi ích:* Giúp Google xếp hạng bài viết ở vị trí Rich Snippet nổi bật trên trang nhất tìm kiếm.

#### Bước 6: Lưu và xuất bản
- Bấm nút **"Lưu sản phẩm"** (Góc trên hoặc góc dưới bên phải).
- Hệ thống thông báo thành công và tự động xóa cache CDN, sản phẩm lập tức xuất hiện trên web.

---

<a name="phan-4"></a>
## PHẦN 4: QUẢN LÝ DANH MỤC & ĐỒNG BỘ CÂY PHÂN CẤP

Truy cập: **Menu trái > Danh mục** (`/admin/categories`).

### 4.1. Cấu trúc cây danh mục 3 cấp
Website Lộc Nam vận hành theo cấu trúc chuẩn e-commerce đồ đồng:
- **Cấp 1 (Danh mục chính):**
  1. Đồ Thờ Cúng (`/san-pham/do-tho-cung`)
  2. Tượng Đồng (`/san-pham/tuong-dong`)
  3. Tranh Đồng Cao Cấp (`/san-pham/tranh-dong`)
  4. Trống Đồng Đông Sơn (`/san-pham/trong-dong`)
  5. Quà Tặng Doanh Nghiệp (`/qua-tang`)
  6. Đúc Chuông & Công Trình (`/san-pham/duc-chuong-cong-trinh`)
- **Cấp 2 (Danh mục phân loại):**
  - Ví dụ trong Đồ Thờ Cúng: Bộ Ngũ Sự, Đỉnh Đồng, Bát Hương, Hạc Thờ, Cuốn Thư Câu Đối,...
- **Cấp 3 (Danh mục chi tiết):**
  - Ví dụ trong Bộ Ngũ Sự: Ngũ sự cát tút, Ngũ sự khảm ngũ sắc, Ngũ sự đồng đỏ,...

### 4.2. Hướng dẫn chỉnh sửa & đồng bộ ảnh danh mục chính
> [!IMPORTANT]
> **Khắc phục triệt để lỗi lệch ảnh giữa trang chủ và admin:**  
> Hệ thống hiện tại đã trang bị cơ chế **Universal Category Sync**. Khi bạn đổi ảnh hoặc tên danh mục tại `/admin/categories`, ảnh này sẽ tự động gắn kết đồng bộ đồng thời ở:
> 1. Thanh menu điều hướng Mega Menu trên cùng.
> 2. Khối 6 Danh mục nổi bật trên Trang chủ.
> 3. Trang danh sách sản phẩm `/san-pham`.
> 4. Trang danh mục riêng `/san-pham/[category]`.

**Cách thay đổi ảnh danh mục chuẩn:**
1. Vào tab **"Danh mục chính"**.
2. Tìm danh mục cần sửa (Ví dụ: `Đồ thờ cúng`).
3. Bấm biểu tượng **"Sửa"**.
4. Tại ô **Ảnh đại diện danh mục**: Bấm nút **"Tải ảnh mới"** hoặc chọn từ thư viện.
5. Bấm **"Lưu danh mục"**. Hệ thống sẽ tự động cập nhật đồng bộ toàn bộ website.

---

<a name="phan-5"></a>
## PHẦN 5: QUẢN TRỊ TRANG CHỦ & CẤU HÌNH THƯƠNG HIỆU

Truy cập: **Menu trái > Quản trị Trang chủ** (`/admin/landing-page`).  
Đây là trung tâm điều khiển toàn bộ bộ mặt của website Đồ Đồng Lộc Nam.

Giao diện chia thành 7 Tab quản trị trực quan:

### 5.1. Tab 1: Hero Banner Slider
- **Danh sách Slide:** Bạn có thể tạo từ 1 đến 5 banner tự động chuyển động.
- **Mỗi slide gồm:**
  - **Ảnh Banner máy tính (Desktop):** Kích thước chuẩn khuyến nghị `1600 x 680 px`.
  - **Ảnh Banner di động (Mobile):** Kích thước chuẩn khuyến nghị `800 x 340 px` *(Giúp điện thoại mở trang ngay lập tức không bị giật lag)*.
  - **Tiêu đề lớn (Title):** Ví dụ: `HỆ THỐNG 1 XƯỞNG SẢN XUẤT & 3 CỬA HÀNG TRƯNG BÀY`.
  - **Dòng phụ đề (Subtitle):** Ví dụ: `Đúc Đồng Gia Truyền Dương Bá Tiến - Hà Nội, Nam Định, Ninh Bình`.
  - **Liên kết khi click (Link):** Đường dẫn đích (Ví dụ: `/gioi-thieu` hoặc `/san-pham/do-tho-cung`).
  - **Nút bật/tắt kích hoạt:** Cho phép tạm ẩn banner khi hết mùa sự kiện mà không cần xóa.
  - **Nút Mũi tên Lên/Xuống:** Đổi vị trí thứ tự hiển thị các slide.
- **Thời gian tự động chuyển slide:** Điền số mili-giây (Mặc định `5000` = 5 giây chuyển 1 lần).

### 5.2. Tab 2: 6 Danh mục nổi bật (Highlight Categories)
- Khối nằm ngay dưới phần cam kết thương hiệu trên trang chủ.
- Gồm đúng 6 vị trí thẻ sang trọng viền vàng:
  - Thẻ 1: Trống Đồng
  - Thẻ 2: Tranh Đồng Cao Cấp
  - Thẻ 3: Tượng Đồng
  - Thẻ 4: Đồ Thờ Cúng
  - Thẻ 5: Quà Tặng Doanh Nghiệp
  - Thẻ 6: Linh Vật 12 Con Giáp
- Bạn có thể đổi tên hiển thị, đổi ảnh đại diện và đổi đường dẫn liên kết cho từng thẻ.

### 5.3. Tab 3: Tuyệt tác chế tác được yêu thích (5 Favorite Products)
- Hiển thị 5 sản phẩm tâm điểm thu hút người xem nhất.
- Mỗi ô gồm:
  - Chọn sản phẩm từ danh sách sản phẩm có sẵn.
  - Tên sản phẩm hiển thị.
  - Giá bán hiển thị (Ví dụ: `8.500.000đ`).
  - Ảnh đại diện sản phẩm (Tự động nén WebP và gắn huy hiệu Lộc Nam).
  - Đường dẫn xem chi tiết.
  - Tùy chọn **"Ghim nổi bật (Viền vàng sáng)"**: Chọn 1 sản phẩm chính giữa làm tâm điểm thu hút thị giác.

### 5.4. Tab 4: Hệ thống Xưởng sản xuất & 3 Showroom (Facilities)
Quản lý thông tin chi tiết của 4 cơ sở:
1. **Xưởng sản xuất chính:** Làng nghề đúc đồng Vạn Điểm, Ý Yên, Nam Định.
2. **Showroom 1 (Trụ sở chính):** Đường 57A - Thị trấn Lâm - Ý Yên - Nam Định.
3. **Showroom 2 (Ninh Bình):** Khu Công Nghiệp Ý Yên - Ninh Bình.
4. **Showroom 3 (Hà Nội):** 164A4 Nguyễn Cảnh Dị - Hoàng Mai - Hà Nội.
- Bạn có thể cập nhật: Tên cơ sở, Địa chỉ chi tiết, Số điện thoại hotline riêng, Ảnh chụp mặt tiền showroom, và **Link Google Maps dẫn đường trực tiếp**.

### 5.5. Tab 5: Video xưởng đúc & Bàn giao thực tế (Videos)
- Hiển thị 4 video thực tế tuyển chọn từ kênh YouTube chính thức của xưởng.
- Cách thêm video:
  - Chỉ cần dán link YouTube (Ví dụ: `https://www.youtube.com/watch?v=NUnVlHO1mEU`).
  - Điền Tiêu đề video, Chuyên mục (Quy trình đúc / Chạm khắc / Bàn giao), Thời lượng (05:32), và Lượt xem mô phỏng.
  - Ảnh thumbnail tự động lấy nét từ YouTube hoặc tải ảnh riêng của xưởng.

### 5.6. Tab 6: Đánh giá của khách hàng về sản phẩm thực tế (Reviews)
- Khối chuyển động vòng lặp vô tận (Infinite Marquee) trên nền đen sang trọng:
  - Hiển thị phản hồi thực tế từ các khách hàng lớn (Chùa, Doanh nghiệp, Gia chủ biệt thự).
  - Mỗi đánh giá gồm: Tên khách hàng, Chức danh/Nghề nghiệp, Địa phương (Hà Nội, TP.HCM, Đà Nẵng,...), Tên sản phẩm đã giao, Ảnh chụp thực tế bàn giao tại công trình/ban thờ, Điểm số sao (5 sao), và Lời nhận xét.

### 5.7. Tab 7: Thông tin liên hệ & Cấu hình SEO Trang chủ
- **Hotline 1:** Số điện thoại hotline chính (Mặc định: `0836 122 222`).
- **Hotline 2 / Zalo:** Số hỗ trợ kỹ thuật (Mặc định: `0846 699 997`).
- **Email liên hệ:** `dodonglocnam1102@gmail.com`.
- **Fanpage Facebook & Kênh YouTube.**
- **Meta Title & Meta Description trang chủ:** Viết chuẩn để Google nhận diện thương hiệu số 1 về đúc đồng Ý Yên.

> [!TIP]
> Sau khi chỉnh sửa bất kỳ mục nào trên trang chủ, hãy kéo xuống hoặc nhìn góc trên bấm nút **"LƯU THAY ĐỔI"** (Nút màu vàng lớn). Khi thông báo xanh hiện ra, toàn bộ thay đổi đã được áp dụng an toàn.

---

<a name="phan-6"></a>
## PHẦN 6: QUẢN LÝ ĐƠN HÀNG & YÊU CẦU BÁO GIÁ

Truy cập: **Menu trái > Đơn hàng** (`/admin/orders`).

### 6.1. Tiếp nhận và phân loại đơn hàng
Khi khách hàng đặt hàng hoặc điền form yêu cầu tư vấn trên website, đơn hàng sẽ lập tức xuất hiện tại đây kèm chuông/chấm đỏ báo đơn mới:
- **Mã đơn hàng:** Ví dụ `#LN-2026-0812`.
- **Ngày đặt hàng:** Thời gian chi tiết đến từng phút.
- **Tên khách hàng & Số điện thoại:** Hiển thị rõ ràng, có nút bấm gọi nhanh trên di động.
- **Giá trị đơn hàng:** Tổng tiền cần thu.

### 6.2. Xem chi tiết đơn hàng
Bấm vào dòng đơn hàng để mở bảng chi tiết:
- Danh sách sản phẩm khách chọn (Tên, số lượng, quy cách hoàn thiện mạ vàng/hun màu).
- Địa chỉ nhận hàng chi tiết của khách.
- Lời nhắn / Ghi chú đặc biệt của khách hàng (Ví dụ: `Cần giao trước ngày rằm`, `Gửi xe khách về bến Giáp Bát`).

### 6.3. Cập nhật trạng thái đơn hàng
Bạn có thể chọn cập nhật trạng thái đơn theo các nấc quy trình:
1. **Chờ xử lý:** Đơn hàng vừa gửi lên web.
2. **Đã liên hệ / Xác nhận:** Nhân viên đã gọi điện chốt mẫu mã và tiền cọc.
3. **Đang chế tác / Đang hoàn thiện:** Xưởng đang gia công tại Ý Yên.
4. **Đang giao hàng:** Đã gửi bưu điện Viettel Post hoặc xe riêng.
5. **Đã hoàn thành:** Khách đã nhận hàng, kiểm tra ưng ý và thanh toán đủ.
6. **Đã hủy:** Khách đổi ý hoặc đơn thử nghiệm.

---

<a name="phan-7"></a>
## PHẦN 7: BÀI VIẾT, TIN TỨC & DỰ ÁN CÔNG TRÌNH

Truy cập: **Menu trái > Bài viết** (`/admin/articles`).

### 7.1. Đăng bài viết mới
1. Bấm **"+ Thêm bài viết mới"**.
2. **Tiêu đề bài viết:** Viết hoa chữ cái đầu, hấp dẫn (Ví dụ: *Ý Nghĩa Bộ Ngũ Sự Bằng Đồng Trong Văn Hóa Thờ Cúng Gia Tiên Người Việt*).
3. **Chuyên mục:** Chọn Kiến thức đồ thờ / Phong thủy / Tin tức làng nghề / Sự kiện Lộc Nam.
4. **Ảnh đại diện bài viết:** Tải ảnh ngang tỉ lệ `16:9` đẹp mắt.
5. **Soạn thảo nội dung:** Hỗ trợ đầy đủ chèn ảnh, đề mục, trích dẫn lời khuyên của nghệ nhân.

### 7.2. Bộ chấm điểm chuẩn SEO tự động (Article SEO Analyzer)
Ngay bên cạnh khung soạn thảo có thước đo SEO thông minh:
- **Thẻ xanh (Đạt):** Độ dài tiêu đề chuẩn, đã có thẻ mô tả Meta Description, mật độ từ khóa hợp lý, có ảnh minh họa kèm thẻ Alt.
- **Thẻ vàng/đỏ (Cần sửa):** Nhắc nhở nếu bài viết quá ngắn hoặc quên điền tóm tắt.
*Mục tiêu:* Đạt điểm SEO từ 85/100 trở lên để bài viết tự động leo top tìm kiếm Google bền vững.

---

<a name="phan-8"></a>
## PHẦN 8: THƯ VIỆN HÌNH ẢNH (MEDIA LIBRARY) & QUY CHUẨN TỐI ƯU

Truy cập: **Menu trái > Thư viện hình ảnh** (`/admin/images`).

### 8.1. Hướng dẫn sử dụng Media Library
- Hệ thống tự động quản lý và lập chỉ mục hơn 4.000 hình ảnh của xưởng.
- Bạn có thể tải lên cùng lúc nhiều ảnh bằng cách kéo thả chuột vào khung **"Kéo thả ảnh vào đây để tải lên"**.
- Có ô tìm kiếm ảnh theo tên file để tìm lại các ảnh cũ đã tải lên trước đó mà không cần tải lại nhiều lần.

### 8.2. Quy chuẩn kích thước chuẩn giúp website tải SIÊU NHANH
Để đảm bảo website luôn đạt điểm tốc độ cao nhất (Lighthouse 95 - 100 điểm) và khách hàng lướt web trên điện thoại mượt mà không độ trễ:

| Loại hình ảnh | Kích thước khuyến nghị | Dung lượng chuẩn | Định dạng tốt nhất |
| :--- | :--- | :--- | :--- |
| **Ảnh đại diện Sản phẩm** | 600 x 600 px (Vuông) | Dưới 80 KB | WebP hoặc JPG |
| **Ảnh Banner máy tính (Desktop)** | 1600 x 680 px (Ngang) | Dưới 120 KB | WebP |
| **Ảnh Banner di động (Mobile)** | 800 x 340 px (Ngang) | Dưới 45 KB | WebP |
| **Ảnh Danh mục nổi bật** | 500 x 500 px (Vuông) | Dưới 60 KB | WebP hoặc JPG |
| **Ảnh Tin tức / Dự án** | 800 x 500 px (16:10) | Dưới 90 KB | WebP hoặc JPG |
| **Logo thương hiệu** | 200 x 189 px | Dưới 25 KB | WebP / PNG trong suốt |

> [!WARNING]
> **Lưu ý quan trọng khi chụp bằng điện thoại:**  
> Ảnh chụp trực tiếp từ iPhone / Samsung thường có dung lượng rất lớn (5 MB - 15 MB mỗi tấm).  
> **Không nên tải trực tiếp file gốc 10 MB lên web**, vì sẽ làm tốn bộ nhớ hosting và khiến khách hàng ở vùng sóng 4G yếu tải trang bị chậm. Hãy dùng công cụ gửi qua Zalo (chế độ thường) hoặc phần mềm nén ảnh trước khi tải lên.

---

<a name="phan-9"></a>
## PHẦN 9: QUẢN TRỊ TÀI KHOẢN VÀ BẢO MẬT

Truy cập: **Menu trái > Quản trị viên** (`/admin/users`).

### 9.1. Thêm tài khoản nhân viên mới
1. Bấm **"+ Thêm tài khoản"**.
2. Nhập Họ tên, Tên đăng nhập / Email và Mật khẩu khởi tạo.
3. Chọn vai trò: `Admin` (Toàn quyền quản lý) hoặc `Editor` (Chỉ đăng bài viết/sản phẩm).
4. Bấm **"Lưu tài khoản"**.

### 9.2. Đổi mật khẩu định kỳ
- Khuyến nghị chủ xưởng đổi mật khẩu 3 tháng / lần.
- Mật khẩu nên gồm ít nhất 8 ký tự, có chứa chữ hoa, chữ thường và chữ số.

---

<a name="phan-10"></a>
## PHẦN 10: XỬ LÝ SỰ CỐ & CÂU HỎI THƯỜNG GẶP (FAQ)

### Câu hỏi 1: Tôi vừa đổi ảnh / giá sản phẩm trong Admin nhưng ra trang chủ chưa thấy thay đổi ngay?
**Trả lời:**  
Để đạt tốc độ tải tức thì cho hàng nghìn người cùng xem, hệ thống có bộ nhớ đệm thông minh (CDN Edge Cache). Bộ nhớ này tự động làm mới sau **60 giây**.  
Nếu bạn muốn máy tính của mình thấy ngay kết quả lập tức:
- Trên máy tính: Bấm tổ hợp phím **Ctrl + F5** (hoặc **Cmd + Shift + R** trên Macbook) để tải lại sạch cache của trình duyệt.
- Trên điện thoại: Tắt tab trình duyệt mở lại hoặc vuốt mạnh xuống để làm mới.

### Câu hỏi 2: Có thể đăng cùng 1 sản phẩm vào 2 danh mục khác nhau không?
**Trả lời:**  
Hoàn toàn được! Trong khung chỉnh sửa sản phẩm, hệ thống hỗ trợ tích chọn nhiều danh mục cùng lúc (Ví dụ: Một mẫu Thuyền buồm có thể vừa nằm ở *Quà tặng doanh nghiệp*, vừa nằm ở *Đồ đồng phong thủy*).

### Câu hỏi 3: Nếu tôi lỡ tay xóa nhầm một sản phẩm thì sao?
**Trả lời:**  
Hệ thống luôn hiện hộp thoại cảnh báo xác nhận màu đỏ trước khi xóa. Nếu đã xác nhận xóa, sản phẩm sẽ được gỡ khỏi kho. Trong trường hợp khẩn cấp muốn khôi phục sản phẩm cũ, hãy liên hệ ngay đội ngũ kỹ thuật để lấy lại từ bản sao lưu Database tự động hàng ngày.

### Kênh hỗ trợ kỹ thuật 24/7:
- **Kỹ thuật viên phụ trách:** Đội ngũ phát triển Jaydev
- **Hỗ trợ cập nhật & bảo trì:** Luôn đồng hành cùng Đồ Đồng Lộc Nam.

---
*Tài liệu được phát hành chính thức cho Hệ thống Web Quà Tặng Lộc Nam - Ý Yên, Nam Định.*
