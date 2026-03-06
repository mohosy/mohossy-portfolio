# Mohossy Portfolio

Single-page Next.js + TypeScript portfolio implementing a recruiter-focused, bold editorial design with interactive systems demos.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + custom design tokens
- Framer Motion animations
- Vercel Analytics event tracking

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Deploy (Vercel)

See [DEPLOY.md](./DEPLOY.md) for the exact production workflow, GitHub push steps, Vercel deploy commands, DNS records, and SSL setup for `mohossy.com`.

## Content Editing

- Portfolio content/types: `src/content/portfolio.ts`, `src/types/portfolio.ts`
- Main page composition: `src/app/page.tsx`
- Interactive demos: `src/components/mini-demos.tsx`

## Resume Asset

Current resume download points to text export:

- `public/resume/mo-shirmohammadi-resume.txt`

Replace with a PDF later and update `resumeUrl` in `src/content/portfolio.ts`.
