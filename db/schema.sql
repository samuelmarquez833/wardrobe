-- b3-clothes schema. Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists clothes (
  id text primary key,
  image_url text not null,
  image_path text,
  color text,
  type text not null,
  subcategory_id text,
  is_dirty boolean not null default false,
  created_at timestamptz not null default now(),
  user_id text not null default 'default'
);

create table if not exists outfits (
  id text primary key,
  clothes_ids text[] not null,
  name text,
  created_at timestamptz not null default now(),
  user_id text not null default 'default'
);

create table if not exists subcategories (
  id text primary key,
  type text not null,
  name text not null,
  created_at timestamptz not null default now(),
  user_id text not null default 'default'
);

create index if not exists idx_clothes_user on clothes(user_id);
create index if not exists idx_outfits_user on outfits(user_id);
create index if not exists idx_subcategories_user on subcategories(user_id);

-- RLS on: blocks the public anon key entirely.
-- The app talks to these tables only through Next.js API routes using the
-- service_role key, which bypasses RLS. No policies needed while single-user.
alter table clothes enable row level security;
alter table outfits enable row level security;
alter table subcategories enable row level security;

-- Storage bucket for the photos. Public read so <img src> works directly.
insert into storage.buckets (id, name, public)
values ('clothes', 'clothes', true)
on conflict (id) do nothing;
