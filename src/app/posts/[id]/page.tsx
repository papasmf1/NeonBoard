import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LoadingText } from "@/components/loading-text";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sql, type PostRow } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default function PostPage({ params }: PageProps<"/posts/[id]">) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<LoadingText />}>
        <PostDetail params={params} />
      </Suspense>
      <div>
        <Link href="/posts" className={buttonVariants({ variant: "outline" })}>
          목록으로
        </Link>
      </div>
    </div>
  );
}

async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId < 1) notFound();

  const [post] = (await sql`
    SELECT p.id, p.title, p.content, p.created_at, u.name AS author_name
    FROM posts p JOIN users u ON u.id = p.author_id
    WHERE p.id = ${postId}
  `) as PostRow[];

  if (!post) notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{post.title}</CardTitle>
        <CardDescription>
          {post.author_name} · {formatDate(post.created_at, true)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap break-words leading-7">{post.content}</p>
      </CardContent>
    </Card>
  );
}
