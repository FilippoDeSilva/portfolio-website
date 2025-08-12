-- Chat Histories Schema for AI Assistant Cross-Device Sync
-- Run this migration to enable chat history persistence across devices

-- Create the chat_histories table
CREATE TABLE IF NOT EXISTS chat_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  model TEXT DEFAULT 'gpt-4o',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_histories_user_id ON chat_histories(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_histories_updated_at ON chat_histories(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_histories_created_at ON chat_histories(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_histories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own chat histories
CREATE POLICY "Users can view own chat histories" ON chat_histories
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own chat histories
CREATE POLICY "Users can insert own chat histories" ON chat_histories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own chat histories
CREATE POLICY "Users can update own chat histories" ON chat_histories
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own chat histories
CREATE POLICY "Users can delete own chat histories" ON chat_histories
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_histories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER trigger_update_chat_histories_updated_at
  BEFORE UPDATE ON chat_histories
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_histories_updated_at();

-- Create a function to get chat history count for a user
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON chat_histories TO authenticated;

-- Insert some sample data for testing (optional - remove in production)
-- INSERT INTO chat_histories (user_id, title, messages, model) VALUES 
--   ('00000000-0000-0000-0000-000000000000', 'Sample Chat', '[{"role": "user", "content": "Hello", "timestamp": "2024-01-01T00:00:00Z"}]', 'gpt-4o');

-- Verify the setup
SELECT 
  'Chat histories table created successfully' as status,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_name = 'chat_histories';

-- Show RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'chat_histories';
