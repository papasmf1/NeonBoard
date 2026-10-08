import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex justify-center py-8">
      <Suspense>
        <RedirectIfLoggedIn />
      </Suspense>
      {children}
    </div>
  );
}

/** 이미 로그인한 사용자는 글 목록으로 보냅니다 */
async function RedirectIfLoggedIn() {
  if (await getCurrentUser()) redirect("/posts");
  return null;
}
