-- Blogposts table with reactions
create table if not exists blogposts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  media_url text,
  media_type text,
  created_at timestamptz not null default now(),
  likes integer not null default 0,
  love integer not null default 0,
  laugh integer not null default 0,
  attachments jsonb
);

-- Comments table
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references blogposts(id) on delete cascade,
  user_id uuid references auth.users(id),
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
