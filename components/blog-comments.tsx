import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
  replies?: Comment[];
  name?: string;
  user_id?: string;
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
  const [pendingComment, setPendingComment] = useState<{
    content: string;
    replyTo: string | null;
  } | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    // Get or generate user ID
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

    // Get username from localStorage
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
      .select("id, content, created_at, parent_id, name, user_id")
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
      if (c.parent_id) {
        map[c.parent_id]?.replies.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    if (!comment.trim()) return;
    if (!userId) {
      setError("You must be identified to comment.");
      return;
    }
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
    };
    const { error } = await supabase.from("comments").insert([payload]);
    if (error) {
      setError("Failed to add comment: " + error.message);
    }
    setComment("");
    setReplyTo(null);
    fetchComments();
  }

  function handleNamePromptSubmit(e: any) {
    e.preventDefault();
    if (!username || !username.trim()) return;
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
    const { error } = await supabase
      .from("comments")
      .update({ content: editContent })
      .eq("id", editingId)
      .eq("user_id", userId);
    if (error) setError("Failed to update comment");
    setEditingId(null);
    setEditContent("");
    fetchComments();
  }

  async function handleDeleteComment(id: string) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) setError("Failed to delete comment");
    fetchComments();
  }

  function renderComments(comments: Comment[], level = 0) {
    return (
      <ul className={level === 0 ? "space-y-2" : "ml-6 border-l pl-4 space-y-2 border-gray-200 dark:border-zinc-700"}>
        {comments.map((c) => (
          <li key={c.id} className="bg-gray-50 dark:bg-zinc-800/70 rounded p-2 text-sm border border-gray-200 dark:border-zinc-700 flex flex-col min-h-[80px]">
            <div className="flex-1">
              <span className="block font-semibold text-xs text-blue-700 dark:text-blue-300 mb-1">
                {c.name || "Anonymous"}
              </span>
              {editingId === c.id ? (
                <form onSubmit={handleUpdateComment} className="flex gap-2 mt-1">
                  <input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 border rounded px-3 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p className="mb-1 text-gray-900 dark:text-gray-100">{c.content}</p>
                  <div className="mt-1 flex gap-3 items-center text-xs">
                    <button
                      onClick={() => setReplyTo(c.id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Reply
                    </button>
                    {userId && c.user_id === userId && (
                      <>
                        <button
                          onClick={() => handleEditComment(c.id, c.content)}
                          className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 1 1 2.828 2.828L11.828 15.828a2 2 0 0 1-2.828 0L9 13zm-2 6h6"/></svg>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                          title="Delete"
                        >
                          <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7zm3 4v6m4-6v6"/></svg>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
              {replyTo === c.id && !showNamePrompt && (
                <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 border rounded px-3 py-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                    placeholder="Write a reply..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null);
                      setComment("");
                    }}
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Cancel
                  </button>
                </form>
              )}
              {c.replies && c.replies.length > 0 && renderComments(c.replies, level + 1)}
            </div>
            <div className="flex justify-end items-end mt-2">
              <span className="text-xs text-muted-foreground">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2">Comments</h4>

      {showNamePrompt && (
        <form onSubmit={handleNamePromptSubmit} className="flex gap-2 mb-4">
          <input
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Enter your name"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Continue
          </button>
        </form>
      )}

      {!replyTo && !showNamePrompt && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Add a comment..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </form>
      )}

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {loading ? (
        <div className="text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-500">No comments yet.</div>
      ) : (
        renderComments(comments)
      )}
    </div>
  );
}
