# Deployment Guide

This file documents the exact workflow for saving changes to the portfolio, pushing them to GitHub, and making them live on `mohossy.com`.

## Current Production Setup

- GitHub repo: `https://github.com/mohosy/mohossy-portfolio`
- Vercel project: `site-temp`
- Vercel org/team id: `team_db7MzOIgggmc3bSDJnYHVv54`
- Vercel project id: `prj_Jd9F1Ei0hmLUHD34Scir7u43dkuT`
- Production domain: `mohossy.com`
- Secondary domain: `www.mohossy.com`
- Local Vercel link file: `.vercel/project.json`

## Normal Update Flow

Run all commands from the repo root:

```bash
cd /Users/mo/Downloads/myportfolio/site-temp
```

### 1. Make your code/content changes

Typical files:

- `src/app/page.tsx`
- `src/app/globals.css`
- `src/content/portfolio.ts`
- `src/components/*`
- `public/images/*`
- `public/videos/*`

### 2. Test locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### 3. Run checks before pushing

```bash
npm run lint
npm run build
```

### 4. Commit and push to GitHub

```bash
git add -A
git commit -m "Describe the site update"
git push origin main
```

Because this repo is already connected to Vercel, pushing to `main` is the standard way to save changes remotely and trigger a deployment.

## Recommended Deploy Method

Recommended default:

```bash
git push origin main
```

That updates GitHub and lets Vercel deploy from the linked repo.

## Force a Manual Production Deploy

Use this when you want to push a deployment immediately from the current local state:

```bash
cd /Users/mo/Downloads/myportfolio/site-temp
npx vercel --prod --yes
```

This creates a production deployment and updates `mohossy.com` to the newest version.

## If You Need To Reconnect This Repo To Vercel

This repo is already linked, but on a new machine you may need to reconnect it.

### 1. Log into Vercel

```bash
npx vercel login
```

### 2. Link the local repo to the existing Vercel project

```bash
npx vercel link
```

Choose:

- Scope: the team that owns the project
- Existing project: `site-temp`

After linking, `.vercel/project.json` should point to the correct project.

## Domain / DNS Configuration

The live domain is connected through GoDaddy DNS records, not Vercel nameservers.

Current DNS setup should be:

- `A` record
  - Name: `@`
  - Value: `76.76.21.21`
- `CNAME` record
  - Name: `www`
  - Value: `cname.vercel-dns.com`

Do not replace this with random forwarding rules unless you intentionally want to change the setup.

## SSL / HTTPS

You do not manually buy or upload an SSL certificate for this setup.

Vercel issues and renews SSL automatically after:

- the domain is added to the Vercel project
- the DNS records are pointed correctly
- DNS propagation finishes

To verify in Vercel:

- Open the `site-temp` project
- Go to `Settings -> Domains`
- Confirm both `mohossy.com` and `www.mohossy.com` are present and valid

## Exact Production Checklist

Use this checklist every time you want the site live with new changes:

1. Edit the site locally.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Run `git add -A`.
5. Run `git commit -m "Describe the change"`.
6. Run `git push origin main`.
7. Wait for Vercel production deployment to finish.
8. Open `https://mohossy.com` and hard refresh.

## Fastest Way I Have Been Deploying It

This is the exact pattern used during development:

```bash
cd /Users/mo/Downloads/myportfolio/site-temp
npm run lint
npm run build
git add -A
git commit -m "Update portfolio design and interactions"
git push origin main
npx vercel --prod --yes
```

You do not always need both `git push origin main` and `npx vercel --prod --yes`, but using both guarantees:

- GitHub has the latest code
- Vercel production is updated immediately

## Important Notes

- `public/videos/irl-app-launch-v2.mp4` is large and GitHub warns about it.
- GitHub accepted it, but long term this file should move to Git LFS or external media hosting.
- If `www.mohossy.com` works but `mohossy.com` does not, re-check the `A` record for `@`.
- If HTTPS looks broken, check Vercel `Settings -> Domains` first. In most cases it is a DNS issue, not a certificate purchase issue.
