import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send as Telegram, StopCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatModal({ open, onClose, onInsert }: { open: boolean; onClose: () => void; onInsert: (text: string) => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamedContent, open]);

  async function handleSend() {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setStreaming(true);
    setError(null);
    setStreamedContent("");
    abortControllerRef.current = new AbortController();
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, stream: true }),
        signal: abortControllerRef.current.signal,
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      let aiContent = "";
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = new TextDecoder().decode(value);
          aiContent += chunk;
          setStreamedContent(aiContent);
        }
      }
      setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
      setStreamedContent("");
    } catch (err: any) {
      if (err.name !== "AbortError") setError("Failed to contact AI assistant.");
      setStreamedContent("");
    }
    setLoading(false);
    setStreaming(false);
    abortControllerRef.current = null;
  }

  function stopGenerating() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStreaming(false);
      setLoading(false);
      setStreamedContent("");
    }
  }

  function handleInsert(content: string) {
    onInsert(content);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background dark:bg-zinc-900 rounded-lg shadow-lg max-w-md w-full p-0 relative flex flex-col border border-border h-[80vh] max-h-[600px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <MessageCircle className="w-6 h-6 text-primary" />
            AI Writing Assistant
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 focus:outline-none transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-muted/40">
          {messages.length === 0 && !streamedContent && (
            <div className="text-center text-muted-foreground text-sm">Start a conversation with your AI assistant.</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}> 
              <div className={`rounded-xl px-4 py-2 max-w-[80%] whitespace-pre-line ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-border"}`}>
                {msg.role === "assistant" ? (
                  <span dangerouslySetInnerHTML={{ __html: formatAIContent(msg.content) }} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {streamedContent && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-2 max-w-[80%] bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-border animate-pulse">
                <span dangerouslySetInnerHTML={{ __html: formatAIContent(streamedContent) }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {error && <div className="text-red-600 px-6 pb-2 text-sm">{error}</div>}
        <form
          className="flex items-center gap-2 px-6 py-4 border-t border-border bg-background"
          onSubmit={e => { e.preventDefault(); if (!loading) handleSend(); }}
        >
          <textarea
            ref={textareaRef}
            className="flex-1 rounded border border-border p-2 resize-none min-h-[40px] max-h-32"
            rows={1}
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          {streaming ? (
            <button
              type="button"
              className="px-3 py-2 rounded bg-red-600 text-white font-semibold flex items-center justify-center"
              onClick={stopGenerating}
              aria-label="Stop"
            >
              <StopCircle className="w-5 h-5 fill-red-600" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-3 py-2 rounded bg-primary text-white font-semibold disabled:opacity-60 flex items-center justify-center"
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <Telegram className="w-5 h-5" />
            </button>
          )}
        </form>
        {messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
          <button
            className="absolute left-1/2 -translate-x-1/2 bottom-24 px-4 py-2 rounded bg-green-600 text-white font-semibold shadow"
            onClick={() => handleInsert(messages[messages.length - 1].content)}
          >
            Insert Last AI Response
          </button>
        )}
      </div>
    </div>
  );
}

function formatAIContent(content: string): string {
  // Basic formatting: paragraphs, line breaks, code blocks
  // Convert triple backticks to <pre><code>
  let html = content
    .replace(/```([\s\S]*?)```/g, (match, code) => `<pre class='bg-zinc-900 text-white rounded p-3 overflow-x-auto mb-2'><code>${escapeHtml(code)}</code></pre>`) // code blocks
    .replace(/\n\n/g, '</p><p>') // paragraphs
    .replace(/\n/g, '<br/>'); // line breaks
  html = `<p>${html}</p>`;
  return html;
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>'"]/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[tag] || tag));
} 