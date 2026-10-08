import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">자유 게시판</h1>
      <Suspense fallback={<div className="h-24" />}>
        <Welcome />
      </Suspense>
    </section>
  );
}

async function Welcome() {
  const user = await getCurrentUser();

  return (
    <>
      <p className="max-w-md text-muted-foreground">
        {user
          ? `${user.name}님, 환영합니다! 오늘은 어떤 이야기를 남겨볼까요?`
          : "누구나 글을 읽을 수 있고, 회원가입 후 글을 쓸 수 있습니다."}
      </p>
      <div className="flex gap-2">
        <Link href="/posts" className={buttonVariants({ variant: "outline", size: "lg" })}>
          글 목록 보기
        </Link>
        <Link href={user ? "/posts/new" : "/signup"} className={buttonVariants({ size: "lg" })}>
          {user ? "글쓰기" : "회원가입"}
        </Link>
      </div>
    </>
  );
}
