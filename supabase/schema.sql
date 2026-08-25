-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Document-style tables: the app stores each record as jsonb in `data`.

create table if not exists leads (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists quotes (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists outbox (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- The app talks to these tables with the service-role key only (server-side),
-- so lock them away from the public anon key entirely.
alter table leads enable row level security;
alter table quotes enable row level security;
alter table invoices enable row level security;
alter table outbox enable row level security;

-- Public bucket for customer job photos (uploads go through the server).
insert into storage.buckets (id, name, public)
values ('job-photos', 'job-photos', true)
on conflict (id) do nothing;
