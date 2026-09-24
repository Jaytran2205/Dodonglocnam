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
      { id: "bo-suu-tap-do-tho", name: "Bộ sưu tập đồ thờ đầy đủ", keyword: "bộ sưu tập,đồ thờ đầy đủ,đầy đủ,day du,trọn bộ đồ thờ,bộ đồ thờ đầy đủ,đồ thờ cúng đầy đủ", image: "/images/do-tho-cung/bo-suu-tap-do-tho.jpg" },
      { id: "bo-tam-su-ngu-su", aliases: ["bo-ngu-su", "dinh-dong"], name: "Bộ tam sự, ngũ sự bằng đồng", keyword: "tam sự,ngũ sự,đỉnh đồng,đỉnh thờ,dinh tho,đỉnh bát tiên,dinh bat tien,đỉnh tai mây,dinh tai may,đỉnh trúc vuông,dinh truc vuong,đỉnh 50,đỉnh 60,đỉnh 70", image: "/images/do-tho-cung/bo-tam-su-ngu-su.jpg" },
      { id: "chan-nen", name: "Chân nến", keyword: "chân nến", image: "/images/do-tho-cung/chan-nen.jpg" },
      { id: "hac-tho", name: "Hạc thờ", keyword: "hạc thờ", image: "/images/do-tho-cung/hac-tho.jpg" },
      { id: "den-tho", name: "Đèn thờ", keyword: "đèn thờ", image: "/images/do-tho-cung/den-tho.jpg" },
      { id: "bat-huong", name: "Bát hương", keyword: "bát hương", image: "/images/do-tho-cung/bat-huong.jpg" },
      { id: "ong-huong", aliases: ["ong-dung-huong"], name: "Ống hương", keyword: "ống hương,ống đựng hương,đựng hương,ong huong,ong dung huong", image: "/images/do-tho-cung/ong-huong.jpg" },
      { id: "lo-hoa", name: "Lọ hoa", keyword: "lọ hoa", image: "/images/do-tho-cung/lo-hoa.jpg" },
      { id: "lo-loc-binh", aliases: ["loc-binh", "luc-binh-choe", "choe-dong", "loc-binh-choe", "luc-binh"], name: "Lọ lộc bình", keyword: "lộc bình,lọ lộc bình,đôi lọ lộc bình,đôi lộc bình,lục bình,củ tỏi,chóe,lọ lục bình", image: "/images/do-tho-cung/luc-binh-choe.jpg" },
      { id: "mam-bong", name: "Mâm bồng", keyword: "mâm bồng", image: "/images/do-tho-cung/mam-bong.jpg" },
      { id: "dai-nuoc", name: "Đài nước", keyword: "đài nước,đài thờ,bộ đài thờ,đài đựng nước,dai nuoc,dai tho", image: "/images/do-tho-cung/dai-nuoc.jpg" },
      { id: "ngai-chen", aliases: ["ky-chen"], name: "Ngai chén", keyword: "ngai chén,kỷ chén,ấm nước,ấm khay chén,khay chén,ngai chen,ky chen", image: "/images/do-tho-cung/ngai-chen.jpg" },
      { id: "am-nuoc", name: "Ấm nước", keyword: "ấm nước", image: "/images/do-tho-cung/am-nuoc.jpg" },
      {
        id: "chuong-chieng-dong",
        aliases: ["chuong-tho", "chieng-khanh", "dai-hong-chung", "chuong-tho-nho-dai-hong-chung", "chieng-khanh-chuong-bat"],
        name: "Chuông Chiêng Đồng",
        keyword: "chuông,chiêng,khánh,chuông bát,chuông thờ,đại hồng chung,chuông đồng,chiêng đồng,khánh đồng",
        image: "/images/do-tho-cung/chuong-tho.jpg",
        children: [
          { id: "chieng-dong", name: "Chiêng Đồng", keyword: "chiêng,chiêng đồng,chieng dong", image: "/images/do-tho-cung/chieng-khanh.jpg" },
          { id: "chuong-dong", name: "Chuông Đồng", keyword: "chuông,chuông đồng,chuong dong,chuông thờ", image: "/images/do-tho-cung/chuong-tho.jpg" },
          { id: "khanh-dong", name: "Khánh Đồng", keyword: "khánh,khánh đồng,khanh dong", image: "/images/do-tho-cung/chieng-khanh.jpg" },
          { id: "dai-hong-chung", name: "Đại Hồng Chung", keyword: "đại hồng chung,chuông chùa,đúc chuông", image: "/images/do-tho-cung/dai-hong-chung.jpg" },
        ],
      },
      { id: "cuu-huyen-that-to", name: "Cửu huyền thất tổ", keyword: "cửu huyền thất tổ", image: "/images/do-tho-cung/cuu-huyen-that-to.jpg" },
      { id: "ngai-tho", name: "Ngai thờ", keyword: "ngai thờ", image: "/images/do-tho-cung/ngai-tho.jpg" },
      { id: "bai-vi", name: "Bài vị", keyword: "bài vị", image: "/images/do-tho-cung/bai-vi.jpg" },
      { id: "cuon-thu-cau-doi", aliases: ["hoanh-phi-cau-doi"], name: "Cuốn thư câu đối", keyword: "cuốn thư,câu đối,hoành phi", image: "/images/do-tho-cung/cuon-thu-cau-doi.jpg" },
      { id: "dai-tu", name: "Đại tự", keyword: "đại tự", image: "/images/do-tho-cung/dai-tu.jpg" },
      { id: "dinh-lu-huong", name: "Đỉnh - Lư hương cỡ lớn", keyword: "lư hương,đỉnh cỡ lớn,đỉnh co lon,song long chầu nguyệt,đỉnh thờ,lu huong", image: "/images/do-tho-cung/dinh-lu-huong.jpg" },
      { id: "dinh-that-lan", aliases: ["dinh-that-lan-von-cau", "dinh-cau", "dinh-qua-bong"], name: "Đỉnh thất lân vờn cầu - Đỉnh cầu", keyword: "thất lân,vờn cầu,đỉnh cầu,quả bóng,đỉnh bóng,dinh cau,dinh qua bong,dinh bong", image: "/images/do-tho-cung/dinh-that-lan.jpg" },
    ],
  },
  {
    name: "Trống đồng",
    slug: "trong-dong",
    banner: "/images/banners/banner_danh_muc_trong_dong.jpg",
    subCategories: [
      { id: "qua-trong-dong-co-lon", aliases: ["trong-dong-dong-son", "trong-dong-ngoc-lu"], name: "Quả trống đồng Đông Sơn & Ngọc Lũ", keyword: "quả trống,qua trong,trống đồng đỏ,trống đồng đông sơn,trống đồng ngọc lũ,trống đông sơn,trống ngọc lũ,hoa văn nổi,hoa văn chìm,bàn uống trà,bàn trà,giả cổ,cỡ lớn,trong dong co lon,qua trong dong", image: "/images/trong-dong/qua-trong-dong-co-lon.jpg" },
      { id: "trong-dong-luu-niem", aliases: ["trong-dong-ma-vang", "trong-dong-qua-tang"], name: "Trống đồng lưu niệm & Quà tặng mạ vàng", keyword: "lưu niệm,mạ vàng,dát vàng,quà tặng,qua tang,tỉnh hưng yên,sang trọng,ma vang,dat vang,luu niem", image: "/images/trong-dong/trong-dong-luu-niem.jpg" },
      { id: "mat-trong-dong", aliases: ["tranh-mat-trong-dong", "tranh-mat-trong"], name: "Mặt trống đồng & Tranh mặt trống", keyword: "mặt trống,tranh mặt trống,tranh trống,đúc mặt,duc mat,khung gỗ,gỗ hương,gỗ gụ,treo tường,ăn mòn,an mon,bản đồ,mat trong", image: "/images/trong-dong/mat-trong-dong.jpg" },
    ],
  },
  {
    name: "Tranh đồng",
    slug: "tranh-dong",
    banner: "/images/banners/banner_danh_muc_tranh_dong.jpg",
    subCategories: [
      { id: "tranh-vinh-hoa-phu-quy", aliases: ["vinh-hoa-phu-quy"], name: "Tranh Vinh Hoa Phú Quý", keyword: "vinh hoa phú quý,vinh hoa phu quy,vinh hoa", image: "/images/products/tranh-dong/tranh-vinh-hoa-phu-quy-bang-dong-2m-x-80cm-dat-vang-1.jpg" },
      { id: "tranh-bat-ma", aliases: ["tranh-ma-dao-thanh-cong"], name: "Tranh Bát Mã - Mã Đáo Thành Công", keyword: "bát mã,mã đáo,mã đáo thành công,ma dao,bat ma", image: "/images/locnam_real/locnam_tranh_bat_ma.jpg" },
      { id: "tranh-thuan-buom", name: "Tranh Thuận Buồm Xuôi Gió", keyword: "thuận buồm,thuan buom", image: "/images/locnam_real/locnam_tranh_thuan_buom.jpg" },
      { id: "tranh-vinh-quy", name: "Tranh Vinh Quy Bái Tổ", keyword: "vinh quy,vinh quy bái tổ", image: "/images/locnam_real/locnam_tranh_vinh_quy.jpg" },
      { id: "tranh-dong-que", name: "Tranh Đồng Quê", keyword: "đồng quê,dong que", image: "/images/locnam_real/locnam_tranh_dong_que.jpg" },
      { id: "tranh-son-thuy-huu-tinh", aliases: ["son-thuy-huu-tinh"], name: "Tranh Sơn Thủy Hữu Tình", keyword: "sơn thủy,sơn thủy hữu tình,son thuy,son thuy huu tinh", image: "/images/belux/belux_phong_thuy.jpg" },
      { id: "tranh-ngoc-duong", name: "Tranh Ngọc Đường Phú Quý", keyword: "ngọc đường,chim công", image: "/images/locnam_real/locnam_qua_sep_nu.jpg" },
      { id: "tranh-tu-quy", name: "Tranh Tứ Quý", keyword: "tứ quý,tu quy", image: "/images/locnam_real/locnam_tranh_tu_quy.jpg" },
      { id: "tranh-ca-chep", aliases: ["tranh-cuu-ngu", "tranh-ly-ngu"], name: "Tranh Cá Chép - Cửu Ngư Quần Hội", keyword: "cá chép,lý ngư vọng nguyệt,cửu ngư,cửu ngư quần hội,ly ngu,cuu ngu,hoa sen", image: "/images/locnam_real/locnam_tranh_ca_chep.jpg" },
      { id: "tranh-bach-hac", name: "Tranh Bách Hạc Quần Tùng", keyword: "bách hạc,tùng hạc", image: "/images/belux/belux_tranh_bach_hac.jpg" },
      { id: "tranh-chua-mot-cot", name: "Tranh Chùa Một Cột", keyword: "chùa một cột", image: "/images/locnam_real/locnam_qua_thay_co.jpg" },
      { id: "tranh-khue-van-cac", name: "Tranh Khuê Văn Các", keyword: "khuê văn các", image: "/images/locnam_real/locnam_qua_thay_co.jpg" },
      { id: "tranh-chu-bang-dong", name: "Tranh Chữ Bằng Đồng", keyword: "tranh chữ,chữ phúc,chữ lộc,chữ thọ,chữ tâm,chữ nhẫn,chữ đức,chữ an,chu phuc,chu loc,chu tho,chu nhan,thư pháp", image: "/images/locnam_real/locnam_hoanh_phi.jpg" },
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
        keyword: "chân dung,truyền thần,thầy viên minh,sư bà,phùng quang thanh,scan 3d,tượng nghệ thuật,nghệ thuật,đại trưởng lão,thích thanh từ,hoa thuong,truyen than,chan dung",
        image: "/images/tuong-dong/tuong-truyen-than.jpg",
      },
      {
        id: "tuong-phat",
        name: "Tượng Phật",
        keyword: "phật,a di đà,thích ca,quan âm,dược sư,đản sinh,bồ tát,phat",
        image: "/images/tuong-dong/tuong-phat.jpg",
        children: [
          { id: "tuong-a-di-da", name: "Tượng A Di Đà", keyword: "a di đà,a di da", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-thich-ca", name: "Tượng Thích Ca", keyword: "thích ca,thich ca", image: "/images/locnam_real/locnam_buddha_22_tuong-phat-thich-ca-bang-.jpg" },
          { id: "tuong-quan-am", name: "Tượng Quan Âm Bồ Tát", keyword: "quan âm,quan am", image: "/images/locnam_real/locnam_buddha_19_tuong-phat-ba-quan-am-ban.jpg" },
          { id: "tuong-thien-thu-thien-nhan", name: "Tượng Thiên Thủ Thiên Nhãn", keyword: "thiên thủ,thien thu", image: "/images/locnam_real/locnam_buddha_35_tuong-phat-thien-thu-thie.jpg" },
          { id: "tuong-chuan-de", name: "Tượng Chuẩn Đề", keyword: "chuẩn đề,chuan de", image: "/images/locnam_real/locnam_buddha_15_tuong-chuan-de-bang-dong-.jpg" },
          { id: "tuong-di-lac", aliases: ["tuong-di-lac-bang-dong", "di-lac", "di-lac-bang-dong", "tuong-di-lac-di-lac"], name: "Tượng Di Lặc", keyword: "di lặc,di lạc,di lac,phật cười", image: "/images/locnam_real/locnam_buddha_01_tuong-di-lac-dung-bang-do.jpg" },
          { id: "tuong-van-thu-pho-hien", aliases: ["tuong-van-thu", "tuong-pho-hien", "van-thu-pho-hien"], name: "Tượng Văn Thù - Phổ Hiền", keyword: "văn thù,phổ hiền,van thu,pho hien", image: "/images/locnam_real/locnam_buddha_55_tuong-van-thu-8211-pho-hi.jpg" },
          { id: "tuong-duoc-su", aliases: ["duoc-su", "tuong-phat-duoc-su"], name: "Tượng Dược Sư", keyword: "dược sư,duoc su", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-phat-dan-sinh", aliases: ["tuong-dan-sinh", "dan-sinh"], name: "Tượng Phật Đản Sinh", keyword: "đản sinh,dan sinh", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-dat-ma", name: "Tượng Đạt Ma Sư Tổ", keyword: "đạt ma,dat ma,sư tổ,su to", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-dia-tang", name: "Tượng Địa Tạng Bồ Tát", keyword: "địa tạng,dia tang", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-sivali", name: "Tượng Thánh Tăng Sivali", keyword: "sivali", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
          { id: "tuong-mat-tong", name: "Tượng Mật Tông", keyword: "mật tông,mat tong", image: "/images/locnam_real/locnam_buddha_08_tuong-phat-a-di-da-bang-d.jpg" },
        ],
      },
      {
        id: "tuong-danh-nhan",
        name: "Tượng danh nhân",
        keyword: "danh nhân,trần hưng đạo,trần quốc tuấn,bác hồ,bác giáp,võ nguyên giáp,quan công,quan vân trường,gia cát lượng,khổng minh,nguyễn trãi,phùng quang thanh,tướng quân,lê đại đao,danh nhan,tran hung dao,tran quoc tuan,nguyen trai",
        image: "/images/tuong-dong/tuong-danh-nhan.jpg",
        children: [
          { id: "tuong-tran-hung-dao", aliases: ["tuong-tran-quoc-tuan", "tran-quoc-tuan", "duc-thanh-tran"], name: "Tượng đồng Trần Hưng Đạo - Trần Quốc Tuấn", keyword: "trần hưng đạo,trần quốc tuấn,tran hung dao,tran quoc tuan,đức thánh trần,duc thanh tran", image: "/images/locnam_real/locnam_tran_hung_dao.jpg?v=clean_grid_v5" },
          { id: "tuong-bac-ho", name: "Tượng Bác Hồ", keyword: "bác hồ,bac ho", image: "/images/locnam_real/locnam_bac_ho.jpg?v=clean_grid_v5" },
          { id: "tuong-vo-nguyen-giap", name: "Tượng Bác Võ Nguyên Giáp", keyword: "võ nguyên giáp,bác giáp,vo nguyen giap,bac giap", image: "/images/locnam_real/locnam_bac_giap.jpg?v=clean_grid_v5" },
          { id: "tuong-gia-cat-luong", aliases: ["tuong-khong-minh"], name: "Tượng Gia Cát Lượng", keyword: "khổng minh,gia cát lượng,khong minh,gia cat luong", image: "/images/locnam_real/locnam_khong_minh.jpg?v=clean_grid_v5" },
          { id: "tuong-quan-cong", aliases: ["tuong-quan-van-truong", "quan-van-truong"], name: "Tượng Quan Công - Quan Vân Trường", keyword: "quan công,quan vân trường,quan cong,quan van truong", image: "/images/locnam_real/locnam_quan_cong.jpg?v=clean_grid_v5" },
        ],
      },
      {
        id: "tuong-than-thanh",
        name: "Tượng thần - thánh",
        keyword: "cửu trùng thiên,mẫu cửu trùng thiên,bà chúa sơn trang,sơn trang,quản gia,tượng quản gia,mẫu cửu trùng,mau cuu trung thien,ba chua son trang,quan gia",
        image: "/images/products/tuong-than-thanh/tuong-mau-cuu-trung-thien-duc-bang-dong-dat-vang-24k/img_01.jpg",
      },
      {
        id: "tuong-tam-da",
        name: "Tượng tam đa",
        keyword: "tam đa,phúc lộc thọ,tam da,phuc loc tho",
        image: "/images/tuong-dong/tuong-tam-da.jpg",
      },
      {
        id: "tuong-vua",
        name: "Tượng vua - Hoàng đế",
        keyword: "vua,hoàng đế,lê đại hành,lê lợi,ngô quyền,đức vương ngô quyền,lý thái tổ,quang trung,nguyễn huệ,hoang de,le dai hanh,ngo quyen,ly thai to,duc vuong",
        image: "/images/tuong-dong/tuong-vua.jpg",
      },
      {
        id: "tuong-12-con-giap",
        aliases: ["tuong-linh-vat-12-con-giap"],
        name: "Tượng Linh vật 12 con giáp",
        keyword: "linh vật,12 con giáp,chuột,trâu,hổ,mèo,rồng,rắn,ngựa,dê,khỉ,gà,chó,lợn,tam dương,mã thượng phong hầu,bát mã",
        image: "/images/tuong-dong/tuong-12-con-giap.jpg",
        children: [
          { id: "tuong-chuot", name: "Tượng Chuột bằng đồng", keyword: "tượng chuột,chuột phong thủy,chuột bằng đồng,chuột mạ vàng,chuột tài lộc", image: "/images/tuong-dong/12-con-giap/avatar-chuot.jpg" },
          { id: "tuong-trau", name: "Tượng Trâu bằng đồng", keyword: "tượng trâu,trâu phong thủy,trâu bằng đồng,trâu mạ vàng,trâu tài lộc,bò tót", image: "/images/tuong-dong/12-con-giap/avatar-trau.jpg" },
          { id: "tuong-ho", name: "Tượng Hổ bằng đồng", keyword: "tượng hổ,hổ phong thủy,hổ bằng đồng,hổ mạ vàng,hổ gầm", image: "/images/tuong-dong/12-con-giap/avatar-ho.jpg" },
          { id: "tuong-meo", name: "Tượng Mèo bằng đồng", keyword: "tượng mèo,mèo phong thủy,mèo bằng đồng,mèo mạ vàng,mèo tài lộc", image: "/images/tuong-dong/12-con-giap/avatar-meo.jpg" },
          { id: "tuong-rong", aliases: ["tuong-rong-bang-dong"], name: "Tượng Rồng bằng đồng", keyword: "tượng rồng,rồng phong thủy,rồng bằng đồng,rồng mạ vàng,rồng cuộn,ấn rồng", image: "/images/tuong-dong/12-con-giap/avatar-rong.jpg" },
          { id: "tuong-ran", name: "Tượng Rắn bằng đồng", keyword: "tượng rắn,rắn phong thủy,rắn bằng đồng,rắn mạ vàng,rắn ngậm ngọc", image: "/images/tuong-dong/12-con-giap/avatar-ran.jpg" },
          { id: "tuong-ngua", name: "Tượng Ngựa bằng đồng", keyword: "ngựa hí,tượng ngựa,ngựa phong thủy,tuấn mã", image: "/images/tuong-dong/12-con-giap/avatar-ngua.jpg" },
          { id: "tuong-de", name: "Tượng Dê bằng đồng", keyword: "tượng dê,dê bằng đồng,dê phong thủy,dê ngậm tiền,tam dương", image: "/images/tuong-dong/12-con-giap/avatar-de.jpg" },
          { id: "tuong-khi", name: "Tượng Khỉ bằng đồng", keyword: "tượng khỉ,khỉ phong thủy,khỉ bằng đồng,khỉ ngồi,khỉ ôm", image: "/images/tuong-dong/12-con-giap/avatar-khi.jpg" },
          { id: "tuong-ga", name: "Tượng Gà bằng đồng", keyword: "tượng gà,gà trống,gà bằng đồng,gà phong thủy,gà như ý", image: "/images/tuong-dong/12-con-giap/avatar-ga.jpg" },
          { id: "tuong-cho", name: "Tượng Chó bằng đồng", keyword: "tượng chó,chó bằng đồng,chó phong thủy,rước tài lộc", image: "/images/tuong-dong/12-con-giap/avatar-cho.jpg" },
          { id: "tuong-lon", name: "Tượng Lợn bằng đồng", keyword: "tượng lợn,tượng heo,lợn phong thủy,heo phong thủy,lợn bằng đồng,heo bằng đồng", image: "/images/tuong-dong/12-con-giap/avatar-lon.jpg" },
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
        keyword: "thuyền buồm,thuận buồm,thuyền,kim ngân,cây kim ngân,tùng la hán,cây tùng,chữ an,chữ phúc,chữ thọ,chữ tâm,đôi hươu,đại bàng,đĩa thuyền,nhất mã,song mã,song ngựa,hũ lúa,bông lúa,mô hình rồng,doanh nghiệp,đối tác,khách hàng,sếp,cha mẹ",
        image: "/images/collections/grid_qua_tang_doanh_nghiep.png",
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
            keyword: "tranh chữ,tranh chữ phúc,tranh chữ tâm,tranh chữ an,tranh chữ thọ",
            image: "/images/products/qua-tang-doanh-nghiep/tranh-chu-phuc-nen-den_chinh.jpg",
          },
          {
            id: "qua-tang-doanh-nghiep-vip",
            aliases: ["linh-vat-doanh-nghiep", "qua-tang-khach-hang", "qua-tang-sep-nam", "qua-tang-sep-nu", "qua-tang-cha-me", "qua-tang-thay-co"],
            name: "Quà biếu đối tác & Doanh nghiệp VIP",
            keyword: "tùng la hán,cây tùng,đôi hươu,đại bàng,đĩa thuyền,nhất mã,song mã,song ngựa,hũ lúa,bông lúa,mô hình rồng,doanh nghiệp,đối tác,sếp,cha mẹ,quà tặng cha mẹ,tri ân",
            image: "/images/locnam_real/locnam_qua_doanh_nghiep.jpg",
          },
        ],
      },
      {
        id: "qua-tang-su-kien",
        aliases: ["su-kien", "qua-tang-su-kien-nhan-dip"],
        name: "Quà tặng sự kiện, nhân dịp",
        keyword: "hoa sen,sen,chậu hoa sen,mô hình sen,hoa lan,lan hồ điệp,hoa mẫu đơn,mẫu đơn,cây trúc,trúc quân tử,cây lúa,bông lúa,bông lúa vàng,mẫu đơn như ý,tranh hoa sen,tranh tri ân,đĩa sen,sự kiện,tết,tân gia,mừng thọ,20/11,20/10,cúp,huy chương,biển chức danh,cha mẹ,quà tặng cha mẹ",
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
            image: "/images/products/qua-tang-su-kien/hoa-mau-don_chinh.jpg",
          },
          {
            id: "tranh-tri-an-su-kien",
            aliases: ["tri-an", "qua-tang-20-11", "qua-tang-mung-tho", "qua-tang-tan-gia", "cup", "huy-chuong", "bien-chuc-danh"],
            name: "Tranh tri ân & Quà sự kiện",
            keyword: "tranh tri ân,tri ân,cây trúc,cây lúa,bông lúa,bông lúa vàng,cúp,huy chương,biển chức danh,sự kiện,tết,tân gia,mừng thọ,20/11,20/10,cha mẹ,quà tặng cha mẹ",
            image: "/images/locnam_real/locnam_qua_thay_co.jpg",
          },
        ],
      },
      {
        id: "qua-tang-phong-thuy",
        aliases: ["phong-thuy"],
        name: "Quà tặng phong thủy",
        keyword: "cá rồng,cây kim ngân,hũ tiền,ngựa thần tài,song mã,song mã vượng tài,bông lúa,sơn thủy,sơn thủy hữu tình,rùa hóa rồng,long quy,rồng,song cá,song ngư,tranh cá chép,mã đáo thành công,bát mã,tranh ngựa,đĩa cá,đĩa ngựa,tỳ hưu,thiềm thừ,cóc,tháp văn xương",
        image: "/images/locnam_real/locnam_thiem_thu.jpg",
        children: [
          {
            id: "linh-vat-phong-thuy-chieu-tai",
            aliases: ["ty-huu", "coc-thiem-thu"],
            name: "Linh vật phong thủy chiêu tài",
            keyword: "cá rồng,ngựa thần tài,song mã,song mã vượng tài,rùa hóa rồng,long quy,rồng,song cá,song ngư,tỳ hưu,thiềm thừ,cóc",
            image: "/images/locnam_real/locnam_thiem_thu.jpg",
          },
          {
            id: "vat-pham-tu-tai-phat-loc",
            aliases: ["thap-van-xuong"],
            name: "Hũ tiền & Vật phẩm tụ tài",
            keyword: "hũ tiền,tụ bảo bồn,kim ngân,tháp văn xương,bông lúa,bông lúa vàng",
            image: "/images/locnam_real/locnam_thap_van_xuong.jpg",
          },
          {
            id: "tranh-dia-phong-thuy-cat-tuong",
            aliases: ["cac-mau-phong-thuy-khac"],
            name: "Tranh & Đĩa phong thủy cát tường",
            keyword: "tranh cá chép,tranh mã đáo,tranh bát mã,tranh ngựa,đĩa song cá,đĩa đồng,đĩa cá,đĩa ngựa,đĩa mã đáo,sơn thủy,sơn thủy hữu tình,song mã",
            image: "/images/belux/belux_phong_thuy.jpg",
          },
        ],
      },
      {
        id: "qua-tang-luu-niem",
        aliases: ["qua-tang-ky-niem", "qua-luu-niem", "luu-niem", "qua-tang-luu-niem-ki-niem"],
        name: "Quà tặng lưu niệm, kỉ niệm",
        keyword: "chùa một cột,chợ bến thành,khuê văn các,tháp rùa,trống đồng,tùng hạc,song hạc,chim công,uyên ương,khổng tước,bàn tay phật,cây bồ đề,nhân sâm,mô hình voi,chặn giấy pha lê,lưu niệm,kỷ niệm",
        image: "/images/collections/grid_qua_tang_luu_niem.png",
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
