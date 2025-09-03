import { NextResponse } from "next/server";
import {dbConnect} from "@/app/lib/db";
import User from "@/app/models/Users";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/app/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await dbConnect();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-posta ve şifre gereklidir." },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  const response = NextResponse.json({ ok: true });

  response.cookies.set("token", accessToken, {
    httpOnly: false,
    maxAge: 60 * 15, // 15 dakika
    path: "/",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    path: "/",
  });

  return response;
}
