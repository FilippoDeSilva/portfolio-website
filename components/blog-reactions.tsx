import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function BlogReactions({ postId, initialReactions }: { postId: string; initialReactions: { likes: number; love: number; laugh: number; } }) {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReacted, setUserReacted] = useState<string | null>(null);

  useEffect(() => {
    setReactions(initialReactions);
  }, [initialReactions]);

  async function handleReact(type: "likes" | "love" | "laugh") {
    if (userReacted === type) return; // No-op if clicking the same reaction
    let updates: any = { ...reactions };
    // Decrement previous reaction if any
    if (userReacted) {
      updates[userReacted] = Math.max(0, updates[userReacted] - 1);
    }
    // Increment new reaction
    updates[type] = (updates[type] || 0) + 1;
    await supabase.from("blogposts").update({ likes: updates.likes, love: updates.love, laugh: updates.laugh }).eq("id", postId);
    setReactions(updates);
    setUserReacted(type);
  }

  return (
    <div className="flex gap-4 mt-2">
      <button onClick={() => handleReact("likes")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full border ${userReacted === "likes" ? "bg-primary/10 border-primary dark:bg-primary/30 dark:border-primary" : "border-border dark:border-zinc-700"} transition`}
        aria-label="Like">
        <span role="img" aria-label="like">👍</span> {reactions.likes}
      </button>
      <button onClick={() => handleReact("love")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full border ${userReacted === "love" ? "bg-pink-100 border-pink-400 dark:bg-pink-900/40 dark:border-pink-400" : "border-border dark:border-zinc-700"} transition`}
        aria-label="Love">
        <span role="img" aria-label="love">❤️</span> {reactions.love}
      </button>
      <button onClick={() => handleReact("laugh")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full border ${userReacted === "laugh" ? "bg-yellow-100 border-yellow-400 dark:bg-yellow-900/40 dark:border-yellow-400" : "border-border dark:border-zinc-700"} transition`}
        aria-label="Laugh">
        <span role="img" aria-label="laugh">😂</span> {reactions.laugh}
      </button>
    </div>
  );
}
