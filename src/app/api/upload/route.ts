import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");

    try {
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, safeName), buffer);
      return NextResponse.json({ url: `/uploads/${safeName}` });
    } catch {
      // Fallback to base64 data URI if filesystem is ephemeral/read-only
      const base64 = buffer.toString("base64");
      const mime = file.type || "image/jpeg";
      return NextResponse.json({ url: `data:${mime};base64,${base64}` });
    }
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
