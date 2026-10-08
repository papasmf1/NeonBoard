import { Suspense } from "react";
import { LoadingText } from "@/components/loading-text";
import { PostForm } from "@/components/post-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/session";

export default function NewPostPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">새 글 쓰기</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoadingText />}>
          <AuthorizedPostForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}

/** 로그인한 사용자에게만 폼을 보여주고, 아니면 로그인 페이지로 보냅니다 */
async function AuthorizedPostForm() {
  await requireUser();
  return <PostForm />;
}
