"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BlogCard, BlogPost } from "@/components/blog-card";
import { useParams } from "next/navigation";
import TitleBar from "@/components/titlebar";
import { BlogComments } from "@/components/blog-comments";
import { BlogReactions } from "@/components/blog-reactions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogList } from "@/components/blog-list";
import Image from "next/image";

export default function BlogDetailPage() {
  const params = useParams();
  const id = params && typeof params.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("blogposts")
        .select("id, title, excerpt, content, cover_image, media_url, media_type, created_at, likes, love, laugh, attachments, view_count")
        .eq("id", id)
        .single();
      if (error) {
        setError(error.message);
        setPost(null);
      } else if (data) {
        setPost(data as BlogPost);
      }
      setLoading(false);
    }
    if (id) fetchPost();
  }, [id]);

  // Increment view count after post is loaded and update in real time
  useEffect(() => {
    if (!post?.id) return;
    // Increment view count
    supabase.rpc('increment_view_count', { post_id: post.id }).then(() => {
      // Fetch the updated view_count only
      supabase
        .from('blogposts')
        .select('view_count')
        .eq('id', post.id)
        .single()
        .then(({ data }) => {
          if (data && typeof data.view_count === 'number') {
            setPost((prev) => prev ? { ...prev, view_count: data.view_count } : prev);
          }
        });
    });
  }, [post?.id]);

  if (loading) return (
    <div className="py-24 flex flex-col items-center gap-8 animate-fade-in">
      <div className="max-w-3xl w-full mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-background/90 to-blue-50/60 dark:to-blue-950/40 shadow-xl border border-border p-0 flex flex-col gap-0 overflow-hidden relative">
          {/* Cover Image Skeleton */}
          <div className="relative w-full bg-gray-200 dark:bg-zinc-800 overflow-hidden animate-pulse" style={{ height: 360, maxHeight: 480 }}>
            <div className="w-full h-full bg-muted/60" />
          </div>
          <div className="p-6 flex flex-col gap-6">
            {/* Title Skeleton */}
            <div className="h-10 w-2/3 bg-muted/40 rounded mb-4 animate-pulse" />
            {/* Excerpt Skeleton */}
            <div className="h-5 w-1/2 bg-muted/30 rounded mb-6 animate-pulse" />
            {/* Content Skeleton */}
            <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed bg-white/80 dark:bg-zinc-900/70 rounded-xl p-6 shadow-inner border border-border">
              <div className="h-4 w-full bg-muted/20 rounded mb-2 animate-pulse" />
              <div className="h-4 w-5/6 bg-muted/20 rounded mb-2 animate-pulse" />
              <div className="h-4 w-2/3 bg-muted/20 rounded mb-2 animate-pulse" />
              <div className="h-4 w-1/2 bg-muted/20 rounded mb-2 animate-pulse" />
              <div className="h-4 w-1/3 bg-muted/20 rounded mb-2 animate-pulse" />
            </div>
            {/* Attachments Skeleton */}
            <div className="flex gap-4 mt-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="w-32 h-24 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
            {/* Reactions & Comments Skeleton */}
            <div className="flex gap-4 mt-8">
              <div className="w-24 h-8 bg-muted/20 rounded-full animate-pulse" />
              <div className="w-32 h-8 bg-muted/20 rounded-full animate-pulse" />
            </div>
            {/* Timestamp & View Count Skeleton */}
            <div className="flex items-end justify-end mt-4 gap-3">
              <div className="h-4 w-16 bg-muted/20 rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
        {/* Other Posts Skeleton */}
        <div className="max-w-4xl mx-auto mt-8 rounded-2xl bg-gradient-to-br from-blue-50/60 via-background/80 to-blue-100/40 dark:from-blue-950/40 dark:via-background/80 dark:to-blue-900/30 shadow-lg border border-border p-8">
          <div className="h-8 w-40 bg-muted/30 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-40 bg-muted/20 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return <div className="py-24 text-center text-red-500">Error: {error}</div>;
  if (!post) return <div className="py-24 text-center">Blog post not found.</div>;

return (
  <>
    <TitleBar title={post?.title || "Blog Post"} />
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/40 py-16 px-2 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-background/90 to-blue-50/60 dark:to-blue-950/40 shadow-xl border border-border p-0 flex flex-col gap-0 overflow-hidden relative">
          {/* Back Arrow */}
          <div className="absolute top-4 left-4 z-10">
            <Link href="/blog">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 dark:bg-zinc-900/80 shadow border border-border transition-all duration-200 hover:bg-blue-100/80 dark:hover:bg-blue-800/60 hover:scale-105 focus:scale-105 hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-400 hover:shadow-xl focus:shadow-xl"
                aria-label="Back to blog"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
          </div>
          {/* Cover Image */}
          <div className="relative w-full bg-gray-200 dark:bg-zinc-800 overflow-hidden" style={{ height: 360, maxHeight: 480 }}>
            {post.cover_image && (
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 700px"
                priority
              />
            )}
          </div>
          <div className="p-6 flex flex-col gap-6">
            {/* Post Title, Excerpt, and Content */}
            <div className="space-y-4">
              <h1 className="text-primary dark:text-primary text-4xl font-extrabold leading-tight mb-2 drop-shadow-sm">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 mb-2">
                {post.excerpt && <p className="text-lg text-muted-foreground font-medium m-0">{post.excerpt}</p>}
              </div>
              {post.content && (
                <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed bg-white/80 dark:bg-zinc-900/70 rounded-xl p-6 shadow-inner border border-border">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              )}
            </div>
            {/* Attachments */}
            {post.attachments && Array.isArray(post.attachments) && post.attachments.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {post.attachments.map((att: any, idx: number) => {
                  if (!att?.url) return null;
                  if (att.type?.startsWith("image")) {
                    return (
                      <img
                        key={idx}
                        src={att.url}
                        alt={att.name || `attachment-${idx}`}
                        className="rounded-lg max-h-48 max-w-xs object-cover border"
                      />
                    );
                  }
                  if (att.type?.startsWith("video")) {
                    return (
                      <video
                        key={idx}
                        src={att.url}
                        controls
                        className="rounded-lg max-h-48 max-w-xs border"
                      />
                    );
                  }
                  if (att.type?.startsWith("audio")) {
                    return (
                      <audio
                        key={idx}
                        src={att.url}
                        controls
                        className="w-full"
                      />
                    );
                  }
                  // fallback for other types (e.g. PDF)
                  return (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary"
                    >
                      {att.name || att.url}
                    </a>
                  );
                })}
              </div>
            )}
            {/* Reactions Section */}
            <BlogReactions postId={post.id} initialReactions={{ likes: post.likes || 0, love: post.love || 0, laugh: post.laugh || 0 }} />
            {/* Comments Section */}
            <div className="pt-8">
              <BlogComments postId={post.id} />
            </div>
            {/* Timestamp and View Count always bottom right */}
            <div className="flex items-end justify-end mt-4 gap-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                {post.view_count ?? 0}
              </span>
              <span className="text-xs text-muted-foreground italic">
                {post.created_at ? new Date(post.created_at).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ''}
              </span>
            </div>
          </div>
        </div>
        {/* Other Posts Section */}
        <div className="max-w-4xl mx-auto mt-8 rounded-2xl bg-gradient-to-br from-blue-50/60 via-background/80 to-blue-100/40 dark:from-blue-950/40 dark:via-background/80 dark:to-blue-900/30 shadow-lg border border-border p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300 tracking-tight">Other Posts</h2>
          <BlogList key={post.id} excludeId={post.id} columns={2} />
        </div>
      </div>
    </div>
  </>
);
}
