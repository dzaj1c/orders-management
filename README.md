# Orders onboarding

A Next.js app for managing orders, using Supabase for data and server actions for mutations.

## Run locally

- **Development:** `npm run dev` — dev server at [http://localhost:3000](http://localhost:3000)
- **Build:** `npm run build` — production build
- **Seed (optional):** `npm run seed:orders` — seed the database (see below)

## Environment variables

Create `.env.local` (e.g. from `env.example`) and set:

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL (from dashboard)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anonymous key

Restart the dev server after changing `.env.local`.

## Order seeding

The seed script can periodically create orders and advance their statuses (for demo data). In `.env.local` you can set:

- `ENABLE_SEEDING=true` to enable the seeder
- `SEED_TICK_INTERVAL_MS=60000` (milliseconds; minimum 5000)

Run from project root:

```bash
npm run seed:orders
```

Fake data (products, customers, Sarajevo-related addresses) is in `scripts/seed-data.json`. The process runs until you stop it (Ctrl+C).

**If you see POST requests but no new orders in the DB or table:** Supabase is likely rejecting inserts/selects. In Supabase Dashboard → Table Editor → `orders` → "Row Level Security": either disable RLS for the table or add policies that allow `INSERT` and `SELECT` for the `anon` role. Check the terminal for `ordersRepository.create error:` or `ordersRepository.list error:` with the exact Supabase error.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Deploy on Vercel](https://vercel.com/new)
