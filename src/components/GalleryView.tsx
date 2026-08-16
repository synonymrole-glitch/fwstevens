import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Heart,
  Share2,
  Sliders,
  Maximize2,
  Grid,
  Columns,
  LayoutGrid,
  BookOpen,
  Search,
  Camera,
  MapPin,
  Tag,
  Feather,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { PhotoItem, GalleryLayoutMode, ThemeColors, ThemeConfig } from '../types';

interface GalleryViewProps {
  photos: PhotoItem[];
  theme: ThemeColors;
  themeConfig: ThemeConfig;
  onPhotoClick: (photo: PhotoItem) => void;
  onEditPhoto: (photo: PhotoItem) => void;
  onSharePhoto: (photo: PhotoItem) => void;
  onLikePhoto: (photoId: string) => void;
  likedPhotoIds: Set<string>;
  onOpenGitHubModal: () => void;
  onOpenInquiry: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  photos,
  theme,
  themeConfig,
  onPhotoClick,
  onEditPhoto,
  onSharePhoto,
  onLikePhoto,
  likedPhotoIds,
  onOpenGitHubModal,
  onOpenInquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<GalleryLayoutMode>('masonry');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Category definitions
  const categories = [
    { id: 'all', label: 'All Chronicles', icon: Sparkles },
    { id: 'fairy-tale', label: 'Fairy Tales', icon: Sparkles },
    { id: 'birds-avian', label: 'Birds & Avian', icon: Feather },
    { id: 'whispering-forest', label: 'Whispering Forest', icon: Sparkles },
    { id: 'ethereal-portraits', label: 'Ethereal Portraits', icon: Camera },
    { id: 'golden-light', label: 'Golden Light', icon: Sparkles },
  ];

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    photos.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [photos]);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Category match
      if (selectedCategory !== 'all' && photo.category !== selectedCategory) {
        return false;
      }
      // Tag match
      if (selectedTag && !photo.tags.includes(selectedTag)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = photo.title.toLowerCase().includes(q);
        const matchesStory = photo.story.toLowerCase().includes(q);
        const matchesLocation = photo.exif.location.toLowerCase().includes(q);
        const matchesTags = photo.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesStory && !matchesLocation && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [photos, selectedCategory, selectedTag, searchQuery]);

  return (
    <div id="gallery-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero Atmosphere Section */}
      <section id="hero-header" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif italic mb-4 shadow-xs"
          style={{
            backgroundColor: theme.badgeBg,
            color: theme.badgeText,
            border: `1px solid ${theme.accentBorder}`,
          }}
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Faerie Dust & Avian Tales · Hosted on GitHub</span>
        </div>

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight mb-4 leading-tight"
          style={{ color: theme.textPrimary }}
        >
          Where Light Touches <span className="italic font-normal underline decoration-rose-300/50 decoration-wavy">Enchantment</span>
        </h1>

        <p
          className="text-base sm:text-lg font-sans font-light leading-relaxed max-w-2xl mx-auto opacity-85"
          style={{ color: theme.textSecondary }}
        >
          A delicate chronicle of wild swans, ethereal bridal portraits, and sun-dappled forest sanctuaries. Every photograph is preserved through Git versioning with lossless color grading.
        </p>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            id="hero-inquire-btn"
            onClick={onOpenInquiry}
            className="px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-102 flex items-center gap-2"
            style={{ backgroundColor: theme.accent }}
          >
            <span>Commission a Fairytale Session</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="hero-github-sync-btn"
            onClick={onOpenGitHubModal}
            className="px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-200 hover:opacity-90 flex items-center gap-2"
            style={{
              backgroundColor: theme.cardBg,
              color: theme.textPrimary,
              border: `1px solid ${theme.cardBorder}`,
            }}
          >
            <span>Manage GitHub Repository</span>
          </button>
        </div>
      </section>

      {/* Gallery Controls Bar: Filter Categories, Search, Layout Modes */}
      <div
        id="gallery-controls-bar"
        className="sticky top-20 z-20 backdrop-blur-md p-3 sm:p-4 rounded-2xl mb-8 shadow-xs border transition-all duration-300"
        style={{
          backgroundColor: theme.glassBg,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === 'all' ? photos.length : photos.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedTag(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected ? 'shadow-xs scale-102' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: isSelected ? theme.accent : theme.cardBg,
                    color: isSelected ? '#FFFFFF' : theme.textSecondary,
                    border: isSelected ? `1px solid ${theme.accent}` : `1px solid ${theme.cardBorder}`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Layout Mode Selectors */}
          <div className="flex items-center gap-2 sm:gap-3 justify-between lg:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" style={{ color: theme.textSecondary }} />
              <input
                id="gallery-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories, camera, location..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border outline-none transition-all duration-200"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  color: theme.textPrimary,
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100"
                >
                  ×
                </button>
              )}
            </div>

            {/* Layout Mode Switcher */}
            <div
              className="flex items-center gap-1 p-1 rounded-full border"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              }}
            >
              <button
                id="view-mode-masonry"
                onClick={() => setLayoutMode('masonry')}
                title="Masonry Flow Layout"
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  layoutMode === 'masonry' ? 'shadow-xs' : 'hover:opacity-70'
                }`}
                style={{
                  backgroundColor: layoutMode === 'masonry' ? theme.accentSoft : 'transparent',
                  color: layoutMode === 'masonry' ? theme.accent : theme.textSecondary,
                }}
              >
                <Columns className="w-4 h-4" />
              </button>

              <button
                id="view-mode-grid"
                onClick={() => setLayoutMode('grid')}
                title="Airy Grid Layout"
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  layoutMode === 'grid' ? 'shadow-xs' : 'hover:opacity-70'
                }`}
                style={{
                  backgroundColor: layoutMode === 'grid' ? theme.accentSoft : 'transparent',
                  color: layoutMode === 'grid' ? theme.accent : theme.textSecondary,
                }}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                id="view-mode-editorial"
                onClick={() => setLayoutMode('editorial')}
                title="Editorial 2-Column Spread"
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  layoutMode === 'editorial' ? 'shadow-xs' : 'hover:opacity-70'
                }`}
                style={{
                  backgroundColor: layoutMode === 'editorial' ? theme.accentSoft : 'transparent',
                  color: layoutMode === 'editorial' ? theme.accent : theme.textSecondary,
                }}
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                id="view-mode-story"
                onClick={() => setLayoutMode('story')}
                title="Full Story Stream"
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  layoutMode === 'story' ? 'shadow-xs' : 'hover:opacity-70'
                }`}
                style={{
                  backgroundColor: layoutMode === 'story' ? theme.accentSoft : 'transparent',
                  color: layoutMode === 'story' ? theme.accent : theme.textSecondary,
                }}
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Tag Active Pill */}
        {selectedTag && (
          <div className="mt-2 pt-2 border-t flex items-center gap-2 text-xs" style={{ borderColor: theme.cardBorder }}>
            <span className="opacity-70" style={{ color: theme.textSecondary }}>Active Filter Tag:</span>
            <span
              className="px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
            >
              #{selectedTag}
              <button onClick={() => setSelectedTag(null)} className="hover:font-bold">×</button>
            </span>
          </div>
        )}
      </div>

      {/* Main Gallery Display */}
      {filteredPhotos.length === 0 ? (
        <div
          id="gallery-empty-state"
          className="text-center py-20 px-4 rounded-3xl border border-dashed my-8"
          style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-40 animate-pulse" style={{ color: theme.accent }} />
          <h3 className="text-xl font-serif font-medium mb-2" style={{ color: theme.textPrimary }}>
            No Whimsical Captures Found
          </h3>
          <p className="text-sm max-w-md mx-auto mb-6 opacity-75" style={{ color: theme.textSecondary }}>
            {searchQuery
              ? `No photographs matched "${searchQuery}". Try searching for another keyword or clear your filters.`
              : 'This gallery folder is currently empty. Connect your GitHub repository to import photo files.'}
          </p>
          <div className="flex justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 text-xs font-semibold rounded-full border"
                style={{ borderColor: theme.cardBorder, color: theme.textPrimary }}
              >
                Clear Search Query
              </button>
            )}
            <button
              onClick={onOpenGitHubModal}
              className="px-5 py-2 text-xs font-semibold rounded-full text-white shadow-xs"
              style={{ backgroundColor: theme.accent }}
            >
              Sync GitHub Repository
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* MASONRY VIEW */}
          {layoutMode === 'masonry' && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredPhotos.map((photo) => (
                <GalleryCard
                  key={photo.id}
                  photo={photo}
                  theme={theme}
                  onPhotoClick={onPhotoClick}
                  onEditPhoto={onEditPhoto}
                  onSharePhoto={onSharePhoto}
                  onLikePhoto={onLikePhoto}
                  isLiked={likedPhotoIds.has(photo.id)}
                  onSelectTag={setSelectedTag}
                />
              ))}
            </div>
          )}

          {/* GRID VIEW */}
          {layoutMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <GalleryCard
                  key={photo.id}
                  photo={photo}
                  theme={theme}
                  onPhotoClick={onPhotoClick}
                  onEditPhoto={onEditPhoto}
                  onSharePhoto={onSharePhoto}
                  onLikePhoto={onLikePhoto}
                  isLiked={likedPhotoIds.has(photo.id)}
                  onSelectTag={setSelectedTag}
                  aspectFixed="aspect-[4/5]"
                />
              ))}
            </div>
          )}

          {/* EDITORIAL 2-COLUMN SPREAD */}
          {layoutMode === 'editorial' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
              {filteredPhotos.map((photo, idx) => (
                <EditorialCard
                  key={photo.id}
                  photo={photo}
                  theme={theme}
                  index={idx}
                  onPhotoClick={onPhotoClick}
                  onEditPhoto={onEditPhoto}
                  onSharePhoto={onSharePhoto}
                  onLikePhoto={onLikePhoto}
                  isLiked={likedPhotoIds.has(photo.id)}
                  onSelectTag={setSelectedTag}
                />
              ))}
            </div>
          )}

          {/* STORY STREAM VIEW */}
          {layoutMode === 'story' && (
            <div className="max-w-4xl mx-auto space-y-16">
              {filteredPhotos.map((photo, idx) => (
                <StoryCard
                  key={photo.id}
                  photo={photo}
                  theme={theme}
                  index={idx}
                  onPhotoClick={onPhotoClick}
                  onEditPhoto={onEditPhoto}
                  onSharePhoto={onSharePhoto}
                  onLikePhoto={onLikePhoto}
                  isLiked={likedPhotoIds.has(photo.id)}
                  onSelectTag={setSelectedTag}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Floating Tag Cloud */}
      <div
        id="gallery-tags-cloud"
        className="mt-16 pt-8 border-t text-center"
        style={{ borderColor: theme.cardBorder }}
      >
        <p className="text-xs uppercase tracking-widest font-sans font-medium mb-3 opacity-60" style={{ color: theme.textSecondary }}>
          Curated Thematic Motifs
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
                selectedTag === tag ? 'font-semibold shadow-xs' : 'opacity-80 hover:opacity-100'
              }`}
              style={{
                backgroundColor: selectedTag === tag ? theme.accent : theme.accentSoft,
                color: selectedTag === tag ? '#FFFFFF' : theme.textSecondary,
                border: `1px solid ${selectedTag === tag ? theme.accent : theme.accentBorder}`,
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* Subcomponent: Standard Masonry / Grid Card */
interface CardProps {
  photo: PhotoItem;
  theme: ThemeColors;
  onPhotoClick: (photo: PhotoItem) => void;
  onEditPhoto: (photo: PhotoItem) => void;
  onSharePhoto: (photo: PhotoItem) => void;
  onLikePhoto: (id: string) => void;
  isLiked: boolean;
  onSelectTag: (tag: string) => void;
  aspectFixed?: string;
}

const GalleryCard: React.FC<CardProps> = ({
  photo,
  theme,
  onPhotoClick,
  onEditPhoto,
  onSharePhoto,
  onLikePhoto,
  isLiked,
  onSelectTag,
  aspectFixed,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={`photo-card-${photo.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group break-inside-avoid rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg relative"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: isHovered ? theme.accent : theme.cardBorder,
        boxShadow: isHovered ? `0 12px 28px ${theme.glowColor}` : 'none',
      }}
    >
      {/* Image Frame Container */}
      <div
        className={`relative overflow-hidden cursor-pointer ${aspectFixed || ''}`}
        onClick={() => onPhotoClick(photo)}
      >
        <img
          src={photo.url}
          alt={photo.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Soft Fairy Sheen Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-serif italic backdrop-blur-md shadow-xs pointer-events-auto"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: theme.textPrimary,
            }}
          >
            {photo.category.replace('-', ' ')}
          </span>

          {photo.featured && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold shadow-xs"
              style={{ backgroundColor: theme.accent, color: '#FFFFFF' }}
            >
              Featured
            </span>
          )}
        </div>

        {/* Quick Action Overlay Buttons on Hover */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit Button */}
          <button
            id={`btn-edit-${photo.id}`}
            onClick={() => onEditPhoto(photo)}
            title="Edit Photo in Studio"
            className="p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: theme.accent,
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Share Button */}
          <button
            id={`btn-share-${photo.id}`}
            onClick={() => onSharePhoto(photo)}
            title="Share Photo Story"
            className="p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: theme.textPrimary,
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Lightbox Button */}
          <button
            id={`btn-view-${photo.id}`}
            onClick={() => onPhotoClick(photo)}
            title="Enlarge Fullscreen"
            className="p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: theme.textPrimary,
            }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Information & Story Meta */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            onClick={() => onPhotoClick(photo)}
            className="font-serif text-lg font-medium leading-snug cursor-pointer hover:underline"
            style={{ color: theme.textPrimary }}
          >
            {photo.title}
          </h3>

          {/* Like Heart Button */}
          <button
            id={`btn-like-${photo.id}`}
            onClick={() => onLikePhoto(photo.id)}
            className="flex items-center gap-1 text-xs font-medium transition-transform active:scale-125"
            style={{ color: isLiked ? theme.accent : theme.textMuted }}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{photo.likes + (isLiked ? 1 : 0)}</span>
          </button>
        </div>

        {photo.subtitle && (
          <p className="text-xs font-serif italic mb-2.5 opacity-80" style={{ color: theme.textSecondary }}>
            {photo.subtitle}
          </p>
        )}

        <p className="text-xs line-clamp-2 leading-relaxed mb-3 opacity-75" style={{ color: theme.textSecondary }}>
          {photo.story}
        </p>

        {/* EXIF Mini Pill & Location */}
        <div
          className="pt-3 border-t flex items-center justify-between text-[11px]"
          style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
        >
          <span className="flex items-center gap-1 truncate max-w-[65%]">
            <Camera className="w-3 h-3 shrink-0" />
            <span className="truncate">{photo.exif.camera} · {photo.exif.aperture}</span>
          </span>

          <span className="flex items-center gap-1 shrink-0">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{photo.exif.location.split(',')[0]}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

