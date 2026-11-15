import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      governorate,
      address,
      notes,
      paymentMethod,
      paymentReference,
      items,
    } = body;

    if (!customerName || !customerPhone || !governorate || !address || !items?.length) {
      return NextResponse.json(
        { error: "يرجى استكمال جميع بيانات التوصيل والمنتجات" },
        { status: 400 }
      );
    }

    const settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    const isCairoOrGiza = governorate === "القاهرة" || governorate === "الجيزة";
    const shippingCost = isCairoOrGiza
      ? settings?.shippingCairo ?? 60
      : settings?.shippingOther ?? 85;

    let subtotal = 0;
    const verifiedItems: {
      productId: string | null;
      nameAr: string;
      price: number;
      quantity: number;
      size: string;
      color: string;
      image: string;
    }[] = [];

    for (const item of items) {
      const dbProd = item.productId
        ? await prisma.product.findUnique({ where: { id: item.productId } })
        : null;
      const unitPrice = dbProd ? dbProd.price : Number(item.price);
      const qty = Math.max(1, Number(item.quantity) || 1);
      subtotal += unitPrice * qty;
      verifiedItems.push({
        productId: dbProd ? dbProd.id : null,
        nameAr: dbProd ? dbProd.nameAr : item.nameAr,
        price: unitPrice,
        quantity: qty,
        size: item.size || "One Size",
        color: item.color || "-",
        image: item.image || "",
      });
    }

    const total = subtotal + shippingCost;
    const orderNumber = `HE-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        governorate,
        address,
        notes: notes || null,
        paymentMethod: paymentMethod || "COD",
        paymentReference: paymentReference || null,
        subtotal,
        shippingCost,
        total,
        status: "PENDING",
        items: {
          create: verifiedItems,
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
