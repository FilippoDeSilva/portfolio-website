"use client";

import { useEffect, useMemo, useRef, useState, useCallback, memo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  CornerUpLeft,
  Check,
  X,
  Heart,
  Flame,
  Lightbulb,
  Laugh,
  MessageCircle,
  Clock,
  User,
  MoreHorizontal,
  ThumbsUp
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface Comment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
  name?: string;
  user_id?: string;
  reactions?: { [key: string]: number };
}

type ReactionKey = "like" | "love" | "fire" | "idea" | "lol";

const REACTIONS: { 
  key: ReactionKey; 
  // label: string; 
  Icon: any; 
  color: string;
  bgColor: string;
  borderColor: string;
  hoverColor: string;
  activeColor: string;
}[] = [
  { 
    key: "like", 
    // label: "Like", 
    Icon: ThumbsUp, 
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
    activeColor: "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700"
  },
  { 
    key: "love", 
    // label: "Love", 
    Icon: Heart, 
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "border-pink-200 dark:border-pink-800",
    hoverColor: "hover:bg-pink-100 dark:hover:bg-pink-900/50",
    activeColor: "bg-pink-100 dark:bg-pink-900/50 border-pink-300 dark:border-pink-700"
  },
  { 
    key: "fire", 
    // label: "Fire", 
    Icon: Flame, 
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    hoverColor: "hover:bg-orange-100 dark:hover:bg-orange-900/50",
    activeColor: "bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700"
  },
  { 
    key: "idea", 
    // label: "Idea", 
    Icon: Lightbulb, 
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    hoverColor: "hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
    activeColor: "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700"
  },
  { 
    key: "lol", 
    // label: "LOL", 
    Icon: Laugh, 
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    hoverColor: "hover:bg-green-100 dark:hover:bg-green-900/50",
    activeColor: "bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700"
  },
];

/** Stable, random-ish avatar per user using DiceBear "bottts-neutral" */
function getAvatarSeed(userId: string | null) {
  if (typeof window === "undefined") return "guest";
  let seed = localStorage.getItem("blogAvatarSeed");
  if (!seed) {
    seed = (userId || uuidv4()) + "-" + Math.random().toString(36).slice(2);
    localStorage.setItem("blogAvatarSeed", seed);
  }
  return seed;
}

