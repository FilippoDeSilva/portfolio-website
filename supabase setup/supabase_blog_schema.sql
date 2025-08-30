-- Blogposts table with reactions
create table if not exists blogposts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  -- excerpt text,
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
  name text not null,
  post_id uuid references blogposts(id) on delete cascade,
  user_id uuid references auth.users(id),
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- Function to increment view_count atomically
create or replace function increment_view_count(post_id uuid)
returns void as $$
begin
  update blogposts set view_count = coalesce(view_count, 0) + 1 where id = post_id;
end;
$$ language plpgsql;
-- Enable Row Level Security for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own comments
CREATE POLICY "Allow insert for authenticated" ON comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to select all comments (public comments)
CREATE POLICY "Allow select for all" ON comments
  FOR SELECT
  USING (true);

-- Allow users to update their own comments
CREATE POLICY "Allow update for owner" ON comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Allow delete for owner" ON comments
  FOR DELETE
  USING (auth.uid() = user_id);
