"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sql, type User } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /** 실패 시 입력값 유지용 (비밀번호 제외) */
  values?: Record<string, string>;
} | undefined;

function keepValues(formData: FormData, ...names: string[]) {
  return Object.fromEntries(names.map((n) => [n, String(formData.get(n) ?? "")]));
}

const signupSchema = z.object({
  name: z.string().trim().min(2, "이름은 2자 이상이어야 합니다.").max(30),
  email: z.email("올바른 이메일을 입력하세요.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .regex(/[a-zA-Z]/, "영문자를 1개 이상 포함하세요.")
    .regex(/[0-9]/, "숫자를 1개 이상 포함하세요."),
});

const loginSchema = z.object({
  email: z.email("올바른 이메일을 입력하세요.").trim().toLowerCase(),
  password: z.string().min(1, "비밀번호를 입력하세요."),
});

export async function signup(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: keepValues(formData, "name", "email"),
    };
  }
  const { name, email, password } = parsed.data;

  const exists = await sql`SELECT 1 FROM users WHERE email = ${email}`;
  if (exists.length > 0) {
    return {
      fieldErrors: { email: ["이미 가입된 이메일입니다."] },
      values: keepValues(formData, "name", "email"),
    };
  }

  const hash = await bcrypt.hash(password, 10);
  // 동시 가입 시 UNIQUE 제약으로 실패하면 0행 반환
  const [created] = (await sql`
    INSERT INTO users (email, name, password_hash) VALUES (${email}, ${name}, ${hash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `) as { id: number }[];
  if (!created) {
    return {
      fieldErrors: { email: ["이미 가입된 이메일입니다."] },
      values: keepValues(formData, "name", "email"),
    };
  }

  await createSession(created.id);
  redirect("/posts");
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: keepValues(formData, "email"),
    };
  }
  const { email, password } = parsed.data;

  const [user] = (await sql`SELECT * FROM users WHERE email = ${email}`) as User[];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return {
      error: "이메일 또는 비밀번호가 올바르지 않습니다.",
      values: keepValues(formData, "email"),
    };
  }

  await createSession(user.id);
  redirect("/posts");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
