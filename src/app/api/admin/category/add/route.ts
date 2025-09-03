import { NextResponse } from "next/server";
import {dbConnect}  from "@/app/lib/db";
import Category from "@/app/models/Category";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, type, income, priority } = body;

    if (!name || typeof income !== "boolean" || typeof type !== "number") {
      return NextResponse.json(
        { error: "Eksik veya geçersiz alanlar" },
        { status: 400 }
      );
    }

    const newCategory = await Category.create({
      name,
      type,
      income,
      priority: priority || 0,
    });

    return NextResponse.json({ message: "Kategori eklendi", category: newCategory });
  } catch (error: any) {
    console.error("Kategori eklenirken hata:", error.message);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
