import "server-only";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL 환경 변수가 설정되지 않았습니다.");

/** Neon HTTP 드라이버. sql`SELECT ... WHERE id = ${id}` 형태로 사용 (자동 파라미터 바인딩) */
export const sql = neon(url);

export type User = { id: number; email: string; name: string; password_hash: string };
export type PostRow = {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: Date;
};
