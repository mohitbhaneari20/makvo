-- MAKVO · profile and cover images
-- Adds a cover image to profiles and a Storage bucket where each user can manage only their own files.
-- Safe to run more than once.

-- ---------------------------------------------------------------------------
-- Cover image column (avatar_url already exists).
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists cover_url text;

alter table public.profiles drop constraint if exists profiles_cover_url_check;
alter table public.profiles
  add constraint profiles_cover_url_check
  check (cover_url is null or (char_length(cover_url) <= 2048 and cover_url ~* '^https://'));

comment on column public.profiles.cover_url is 'Optional banner image shown on the profile.';

grant update (cover_url) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Storage bucket: public read (profile images are meant to be seen), 5 MB limit, images only.
-- Files live under <user id>/..., and the policies below only let a user write inside their own folder.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-media', 'profile-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Profile media: users upload to their own folder" on storage.objects;
create policy "Profile media: users upload to their own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Profile media: users update their own files" on storage.objects;
create policy "Profile media: users update their own files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Profile media: users delete their own files" on storage.objects;
create policy "Profile media: users delete their own files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Listing is limited to the owner's folder; public URLs work without a select policy because the bucket is public.
drop policy if exists "Profile media: users list their own files" on storage.objects;
create policy "Profile media: users list their own files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
