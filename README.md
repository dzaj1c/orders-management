This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Order seeding

A script can periodically create orders and advance their statuses (for demo data). Copy `env.example` to `.env.local` if needed, then set:

- `ENABLE_SEEDING=true` to enable the seeder
- `SEED_TICK_INTERVAL_MS=60000` (milliseconds; minimum 5000)

Run from project root:

```bash
npm run seed:orders
```

Fake data (products, customers, Sarajevo-related addresses) is in `scripts/seed-data.json`. The process runs until you stop it (Ctrl+C).

**If you see POST requests but no new orders in the DB or table:** Supabase is likely rejecting inserts/selects. In Supabase Dashboard → Table Editor → `orders` → "Row Level Security": either disable RLS for the table or add policies that allow `INSERT` and `SELECT` for the `anon` role. Check the terminal where `npm run dev` (or `npm run seed:orders`) runs for `ordersRepository.create error:` or `ordersRepository.list error:` with the exact Supabase error.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
