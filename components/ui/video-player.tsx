// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { cn } from "@/lib/utils";
// import { Pause, Play, Volume2, VolumeX, Maximize } from "lucide-react";

// export interface VideoPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
//   src: string;
//   poster?: string;
//   className?: string;
// }

// export default function VideoPlayer({ src, poster, className, ...props }: VideoPlayerProps) {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const progressRef = useRef<HTMLInputElement | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [playbackRate, setPlaybackRate] = useState(1);

//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;
//     const onLoaded = () => setDuration(v.duration || 0);
//     const onTime = () => setCurrentTime(v.currentTime || 0);
//     const onPlay = () => setIsPlaying(true);
//     const onPause = () => setIsPlaying(false);
//     v.addEventListener("loadedmetadata", onLoaded);
//     v.addEventListener("timeupdate", onTime);
//     v.addEventListener("play", onPlay);
//     v.addEventListener("pause", onPause);
//     return () => {
//       v.removeEventListener("loadedmetadata", onLoaded);
//       v.removeEventListener("timeupdate", onTime);
//       v.removeEventListener("play", onPlay);
//       v.removeEventListener("pause", onPause);
//     };
//   }, []);

//   useEffect(() => {
//     if (videoRef.current) videoRef.current.muted = isMuted;
//   }, [isMuted]);

//   useEffect(() => {
//     if (videoRef.current) videoRef.current.volume = volume;
//   }, [volume]);

//   useEffect(() => {
//     if (videoRef.current) videoRef.current.playbackRate = playbackRate;
//   }, [playbackRate]);

//   const togglePlay = () => {
//     const v = videoRef.current;
//     if (!v) return;
//     if (v.paused) v.play();
//     else v.pause();
//   };

//   const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const v = videoRef.current;
//     if (!v) return;
//     const newTime = Number(e.target.value);
//     v.currentTime = newTime;
//     setCurrentTime(newTime);
//   };

//   const requestFullscreen = () => {
//     const container = videoRef.current?.parentElement;
//     if (!container) return;
//     if (container.requestFullscreen) container.requestFullscreen();
//     // @ts-ignore - vendor prefixes
//     else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
//     // @ts-ignore
//     else if (container.msRequestFullscreen) container.msRequestFullscreen();
//   };

//   const formatTime = (secs: number) => {
//     if (!isFinite(secs)) return "0:00";
//     const m = Math.floor(secs / 60);
//     const s = Math.floor(secs % 60)
//       .toString()
//       .padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   return (
//     <div
//       className={cn(
//         "group relative rounded-xl overflow-hidden border border-border bg-card shadow",
//         className
//       )}
//       {...props}
//     >
//       <video
//         ref={videoRef}
//         src={src}
//         poster={poster}
//         className="w-full h-full object-contain bg-black"
//         onClick={togglePlay}
//         controls={false}
//       />

//       {/* Controls */}
//       <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-100 transition-opacity">
//         {/* Progress */}
//         <div className="flex items-center gap-2">
//           <span className="text-[11px] text-white/80 tabular-nums w-10 text-right">
//             {formatTime(currentTime)}
//           </span>
//           <input
//             ref={progressRef}
//             type="range"
//             min={0}
//             max={duration || 0}
//             step={0.1}
//             value={Math.min(currentTime, duration || 0)}
//             onChange={handleProgress}
//             className="flex-1 [--track:#ffffff44] [--fill:theme(colors.primary.DEFAULT)] appearance-none h-1 rounded-full bg-[var(--track)] outline-none cursor-pointer"
//             style={{
//               background: `linear-gradient(to right, var(--fill) ${(currentTime / (duration || 1)) * 100}%, var(--track) ${(currentTime / (duration || 1)) * 100}%)`,
//             }}
//           />
//           <span className="text-[11px] text-white/80 tabular-nums w-10">
//             {formatTime(duration)}
//           </span>
//         </div>

//         <div className="mt-2 flex items-center gap-2 justify-between">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={togglePlay}
//               className="inline-flex items-center justify-center w-8 h-8 rounded-md text-white bg-white/10 hover:bg-white/20 backdrop-blur"
//               aria-label={isPlaying ? "Pause" : "Play"}
//               title={isPlaying ? "Pause" : "Play"}
//             >
//               {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//             </button>
//             <button
//               onClick={() => setIsMuted((m) => !m)}
//               className="inline-flex items-center justify-center w-8 h-8 rounded-md text-white bg-white/10 hover:bg-white/20 backdrop-blur"
//               aria-label={isMuted ? "Unmute" : "Mute"}
//               title={isMuted ? "Unmute" : "Mute"}
//             >
//               {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
//             </button>
//             <input
//               type="range"
//               min={0}
//               max={1}
//               step={0.01}
//               value={volume}
//               onChange={(e) => setVolume(Number(e.target.value))}
//               className="w-28 appearance-none h-1 rounded-full bg-white/30 outline-none cursor-pointer"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <select
//               className="px-2 py-1 text-xs rounded-md bg-white/10 text-white hover:bg-white/20 backdrop-blur"
//               value={playbackRate}
//               onChange={(e) => setPlaybackRate(Number(e.target.value))}
//               aria-label="Playback speed"
//             >
//               {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((r) => (
//                 <option key={r} value={r} className="bg-black">
//                   {r}x
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={requestFullscreen}
//               className="inline-flex items-center justify-center w-8 h-8 rounded-md text-white bg-white/10 hover:bg-white/20 backdrop-blur"
//               aria-label="Fullscreen"
//               title="Fullscreen"
//             >
//               <Maximize className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


