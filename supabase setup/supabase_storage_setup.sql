-- Create a public bucket for blog images and attachments
insert into storage.buckets (id, name, public) values ('blog-attachments', 'blog-attachments', true)
on conflict (id) do nothing;
-- You may also want to set RLS policies for public read and authenticated write if not already set.
