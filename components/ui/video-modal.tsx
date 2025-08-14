"use client";

import React from "react";
import { X } from "lucide-react";
import VideoPlayer from "@/components/ui/video-player";

export interface VideoModalProps {
  open: boolean;
  src: string;
  name?: string;
  poster?: string;
  onClose: () => void;
}

export default function VideoModal({ open, src, name, poster, onClose }: VideoModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative max-w-[85vw] max-h-[85vh] w-[90vw] sm:w-auto p-4 bg-card border border-border rounded-xl shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground shadow hover:opacity-90"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative z-10 overflow-hidden rounded-lg bg-black" style={{ width: "min(65vw, 900px)", height: "min(60vh, 600px)" }}>
          <VideoPlayer src={src} poster={poster} className="w-full h-full" />
        </div>
        {name && (
          <div className="mt-2 text-xs text-muted-foreground truncate">{name}</div>
        )}
      </div>
    </div>
  );
}


