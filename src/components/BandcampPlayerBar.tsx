import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ExternalLink,
  Disc,
  Feather,
  Sparkles,
  Edit3,
  Check,
} from 'lucide-react';
import { BandcampTrack, ThemeColors } from '../types';
import { BANDCAMP_TRACKS } from '../data/defaultData';

interface BandcampPlayerBarProps {
  tracks?: BandcampTrack[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  theme: ThemeColors;
}

export const BandcampPlayerBar: React.FC<BandcampPlayerBarProps> = ({
  tracks = BANDCAMP_TRACKS,
  isPlaying,
  onTogglePlay,
  currentTrackIndex,
  onSelectTrack,
  theme,
}) => {
  const currentTrack = tracks[currentTrackIndex] || tracks[0];
  const [volume, setVolume] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTrackList, setShowTrackList] = useState(false);
  const [showEmbedCustomizer, setShowEmbedCustomizer] = useState(false);
  const [customEmbedUrl, setCustomEmbedUrl] = useState(currentTrack.embedUrl);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize audio element with state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Browser autoplay policy catch
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    onSelectTrack(nextIdx);
  };

  return (
    <>
      {/* Hidden HTML5 Audio Element for Soundscapes */}
      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        preload="metadata"
      />

      {/* Floating Ambient Player Bar */}
      <div
        id="bandcamp-player-bar"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px] z-40 backdrop-blur-xl rounded-2xl border p-3 sm:p-3.5 shadow-2xl transition-all duration-300 animate-slideUp select-none"
        style={{
          backgroundColor: theme.glassBg,
          borderColor: theme.cardBorder,
          boxShadow: `0 16px 36px ${theme.glowColor}`,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Album Artwork with Spinning Aura */}
          <div
            className="relative cursor-pointer group shrink-0"
            onClick={() => setShowTrackList(!showTrackList)}
          >
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.album}
              className={`w-12 h-12 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            />
            <div
              className="absolute inset-0 rounded-xl bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Music className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Track Info & Progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-medium truncate" style={{ color: theme.textPrimary }}>
                {currentTrack.title}
              </span>
              <span className="text-[10px] font-mono opacity-60 ml-2 shrink-0" style={{ color: theme.textSecondary }}>
                {formatTime(currentTime)} / {currentTrack.duration}
              </span>
            </div>

            <p className="text-[11px] truncate opacity-75 font-sans" style={{ color: theme.textSecondary }}>
              {currentTrack.artist} · <span className="italic font-serif">{currentTrack.genre}</span>
            </p>

            {/* Progress Slider */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-rose-400 mt-1"
            />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Play/Pause Main Button */}
            <button
              id="player-toggle-btn"
              onClick={onTogglePlay}
              className="p-2.5 rounded-full shadow-sm text-white transition-transform hover:scale-110 active:scale-95"
              style={{ backgroundColor: theme.accent }}
              title={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
            </button>

            {/* Skip Track */}
            <button
              onClick={handleNext}
              className="p-1.5 rounded-full hover:bg-black/5 transition-all text-neutral-600"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Volume Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full hover:bg-black/5 transition-all text-neutral-600"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tracklist Popover Drawer */}
        {showTrackList && (
          <div
            className="mt-3 pt-3 border-t space-y-2 animate-fadeIn max-h-56 overflow-y-auto"
            style={{ borderColor: theme.cardBorder }}
          >
            <div className="flex items-center justify-between text-[11px] font-medium" style={{ color: theme.accent }}>
              <span className="flex items-center gap-1">
                <Disc className="w-3 h-3" />
                <span>Bandcamp Fairytale Audio Soundscapes</span>
              </span>
              <button
                onClick={() => setShowEmbedCustomizer(!showEmbedCustomizer)}
                className="hover:underline flex items-center gap-1 text-[10px]"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>Custom Embed</span>
              </button>
            </div>

            {/* Custom Bandcamp Embed URL Config */}
            {showEmbedCustomizer && (
              <div className="p-2.5 rounded-xl bg-white/70 border text-xs space-y-1.5" style={{ borderColor: theme.cardBorder }}>
                <label className="block text-[10px] font-semibold text-neutral-600">Bandcamp Album / Track Embed URL:</label>
                <input
                  type="text"
                  value={customEmbedUrl}
                  onChange={(e) => setCustomEmbedUrl(e.target.value)}
                  placeholder="https://bandcamp.com/EmbeddedPlayer/album=..."
                  className="w-full p-1.5 text-[11px] rounded border bg-white outline-none"
                />
                <button
                  onClick={() => setShowEmbedCustomizer(false)}
                  className="px-2.5 py-1 rounded text-[10px] font-semibold text-white"
                  style={{ backgroundColor: theme.accent }}
                >
                  Save Embed
                </button>
              </div>
            )}

            {/* Track rows */}
            <div className="space-y-1">
              {tracks.map((t, idx) => {
                const isCur = idx === currentTrackIndex;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTrack(idx);
                      if (!isPlaying) onTogglePlay();
                    }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all ${
                      isCur ? 'shadow-xs font-semibold' : 'hover:bg-white/60 opacity-80'
                    }`}
                    style={{
                      backgroundColor: isCur ? theme.accentSoft : 'transparent',
                      color: isCur ? theme.accent : theme.textPrimary,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono opacity-50">{String(idx + 1).padStart(2, '0')}</span>
                      <div className="truncate">
                        <div className="text-xs truncate">{t.title}</div>
                        <div className="text-[10px] opacity-70">{t.artist}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono opacity-60 ml-2 shrink-0">{t.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
