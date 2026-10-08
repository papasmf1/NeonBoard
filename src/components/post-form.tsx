"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createPost } from "@/app/actions/posts";
import { FieldError } from "@/components/field-error";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PostForm() {
  const [state, action, pending] = useActionState(createPost, undefined);
  const errors = state?.fieldErrors;

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* 실패 후 반환된 입력값으로 필드를 다시 초기화하기 위해 key로 리마운트 */}
      <div key={JSON.stringify(state?.values)} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            name="title"
            defaultValue={state?.values?.title}
            maxLength={100}
            required
            aria-invalid={!!errors?.title}
          />
          <FieldError messages={errors?.title} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="content">내용</Label>
          <Textarea
            id="content"
            name="content"
            rows={12}
            defaultValue={state?.values?.content}
            required
            aria-invalid={!!errors?.content}
          />
          <FieldError messages={errors?.content} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Link href="/posts" className={buttonVariants({ variant: "outline" })}>
          취소
        </Link>
        <Button type="submit" disabled={pending}>
          {pending ? "등록 중..." : "등록"}
        </Button>
      </div>
    </form>
  );
}
