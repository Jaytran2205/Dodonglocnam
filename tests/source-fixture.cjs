const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), ts = require("typescript");
function fixture(overrides = {}, options = {}) {
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
  if (options.realAuth) delete mocks['@/lib/admin-auth'];
  Object.assign(mocks, options.mocks || {});
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

module.exports = { fixture };
