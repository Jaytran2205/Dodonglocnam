export interface DetailCategoryItem {
  id: string;
  name: string;
  keyword: string;
  image: string;
  aliases?: string[];
}

export interface SubCategoryItem {
  id: string;
  name: string;
  keyword: string;
  image: string;
  aliases?: string[];
  children?: DetailCategoryItem[];
}

export interface MainCategoryData {
  name: string;
  slug: string;
  aliases?: string[];
  banner?: string;
  description?: string;
  subCategories: SubCategoryItem[];
}

export const DEFAULT_HIERARCHICAL_CATEGORIES: MainCategoryData[] = [
  {
    name: "Đồ thờ",
    slug: "do-tho-cung",
    banner: "/images/banners/banner_danh_muc_do_tho.jpg",
    subCategories: [
      { id: "bo-suu-tap-do-tho", name: "Bộ sưu tập đồ thờ đầy đủ", keyword: "bộ sưu tập,đồ thờ đầy đủ", image: "/images/do-tho-cung/bo-suu-tap-do-tho.jpg" },
      { id: "bo-tam-su-ngu-su", aliases: ["bo-ngu-su", "dinh-dong"], name: "Bộ tam sự, ngũ sự bằng đồng", keyword: "tam sự,ngũ sự,đỉnh đồng", image: "/images/do-tho-cung/bo-tam-su-ngu-su.jpg" },
      { id: "chan-nen", name: "Chân nến", keyword: "chân nến", image: "/images/do-tho-cung/chan-nen.jpg" },
      { id: "hac-tho", name: "Hạc thờ", keyword: "hạc thờ", image: "/images/do-tho-cung/hac-tho.jpg" },
      { id: "den-tho", name: "Đèn thờ", keyword: "đèn thờ", image: "/images/do-tho-cung/den-tho.jpg" },
      { id: "bat-huong", name: "Bát hương", keyword: "bát hương", image: "/images/do-tho-cung/bat-huong.jpg" },
      { id: "lo-hoa", name: "Lọ hoa", keyword: "lọ hoa", image: "/images/do-tho-cung/lo-hoa.jpg" },
      { id: "ong-huong", name: "Ống hương", keyword: "ống hương", image: "/images/do-tho-cung/ong-huong.jpg" },
      { id: "mam-bong", name: "Mâm bồng", keyword: "mâm bồng", image: "/images/do-tho-cung/mam-bong.jpg" },
      { id: "dai-nuoc", name: "Đài nước", keyword: "đài nước", image: "/images/do-tho-cung/dai-nuoc.jpg" },
      { id: "ngai-chen", name: "Ngai chén", keyword: "ngai chén", image: "/images/do-tho-cung/ngai-chen.jpg" },
      { id: "am-nuoc", name: "Ấm nước", keyword: "ấm nước", image: "/images/do-tho-cung/am-nuoc.jpg" },
      { id: "chuong-tho", name: "Chuông thờ cỡ nhỏ", keyword: "chuông thờ", image: "/images/do-tho-cung/chuong-tho.jpg" },
      { id: "cuu-huyen-that-to", name: "Cửu huyền thất tổ", keyword: "cửu huyền thất tổ", image: "/images/do-tho-cung/cuu-huyen-that-to.jpg" },
      { id: "ngai-tho", name: "Ngai thờ", keyword: "ngai thờ", image: "/images/do-tho-cung/ngai-tho.jpg" },
      { id: "bai-vi", name: "Bài vị", keyword: "bài vị", image: "/images/do-tho-cung/bai-vi.jpg" },
      { id: "cuon-thu-cau-doi", aliases: ["hoanh-phi-cau-doi"], name: "Cuốn thư câu đối", keyword: "cuốn thư,câu đối,hoành phi", image: "/images/do-tho-cung/cuon-thu-cau-doi.jpg" },
      { id: "dai-tu", name: "Đại tự", keyword: "đại tự", image: "/images/do-tho-cung/dai-tu.jpg" },
      { id: "chieng-khanh", name: "Chiêng khánh đồng", keyword: "chiêng,khánh", image: "/images/do-tho-cung/chieng-khanh.jpg" },
      { id: "dai-hong-chung", name: "Đúc đại hồng chung", keyword: "đại hồng chung", image: "/images/do-tho-cung/dai-hong-chung.jpg" },
      { id: "dinh-lu-huong", name: "Đỉnh - Lư hương cỡ lớn", keyword: "lư hương,đỉnh cỡ lớn", image: "/images/do-tho-cung/dinh-lu-huong.jpg" },
      { id: "dinh-that-lan", name: "Đỉnh thất lân vờn cầu", keyword: "thất lân,vờn cầu", image: "/images/do-tho-cung/dinh-that-lan.jpg" },
      { id: "luc-binh-choe", name: "Lục bình - chóe đồng", keyword: "lục bình,chóe", image: "/images/do-tho-cung/luc-binh-choe.jpg" },
    ],
  },
  {
    name: "Trống đồng",
    slug: "trong-dong",
    banner: "/images/banners/banner_danh_muc_trong_dong.jpg",
    subCategories: [
      { id: "trong-dong-luu-niem", name: "Trống đồng lưu niệm", keyword: "lưu niệm", image: "/images/trong-dong/trong-dong-luu-niem.jpg" },
      { id: "qua-trong-dong-co-lon", name: "Quả trống đồng cỡ lớn", keyword: "cỡ lớn", image: "/images/trong-dong/qua-trong-dong-co-lon.jpg" },
      { id: "mat-trong-dong", name: "Mặt trống đồng", keyword: "mặt trống", image: "/images/trong-dong/mat-trong-dong.jpg" },
    ],
  },
  {
    name: "Tranh đồng",
    slug: "tranh-dong",
    banner: "/images/banners/banner_danh_muc_tranh_dong.jpg",
    subCategories: [
      { id: "tranh-bat-ma", name: "Tranh Bát Mã", keyword: "bát mã", image: "/images/locnam_real/locnam_tranh_bat_ma.jpg" },
      { id: "tranh-thuan-buom", name: "Tranh Thuận Buồm Xuôi Gió", keyword: "thuận buồm", image: "/images/locnam_real/locnam_tranh_thuan_buom.jpg" },
      { id: "tranh-vinh-quy", name: "Tranh Vinh Quy Bái Tổ", keyword: "vinh quy", image: "/images/locnam_real/locnam_tranh_vinh_quy.jpg" },
      { id: "tranh-dong-que", name: "Tranh Đồng Quê", keyword: "đồng quê", image: "/images/locnam_real/locnam_tranh_dong_que.jpg" },
      { id: "tranh-ngoc-duong", name: "Tranh Ngọc Đường Phú Quý", keyword: "ngọc đường,chim công", image: "/images/locnam_real/locnam_qua_sep_nu.jpg" },
      { id: "tranh-tu-quy", name: "Tranh Tứ Quý", keyword: "tứ quý", image: "/images/locnam_real/locnam_tranh_tu_quy.jpg" },
      { id: "tranh-ca-chep", name: "Tranh Cá Chép", keyword: "cá chép", image: "/images/locnam_real/locnam_tranh_ca_chep.jpg" },
      { id: "tranh-bach-hac", name: "Tranh Bách Hạc Quần Tùng", keyword: "bách hạc", image: "/images/belux/belux_tranh_bach_hac.jpg" },
      { id: "tranh-chua-mot-cot", name: "Tranh Chùa Một Cột", keyword: "chùa một cột", image: "/images/locnam_real/locnam_qua_thay_co.jpg" },
      { id: "tranh-khue-van-cac", name: "Tranh Khuê Văn Các", keyword: "khuê văn các", image: "/images/locnam_real/locnam_qua_thay_co.jpg" },
      { id: "tranh-chu-bang-dong", name: "Tranh Chữ Bằng Đồng", keyword: "tranh chữ", image: "/images/locnam_real/locnam_hoanh_phi.jpg" },
      {
        id: "tranh-danh-nhan",
        aliases: ["tranh-danh-nhan-bang-dong"],
        name: "Tranh Danh Nhân Bằng Đồng",
        keyword: "bác hồ,bác giáp,danh nhân",
        image: "/images/locnam_real/locnam_tranh_bac_ho.jpg",
        children: [
          { id: "tranh-bac-ho", name: "Tranh Bác Hồ", keyword: "bác hồ", image: "/images/locnam_real/locnam_tranh_bac_ho.jpg" },
          { id: "tranh-vo-nguyen-giap", aliases: ["tranh-bac-giap"], name: "Tranh Bác Giáp", keyword: "võ nguyên giáp,bác giáp", image: "/images/locnam_real/locnam_tranh_bac_ho.jpg" },
        ],
      },
      { id: "tranh-phat", name: "Tranh Phật Bằng Đồng", keyword: "phật", image: "/images/tranh_phat_bang_dong_real.jpg" },
      { id: "tranh-mat-trong", name: "Tranh Mặt Trống Đồng", keyword: "mặt trống", image: "/images/trong-dong/mat-trong-dong.webp" },
    ],
  },
  {
    name: "Tượng đồng",
    slug: "tuong-dong",
    banner: "/images/banners/banner_danh_muc_tuong_dong.jpg",
    subCategories: [
      {
        id: "tuong-truyen-than",
        aliases: ["tuong-chan-dung-truyen-than"],
        name: "Tượng chân dung, truyền thần",
        keyword: "chân dung,truyền thần",
        image: "/images/tuong-dong/tuong-truyen-than.jpg",
      },
      {
        id: "tuong-phat",
        name: "Tượng Phật",
        keyword: "phật,a di đà,thích ca,quan âm",
        image: "/images/tuong-dong/tuong-phat.jpg",
        children: [
          { id: "tuong-a-di-da", name: "Tượng A Di Đà", keyword: "a di đà", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-thich-ca", name: "Tượng Thích Ca", keyword: "thích ca", image: "/images/locnam_real/locnam_buddha_22_tuong-phat-thich-ca-bang-.jpg" },
          { id: "tuong-quan-am", name: "Tượng Quan Âm Bồ Tát", keyword: "quan âm", image: "/images/locnam_real/locnam_buddha_19_tuong-phat-ba-quan-am-ban.jpg" },
          { id: "tuong-thien-thu-thien-nhan", name: "Tượng Thiên Thủ Thiên Nhãn", keyword: "thiên thủ", image: "/images/locnam_real/locnam_buddha_35_tuong-phat-thien-thu-thie.jpg" },
          { id: "tuong-chuan-de", name: "Tượng Chuẩn Đề", keyword: "chuẩn đề", image: "/images/locnam_real/locnam_buddha_15_tuong-chuan-de-bang-dong-.jpg" },
          { id: "tuong-di-lac", name: "Tượng Di Lặc", keyword: "di lặc", image: "/images/locnam_real/locnam_buddha_01_tuong-di-lac-dung-bang-do.jpg" },
          { id: "tuong-van-thu-pho-hien", name: "Tượng Văn Thù - Phổ Hiền", keyword: "văn thù,phổ hiền", image: "/images/locnam_real/locnam_buddha_13_bo-tuong-tay-phuong-tam-t.jpg" },
          { id: "tuong-dat-ma", name: "Tượng Đạt Ma Sư Tổ", keyword: "đạt ma", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-dia-tang", name: "Tượng Địa Tạng Bồ Tát", keyword: "địa tạng", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-sivali", name: "Tượng Thánh Tăng Sivali", keyword: "sivali", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-mat-tong", name: "Tượng Mật Tông", keyword: "mật tông", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
        ],
      },
      {
        id: "tuong-danh-nhan",
        name: "Tượng danh nhân",
        keyword: "danh nhân,trần hưng đạo,bác hồ,bác giáp",
        image: "/images/tuong-dong/tuong-danh-nhan.jpg",
        children: [
          { id: "tuong-tran-hung-dao", name: "Tượng đồng Trần Hưng Đạo", keyword: "trần hưng đạo", image: "/images/locnam_real/locnam_tran_hung_dao.jpg" },
          { id: "tuong-bac-ho", name: "Tượng Bác Hồ", keyword: "bác hồ", image: "/images/locnam_real/locnam_bac_ho.jpg" },
          { id: "tuong-vo-nguyen-giap", name: "Tượng Bác Võ Nguyên Giáp", keyword: "võ nguyên giáp,bác giáp", image: "/images/locnam_real/locnam_bac_giap.jpg" },
          { id: "tuong-gia-cat-luong", aliases: ["tuong-khong-minh"], name: "Tượng Gia Cát Lượng", keyword: "khổng minh,gia cát lượng", image: "/images/locnam_real/locnam_tran_hung_dao.jpg" },
          { id: "tuong-quan-cong", name: "Tượng Quan Công", keyword: "quan công", image: "/images/locnam_real/locnam_quan_cong.jpg" },
        ],
      },
      {
        id: "tuong-than-thanh",
        name: "Tượng thần - thánh",
        keyword: "thần,thánh",
        image: "/images/tuong-dong/tuong-than-thanh.jpg",
      },
      {
        id: "tuong-tam-da",
        name: "Tượng tam đa",
        keyword: "tam đa,phúc lộc thọ",
        image: "/images/tuong-dong/tuong-tam-da.jpg",
      },
      {
        id: "tuong-vua",
        name: "Tượng vua",
        keyword: "vua",
        image: "/images/tuong-dong/tuong-vua.jpg",
      },
      {
        id: "tuong-12-con-giap",
        aliases: ["tuong-linh-vat-12-con-giap"],
        name: "Tượng Linh vật 12 con giáp",
        keyword: "linh vật,12 con giáp,chuột,trâu,hổ,mèo,rồng,rắn,ngựa,dê,khỉ,gà,chó,lợn",
        image: "/images/tuong-dong/tuong-12-con-giap.jpg",
        children: [
          { id: "tuong-chuot", name: "Tượng Chuột bằng đồng", keyword: "chuột,tý", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-trau", name: "Tượng Trâu bằng đồng", keyword: "trâu,sửu", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-ho", name: "Tượng Hổ bằng đồng", keyword: "hổ,dần,cọp", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-meo", name: "Tượng Mèo bằng đồng", keyword: "mèo,mão", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-rong", aliases: ["tuong-rong-bang-dong"], name: "Tượng Rồng bằng đồng", keyword: "rồng,thìn", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-ran", name: "Tượng Rắn bằng đồng", keyword: "rắn,tỵ,hổ mang", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-ngua", name: "Tượng Ngựa bằng đồng", keyword: "ngựa,tuấn mã,ngọ", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-de", name: "Tượng Dê bằng đồng", keyword: "dê,mùi", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-khi", name: "Tượng Khỉ bằng đồng", keyword: "khỉ,thân", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-ga", name: "Tượng Gà bằng đồng", keyword: "gà,dậu", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-cho", name: "Tượng Chó bằng đồng", keyword: "chó,tuất", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
          { id: "tuong-lon", name: "Tượng Lợn bằng đồng", keyword: "lợn,heo,hợi", image: "/images/products/wp-content_uploads_2025_11_tuong-ngua-phong-thuy-ma-vang-de-go-sang-trong.jpg" },
        ],
      },
    ],
  },
  {
    name: "Quà tặng",
    slug: "qua-tang",
    aliases: ["qua-tang-dong"],
    banner: "/images/banners/banner_danh_muc_qua_tang.jpg",
    subCategories: [
      {
        id: "qua-tang-doanh-nghiep",
        aliases: ["qua-tang-doi-tac", "qua-tang-doi-tuong", "doi-tac", "qua-doanh-nghiep"],
        name: "Quà tặng doanh nghiệp",
        keyword: "thuyền buồm,thuận buồm,thuyền,kim ngân,cây kim ngân,tùng la hán,cây tùng,chữ an,chữ phúc,chữ thọ,chữ tâm,đôi hươu,đại bàng,đĩa thuyền,nhất mã,song ngựa,hũ lúa,mô hình rồng,doanh nghiệp,đối tác,khách hàng,sếp",
        image: "/images/locnam_real/locnam_qua_doanh_nghiep.jpg",
        children: [
          {
            id: "thuyen-buom-phong-thuy",
            aliases: ["thuyen-buom", "qua-mung-tan-gia"],
            name: "Thuyền buồm phong thủy",
            keyword: "thuyền buồm,thuận buồm,thuyền,đĩa thuyền,chặn giấy pha lê",
            image: "/images/locnam_real/locnam_thuyen_buom.jpg",
          },
          {
            id: "cay-kim-ngan-phat-tai",
            aliases: ["cay-kim-ngan"],
            name: "Cây kim ngân tài lộc",
            keyword: "kim ngân",
            image: "/images/belux/belux_qua_tang_sep.jpg",
          },
          {
            id: "tranh-chu-dong-dat-vang",
            aliases: ["tranh-chu"],
            name: "Tranh chữ đồng mạ vàng",
            keyword: "tranh chữ,chữ phúc,chữ tâm,chữ an,chữ thọ",
            image: "/images/tranh-dong/tranh-chu.webp",
          },
          {
            id: "qua-tang-doanh-nghiep-vip",
            aliases: ["linh-vat-doanh-nghiep", "qua-tang-khach-hang", "qua-tang-sep-nam", "qua-tang-sep-nu", "qua-tang-cha-me", "qua-tang-thay-co"],
            name: "Quà biếu đối tác & Doanh nghiệp VIP",
            keyword: "tùng la hán,cây tùng,đôi hươu,đại bàng,đĩa thuyền,nhất mã,song ngựa,hũ lúa,mô hình rồng,doanh nghiệp,đối tác,sếp",
            image: "/images/locnam_real/locnam_qua_doanh_nghiep.jpg",
          },
        ],
      },
      {
        id: "qua-tang-su-kien",
        aliases: ["su-kien", "qua-tang-su-kien-nhan-dip"],
        name: "Quà tặng sự kiện, nhân dịp",
        keyword: "hoa sen,sen,chậu hoa sen,mô hình sen,hoa lan,lan hồ điệp,hoa mẫu đơn,mẫu đơn,cây trúc,trúc quân tử,cây lúa,mẫu đơn như ý,tranh hoa sen,tranh tri ân,đĩa sen,sự kiện,tết,tân gia,mừng thọ,20/11,20/10,cúp,huy chương,biển chức danh",
        image: "/images/collections/cat_cup_golf.jpg",
        children: [
          {
            id: "hoa-sen-ma-vang",
            aliases: ["hoa-sen", "qua-tang-tet"],
            name: "Hoa sen bằng đồng mạ vàng",
            keyword: "hoa sen,sen,chậu hoa sen,mô hình sen,tranh hoa sen,đĩa sen",
            image: "/images/locnam_real/locnam_qua_tet.jpg",
          },
          {
            id: "hoa-lan-phu-quy",
            aliases: ["hoa-lan", "qua-tang-20-10-va-8-3"],
            name: "Hoa lan phú quý mạ vàng",
            keyword: "hoa lan,lan hồ điệp",
            image: "/images/belux/belux_qua_tang_phu_nu.jpg",
          },
          {
            id: "hoa-mau-don-quy-phai",
            aliases: ["hoa-mau-don", "qua-tang-ki-niem-ngay-cuoi"],
            name: "Hoa mẫu đơn tài lộc",
            keyword: "hoa mẫu đơn,mẫu đơn",
            image: "/images/belux/belux_qua_cuoi.jpg",
          },
          {
            id: "tranh-tri-an-su-kien",
            aliases: ["tri-an", "qua-tang-20-11", "qua-tang-mung-tho", "qua-tang-tan-gia", "cup", "huy-chuong", "bien-chuc-danh"],
            name: "Tranh tri ân & Quà sự kiện",
            keyword: "tranh tri ân,tri ân,cây trúc,cây lúa,cúp,huy chương,biển chức danh,sự kiện,tết,tân gia,mừng thọ,20/11,20/10",
            image: "/images/locnam_real/locnam_qua_thay_co.jpg",
          },
        ],
      },
      {
        id: "qua-tang-phong-thuy",
        aliases: ["phong-thuy"],
        name: "Quà tặng phong thủy",
        keyword: "cá rồng,cây kim ngân,hũ tiền,ngựa thần tài,rùa hóa rồng,long quy,rồng,song cá,song ngư,tranh cá chép,mã đáo thành công,bát mã,tranh ngựa,đĩa cá,đĩa ngựa,tỳ hưu,thiềm thừ,cóc,tháp văn xương",
        image: "/images/locnam_real/locnam_thiem_thu.jpg",
        children: [
          {
            id: "linh-vat-phong-thuy-chieu-tai",
            aliases: ["linh-vat-12-con-giap", "ty-huu", "coc-thiem-thu"],
            name: "Linh vật phong thủy chiêu tài",
            keyword: "cá rồng,ngựa thần tài,rùa hóa rồng,long quy,rồng,song cá,song ngư,tỳ hưu,thiềm thừ,cóc,linh vật,12 con giáp",
            image: "/images/locnam_real/locnam_thiem_thu.jpg",
          },
          {
            id: "vat-pham-tu-tai-phat-loc",
            aliases: ["thap-van-xuong"],
            name: "Hũ tiền & Vật phẩm tụ tài",
            keyword: "hũ tiền,tụ bảo bồn,kim ngân,tháp văn xương",
            image: "/images/locnam_real/locnam_thap_van_xuong.jpg",
          },
          {
            id: "tranh-dia-phong-thuy-cat-tuong",
            aliases: ["cac-mau-phong-thuy-khac"],
            name: "Tranh & Đĩa phong thủy cát tường",
            keyword: "tranh cá chép,mã đáo thành công,bát mã,tranh ngựa,đĩa cá,đĩa ngựa",
            image: "/images/belux/belux_phong_thuy.jpg",
          },
        ],
      },
      {
        id: "qua-tang-luu-niem",
        aliases: ["qua-tang-ky-niem", "qua-luu-niem", "luu-niem", "qua-tang-luu-niem-ki-niem"],
        name: "Quà tặng lưu niệm, kỉ niệm",
        keyword: "chùa một cột,chợ bến thành,khuê văn các,tháp rùa,trống đồng,tùng hạc,song hạc,chim công,uyên ương,khổng tước,bàn tay phật,cây bồ đề,nhân sâm,mô hình voi,chặn giấy pha lê,lưu niệm,kỷ niệm",
        image: "/images/locnam_real/locnam_trong_dong_luu_niem.jpg",
        children: [
          {
            id: "bieu-trung-van-hoa-viet-nam",
            aliases: ["di-tich-van-hoa"],
            name: "Tranh di tích văn hóa biểu trưng",
            keyword: "chùa một cột,chợ bến thành,khuê văn các,tháp rùa",
            image: "/images/locnam_real/locnam_trong_dong_luu_niem.jpg",
          },
          {
            id: "bieu-trung-trong-dong-dong-son",
            aliases: ["trong-dong-luu-niem"],
            name: "Tranh trống đồng lưu niệm",
            keyword: "trống đồng,đĩa trống đồng",
            image: "/images/trong-dong/trong-dong-luu-niem.webp",
          },
          {
            id: "tung-hac-cong-uyen-uong",
            aliases: ["chim-cong", "uyen-uong"],
            name: "Tùng hạc & Chim công uyên ương",
            keyword: "tùng hạc,song hạc,chim công,uyên ương,đĩa công",
            image: "/images/locnam_real/locnam_qua_sep_nu.jpg",
          },
          {
            id: "vat-pham-luu-niem-dac-sac",
            aliases: ["luu-niem-khac"],
            name: "Vật phẩm lưu niệm đặc sắc",
            keyword: "bàn tay phật,bồ đề,nhân sâm,mô hình voi,chặn giấy",
            image: "/images/locnam_real/locnam_qua_cha_me.jpg",
          },
        ],
      },
    ],
  },
];

export function findMainCategory(catSlug: string): MainCategoryData | undefined {
  return DEFAULT_HIERARCHICAL_CATEGORIES.find(
    (c) => c.slug === catSlug || (c.aliases && c.aliases.includes(catSlug))
  );
}

export function findSubCategory(catSlug: string, subSlug: string): SubCategoryItem | undefined {
  const cat = findMainCategory(catSlug);
  if (!cat) return undefined;
  return cat.subCategories.find(
    (s) => s.id === subSlug || (s.aliases && s.aliases.includes(subSlug))
  );
}

export function findDetailCategory(
  catSlug: string,
  subSlug: string,
  detailSlug: string
): DetailCategoryItem | undefined {
  const sub = findSubCategory(catSlug, subSlug);
  if (!sub || !sub.children) return undefined;
  return sub.children.find(
    (d) => d.id === detailSlug || (d.aliases && d.aliases.includes(detailSlug))
  );
}
