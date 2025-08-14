"use client";

import React, { useMemo } from "react";
import Plyr from "plyr-react";

export interface PlyrPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function PlyrPlayer({ src, poster, className }: PlyrPlayerProps) {
  const source = useMemo(
    () => ({
      type: "video",
      sources: [{ src, type: "video/mp4" }],
      poster,
    }),
    [src, poster]
  );

  return (
    <div className={className} style={{ ["--plyr-color-main" as any]: "hsl(var(--primary))" }}>
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
        } as any}
      />
    </div>
  );
}



