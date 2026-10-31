
create type public.app_role as enum ('superadmin','admin','moderator','user');
create type public.anime_status as enum ('em_lancamento','finalizado','em_breve','pausado');

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name text not null check (char_length(display_name) between 1 and 40),
  avatar_url text,
  banner_url text,
  bio text check (char_length(bio) <= 500),
  show_favorites boolean not null default true,
  show_history boolean not null default false,
  is_vip boolean not null default false,
  vip_expires_at timestamptz,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles own update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- USER ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "roles own read" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','superadmin'))
$$;

-- Protect privileged profile columns from self-edit
create or replace function public.protect_profile_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if current_user in ('authenticated','anon') and not public.is_admin(auth.uid()) then
    new.is_vip := old.is_vip;
    new.vip_expires_at := old.vip_expires_at;
    new.is_verified := old.is_verified;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger trg_protect_profile before update on public.profiles
for each row execute function public.protect_profile_columns();

-- Signup trigger: profile + role (first user = superadmin)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base text;
  uname text;
  n int := 0;
begin
  base := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)), '[^a-zA-Z0-9_]', '', 'g'));
  if char_length(base) < 3 then base := base || 'dvx'; end if;
  base := left(base, 16);
  uname := base;
  while exists (select 1 from public.profiles where username = uname) loop
    n := n + 1;
    uname := base || n::text;
  end loop;
  insert into public.profiles (id, username, display_name, avatar_url)
  values (new.id, uname,
    left(coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', uname), 40),
    new.raw_user_meta_data->>'avatar_url');
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  if not exists (select 1 from public.user_roles where role = 'superadmin') then
    insert into public.user_roles (user_id, role) values (new.id, 'superadmin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ANIMES
create table public.animes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  title text not null check (char_length(title) between 1 and 200),
  alternative_titles text,
  synopsis text,
  poster_url text,
  banner_url text,
  tmdb_id integer check (tmdb_id > 0),
  release_year integer check (release_year between 1900 and 2100),
  studio text,
  status anime_status not null default 'em_lancamento',
  genres text[] not null default '{}',
  age_rating text not null default 'L',
  is_published boolean not null default false,
  is_featured boolean not null default false,
  featured_order integer not null default 0,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index animes_title_idx on public.animes using gin (to_tsvector('simple', title || ' ' || coalesce(alternative_titles,'')));
grant select on public.animes to anon;
grant select, insert, update, delete on public.animes to authenticated;
grant all on public.animes to service_role;
alter table public.animes enable row level security;
create policy "animes public read" on public.animes for select using (is_published or public.is_admin(auth.uid()));
create policy "animes admin insert" on public.animes for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "animes admin update" on public.animes for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "animes admin delete" on public.animes for delete to authenticated using (public.is_admin(auth.uid()));

-- SEASONS
create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  anime_id uuid not null references public.animes(id) on delete cascade,
  season_number integer not null check (season_number >= 0),
  title text,
  synopsis text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (anime_id, season_number)
);
grant select on public.seasons to anon;
grant select, insert, update, delete on public.seasons to authenticated;
grant all on public.seasons to service_role;
alter table public.seasons enable row level security;
create policy "seasons public read" on public.seasons for select using (
  public.is_admin(auth.uid()) or (is_published and exists (select 1 from public.animes a where a.id = anime_id and a.is_published)));
create policy "seasons admin write" on public.seasons for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- EPISODES
create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  anime_id uuid not null references public.animes(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  episode_number integer not null check (episode_number >= 0),
  is_special boolean not null default false,
  title text,
  description text,
  thumbnail_url text,
  player_url text not null check (player_url ~ '^https://'),
  release_date date,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, episode_number, is_special)
);
create index episodes_published_idx on public.episodes (published_at desc) where is_published;
grant select on public.episodes to anon;
grant select, insert, update, delete on public.episodes to authenticated;
grant all on public.episodes to service_role;
alter table public.episodes enable row level security;
create policy "episodes public read" on public.episodes for select using (
  public.is_admin(auth.uid()) or (is_published and exists (
    select 1 from public.seasons s join public.animes a on a.id = s.anime_id
    where s.id = season_id and s.is_published and a.is_published)));
create policy "episodes admin write" on public.episodes for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create or replace function public.episode_consistency()
returns trigger language plpgsql set search_path = public as $$
begin
  if not exists (select 1 from public.seasons where id = new.season_id and anime_id = new.anime_id) then
    raise exception 'A temporada não pertence a este anime';
  end if;
  if new.is_published and (old is null or not old.is_published) then
    new.published_at := now();
  end if;
  new.updated_at := now();
  update public.animes set updated_at = now() where id = new.anime_id;
  return new;
end $$;
create trigger trg_episode_consistency before insert or update on public.episodes
for each row execute function public.episode_consistency();

-- FAVORITES
create table public.favorites (
  user_id uuid not null,
  anime_id uuid not null references public.animes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, anime_id)
);
grant select, insert, delete on public.favorites to authenticated;
grant select on public.favorites to anon;
grant all on public.favorites to service_role;
alter table public.favorites enable row level security;
create policy "fav own or public" on public.favorites for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = user_id and p.show_favorites));
create policy "fav own insert" on public.favorites for insert to authenticated with check (auth.uid() = user_id);
create policy "fav own delete" on public.favorites for delete to authenticated using (auth.uid() = user_id);

-- WATCH HISTORY
create table public.watch_history (
  user_id uuid not null,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  anime_id uuid not null references public.animes(id) on delete cascade,
  watched boolean not null default false,
  last_watched_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);
grant select, insert, update, delete on public.watch_history to authenticated;
grant all on public.watch_history to service_role;
alter table public.watch_history enable row level security;
create policy "wh own select" on public.watch_history for select to authenticated using (
  auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = user_id and p.show_history));
create policy "wh own insert" on public.watch_history for insert to authenticated with check (auth.uid() = user_id);
create policy "wh own update" on public.watch_history for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wh own delete" on public.watch_history for delete to authenticated using (auth.uid() = user_id);

-- AUDIT LOG
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  administrator_id uuid,
  action text not null,
  target_type text,
  target_id text,
  target_user_id uuid,
  reason text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
grant select on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "audit admin read" on public.audit_logs for select to authenticated using (public.is_admin(auth.uid()));

create or replace function public.audit_content()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_logs (administrator_id, action, target_type, target_id, metadata)
  values (auth.uid(), lower(tg_op), tg_table_name, coalesce(new.id, old.id)::text,
    case when tg_op = 'DELETE' then to_jsonb(old) else jsonb_build_object('is_published', to_jsonb(new)->'is_published') end);
  return coalesce(new, old);
end $$;
create trigger audit_animes after insert or update or delete on public.animes for each row execute function public.audit_content();
create trigger audit_seasons after insert or update or delete on public.seasons for each row execute function public.audit_content();
create trigger audit_episodes after insert or update or delete on public.episodes for each row execute function public.audit_content();

-- view counter (rate-safe: just increments, only published)
create or replace function public.register_anime_view(_anime_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.animes set view_count = view_count + 1 where id = _anime_id and is_published;
$$;
grant execute on function public.register_anime_view(uuid) to anon, authenticated;
