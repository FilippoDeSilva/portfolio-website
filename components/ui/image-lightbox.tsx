"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";

export interface ImageLightboxProps {
  src: string;
  alt?: string;
  name?: string;
  open: boolean;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, name, open, onClose }: ImageLightboxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(0.8);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const delta = -e.deltaY;
      setScale((s) => Math.min(5, Math.max(0.5, s + (delta > 0 ? 0.1 : -0.1))));
    }
    const el = containerRef.current;
    if (open && el) {
      el.addEventListener("wheel", onWheel, { passive: false });
    }
    return () => {
      if (el) el.removeEventListener("wheel", onWheel as any);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [open]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setTranslate({ x: e.clientX - start.x, y: e.clientY - start.y });
  };
  const onMouseUp = () => setIsPanning(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="absolute inset-0" onClick={onClose} />
      <div ref={containerRef} className="relative max-w-[90vw] sm:max-w-[85vw] max-h-[90vh] p-4 bg-card border border-border rounded-xl shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground shadow hover:opacity-90"
          aria-label="Close"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div
          className="relative overflow-hidden rounded-lg bg-black cursor-grab select-none w-[92vw] sm:w-[85vw] max-w-[1100px] h-[70vh] sm:h-[75vh] max-h-[85vh]"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt || name || "image"}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none z-0"
            draggable={false}
            style={{ transform: `translate(-50%, -50%) translate(${translate.x}px, ${translate.y}px) scale(${scale})` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-muted hover:bg-muted/80 text-foreground"
            onClick={() => setScale((s) => Math.min(5, s + 0.1))}
            aria-label="Zoom In"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-muted hover:bg-muted/80 text-foreground"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            aria-label="Zoom Out"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-muted hover:bg-muted/80 text-foreground"
            onClick={() => { setScale(1); setTranslate({ x: 0, y: 0 }); }}
            aria-label="Reset"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <a
            href={src}
            download={name || true}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Download"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}


