"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

type CustomAudioPlayerProps = {
  src: string;
};

export default function CustomAudioPlayer({ src }: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Update progress as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setProgress(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full bg-white/90 border border-orange-200 rounded-2xl shadow-md p-4 flex flex-col gap-3">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play / Pause */}
        <Button
          size="icon"
          variant="outline"
          className="rounded-full border-orange-300 text-orange-600 hover:bg-orange-50"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>

        {/* Progress Bar */}
        <Slider
          value={[progress]}
          max={duration || 0}
          step={0.1}
          onValueChange={handleSeek}
          className="flex-1 accent-orange-500"
        />

        {/* Time */}
        <span className="text-xs text-gray-600 min-w-[50px] text-right">
          {Math.floor(progress / 60)}:{("0" + Math.floor(progress % 60)).slice(-2)}
        </span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="text-orange-600 hover:bg-orange-50"
          onClick={toggleMute}
        >
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
        <Slider
          defaultValue={[100]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="flex-1 accent-orange-500"
        />
      </div>
    </div>
  );
}