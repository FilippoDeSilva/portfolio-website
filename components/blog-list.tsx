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
  onDataLoaded?: (totalPosts: number) => void;
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
        if (onDataLoaded) onDataLoaded(count || 0);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [excludeId, currentPage, onDataLoaded]);

  if (loading)
    return (
      <div className="py-12 text-center">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 max-w-4xl mx-auto">
          {[...Array(POSTS_PER_PAGE)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-border bg-gradient-to-br from-background to-muted/40 shadow-lg flex flex-col h-[400px] p-6"
            >
              <div className="h-40 w-full bg-muted/60 rounded-xl mb-4" />
              <div className="h-6 w-2/3 bg-muted/50 rounded mb-2" />
              <div className="h-4 w-1/2 bg-muted/40 rounded mb-4" />
              <div className="flex-1" />
              <div className="h-4 w-1/3 bg-muted/30 rounded mt-4" />
            </div>
          ))}
        </div>
        {/* <div className="mt-8 text-muted-foreground text-base font-medium">Loading blog posts...</div> */}
      </div>
    );
  if (error)
    return (
      <div className="py-12 text-center text-red-500">Error: {error}</div>
    );
  if (!posts.length)
    return (
      <div className="py-12 text-center flex flex-col items-center gap-4">
        <svg className="w-12 h-12 text-muted-foreground mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <div className="text-lg font-semibold text-muted-foreground">No blog posts found.</div>
        <div className="text-sm text-muted-foreground">Check back soon for new content!</div>
      </div>
    );

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
