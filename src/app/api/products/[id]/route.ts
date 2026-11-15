import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.nameAr !== undefined) data.nameAr = body.nameAr;
    if (body.nameEn !== undefined) data.nameEn = body.nameEn;
    if (body.descriptionAr !== undefined) data.descriptionAr = body.descriptionAr;
    if (body.descriptionEn !== undefined) data.descriptionEn = body.descriptionEn;
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.compareAtPrice !== undefined) {
      data.compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : null;
    }
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.sizes !== undefined) data.sizes = body.sizes;
    if (body.colors !== undefined) data.colors = body.colors;
    if (body.images !== undefined) data.images = body.images;
    if (body.badgeAr !== undefined) data.badgeAr = body.badgeAr || null;
    if (body.collectionName !== undefined) data.collectionName = body.collectionName || null;
    if (body.inStock !== undefined) data.inStock = Boolean(body.inStock);
    if (body.featured !== undefined) data.featured = Boolean(body.featured);

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
