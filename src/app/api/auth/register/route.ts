import { NextResponse } from "next/server";
import {dbConnect} from "@/app/lib/db";
import User from "@/app/models/Users";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();

  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password required" },
      { status: 400 }
    );
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, name });

  return NextResponse.json({ ok: true }, { status: 201 });
}
