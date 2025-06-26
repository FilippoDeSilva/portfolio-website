-- Migration: Support multiple attachments and optional cover image for blogposts
-- Make sure attachments is always a JSONB array (for multiple attachments)
-- cover_image remains a text (URL or Supabase public URL)

ALTER TABLE blogposts
  ALTER COLUMN attachments TYPE jsonb USING (
    CASE
      WHEN jsonb_typeof(attachments) = 'array' THEN attachments
      WHEN attachments IS NULL THEN '[]'::jsonb
      ELSE jsonb_build_array(attachments)
    END
  );

-- Ensure cover_image is nullable (optional)
ALTER TABLE blogposts
  ALTER COLUMN cover_image DROP NOT NULL;

-- If you want to enforce attachments always as array, you can add a check constraint:
ALTER TABLE blogposts
  DROP CONSTRAINT IF EXISTS blogposts_attachments_is_array;
ALTER TABLE blogposts
  ADD CONSTRAINT blogposts_attachments_is_array CHECK (
    attachments IS NULL OR jsonb_typeof(attachments) = 'array'
  );

-- Existing data will be migrated to array if not already.
-- No changes needed for cover_image, as it is already a text field.
