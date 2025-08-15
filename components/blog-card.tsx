import React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { BlogReactions } from "./blog-reactions";
import { BlogComments } from "./blog-comments";
import MediaModal from "./ui/media-modal";

export type BlogPost = {
  id: string;
  title: string;
  cover_image?: string;
  media_url?: string;
  media_type?: string;
  created_at: string;
  likes?: number;
  love?: number;
  laugh?: number;
  content?: string;
  attachments?: any[];
  view_count?: number;
};

export function BlogCard({
  post,
  previewOnly,
  onEdit,
  onDelete,
}: {
  post: BlogPost;
  previewOnly?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalFile, setModalFile] = React.useState<any>(null);

  // Function to get base filename for thumbnail matching
  const getBase = (s?: string) => {
    if (!s) return '';
    try {
      const u = new URL(s, s.startsWith('http') ? undefined : 'http://local');
      s = u.pathname;
    } catch {}
    const last = s.split('/').pop() || s;
    return (last.includes('.') ? last.substring(0, last.lastIndexOf('.')) : last).toLowerCase();
  };

  // Function to extract text preview from HTML content
  const getContentPreview = (htmlContent: string, maxWords: number = 20) => {
    if (!htmlContent) return "";

    // Strip HTML tags safely without DOM APIs (SSR-safe)
    const text = htmlContent
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();

    const words = text.split(" ");
    if (words.length <= maxWords) return text;

    return words.slice(0, maxWords).join(" ") + "...";
  };

  return (
    <div
      className="group rounded-3xl border border-border bg-gradient-to-br from-background to-muted/40 p-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative"
      style={{ minHeight: 400, height: "100%" }}
    >
      {/* Admin Edit/Delete overlay */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              type="button"
              title="Edit post"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEdit();
              }}
              className="p-1.5 rounded-full bg-background/80 dark:bg-zinc-900/80 border border-border shadow hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 1 1 2.828 2.828L11.828 15.828a2 2 0 0 1-2.828 0L9 13zm-2 6h6"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              title="Delete post"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete();
              }}
              className="p-1.5 rounded-full bg-background/80 dark:bg-zinc-900/80 border border-border shadow hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Determine what to show based on media type and available thumbnails */}
      {(() => {
        // For audio posts, prioritize music thumbnail over everything
        if (post.media_url && post.media_type?.startsWith("audio")) {
          const base = getBase(post.media_url);
          const thumbAtt = (post.attachments || []).find((x: any) => x?.type?.startsWith?.('image') && getBase(x.name || x.url) === base);
          const thumb = thumbAtt?.url as string | undefined;
          
          return (
            <div className="w-full">
              {thumb ? (
                <div className="relative w-full" style={{ height: "44%" }}>
                  <Image
                    src={thumb}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 700px"
                    priority
                  />
                </div>
              ) : post.cover_image ? (
                <div className="relative w-full" style={{ height: "44%" }}>
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 700px"
                    priority
                  />
                </div>
              ) : (
                <div className="relative w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center" style={{ height: "44%" }}>
                  <svg width="64" height="40" viewBox="0 0 64 40" aria-hidden="true" className="text-primary/60">
                    <rect x="8" y="10" width="8" height="20" fill="currentColor" opacity="0.8">
                      <animate attributeName="height" values="10;26;10" dur="1s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="15;7;15" dur="1s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="24" y="5" width="8" height="30" fill="currentColor" opacity="0.7">
                      <animate attributeName="height" values="20;34;20" dur="1.2s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="10;3;10" dur="1.2s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="40" y="12" width="8" height="16" fill="currentColor" opacity="0.8">
                      <animate attributeName="height" values="8;24;8" dur="0.9s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="16;8;16" dur="0.9s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="56" y="8" width="8" height="24" fill="currentColor" opacity="0.6">
                      <animate attributeName="height" values="16;30;16" dur="1.1s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="12;5;12" dur="1.1s" repeatCount="indefinite"/>
                    </rect>
                  </svg>
                </div>
              )}
              <div className="px-4 py-3 bg-muted/30">
                <audio controls preload="metadata" className="w-full themed-audio-player">
                  <source src={post.media_url} type={post.media_type} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          );
        }
        
        // For other media types, use the standard logic
        if (post.media_url && post.media_type?.startsWith("image")) {
          return (
            <div className="relative w-full" style={{ height: "44%" }}>
              <Image
                src={post.media_url}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 700px"
                priority
              />
            </div>
          );
        }
        
        if (post.media_url && post.media_type?.startsWith("video")) {
          return (
            <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden">
              <video 
                controls 
                preload="metadata" 
                playsInline 
                className="w-full h-full object-cover rounded-none themed-video-player"
              >
                <source src={post.media_url} type={post.media_type} />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }
        
        if (post.media_url && post.media_type === "application/pdf") {
          return (
            <a
              href={post.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full aspect-[16/9] bg-muted items-center justify-center hover:bg-primary/10 transition"
            >
              <span className="text-primary font-semibold text-lg flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                View PDF
              </span>
            </a>
          );
        }
        
        // Fallback to cover image if no media_url
        if (post.cover_image) {
          return (
            <div className="relative w-full" style={{ height: "44%" }}>
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 700px"
                priority
              />
            </div>
          );
        }
        
        return null;
      })()}

      {/* Content */}
      <div
        className="p-6 flex flex-col flex-1 min-h-0 justify-between"
        style={{ flex: 1, minHeight: 0 }}
      >
        <div>
          <h3 className="text-base font-bold text-primary dark:text-primary break-words">
            {post.title}
          </h3>
          {post.content && (
            <p className="text-muted-foreground mt-2 mb-2 line-clamp-3">
              {getContentPreview(post.content, 25)}
            </p>
          )}
          {!previewOnly && post.content && (
            <div
              className="prose prose-neutral max-w-none mb-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Attachments */}
          {!previewOnly &&
            post.attachments &&
            Array.isArray(post.attachments) &&
            post.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Attachments</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {post.attachments.map((file: any, idx: number) => (
                    <button
                      key={idx}
                      className="border rounded p-2 flex flex-col items-center text-xs bg-muted/30 focus:outline-none hover:shadow-lg transition"
                      onClick={() => {
                        setModalFile(file);
                        setModalOpen(true);
                      }}
                      type="button"
                      title={file.name}
                    >
                      {file.type?.startsWith("image") ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-24 h-24 object-cover mb-1 rounded"
                        />
                      ) : file.type?.startsWith("video") ? (
                        <video
                          src={file.url}
                          className="w-24 h-24 mb-1 rounded"
                        />
                      ) : file.type === "application/pdf" ? (
                        <span className="text-blue-600 underline">PDF</span>
                      ) : file.type?.startsWith("audio") ? (
                        <span className="text-blue-600 underline">Audio</span>
                      ) : (
                        <span className="text-blue-600 underline">
                          {file.ext?.toUpperCase() || "File"}
                        </span>
                      )}
                      <span className="truncate w-full text-center">
                        {file.name}
                      </span>
                    </button>
                  ))}
                </div>
                <MediaModal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  file={modalFile}
                />
              </div>
            )}

          {/* Reactions & Comments */}
          {!previewOnly && (
            <>
              <BlogReactions
                postId={post.id}
                initialReactions={{
                  likes: post.likes || 0,
                  love: post.love || 0,
                  laugh: post.laugh || 0,
                }}
              />
              <BlogComments postId={post.id} />
            </>
          )}
        </div>

        {/* Timestamp and View Count always bottom right */}
        <div className="flex items-end justify-end pt-2 gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
            {post.view_count ?? 0}
          </span>
          <span className="text-xs text-muted-foreground italic">
            {new Date(post.created_at).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
