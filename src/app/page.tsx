import { prisma } from "@/lib/prisma";
import { StorefrontClient } from "@/components/StorefrontClient";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { inStock: true },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <StorefrontClient
      categories={categories as unknown as CategoryDTO[]}
      products={products as unknown as ProductDTO[]}
    />
  );
}
