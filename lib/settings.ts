import { cache } from "react";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { DEFAULT_HOME_SETTINGS } from "@/lib/home-content";

export async function loadSettings(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany({ select: { key: true, value: true } });
  return { ...DEFAULT_HOME_SETTINGS, ...Object.fromEntries(rows.map(row => [row.key, row.value])) };
}

const getCachedSettings = unstable_cache(loadSettings, ["website-settings-v2"], {
  revalidate: 300, tags: ["settings"],
});

export const getSettings = cache(async () => {
  try { return await getCachedSettings(); }
  catch {
    console.warn("Settings unavailable; using bundled storefront defaults.");
    return DEFAULT_HOME_SETTINGS;
  }
});
