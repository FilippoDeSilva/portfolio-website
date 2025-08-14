"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false }) as any;

export interface PlyrPlayerProps {
  src: string;
  poster?: string;
  name?: string;
  className?: string;
  onClose?: () => void;
  onPIPChange?: (isActive: boolean) => void; // NEW
}

export default function PlyrPlayer({
  src,
  poster,
  name,
  className,
  onClose,
  onPIPChange,
}: PlyrPlayerProps) {
  const [isPIPActive, setIsPIPActive] = useState(false);
  const plyrRef = useRef<any>(null);

  const source = useMemo(
    () => ({
      type: "video",
      sources: [{ src, type: "video/mp4" }],
      poster,
    }),
    [src, poster]
  );

  // Attach event listeners after ref is set
  useEffect(() => {
    if (!plyrRef.current) return;

    // Get Plyr instance
    const plyrInstance =
      plyrRef.current.plyr || plyrRef.current || null;

    const handleEnterPIP = () => {
      console.log("Plyr enterpip event fired");
      setIsPIPActive(true);
      onPIPChange?.(true); // notify parent
    };

    const handleLeavePIP = () => {
      console.log("Plyr leavepip event fired");
      setIsPIPActive(false);
      onPIPChange?.(false); // notify parent
    };

    if (plyrInstance && typeof plyrInstance.on === "function") {
      plyrInstance.on("enterpip", handleEnterPIP);
      plyrInstance.on("leavepip", handleLeavePIP);
    }

    // Native PIP events fallback
    const videoElement = plyrInstance?.media || plyrInstance;
    if (videoElement?.tagName === "VIDEO") {
      videoElement.addEventListener("enterpictureinpicture", handleEnterPIP);
      videoElement.addEventListener("leavepictureinpicture", handleLeavePIP);

      return () => {
        videoElement.removeEventListener("enterpictureinpicture", handleEnterPIP);
        videoElement.removeEventListener("leavepictureinpicture", handleLeavePIP);
      };
    }
  }, [onPIPChange]);

  const shouldShowModalUI = !isPIPActive;

  return (
    <div
      className={`relative ${className || ""} ${
        shouldShowModalUI ? "" : "bg-transparent shadow-none"
      }`}
      style={{
        ["--plyr-color-main" as any]: "hsl(var(--primary))",
      }}
    >
      {shouldShowModalUI && name && (
        <div className="absolute top-2 left-2 text-white text-sm bg-black/70 px-3 py-1 rounded-md z-10 font-medium">
          {name}
        </div>
      )}

      {shouldShowModalUI && onClose && (
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

      <Plyr
        source={source as any}
        options={{
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "pip",
            "fullscreen",
          ],
          settings: ["quality", "speed"],
          clickToPlay: true,
          hideControls: false,
          inactivityTimeout: 0,
          tooltips: { controls: true, seek: true },
        }}
        ref={plyrRef}
      />
    </div>
  );
}
