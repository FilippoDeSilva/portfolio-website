import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Heart, ThumbsUp, Laugh, Flame, Sparkles, Coffee, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogMeta } from "@/components/blog-meta";

interface BlogReactionsProps {
  postId: string;
  initialReactions: {
    [key: string]: number;
    likes: number;
    love: number;
    laugh: number;
    fire: number;
    wow: number;
    coffee: number;
  };
  viewCount: number;
  publishedAt?: string | null;
}

export function BlogReactions({ 
  postId, 
  initialReactions,
  viewCount,
  publishedAt
}: BlogReactionsProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setReactions(initialReactions);
  }, [initialReactions]);

  // Real-time subscription for blog reactions
  useEffect(() => {
    if (!postId) return;

    const subscription = supabase
      .channel(`blog_reactions_${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'blogposts',
          filter: `id=eq.${postId}`
        },
        (payload) => {
          console.log("Real-time blog reaction update:", payload);
          if (payload.new) {
            const newReactions = {
              likes: payload.new.likes || 0,
              love: payload.new.love || 0,
              laugh: payload.new.laugh || 0,
              fire: payload.new.fire || 0,
              wow: payload.new.wow || 0,
              coffee: payload.new.coffee || 0
            };
            setReactions(newReactions);
          }
        }
      )
      .subscribe((status, err) => {
        console.log("Blog reactions subscription status:", status);
        if (err) console.error("Blog reactions subscription error:", err);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    // Get user ID for tracking reactions
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUserId(data.user.id);
      } else {
        let localId = localStorage.getItem("blogUserId");
        if (!localId) {
          localId = crypto.randomUUID();
          localStorage.setItem("blogUserId", localId);
        }
        setUserId(localId);
      }
    });

    // Check if user has already reacted
    const reactionKey = `blog_reaction_${postId}`;
    const savedReaction = localStorage.getItem(reactionKey);
    if (savedReaction) {
      setUserReacted(savedReaction);
    }
  }, [postId]);

  const reactionTypes = [
    {
      key: "likes" as const,
      // label: "Like",
      icon: ThumbsUp,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
      activeColor: "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700"
    },
    {
      key: "love" as const,
      // label: "Love",
      icon: Heart,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
      borderColor: "border-pink-200 dark:border-pink-800",
      hoverColor: "hover:bg-pink-100 dark:hover:bg-pink-900/50",
      activeColor: "bg-pink-100 dark:bg-pink-900/50 border-pink-300 dark:border-pink-700"
    },
    {
      key: "laugh" as const,
      // label: "Laugh",
      icon: Laugh,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      hoverColor: "hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
      activeColor: "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700"
    },
    {
      key: "fire" as const,
      // label: "Fire",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      borderColor: "border-orange-200 dark:border-orange-800",
      hoverColor: "hover:bg-orange-100 dark:hover:bg-orange-900/50",
      activeColor: "bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700"
    },
    {
      key: "wow" as const,
     // label: "Wow",
      icon: Sparkles,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800",
      hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-900/50",
      activeColor: "bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700"
    },
    {
      key: "coffee" as const,
      // label: "Coffee",
      icon: Coffee,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      hoverColor: "hover:bg-amber-100 dark:hover:bg-amber-900/50",
      activeColor: "bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700"
    }
  ];

  async function handleReact(type: "likes" | "love" | "laugh" | "fire" | "wow" | "coffee") {
    if (!userId) return;
    if (userReacted === type) return; // No-op if clicking the same reaction
    
    // Set animation state
    setIsAnimating(type);
    
    let updates: any = { ...reactions };
    
    // Decrement previous reaction if any
    if (userReacted) {
      updates[userReacted] = Math.max(0, updates[userReacted] - 1);
    }
    
    // Increment new reaction
    updates[type] = (updates[type] || 0) + 1;
    
    try {
      await supabase
        .from("blogposts")
        .update({ 
          likes: updates.likes, 
          love: updates.love, 
          laugh: updates.laugh,
          fire: updates.fire,
          wow: updates.wow,
          coffee: updates.coffee
        })
        .eq("id", postId);
      
      setReactions(updates);
      setUserReacted(type);
      
      // Save user reaction to localStorage
      const reactionKey = `blog_reaction_${postId}`;
      localStorage.setItem(reactionKey, type);
      
      // Clear animation after a delay
      setTimeout(() => setIsAnimating(null), 600);
    } catch (error) {
      console.error("Failed to update reaction:", error);
      // Revert on error
      setReactions(initialReactions);
    }
  }

  const totalReactions = reactions.likes + reactions.love + reactions.laugh + reactions.fire + reactions.wow + reactions.coffee;

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Reaction Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {reactionTypes.map(({ key, icon: Icon, color, bgColor, borderColor, hoverColor, activeColor }) => {
            const isActive = userReacted === key;
            const isAnimatingThis = isAnimating === key;
            const count = reactions[key];
            
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
                  onClick={() => handleReact(key)}
                  className={`
                    h-10 px-4 rounded-full border-2 transition-all duration-300 font-medium
                    ${isActive ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg' : `${bgColor} ${borderColor} ${hoverColor} shadow-sm hover:shadow-md`}
                    group
                  `}
                  disabled={isAnimatingThis}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={isAnimatingThis ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, -10, 10, 0]
                      } : {}}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <Icon 
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive 
                            ? `${color}` 
                            : `${color} fill-transparent hover:fill-current hover:opacity-70`
                        }`} 
                        fill={isActive ? "currentColor" : "none"}
                        style={isActive ? { color: color.replace('text-', '').replace('-500', '') === 'yellow' ? '#eab308' : undefined } : undefined}
                      />
                    </motion.div>
                    {count > 0 && (
                      <Badge 
                        variant="secondary" 
                        className={`
                          ml-1 px-2 py-0.5 text-xs font-bold
                          ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300'}
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

        {/* Blog Meta - Aligned to the right */}
        <div className="mt-1 sm:mt-0">
          <BlogMeta viewCount={viewCount} publishedAt={publishedAt} className="justify-end text-xs" />
        </div>
      </div>

      {/* Reactions Summary */}
      <div className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
        {/* User Reaction Notice - Positioned absolutely on larger screens */}
        {userReacted && (
          <div className="relative">
            <motion.div
              key="reaction-notice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-primary text-xs sm:text-sm
                       sm:absolute sm:right-0 sm:-top-8"
            >
              <Star className="w-4 h-4"/>
              You reacted with {reactionTypes.find(r => r.key === userReacted)?.key}
            </motion.div>
          </div>
        )}
        {totalReactions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="flex -space-x-1">
              {reactionTypes.map(({ key, icon: Icon, color }) => {
                const count = reactions[key];
                if (count === 0) return null;
                
                return (
                  <motion.div
                    key={key}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-sm"
                  >
                    <Icon className={`w-3 h-3 ${color}`} />
                  </motion.div>
                );
              })}
            </div>
            <span className="font-medium whitespace-nowrap">
              {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
