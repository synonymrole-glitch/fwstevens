import React, { useState } from 'react';
import {
  Play,
  Video,
  Film,
  Sparkles,
  ExternalLink,
  Plus,
  Tv,
  Clock,
  Feather,
  Check,
  Disc,
} from 'lucide-react';
import { YouTubeVideo, ThemeColors, BandcampTrack } from '../types';
import { YOUTUBE_VIDEOS, BANDCAMP_TRACKS } from '../data/defaultData';
import confetti from 'canvas-confetti';

interface YouTubeShowcaseProps {
  videos?: YouTubeVideo[];
  theme: ThemeColors;
  onOpenInquiry: () => void;
  bandcampTracks?: BandcampTrack[];
  onPlayBandcampTrack: (index: number) => void;
}

export const YouTubeShowcase: React.FC<YouTubeShowcaseProps> = ({
  videos = YOUTUBE_VIDEOS,
  theme,
  onOpenInquiry,
  bandcampTracks = BANDCAMP_TRACKS,
  onPlayBandcampTrack,
}) => {
  const [videoList, setVideoList] = useState<YouTubeVideo[]>(videos);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo>(videos[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // New video input form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrlOrId, setNewUrlOrId] = useState('');
  const [newCategory, setNewCategory] = useState<YouTubeVideo['category']>('behind-the-scenes');

  const extractYouTubeId = (input: string): string => {
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : '9No-FiEInLA';
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrlOrId) return;

    const ytId = extractYouTubeId(newUrlOrId);
    const newVid: YouTubeVideo = {
      id: `yt-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Fine art multimedia showcase.',
      youtubeId: ytId,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      duration: '5:00',
      category: newCategory,
    };

    setVideoList([newVid, ...videoList]);
    setActiveVideo(newVid);
    setShowAddModal(false);
    confetti({ particleCount: 40, spread: 50 });

    setNewTitle('');
    setNewDesc('');
    setNewUrlOrId('');
  };

  return (
    <section id="multimedia-showcase-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
      {/* Section Intro */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif italic mb-3 shadow-xs"
          style={{
            backgroundColor: theme.badgeBg,
            color: theme.badgeText,
            border: `1px solid ${theme.accentBorder}`,
          }}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Cinematic Chronicles & Soundscapes</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight mb-3" style={{ color: theme.textPrimary }}>
          Motion, Music & <span className="italic font-normal">Living Light</span>
        </h2>

        <p className="text-sm sm:text-base font-sans font-light opacity-80" style={{ color: theme.textSecondary }}>
          Step behind the lens to witness vintage 35mm film sessions, wild bird sanctuary migrations, and ambient fairy harp soundscapes.
        </p>
      </div>

      {/* Featured Main Video Player */}
      <div
        className={`rounded-3xl border overflow-hidden p-4 sm:p-6 mb-12 shadow-xl transition-all duration-300 ${
          isTheaterMode ? 'max-w-6xl mx-auto' : ''
        }`}
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black mb-5">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Video Info Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-serif italic"
                style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
              >
                {activeVideo.category.replace('-', ' ')}
              </span>
              <span className="text-xs opacity-60 flex items-center gap-1 font-mono" style={{ color: theme.textSecondary }}>
                <Clock className="w-3 h-3" />
                {activeVideo.duration}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-medium" style={{ color: theme.textPrimary }}>
              {activeVideo.title}
            </h3>

            <p className="text-xs sm:text-sm font-sans opacity-80 leading-relaxed" style={{ color: theme.textSecondary }}>
              {activeVideo.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className="px-3.5 py-2 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all hover:scale-102"
              style={{ borderColor: theme.cardBorder, color: theme.textPrimary, backgroundColor: theme.cardBg }}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{isTheaterMode ? 'Standard View' : 'Theater Mode'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs flex items-center gap-1.5 hover:opacity-90"
              style={{ backgroundColor: theme.accent }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add YouTube Reel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Playlist Grid */}
      <div className="mb-14">
        <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2" style={{ color: theme.textPrimary }}>
          <Video className="w-4 h-4" style={{ color: theme.accent }} />
          <span>Select from the Visual Reel Archive</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videoList.map((vid) => {
            const isSelected = vid.id === activeVideo.id;
            return (
              <div
                key={vid.id}
                onClick={() => {
                  setActiveVideo(vid);
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }}
                className={`group rounded-2xl border p-3.5 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected ? 'ring-2 shadow-md scale-101' : 'hover:opacity-95'
                }`}
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: isSelected ? theme.accent : theme.cardBorder,
                  ringColor: theme.accent,
                }}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: theme.accent }}
                    >
                      <Play className="w-4 h-4 translate-x-0.5" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white backdrop-blur-xs">
                    {vid.duration}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: theme.accent }}>
                    {vid.category.replace('-', ' ')}
                  </span>
                  <h4 className="font-serif text-sm font-medium line-clamp-1 leading-snug" style={{ color: theme.textPrimary }}>
                    {vid.title}
                  </h4>
                  <p className="text-xs line-clamp-2 opacity-75 leading-relaxed" style={{ color: theme.textSecondary }}>
                    {vid.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dedicated Bandcamp Album Soundscapes Suite */}
      <div
        className="rounded-3xl border p-6 sm:p-8"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5" style={{ color: theme.accent }}>
              <Disc className="w-3.5 h-3.5" />
              <span>Embedded Bandcamp Acoustic Aura</span>
            </span>
            <h3 className="text-2xl font-serif font-medium mt-1" style={{ color: theme.textPrimary }}>
              Woodland Harps & Whispering Birdsong
            </h3>
            <p className="text-xs sm:text-sm opacity-75 max-w-xl" style={{ color: theme.textSecondary }}>
              Natural harmonic frequencies designed to elevate fine art viewing into an immersive sensory sanctuary.
            </p>
          </div>

          <a
            href="https://bandcamp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-xs font-semibold border flex items-center gap-1.5 hover:opacity-80 transition-opacity self-start md:self-auto"
            style={{ borderColor: theme.cardBorder, color: theme.textPrimary }}
          >
            <span>Visit Bandcamp Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Track Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bandcampTracks.map((track, idx) => (
            <div
              key={track.id}
              className="p-4 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md"
              style={{
                backgroundColor: theme.accentSoft,
                borderColor: theme.accentBorder,
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={track.albumArt}
                  alt={track.album}
                  className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0"
                />
                <div>
                  <h4 className="font-serif text-sm font-medium leading-snug" style={{ color: theme.textPrimary }}>
                    {track.title}
                  </h4>
                  <p className="text-xs opacity-75 font-sans" style={{ color: theme.textSecondary }}>
                    {track.artist}
                  </p>
                  <span className="text-[10px] font-mono opacity-60">{track.duration} · {track.genre}</span>
                </div>
              </div>

              <p className="text-[11px] italic font-serif leading-relaxed opacity-75 mb-3" style={{ color: theme.textSecondary }}>
                "{track.description}"
              </p>

              <button
                onClick={() => onPlayBandcampTrack(idx)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-2 hover:scale-101 transition-all"
                style={{ backgroundColor: theme.accent }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Ethereal Track</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium" style={{ color: theme.textPrimary }}>
                Embed Custom YouTube Photography Reel
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-500 hover:text-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">YouTube Video URL or Video ID*</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or ID"
                  value={newUrlOrId}
                  onChange={(e) => setNewUrlOrId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border outline-none bg-white"
                  style={{ borderColor: theme.cardBorder }}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Reel Title*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 35mm Fairy Tale Forest Portrait Session"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border outline-none bg-white"
                  style={{ borderColor: theme.cardBorder }}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border outline-none bg-white"
                  style={{ borderColor: theme.cardBorder }}
                >
                  <option value="behind-the-scenes">Behind The Scenes</option>
                  <option value="fairy-vlog">Fairy Vlog</option>
                  <option value="visual-poem">Visual Poem</option>
                  <option value="gear-craft">Gear & Craft</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis of what takes place in the video reel..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg border outline-none bg-white"
                  style={{ borderColor: theme.cardBorder }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border"
                  style={{ borderColor: theme.cardBorder }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-semibold text-white shadow-xs"
                  style={{ backgroundColor: theme.accent }}
                >
                  Embed Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
