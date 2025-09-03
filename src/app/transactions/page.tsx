// src/app/transactions/page.tsx
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
import { dbConnect } from "@/app/lib/db";
import Transaction from "@/app/models/Transaction";
import Category from "@/app/models/Category";
import { notFound } from "next/navigation";
import TransactionItem from "@/app/components/TransactionItem";


export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  await dbConnect();
  

  const token =  (await cookies()).get("token")?.value;
  if (!token) return notFound();

  let userId;
  try {
    const decoded = verifyToken<{ userId: string }>(token);
    userId = decoded.userId;
  } catch (err) {
    return notFound();
  }

  const transactions = await Transaction.find({ userId }).sort({ date: -1 });
  const categories = await Category.find();

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">💸 Hesap Hareketlerin</h2>
      <div className="space-y-4">
        {transactions.map((trx: any) => {
  const cat = categories.find(
    (c: any) => c.type === trx.categoryType && c.income === trx.income
  );

  return (
    <TransactionItem
  key={trx._id}
  trx={{
    _id: trx._id.toString(),
    income: trx.income,
    amount: trx.amount,
    currency: trx.currency,
    categoryType: trx.categoryType,
    note: trx.note,
    date: trx.date.toISOString(),
  }}
  category={
    cat
      ? {
          _id: cat._id.toString(),
          name: cat.name,
          type: cat.type,
          income: cat.income,
          priority: cat.priority,
        }
      : null
  }
/>
  );
})}
        {transactions.length === 0 && (
          <p className="text-gray-500">Henüz herhangi bir işlem eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}
