import CategoryList from "@/components/frontend/CategoryList";
import Hero from "@/components/frontend/Hero";
import Product from "@/components/frontend/Product";
import { getCategoriesWithProducts, getLatestProducts } from "@/lib/storefront";
import Image from "next/image";
import Link from "next/link";
export default async function Home() {
  const [categoriesData, latest] = await Promise.all([
    getCategoriesWithProducts(),
    getLatestProducts(20),
  ]);
  const categories = categoriesData.filter((category) => (category.products?.length ?? 0) > 0);
  return (
    <div className="min-h-screen">
      <Hero />
      {latest.length > 0 && (
        <section className="py-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">New Arrivals</h2>
            <Link
              href="/search"
              className="rounded-md bg-lime-600 px-4 py-2 text-sm text-white hover:bg-lime-700"
            >
              Browse all products
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {latest.map((product) => (
              <Product key={product.id} product={product} inGrid />
            ))}
          </div>
        </section>
      )}

      {categories.map((category, i) => {
        return (
          <div className="py-8" key={i}>
            <CategoryList category={category} />
          </div>
        );
      })}

      
    </div>
  );
}
