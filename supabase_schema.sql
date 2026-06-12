create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.capsules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  message text not null,
  open_date date not null,
  media_path text,
  media_name text,
  media_type text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.capsules enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can read own capsules" on public.capsules;
drop policy if exists "Users can insert own capsules" on public.capsules;
drop policy if exists "Users can update own capsules" on public.capsules;
drop policy if exists "Users can delete own capsules" on public.capsules;

create policy "Users can read own capsules"
on public.capsules for select
using (auth.uid() = user_id);

create policy "Users can insert own capsules"
on public.capsules for insert
with check (auth.uid() = user_id);

create policy "Users can update own capsules"
on public.capsules for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own capsules"
on public.capsules for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('capsule-media', 'capsule-media', false)
on conflict (id) do nothing;

drop policy if exists "Users can read own capsule media" on storage.objects;
drop policy if exists "Users can upload own capsule media" on storage.objects;
drop policy if exists "Users can update own capsule media" on storage.objects;
drop policy if exists "Users can delete own capsule media" on storage.objects;

create policy "Users can read own capsule media"
on storage.objects for select
using (
  bucket_id = 'capsule-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can upload own capsule media"
on storage.objects for insert
with check (
  bucket_id = 'capsule-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update own capsule media"
on storage.objects for update
using (
  bucket_id = 'capsule-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'capsule-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own capsule media"
on storage.objects for delete
using (
  bucket_id = 'capsule-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
