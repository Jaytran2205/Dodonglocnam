# Đồ Đồng Lộc Nam - Website Thương Mại Điện Tử & Giới Thiệu Làng Nghề

Website chính thức của Đồ Đồng Lộc Nam (Ý Yên, Nam Định).
Chuyên đúc đồng thủ công truyền thống: Đồ thờ cúng, Tượng đồng, Tranh đồng, Trống đồng, Quà tặng mạ vàng 24k cao cấp.

## Công Nghệ
- Next.js 14 (App Router)
- React 18, TypeScript, Tailwind CSS
- Prisma ORM & SQLite Database
- Responsive Mobile-First & Dark Luxury Theme

## Quản lý danh mục, trang chủ và ảnh

- **Danh Mục & Thẻ Con:** sửa tên hiển thị, tiêu đề SEO, mô tả, banner và các thẻ con rồi bấm **Lưu Tất Cả Thẻ Con**. Đổi tên giữ nguyên mã danh mục, URL và liên kết sản phẩm. Tab **Danh Mục Chính** vẫn dùng để tạo/sửa các danh mục trong database.
- **Giao Diện & Trang Chủ → Danh Mục Nổi Bật Trang Chủ:** chọn danh mục có sẵn, bấm **Thêm danh mục**, sửa ảnh/tiêu đề/liên kết hoặc đổi thứ tự; sau đó bấm **Lưu**. Hỗ trợ số lượng thẻ tùy ý, đồng thời đọc được cấu hình sáu thẻ cũ.
- **Thư Viện Ảnh:** tìm ảnh theo tên hoặc đường dẫn, mở nguyên bản và sao chép URL. Thư viện tổng hợp ảnh có sẵn, ảnh tải lên, ảnh danh mục, trang chủ, dự án, sản phẩm và ảnh trong nội dung bài viết. File ảnh lỗi được báo rõ thay vì coi như ảnh đã tải thành công. Chỉ tài khoản có quyền quản lý nội dung được truy cập.
- Danh sách sản phẩm/bài viết tải dữ liệu tóm tắt; nội dung đầy đủ được tải khi mở trình sửa. Danh sách sản phẩm hiển thị 40 hàng mỗi trang; tìm kiếm/lọc vẫn áp dụng trên toàn bộ danh sách.

## SEO và kiểm tra trước khi triển khai

- `NEXT_PUBLIC_SITE_URL` là tên miền chính, mặc định `https://www.quatanglocnam.com`. URL sản phẩm chính là `/san-pham/[slug]`; các chuyển hướng URL cũ vẫn được giữ.
- Sitemap lấy danh mục đã lưu, sản phẩm, bài viết đã xuất bản và dự án. Không ghi ngày hiện tại làm ngày cập nhật giả; khi database không truy cập được, endpoint trả lỗi thay vì phát sitemap thiếu dữ liệu.
- Giá và tồn kho trong schema khớp dữ liệu sản phẩm. Sản phẩm liên hệ báo giá không khai báo giá 0; không tạo đánh giá giả.
- Admin có `noindex`, `nofollow` và vẫn giữ xác thực/phân quyền. Robots cho phép tài nguyên giao diện và ảnh/video công khai.
- Build tự lập lại danh sách ảnh trong `public`. Nếu thêm ảnh khi đang phát triển, chạy `npm run media:index`.

Kiểm tra mã: `npm test`, `npx tsc --noEmit --incremental false`, `npm run build`.
Kiểm tra giao diện: chạy website ở `http://localhost:3045`, cài Playwright hoặc cung cấp thư mục package qua `PLAYWRIGHT_MODULES`, rồi chạy `npm run test:ui`. Có thể đổi địa chỉ bằng `QA_BASE_URL`. Kiểm thử dùng API/dữ liệu mẫu và không ghi vào database thật; ảnh kiểm tra lưu trong `scratch/seo-admin-qa`.

Sau khi triển khai, kiểm tra kết nối database và thao tác lưu bằng tài khoản thật, rồi gửi lại `/sitemap.xml` trong Google Search Console. Nếu dùng tên miền cũ, cấu hình chuyển hướng tại hosting/DNS của tên miền đó.

## Nâng cấp hiệu năng admin

- Danh sách sản phẩm và bài viết phân trang ở server, tối đa 40 hàng/lượt. Tìm kiếm, lọc theo danh mục chính/phụ, trạng thái kho và sắp xếp vẫn áp dụng trên toàn bộ dữ liệu. Chỉ mục tìm kiếm gọn được giữ trên server trong 60 giây và xóa cache khi dữ liệu thay đổi.
- Trang sản phẩm mặc định lấy tổng số, trang hiện tại và danh mục bằng một truy vấn; không chờ tải chỉ mục tìm kiếm toàn bộ. Trình sửa vẫn tải đầy đủ từng sản phẩm/bài viết khi mở.
- Prisma dùng `relationJoins`, dùng chung kết nối trong mỗi worker và giới hạn mặc định 4 kết nối cho Supabase pooler. Giữ nguyên host/port và mọi thiết lập pool đã khai báo. Không cần đổi cấu trúc bảng hoặc chạy `prisma db push` cho bản nâng cấp này.
- `vercel.json` đặt runtime ở `syd1`, gần database `ap-southeast-2`. Thay đổi vùng chạy chỉ có hiệu lực sau deployment; nếu chuyển database sang khu vực khác, đổi vùng tương ứng.
- Các lượt GET phiên đăng nhập đồng thời dùng chung truy vấn, cache đọc 15 giây. Mọi thao tác ghi kiểm tra lại quyền hiện tại; khóa/sửa tài khoản xóa cache. Database gián đoạn trả lỗi dịch vụ, không dùng phiên cũ để cho phép ghi và không tự đẩy người dùng khỏi trình sửa.
- Khung admin không gọi lại thông tin phiên/đếm đơn hàng mỗi lần chuyển menu. Đếm đơn hàng cập nhật sau thay đổi đơn hoặc mỗi 60 giây khi tab đang hiển thị.
- Báo cáo và thông tin chung của nhật ký cache 15 giây, vô hiệu hóa khi có thay đổi. Doanh thu được tổng hợp bằng SQL thay vì tải toàn bộ đơn hàng.
- Ảnh đại diện trong bảng sản phẩm dùng bản 128px, giữ ảnh gốc trong trình sửa. Ảnh upload có cache CDN vì URL mỗi file là duy nhất. Nếu tối ưu ảnh thất bại, preview thử lại bằng URL gốc.
- Đổi trạng thái kho/nổi bật chỉ trả bốn trường nhỏ, giữ nguyên nội dung bài viết và bộ ảnh; chặn bấm lặp khi đang lưu.

Đo lại bằng `node scripts/benchmark-admin.mjs` (chỉ đọc database). Các API danh sách và phiên có header `Server-Timing`: `auth`, `data`, `total`; kiểm tra trong Network của trình duyệt. Không in thông tin đăng nhập hoặc nội dung hàng dữ liệu trong báo cáo đo.

Phép đo ngày 04/10/2026 với 622 sản phẩm: JSON danh sách cũ 769.205 byte, trang 40 sản phẩm khoảng 27–29 KB. API mới trên máy kiểm thử với database thật trả trang 40 sản phẩm trong khoảng 0,34–0,38 giây khi đã kết nối; lượt đầu còn chịu thời gian kết nối/biên dịch local. Đây là số đo môi trường kiểm thử, cần đo lại production sau khi triển khai vùng chạy mới.
