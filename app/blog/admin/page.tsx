"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Link as TiptapLink } from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import TitleBar from "@/components/titlebar";
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Paragraph from '@tiptap/extension-paragraph';
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Download, Eye, EyeOff, LogOut, Sparkles, X } from "lucide-react";
import ImageViewer from "@/components/ui/image-viewer";
import NativeVideoPlayer from "@/components/ui/native-video-player";
import NativeAudioPlayer from "@/components/ui/native-audio-player";
import { Plus, Trash2, Upload, Check, RefreshCw, Paperclip, Send } from "lucide-react";
import AIChatModal from "@/components/ui/ai-chat-modal";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";
const lowlight = createLowlight();
lowlight.register({ javascript });

// Helper to extract storage path from a Supabase public URL
// function getStoragePath(url: string): string | null {
//   if (!url || typeof url !== 'string') return null;
//   const match = url.match(/blog-attachments\/(.+)$/);
//   return match ? match[1] : null;
// }

// Helper to clean up all storage files for a post
// async function cleanupBlogPostStorage(post: { cover_image?: string, attachments?: any[] }) {
//   const filePaths: string[] = [];
//   if (post?.cover_image) {
//     const path = getStoragePath(post.cover_image);
//     if (path) filePaths.push(path);
//   }
  // if (Array.isArray(post?.attachments)) {
  //   for (const att of post.attachments) {
  //     if (att?.url) {
  //       const path = getStoragePath(att.url);
  //       if (path) filePaths.push(path);
  //     }
  //   }
  // }
//   if (filePaths.length > 0) {
//     console.log('Attempting to delete these file paths from storage:', filePaths);
//     const { error } = await supabase.storage.from('blog-attachments').remove(filePaths);
//     if (error) {
//       console.error('Supabase storage remove error:', error.message, error);
//     } else {
//       console.log('Successfully deleted files:', filePaths);
//     }
//   } else {
//     console.log('No file paths found for deletion.');
//   }
// }

