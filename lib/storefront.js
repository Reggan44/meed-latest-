import db from "@/lib/db";

// Server components read the database directly instead of calling their own API over HTTP.
async function safe(fn, fallback) {
  try {
    return await fn();
  } catch (error) {
    console.error("storefront query failed:", error?.message);
    return fallback;
  }
}

export function getCategoriesWithProducts() {
  return safe(
    () =>
      db.category.findMany({
        orderBy: { createdAt: "desc" },
        include: { products: { where: { isActive: true } } },
      }),
    []
  );
}

export function getLatestProducts(take = 24) {
  return safe(
    () =>
      db.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take,
      }),
    []
  );
}

export function getBanners() {
  return safe(() => db.banner.findMany({ orderBy: { createdAt: "desc" } }), []);
}
