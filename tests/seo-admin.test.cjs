const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest, NextResponse } = require('next/server');

// Execute real route/helper source with an isolated database. No test writes to
// the configured Supabase database or depends on an admin's real credentials.
function fixture(overrides = {}) {
  const db = {
    setting: { findUnique: async () => null, findMany: async () => [], upsert: async data => data },
    category: { findMany: async () => [], findUnique: async () => null, updateMany: async () => ({ count: 1 }) },
    product: { findMany: async () => [], findUnique: async () => null },
    article: { findMany: async () => [], findFirst: async () => null },
    uploadedImage: { findMany: async () => [] },
    $transaction: operations => Promise.all(operations), ...overrides,
  };
  const invalidations = [];
  const session = { role: 'ADMIN', permissions: ['categories', 'products', 'articles', 'landing'] };
  const mocks = {
    '@/lib/prisma': db,
    'react': { ...require('react'), cache: fn => fn },
    'next/cache': { unstable_cache: fn => fn, revalidateTag: tag => invalidations.push(tag), revalidatePath: p => invalidations.push(p) },
    '@/lib/admin-auth': { getAdminSession: async () => session },
    '@/lib/activity-logger': { logActivity: async () => {} },
    'next/navigation': { notFound() { throw Error('NOT_FOUND'); }, redirect(p) { throw Error(`REDIRECT:${p}`); }, permanentRedirect(p) { throw Error(`REDIRECT:${p}`); } },
  };
  const cache = new Map();
  function load(name) {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name.startsWith('@/components/')) {
      if (name === '@/components/seo/JsonLd') return load('components/seo/JsonLd.tsx');
      return new Proxy({ __esModule: true }, { get: (_, key) => key === '__esModule' ? true : () => null });
    }
    let full = path.resolve(name.startsWith('@/') ? name.slice(2) : name);
    if (!fs.existsSync(full)) full = ['.ts', '.tsx', '.json'].map(ext => full + ext).find(p => fs.existsSync(p));
    if (!full || fs.statSync(full).isDirectory()) return require(name);
    if (full.endsWith('.json')) return JSON.parse(fs.readFileSync(full, 'utf8'));
    if (cache.has(full)) return cache.get(full).exports;
    const module = { exports: {} }; cache.set(full, module);
    const code = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const localRequire = id => id.startsWith('.') ? load(path.resolve(path.dirname(full), id)) : id.startsWith('@/') || Object.hasOwn(mocks, id) ? load(id) : require(id);
    vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: full })(localRequire, module, module.exports);
    return module.exports;
  }
  return { load, db, invalidations, session };
}

test('Product schema uses real prices/stock, excludes invented reviews and safely serializes content', () => {
  const { load } = fixture(); const { ProductJsonLd } = load('components/seo/JsonLd.tsx');
  const props = { name: 'Đỉnh đồng </script>', images: ['/images/logo.png'], description: 'Thủ công', categoryName: 'Đồ thờ', url: 'https://www.quatanglocnam.com/san-pham/dinh', inStock: false };
  for (const price of [null, 0, undefined, -1, NaN]) {
    const result = JSON.parse(ProductJsonLd({ ...props, price }).props.dangerouslySetInnerHTML.__html);
    assert.equal(result.offers, undefined); assert.equal(result.aggregateRating, undefined);
  }
  const html = ProductJsonLd({ ...props, price: 1200000 }).props.dangerouslySetInnerHTML.__html;
  assert.ok(!html.includes('</script>'));
  const result = JSON.parse(html); assert.equal(result.offers.price, '1200000');
  assert.equal(result.offers.availability, 'https://schema.org/OutOfStock');
  assert.equal(result.offers.seller.url, 'https://www.quatanglocnam.com');
});

test('Local development origins never leak into SEO and www/HTTPS are consistent for the main domain', () => {
  const { canonicalOrigin } = fixture().load('lib/site.ts');
  for (const origin of ['http://localhost:3000', 'http://127.0.0.1:3045', 'http://[::1]:3000', 'invalid-url', 'http://quatanglocnam.com']) {
    assert.equal(canonicalOrigin(origin), 'https://www.quatanglocnam.com');
  }
  assert.equal(canonicalOrigin('https://example.com/path'), 'https://example.com');
});

test('Saved names/images and newly created categories appear identically in the catalogue', async () => {
  const f = fixture();
  f.db.setting.findUnique = async () => ({ value: JSON.stringify([{ slug: 'tranh-dong', name: 'Tên cũ', subCategories: [{ id: 'tranh-moi', name: 'Tranh mới', keyword: '', image: '/api/images/new/image.png' }] }]) });
  f.db.category.findMany = async () => [{ slug: 'tranh-dong', name: 'Tranh nghệ thuật', description: 'Mô tả mới' }, { slug: 'danh-muc-moi', name: 'Danh mục mới', image: '/images/new.jpg' }];
  const result = await f.load('lib/catalog.ts').loadCatalog();
  assert.equal(result[0].name, 'Tranh nghệ thuật'); assert.equal(result[0].description, 'Mô tả mới');
  assert.equal(result[0].subCategories[0].image, '/api/images/new/image.png');
  assert.ok(result.some(c => c.slug === 'danh-muc-moi'));
});

