"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { X, Play, Pause, Volume2, VolumeX, PictureInPicture2, Maximize, Minimize2, RotateCcw, Subtitles } from "lucide-react";

export interface NativeVideoPlayerProps {
  src: string;
  poster?: string;
  name?: string;
  className?: string;
  onClose?: () => void;
  onPIPChange?: (active: boolean) => void;
}

export default function NativeVideoPlayer({
  src,
  poster,
  name,
  className,
  onClose,
  onPIPChange,
}: NativeVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pipActive, setPipActive] = useState(false);
  const [supportsPip, setSupportsPip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasSubtitles, setHasSubtitles] = useState(false);
  const [subsOn, setSubsOn] = useState(false);

  useEffect(() => {
    // Detect PIP support
    const anyDoc: any = document as any;
    const supports = !!("pictureInPictureEnabled" in document) || !!anyDoc.webkitPictureInPictureEnabled;
    setSupportsPip(supports);
  }, []);

  useEffect(() => {
    const video = videoRef.current as any;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
const onLoaded = () => {
      setDuration(video.duration || 0);
      try {
        const tracks: TextTrackList = video.textTracks;
        const has = tracks && tracks.length > 0;
        setHasSubtitles(!!has);
        if (has) {
          for (let i = 0; i < tracks.length; i++) {
            tracks[i].mode = "hidden" as any;
          }
          setSubsOn(false);
        }
      } catch {}
    };
    const onTime = () => setCurrentTime(video.currentTime || 0);
    const onVol = () => {
      setVolume(video.volume);
      setMuted(video.muted);
    };

    const enter = () => {
      setPipActive(true);
      onPIPChange?.(true);
    };
    const leave = () => {
      setPipActive(false);
      onPIPChange?.(false);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("volumechange", onVol);
    video.addEventListener("enterpictureinpicture", enter);
    video.addEventListener("leavepictureinpicture", leave);

    // Safari webkit events
    video.addEventListener("webkitpresentationmodechanged", (e: any) => {
      if (video.webkitPresentationMode === "picture-in-picture") enter();
      else leave();
    });

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("volumechange", onVol);
      video.removeEventListener("enterpictureinpicture", enter);
      video.removeEventListener("leavepictureinpicture", leave);
    };
  }, [onPIPChange]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const onChangeVolume = useCallback((val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = Math.min(1, Math.max(0, val));
    if (v.volume === 0) v.muted = true;
    setVolume(v.volume);
    setMuted(v.muted);
  }, []);

  const onSeek = useCallback((val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(duration, Math.max(0, val));
    setCurrentTime(v.currentTime);
  }, [duration]);

const toggleSubtitles = useCallback(() => {
    const v = videoRef.current as any;
    if (!v) return;
    try {
      const tracks: TextTrackList = v.textTracks;
      if (!tracks || tracks.length === 0) return;
      const enable = !subsOn;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = (enable && i === 0 ? "showing" : "hidden") as any;
      }
      setSubsOn(enable);
    } catch {}
  }, [subsOn]);

  const requestPip = useCallback(async () => {
    const video = videoRef.current as any;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await (document as any).exitPictureInPicture?.();
      } else {
        if (video.requestPictureInPicture) {
          await video.requestPictureInPicture();
        } else if (video.webkitSetPresentationMode) {
          video.webkitSetPresentationMode("picture-in-picture");
        }
      }
    } catch (e) {
      console.warn("PIP request failed", e);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const cont = containerRef.current as any;
    if (!cont) return;
    try {
      if (!document.fullscreenElement) {
        await cont.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn("Fullscreen toggle failed", e);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const fmtTime = useMemo(() => (secs: number) => {
    if (!isFinite(secs)) return "0:00";
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    const m = Math.floor((secs / 60) % 60).toString();
    const h = Math.floor(secs / 3600);
    return h > 0 ? `${h}:${m.padStart(2, "0")}:${s}` : `${m}:${s}`;
  }, []);

  // When in PIP, hide the element entirely but keep it mounted
  const containerClasses = pipActive
    ? "absolute -left-[9999px] w-[1px] h-[1px] overflow-hidden opacity-0 pointer-events-none"
    : "relative";

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key.toLowerCase();
    // Prevent page scroll on space/arrow when controlling the player
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
    if (key === "f") {
      toggleFullscreen();
      return;
    }
    if (key === "p") {
      // PIP toggle
      requestPip();
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
  }, [togglePlay, toggleMute, toggleFullscreen, requestPip, onSeek, onChangeVolume, currentTime, duration, muted, volume]);

  return (
    <div
      ref={containerRef}
      className={`${containerClasses} ${className || ""}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Title Badge */}
      {name && !pipActive && (
        <div className="absolute top-2 left-2 text-white text-xs sm:text-sm bg-black/60 px-2 sm:px-3 py-1 rounded-md z-10 font-medium">
          {name}
        </div>
      )}

      {/* Close */}
      {onClose && !pipActive && (
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

      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={false}
        playsInline
onClick={togglePlay}
        className="w-full h-full bg-black cursor-pointer"
      />

      {/* Controls */}
      {!pipActive && (
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent">
          {/* Progress Bar */}
          <div className="flex items-center gap-3 mb-2">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="text-[10px] sm:text-xs text-white/90 w-[70px] text-right">
              {fmtTime(currentTime)} / {fmtTime(duration)}
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play/Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-white/20 text-white"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              {/* Mute */}
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-white/20 text-white"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Volume Slider */}
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

              {/* Restart */}
              <button
                type="button"
                onClick={() => onSeek(0)}
                className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-white/20 text-white"
                aria-label="Restart"
                title="Restart"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Subtitles */}
              <button
                type="button"
                onClick={toggleSubtitles}
                disabled={!hasSubtitles}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-md ${hasSubtitles ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/40 cursor-not-allowed'}`}
                aria-label={subsOn ? "Hide Subtitles" : "Show Subtitles"}
                title={subsOn ? "Hide Subtitles" : hasSubtitles ? "Show Subtitles" : "No Subtitles"}
              >
                <Subtitles className="w-5 h-5" />
              </button>

              {/* PIP */}
              {/* PIP */}
              {supportsPip && (
                <button
                  type="button"
                  onClick={requestPip}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-white/20 text-white"
                  aria-label="Picture in Picture"
                  title="Picture in Picture"
                >
                  <PictureInPicture2 className="w-5 h-5" />
                </button>
              )}

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-white/20 text-white"
                aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

