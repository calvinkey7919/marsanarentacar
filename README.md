# Marsana Ops + Corporate Portal

This project implements the skeleton of a mobile‑first web application (PWA) for Marsana’s internal operations and corporate client portal.  It follows the requirements outlined in the Marsana blueprint you supplied.  You can use this as a starting point to build out your MVP and iteratively add features.

## Project overview

* **Frontend:** Built with [Next.js](https://nextjs.org) 14 using the new App Router API.  The UI is mobile‑first and integrates [Tailwind CSS](https://tailwindcss.com) for rapid styling.  All pages live inside the `src/app` directory.
* **Auth & API:** Authentication is handled by [Supabase](https://supabase.com/).  The Supabase JavaScript client is configured in `src/utils/supabaseClient.ts` and used throughout the app.  Role‑based access control (RBAC) is enforced in the UI, but you must also configure row‑level security (RLS) policies on Supabase tables to guarantee corporate data isolation.
* **Database:** A SQL file (`sql/schema.sql`) defines the starting database schema.  You can run this script inside your Supabase project to create the necessary tables, indices and relationships.  Feel free to adjust fields as you flesh out the data model.

## Getting started

1. **Clone or copy this repository.**  (If you are reading this inside ChatGPT, download the project files after the assistant syncs them.)

2. **Create a Supabase project.**  Sign into [supabase.com](https://supabase.com), create a new project, and take note of your project URL and anon key.

3. **Configure environment variables.**  Copy `.env.local.example` to `.env.local` and fill in your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your Supabase credentials.  If you plan to perform server‑side calls with elevated privileges (e.g., inserting data without exposing the service role key to the client), also set `SUPABASE_SERVICE_ROLE_KEY`.

4. **Create the database schema.**  Open the Supabase SQL editor and run the contents of `sql/schema.sql`.  This will create the tables described in the blueprint (users, corporates, branches, vehicles, contracts, assignments, requests and comments).  After running the script, make sure to enable row‑level security (RLS) on each table and define policies to restrict corporate users to their own data.

5. **Install dependencies and run the app locally.**  On your development machine (with Node.js 16+), run:

```sh
cd marsana-app
npm install
npm run dev
```

This will start the development server at `http://localhost:3000`.  You can sign up or log in using Supabase’s email/password authentication.  The initial pages include a login form and simple dashboards for each role (admin, operations and corporate).  Most pages are placeholders with instructions for where to add forms, tables, and CRUD logic.

6. **Deploying to production.**  When you are ready to deploy, you can host the Next.js frontend on [Vercel](https://vercel.com) or any static hosting that supports Next.js server functions.  Vercel integrates tightly with Supabase: you simply set your Supabase environment variables in the Vercel dashboard.  For PWA support, you may install the `next-pwa` package and configure it in `next.config.js`.

## File structure

```
marsana-app/
├── src/
│   ├── app/                # Next.js app router pages & layouts
│   │   ├── layout.tsx      # Global layout (navigation + auth wrapper)
│   │   ├── page.tsx        # Landing page (can redirect to login)
│   │   ├── (auth)/login/   # Login screen
│   │   ├── admin/          # Admin section (branches, corporates, users)
│   │   ├── ops/            # Operations section (fleet, requests)
│   │   └── corporate/      # Corporate portal
│   ├── components/         # Reusable UI components (sidebar, forms)
│   └── utils/
│       └── supabaseClient.ts # Supabase client initialisation
├── sql/schema.sql          # SQL script defining the database schema
├── .env.local.example       # Template for environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This guide
```

## Security considerations

This project demonstrates client‑side role enforcement; however, **you must implement server‑side RBAC and row‑level security** in Supabase to protect your data.  For example, corporate users should only be able to read and write rows where `corporate_id` equals their own corporate ID.  See the Supabase documentation on [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) for detailed instructions.

Feel free to extend this project by adding CRUD forms, API routes, context providers, and UI polish.  Each placeholder page includes comments pointing you in the right direction.