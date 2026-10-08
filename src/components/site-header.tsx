import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            게시판
          </Link>
          <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground">
            글 목록
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.name}님
              </span>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                로그인
              </Link>
              <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
