"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Download } from "lucide-react";

export interface NativeAudioPlayerProps {
  src: string;
  name?: string;
  className?: string;
  onClose?: () => void;
  thumbnail?: string;
  artist?: string;
  album?: string;
  title?: string;
}

export default function NativeAudioPlayer({ src, name, className, thumbnail, artist, album, title }: NativeAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => setCurrentTime(a.currentTime || 0);
    const onVol = () => {
      setVolume(a.volume);
      setMuted(a.muted);
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("volumechange", onVol);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("volumechange", onVol);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  }, []);

  const onChangeVolume = useCallback((val: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = Math.min(1, Math.max(0, val));
    if (a.volume === 0) a.muted = true;
    setVolume(a.volume);
    setMuted(a.muted);
  }, []);

  const onSeek = useCallback((val: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(duration, Math.max(0, val));
    setCurrentTime(a.currentTime);
  }, [duration]);

  const fmtTime = useMemo(() => (secs: number) => {
    if (!isFinite(secs)) return "0:00";
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    const m = Math.floor((secs / 60) % 60).toString();
    const h = Math.floor(secs / 3600);
    return h > 0 ? `${h}:${m.padStart(2, "0")}:${s}` : `${m}:${s}`;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key.toLowerCase();
    if ([" ", "space", "arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (key === " " || key === "space" || key === "k") {
      togglePlay();
      return;
    }
    if (key === "m") {
      toggleMute();
      return;
    }
    if (key === "arrowleft") {
      onSeek(Math.max(0, currentTime - 5));
      return;
    }
    if (key === "arrowright") {
      onSeek(Math.min(duration, currentTime + 5));
      return;
    }
    if (key === "arrowup") {
      onChangeVolume(Math.min(1, (muted ? 0 : volume) + 0.05));
      return;
    }
    if (key === "arrowdown") {
      onChangeVolume(Math.max(0, (muted ? 0 : volume) - 0.05));
      return;
    }
  }, [togglePlay, toggleMute, onSeek, onChangeVolume, currentTime, duration, muted, volume]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-full bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 ${className || ""}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Album Art and Track Info */}
      {(thumbnail || title || artist || album) && (
        <div className="flex items-center gap-4 mb-4">
          {thumbnail ? (
            <div className="flex-shrink-0">
              <img 
                src={thumbnail} 
                alt={`${title || name} album art`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shadow-md"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted/30 flex items-center justify-center">
              <svg width="32" height="20" viewBox="0 0 64 40" aria-hidden="true" className="text-muted-foreground">
                <rect x="8" y="10" width="8" height="20" fill="currentColor" opacity="0.8">
                  <animate attributeName="height" values="10;26;10" dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="y" values="15;7;15" dur="1s" repeatCount="indefinite"/>
                </rect>
                <rect x="24" y="5" width="8" height="30" fill="currentColor" opacity="0.7">
                  <animate attributeName="height" values="20;34;20" dur="1.2s" repeatCount="indefinite"/>
                  <animate attributeName="y" values="10;3;10" dur="1.2s" repeatCount="indefinite"/>
                </rect>
                <rect x="40" y="12" width="8" height="16" fill="currentColor" opacity="0.8">
                  <animate attributeName="height" values="8;24;8" dur="0.9s" repeatCount="indefinite"/>
                  <animate attributeName="y" values="16;8;16" dur="0.9s" repeatCount="indefinite"/>
                </rect>
                <rect x="56" y="8" width="8" height="24" fill="currentColor" opacity="0.6">
                  <animate attributeName="height" values="16;30;16" dur="1.1s" repeatCount="indefinite"/>
                  <animate attributeName="y" values="12;5;12" dur="1.1s" repeatCount="indefinite"/>
                </rect>
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base font-medium text-foreground truncate">
              {title || name || 'Unknown Track'}
            </div>
            {artist && (
              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                {artist}
              </div>
            )}
            {album && (
              <div className="text-xs text-muted-foreground/80 truncate">
                {album}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Fallback for when no metadata is available */}
      {!thumbnail && !title && !artist && !album && name && (
        <div className="mb-2 text-sm sm:text-base font-medium text-foreground truncate">{name}</div>
      )}

      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      {/* Seek */}
      <div className="flex items-center gap-3 mb-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="text-[10px] sm:text-xs text-muted-foreground w-[70px] text-right">
          {fmtTime(currentTime)} / {fmtTime(duration)}
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary text-primary-foreground hover:opacity-90"
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-secondary/60 hover:bg-secondary/80 text-foreground transition-all duration-150 hover:scale-105"
            aria-label={muted ? "Unmute" : "Mute"}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
            className="w-24 sm:w-32 accent-primary cursor-pointer"
            aria-label="Volume"
          />

          <button
            type="button"
            onClick={() => onSeek(0)}
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-md bg-secondary/60 hover:bg-secondary/80 text-foreground transition-all duration-150 hover:scale-105"
            title="Restart"
            aria-label="Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={src}
            download
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-secondary/60 hover:bg-secondary/80 text-foreground transition-all duration-150 hover:scale-105"
            title="Download"
            aria-label="Download"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

