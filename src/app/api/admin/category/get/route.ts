import { NextResponse } from "next/server";
import Category from "@/app/models/Category";
import { dbConnect } from "@/app/lib/db";

export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find().sort({ priority: -1 });
    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json({ error: "Kategori alınamadı" }, { status: 500 });
  }
}
