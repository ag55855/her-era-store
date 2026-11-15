import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q")?.trim();
    const sort = searchParams.get("sort") || "newest";
    const includeOutOfStock = searchParams.get("all") === "true";

    const where: Record<string, unknown> = {};
    if (!includeOutOfStock) {
      where.inStock = true;
    }
    if (category && category !== "all") {
      where.category = { slug: category };
    }
    if (q) {
      where.OR = [
        { nameAr: { contains: q, mode: "insensitive" } },
        { nameEn: { contains: q, mode: "insensitive" } },
        { descriptionAr: { contains: q, mode: "insensitive" } },
        { collectionName: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
        ? { price: "desc" as const }
        : [{ featured: "desc" as const }, { createdAt: "desc" as const }];

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      price,
      compareAtPrice,
      categoryId,
      sizes,
      colors,
      images,
      badgeAr,
      collectionName,
      featured,
      inStock,
    } = body;

    if (!nameAr || !price || !categoryId || !images?.length) {
      return NextResponse.json(
        { error: "الاسم والسعر والفئة وصورة واحدة على الأقل مطلوبين" },
        { status: 400 }
      );
    }

    const baseSlug = (nameEn || nameAr)
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug || "product"}-${Date.now().toString(36)}`;

    const product = await prisma.product.create({
      data: {
        slug,
        nameAr,
        nameEn: nameEn || nameAr,
        descriptionAr: descriptionAr || nameAr,
        descriptionEn: descriptionEn || nameEn || nameAr,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        categoryId,
        sizes: sizes?.length ? sizes : ["S", "M", "L", "XL"],
        colors: colors?.length ? colors : [],
        images,
        badgeAr: badgeAr || null,
        collectionName: collectionName || "دفعة جديدة",
        featured: Boolean(featured),
        inStock: inStock !== false,
      },
      include: { category: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
