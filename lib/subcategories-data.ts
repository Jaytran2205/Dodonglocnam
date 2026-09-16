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
    banner: "/images/do-tho-dong.jpg",
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
      { id: "dinh-that-lan", name: "Đỉnh thất lân vờn cầu", keyword: "thất lân", image: "/images/do-tho-cung/dinh-that-lan.jpg" },
      { id: "luc-binh-choe", name: "Lục bình - chóe đồng", keyword: "lục bình,chóe", image: "/images/do-tho-cung/luc-binh-choe.jpg" },
    ],
  },
  {
    name: "Trống đồng",
    slug: "trong-dong",
    banner: "/images/trong-dong-viet-nam.jpg",
    subCategories: [
      { id: "trong-dong-luu-niem", name: "Trống đồng lưu niệm", keyword: "lưu niệm", image: "/images/golden_ai/qua_trong_dong.jpg" },
      { id: "qua-trong-dong-co-lon", name: "Quả trống đồng cỡ lớn", keyword: "cỡ lớn", image: "/images/golden_ai/qua_trong_dong.jpg" },
      { id: "mat-trong-dong", name: "Mặt trống đồng", keyword: "mặt trống", image: "/images/golden_ai/mat_trong_dong.jpg" },
    ],
  },
  {
    name: "Tranh đồng",
    slug: "tranh-dong",
    banner: "/images/collections/cat_tranh_dong.jpg",
    subCategories: [
      { id: "tranh-bat-ma", name: "Tranh Bát Mã", keyword: "bát mã", image: "/images/locnam_real/locnam_tranh_bat_ma.jpg" },
      { id: "tranh-thuan-buom", name: "Tranh Thuận Buồm Xuôi Gió", keyword: "thuận buồm", image: "/images/golden_ai/tranh_thuan_buom.jpg" },
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
      { id: "tranh-mat-trong", name: "Tranh Mặt Trống Đồng", keyword: "mặt trống", image: "/images/golden_ai/mat_trong_dong.jpg" },
    ],
  },
  {
    name: "Tượng đồng",
    slug: "tuong-dong",
    banner: "/images/tuong-dong-le-gia.jpg",
    subCategories: [
      {
        id: "tuong-truyen-than",
        aliases: ["tuong-chan-dung-truyen-than"],
        name: "Tượng chân dung, truyền thần",
        keyword: "chân dung,truyền thần",
        image: "/images/golden_ai/tuong_chan_dung.jpg",
      },
      {
        id: "tuong-phat",
        name: "Tượng Phật",
        keyword: "phật,a di đà,thích ca,quan âm",
        image: "/images/golden_ai/tuong_phat.jpg",
        children: [
          { id: "tuong-a-di-da", name: "Tượng A Di Đà", keyword: "a di đà", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-thich-ca", name: "Tượng Thích Ca", keyword: "thích ca", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-quan-am", name: "Tượng Quan Âm Bồ Tát", keyword: "quan âm", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-thien-thu-thien-nhan", name: "Tượng Thiên Thủ Thiên Nhãn", keyword: "thiên thủ", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-chuan-de", name: "Tượng Chuẩn Đề", keyword: "chuẩn đề", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-di-lac", name: "Tượng Di Lặc", keyword: "di lặc", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-van-thu-pho-hien", name: "Tượng Văn Thù - Phổ Hiền", keyword: "văn thù,phổ hiền", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-dat-ma", name: "Tượng Đạt Ma Sư Tổ", keyword: "đạt ma", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-dia-tang", name: "Tượng Địa Tạng Bồ Tát", keyword: "địa tạng", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-sivali", name: "Tượng Thánh Tăng Sivali", keyword: "sivali", image: "/images/golden_ai/tuong_phat.jpg" },
          { id: "tuong-mat-tong", name: "Tượng Mật Tông", keyword: "mật tông", image: "/images/golden_ai/tuong_phat.jpg" },
        ],
      },
      {
        id: "tuong-danh-nhan",
        name: "Tượng danh nhân",
        keyword: "danh nhân,trần hưng đạo,bác hồ,bác giáp",
        image: "/images/golden_ai/tuong_danh_nhan.jpg",
        children: [
          { id: "tuong-tran-hung-dao", name: "Tượng đồng Trần Hưng Đạo", keyword: "trần hưng đạo", image: "/images/golden_ai/tuong_danh_nhan.jpg" },
          { id: "tuong-bac-ho", name: "Tượng Bác Hồ", keyword: "bác hồ", image: "/images/locnam_real/locnam_tranh_bac_ho.jpg" },
          { id: "tuong-vo-nguyen-giap", name: "Tượng Bác Võ Nguyên Giáp", keyword: "võ nguyên giáp,bác giáp", image: "/images/golden_ai/tuong_danh_nhan.jpg" },
          { id: "tuong-gia-cat-luong", aliases: ["tuong-khong-minh"], name: "Tượng Gia Cát Lượng", keyword: "khổng minh,gia cát lượng", image: "/images/golden_ai/tuong_danh_nhan.jpg" },
          { id: "tuong-quan-cong", name: "Tượng Quan Công", keyword: "quan công", image: "/images/golden_ai/tuong_danh_nhan.jpg" },
        ],
      },
      {
        id: "tuong-than-thanh",
        name: "Tượng thần - thánh",
        keyword: "thần,thánh",
        image: "/images/golden_ai/tuong_vua.jpg",
      },
      {
        id: "tuong-tam-da",
        name: "Tượng tam đa",
        keyword: "tam đa,phúc lộc thọ",
        image: "/images/golden_ai/tuong_vua.jpg",
      },
      {
        id: "tuong-vua",
        name: "Tượng vua",
        keyword: "vua",
        image: "/images/golden_ai/tuong_vua.jpg",
      },
      {
        id: "tuong-12-con-giap",
        aliases: ["tuong-linh-vat-12-con-giap"],
        name: "Tượng Linh vật 12 con giáp",
        keyword: "linh vật,12 con giáp,chuột,trâu,hổ,mèo,rồng,rắn,ngựa,dê,khỉ,gà,chó,lợn",
        image: "/images/golden_ai/tuong_12_con_giap.jpg",
        children: [
          { id: "tuong-chuot", name: "Tượng Chuột bằng đồng", keyword: "chuột,tý", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-trau", name: "Tượng Trâu bằng đồng", keyword: "trâu,sửu", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-ho", name: "Tượng Hổ bằng đồng", keyword: "hổ,dần", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-meo", name: "Tượng Mèo bằng đồng", keyword: "mèo,mão", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-rong", aliases: ["tuong-rong-bang-dong"], name: "Tượng Rồng bằng đồng", keyword: "rồng,thìn", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-ran", name: "Tượng Rắn bằng đồng", keyword: "rắn,tỵ", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-ngua", name: "Tượng Ngựa bằng đồng", keyword: "ngựa,ngọ", image: "/images/locnam_real/locnam_tranh_bat_ma.jpg" },
          { id: "tuong-de", name: "Tượng Dê bằng đồng", keyword: "dê,mùi", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-khi", name: "Tượng Khỉ bằng đồng", keyword: "khỉ,thân", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-ga", name: "Tượng Gà bằng đồng", keyword: "gà,dậu", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-cho", name: "Tượng Chó bằng đồng", keyword: "chó,tuất", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "tuong-lon", name: "Tượng Lợn bằng đồng", keyword: "lợn,heo,hợi", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
          { id: "bo-12-con-giap", aliases: ["cac-linh-vat-khac"], name: "Các linh vật bằng đồng khác", keyword: "linh vật khác,bộ 12 con giáp", image: "/images/golden_ai/tuong_12_con_giap.jpg" },
        ],
      },
    ],
  },
  {
    name: "Quà tặng",
    slug: "qua-tang",
    aliases: ["qua-tang-dong"],
    banner: "/images/collections/cat_qua_tang.jpg",
    subCategories: [
      {
        id: "qua-tang-doi-tuong",
        aliases: ["doi-tac"],
        name: "Quà tặng đối tượng",
        keyword: "quà tặng,đối tượng,doanh nghiệp,khách hàng,sếp",
        image: "/images/locnam_real/locnam_qua_doanh_nghiep.jpg",
        children: [
          { id: "qua-tang-doanh-nghiep", aliases: ["qua-doanh-nghiep"], name: "Quà tặng doanh nghiệp", keyword: "doanh nghiệp", image: "/images/locnam_real/locnam_qua_doanh_nghiep.jpg" },
          { id: "qua-tang-khach-hang", aliases: ["qua-khach-hang"], name: "Quà tặng khách hàng", keyword: "khách hàng,lưu niệm", image: "/images/locnam_real/locnam_trong_dong_luu_niem.jpg" },
          { id: "qua-tang-sep-nu", name: "Quà tặng sếp nữ", keyword: "sếp nữ,nữ", image: "/images/locnam_real/locnam_qua_sep_nu.jpg" },
          { id: "qua-tang-sep-nam", aliases: ["qua-doi-tac-sep"], name: "Quà tặng sếp nam", keyword: "sếp nam,sếp,lãnh đạo", image: "/images/locnam_real/locnam_qua_sep_nam.jpg" },
          { id: "qua-tang-cha-me", name: "Quà tặng cha mẹ", keyword: "cha mẹ,ông bà", image: "/images/locnam_real/locnam_qua_cha_me.jpg" },
          { id: "qua-tang-thay-co", name: "Quà tặng thầy cô", keyword: "thầy cô,nhà giáo", image: "/images/locnam_real/locnam_qua_thay_co.jpg" },
        ],
      },
      {
        id: "qua-tang-su-kien",
        aliases: ["su-kien"],
        name: "Quà tặng sự kiện",
        keyword: "quà tặng sự kiện,tết,tân gia,ngày cưới,mừng thọ,cúp",
        image: "/images/demo/demo_cup_vinh_danh.jpg",
        children: [
          { id: "qua-tang-tet", name: "Quà tặng tết", keyword: "tết,tân niên", image: "/images/locnam_real/locnam_qua_tet.jpg" },
          { id: "qua-tang-tan-gia", aliases: ["qua-mung-tan-gia"], name: "Quà tặng tân gia", keyword: "tân gia,nhà mới,thuyền buồm", image: "/images/locnam_real/locnam_thuyen_buom.jpg" },
          { id: "qua-tang-ki-niem-ngay-cuoi", aliases: ["qua-ky-niem-ngay-cuoi"], name: "Quà tặng kỉ niệm ngày cưới", keyword: "ngày cưới,kỷ niệm ngày cưới,uyên ương", image: "/images/locnam_real/locnam_qua_cuoi.jpg" },
          { id: "qua-tang-mung-tho", aliases: ["qua-mung-tho"], name: "Quà tặng mừng thọ", keyword: "mừng thọ,chúc thọ", image: "/images/locnam_real/locnam_qua_cha_me.jpg" },
          { id: "qua-tang-20-11", name: "Quà tặng 20/11", keyword: "20/11,nhà giáo,tri ân", image: "/images/locnam_real/locnam_qua_thay_co.jpg" },
          { id: "qua-tang-20-10-va-8-3", aliases: ["qua-tang-20-10"], name: "Quà tặng 20/10 và 8/3", keyword: "20/10,8/3,phụ nữ", image: "/images/belux/belux_qua_tang_phu_nu.jpg" },
          { id: "cup", aliases: ["cup-vinh-danh"], name: "Cúp", keyword: "cúp,vinh danh", image: "/images/demo/demo_cup_vinh_danh.jpg" },
          { id: "huy-chuong", name: "Huy chương", keyword: "huy chương", image: "/images/demo/demo_cup_vinh_danh.jpg" },
          { id: "bien-chuc-danh", name: "Biển chức danh", keyword: "biển chức danh,để bàn", image: "/images/qua-tang-su-kien-hoi-nghi-bang-dong.jpg" },
        ],
      },
      {
        id: "qua-tang-phong-thuy",
        aliases: ["phong-thuy"],
        name: "Quà tặng phong thủy",
        keyword: "phong thủy,12 con giáp,tỳ hưu,tháp văn xương,cóc thiềm thừ",
        image: "/images/locnam_real/locnam_thiem_thu.jpg",
        children: [
          {
            id: "linh-vat-12-con-giap",
            name: "Linh vật 12 con giáp",
            keyword: "linh vật,12 con giáp,chuột,trâu,hổ,mèo,rồng,rắn,ngựa,dê,khỉ,gà,chó,lợn",
            image: "/images/golden_ai/tuong_12_con_giap.jpg",
          },
          { id: "ty-huu", name: "Tỳ hưu", keyword: "tỳ hưu,chiêu tài", image: "/images/locnam_real/locnam_thiem_thu.jpg" },
          { id: "thap-van-xuong", name: "Tháp văn xương", keyword: "tháp văn xương,học hành,công danh", image: "/images/locnam_real/locnam_thap_van_xuong.jpg" },
          { id: "coc-thiem-thu", aliases: ["thiem-thu"], name: "Cóc thiềm thừ", keyword: "thiềm thừ,cóc ngậm tiền", image: "/images/locnam_real/locnam_thiem_thu.jpg" },
          { id: "cac-mau-phong-thuy-khac", aliases: ["qua-phong-thuy"], name: "Các mẫu phong thủy khác", keyword: "phong thủy khác,bảo bình,hồ lô", image: "/images/belux/belux_phong_thuy.jpg" },
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
