"use client";

import React, { useState, useRef, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";

export interface ImageViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  onClose?: () => void;
  className?: string;
}

export default function ImageViewer({ src, alt, onClose, className, ...props }: ImageViewerProps) {
  const [scale, setScale] = useState(0.8); // Changed from 1 to 0.8 for original size
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleReset = useCallback(() => {
    setScale(0.8); // Reset to 0.8 (original size) instead of 1
    setTranslate({ x: 0, y: 0 });
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [src, alt]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
    }
  }, [scale, translate]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, scale, dragStart]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className={`relative ${className || ""}`} {...props}>
      {/* Close button - top right corner */}
      {onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 z-50 inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground shadow hover:opacity-90"
          aria-label="Close"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Image container with zoom/pan */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden bg-black cursor-grab select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt || "image"}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
          draggable={false}
          style={{
            transform: `translate(-50%, -50%) translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          }}
        />
      </div>

      {/* Controls - bottom center */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button
          onClick={handleZoomIn}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/80 text-primary-foreground shadow hover:bg-primary transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/80 text-primary-foreground shadow hover:bg-primary transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/80 text-primary-foreground shadow hover:bg-primary transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/80 text-primary-foreground shadow hover:bg-primary transition-colors"
          title="Download"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}



