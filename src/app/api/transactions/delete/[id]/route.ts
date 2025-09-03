// src/app/api/transactions/delete/[id]/route.ts
import { cookies } from "next/headers";
import { dbConnect } from "@/app/lib/db";
import Transaction from "@/app/models/Transaction";
import { verifyToken } from "@/app/lib/jwt";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  await dbConnect();

  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

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

  const id = context.params.id;

  try {
    const deleted = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return NextResponse.json({ error: "İşlem bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: deleted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Silme işlemi başarısız." }, { status: 500 });
  }
}
