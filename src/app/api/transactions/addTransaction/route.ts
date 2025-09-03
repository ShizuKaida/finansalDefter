// src/app/api/transactions/add/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import Transaction from "@/app/models/Transaction";
import { verifyToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";
import Category from "@/app/models/Category";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await dbConnect();

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Token eksik." }, { status: 401 });
  }

  let userId;
  try {
    const decoded = verifyToken<{ userId: string }>(token);
    userId = decoded.userId;
  } catch (err) {
    return NextResponse.json({ error: "Token geçersiz." }, { status: 401 });
  }

  const body = await req.json();
  const { categoryId, amount, note, date } = body;

  console.log(body)

  if (!categoryId || typeof amount !== "number" || !date) {
    return NextResponse.json({ error: "Eksik veya hatalı veri." }, { status: 400 });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
    }
    
    const newTransaction = await Transaction.create({
      userId,
      income: category.income,               
      amount,
      currency: "TRY",                         
      categoryType: category.type,            
      note: note || "",
      tags: [],
      date: new Date(date),
    });

    return NextResponse.json({ ok: true, data: newTransaction }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Kayıt başarısız." }, { status: 500 });
  }
}
