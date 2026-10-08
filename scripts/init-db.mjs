// 사용법: npm run db:init  (.env.local의 DATABASE_URL에 테이블을 생성)
import { readFileSync } from "node:fs";
import { Pool } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL 환경 변수가 설정되지 않았습니다.");

const pool = new Pool({ connectionString: url });
await pool.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
await pool.end();
console.log("✓ 테이블 생성 완료 (users, posts)");
