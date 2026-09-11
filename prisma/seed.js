const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding authentic data with local images for Đồ Đồng Lộc Nam...');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123456', salt);

  await prisma.user.upsert({
    where: { email: 'admin@ducdonglocnam.com' },
    update: {},
    create: {
      email: 'admin@ducdonglocnam.com',
      password: hashedPassword,
      name: 'Nghệ Nhân Dương Bá Tiến - Đồ Đồng Lộc Nam',
      role: 'ADMIN',
    },
  });

  // 1. Categories
  const categories = [
    {
      name: 'Đồ Thờ Cúng Bằng Đồng',
      slug: 'do-tho-cung',
      description: 'Bộ ngũ sự, tam sự, đỉnh đồng khảm ngũ sắc, bát hương, hạc thờ, chân nến, mâm bồng, hoành phi câu đối cao cấp.',
      image: '/images/do-tho-cung.jpg',
      order: 1,
    },
    {
      name: 'Tượng Đồng & Tượng Phật',
      slug: 'tuong-dong',
      description: 'Tượng Phật Thích Ca, Quan Âm, A Di Đà, tượng Bác Hồ, Đại tướng Võ Nguyên Giáp, Trần Quốc Tuấn, tượng chân dung.',
      image: '/images/tuong-dong.jpg',
      order: 2,
    },
    {
      name: 'Tranh Đồng & Trống Đồng',
      slug: 'qua-tang-dong',
      description: 'Tranh Vinh hoa phú quý, Thuận buồm xuôi gió, Tứ quý mạ vàng 24k, Quả trống đồng Đông Sơn, Mặt trống đồng đúc thủ công.',
      image: '/images/qua-tang-dong.jpg',
      order: 3,
    },
    {
      name: 'Đúc Chuông Chiêng & Công Trình',
      slug: 'duc-chuong-cong-trinh',
      description: 'Dịch vụ đúc đại hồng chung đình chùa từ 100kg - 10 tấn, đúc tượng Phật cỡ lớn tận nơi trên toàn quốc.',
      image: '/images/artisan-foundry.jpg',
      order: 4,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 2. Products with local images
  const products = [
    // Đồ thờ
    {
      name: 'Bộ Đồ Thờ Ngũ Sự Khảm Ngũ Sắc Đỉnh Thất Lân Vờn Cầu 70cm',
      slug: 'bo-ngu-su-kham-ngu-sac-that-lan-70cm',
      price: 48000000,
      originalPrice: 55000000,
      material: 'Đồng đỏ nguyên chất khảm 5 kim khí (Vàng 9999, Bạc 9999, Đồng đỏ, Đồng vàng, Đồng đen)',
      dimensions: 'Đỉnh cao 70cm, Đôi hạc 72cm, Đôi chân nến 55cm',
      weight: '58kg',
      shortDescription: 'Kiệt tác đỉnh thờ thất lân vờn cầu khảm ngũ sắc đỉnh cao từ xưởng Đồ Đồng Lộc Nam.',
      description: 'Bộ ngũ sự thất lân vờn cầu được nghệ nhân Dương Bá Tiến trực tiếp chạm khảm tinh xảo từng sợi vàng, lá bạc.',
      images: JSON.stringify(['/images/dinh-dong-that-lan.jpg', '/images/do-tho-cung.jpg']),
      isFeatured: true,
      categorySlug: 'do-tho-cung',
    },
    {
      name: 'Bộ Đồ Thờ Đầy Đủ Bằng Đồng Vàng Đậm Mạ Vàng 24K Bàn Thờ 1m97',
      slug: 'bo-do-tho-day-du-ma-vang-24k-1m97',
      price: 36000000,
      originalPrice: 42000000,
      material: 'Đồng Catut mạ vàng 24k công nghệ điện phân chuẩn bảo tàng',
      dimensions: 'Phù hợp bàn thờ dài 1m97 đến 2m17',
      weight: '42kg',
      shortDescription: 'Gồm Đỉnh đồng, đôi hạc, đôi chân nến, bát hương, mâm bồng, ngai chén, ống hương, đèn thờ.',
      description: 'Bộ đồ thờ đầy đủ trang nghiêm, mạ vàng 24k mang lại ánh kim sang trọng và linh thiêng cho gia tiên.',
      images: JSON.stringify(['/images/bo-do-tho-ma-vang.jpg', '/images/do-tho-cung.jpg']),
      isFeatured: true,
      categorySlug: 'do-tho-cung',
    },
    {
      name: 'Đôi Hạc Thờ Bằng Đồng Đỏ Cỡ Lớn Ngự Long Quy Cao 1m80',
      slug: 'doi-hac-tho-bang-dong-do-1m80',
      price: 52000000,
      originalPrice: 60000000,
      material: 'Đồng đỏ thanh khiết đúc liền khối',
      dimensions: 'Cao 1m80 (tính từ chân rùa đến đỉnh hoa sen)',
      weight: '120kg/đôi',
      shortDescription: 'Đôi hạc chầu cỡ đại cung tiến đình chùa, nhà thờ họ, điện thờ lớn.',
      description: 'Đúc thủ công nguyên khối, chạm trổ từng sợi lông vũ, ngậm cành sen thanh cao.',
      images: JSON.stringify(['/images/doi-hac-tho.jpg', '/images/do-tho-cung.jpg']),
      isFeatured: true,
      categorySlug: 'do-tho-cung',
    },

    // Tượng đồng
    {
      name: 'Tượng Phật Thích Ca Mâu Ni Ngồi Tọa Đài Sen Bằng Đồng Đỏ Cao 1m2',
      slug: 'tuong-phat-thich-ca-dong-do-1m2',
      price: 65000000,
      originalPrice: 75000000,
      material: 'Đồng đỏ nguyên khối hun màu giả cổ',
      dimensions: 'Cao 1m20, Tọa đài sen rộng 85cm',
      weight: '160kg',
      shortDescription: 'Diện tượng từ bi, thanh tịnh, khuôn diện chuẩn nhân tướng học Phật giáo.',
      description: 'Được các nghệ nhân Lộc Nam đúc theo chuẩn tỷ lệ Phật giáo Bắc Tông, diện mạo trang nghiêm.',
      images: JSON.stringify(['/images/tuong-phat.jpg', '/images/tuong-dong.jpg']),
      isFeatured: true,
      categorySlug: 'tuong-dong',
    },
    {
      name: 'Tượng Bác Hồ Ngồi Ghế Mây Bằng Đồng Dát Vàng 9999 Cao 90cm',
      slug: 'tuong-bac-ho-ngoi-ghe-may-dat-vang-90cm',
      price: 38000000,
      originalPrice: 45000000,
      material: 'Đồng đỏ đúc liền khối, dát vàng lá 9999 toàn thân',
      dimensions: 'Cao 90cm x Rộng 60cm',
      weight: '45kg',
      shortDescription: 'Tác phẩm truyền thần Bác Hồ ngồi đọc báo trang trọng cho phòng hội trường, phòng truyền thống.',
      description: 'Khuôn mặt hiền từ, ánh mắt sáng ngời, từng nếp áo và vân mây ghế mây sống động.',
      images: JSON.stringify(['/images/tuong-bac-ho.jpg', '/images/tuong-dong.jpg']),
      isFeatured: true,
      categorySlug: 'tuong-dong',
    },
    {
      name: 'Tượng Đức Thánh Trần Quốc Tuấn Chỉ Tay Uy Dũng Bằng Đồng Catut 81cm',
      slug: 'tuong-tran-quoc-tuan-catut-81cm',
      price: 22000000,
      originalPrice: 26000000,
      material: 'Đồng Catut quân sự ánh vàng kim đanh thép',
      dimensions: 'Cao 81cm, Nặng 32kg',
      weight: '32kg',
      shortDescription: 'Tượng Quốc Công Tiết Chế Hưng Đạo Đại Vương trấn trạch vượng khí.',
      description: 'Tay cầm hịch tướng sĩ, tay cầm đốc kiếm, phong thái anh hùng dân tộc ngút trời.',
      images: JSON.stringify(['/images/tuong-tran-quoc-tuan.jpg', '/images/tuong-dong.jpg']),
      isFeatured: true,
      categorySlug: 'tuong-dong',
    },

    // Tranh & Trống đồng
    {
      name: 'Quả Trống Đồng Đông Sơn Đúc Thủ Công Đường Kính 60cm Kèm Chân Đế',
      slug: 'qua-trong-dong-dong-son-duc-thu-cong-60cm',
      price: 28000000,
      originalPrice: 32000000,
      material: 'Đồng đỏ nguyên chất hun màu giả cổ',
      dimensions: 'Đường kính mặt 60cm, Thân cao 50cm',
      weight: '38kg',
      shortDescription: 'Bản sao chuẩn xác trống đồng Đông Sơn cổ đại, hoa văn chim lạc và mặt trời sắc nét.',
      description: 'Biểu tượng văn hóa bất hủ của dân tộc Việt Nam, trưng bày đại sảnh và phòng khách biệt thự.',
      images: JSON.stringify(['/images/trong-dong-dong-son.jpg', '/images/qua-tang-dong.jpg']),
      isFeatured: true,
      categorySlug: 'qua-tang-dong',
    },
    {
      name: 'Tranh Đồng Vinh Hoa Phú Quý Mạ Vàng 24K Khung Gỗ Gụ 2m3 x 1m2',
      slug: 'tranh-dong-vinh-hoa-phu-quy-ma-vang-2m3',
      price: 32000000,
      originalPrice: 38000000,
      material: 'Đồng tấm dày 8rem mạ vàng 24k dát bạc, khung gỗ gụ đục hoa mai',
      dimensions: 'Dài 2m30 x Rộng 1m20',
      weight: '40kg',
      shortDescription: 'Bức tranh phong thủy thu hút vượng khí, tài lộc, gia đạo hưng thịnh vinh hiển.',
      description: 'Chạm khắc công phu hình tượng cây mai, chim hỷ tước, cuốn thư, bình hoa phú quý.',
      images: JSON.stringify(['/images/tranh-vinh-hoa-phu-quy.jpg', '/images/qua-tang-dong.jpg']),
      isFeatured: true,
      categorySlug: 'qua-tang-dong',
    },
  ];

  for (const prod of products) {
    const cat = await prisma.category.findUnique({ where: { slug: prod.categorySlug } });
    if (cat) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          name: prod.name,
          price: prod.price,
          originalPrice: prod.originalPrice,
          material: prod.material,
          dimensions: prod.dimensions,
          weight: prod.weight,
          shortDescription: prod.shortDescription,
          description: prod.description,
          images: prod.images,
          isFeatured: prod.isFeatured,
          categoryId: cat.id,
        },
        create: {
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          originalPrice: prod.originalPrice,
          material: prod.material,
          dimensions: prod.dimensions,
          weight: prod.weight,
          shortDescription: prod.shortDescription,
          description: prod.description,
          images: prod.images,
          isFeatured: prod.isFeatured,
          categoryId: cat.id,
        },
      });
    }
  }

  // 3. Settings from dodonglocnam.com
  const settings = [
    { key: 'SITE_NAME', value: 'Đồ Đồng Lộc Nam', group: 'GENERAL', description: 'Tên thương hiệu' },
    { key: 'COMPANY_NAME', value: 'Công Ty TNHH Cơ Khí Đúc Lộc Nam', group: 'GENERAL', description: 'Tên pháp lý công ty' },
    { key: 'TAX_ID', value: '0600663640', group: 'GENERAL', description: 'Mã số thuế' },
    { key: 'ARTISAN_NAME', value: 'Nghệ nhân Dương Bá Tiến', group: 'GENERAL', description: 'Nghệ nhân chủ chốt' },
    { key: 'HOTLINE', value: '0836.1.22222', group: 'CONTACT', description: 'Hotline bán hàng & tư vấn' },
    { key: 'HOTLINE_2', value: '0836.122.222', group: 'CONTACT', description: 'Hotline xưởng' },
    { key: 'ZALO_PHONE', value: '0836122222', group: 'CONTACT', description: 'Số Zalo tư vấn' },
    { key: 'EMAIL', value: 'dodonglocnam1102@gmail.com', group: 'CONTACT', description: 'Email chính thức' },
    { key: 'ADDRESS_FACTORY', value: 'Xưởng Đúc Đồng Lộc Nam, Làng nghề Vạn Điểm, Thị trấn Lâm, Ý Yên, Nam Định', group: 'CONTACT', description: 'Địa chỉ xưởng sản xuất' },
    { key: 'ADDRESS_SHOWROOM_HN', value: '164A4 Đường Nguyễn Cảnh Dị, Phường Định Công, Hà Nội', group: 'CONTACT', description: 'Showroom Hà Nội' },
    { key: 'ADDRESS_SHOWROOM_ND', value: 'Đường 57A, Thị trấn Lâm, Ý Yên, Nam Định & Đường Trần Hưng Đạo', group: 'CONTACT', description: 'Showroom Nam Định' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }

  console.log('Successfully seeded database with local image assets!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });