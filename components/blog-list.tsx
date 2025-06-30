"use client"

import { useEffect, useState } from "react";
import { BlogCard, BlogPost } from "./blog-card";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

const POSTS_PER_PAGE = 9;

export function BlogList({
  excludeId,
  columns = 3,
  currentPage = 1,
  onDataLoaded,
}: {
  excludeId?: string;
  columns?: number;
  currentPage?: number;
  onDataLoaded: (totalPosts: number) => void;
}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("blogposts")
        .select(
          "id, title, excerpt, cover_image, media_url, media_type, created_at, likes, love, laugh, view_count",
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        setError(error.message);
        setPosts([]);
      } else if (data) {
        let filtered = data as BlogPost[];
        if (excludeId) filtered = filtered.filter((p) => p.id !== excludeId);
        setPosts(filtered);
        onDataLoaded(count || 0);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [excludeId, currentPage, onDataLoaded]);

  if (loading)
    return <div className="py-12 text-center">Loading blog posts...</div>;
  if (error)
    return (
      <div className="py-12 text-center text-red-500">Error: {error}</div>
    );
  if (!posts.length)
    return <div className="py-12 text-center">No blog posts found.</div>;

  const grid = (
    <div className={`grid gap-8 sm:grid-cols-1 md:grid-cols-${columns} lg:grid-cols-${columns}`}>
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
  
  return columns === 2 ? grid : <div className="max-w-4xl mx-auto">{grid}</div>;
}
