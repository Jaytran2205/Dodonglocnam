// Read-only benchmark: no login, writes, credentials or row contents are printed.
import { createRequire } from "node:module";
import { performance } from "node:perf_hooks";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: [{ level: "query", emit: "event" }] });
let queries = 0;
prisma.$on("query", () => { queries++; });
const orderBy = [{ createdAt: "desc" }, { id: "asc" }];
const rowSelect = { id: true, name: true, slug: true, price: true, originalPrice: true,
  images: true, material: true, dimensions: true, weight: true, shortDescription: true,
  isFeatured: true, inStock: true, categoryId: true, subCategoryId: true,
  categoryIds: true, subCategoryIds: true, tags: true, createdAt: true, updatedAt: true,
  category: { select: { id: true, name: true, slug: true } } };
async function timed(label, operation) {
  queries = 0;
  const started = performance.now();
  const rows = await operation();
  return { label, ms: Math.round(performance.now() - started), queries,
    rows: rows.length, jsonBytes: Buffer.byteLength(JSON.stringify(rows)) };
}
try {
  const start = performance.now();
  await prisma.$queryRaw`SELECT 1`;
  const report = { measuredAt: new Date().toISOString(), coldConnectMs: Math.round(performance.now() - start), runs: [] };
  for (let run = 1; run <= 2; run++) {
    report.runs.push(await timed(`legacy-all-products-${run}`, () => prisma.product.findMany({ relationLoadStrategy: "query", select: rowSelect, orderBy })));
    report.runs.push(await timed(`join-40-products-${run}`, async () => {
      const rows = await prisma.product.findMany({ relationLoadStrategy: "join", select: rowSelect, take: 40, orderBy });
      return rows.map(({ material, dimensions, weight, shortDescription, ...row }) => {
        let images; try { images = JSON.parse(row.images); } catch { images = [row.images]; }
        return { ...row, images: JSON.stringify(Array.isArray(images) ? images.slice(0, 1) : [row.images]) };
      });
    }));
  }
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.log(JSON.stringify({ error: error.code || error.name, success: false }));
  process.exitCode = 1;
} finally { await prisma.$disconnect(); }
