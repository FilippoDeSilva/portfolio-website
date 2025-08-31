// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { v4 as uuidv4 } from "uuid";
// import { Send } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface Comment {
//   id: string;
//   content: string;
//   created_at: string;
//   parent_id?: string | null;
//   replies?: Comment[];
//   name?: string;
//   user_id?: string;
// }

// export function BlogComments({ postId }: { postId: string }) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [comment, setComment] = useState("");
//   const [replyTo, setReplyTo] = useState<string | null>(null);
//   const [error, setError] = useState("");
//   const [userId, setUserId] = useState<string | null>(null);
//   const [username, setUsername] = useState<string | null>(null);
//   const [showNamePrompt, setShowNamePrompt] = useState(false);
//   const [pendingComment, setPendingComment] = useState<{
//     content: string;
//     replyTo: string | null;
//   } | null>(null);

//   // Editing state
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editContent, setEditContent] = useState("");

//   useEffect(() => {
//     // Get or generate user ID
//     supabase.auth.getUser().then(({ data }) => {
//       if (data?.user?.id) {
//         setUserId(data.user.id);
//         localStorage.setItem("blogUserId", data.user.id);
//       } else {
//         let localId = localStorage.getItem("blogUserId");
//         if (!localId) {
//           localId = uuidv4();
//           localStorage.setItem("blogUserId", localId);
//         }
//         setUserId(localId);
//       }
//     });

//     // Get username from localStorage
//     const storedName = localStorage.getItem("blogUserName");
//     if (storedName) setUsername(storedName);
//   }, []);

//   useEffect(() => {
//     fetchComments();
//   }, [postId]);

//   async function fetchComments() {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("comments")
//       .select("id, content, created_at, parent_id, name, user_id")
//       .eq("post_id", postId)
//       .order("created_at", { ascending: true });
//     if (!error && data) setComments(buildThread(data));
//     setLoading(false);
//   }

//   function buildThread(flat: Comment[]): Comment[] {
//     const map: { [id: string]: Comment & { replies: Comment[] } } = {};
//     flat.forEach((c) => (map[c.id] = { ...c, replies: [] }));
//     const roots: Comment[] = [];
//     flat.forEach((c) => {
//       if (c.parent_id) {
//         map[c.parent_id]?.replies.push(map[c.id]);
//       } else {
//         roots.push(map[c.id]);
//       }
//     });
//     return roots;
//   }

//   async function handleSubmit(e: any) {
//     e.preventDefault();
//     setError("");
//     if (!comment.trim()) return;
//     if (!userId) {
//       setError("You must be identified to comment.");
//       return;
//     }
//     if (!username) {
//       setShowNamePrompt(true);
//       setPendingComment({ content: comment, replyTo });
//       return;
//     }
//     const payload = {
//       post_id: postId,
//       content: comment,
//       parent_id: replyTo,
//       user_id: userId,
//       name: username,
//     };
//     const { error } = await supabase.from("comments").insert([payload]);
//     if (error) {
//       setError("Failed to add comment: " + error.message);
//     }
//     setComment("");
//     setReplyTo(null);
//     fetchComments();
//   }

//   function handleNamePromptSubmit(e: any) {
//     e.preventDefault();
//     if (!username || !username.trim()) return;
//     localStorage.setItem("blogUserName", username);
//     setShowNamePrompt(false);
//     if (pendingComment) {
//       setComment(pendingComment.content);
//       setReplyTo(pendingComment.replyTo);
//       setTimeout(() => {
//         handleSubmit({ preventDefault: () => {} });
//         setPendingComment(null);
//       }, 0);
//     }
//   }

//   async function handleEditComment(id: string, content: string) {
//     setEditingId(id);
//     setEditContent(content);
//   }

//   async function handleUpdateComment(e: any) {
//     e.preventDefault();
//     if (!editContent.trim() || !editingId) return;
//     const { error } = await supabase
//       .from("comments")
//       .update({ content: editContent })
//       .eq("id", editingId)
//       .eq("user_id", userId);
//     if (error) setError("Failed to update comment");
//     setEditingId(null);
//     setEditContent("");
//     fetchComments();
//   }

//   async function handleDeleteComment(id: string) {
//     const { error } = await supabase
//       .from("comments")
//       .delete()
//       .eq("id", id)
//       .eq("user_id", userId);
//     if (error) setError("Failed to delete comment");
//     fetchComments();
//   }

//   function renderComments(comments: Comment[], level = 0) {
//     return (
//       <ul className={level === 0 ? "space-y-4" : "ml-6 border-l pl-4 space-y-4 border-gray-200 dark:border-zinc-700"}>
//         <AnimatePresence>
//           {comments.map((c) => (
//             <motion.li
//               key={c.id}
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.2 }}
//               className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="flex items-start gap-3">
//                 {/* Avatar */}
//                 <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300">
//                   {(c.name || "A").charAt(0).toUpperCase()}
//                 </div>

