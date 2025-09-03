// src/app/api/user/expenses/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {dbConnect} from "@/app/lib/db";
import Transaction from "@/app/models/Transaction";
import { verifyToken } from "@/app/lib/jwt";

export const runtime = "nodejs";
//0=Yemek,1=Fatura,2=Ulaşım,3=Eğlence,4=Gelir
const categoryMap: Record<number, string> = {
  0: "Maaş",
  1: "Fatura",
  2: "Ulaşım",
  3: "Eğlence",
  4: "Gelir",
};

export async function GET() {
  await dbConnect();

  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Token eksik." }, { status: 401 });

  let userId: string;
  try {
    const decoded = verifyToken<{ userId: string }>(token);
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ error: "Token geçersiz." }, { status: 401 });
  }

  const txns = await Transaction.find({ userId });

  const expenses: Record<string, number> = {};
  const incomes: Record<string, number> = {};
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of txns) {
    const cat = categoryMap[t.categoryType] || "Diğer";
    if (t.income) {
      incomes[cat] = (incomes[cat] || 0) + t.amount;
      totalIncome += t.amount;
    } else {
      expenses[cat] = (expenses[cat] || 0) + t.amount;
      totalExpense += t.amount;
    }
  }

  const result = {
    expenses: Object.entries(expenses).map(([category, amount]) => ({ category, amount })),
    incomes: Object.entries(incomes).map(([category, amount]) => ({ category, amount })),
    total: [
      { category: "Gelir", amount: totalIncome },
      { category: "Gider", amount: totalExpense },
    ],
  };

  return NextResponse.json(result);
}

