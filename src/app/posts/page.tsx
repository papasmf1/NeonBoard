import Link from "next/link";
import { Suspense } from "react";
import { LoadingText } from "@/components/loading-text";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sql, type PostRow } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";

export default function PostsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">글 목록</h1>
        <Suspense>
          <WriteButton />
        </Suspense>
      </div>
      <Suspense fallback={<LoadingText />}>
        <PostList />
      </Suspense>
    </div>
  );
}

async function WriteButton() {
  const user = await getCurrentUser();
  return (
    <Link href={user ? "/posts/new" : "/login"} className={buttonVariants()}>
      글쓰기
    </Link>
  );
}

async function PostList() {
  const posts = (await sql`
    SELECT p.id, p.title, p.created_at, u.name AS author_name
    FROM posts p JOIN users u ON u.id = p.author_id
    ORDER BY p.id DESC
  `) as Omit<PostRow, "content">[];

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          아직 작성된 글이 없습니다. 첫 글을 남겨보세요!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <ul className="divide-y">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50"
            >
              <span className="truncate font-medium">{post.title}</span>
              <span className="shrink-0 text-sm text-muted-foreground">
                {post.author_name} · {formatDate(post.created_at)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
