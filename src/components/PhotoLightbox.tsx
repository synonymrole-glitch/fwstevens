import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Share2,
  Heart,
  Camera,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Download,
  Check,
} from 'lucide-react';
import { PhotoItem, ThemeColors } from '../types';

interface PhotoLightboxProps {
  photo: PhotoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onEditPhoto: (photo: PhotoItem) => void;
  onSharePhoto: (photo: PhotoItem) => void;
  onLikePhoto: (photoId: string) => void;
  isLiked: boolean;
  theme: ThemeColors;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  isOpen,
  onClose,
  onPrev,
  onNext,
  onEditPhoto,
  onSharePhoto,
  onLikePhoto,
  isLiked,
  theme,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [showExifDrawer, setShowExifDrawer] = useState(true);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !photo) return null;

  const copyPaletteHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `${photo.title.toLowerCase().replace(/\s+/g, '-')}-fine-art.jpg`;
    link.href = photo.highResUrl || photo.url;
    link.target = '_blank';
    link.click();
  };

  return (
    <div
      id="photo-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fadeIn select-none"
    >
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 text-white/90">
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-serif italic backdrop-blur-md"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            {photo.category.replace('-', ' ')}
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-light tracking-wide text-white truncate max-w-[200px] sm:max-w-md">
            {photo.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Edit Studio Button */}
          <button
            onClick={() => onEditPhoto(photo)}
            title="Edit Photo in Studio"
            className="p-2.5 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all hover:scale-105"
          >
            <Sliders className="w-4 h-4 text-rose-200" />
          </button>

          {/* Share Button */}
          <button
            onClick={() => onSharePhoto(photo)}
            title="Share Photo"
            className="p-2.5 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all hover:scale-105"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            title="Download High-Res"
            className="p-2.5 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4 text-white" />
          </button>

          {/* Like Heart Button */}
          <button
            onClick={() => onLikePhoto(photo.id)}
            title="Favorite"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all text-xs"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
            <span>{photo.likes + (isLiked ? 1 : 0)}</span>
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        id="lightbox-prev-btn"
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md bg-white/10 text-white hover:bg-white/25 transition-all z-20 hover:scale-110"
        title="Previous (Left Arrow)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        id="lightbox-next-btn"
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md bg-white/10 text-white hover:bg-white/25 transition-all z-20 hover:scale-110"
        title="Next (Right Arrow)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Stage */}
      <div className="w-full h-full flex items-center justify-center p-4 sm:p-12 sm:pb-28">
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            src={photo.highResUrl || photo.url}
            alt={photo.title}
            className="max-w-full max-h-[75vh] sm:max-h-[82vh] object-contain rounded-2xl shadow-2xl transition-all duration-300"
            style={{
              boxShadow: `0 0 45px ${theme.glowColor}`,
            }}
          />
        </div>
      </div>

      {/* Bottom Floating Info & EXIF Drawer */}
      <div
        className="absolute bottom-4 left-4 right-4 max-w-4xl mx-auto backdrop-blur-xl rounded-2xl p-4 border transition-all duration-300 text-white"
        style={{
          backgroundColor: 'rgba(20, 15, 20, 0.75)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Story & Location */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 text-xs opacity-75">
              <MapPin className="w-3.5 h-3.5 text-rose-300" />
              <span>{photo.exif.location}</span>
              <span>·</span>
              <Calendar className="w-3.5 h-3.5" />
              <span>{photo.exif.dateTaken}</span>
            </div>
            <p className="text-xs font-serif italic text-white/90 line-clamp-1">
              "{photo.story}"
            </p>
          </div>

          {/* EXIF Mini Tags */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono scrollbar-none">
            <div className="px-2.5 py-1 rounded-lg bg-white/10 flex items-center gap-1.5 whitespace-nowrap">
              <Camera className="w-3 h-3 text-rose-200" />
              <span>{photo.exif.camera}</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/10 whitespace-nowrap">
              {photo.exif.lens}
            </div>
            <div className="px-2 py-1 rounded-lg bg-white/10 whitespace-nowrap">
              {photo.exif.aperture}
            </div>
            <div className="px-2 py-1 rounded-lg bg-white/10 whitespace-nowrap">
              {photo.exif.shutterSpeed}
            </div>
            <div className="px-2 py-1 rounded-lg bg-white/10 whitespace-nowrap">
              ISO {photo.exif.iso}
            </div>
          </div>

          {/* Color Harmonies */}
          <div className="flex items-center gap-1.5 shrink-0">
            {photo.palette.map((hex, i) => (
              <button
                key={i}
                onClick={() => copyPaletteHex(hex)}
                className="w-5 h-5 rounded-full border border-white/30 transition-transform hover:scale-125 relative flex items-center justify-center"
                style={{ backgroundColor: hex }}
                title={`Copy ${hex}`}
              >
                {copiedHex === hex && <Check className="w-3 h-3 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