function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(
    seed
  )}&radius=50&mouth=smile,smile02&eyes=frame01,frame02&backgroundType=gradientLinear`;
}



// Stable input components that won't re-render
const StableCommentInput = memo(({ 
  value, 
  onChange, 
  placeholder, 
  inputRef 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) => (
  <Textarea
    ref={inputRef}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="flex-1 min-h-[44px] rounded-xl focus:ring-1 focus:ring-blue-500"
    rows={3}
  />
));

StableCommentInput.displayName = "StableCommentInput";

const StableUsernameInput = memo(({ 
  value, 
  onChange, 
  inputRef 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => (
  <Input
    ref={inputRef}
    value={value}
    onChange={onChange}
    placeholder="Enter a display name"
    className="sm:flex-1 rounded-md"
  />
));

StableUsernameInput.displayName = "StableUsernameInput";

const StableEditInput = memo(({
  value,
  onChange,
  inputRef
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) => {
  // Auto-resize the textarea to fit content
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    onChange(e);
  };

  // Set initial height on mount
  const setInitialHeight = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
      if (inputRef) {
        // @ts-ignore - We know the types match
        inputRef.current = el;
      }
    }
  };

  return (
    <Textarea
      ref={setInitialHeight}
      value={value}
      onChange={handleChange}
      className="flex-1 min-h-[100px] w-full resize-none overflow-hidden rounded-xl"
      placeholder="Update your comment…"
      style={{ minHeight: '100px' }}
    />
  );
});

StableEditInput.displayName = "StableEditInput";

// Create a completely isolated comment input component
const IsolatedCommentInput = memo(({
  initialValue = "",
  onSubmit,
  onCancel,
  placeholder,
  submitText = "Post",
  showCancel = false
}: {
  initialValue?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder: string;
  submitText?: string;
  showCancel?: boolean;
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
      // Focus back to input after submission
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [value, onSubmit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const handleCancel = useCallback(() => {
    setValue("");
    if (onCancel) onCancel();
  }, [onCancel]);

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="relative w-full">
        <Textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full min-h-[100px] rounded-xl pr-24"
          rows={3}
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <Button 
            type="submit" 
            size="sm" 
            className="h-8 px-3 rounded-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Send size={16} className="mr-1" /> {submitText}
          </Button>
          {showCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-8 px-3 rounded-lg font-medium"
            >
              <X size={16} className="mr-1" /> Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
});

IsolatedCommentInput.displayName = "IsolatedCommentInput";

export default function BlogComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingComment, setPendingComment] = useState<{ content: string; replyTo: string | null } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showReplies, setShowReplies] = useState<Set<string>>(new Set());

  const scrollRef = useRef<HTMLUListElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const avatarSeed = useMemo(() => getAvatarSeed(userId), [userId]);
  const avatarUrl = useMemo(() => getAvatarUrl(avatarSeed), [avatarSeed]);

  // Modern responsive theme classes
  const themeClasses = {
    container: "max-w-4xl mx-auto",
    card: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg hover:shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200/60 dark:border-gray-800/60 transition-all duration-300",
    username: "font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base",
    date: "text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1",
    content: "prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed",
    actions: "flex flex-wrap items-center gap-2 mt-3 text-sm",
    reactionBtn: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105",
    button: "px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95",
  };

  // Stable event handlers that don't cause re-renders
  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  }, []);

  const handleEditContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
  }, []);

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const handleReplyClick = useCallback((commentId: string) => {
    setReplyTo(commentId);
    // Use a longer delay to ensure the input is fully rendered
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 200);
  }, []);

  const handleToggleReplies = useCallback((commentId: string) => {
    setShowReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyTo(null);
    setComment("");
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditContent("");
  }, []);

  const handleCancelUsername = useCallback(() => {
    setShowNamePrompt(false);
    setPendingComment(null);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUserId(data.user.id);
        localStorage.setItem("blogUserId", data.user.id);
      } else {
        let localId = localStorage.getItem("blogUserId");
        if (!localId) {
          localId = uuidv4();
          localStorage.setItem("blogUserId", localId);
        }
        setUserId(localId);
      }
    });

    const storedName = localStorage.getItem("blogUserName");
    if (storedName) setUsername(storedName);
  }, []);

  useEffect(() => {
    fetchComments();

    // Real-time updates with proper error handling
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "comments", 
          filter: `post_id=eq.${postId}` 
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          
          if (payload.eventType === "INSERT") {
            setComments(prev => {
              // Avoid duplicates - check if this is our own optimistic update or already exists
              if (prev.some(c => c.id === payload.new.id || c.id.startsWith('temp-'))) return prev;
              return [...prev, payload.new as Comment].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            });
          } else if (payload.eventType === "UPDATE") {
            setComments(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
          } else if (payload.eventType === "DELETE") {
            setComments(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe((status, err) => {
        console.log("Subscription status:", status);
        if (err) console.error("Subscription error:", err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  async function fetchComments() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
        setError(error.message);
        setComments([]);
      } else {
        console.log("Fetched comments:", data);
        setComments(data || []);
      }
    } catch (err) {
      console.error("Exception fetching comments:", err);
      setError("Failed to fetch comments");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  // Handle comment submission from isolated input
  const handleCommentSubmit = useCallback(async (content: string) => {
    if (!userId) return setError("You must be identified to comment.");
    if (!username) {
      setShowNamePrompt(true);
      setPendingComment({ content, replyTo });
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const payload = {
      post_id: postId,
      content,
      parent_id: replyTo,
      user_id: userId,
      name: username,
      reactions: {},
    };

    // Optimistic update - add comment immediately
    const optimisticComment: Comment = {
      id: tempId,
      post_id: postId,
      content,
      parent_id: replyTo,
      user_id: userId,
      name: username,
      created_at: new Date().toISOString(),
      reactions: {},
    };

    setComments(prev => {
      // Check if comment already exists to prevent duplicates
      if (prev.some(c => c.id === tempId)) return prev;
      return [...prev, optimisticComment];
    });

    try {
      // Insert comment
      const { data, error } = await supabase.from("comments").insert([payload]).select();
      
      if (error) {
        console.error("Error inserting comment:", error);
        setError("Failed to add comment: " + error.message);
        // Remove optimistic comment on error
        setComments(prev => prev.filter(c => c.id !== tempId));
      } else {
        console.log("Comment inserted successfully:", data);
        // Replace optimistic comment with real one
        if (data && data[0]) {
          setComments(prev => {
            // Remove the optimistic comment and add the real one, avoiding duplicates
            const filtered = prev.filter(c => c.id !== tempId);
            const realComment = data[0] as Comment;
            // Check if real comment already exists from real-time subscription
            if (filtered.some(c => c.id === realComment.id)) {
              return filtered;
            }
            return [...filtered, realComment].sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
        } else {
          // If no data returned, refetch to ensure sync
          setTimeout(fetchComments, 500);
        }
        
        // Auto-show replies for new comments
        if (replyTo) {
          setShowReplies(prev => new Set([...prev, replyTo]));
        }
        // Clear reply state after successful submission
        setReplyTo(null);
        // Smooth scroll to new comment
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
      }
    } catch (err) {
      console.error("Exception inserting comment:", err);
      setError("Failed to add comment");
      // Remove optimistic comment on error
      setComments(prev => prev.filter(c => c.id !== tempId));
    }
  }, [userId, username, postId, replyTo]);

  // Handle reply submission from isolated input
  const handleReplySubmit = useCallback(async (content: string) => {
    if (!userId) return setError("You must be identified to comment.");
    if (!username) return setError("You must set a display name.");

    const tempId = `temp-reply-${Date.now()}`;
    const payload = {
      post_id: postId,
      content,
      parent_id: replyTo,
      user_id: userId,
      name: username,
      reactions: {},
    };

    // Optimistic update - add reply immediately
    const optimisticReply: Comment = {
      id: tempId,
      post_id: postId,
      content,
      parent_id: replyTo,
      user_id: userId,
      name: username,
      created_at: new Date().toISOString(),
      reactions: {},
    };

    setComments(prev => [...prev, optimisticReply]);

    try {
      // Insert reply
      const { data, error } = await supabase.from("comments").insert([payload]).select();
      
      if (error) {
        console.error("Error inserting reply:", error);
        setError("Failed to add reply: " + error.message);
        // Remove optimistic reply on error
        setComments(prev => prev.filter(c => c.id !== tempId));
      } else {
        console.log("Reply inserted successfully:", data);
        // Replace optimistic reply with real one
        if (data && data[0]) {
          setComments(prev => prev.map(c => c.id === tempId ? data[0] as Comment : c));
        } else {
          // If no data returned, refetch to ensure sync
          setTimeout(fetchComments, 500);
        }
        
        // Auto-show replies for new comments
        if (replyTo) {
          setShowReplies(prev => new Set([...prev, replyTo]));
        }
        // Clear reply state after successful submission
        setReplyTo(null);
        // Smooth scroll to new comment
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
      }
    } catch (err) {
      console.error("Exception inserting reply:", err);
      setError("Failed to add reply");
      // Remove optimistic reply on error
      setComments(prev => prev.filter(c => c.id !== tempId));
    }
  }, [userId, username, postId, replyTo]);

  const handleSubmit = useCallback((e: any) => {
    e.preventDefault();
    if (comment.trim()) {
      handleCommentSubmit(comment);
      setComment("");
    }
  }, [comment, handleCommentSubmit]);

  function handleNamePromptSubmit(e: any) {
    e.preventDefault();
    if (!username?.trim()) return;
    localStorage.setItem("blogUserName", username);
    setShowNamePrompt(false);
    if (pendingComment) {
      setComment(pendingComment.content);
      setReplyTo(pendingComment.replyTo);
      setTimeout(() => {
        handleCommentSubmit(pendingComment.content);
        setPendingComment(null);
      }, 0);
    }
  }

  const handleEditComment = useCallback((id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
    // Use requestAnimationFrame and setTimeout to ensure the input is rendered and focused
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (editInputRef.current) {
          const input = editInputRef.current;
          input.focus();
          // Set cursor to end of text
          const length = content.length;
          input.setSelectionRange(length, length);
        }
      }, 0);
    });
  }, []);

  const handleUpdateComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim() || !editingId) return;

    try {
      const { error } = await supabase
        .from("comments")
        .update({ content: editContent })
        .eq("id", editingId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating comment:", error);
        setError("Failed to update comment");
        return;
      }

      // Clear editing state
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error("Exception updating comment:", err);
      setError("Failed to update comment");
    }
  }, [editContent, editingId, userId]);

  async function handleDeleteComment(id: string) {
    try {
      // Optimistic update - remove comment immediately
      const originalComments = comments;
      setComments(prev => prev.filter(c => c.id !== id));

      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      
      if (error) {
        console.error("Error deleting comment:", error);
        setError("Failed to delete comment");
        // Revert on error
        setComments(originalComments);
      }
    } catch (err) {
      console.error("Exception deleting comment:", err);
      setError("Failed to delete comment");
      // Revert on error
      setComments(comments);
    }
  }

  async function handleReaction(commentId: string, type: ReactionKey) {
    if (!userId) return;
    
    // Check if user has already reacted to this comment
    const reactionKey = `comment_reaction_${commentId}_${userId}`;
    const existingReaction = localStorage.getItem(reactionKey);
    
    // If clicking the same reaction, remove it
    if (existingReaction === type) {
      try {
        const comment = comments.find(c => c.id === commentId);
        if (!comment) return;

        let newReactions = { ...(comment.reactions || {}) };
        newReactions[type] = Math.max(0, ((newReactions[type] ?? 0) as number) - 1);

        // Optimistic update
        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, reactions: newReactions } : c
        ));
        localStorage.removeItem(reactionKey);

        const { error } = await supabase
          .from("comments")
          .update({ reactions: newReactions })
          .eq("id", commentId);
        
        if (error) {
          console.error("Error removing reaction:", error);
          // Revert on error
          setComments(prev => prev.map(c => 
            c.id === commentId ? comment : c
          ));
          localStorage.setItem(reactionKey, type);
        } else {
          // Force a small delay to ensure database consistency for real-time
          setTimeout(() => {
            console.log("Reaction removal completed for real-time sync");
          }, 100);
        }
      } catch (err) {
        console.error("Exception removing reaction:", err);
      }
      return;
    }

    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      let newReactions = { ...(comment.reactions || {}) };
      
      // If user had a different reaction, decrement it
      if (existingReaction && newReactions[existingReaction as ReactionKey]) {
        newReactions[existingReaction as ReactionKey] = Math.max(0, (newReactions[existingReaction as ReactionKey] as number) - 1);
      }
      
      // Increment new reaction
      const current = (newReactions[type] ?? 0) as number;
      newReactions[type] = current + 1;

      // Optimistic update
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, reactions: newReactions } : c
      ));
      localStorage.setItem(reactionKey, type);

      const { error } = await supabase
        .from("comments")
        .update({ reactions: newReactions })
        .eq("id", commentId);
      
      if (error) {
        console.error("Error updating reaction:", error);
        // Revert on error
        setComments(prev => prev.map(c => 
          c.id === commentId ? comment : c
        ));
        if (existingReaction) {
          localStorage.setItem(reactionKey, existingReaction);
        } else {
          localStorage.removeItem(reactionKey);
        }
      } else {
        // Force a small delay to ensure database consistency for real-time
        setTimeout(() => {
          console.log("Reaction update completed for real-time sync");
        }, 100);
      }
    } catch (err) {
      console.error("Exception updating reaction:", err);
    }
  }

  // Check if user has reacted to a specific comment
  function hasUserReacted(commentId: string, type: ReactionKey): boolean {
    if (!userId) return false;
    const reactionKey = `comment_reaction_${commentId}_${userId}`;
    const existingReaction = localStorage.getItem(reactionKey);
    return existingReaction === type;
  }

  // Get user's current reaction for a comment
  function getUserReaction(commentId: string): ReactionKey | null {
    if (!userId) return null;
    const reactionKey = `comment_reaction_${commentId}_${userId}`;
    const existingReaction = localStorage.getItem(reactionKey);
    return existingReaction as ReactionKey | null;
  }

  // Separate top-level comments and replies - memoized to prevent recalculation
  const topLevelComments = useMemo(() => comments.filter(c => !c.parent_id), [comments]);
  const replies = useMemo(() => comments.filter(c => c.parent_id), [comments]);

  const CommentItem = memo(({ c, isReply = false, depth = 0 }: { c: Comment; isReply?: boolean; depth?: number }) => {
    const seedForThisAuthor = useMemo(
      () => (c.user_id ? `${c.user_id}-v1` : `${c.name || "anon"}-v1`),
      [c.user_id, c.name]
    );
    const authorAvatar = useMemo(() => getAvatarUrl(seedForThisAuthor), [seedForThisAuthor]);
    const hasReplies = useMemo(() => replies.some(r => r.parent_id === c.id), [replies, c.id]);
    const showRepliesForThis = showReplies.has(c.id);
    const userReaction = useMemo(() => getUserReaction(c.id), [c.id, userId]);
    
    // Memoize reaction counts to prevent recalculation
    const reactionCounts = useMemo(() => {
      return REACTIONS.reduce((acc, { key }) => {
        acc[key] = c.reactions?.[key] || 0;
        return acc;
      }, {} as Record<ReactionKey, number>);
    }, [c.reactions]);

    // Stable key to prevent re-mounting
    const stableKey = useMemo(() => `comment-${c.id}`, [c.id]);

    // Calculate indentation based on depth (max 3 levels)
    const maxDepth = 3;
    const actualDepth = Math.min(depth, maxDepth);
    const indentClass = actualDepth > 0 ? `ml-${Math.min(actualDepth * 6, 18)} sm:ml-${Math.min(actualDepth * 8, 24)} lg:ml-${Math.min(actualDepth * 12, 36)}` : '';

    return (
      <motion.li
        key={stableKey}
        layout
        initial={false}
        animate={{ opacity: 1 }}
        className={indentClass}
      >
        <Card className={`${themeClasses.card} ${isReply ? 'border-l-4 border-l-primary/30' : ''}`}>
          <div className="flex gap-3 sm:gap-4">
            <Avatar className="size-10 sm:size-12 shrink-0 ring-2 ring-primary/10">
              <AvatarImage src={authorAvatar} alt={c.name || "Avatar"} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                {(c.name || "A").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                <div className="flex items-center gap-2">
                  <span className={themeClasses.username}>{c.name || "Anonymous"}</span>
                  {c.user_id === userId && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      You
                    </Badge>
                  )}
                  {isReply && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      Reply
                    </Badge>
                  )}
                </div>
                <span className={themeClasses.date}>
                  <Clock className="w-3 h-3" />
                  {new Date(c.created_at).toLocaleDateString()} ·{" "}
                  {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {/* Content */}
              {editingId === c.id ? (
                <div className="mt-3">
                  <IsolatedCommentInput
                    initialValue={editContent}
                    onSubmit={(content) => {
                      setEditContent(content);
                      handleUpdateComment({ preventDefault: () => {} } as React.FormEvent);
                    }}
                    onCancel={handleCancelEdit}
                    placeholder="Edit your comment..."
                    submitText="Save"
                    showCancel={true}
                  />
                </div>
              ) : (
                <div className={themeClasses.content}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {c.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Actions Row */}
              <div className={themeClasses.actions}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                  className={`gap-2 text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 ${replyTo === c.id ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <CornerUpLeft size={16} />
                  <span className="hidden sm:inline">{replyTo === c.id ? 'Cancel' : 'Reply'}</span>
                </Button>

                {/* Show Replies Button for comments/replies that have replies */}
                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplies(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(c.id)) {
                        newSet.delete(c.id);
                      } else {
                        newSet.add(c.id);
                      }
                      return newSet;
                    })}
                    className="gap-2 text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10"
                  >
                    {showRepliesForThis ? (
                      <>
                        <ChevronUp size={16} />
                        <span className="hidden sm:inline">Hide Replies</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        <span className="hidden sm:inline">Show Replies</span>
                      </>
                    )}
                    <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5">
                      {replies.filter(r => r.parent_id === c.id).length}
                    </Badge>
                  </Button>
                )}

                {userId && c.user_id === userId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10">
                        <MoreHorizontal size={16} />
                        <span className="hidden sm:inline">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => handleEditComment(c.id, c.content)} className="gap-2">
                        <Edit2 size={16} /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteComment(c.id)} className="gap-2 text-red-600">
                        <Trash2 size={16} /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Reactions */}
              <div className="flex flex-wrap gap-1 mt-3">
                {REACTIONS.map(({ key, Icon, color, bgColor, borderColor, hoverColor, activeColor }) => {
                  const count = reactionCounts[key];
                  const isSelected = userReaction === key;
                  
                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReaction(c.id, key)}
                        className={`
                          h-8 px-3 rounded-full border-2 transition-all duration-300 font-medium
                          ${isSelected ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg' : `${bgColor} ${borderColor} ${hoverColor} shadow-sm hover:shadow-md`}
                          group
                        `}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon 
                            className={`w-4 h-4 transition-all duration-300 ${
                              isSelected 
                                ? `${color}` 
                                : `${color} fill-transparent hover:fill-current hover:opacity-70`
                            }`} 
                            fill={isSelected ? "currentColor" : "none"}
                            style={isSelected ? { color: color.replace('text-', '').replace('-500', '') === 'yellow' ? '#eab308' : color.replace('text-', '').replace('-500', '') === 'green' ? '#22c55e' : undefined } : undefined}
                          />
                          {/* <span className={`text-xs font-medium hidden xs:inline ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                            {label}
                          </span> */}
                          {count > 0 && (
                            <Badge 
                              variant="secondary" 
                              className={`
                                ml-0.5 px-1.5 py-0.5 text-xs font-bold
                                ${isSelected ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300'}
                              `}
                            >
                              {count}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </motion.li>
    );
  });

  // Function to render all replies at the same level with unlimited nesting
  function renderReplies(parentId: string): React.ReactElement[] {
    return replies
      .filter(reply => reply.parent_id === parentId)
      .map(reply => (
        <div key={`reply-wrapper-${reply.id}`} className="mt-4">
          <CommentItem c={reply} isReply={true} depth={0} />
          
          {/* Reply form for this specific reply */}
          {replyTo === reply.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <IsolatedCommentInput
                onSubmit={handleReplySubmit}
                onCancel={handleCancelReply}
                placeholder="Write a reply (Markdown supported)..."
                submitText="Reply"
                showCancel={true}
              />
            </motion.div>
          )}
          
          {/* Show replies to this reply */}
          {showReplies.has(reply.id) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-3"
            >
              {renderReplies(reply.id)}
            </motion.div>
          )}
        </div>
      ));
  }

  function Composer({ replyingTo }: { replyingTo: string | null }) {
    return (
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="flex items-start gap-3 sm:flex-1">
          <Avatar className="size-10 sm:size-12 shrink-0 ring-2 ring-primary/10">
            <AvatarImage src={avatarUrl} alt="Your avatar" />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
              U
            </AvatarFallback>
          </Avatar>

          <StableCommentInput
            value={comment}
            onChange={handleCommentChange}
            placeholder={replyingTo ? "Write a reply (Markdown supported)..." : "Add a comment (Markdown supported)..."}
            inputRef={commentInputRef}
          />
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          {replyingTo && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelReply}
              className={`${themeClasses.button} gap-2`}
            >
              <X size={16} /> Cancel
            </Button>
          )}
          <Button type="submit" className={`${themeClasses.button} gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70`}>
            <Send size={16} /> {replyingTo ? "Reply" : "Post"}
          </Button>
        </div>
      </motion.form>
    );
  }

  return (
    <div className={`${themeClasses.container} mt-8`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-primary/10">
          <MessageCircle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Comments</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Join the conversation</p>
        </div>
      </div>

      {/* Username prompt */}
      {showNamePrompt && (
        <motion.form
          onSubmit={handleNamePromptSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50"
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Set your display name</span>
          </div>
          <StableUsernameInput
            value={username || ""}
            onChange={handleUsernameChange}
            inputRef={usernameInputRef}
          />
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Continue
            </Button>
            <Button type="button" variant="outline" onClick={handleCancelUsername}>
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {/* Top-level composer - Always visible */}
      {!showNamePrompt && (
        <IsolatedCommentInput
          onSubmit={handleCommentSubmit}
          placeholder="Add a comment (Markdown supported)..."
          submitText="Post"
        />
      )}

      {/* Error display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : topLevelComments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No comments yet</h4>
          <p className="text-gray-600 dark:text-gray-400">Be the first to share your thoughts!</p>
        </motion.div>
      ) : (
        <ul className="space-y-4" ref={scrollRef}>
          <AnimatePresence mode="popLayout">
            {topLevelComments.map(comment => (
              <div key={`comment-wrapper-${comment.id}`}>
                <CommentItem key={`comment-${comment.id}`} c={comment} />
                
                {/* Reply input for top-level comment */}
                {replyTo === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 ml-6 sm:ml-8 lg:ml-12"
                  >
                    <IsolatedCommentInput
                      onSubmit={handleReplySubmit}
                      onCancel={handleCancelReply}
                      placeholder="Write a reply (Markdown supported)..."
                      submitText="Reply"
                      showCancel={true}
                    />
                  </motion.div>
                )}

                {/* Show replies */}
                {showReplies.has(comment.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3"
                  >
                    {renderReplies(comment.id)}
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}