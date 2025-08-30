-- Unified Supabase Setup Migration
-- This file combines all required working SQL code from your setup files.

-- Blogposts table with reactions
CREATE TABLE IF NOT EXISTS blogposts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text,
  cover_image text,
  media_url text,
  media_type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  likes integer NOT NULL DEFAULT 0,
  love integer NOT NULL DEFAULT 0,
  laugh integer NOT NULL DEFAULT 0,
  attachments jsonb,
  view_count integer NOT NULL DEFAULT 0
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  post_id uuid REFERENCES blogposts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Function to increment view_count atomically
CREATE OR REPLACE FUNCTION increment_view_count(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE blogposts SET view_count = coalesce(view_count, 0) + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security for blogposts and comments
ALTER TABLE blogposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Blogposts RLS policies
CREATE POLICY "Allow authenticated users to insert blog posts" ON blogposts
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update blog posts" ON blogposts
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete blog posts" ON blogposts
  FOR DELETE TO authenticated USING (true);
CREATE POLICY "Allow public read access to blog posts" ON blogposts
  FOR SELECT TO public USING (true);

-- Comments RLS policies
CREATE POLICY "Allow anyone to insert comments" ON comments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow comment owner to update" ON comments
  FOR UPDATE USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id);
CREATE POLICY "Allow comment owner to delete" ON comments
  FOR DELETE USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id);
CREATE POLICY "Allow anyone to read comments" ON comments
  FOR SELECT USING (true);

-- Chat Histories table
CREATE TABLE IF NOT EXISTS chat_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  model TEXT DEFAULT 'gpt-4o',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chat_histories_user_id ON chat_histories(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_histories_updated_at ON chat_histories(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_histories_created_at ON chat_histories(created_at DESC);
ALTER TABLE chat_histories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chat histories" ON chat_histories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat histories" ON chat_histories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat histories" ON chat_histories
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat histories" ON chat_histories
  FOR DELETE USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION update_chat_histories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_update_chat_histories_updated_at
  BEFORE UPDATE ON chat_histories
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_histories_updated_at();
CREATE OR REPLACE FUNCTION get_user_chat_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM chat_histories 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON chat_histories TO authenticated;

-- Storage setup for blog attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-attachments', 'blog-attachments', true)
ON CONFLICT (id) DO NOTHING;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to insert files into blog-attachments bucket"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-attachments');
CREATE POLICY "Allow authenticated users to update files in blog-attachments bucket"
ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'blog-attachments');
CREATE POLICY "Allow authenticated users to delete files in blog-attachments bucket"
ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'blog-attachments');

-- Migration for multiple attachments and optional cover image
ALTER TABLE blogposts ALTER COLUMN attachments TYPE jsonb USING (
  CASE
    WHEN jsonb_typeof(attachments) = 'array' THEN attachments
    WHEN attachments IS NULL THEN '[]'::jsonb
    ELSE jsonb_build_array(attachments)
  END
);
ALTER TABLE blogposts ALTER COLUMN cover_image DROP NOT NULL;
ALTER TABLE blogposts DROP CONSTRAINT IF EXISTS blogposts_attachments_is_array;
ALTER TABLE blogposts ADD CONSTRAINT blogposts_attachments_is_array CHECK (
  attachments IS NULL OR jsonb_typeof(attachments) = 'array'
);