/* Subcomponent: Editorial 2-Column Spread Card */
interface EditorialProps extends CardProps {
  index: number;
}

const EditorialCard: React.FC<EditorialProps> = ({
  photo,
  theme,
  index,
  onPhotoClick,
  onEditPhoto,
  onSharePhoto,
  onLikePhoto,
  isLiked,
}) => {
  return (
    <div
      id={`editorial-card-${photo.id}`}
      className="group rounded-3xl overflow-hidden border p-5 sm:p-6 transition-all duration-300 hover:shadow-xl"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.cardBorder,
      }}
    >
      <div className="relative aspect-[3/2] rounded-2xl overflow-hidden mb-6 cursor-pointer" onClick={() => onPhotoClick(photo)}>
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-serif italic backdrop-blur-md bg-white/80" style={{ color: theme.textPrimary }}>
          Folio #{String(index + 1).padStart(2, '0')}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.accent }}>
            {photo.category.replace('-', ' ')}
          </span>
          <span className="text-xs font-serif italic" style={{ color: theme.textMuted }}>
            {photo.exif.dateTaken}
          </span>
        </div>

        <h3 className="text-2xl font-serif font-medium leading-tight cursor-pointer hover:underline" style={{ color: theme.textPrimary }} onClick={() => onPhotoClick(photo)}>
          {photo.title}
        </h3>

        <p className="text-sm font-sans leading-relaxed opacity-80" style={{ color: theme.textSecondary }}>
          {photo.story}
        </p>

        {/* Color Palette Swatches */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-[10px] uppercase tracking-wider opacity-60" style={{ color: theme.textMuted }}>Harmonics:</span>
          <div className="flex items-center gap-1.5">
            {photo.palette.map((c, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                style={{ backgroundColor: c }}
                title={`Hex: ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: theme.cardBorder }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: theme.textSecondary }}>
            <Camera className="w-3.5 h-3.5" />
            <span>{photo.exif.camera} ({photo.exif.lens})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditPhoto(photo)}
              className="p-2 rounded-full hover:scale-105 transition-transform"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
              title="Edit in Studio"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSharePhoto(photo)}
              className="p-2 rounded-full hover:scale-105 transition-transform"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onLikePhoto(photo.id)}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
              style={{ backgroundColor: theme.accentSoft, color: isLiked ? theme.accent : theme.textSecondary }}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{photo.likes + (isLiked ? 1 : 0)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Subcomponent: Full Story Stream Card */
const StoryCard: React.FC<EditorialProps> = ({
  photo,
  theme,
  index,
  onPhotoClick,
  onEditPhoto,
  onSharePhoto,
  onLikePhoto,
  isLiked,
}) => {
  return (
    <article
      id={`story-card-${photo.id}`}
      className="rounded-3xl border overflow-hidden p-6 sm:p-10 shadow-xs transition-all duration-300 hover:shadow-lg"
      style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
    >
      <div className="text-center max-w-2xl mx-auto mb-6">
        <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
          Chronicle #{index + 1} · {photo.category.replace('-', ' ')}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-light mt-3 mb-2 cursor-pointer hover:underline" style={{ color: theme.textPrimary }} onClick={() => onPhotoClick(photo)}>
          {photo.title}
        </h2>
        {photo.subtitle && (
          <p className="text-sm font-serif italic opacity-75" style={{ color: theme.textSecondary }}>
            {photo.subtitle}
          </p>
        )}
      </div>

      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 cursor-pointer" onClick={() => onPhotoClick(photo)}>
        <img src={photo.highResUrl} alt={photo.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-base sm:text-lg font-serif italic leading-relaxed text-center" style={{ color: theme.textSecondary }}>
          "{photo.story}"
        </p>

        {/* Detailed EXIF grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t text-center text-xs" style={{ borderColor: theme.cardBorder }}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accentSoft }}>
            <div className="font-semibold" style={{ color: theme.accent }}>Camera</div>
            <div className="truncate" style={{ color: theme.textPrimary }}>{photo.exif.camera}</div>
          </div>
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accentSoft }}>
            <div className="font-semibold" style={{ color: theme.accent }}>Optic</div>
            <div className="truncate" style={{ color: theme.textPrimary }}>{photo.exif.focalLength} · {photo.exif.aperture}</div>
          </div>
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accentSoft }}>
            <div className="font-semibold" style={{ color: theme.accent }}>Exposure</div>
            <div className="truncate" style={{ color: theme.textPrimary }}>{photo.exif.shutterSpeed} · ISO {photo.exif.iso}</div>
          </div>
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accentSoft }}>
            <div className="font-semibold" style={{ color: theme.accent }}>Location</div>
            <div className="truncate" style={{ color: theme.textPrimary }}>{photo.exif.location.split(',')[0]}</div>
          </div>
        </div>

        {/* Story Actions */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onEditPhoto(photo)}
            className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5"
            style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Remix in Photo Studio</span>
          </button>

          <button
            onClick={() => onSharePhoto(photo)}
            className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5"
            style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Chronicle</span>
          </button>

          <button
            onClick={() => onLikePhoto(photo.id)}
            className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5"
            style={{ backgroundColor: isLiked ? theme.accent : theme.accentSoft, color: isLiked ? '#FFF' : theme.accent }}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{isLiked ? 'Loved' : 'Love'} ({photo.likes + (isLiked ? 1 : 0)})</span>
          </button>
        </div>
      </div>
    </article>
  );
};
