const test = require('node:test');
const assert = require('node:assert/strict');
const { NextRequest } = require('next/server');
const { fixture } = require('./source-fixture.cjs');

const category = { id: 'cat1', slug: 'tuong-dong', name: 'Tượng đồng' };
function products(n = 122) {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `Sản phẩm ${i}`, slug: `san-pham-${i}`,
    createdAt: new Date(Date.UTC(2026, 0, i + 1)), price: i * 1000, inStock: true,
    isFeatured: false, images: '["/images/first.png","/images/second.png"]', description: 'Full editor content',
    categoryId: 'cat1', category, tags: '', material: 'Đồng' }));
}
function productFixture(rows) {
  const calls = [];
  const f = fixture();
  f.db.product.findMany = async query => {
    calls.push(query);
    return query.where?.id ? rows.filter(p => query.where.id.in.includes(p.id)).reverse().slice(0, query.take) : rows;
  };
  f.db.$queryRaw = async (_sql, limit, requestedPage) => {
    const sorted = [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const page = Math.min(Math.max(1, Math.ceil(rows.length / limit)), requestedPage);
    return [{ total: rows.length, products: sorted.slice((page - 1) * limit, page * limit) }];
  };
  return { ...f, calls };
}

test('Product paging sends at most 40 thumbnails, keeps exact ordering and reports all 122 matches', async () => {
  const f = productFixture(products());
  const response = await f.load('app/api/admin/products/route.ts').GET(new NextRequest('http://localhost/api/admin/products?paged=1&page=2&limit=40&sort=price-asc'));
  assert.equal(response.status, 200); const data = await response.json();
  assert.equal(data.products.length, 40); assert.equal(data.pagination.total, 122);
  assert.equal(data.pagination.totalPages, 4); assert.equal(data.products[0].id, 'p40');
  assert.equal(data.products.at(-1).id, 'p79');
  assert.deepEqual(JSON.parse(data.products[0].images), ['/images/first.png']);
  assert.equal(f.calls[0].select.images, undefined);
  assert.equal(f.calls[0].select.description, undefined);
  assert.equal(f.calls[1].take, 40); assert.equal(f.calls[1].where.id.in.length, 40);
  assert.match(response.headers.get('server-timing'), /auth;dur=.*data;dur=.*total;dur=/);
  assert.match(response.headers.get('cache-control'), /private/);
});

test('Initial product view obtains count/page/category with one bounded query and no search-index load', async () => {
  let calls = 0;
  const f = fixture({ $queryRaw: async (sql, limit, requestedPage) => {
    calls++; assert.equal(limit, 40); assert.equal(requestedPage, 1);
    assert.match(sql.join(''), /LIMIT/); assert.match(sql.join(''), /COUNT/);
    return [{ total: 622, products: products(40) }];
  }, product: { findMany: async () => { throw Error('Must not load the full index on first view'); } } });
  const data = await f.load('lib/admin-product-list.ts').pagedAdminProducts(new URLSearchParams());
  assert.equal(calls, 1); assert.equal(data.products.length, 40); assert.equal(data.pagination.total, 622);
});

test('Search finds an accented product beyond the first page and multi-category membership is preserved', async () => {
  const rows = products(); rows[100].name = 'Tượng Bác Hồ'; rows[100].categoryIds = '["cat1","cat2"]';
  const f = productFixture(rows);
  const data = await f.load('lib/admin-product-list.ts').pagedAdminProducts(new URLSearchParams({ search: 'tuong bac ho', categoryId: 'cat2', page: '1' }));
  assert.equal(data.pagination.total, 1); assert.equal(data.products[0].id, 'p100');
  const outOfStock = await f.load('lib/admin-product-list.ts').pagedAdminProducts(new URLSearchParams({ stock: 'OUT_OF_STOCK' }));
  assert.equal(outOfStock.products.length, 0); assert.equal(f.calls.at(-1).where, undefined, 'No detail query for empty matches');
});

test('Invalid/oversized page inputs are bounded; last-page deletion still returns a valid page', async () => {
  const f = productFixture(products(41));
  const data = await f.load('lib/admin-product-list.ts').pagedAdminProducts(new URLSearchParams({ page: '999999', limit: '40' }));
  assert.equal(data.pagination.page, 2); assert.equal(data.products.length, 1);
  const limited = await f.load('lib/admin-product-list.ts').pagedAdminProducts(new URLSearchParams({ page: '-5', limit: '999999' }));
  assert.equal(limited.pagination.page, 1); assert.equal(limited.pagination.limit, 100);
});

test('Parent filters include child memberships in a secondary category with no primary products', async () => {
  const rows = products(1); rows[0].categoryIds = '["cat1","cat2"]'; rows[0].subCategoryIds = '["child-secondary"]';
  const f = productFixture(rows);
  f.db.category.findMany = async () => [category, { id: 'cat2', slug: 'secondary', name: 'Nhóm phụ' }];
  f.db.setting.findUnique = async () => ({ value: JSON.stringify([{ slug: 'secondary', name: 'Nhóm phụ', subCategories: [
    { id: 'parent-secondary', name: 'Danh mục cha', keyword: '', image: '/images/logo.png', children: [
      { id: 'child-secondary', name: 'Danh mục con', keyword: '', image: '/images/logo.png' } ] } ] }]) });
  const data = await f.load('lib/admin-product-list.ts').pagedAdminProducts(new URLSearchParams({ categoryId: 'cat2', subCategoryId: 'parent-secondary' }));
  assert.equal(data.products.length, 1); assert.equal(data.products[0].id, 'p0');
});

test('Article paging includes category options from later pages and never exposes drafts anonymously', async () => {
  const rows = Array.from({ length: 85 }, (_, i) => ({ id: `a${i}`, title: `Bài ${i}`, slug: `bai-${i}`,
    summary: 'Tóm tắt', category: i === 84 ? 'Chuyên mục ở trang cuối' : 'Kiến thức', isPublished: i !== 83,
    publishedAt: new Date(), content: 'Private full content' }));
  const f = fixture(); const calls = [];
  f.db.article.findMany = async query => {
    calls.push(query);
    return query.where?.id ? rows.filter(a => query.where.id.in.includes(a.id) && (!query.where.isPublished || a.isPublished)).reverse() : rows;
  };
  const route = f.load('lib/admin-article-list.ts');
  const data = await route.pagedAdminArticles(new URLSearchParams({ page: '2' }), true);
  assert.equal(data.articles.length, 40); assert.equal(data.articles[0].id, 'a40');
  assert.ok(data.categories.includes('Chuyên mục ở trang cuối'));
  assert.equal(calls[0].select.content, undefined); assert.equal(calls[1].select.content, undefined);
  const publicData = await route.pagedAdminArticles(new URLSearchParams({ search: 'Bài 83' }), false);
  assert.equal(publicData.articles.length, 0); assert.equal(publicData.totalArticles, 84);
});

test('Concurrent session reads perform one lookup; writes check fresh permissions even during read TTL', async () => {
  let calls = 0; let active = true;
  const f = fixture({ user: { findUnique: async () => {
    calls++; await new Promise(resolve => setTimeout(resolve, 10));
    return { id: 'test-user', email: 'test@example.com', name: 'Test', role: 'ADMIN', permissions: null, isActive: active };
  } } }, { realAuth: true });
  const auth = f.load('lib/admin-auth.ts');
  const token = auth.signAdminToken({ userId: 'test-user', email: 'test@example.com', name: 'Test', role: 'ADMIN' });
  const req = method => new NextRequest('http://localhost/api/admin/products', { method, headers: { cookie: `admin_token=${token}` } });
  const sessions = await Promise.all([auth.getAdminSession(req('GET')), auth.getAdminSession(req('GET')), auth.getAdminSession(req('GET'))]);
  assert.equal(calls, 1); assert.ok(sessions.every(Boolean));
  await auth.getAdminSession(req('GET')); assert.equal(calls, 1);
  active = false;
  assert.equal(await auth.getAdminSession(req('PUT')), null); assert.equal(calls, 2);
});

test('Account invalidation applies immediately and DB failures return service error, never stale permissions', async () => {
  let role = 'ADMIN', offline = false;
  const f = fixture({ user: { findUnique: async () => {
    if (offline) throw Error('Offline');
    return { id: 'test-user', email: 'test@example.com', name: 'Test', role, permissions: '[]', isActive: true };
  } } }, { realAuth: true });
  const auth = f.load('lib/admin-auth.ts');
  const token = auth.signAdminToken({ userId: 'test-user', email: 'test@example.com', name: 'Test', role: 'ADMIN' });
  const req = () => new NextRequest('http://localhost/api/admin/auth/me', { headers: { cookie: `admin_token=${token}` } });
  assert.equal((await auth.getAdminSession(req())).role, 'ADMIN');
  role = 'STAFF'; auth.invalidateAdminSession('test-user');
  assert.equal((await auth.getAdminSession(req())).role, 'STAFF');
  offline = true; auth.invalidateAdminSession('test-user');
  assert.equal((await f.load('app/api/admin/auth/me/route.ts').GET(req())).status, 503);
});

test('Pool defaults preserve configured hosts/ports/options and never change non-Supabase connections', () => {
  const { databaseUrl } = fixture().load('lib/database-url.ts');
  const input = 'postgresql://test:example@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres';
  const url = new URL(databaseUrl(input));
  assert.equal(url.port, '5432'); assert.equal(url.searchParams.get('connection_limit'), '4');
  assert.equal(new URL(databaseUrl(input + '?connection_limit=1')).searchParams.get('connection_limit'), '1');
  assert.equal(new URL(databaseUrl(input.replace('5432', '6543'))).searchParams.get('pgbouncer'), 'true');
  assert.equal(databaseUrl('postgresql://test:example@localhost:5432/db'), 'postgresql://test:example@localhost:5432/db');
});

test('Thumbnail optimization preserves the original signed URL and leaves edit previews/SVG unchanged', () => {
  const { adminPreviewUrl } = fixture().load('components/admin/AdminImage.tsx');
  const original = '/images/detail.jpg?signature=a&version=2';
  const preview = new URL(adminPreviewUrl(original, 128), 'http://localhost');
  assert.equal(preview.searchParams.get('url'), original); assert.equal(preview.searchParams.get('w'), '128');
  assert.equal(adminPreviewUrl(original), original);
  assert.equal(adminPreviewUrl('/images/logo.svg', 128), '/images/logo.svg');
});

test('Quick stock/featured PATCH updates only flags and avoids returning editor content or image galleries', async () => {
  const f = fixture(); let query;
  f.db.product.update = async args => { query = args; return { id: 'p1', name: 'Test', inStock: false, isFeatured: true }; };
  const response = await f.load('app/api/admin/products/route.ts').PATCH(new NextRequest('http://localhost/api/admin/products', {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 'p1', inStock: false, isFeatured: true }) }));
  assert.equal(response.status, 200); assert.deepEqual(query.data, { inStock: false, isFeatured: true });
  assert.equal(query.select.description, undefined); assert.equal(query.select.images, undefined); assert.equal(query.include, undefined);
  assert.ok(f.invalidations.includes('products'));
  const data = await response.json(); assert.equal(Object.keys(data.product).length, 4);
});

test('A write never borrows a concurrent read that started before permissions changed', async () => {
  let resolveOldRead, calls = 0;
  const record = role => ({ id: 'test-user', email: 'test@example.com', name: 'Test', role, permissions: '[]', isActive: true });
  const f = fixture({ user: { findUnique: () => {
    calls++;
    return calls === 1 ? new Promise(resolve => { resolveOldRead = resolve; }) : Promise.resolve(record('STAFF'));
  } } }, { realAuth: true });
  const auth = f.load('lib/admin-auth.ts');
  const token = auth.signAdminToken({ userId: 'test-user', email: 'test@example.com', name: 'Test', role: 'ADMIN' });
  const req = method => new NextRequest('http://localhost/api/admin/products', { method, headers: { cookie: `admin_token=${token}` } });
  const oldRead = auth.getAdminSession(req('GET'));
  assert.equal((await auth.getAdminSession(req('PATCH'))).role, 'STAFF');
  resolveOldRead(record('ADMIN')); await oldRead;
  assert.equal(calls, 2); assert.equal((await auth.getAdminSession(req('GET'))).role, 'STAFF');
});
