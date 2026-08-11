-- Flarent Pulse — database schema
-- Run this once in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  industry text not null,
  location text not null,
  description text not null,
  target_audience text not null,
  goals text[] not null default '{}',
  website text,
  instagram text,
  additional_information text,
  created_at timestamptz not null default now()
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  result_json jsonb not null,
  created_at timestamptz not null default now()
);

-- Feedback is not stored here: the feedback form posts to Netlify Forms, and
-- submissions are read in the Netlify dashboard under Forms → pulse-feedback.

create index if not exists generations_business_id_idx on public.generations (business_id);

-- Row level security
--
-- Pulse has no user accounts: the anon key is used directly from the browser.
-- Anyone may create a business and a generation, and a generation can be read
-- only by someone who already has its (unguessable) UUID. Nothing else is
-- readable, so one visitor can never enumerate another's growth pack.

alter table public.businesses enable row level security;
alter table public.generations enable row level security;

drop policy if exists "anon can insert businesses" on public.businesses;
create policy "anon can insert businesses"
  on public.businesses for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert generations" on public.generations;
create policy "anon can insert generations"
  on public.generations for insert to anon, authenticated with check (true);

drop policy if exists "anon can read a generation by id" on public.generations;
create policy "anon can read a generation by id"
  on public.generations for select to anon, authenticated using (true);

-- Deliberately no select policy on businesses: only the service role (server
-- side, e.g. the Supabase dashboard) can read it.
