"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/field-error";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [state, action, pending] = useActionState(isSignup ? signup : login, undefined);
  const errors = state?.fieldErrors;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{isSignup ? "회원가입" : "로그인"}</CardTitle>
        <CardDescription>
          {isSignup ? "계정을 만들고 게시판에 글을 남겨보세요." : "이메일과 비밀번호로 로그인하세요."}
        </CardDescription>
      </CardHeader>
      <form action={action}>
        {/* 실패 후 반환된 입력값으로 필드를 다시 초기화하기 위해 key로 리마운트 */}
        <CardContent key={JSON.stringify(state?.values)} className="flex flex-col gap-4">
          {isSignup && (
            <div className="grid gap-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                defaultValue={state?.values?.name}
                required
                aria-invalid={!!errors?.name}
              />
              <FieldError messages={errors?.name} />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              defaultValue={state?.values?.email}
              autoComplete="email"
              required
              aria-invalid={!!errors?.email}
            />
            <FieldError messages={errors?.email} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              aria-invalid={!!errors?.password}
            />
            <FieldError messages={errors?.password} />
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "처리 중..." : isSignup ? "가입하기" : "로그인"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isSignup ? "이미 계정이 있나요? " : "계정이 없나요? "}
            <Link href={isSignup ? "/login" : "/signup"} className="underline underline-offset-4">
              {isSignup ? "로그인" : "회원가입"}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