//                 <div className="flex-1">
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium text-sm text-gray-800 dark:text-gray-100">
//                       {c.name || "Anonymous"}
//                     </span>
//                     <span className="text-xs text-gray-500">
//                       {new Date(c.created_at).toLocaleDateString()} ·{" "}
//                       {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                     </span>
//                   </div>

//                   {/* Content / Edit */}
//                   {editingId === c.id ? (
//                     <form onSubmit={handleUpdateComment} className="flex gap-2 mt-2">
//                       <input
//                         value={editContent}
//                         onChange={(e) => setEditContent(e.target.value)}
//                         className="flex-1 rounded-lg border px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         autoFocus
//                       />
//                       <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
//                         Save
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setEditingId(null)}
//                         className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
//                       >
//                         Cancel
//                       </button>
//                     </form>
//                   ) : (
//                     <p className="mt-1 text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{c.content}</p>
//                   )}

//                   {/* Actions */}
//                   <div className="flex gap-3 mt-2 text-xs">
//                     <button
//                       onClick={() => setReplyTo(c.id)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Reply
//                     </button>
//                     {userId && c.user_id === userId && (
//                       <>
//                         <button
//                           onClick={() => handleEditComment(c.id, c.content)}
//                           className="text-green-600 hover:underline"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteComment(c.id)}
//                           className="text-red-600 hover:underline"
//                         >
//                           Delete
//                         </button>
//                       </>
//                     )}
//                   </div>

//                   {/* Reply input */}
//                   <AnimatePresence>
//                     {replyTo === c.id && (
//                       <motion.form
//                         onSubmit={handleSubmit}
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="flex gap-2 mt-3"
//                       >
//                         <input
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           className="flex-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="Write a reply..."
//                           autoFocus
//                         />
//                         <button
//                           type="submit"
//                           className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 transition"
//                         >
//                           <Send className="w-4 h-4" />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setReplyTo(null);
//                             setComment("");
//                           }}
//                           className="px-2 text-gray-500 hover:underline"
//                         >
//                           Cancel
//                         </button>
//                       </motion.form>
//                     )}
//                   </AnimatePresence>

//                   {/* Replies */}
//                   {c.replies && c.replies.length > 0 && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       transition={{ duration: 0.25 }}
//                       className="mt-3 pl-6 border-l border-gray-200 dark:border-zinc-700"
//                     >
//                       {renderComments(c.replies, level + 1)}
//                     </motion.div>
//                   )}
//                 </div>
//               </div>
//             </motion.li>
//           ))}
//         </AnimatePresence>
//       </ul>
//     );
//   }

//   return (
//     <div className="mt-6">
//       <h4 className="font-semibold mb-4">Comments</h4>

//       {/* Name prompt */}
//       {showNamePrompt && (
//         <form onSubmit={handleNamePromptSubmit} className="flex gap-2 mb-4">
//           <input
//             value={username || ""}
//             onChange={(e) => setUsername(e.target.value)}
//             className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter your name"
//             autoFocus
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Continue
//           </button>
//         </form>
//       )}

//       {/* Root comment input */}
//       {!replyTo && !showNamePrompt && (
//         <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
//           <input
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className="flex-1 rounded-lg border px-4 py-2 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Add a comment..."
//           />
//           <button
//             type="submit"
//             className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
//             aria-label="Post comment"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </form>
//       )}

//       {/* Errors */}
//       {error && <div className="text-red-500 mb-2">{error}</div>}

//       {/* Comment list */}
//       {loading ? (
//         <div className="text-gray-500">Loading comments...</div>
//       ) : comments.length === 0 ? (
//         <div className="text-gray-500">No comments yet.</div>
//       ) : (
//         renderComments(comments)
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Edit2,
  Trash2,
  CornerUpLeft,
  Check,
  X,
  Heart,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
  replies?: Comment[];
  name?: string;
  user_id?: string;
  reactions?: { [key: string]: number };
}

