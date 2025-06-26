import React from "react";

export type MediaModalProps = {
  open: boolean;
  onClose: () => void;
  file: {
    url: string;
    name: string;
    type: string;
    ext?: string;
  } | null;
};

export default function MediaModal({ open, onClose, file }: MediaModalProps) {
  if (!open || !file) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-lg w-full p-4 relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-primary focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div className="w-full flex flex-col items-center">
          {file.type?.startsWith("image") ? (
            <img src={file.url} alt={file.name} className="max-h-96 rounded mb-2" />
          ) : file.type?.startsWith("video") ? (
            <video src={file.url} controls autoPlay className="max-h-96 rounded mb-2" />
          ) : file.type?.startsWith("audio") ? (
            <audio src={file.url} controls className="w-full mb-2" />
          ) : file.ext === "pdf" ? (
            <iframe src={file.url} title={file.name} className="w-full h-96 mb-2" />
          ) : (
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Open File</a>
          )}
          <div className="text-xs text-center text-muted-foreground mt-2">{file.name}</div>
        </div>
      </div>
    </div>
  );
}
