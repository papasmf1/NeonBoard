"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sql } from "@/lib/db";
import { requireUser } from "@/lib/session";
import type { FormState } from "./auth";

const postSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력하세요.").max(100, "제목은 100자 이하입니다."),
  content: z.string().trim().min(1, "내용을 입력하세요.").max(10000),
});

export async function createPost(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: {
        title: String(formData.get("title") ?? ""),
        content: String(formData.get("content") ?? ""),
      },
    };
  }

  const [post] = (await sql`
    INSERT INTO posts (title, content, author_id)
    VALUES (${parsed.data.title}, ${parsed.data.content}, ${user.id})
    RETURNING id
  `) as { id: number }[];

  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}
