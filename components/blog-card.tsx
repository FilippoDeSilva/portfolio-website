import React from "react";
import Image from "next/image";
import { Trash2, Edit3, Eye, Clock, FileText, Play, Music, Image as ImageIcon, Video, File } from "lucide-react";
import { motion } from "framer-motion";
import { BlogReactions } from "./blog-reactions";
import BlogComments from "./blog-comments";
import MediaModal from "./ui/media-modal";

export type BlogPost = {
  fire: number;
  wow: number;
  coffee: number;
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

  // Get media type icon
  const getMediaIcon = () => {
    if (!post.media_type) return null;
    
    if (post.media_type.startsWith("audio")) {
      return <Music className="w-5 h-5 text-blue-500" />;
    } else if (post.media_type.startsWith("video")) {
      return <Video className="w-5 h-5 text-purple-500" />;
    } else if (post.media_type.startsWith("image")) {
      return <ImageIcon className="w-5 h-5 text-green-500" />;
    } else if (post.media_type === "application/pdf") {
      return <File className="w-5 h-5 text-red-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInHours * 60);
        return `${diffInMinutes}m ago`;
      }
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full"
      style={{ minHeight: previewOnly ? 400 : "auto" }}
    >
      {/* Admin Edit/Delete overlay */}
      {(onEdit || onDelete) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          {onEdit && (
            <button
              type="button"
              title="Edit post"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEdit();
              }}
              className="p-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 hover:scale-105"
            >
              <Edit3 className="w-5 h-5" />
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
              className="p-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      )}

      {/* Media Section */}
      <div className="relative w-full overflow-hidden">
        {(() => {
          // For audio posts, prioritize music thumbnail over everything
          if (post.media_url && post.media_type?.startsWith("audio")) {
            const base = getBase(post.media_url);
            const thumbAtt = (post.attachments || []).find((x: any) => x?.type?.startsWith?.('image') && getBase(x.name || x.url) === base);
            const thumb = thumbAtt?.url as string | undefined;
            
            return (
              <div className="w-full">
                {thumb ? (
                  <div className="relative w-full aspect-[16/9] sm:aspect-[4/3]">
                    <Image
                      src={thumb}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                      {getMediaIcon()}
                    </div>
                  </div>
                ) : post.cover_image ? (
                  <div className="relative w-full aspect-[16/9] sm:aspect-[4/3]">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                      {getMediaIcon()}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <div className="text-center">
                      <Music className="w-16 h-16 text-blue-400 dark:text-blue-300 mx-auto mb-3" />
                      <p className="text-blue-600 dark:text-blue-300 font-medium">Audio Post</p>
                    </div>
                  </div>
                )}
                <div className="px-4 py-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm">
                  <audio controls preload="metadata" className="w-full h-12 rounded-xl themed-audio-player">
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
              <div className="relative w-full aspect-[16/9] sm:aspect-[4/3]">
                <Image
                  src={post.media_url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  {getMediaIcon()}
                </div>
              </div>
            );
          }
          
          if (post.media_url && post.media_type?.startsWith("video")) {
            return (
              <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-t-3xl">
                <video 
                  controls 
                  preload="metadata" 
                  playsInline 
                  className="w-full h-full object-cover themed-video-player"
                >
                  <source src={post.media_url} type={post.media_type} />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  {getMediaIcon()}
                </div>
              </div>
            );
          }
          
          if (post.media_url && post.media_type === "application/pdf") {
            return (
              <a
                href={post.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full aspect-[16/9] sm:aspect-[4/3] bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 items-center justify-center hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/40 dark:hover:to-red-700/40 transition-all duration-300 group-hover:scale-105"
              >
                <div className="text-center">
                  <File className="w-16 h-16 text-red-500 mx-auto mb-3" />
                  <span className="text-red-600 dark:text-red-400 font-semibold text-lg">View PDF</span>
                </div>
              </a>
            );
          }
          
          // Fallback to cover image if no media_url
          if (post.cover_image) {
            return (
              <div className="relative w-full aspect-[16/9] sm:aspect-[4/3]">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            );
          }
          
          return (
            <div className="w-full aspect-[16/9] sm:aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Blog Post</p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Content Section */}
      <div className="p-6 sm:p-8 flex flex-col flex-1 min-h-0 justify-between">
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>

          {/* Content Preview */}
          {post.content && (
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
              {getContentPreview(post.content, previewOnly ? 20 : 40)}
            </p>
          )}

          {/* Full Content (when not preview) */}
          {!previewOnly && post.content && (
            <div
              className="prose prose-neutral dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Attachments Grid */}
          {!previewOnly &&
            post.attachments &&
            Array.isArray(post.attachments) &&
            post.attachments.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Attachments</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {post.attachments.map((file: any, idx: number) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group/attachment border border-gray-200/60 dark:border-gray-700/60 rounded-xl p-3 flex flex-col items-center text-xs bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm focus:outline-none hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200"
                      onClick={() => {
                        setModalFile(file);
                        setModalOpen(true);
                      }}
                      type="button"
                      title={file.name}
                    >
                      {file.type?.startsWith("image") ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-lg overflow-hidden">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover group-hover/attachment:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ) : file.type?.startsWith("video") ? (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Play className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                        </div>
                      ) : file.type === "application/pdf" ? (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <File className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                      ) : file.type?.startsWith("audio") ? (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Music className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                      <span className="truncate w-full text-center text-gray-700 dark:text-gray-300 font-medium">
                        {file.name}
                      </span>
                    </motion.button>
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
            <div className="space-y-6">
              <BlogReactions
                postId={post.id}
                initialReactions={{
                  likes: post.likes || 0,
                  love: post.love || 0,
                  laugh: post.laugh || 0,
                  fire: post.fire || 0,
                  wow: post.wow || 0,
                  coffee: post.coffee || 0,
                }}
              />
              <BlogComments postId={post.id} />
            </div>
          )}
        </div>

        {/* Footer - Timestamp and View Count */}
        <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{post.view_count ?? 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
