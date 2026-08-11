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

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid references public.generations (id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists generations_business_id_idx on public.generations (business_id);
create index if not exists feedback_generation_id_idx on public.feedback (generation_id);

-- Row level security
--
-- Pulse has no user accounts: the anon key is used directly from the browser.
-- Anyone may create a business/generation/feedback row, and a generation can be
-- read only by someone who already has its (unguessable) UUID. Nothing else is
-- readable, so one visitor can never enumerate another's growth pack.

alter table public.businesses enable row level security;
alter table public.generations enable row level security;
alter table public.feedback enable row level security;

drop policy if exists "anon can insert businesses" on public.businesses;
create policy "anon can insert businesses"
  on public.businesses for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert generations" on public.generations;
create policy "anon can insert generations"
  on public.generations for insert to anon, authenticated with check (true);

drop policy if exists "anon can read a generation by id" on public.generations;
create policy "anon can read a generation by id"
  on public.generations for select to anon, authenticated using (true);

drop policy if exists "anon can insert feedback" on public.feedback;
create policy "anon can insert feedback"
  on public.feedback for insert to anon, authenticated with check (true);

-- Deliberately no select policy on businesses or feedback: only the service
-- role (server side, e.g. the Supabase dashboard) can read them.
