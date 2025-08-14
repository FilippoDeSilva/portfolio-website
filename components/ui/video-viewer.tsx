"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false }) as any;

export interface VideoViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  name?: string;
  onClose?: () => void;
  className?: string;
}

export default function VideoViewer({ src, name, onClose, className, ...props }: VideoViewerProps) {
  const source = useMemo(
    () => ({
      type: "video",
      sources: [{ src, type: "video/mp4" }],
    }),
    [src]
  );

  return (
    <div className={`relative ${className || ""}`} style={{ ["--plyr-color-main" as any]: "hsl(var(--primary))" }} {...props}>
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

      {/* Video name display - top left corner */}
      {name && (
        <div className="absolute top-2 left-2 text-white text-sm bg-black/70 px-3 py-1 rounded-md z-10 font-medium">
          {name}
        </div>
      )}

      {/* Video container with Plyr */}
      <div className="relative w-full h-full overflow-hidden bg-black rounded-lg">
        <Plyr
          source={source as any}
          options={{
            controls: [
              "play-large", "play", "progress", "current-time", "mute", "volume",
              "settings", "pip", "fullscreen",
            ],
            settings: ["quality", "speed"],
            clickToPlay: true,
            hideControls: false,
            inactivityTimeout: 0,
            tooltips: { controls: true, seek: true },
          } as any}
        />
      </div>
    </div>
  );
}
