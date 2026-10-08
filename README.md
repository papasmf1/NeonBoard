# 게시판 (Next.js + TypeScript + shadcn/ui)

회원가입/로그인 후 글을 쓰고, 누구나 글을 읽을 수 있는 간단한 게시판입니다.

## 실행

`.env.local`에 아래 두 값이 필요합니다.

```
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require   # Neon 연결 문자열
SESSION_SECRET=...                                               # openssl rand -base64 32
```

```bash
npm install
npm run db:init   # 최초 1회: users, posts 테이블 생성 (db/schema.sql)
npm run dev
```

http://localhost:3000 접속.

## 구성

- **DB**: [Neon](https://neon.tech) Postgres + `@neondatabase/serverless` (HTTP 드라이버, 태그드 템플릿으로 SQL 인젝션 방지)
- **인증**: bcrypt 비밀번호 해시 + `jose` JWT를 httpOnly 쿠키에 저장 (7일)
- **검증**: zod (Server Actions에서 처리)

| 경로 | 설명 |
| --- | --- |
| `/` | 홈 |
| `/signup`, `/login` | 회원가입 / 로그인 (로그인 상태면 `/posts`로 이동) |
| `/posts` | 글 목록 (누구나) |
| `/posts/[id]` | 글 읽기 (누구나) |
| `/posts/new` | 글쓰기 (로그인 필요) |

주요 파일: `src/lib/db.ts`, `src/lib/session.ts`, `src/app/actions/auth.ts`, `src/app/actions/posts.ts`
