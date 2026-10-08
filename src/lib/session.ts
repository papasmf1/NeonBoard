import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { sql } from "@/lib/db";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7일

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error("SESSION_SECRET 환경 변수가 설정되지 않았습니다.");
const key = new TextEncoder().encode(secret);

export async function createSession(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key);

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}

/** 현재 로그인한 사용자 (없으면 null). 요청 단위로 캐시됩니다. */
export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  let userId: number;
  try {
    const { payload } = await jwtVerify<{ userId: number }>(token, key, {
      algorithms: ["HS256"],
    });
    userId = payload.userId;
  } catch {
    return null; // 위조·만료된 토큰
  }
  const [user] = (await sql`
    SELECT id, email, name FROM users WHERE id = ${userId}
  `) as { id: number; email: string; name: string }[];
  return user ?? null;
});

/** 로그인이 필요한 곳에서 사용. 미로그인 시 로그인 페이지로 이동합니다. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
