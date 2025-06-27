import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { cover_image, attachments } = await req.json();

    // Helper to extract storage path from a Supabase public URL
    function getStoragePath(url: string): string | null {
      if (!url || typeof url !== 'string') return null;
      // Match either attachments or cover-images subfolder
      const match = url.match(/blog-attachments\/(attachments|cover-images)\/(.+)$/);
      return match ? `${match[1]}/${match[2]}` : null;
    }

    const filePaths: string[] = [];
    if (cover_image) {
      const path = getStoragePath(cover_image);
      if (path) filePaths.push(path);
    }
    if (Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att?.url) {
          const path = getStoragePath(att.url);
          if (path) filePaths.push(path);
        }
      }
    }

    if (filePaths.length > 0) {
      const { error } = await supabase.storage.from('blog-attachments').remove(filePaths);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 