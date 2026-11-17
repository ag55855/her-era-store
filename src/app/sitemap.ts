import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL =
  "https://her-era-store-production.up.railway.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.category.findMany({
      select: {
        slug: true,
        createdAt: true,
      },
    }),
  ]);

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...products.map((product) => ({
      url: ${BASE_URL}/products/${product.slug},
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
