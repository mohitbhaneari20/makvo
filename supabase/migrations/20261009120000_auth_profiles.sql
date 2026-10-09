-- MAKVO · authentication profiles
-- Creates account types, user profiles, automatic profile creation on sign-up, and Row Level Security.
-- Email lives in auth.users (single source of truth); it is not copied into profiles.

-- ---------------------------------------------------------------------------
-- Account types: a lookup table so new types can be added with an INSERT, no schema change.
-- To support several roles per user later, add a profile_account_types(profile_id, account_type) join table
-- and keep profiles.account_type as the primary one.
-- Account types describe what someone uses MAKVO for. They must never be used to grant permissions.
-- ---------------------------------------------------------------------------
create table if not exists public.account_types (
  id          text primary key check (id ~ '^[a-z][a-z_]{1,30}$'),
  label       text not null,
  sort_order  integer not null default 0
);

insert into public.account_types (id, label, sort_order) values
  ('client', 'Client', 1),
  ('designer', 'Designer', 2),
  ('developer', 'Developer', 3),
  ('studio', 'Studio', 4)
on conflict (id) do nothing;

alter table public.account_types enable row level security;

drop policy if exists "Account types are readable by everyone" on public.account_types;
create policy "Account types are readable by everyone"
  on public.account_types for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.account_types from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Profiles: one row per auth user, keyed by the auth user id.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                    uuid primary key references auth.users (id) on delete cascade,
  full_name             text check (full_name is null or char_length(full_name) between 1 and 120),
  avatar_url            text check (avatar_url is null or (char_length(avatar_url) <= 2048 and avatar_url ~* '^https://')),
  account_type          text references public.account_types (id) on update cascade,
  headline              text check (headline is null or char_length(headline) <= 140),
  organization          text check (organization is null or char_length(organization) <= 120),
  onboarding_completed  boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on column public.profiles.account_type is
  'Primary way the person uses MAKVO (client, designer, developer, studio). A product preference only: never use it for authorization.';
comment on column public.profiles.headline is 'Optional short professional headline, set during onboarding.';
comment on column public.profiles.organization is 'Optional company (clients) or studio name (studios).';

create index if not exists profiles_account_type_idx on public.profiles (account_type);

alter table public.profiles enable row level security;

-- Users can read, create and update only their own profile. No delete policy: profiles go when the auth user is deleted.
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Column-level privileges: the anon role gets nothing; signed-in users can only write the editable columns
-- (never id, created_at or updated_at).
revoke all on public.profiles from anon;
revoke insert, update, delete on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant insert (id, full_name, avatar_url, account_type, headline, organization, onboarding_completed) on public.profiles to authenticated;
grant update (full_name, avatar_url, account_type, headline, organization, onboarding_completed) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Keep updated_at current.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Create a profile whenever an auth user is created (email sign-up or first Google sign-in).
-- Values come from user metadata and are validated here; an unknown account type is stored as NULL
-- and the user picks one during onboarding.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  requested_type text := meta ->> 'account_type';
  avatar text := coalesce(meta ->> 'avatar_url', meta ->> 'picture');
begin
  insert into public.profiles (id, full_name, avatar_url, account_type)
  values (
    new.id,
    nullif(left(btrim(coalesce(meta ->> 'full_name', meta ->> 'name', '')), 120), ''),
    case when avatar ~* '^https://' and char_length(avatar) <= 2048 then avatar end,
    (select t.id from public.account_types t where t.id = requested_type)
  )
  on conflict (id) do nothing;
  return new;
exception
  when others then
    -- Never block sign-up because of the profile. The app creates the row during onboarding if it is missing.
    raise warning 'handle_new_user: could not create profile for %: %', new.id, sqlerrm;
    return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