function TiptapMenuBar({ editor }: { editor: any }) {
  if (!editor) return null;
  // Button style helpers
  const btnBase =
    "flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-100 text-lg hover:bg-primary/10 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40";
  const btnActive =
    "bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary-foreground";
  const btnGroup = "flex items-center gap-1";
  const divider = <span className="mx-1 h-5 w-px bg-gray-300 dark:bg-zinc-700" />;

  return (
    <div className="flex flex-wrap items-center gap-1 border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-1 mb-2 bg-muted/40 dark:bg-zinc-800/60 shadow-sm">
      {/* Formatting */}
      <div className={btnGroup}>
        <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={btnBase + (editor.isActive('bold') ? ` ${btnActive}` : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 0 1 0 8H6zm0 8h9a4 4 0 1 1 0 8H6z"/></svg>
        </button>
        <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnBase + (editor.isActive('italic') ? ` ${btnActive}` : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 4h-9M15 20H6m6-16l-6 16"/></svg>
        </button>
        <button type="button" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnBase + (editor.isActive('underline') ? ` ${btnActive}` : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/></svg>
        </button>
        <button type="button" title="Strike" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnBase + (editor.isActive('strike') ? ` ${btnActive}` : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M6 19a6 6 0 0 0 12 0M6 5a6 6 0 0 1 12 0"/></svg>
        </button>
        <button type="button" title="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()} className={btnBase + (editor.isActive('highlight') ? ` ${btnActive}` : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 15h16"/></svg>
        </button>
      </div>
      {divider}
      {/* Paragraph/Headings */}
      <div className={btnGroup}>
        <button type="button" title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()} className={btnBase + (editor.isActive('paragraph') ? ` ${btnActive}` : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 17V7a4 4 0 0 0-8 0v10"/></svg>
        </button>
        <button type="button" title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnBase + (editor.isActive('heading', { level: 1 }) ? ` ${btnActive}` : "")}>H1</button>
        <button type="button" title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnBase + (editor.isActive('heading', { level: 2 }) ? ` ${btnActive}` : "")}>H2</button>
        <button type="button" title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnBase + (editor.isActive('heading', { level: 3 }) ? ` ${btnActive}` : "")}>H3</button>
      </div>
      {divider}
      {/* Lists */}
      <div className={btnGroup}>
        <button type="button" title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnBase + (editor.isActive('bulletList') ? ` ${btnActive}` : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.5"/><path d="M9 12h9"/></svg>
        </button>
        <button type="button" title="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnBase + (editor.isActive('orderedList') ? ` ${btnActive}` : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><text x="4" y="16" fontSize="10" fill="currentColor">1.</text><path d="M9 12h9"/></svg>
        </button>
      </div>
      {divider}
      {/* Code, rule, clear */}
      <div className={btnGroup}>
        <button type="button" title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnBase + (editor.isActive('codeBlock') ? ` ${btnActive}` : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
        </button>
        <button type="button" title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnBase}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12"/></svg>
        </button>
        <button type="button" title="Clear Formatting" onClick={() => editor.chain().focus().unsetAllMarks().run()} className={btnBase}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      {divider}
      {/* Insert */}
      <div className={btnGroup}>
        {/* Insert Image from Link */}
        <button type="button" title="Insert Image from Link" onClick={() => {
          const url = window.prompt('Paste image URL');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} className={btnBase}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M4 20l4-4a3 3 0 0 1 4 0l4 4"/></svg>
        </button>
        {/* Remove Insert Link button */}
      </div>
    </div>
  );
}

export default function BlogAdmin() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [form, setForm] = useState<{
    title: string;
    cover_image: string;
    media_url: string | undefined;
    media_type: string | undefined;
    attachments: any[];
  }>({
    title: "",
    cover_image: "",
    media_url: undefined,
    media_type: undefined,
    attachments: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [coverImageUrlInput, setCoverImageUrlInput] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [attachmentUrlInput, setAttachmentUrlInput] = useState("");
  const [coverUploadStatus, setCoverUploadStatus] = useState<string | null>(null);
  const [attachmentUploadStatus, setAttachmentUploadStatus] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; postId: string | null }>({ open: false, postId: null });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [aiModalOpen, setAIModalOpen] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Paragraph,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg shadow max-w-full h-auto my-4",
        },
      }),
      TiptapLink,
      Underline,
      Highlight,
      CodeBlockLowlight.configure({ lowlight }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] bg-white dark:bg-zinc-900/90 text-gray-900 dark:text-gray-100 rounded border border-gray-200 dark:border-zinc-700 focus:outline-none p-4 shadow-sm transition-all duration-150 placeholder:text-gray-400 dark:placeholder:text-gray-400",
        style: "caret-color: #3b82f6;", // blue-500 for visibility
      },
    },
    // Fix SSR hydration warning
    immediatelyRender: false,
  });

  const POSTS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; name?: string; type?: string; thumb?: string } | null>(null);
  const [isPIPActive, setIsPIPActive] = useState(false);

  // Scroll lock effect for modals
  useEffect(() => {
    const isModalOpen = lightbox?.open || deleteModal.open || aiModalOpen;
    
    if (isModalOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
      
      // Prevent wheel scrolling on the entire page (except for image zoom)
      const preventScroll = (e: WheelEvent) => {
        // Allow zooming if we're in an image viewer container
        const target = e.target as Element;
        const isImageViewer = target?.closest('[data-image-viewer]');
        
        if (!isImageViewer) {
          e.preventDefault();
        }
      };
      
      // Add global wheel event listener
      window.addEventListener('wheel', preventScroll, { passive: false });
      
      // Cleanup function
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('wheel', preventScroll);
      };
    } else {
      // Restore scroll
      document.body.style.overflow = 'unset';
    }
  }, [lightbox?.open, deleteModal.open, aiModalOpen]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        setUser({ email: session.user.email || '' });
      } else {
        setUser(null);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setUser({ email: session.user.email || '' });
      } else {
        setUser(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  // Only update editor content when editingId changes, not on every content change
  useEffect(() => {
    if (editor && editingId !== null) {
      editor.commands.setContent(content || "", false);
      editor.commands.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId, editor]);

  async function fetchPosts() {
    setPostsLoading(true);
    const { data, error } = await supabase
      .from("blogposts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPosts(data);
    setPostsLoading(false);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    setLoginLoading(true);
    setLoginError(null);
    // This uses POST under the hood, credentials are never in the URL
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      setUser(null);
      setLoginError(error?.message || "Login failed. Please try again.");
    } else {
      setUser({ email: data.session.user.email || '' });
    }
    setLoginLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function slugifyFilename(name: string) {
    const normalized = name
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/[^a-zA-Z0-9._-]/g, '-') // replace spaces and invalid chars
      .replace(/-+/g, '-') // collapse dashes
      .replace(/^[-.]+|[-.]+$/g, ''); // trim leading/trailing separators
    return normalized || 'file';
  }

  function makeSafeStoragePath(prefix: string, originalName: string) {
    const safeName = slugifyFilename(originalName);
    return `${prefix}/${Date.now()}-${safeName}`;
  }

  // --- Cover Image Upload Handler ---
  async function handleCoverImageUpload(file: File) {
    setCoverUploadStatus(`Uploading cover: ${file.name} ...`);
    try {
      // If there is an existing cover image, delete it from Supabase storage first (server-side)
      if (form.cover_image) {
        try {
          await fetch('/api/admin/delete-blog-files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cover_image: form.cover_image, attachments: [] }),
          });
          console.log('[Cover Upload] previous cover deleted');
        } catch (delErr) {
          console.warn('[Cover Upload] could not delete previous cover (continuing):', delErr);
        }
      }

      const path = makeSafeStoragePath('cover-images', file.name);
      console.log('[Cover Upload] start', { fileName: file.name, path });
      const { data, error } = await supabase.storage.from('blog-attachments').upload(path, file);
      if (error) {
        console.error("Cover image upload error:", error);
        alert("Cover image upload failed: " + error.message);
        return;
      }
      if (data) {
        const url = supabase.storage.from('blog-attachments').getPublicUrl(path).data.publicUrl;
        console.log('[Cover Upload] success', { url });
        setForm(f => ({ ...f, cover_image: url }));
        setCoverImageFile(null);
      }
    } catch (err: any) {
      console.error('[Cover Upload] unexpected error', err);
      alert('Cover image upload failed unexpectedly. See console for details.');
    } finally {
      setCoverUploadStatus(null);
    }
  }

  // --- Attachment Upload Handler (multiple) ---
  async function handleAttachmentFiles(files: FileList | null) {
    if (!files) return;
    const uploaded: any[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.')?.pop();
        const path = makeSafeStoragePath('attachments', file.name);
        setAttachmentUploadStatus(`Uploading ${i + 1}/${files.length}: ${file.name}`);
        console.log('[Attachment Upload] start', { index: i, fileName: file.name, path });
        const { data, error } = await supabase.storage.from('blog-attachments').upload(path, file);
        if (error) {
          console.error(`Attachment upload error for ${file.name}:`, error);
          alert(`Attachment upload failed for ${file.name}: ` + error.message);
          continue;
        }
        if (data) {
          const url = supabase.storage.from('blog-attachments').getPublicUrl(path).data.publicUrl;
          console.log('[Attachment Upload] success', { index: i, url });
          
          let attachmentData = { url, name: file.name, type: file.type, ext };
          
          // If it's an audio file, try to extract thumbnail
          if (file.type.startsWith('audio/')) {
            try {
              setAttachmentUploadStatus(`Extracting thumbnail for: ${file.name}`);
              const thumbnailResponse = await fetch('/api/extract-music-thumbnail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  audioUrl: url, 
                  audioName: file.name 
                }),
              });
              
              // if (thumbnailResponse.ok) {
              //   const thumbnailData = await thumbnailResponse.json();
              //   if (thumbnailData.success) {
              //     // Add thumbnail and metadata to attachment
              //     attachmentData = {
              //       ...attachmentData,
              //       thumbnail: thumbnailData.thumbnail.url,
              //       metadata: thumbnailData.metadata
              //     };
              //     console.log('[Thumbnail Extraction] success', thumbnailData);
              //   } else {
              //     console.log('[Thumbnail Extraction] no artwork found for', file.name);
              //   }
              // }
            } catch (thumbnailError) {
              console.warn('[Thumbnail Extraction] failed for', file.name, ':', thumbnailError);
              // Continue without thumbnail - not a critical error
            }
          }
          
          uploaded.push(attachmentData);
        }
      }
      if (uploaded.length > 0) {
        setForm(f => ({ ...f, attachments: [...(f.attachments || []), ...uploaded] }));
      }
    } catch (err: any) {
      console.error('[Attachment Upload] unexpected error', err);
      alert('Attachment upload failed unexpectedly. See console for details.');
    } finally {
      setAttachmentUploadStatus(null);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    // If a cover image file is selected, upload it
    if (coverImageFile) await handleCoverImageUpload(coverImageFile);
    // If a cover image URL is entered, set it
    if (coverImageUrlInput) setForm(f => ({ ...f, cover_image: coverImageUrlInput }));
    // Now submit as before
    const postData = { ...form, content: editor?.getHTML() || "", created_at: new Date().toISOString() };
    if (editingId) {
      await supabase.from("blogposts").update(postData).eq("id", editingId);
      setEditingId(null);
    } else {
      await supabase.from("blogposts").insert([postData]);
    }
    setForm({ title: "", cover_image: "", media_url: undefined, media_type: undefined, attachments: [] });
    setContent("");
    setCoverImageFile(null);
    setCoverImageUrlInput("");
    setAttachmentUrlInput("");
    if (editor) editor.commands.setContent("");
    fetchPosts();
  }

  async function handleEdit(post: any) {
    setForm({
      title: post.title,
      cover_image: post.cover_image || "",
      media_url: post.media_url || undefined,
      media_type: post.media_type || undefined,
      attachments: post.attachments || [],
    });
    setContent(post.content || "");
    setEditingId(post.id);
    if (editor) {
      editor.commands.setContent(post.content || "", false);
      editor.commands.focus();
    }
  }

  // Calculate paginated posts
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  function AttachmentsGrid({ attachments, onPreview, onRemove }: { attachments: { url: string; name?: string; type?: string; ext?: string }[]; onPreview?: (att: { url: string; name?: string; type?: string; ext?: string }) => void; onRemove: (i: number) => void; }) {
    return (
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attachments.map((att, idx) => {
          const isImage = att?.type?.startsWith?.('image');
          const isVideo = att?.type?.startsWith?.('video');
          return (
            <div key={idx} className="flex items-center justify-between gap-3 rounded-lg bg-muted dark:bg-secondary p-2 border border-border dark:border-border shadow-sm">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{att.name}</div>
                <div className="text-xs text-muted-foreground truncate">{att.type || att.ext || 'attachment'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded bg-background border border-border hover:bg-accent"
                  onClick={() => onPreview?.(att)}
                >
                  <Eye className="w-5 h-5" />
                </button>
                <a
                  href={att.url}
                  download={att.name || true}
                  className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="w-4 h-5 " />
                </a>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-150"
                  aria-label="Remove Attachment"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-background text-foreground min-h-screen">
      {lightbox?.open && lightbox?.src && (
        <div
          className={`fixed inset-0 z-50 grid place-items-center p-4 transition-opacity duration-200 ${
            lightbox.type?.startsWith('video')
              ? isPIPActive
                ? 'bg-transparent opacity-0 pointer-events-none'
                : 'bg-background/30 dark:bg-black/30 backdrop-blur-sm opacity-100'
              : 'bg-background/30 dark:bg-black/30 backdrop-blur-sm opacity-100'
          }`}
        >
          <div className="relative w-full max-w-5xl">
            {lightbox.type?.startsWith('video') ? (
              <NativeVideoPlayer
                src={lightbox.src}
                name={lightbox.name}
                className={isPIPActive ? "absolute -left-[9999px] w-[1px] h-[1px] opacity-0 pointer-events-none" : "w-full h-[60vh] sm:h-[70vh] rounded-xl overflow-hidden"}
                onClose={() => {
                  setLightbox(null);
                  setIsPIPActive(false);
                }}
                onPIPChange={(isActive) => {
                  setIsPIPActive(isActive);
                }}
              />
            ) : lightbox.type?.startsWith('audio') ? (
              <div className="relative w-full max-w-2xl mx-auto">
                <NativeAudioPlayer 
                  src={lightbox.src} 
                  name={lightbox.name} 
                  className="w-full"
                  thumbnail={lightbox.thumb}
                  onClose={() => setLightbox(null)}
                />
              </div>
            ) : (
              <ImageViewer
                src={lightbox.src}
                alt={lightbox.name}
                className="w-full h-[60vh] sm:h-[70vh] rounded-xl overflow-hidden"
                onClose={() => setLightbox(null)}
              />
            )}
          </div>
        </div>
      )}
      <TitleBar title="Blog Admin">
        {user && (
          <Button
            variant="ghost"
            className="ml-4 p-2 rounded-full text-primary dark:text-primary-foreground hover:bg-primary/10 dark:hover:bg-primary/20 hover:scale-110 hover:opacity-80 transition-all duration-150"
            onClick={handleLogout}
            aria-label="Sign Out"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        )}
      </TitleBar>
      {!user ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-blue-50/80 via-background/90 to-blue-100/60 dark:from-blue-950/40 dark:via-background/80 dark:to-blue-900/30 shadow-xl border border-border p-8 flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">Admin Login</h2>
              <p className="text-base text-muted-foreground mb-4">Welcome back! Please sign in to manage your blog.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 transition pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-500 focus:outline-none"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-lg font-semibold rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-150 flex items-center justify-center gap-2"
                disabled={loginLoading}
              >
                {loginLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
            {loginError && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500 text-red-700 dark:text-red-300 rounded-lg px-4 py-3 shadow-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" /></svg>
                <span className="text-sm font-medium">{loginError}</span>
                <button
                  className="ml-auto text-xs px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-800 transition"
                  onClick={() => setLoginError(null)}
                  aria-label="Dismiss error"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              Logged in as <strong>{user.email}</strong>
            </span>
          </div>
          {/* Floating AI button */}
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 z-50 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setAIModalOpen(true)}
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-7 h-7 animate-pulse" />
          </Button>
          <AIChatModal open={aiModalOpen} onClose={() => setAIModalOpen(false)} onInsert={text => {
            setAIModalOpen(false);
            editor?.commands.insertContent(text);
          }} />
          {/* Responsive layout: editor first on mobile, posts second */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
            {/* Post Editor (only for authenticated users) - order first on mobile */}
            <div className="order-1 md:order-none">
              <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-background via-muted/60 to-background/80 shadow-xl border-0 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold tracking-tight mb-1">{editingId ? "Edit Post" : "New Post"}</CardTitle>
                  <CardDescription className="mb-2 text-base">Share your latest thoughts, stories, or updates. Make it memorable and beautiful!</CardDescription>
                </CardHeader>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (coverImageFile) await handleCoverImageUpload(coverImageFile);
                  if (coverImageUrlInput) setForm(f => ({ ...f, cover_image: coverImageUrlInput }));
                  handleSubmit(e);
                }}>
                  <CardContent className="space-y-5">
                  <div>
                      <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                        placeholder="Enter a captivating title..."
                    />
                  </div>
                  {/* Excerpt removed from UI as requested */}
                  <div>
                      <label htmlFor="cover_image" className="block text-sm font-medium text-muted-foreground mb-1">Cover Image</label>
                      {coverUploadStatus && (
                        <div className="text-xs text-muted-foreground mb-1">{coverUploadStatus}</div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setCoverImageFile(file);
                            if (file) handleCoverImageUpload(file);
                          }}
                          className="sr-only"
                        />
                        <span className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg shadow-inner hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                          <Paperclip className="w-5 h-5 text-blue-500" />
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Paste image URL"
                          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={coverImageUrlInput}
                        onChange={e => setCoverImageUrlInput(e.target.value)}
                        onBlur={() => {
                          if (coverImageUrlInput) setForm(f => ({ ...f, cover_image: coverImageUrlInput }));
                        }}
                      />
                    </div>
                    {form.cover_image && (
                        <div className="mt-3 flex justify-center"><img src={form.cover_image} alt="cover preview" className="max-h-40 rounded-xl shadow" /></div>
                    )}
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Content</label>
                      <div className="rounded-xl border border-border bg-background/80 shadow-inner">
                    <TiptapMenuBar editor={editor} />
                        <div className="overflow-hidden rounded-b-xl">
                          <div className="prose dark:prose-invert prose-ul:pl-6 prose-ol:pl-6 max-w-none">
                      <EditorContent editor={editor} key={editingId || 'new'} />
                          </div>
                        </div>
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Attachments <span className="text-xs text-muted-foreground">(optional, multiple)</span></label>
                      {attachmentUploadStatus && (
                        <div className="text-xs text-muted-foreground mb-1">{attachmentUploadStatus}</div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="file"
                          multiple
                          onChange={e => handleAttachmentFiles(e.target.files)}
                          className="sr-only"
                        />
                        <span className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg shadow-inner hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                          <Paperclip className="w-5 h-5 text-blue-500" />
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Paste attachment URL"
                          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={attachmentUrlInput}
                        onChange={e => setAttachmentUrlInput(e.target.value)}
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold shadow hover:bg-primary/90 transition flex items-center justify-center"
                        aria-label="Add Attachment"
                        onClick={() => {
                          if (attachmentUrlInput) {
                            const url = attachmentUrlInput.trim();
                            const withoutQuery = url.split('?')[0].toLowerCase();
                            const ext = withoutQuery.includes('.') ? withoutQuery.split('.').pop() || '' : '';
                            let type: string = 'attachment';
                            if (ext === 'pdf') type = 'application/pdf';
                            else if (['jpg','jpeg','png','gif','webp','svg','bmp','avif'].includes(ext)) type = `image/${ext}`;
                            else if (['mp4','webm','ogg','mov','mkv'].includes(ext)) type = `video/${ext}`;
                            else if (['mp3','wav','m4a','aac','flac','ogg'].includes(ext)) type = `audio/${ext}`;
                            else if (['zip','rar','7z','tar','gz','bz2','xz'].includes(ext)) type = 'archive';
                            else if (/^https?:\/\//i.test(url)) type = 'link';
                            setForm(f => ({ ...f, attachments: [...(f.attachments || []), { url, name: url, type, ext }] }));
                            setAttachmentUrlInput("");
                          }
                        }}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {form.attachments && form.attachments.length > 0 && (
                        <AttachmentsGrid
                          attachments={form.attachments}
                          onPreview={(att: { url: string; name?: string; type?: string; ext?: string }) => {
                            if (att?.type?.startsWith?.('image')) {
                              setLightbox({ open: true, src: att.url, name: att.name, type: 'image' });
                            } else if (att?.type?.startsWith?.('video')) {
                              setLightbox({ open: true, src: att.url, name: att.name, type: 'video' });
                            } else if (att?.type?.startsWith?.('audio')) {
                              console.log('[AUDIO PREVIEW DEBUG] Audio attachment:', att);
                              
                              // Check if the attachment has an extracted thumbnail
                              let thumb = att.thumbnail;
                              console.log('[AUDIO PREVIEW DEBUG] Direct thumbnail from attachment:', thumb);
                              
                              // If no direct thumbnail, try to find matching image attachment by filename
                              if (!thumb) {
                                console.log('[AUDIO PREVIEW DEBUG] No direct thumbnail, searching for matching image...');
                                const getBase = (s?: string) => {
                                  if (!s) return '';
                                  try {
                                    const u = new URL(s, s.startsWith('http') ? undefined : 'http://local');
                                    s = u.pathname;
                                  } catch {}
                                  const last = s.split('/').pop() || s;
                                  return (last.includes('.') ? last.substring(0, last.lastIndexOf('.')) : last).toLowerCase();
                                };
                                const base = getBase(att.name || att.url);
                                console.log('[AUDIO PREVIEW DEBUG] Audio base name:', base);
                                const img = (form.attachments || []).find((x: any) => {
                                  const isImage = x?.type?.startsWith?.('image');
                                  const matchesBase = getBase(x.name || x.url) === base;
                                  console.log('[AUDIO PREVIEW DEBUG] Checking attachment:', { name: x.name, type: x.type, isImage, matchesBase, base: getBase(x.name || x.url) });
                                  return isImage && matchesBase;
                                });
                                thumb = img?.url;
                                console.log('[AUDIO PREVIEW DEBUG] Found matching image:', img?.url);
                              }
                              
                              // DO NOT fallback to cover image - let the audio player handle its own fallback
                              console.log('[AUDIO PREVIEW DEBUG] Final thumbnail to pass:', thumb);
                              setLightbox({ open: true, src: att.url, name: att.name, type: 'audio', thumb });
                            } else {
                              window.open(att.url, '_blank');
                            }
                          }}
                          onRemove={(i) => setForm(f => ({ ...f, attachments: f.attachments.filter((_, idx) => idx !== i) }))}
                        />
                    )}
                  </div>
                  </CardContent>
                  <CardFooter className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 flex items-center justify-center text-base rounded-lg shadow-md"
                      aria-label={editingId ? "Update Post" : "Publish Post"}
                    >
                      {editingId ? <Check className="w-6 h-6" /> : <Send className="w-6 h-6" />}
                    </Button>
                    {editingId ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setForm({ title: "", cover_image: "", media_url: undefined, media_type: undefined, attachments: [] });
                          setContent("");
                          setCoverImageFile(null);
                          setCoverImageUrlInput("");
                          setAttachmentUrlInput("");
                          if (editor) editor.commands.setContent("");
                        }}
                        className="flex-1 flex items-center justify-center text-base rounded-lg shadow-md"
                        aria-label="Cancel Edit"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setForm({ title: "", cover_image: "", media_url: undefined, media_type: undefined, attachments: [] });
                          setContent("");
                          setCoverImageFile(null);
                          setCoverImageUrlInput("");
                          setAttachmentUrlInput("");
                          if (editor) editor.commands.setContent("");
                        }}
                        className="flex-1 flex items-center justify-center text-base rounded-lg shadow-md"
                        aria-label="Clear Form"
                      >
                        <RefreshCw className="w-6 h-6" />
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Card>
            </div>
            {/* Posts Table - order second on mobile */}
            <div className="order-2 md:order-none">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">All Posts</h2>
                {postsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
                    {[...Array(POSTS_PER_PAGE)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-3xl border border-border bg-gradient-to-br from-background to-muted/40 shadow-lg flex flex-col p-0 overflow-hidden"
                        style={{ minHeight: 400 }}
                      >
                        <div className="h-[44%] w-full bg-muted/60" />
                        <div className="p-6 flex flex-col flex-1">
                          <div className="h-7 w-2/3 bg-muted/50 rounded mb-3" />
                          <div className="h-4 w-full bg-muted/40 rounded mb-1" />
                          <div className="h-4 w-full bg-muted/40 rounded mb-1" />
                          <div className="h-4 w-3/4 bg-muted/40 rounded mb-4" />
                          <div className="flex-1" />
                          <div className="flex justify-end">
                            <div className="h-4 w-1/3 bg-muted/30 rounded mt-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <p className="text-gray-500 text-sm">No posts found.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
                      {paginatedPosts.map((post) => (
                        <Link href={`/blog/${post.id}`} key={post.id} target="_blank" rel="noopener noreferrer" className="block group">
                          <BlogCard
                            post={post}
                            previewOnly={true}
                            onEdit={() => handleEdit(post)}
                            onDelete={() => setDeleteModal({ open: true, postId: post.id })}
                          />
                        </Link>
                      ))}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Delete Confirmation Modal */}
          {deleteModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-card dark:bg-zinc-900 rounded-lg shadow-lg max-w-sm w-full p-6 relative flex flex-col items-center border border-border">
                <h3 className="text-lg font-semibold mb-4 text-center">Are you sure you want to delete this post?</h3>
                <div className="flex gap-4 mt-2">
                  <Button
                    variant="destructive"
                    disabled={deleting}
                    onClick={async () => {
                      if (!deleteModal.postId) return;
                      setDeleting(true);
                      try {
                        // Fetch the post to get cover_image and attachments
                        const { data: postToDelete } = await supabase
                          .from("blogposts")
                          .select("cover_image, attachments")
                          .eq("id", deleteModal.postId)
                          .single();
                        // Clean up storage
                        if (postToDelete) {
                          await fetch('/api/admin/delete-blog-files', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              cover_image: postToDelete.cover_image,
                              attachments: postToDelete.attachments,
                            }),
                          });
                        }
                        // Delete the post from the database
                        await supabase.from("blogposts").delete().eq("id", deleteModal.postId);
                        fetchPosts();
                      } catch (err) {
                        console.error('Error during post deletion:', err);
                      } finally {
                        setDeleting(false);
                        setDeleteModal({ open: false, postId: null });
                      }
                    }}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteModal({ open: false, postId: null })}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
