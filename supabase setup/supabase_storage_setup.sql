-- Create a public bucket for blog images and attachments
insert into storage.buckets (id, name, public) values ('blog-attachments', 'blog-attachments', true)
on conflict (id) do nothing;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert files into the blog-attachments bucket
CREATE POLICY "Allow authenticated users to insert files into blog-attachments bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-attachments');

-- Allow authenticated users to update their own files in the blog-attachments bucket
CREATE POLICY "Allow authenticated users to update files in blog-attachments bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-attachments');

-- Allow authenticated users to delete files in the blog-attachments bucket
CREATE POLICY "Allow authenticated users to delete files in blog-attachments bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blog-attachments');

-- Enable RLS on blogposts table if not already enabled
ALTER TABLE blogposts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert blog posts
CREATE POLICY "Allow authenticated users to insert blog posts"
ON blogposts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update blog posts
CREATE POLICY "Allow authenticated users to update blog posts"
ON blogposts
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete blog posts
CREATE POLICY "Allow authenticated users to delete blog posts"
ON blogposts
FOR DELETE
TO authenticated
USING (true);

-- Allow public read access to blog posts
CREATE POLICY "Allow public read access to blog posts"
ON blogposts
FOR SELECT
TO public
USING (true);

-- Enable RLS on comments table if not already enabled
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert comments
CREATE POLICY "Allow authenticated users to insert comments"
ON comments
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their own comments
CREATE POLICY "Allow authenticated users to update their own comments"
ON comments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own comments
CREATE POLICY "Allow authenticated users to delete their own comments"
ON comments
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow public read access to comments
CREATE POLICY "Allow public read access to comments"
ON comments
FOR SELECT
TO public
USING (true);
