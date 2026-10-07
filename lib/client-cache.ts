"use client";

/**
 * Client-Side Shared Cache Engine - Powered by jaydev
 * Dedupes concurrent requests and caches settings & catalog in memory.
 * Makes component mounts and page navigation instant (0ms delay).
 */

let settingsCache: Record<string, string> | null = null;
let settingsPromise: Promise<Record<string, string>> | null = null;

export function getClientSettings(): Promise<Record<string, string>> {
  if (settingsCache) {
    return Promise.resolve(settingsCache);
  }
  if (!settingsPromise) {
    settingsPromise = fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings) {
          settingsCache = data.settings;
          return data.settings;
        }
        return {};
      })
      .catch((err) => {
        console.error("Error fetching client settings:", err);
        return {};
      })
      .finally(() => {
        settingsPromise = null;
      });
  }
  return settingsPromise;
}

let catalogCache: any[] | null = null;
let catalogPromise: Promise<any[]> | null = null;

export function getClientCatalog(): Promise<any[]> {
  if (catalogCache) {
    return Promise.resolve(catalogCache);
  }
  if (!catalogPromise) {
    catalogPromise = fetch("/api/subcategories")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          catalogCache = data.data;
          return data.data;
        }
        return [];
      })
      .catch((err) => {
        console.error("Error fetching client catalog:", err);
        return [];
      })
      .finally(() => {
        catalogPromise = null;
      });
  }
  return catalogPromise;
}

export function invalidateClientCache() {
  settingsCache = null;
  catalogCache = null;
}
