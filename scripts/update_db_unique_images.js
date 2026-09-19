const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  { id: 'prod_lo_hoa_01', image: '/images/products/lo-hoa/binh_hoa_sen_dat_vang_24k.jpg' },
  { id: 'prod_lo_hoa_02', image: '/images/products/lo-hoa/doi_lo_hoa_cham_dong_vang.jpg' },
  { id: 'prod_lo_hoa_03', image: '/images/products/lo-hoa/doi_lo_hoa_tron_dong_vang.jpg' },
  { id: 'prod_lo_hoa_04', image: '/images/products/lo-hoa/doi_lo_hoa_tu_quy_catut.jpg' },
  { id: 'prod_lo_hoa_05', image: '/images/products/lo-hoa/lo_hoa_tu_linh_diem_vang.jpg' },
  { id: 'prod_lo_hoa_06', image: '/images/products/lo-hoa/lo_hoa_dat_vang_9999.jpg' },
  { id: 'prod_lo_hoa_07', image: '/images/products/lo-hoa/lo_hoa_hun_gia_co.jpg' },
  { id: 'prod_lo_hoa_08', image: '/images/products/lo-hoa/lo_hoa_dong_moc_nguyen_ban.jpg' },
  { id: 'prod_lo_hoa_09', image: '/images/products/lo-hoa/lo_hoa_mau_co_tu.jpg' },
  { id: 'prod_lo_hoa_10', image: '/images/products/lo-hoa/lo_hoa_dong_do_thu_cong.jpg' },
  { id: 'prod_lo_hoa_11', image: '/images/products/lo-hoa/lo_hoa_kham_tam_khi.jpg' },
  { id: 'prod_lo_hoa_12', image: '/images/products/lo-hoa/lo_hoa_dong_vang_bong.jpg' },
  { id: 'prod_lo_hoa_13', image: '/images/products/lo-hoa/lo_hoa_tu_linh_dong_thau.jpg' },
  { id: 'prod_locnam_007', image: '/images/products/lo-hoa/lo_hoa_bang_dong_locnam.jpg' },
  { id: 'prod_locnam_003', image: '/images/locnam_real/locnam_chan_nen.jpg' },
  { id: 'prod_tam_da_01', image: '/images/products/tuong-dong/tuong_tam_da_dat_vang_9999.jpg' },
  { id: 'prod_tam_da_02', image: '/images/tuong-dong/tuong-tam-da.jpg' },
  { id: 'prod_qua_tang_20_11', image: '/images/products/qua-tang/tranh_chu_tri_an_dat_vang.jpg' }
];

async function main() {
  console.log(`Updating ${updates.length} products with unique authentic images...`);
  for (const item of updates) {
    const p = await prisma.product.findUnique({ where: { id: item.id } });
    if (p) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          images: JSON.stringify([item.image])
        }
      });
      console.log(`Updated [${item.id}] -> ${item.image}`);
    } else {
      console.log(`Product NOT found: ${item.id}`);
    }
  }
  console.log('Update complete!');
}

main().then(() => prisma.$disconnect()).catch(console.error);
