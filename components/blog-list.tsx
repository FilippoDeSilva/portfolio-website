"use client"

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogCard, BlogPost } from "./blog-card";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Calendar, TrendingUp, FileText, Search, Filter, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const POSTS_PER_PAGE = 9;

// Memoized blog card component to prevent unnecessary re-renders
const MemoizedBlogCard = memo(({ post, viewMode }: { post: BlogPost; viewMode: "grid" | "list" }) => {
  const router = useRouter();
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/blog/${post.id}`);
  }, [post.id, router]);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="group cursor-pointer"
        onClick={handleClick}
      >
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
          <div className="flex gap-6">
            {/* Thumbnail - Hidden on small screens */}
            <div className="hidden sm:block w-32 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex-shrink-0 overflow-hidden">
              {post.cover_image ? (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {post.title}
              </h3>
              {post.content && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 mb-3">
                  {getContentPreview(post.content, 25)}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {post.view_count ?? 0} views
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <BlogCard post={post} previewOnly />
    </motion.div>
  );
});

MemoizedBlogCard.displayName = "MemoizedBlogCard";

// // Memoized search input component
// const SearchInput = memo(({ 
//   searchTerm, 
//   onSearchChange 
// }: { 
//   searchTerm: string; 
//   onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }) => (
//   <div className="relative flex-1 max-w-md">
//     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//     <Input
//       type="text"
//       placeholder="Search posts..."
//       value={searchTerm}
//       onChange={onSearchChange}
//       className="pl-10 pr-4 h-12 rounded-xl"
//     />
//   </div>
// ));

// SearchInput.displayName = "SearchInput";

// Memoized filter controls component
const FilterControls = memo(({ 
  sortBy, 
  viewMode, 
  onSortChange, 
  onViewModeChange 
}: { 
  sortBy: "newest" | "oldest" | "popular";
  viewMode: "grid" | "list";
  onSortChange: (sort: "newest" | "oldest" | "popular") => void;
  onViewModeChange: (mode: "grid" | "list") => void;
}) => (
  <div className="flex items-center gap-3">
    {/* Sort Dropdown */}
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as "newest" | "oldest" | "popular")}
        className="appearance-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 font-medium"
      >
        <option value="newest">✨ Newest First</option>
        <option value="oldest">📅 Oldest First</option>
        <option value="popular">🔥 Most Popular</option>
      </select>
      <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>

    {/* View Mode Toggle - Hidden on small screens */}
    <div className="hidden sm:flex bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className="h-8 px-3 rounded-md transition-all duration-200"
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className="h-8 px-3 rounded-md transition-all duration-200"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  </div>
));

FilterControls.displayName = "FilterControls";

export function BlogList({
  excludeId,
  columns = 3,
  currentPage = 1,
  onDataLoaded,
  searchTerm: externalSearchTerm = "",
  sortBy: externalSortBy = "newest",
  viewMode: externalViewMode = "grid",
  showControls = true,
  postsPerPage
}: {
  excludeId?: string;
  columns?: number;
  currentPage?: number;
  onDataLoaded?: (totalPosts: number) => void;
  searchTerm?: string;
  sortBy?: "newest" | "oldest" | "popular";
  viewMode?: "grid" | "list";
  showControls?: boolean;
  postsPerPage?: number;
}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Internal state for when controls are shown
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const [internalSortBy, setInternalSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const [internalViewMode, setInternalViewMode] = useState<"grid" | "list">("grid");
  
  // Use external props when controls are hidden, internal state when shown
  const searchTerm = showControls ? internalSearchTerm : externalSearchTerm;
  const sortBy = showControls ? internalSortBy : externalSortBy;
  const viewMode = showControls ? internalViewMode : externalViewMode;
  
  const router = useRouter();
  
  // Stable event handlers that don't cause re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearchTerm(e.target.value);
  }, []);

  const handleSortChange = useCallback((newSort: "newest" | "oldest" | "popular") => {
    setInternalSortBy(newSort);
  }, []);

  const handleViewModeChange = useCallback((newMode: "grid" | "list") => {
    setInternalViewMode(newMode);
  }, []);

  // Real-time subscription for new posts
  useEffect(() => {
    const channel = supabase
      .channel('blog-posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blogposts'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newPost = payload.new as BlogPost;
            setPosts(prevPosts => {
              // Check if post already exists to avoid duplicates
              if (prevPosts.some(post => post.id === newPost.id)) {
                return prevPosts;
              }
              // Add new post at the beginning for newest-first sorting
              return sortBy === 'newest' ? [newPost, ...prevPosts] : [...prevPosts, newPost];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedPost = payload.new as BlogPost;
            setPosts(prevPosts => 
              prevPosts.map(post => 
                post.id === updatedPost.id ? updatedPost : post
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts(prevPosts => 
              prevPosts.filter(post => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sortBy]);

  // Fetch posts with optimized query
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      
      try {
        const from = (currentPage - 1) * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;

        let query = supabase
          .from("blogposts")
          .select(
            "id, title, content, cover_image, media_url, media_type, created_at, likes, love, laugh, view_count",
            { count: "exact" }
          );

        // Apply search filter server-side for better performance
        if (searchTerm.trim()) {
          query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
        }

        // Apply sorting
        switch (sortBy) {
          case "newest":
            query = query.order("created_at", { ascending: false });
            break;
          case "oldest":
            query = query.order("created_at", { ascending: true });
            break;
          case "popular":
            query = query.order("view_count", { ascending: false });
            break;
        }

        const { data, error, count } = await query.range(from, to);

        if (error) {
          throw error;
        }
        
        if (data) {
          let filtered = data as BlogPost[];
          if (excludeId) filtered = filtered.filter((p) => p.id !== excludeId);
          setPosts(filtered);
          if (onDataLoaded) onDataLoaded(count || 0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, [excludeId, currentPage, onDataLoaded, searchTerm, sortBy]);

  // Memoize filtered posts to prevent unnecessary recalculations
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    
    return posts.filter(post => {
      const searchLower = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        (post.content && post.content.toLowerCase().includes(searchLower))
      );
    });
  }, [posts, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Modern Grid Skeleton */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? (columns === 2 
                ? 'sm:grid-cols-1 md:grid-cols-2' 
                : 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4')
            : 'grid-cols-1'
        }`}>
          {[...Array(POSTS_PER_PAGE)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="animate-pulse"
            >
              {viewMode === "grid" ? (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg flex flex-col h-[420px] overflow-hidden">
                  <div className="h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                  <div className="p-6 flex-1 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <div className="w-8 h-8 text-red-500">⚠️</div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try again
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!filteredPosts.length && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-16 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 flex items-center justify-center">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {searchTerm ? 'No posts found' : 'No blog posts yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {searchTerm 
              ? 'Try adjusting your search terms or browse all posts' 
              : 'Check back soon for new content!'}
          </p>
          {searchTerm && (
            <Button 
              variant="outline" 
              className="mt-6" 
              onClick={() => window.location.reload()}
            >
              View All Posts
            </Button>
          )}
        </div>
      </motion.div>
    );
  }


  return (
    <div className="space-y-8">
      {/* Search and Filter Controls - Only show when showControls is true */}
      {showControls && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-gray-200/60 dark:border-gray-700/60 py-4 mb-6 shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            {/* <SearchInput 
              searchTerm={searchTerm} 
              onSearchChange={handleSearchChange} 
            /> */}

            {/* Filter and View Controls */}
            <FilterControls 
              sortBy={sortBy} 
              viewMode={viewMode} 
              onSortChange={handleSortChange} 
              onViewModeChange={handleViewModeChange} 
            />
          </div>
        </motion.div>
      )}

      {/* Posts Grid/List */}
      <div>
        {viewMode === "grid" ? (
          <div className={`grid gap-6 ${
            columns === 2 
              ? 'sm:grid-cols-1 md:grid-cols-2' 
              : 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {filteredPosts.map((post) => (
              <MemoizedBlogCard 
                key={post.id}
                post={post} 
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <MemoizedBlogCard 
                key={post.id}
                post={post} 
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get content preview
function getContentPreview(htmlContent: string, maxWords: number = 30) {
  if (!htmlContent) return "";

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
}

// Helper function to format date
function formatDate(dateString: string) {
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
}
