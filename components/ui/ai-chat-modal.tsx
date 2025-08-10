import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send as Telegram, StopCircle, Plus, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { marked } from "marked";

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
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Available models with descriptions - updated with latest options
  const availableModels = [
    { id: "gpt-4o", name: "GPT-4 Omni", description: "Latest & most capable", recommended: true },
    { id: "gpt-4o-mini", name: "GPT-4 Omni Mini", description: "Fast & efficient" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "Powerful & reliable" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fastest & most affordable" }
  ];

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 100); // Small delay for browser rendering
    }
  }, [open]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [messages, streamedContent, open]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showModelDropdown && !(event.target as Element).closest('.model-dropdown')) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModelDropdown]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setStreaming(true);
    setError(null);
    setStreamedContent("");

    // Detect if the user is explicitly asking for a blog post, brainstorm, or outline
    const blogKeywords = [
      "write a blog",
      "draft a blog",
      "blog post",
      "brainstorm",
      "outline",
      "article",
      "generate a post",
      "can you write",
      "please write",
      "create a blog"
    ];
    const isBlogRequest = blogKeywords.some(keyword =>
      input.toLowerCase().includes(keyword)
    );

    let prompt = input;
    if (isBlogRequest) {
      const blogInstruction = `Write the response as a ready-to-publish Markdown blog post written by the blog's human author. 
Use clear headings, bullet points or numbered lists when helpful, and include relevant links where appropriate. 
Maintain a warm, cozy, and professional tone throughout.

Do not refer to the AI or explain the writing process. 
Write naturally, as if the blog author is speaking directly to their readers. 
The final post should be polished and require little to no editing before publishing.`;
      prompt = `${blogInstruction}\n\n${input}`;
    }

    abortControllerRef.current = new AbortController();
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, stream: true, model: selectedModel }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        let errorMsg = `Error: ${res.status} ${res.statusText}`;
        try {
          const errorJson = await res.json();
          errorMsg = errorJson.error || errorMsg;
        } catch {
          // Ignore if the response is not JSON
        }
        throw new Error(errorMsg);
      }

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          aiContent += chunk;
          setStreamedContent(aiContent);
        }
      }
      if (aiContent) {
        setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
      }
      setStreamedContent("");
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(`Sorry, an error occurred: ${err.message || "Please try again."}`);
      }
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
    const html = typeof marked.parse === 'function' ? marked.parse(content) : marked(content);
    onInsert(html as string);
    setTimeout(() => textareaRef.current?.focus(), 100);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
    
    // Keyboard shortcuts for model selection
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case '1':
          e.preventDefault();
          setSelectedModel('gpt-4o');
          break;
        case '2':
          e.preventDefault();
          setSelectedModel('gpt-4o-mini');
          break;
        case '3':
          e.preventDefault();
          setSelectedModel('gpt-4-turbo');
          break;
        case '4':
          e.preventDefault();
          setSelectedModel('gpt-3.5-turbo');
          break;
      }
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background dark:bg-zinc-900 rounded-lg shadow-lg max-w-2xl w-full p-0 relative flex flex-col border border-border h-[90vh] max-h-[800px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
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
        
        {/* Model Selection UI */}
        <div className="px-6 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-muted-foreground">AI Model:</span>
              <p className="text-xs text-muted-foreground mt-1">
                {availableModels.find(m => m.id === selectedModel)?.description}
              </p>
            </div>
            <div className="relative model-dropdown">
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-border rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <span className="font-medium">
                  {availableModels.find(m => m.id === selectedModel)?.name}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showModelDropdown && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-zinc-800 border border-border rounded-md shadow-lg z-10">
                  {availableModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors ${
                        selectedModel === model.id ? 'bg-primary/10 border-l-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.name}</span>
                            {model.recommended && (
                              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-muted/40">
          {messages.length === 0 && !streamedContent && (
            <div className="text-center text-muted-foreground text-sm">Start a conversation with your AI assistant.</div>
          )}
          {/* AI/Chat messages */}
          <>
            {messages.map((msg, idx) => {
              return (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`relative rounded-xl px-4 py-2 max-w-[80%] whitespace-pre-line break-words ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-border"}`}>
                    {msg.role === "assistant" ? (
                      <>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        <button
                          className="absolute bottom-0 -right-2 p-1 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-110"
                          title="Insert this response into the blog editor"
                          onClick={() => handleInsert(msg.content)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              );
            })}
          </>
          {loading && !streamedContent && (
            <div className="flex justify-start">
                <div className="rounded-xl px-4 py-2 bg-white dark:bg-zinc-800 border border-border">
                    <div className="flex items-center justify-center gap-2 h-6">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0s]"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
          )}
          {streamedContent && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-2 max-w-[80%] bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-border animate-pulse break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamedContent}</ReactMarkdown>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {error && <div className="text-red-600 px-6 pb-2 text-sm">{error}</div>}
        <div className="px-6 pt-2 pb-0 text-xs text-muted-foreground">
          <span>AI will generate a ready-to-post Markdown blog article.</span>
          <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
            Using {availableModels.find(m => m.id === selectedModel)?.name}
          </span>
          <div className="mt-1 text-xs text-muted-foreground">
            <span>💡 Tip: Use Ctrl+1-4 to quickly switch models</span>
          </div>
        </div>
        <form
          className="flex items-center gap-2 px-6 py-4 border-t border-border bg-background"
          onSubmit={e => { e.preventDefault(); if (!loading) handleSend(); }}
        >
          <textarea
            ref={textareaRef}
            className="flex-1 rounded border border-border p-2 resize-none min-h-[100px] max-h-[100px] text-base px-4 py-3 bg-white dark:bg-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/30 transition placeholder:text-gray-400 dark:placeholder:text-gray-400"
            rows={4}
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{ height: '120px', overflow: 'auto' }}
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
      </div>
    </div>
  );
} 