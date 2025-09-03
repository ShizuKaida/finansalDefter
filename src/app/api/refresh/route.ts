import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, generateAccessToken } from "@/app/lib/jwt";

export async function GET() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Refresh token yok" }, { status: 401 });
  }

  try {
    const decoded = verifyToken<{ userId: string }>(refreshToken);

    const newAccessToken = generateAccessToken({ userId: decoded.userId });

    const response = NextResponse.json({ ok: true });

    response.cookies.set("token", newAccessToken, {
      httpOnly: false,
      maxAge: 60 * 15,
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Refresh token geçersiz" }, { status: 401 });
  }
}
