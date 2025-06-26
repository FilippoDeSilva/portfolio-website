"use client"

import { useEffect, useState } from "react";
import { BlogCard, BlogPost } from "./blog-card";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BlogList({ excludeId, columns = 3 }: { excludeId?: string; columns?: number } = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("blogposts")
        .select(
          "id, title, excerpt, cover_image, media_url, media_type, created_at, likes, love, laugh, view_count"
        )
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
        setPosts([]);
      } else if (data) {
        let filtered = data as BlogPost[];
        if (excludeId) filtered = filtered.filter((p) => p.id !== excludeId);
        setPosts(filtered);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [excludeId]);

  if (loading)
    return <div className="py-12 text-center">Loading blog posts...</div>;
  if (error)
    return (
      <div className="py-12 text-center text-red-500">Error: {error}</div>
    );
  if (!posts.length)
    return <div className="py-12 text-center">No blog posts found.</div>;

  const grid = (
    <div className={`grid gap-8 sm:grid-cols-1 md:grid-cols-${columns} lg:grid-cols-${columns}`.replace(/\d/g, d => columns.toString())}>
      {posts.map((post) => (
        <button
          key={post.id}
          className="block group rounded-2xl transition overflow-hidden hover:bg-blue-50 dark:hover:bg-blue-950/40 focus:bg-blue-100 dark:focus:bg-blue-900/40 w-full text-left"
          onClick={(e) => {
            e.preventDefault();
            router.push(`/blog/${post.id}`);
          }}
        >
          <BlogCard post={post} previewOnly />
        </button>
      ))}
    </div>
  );
  // Center grid for default (3-column) layout, but not for 2-column variant
  return columns === 2 ? grid : <div className="max-w-4xl mx-auto">{grid}</div>;
}
