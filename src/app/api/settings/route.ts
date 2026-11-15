import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: "default" },
      });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const settings = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: {
        instapayHandle: body.instapayHandle,
        vodafoneCashNumber: body.vodafoneCashNumber,
        whatsappNumber: body.whatsappNumber,
        shippingCairo: Number(body.shippingCairo),
        shippingOther: Number(body.shippingOther),
        announcementAr: body.announcementAr,
        announcementEn: body.announcementEn,
      },
      create: {
        id: "default",
        instapayHandle: body.instapayHandle || "herera@instapay",
        vodafoneCashNumber: body.vodafoneCashNumber || "01000000000",
        whatsappNumber: body.whatsappNumber || "201000000000",
        shippingCairo: Number(body.shippingCairo) || 60,
        shippingOther: Number(body.shippingOther) || 85,
        announcementAr: body.announcementAr || "",
        announcementEn: body.announcementEn || "",
      },
    });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