test('Subcategory and project metadata canonical URLs point at the actual page', async () => {
  const f = fixture();
  const category = f.load('lib/subcategories-data.ts').DEFAULT_HIERARCHICAL_CATEGORIES.find(c => c.slug === 'tranh-dong');
  const sub = category.subCategories[0];
  const meta = await f.load('app/san-pham/[category]/[...slug]/page.tsx').generateMetadata({ params: { category: category.slug, slug: [sub.id] } });
  assert.equal(meta.alternates.canonical, `https://www.quatanglocnam.com/san-pham/tranh-dong/${sub.id}`);
  const gift = await f.load('app/qua-tang/[...slug]/page.tsx').generateMetadata({ params: { slug: ['qua-tang-doanh-nghiep'] } });
  assert.equal(gift.alternates.canonical, 'https://www.quatanglocnam.com/qua-tang/qua-tang-doanh-nghiep');
  assert.equal(f.load('app/du-an/page.tsx').metadata.alternates.canonical, 'https://www.quatanglocnam.com/du-an');
  const project = f.load('data/projects.ts').projectsData[0];
  const projectMeta = await f.load('app/du-an/[slug]/page.tsx').generateMetadata({ params: { slug: project.slug } });
  assert.equal(projectMeta.alternates.canonical, `https://www.quatanglocnam.com/du-an/${project.slug}`);
});

test('Sitemap includes saved taxonomy, flat products, DB articles and projects; excludes drafts/legacy duplicates', async () => {
  const f = fixture(); const stamp = new Date('2026-09-01T12:00:00Z');
  f.db.product.findMany = async () => [{ slug: 'san-pham-thu-nghiem', updatedAt: stamp }];
  f.db.article.findMany = async () => [{ slug: 'bai-moi', isPublished: true, updatedAt: stamp }, { slug: 'ban-nhap', isPublished: false, updatedAt: stamp }];
  const result = await f.load('app/sitemap.ts').default(); const urls = result.map(r => r.url);
  assert.ok(urls.includes('https://www.quatanglocnam.com/qua-tang')); assert.ok(urls.includes('https://www.quatanglocnam.com/du-an'));
  assert.ok(urls.includes('https://www.quatanglocnam.com/tin-tuc/bai-moi'));
  assert.ok(urls.includes('https://www.quatanglocnam.com/san-pham/san-pham-thu-nghiem'));
  assert.ok(!urls.some(url => url.includes('/san-pham/qua-tang-dong') || url.includes('ban-nhap')));
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(result.find(r => r.url.endsWith('/san-pham-thu-nghiem')).lastModified, stamp);
  assert.equal(result.find(r => r.url === 'https://www.quatanglocnam.com/').lastModified, undefined);
});

