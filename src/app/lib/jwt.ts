import jwt, { SignOptions } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) throw new Error("JWT_SECRET missing");

export async function signToken(
  payload: string | object,
  expiresIn: jwt.SignOptions["expiresIn"] = "7d"
): Promise<string> {
  const options: SignOptions = { expiresIn };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, options, (err, token) => {
      if (err || !token) {
        return reject(err || new Error("Token oluşturulamadı"));
      }
      resolve(token);
    });
  });
}

export function verifyToken<T = any>(token: string) {
  return jwt.verify(token, SECRET) as T;
}

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, SECRET!, { expiresIn: "45m" });
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, SECRET!, { expiresIn: "7d" });
}
