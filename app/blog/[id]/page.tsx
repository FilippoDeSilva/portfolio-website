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
import ImageLightbox from "@/components/ui/image-lightbox";
import VideoModal from "@/components/ui/video-modal";

export default function BlogDetailPage() {
  const params = useParams();
  const id = params && typeof params.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; name?: string } | null>(null);
  const [videoModal, setVideoModal] = useState<{ open: boolean; src: string; name?: string } | null>(null);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("blogposts")
        .select("id, title, content, cover_image, media_url, media_type, created_at, likes, love, laugh, attachments, view_count")
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
      {lightbox?.open && (
        <ImageLightbox open={lightbox.open} src={lightbox.src} name={lightbox.name} onClose={() => setLightbox(null)} />
      )}
      {videoModal?.open && (
        <VideoModal open={videoModal.open} src={videoModal.src} name={videoModal.name} onClose={() => setVideoModal(null)} />
      )}
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
              {post.content && (
                <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed bg-white/80 dark:bg-zinc-900/70 rounded-xl p-6 shadow-inner border border-border">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              )}
            </div>
            {/* Attachments */}
            {post.attachments && Array.isArray(post.attachments) && post.attachments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {post.attachments.map((att: any, idx: number) => {
                  if (!att?.url) return null;

                  const type: string = att.type || "";
                  const url: string = att.url;
                  const derivedExt = (() => {
                    try {
                      const withoutQuery = url.split("?")[0];
                      const parts = withoutQuery.split(".");
                      return parts.length > 1 ? parts.pop()?.toLowerCase() : undefined;
                    } catch {
                      return undefined;
                    }
                  })();
                  const ext: string | undefined = (att.ext || derivedExt || "").toLowerCase();

                  const isImage = type.startsWith("image");
                  const isVideo = type.startsWith("video");
                  const isAudio = type.startsWith("audio");
                  const isPdf = type === "application/pdf" || ext === "pdf";
                  const isArchive = ["zip", "rar", "7z", "tar", "gz", "bz2", "xz"].includes(ext || "");
                  const isLink = type === "link" || (!type && /^https?:\/\//i.test(url) && !isImage && !isVideo && !isAudio && !isPdf);

                  if (isImage) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        className="flex items-center gap-3 border rounded-lg p-2 bg-muted/30 hover:bg-muted/40 transition w-full"
                        onClick={() => setLightbox({ open: true, src: url, name: att.name })}
                        title={att.name || url}
                      >
                        <img src={url} alt={att.name || `attachment-${idx}`} className="h-20 w-28 object-cover rounded" />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-medium truncate">{att.name || `Image`}</div>
                          <div className="text-xs text-muted-foreground truncate">Click to view</div>
                        </div>
                      </button>
                    );
                  }

                  if (isVideo) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        className="flex items-center gap-3 border rounded-lg p-2 bg-muted/30 hover:bg-muted/40 transition w-full"
                        onClick={() => setVideoModal({ open: true, src: url, name: att.name })}
                        title={att.name || url}
                      >
                        <div className="relative h-20 w-28 rounded overflow-hidden bg-black">
                          <video
                            src={url}
                            muted
                            playsInline
                            loop
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 grid place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white drop-shadow">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-medium truncate">{att.name || `Video`}</div>
                          <div className="text-xs text-muted-foreground truncate">Click to play</div>
                        </div>
                      </button>
                    );
                  }

                  if (isAudio) {
                    return (
                      <audio key={idx} src={url} controls className="w-full max-w-xs border rounded-lg" />
                    );
                  }

                  if (isPdf) {
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 border rounded-lg p-3 bg-muted/30 hover:bg-muted/40 transition w-64"
                        title={att.name || url}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                          <path d="M19.5 2.25h-15A2.25 2.25 0 002.25 4.5v15A2.25 2.25 0 004.5 21.75h15a2.25 2.25 0 002.25-2.25v-15A2.25 2.25 0 0019.5 2.25zM9 8.25h6v1.5H9v-1.5zm0 3h6v1.5H9v-1.5zM9 14.25h6v1.5H9v-1.5z"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{att.name || "View PDF"}</div>
                          <div className="text-xs text-muted-foreground truncate">PDF document</div>
                        </div>
                      </a>
                    );
                  }

                  if (isArchive) {
                    return (
                      <a
                        key={idx}
                        href={url}
                        download
                        className="flex items-center gap-3 border rounded-lg p-3 bg-muted/30 hover:bg-muted/40 transition w-64"
                        title={att.name || url}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-amber-600">
                          <path d="M6 2.25h12A1.75 1.75 0 0119.75 4v16A1.75 1.75 0 0118 21.75H6A1.75 1.75 0 014.25 20V4A1.75 1.75 0 016 2.25zm3.75 3.5h4.5v3h-4.5v-3zm0 4.5h4.5V13h-4.5v-2.75zM12 18.5a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{att.name || `Archive.${ext?.toUpperCase()}`}</div>
                          <div className="text-xs text-muted-foreground truncate">Archive file ({ext?.toUpperCase()})</div>
                        </div>
                      </a>
                    );
                  }

                  if (isLink) {
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 border rounded-lg p-3 bg-muted/30 hover:bg-muted/40 transition w-64"
                        title={att.name || url}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                          <path d="M13.5 3.75h6.75v6.75h-1.5V6.31l-8.72 8.72-1.06-1.06 8.72-8.72h-4.19v-1.5z"/>
                          <path d="M6 5.25h5.25v1.5H6a.75.75 0 00-.75.75v9a.75.75 0 00.75.75h9a.75.75 0 00.75-.75V12.75h1.5V16.5A2.25 2.25 0 0115 18.75H6A2.25 2.25 0 013.75 16.5v-9A2.25 2.25 0 016 5.25z"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{att.name || "Open link"}</div>
                          <div className="text-xs text-muted-foreground truncate">{url}</div>
                        </div>
                      </a>
                    );
                  }

                  // Fallback generic file
                  return (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 border rounded-lg p-3 bg-muted/30 hover:bg-muted/40 transition w-64"
                      title={att.name || url}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-muted-foreground">
                        <path d="M6.75 2.25h6.19c.46 0 .9.18 1.23.51l4.32 4.32c.33.33.51.77.51 1.23v11.19A2.25 2.25 0 0116.75 21.75h-10.5A2.25 2.25 0 013 19.5V4.5A2.25 2.25 0 015.25 2.25h1.5zM13.5 3.94V7.5h3.56L13.5 3.94z"/>
                      </svg>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{att.name || `File${ext ? `.${ext.toUpperCase()}` : ''}`}</div>
                        <div className="text-xs text-muted-foreground truncate">{ext ? `${ext.toUpperCase()} file` : 'File'}</div>
                      </div>
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
          <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-white tracking-tight">Other Posts</h2>
          <BlogList key={post.id} excludeId={post.id} columns={2} />
        </div>
      </div>
    </div>
  </>
);
}