test('Catalogue mutation keeps stable IDs and persists names, invalidates public caches, rejects duplicate children', async () => {
  const f = fixture(); let saved; const renamed = [];
  f.db.setting.upsert = async args => { saved = JSON.parse(args.update.value); };
  f.db.category.updateMany = async args => { renamed.push(args); return { count: 1 }; };
  const route = f.load('app/api/admin/subcategories/route.ts');
  const catalog = [{ slug: 'tranh-dong', name: 'Tên đã đổi', seoTitle: 'Tiêu đề SEO mới', subCategories: [{ id: 'tranh-moi', name: 'Tranh mới', keyword: '', image: '/images/logo.png' }] }];
  const req = data => new NextRequest('http://localhost/api/admin/subcategories', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
  const response = await route.POST(req({ catalog })); assert.equal(response.status, 200);
  assert.equal(saved[0].subCategories[0].id, 'tranh-moi'); assert.equal(saved[0].seoTitle, 'Tiêu đề SEO mới');
  assert.equal(renamed[0].data.name, 'Tên đã đổi'); assert.ok(f.invalidations.includes('catalog')); assert.ok(f.invalidations.includes('/'));
  catalog[0].subCategories.push({ ...catalog[0].subCategories[0] });
  assert.equal((await route.POST(req({ catalog }))).status, 400);
});

test('Lightweight admin lists exclude editor content; detail endpoints preserve full editing data', async () => {
  const f = fixture(); let productQuery; let articleQuery;
  f.db.product.findMany = async query => { productQuery = query; return []; };
  f.db.product.findUnique = async () => ({ id: 'p1', description: 'Nội dung cần giữ', images: '["/images/logo.png"]' });
  f.db.article.findMany = async query => { articleQuery = query; return []; };
  f.db.article.findFirst = async () => ({ id: 'a1', content: 'Bài viết đầy đủ' });
  const products = f.load('app/api/admin/products/route.ts'); const articles = f.load('app/api/admin/articles/route.ts');
  await products.GET(new NextRequest('http://localhost/api/admin/products?view=list')); assert.equal(productQuery.select.description, undefined);
  const detail = await (await products.GET(new NextRequest('http://localhost/api/admin/products?id=p1'))).json(); assert.equal(detail.product.description, 'Nội dung cần giữ');
  await articles.GET(new NextRequest('http://localhost/api/admin/articles?view=list')); assert.equal(articleQuery.select.content, undefined);
  const article = await (await articles.GET(new NextRequest('http://localhost/api/admin/articles?id=a1'))).json(); assert.equal(article.article.content, 'Bài viết đầy đủ');
});

test('Homepage supports adding/reordering/removing cards and old six-slot settings', () => {
  const { load } = fixture(); const { homeCategories, DEFAULT_HOME_SETTINGS, DEFAULT_HOME_SLIDES } = load('lib/home-content.ts');
  assert.equal(homeCategories({ cat1_title: 'Tên khác', cat1_image: '/api/images/new.png' })[0].image, '/api/images/new.png');
  const cards = [...homeCategories({}), { id: 'added', title: 'Danh mục mới', subtitle: '', image: '/images/logo.png', href: '/san-pham/new' }];
  assert.equal(homeCategories({ home_featured_categories: JSON.stringify(cards) }).length, 7);
  assert.deepEqual(homeCategories({ home_featured_categories: '[]' }), []);
  assert.equal(JSON.parse(DEFAULT_HOME_SETTINGS.home_slider_banners)[0].image, DEFAULT_HOME_SLIDES[0].image);
  for (const [key, value] of Object.entries(DEFAULT_HOME_SETTINGS)) {
    if (key.endsWith('_image') && value.startsWith('/')) assert.ok(fs.existsSync(path.resolve('public', value.slice(1).split('?')[0])), `${key}: ${value}`);
  }
});

test('Image parser preserves signed URLs and data URL commas; supports old and JSON formats', () => {
  const { parseImageList } = fixture().load('lib/utils.ts');
  assert.deepEqual(parseImageList('["/images/a.jpg","/api/images/b/a.png"]'), ['/images/a.jpg', '/api/images/b/a.png']);
  assert.deepEqual(parseImageList('/images/a.jpg, /images/b.png'), ['/images/a.jpg', '/images/b.png']);
  assert.deepEqual(parseImageList('https://example.com/a.jpg?crop=1,2,3'), ['https://example.com/a.jpg?crop=1,2,3']);
  assert.deepEqual(parseImageList('data:image/png;base64,AA=='), ['data:image/png;base64,AA==']);
});

test('Robots allows render assets and uploaded image URLs; admin layout declares noindex', () => {
  const f = fixture(); const robots = f.load('app/robots.ts').default();
  assert.ok(!robots.rules[0].disallow.includes('/_next/')); assert.ok(!robots.rules[0].disallow.includes('/api/'));
  assert.equal(f.load('app/admin/layout.tsx').metadata.robots.index, false);
});

test('Outages do not supply writable admin defaults or publish incomplete sitemap', async () => {
  const f = fixture(); f.db.setting.findUnique = async () => { throw Error('Database offline'); };
  const catalogue = f.load('lib/catalog.ts');
  await assert.rejects(catalogue.loadCatalog(), /Database offline/);
  assert.ok((await catalogue.getCatalog()).length > 0);
  await assert.rejects(f.load('app/sitemap.ts').default(), /Database offline/);
});

test('Media library includes uploaded and embedded content images without loading binary blobs', async () => {
  const f = fixture(); let uploadQuery;
  f.db.uploadedImage.findMany = async query => { uploadQuery = query; return [{ id: 'img1', filename: 'anh-test.png' }]; };
  f.db.product.findMany = async () => [{ name: 'Ảnh kiểm thử riêng', images: '["/api/images/img1/anh-test.png"]', description: '<img src="https://example.com/detail.png?sig=a&amp;size=2" />' }];
  f.db.article.findMany = async () => [{ title: 'Ảnh kiểm thử riêng', content: '![Chi tiết](https://example.com/article.webp)', thumbnail: '/images/logo.png' }];
  const response = await f.load('app/api/admin/images/route.ts').GET(new NextRequest('http://localhost/api/admin/images?q=' + encodeURIComponent('Ảnh kiểm thử riêng')));
  assert.equal(response.status, 200); const data = await response.json();
  assert.ok(data.images.some(img => img.url === '/api/images/img1/anh-test.png'));
  assert.ok(data.images.some(img => img.url === 'https://example.com/detail.png?sig=a&size=2'));
  assert.ok(data.images.some(img => img.url === 'https://example.com/article.webp'));
  assert.equal(uploadQuery.select.data, undefined); assert.ok(data.images.length <= 48);
});

test('Editor permissions still protect products/media and category editors can reach image upload validation', async () => {
  const f = fixture(); f.session.role = 'EDITOR'; f.session.permissions = ['categories'];
  assert.equal((await f.load('app/api/admin/products/route.ts').GET(new NextRequest('http://localhost/api/admin/products?view=list'))).status, 403);
  const request = new NextRequest('http://localhost/api/admin/upload', { method: 'POST', body: new FormData() });
  assert.equal((await f.load('app/api/admin/upload/route.ts').POST(request)).status, 400, 'Missing file, rather than permission denial');
  f.session.permissions = [];
  assert.equal((await f.load('app/api/admin/images/route.ts').GET(new NextRequest('http://localhost/api/admin/images'))).status, 403);
});
