import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { nameAr, nameEn, descriptionAr } = await req.json();
    if (!nameAr) {
      return NextResponse.json({ error: "اسم الفئة مطلوب" }, { status: 400 });
    }
    const slug = (nameEn || nameAr)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `cat-${Date.now().toString(36)}`;

    const count = await prisma.category.count();
    const category = await prisma.category.create({
      data: {
        slug,
        nameAr,
        nameEn: nameEn || nameAr,
        descriptionAr: descriptionAr || null,
        sortOrder: count + 1,
      },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