export function BlogComments({ postId }: { postId: string }) {
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

  // Align with your website's theme via Tailwind / shadcn
  const themeClasses = {
    card: "bg-white dark:bg-gray-800 shadow rounded-lg p-4",
    username: "font-semibold text-gray-900 dark:text-gray-100",
    date: "text-xs text-gray-500 dark:text-gray-400",
    content: "text-sm text-gray-800 dark:text-gray-200",
    actions: "flex gap-3 mt-2 text-sm text-gray-600 dark:text-gray-300",
    reactionBtn: "flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300",
  };

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
  }, [postId]);

  async function fetchComments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (!error && data) setComments(buildThread(data));
    setLoading(false);
  }

  function buildThread(flat: Comment[]): Comment[] {
    const map: { [id: string]: Comment & { replies: Comment[] } } = {};
    flat.forEach((c) => (map[c.id] = { ...c, replies: [] }));
    const roots: Comment[] = [];
    flat.forEach((c) => {
      if (c.parent_id) map[c.parent_id]?.replies.push(map[c.id]);
      else roots.push(map[c.id]);
    });
    return roots;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!userId) return setError("You must be identified to comment.");
    if (!username) {
      setShowNamePrompt(true);
      setPendingComment({ content: comment, replyTo });
      return;
    }

    const payload = {
      post_id: postId,
      content: comment,
      parent_id: replyTo,
      user_id: userId,
      name: username,
      reactions: {},
    };

    const { error } = await supabase.from("comments").insert([payload]);
    if (error) return setError("Failed to add comment: " + error.message);

    setComment("");
    setReplyTo(null);
    fetchComments();
  }

  function handleNamePromptSubmit(e: any) {
    e.preventDefault();
    if (!username?.trim()) return;
    localStorage.setItem("blogUserName", username);
    setShowNamePrompt(false);
    if (pendingComment) {
      setComment(pendingComment.content);
      setReplyTo(pendingComment.replyTo);
      setTimeout(() => {
        handleSubmit({ preventDefault: () => {} });
        setPendingComment(null);
      }, 0);
    }
  }

  async function handleEditComment(id: string, content: string) {
    setEditingId(id);
    setEditContent(content);
  }

  async function handleUpdateComment(e: any) {
    e.preventDefault();
    if (!editContent.trim() || !editingId) return;
    await supabase
      .from("comments")
      .update({ content: editContent })
      .eq("id", editingId)
      .eq("user_id", userId);
    setEditingId(null);
    setEditContent("");
    fetchComments();
  }

  async function handleDeleteComment(id: string) {
    await supabase.from("comments").delete().eq("id", id).eq("user_id", userId);
    fetchComments();
  }

  async function handleReaction(commentId: string, type: string) {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    const current = comment.reactions?.[type] || 0;
    const newReactions = { ...comment.reactions, [type]: current + 1 };

    await supabase.from("comments").update({ reactions: newReactions }).eq("id", commentId);
    fetchComments();
  }

  function renderComments(comments: Comment[], level = 0) {
    return (
      <ul className={level === 0 ? "space-y-4" : "ml-6 space-y-4"}>
        <AnimatePresence>
          {comments.map((c) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Card className={themeClasses.card}>
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback>{(c.name || "A").charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className={themeClasses.username}>{c.name || "Anonymous"}</span>
                      <span className={themeClasses.date}>
                        {new Date(c.created_at).toLocaleDateString()} ·{" "}
                        {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {editingId === c.id ? (
                      <form onSubmit={handleUpdateComment} className="flex gap-2 mt-2">
                        <Input value={editContent} onChange={(e) => setEditContent(e.target.value)} autoFocus />
                        <Button type="submit" variant="outline">
                          <Check size={16} />
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                          <X size={16} />
                        </Button>
                      </form>
                    ) : (
                      <p className={themeClasses.content}>{c.content}</p>
                    )}

                    {/* Actions */}
                    <div className={themeClasses.actions}>
                      <Button variant="ghost" size="sm" onClick={() => setReplyTo(c.id)}>
                        <CornerUpLeft size={16} /> Reply
                      </Button>
                      {userId && c.user_id === userId && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleEditComment(c.id, c.content)}>
                            <Edit2 size={16} /> Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(c.id)}>
                            <Trash2 size={16} /> Delete
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Reactions */}
                    <div className="flex gap-2 mt-2">
                      {["like", "love"].map((type) => (
                        <Button
                          key={type}
                          variant="ghost"
                          size="sm"
                          className={themeClasses.reactionBtn}
                          onClick={() => handleReaction(c.id, type)}
                        >
                          <Heart size={16} /> {type.charAt(0).toUpperCase() + type.slice(1)} ({c.reactions?.[type] || 0})
                        </Button>
                      ))}
                    </div>

                    {/* Reply input */}
                    <AnimatePresence>
                      {replyTo === c.id && (
                        <motion.form
                          onSubmit={handleSubmit}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-2 mt-3"
                        >
                          <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a reply..." autoFocus />
                          <Button type="submit">
                            <Send size={16} />
                          </Button>
                          <Button variant="outline" onClick={() => { setReplyTo(null); setComment(""); }}>
                            <X size={16} />
                          </Button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* Nested replies */}
                    {c.replies && c.replies.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3"
                      >
                        {renderComments(c.replies, level + 1)}
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Comments</h4>

      {showNamePrompt && (
        <form onSubmit={handleNamePromptSubmit} className="flex gap-2 mb-4">
          <Input value={username || ""} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your name" autoFocus />
          <Button type="submit">Continue</Button>
        </form>
      )}

      {!replyTo && !showNamePrompt && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
          <Button type="submit">
            <Send size={16} />
          </Button>
        </form>
      )}

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {loading ? <div className="text-gray-500">Loading comments...</div> : comments.length === 0 ? <div className="text-gray-500">No comments yet.</div> : renderComments(comments)}
    </div>
  );
}
