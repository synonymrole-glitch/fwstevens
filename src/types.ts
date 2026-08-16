export interface PhotoItem {
  id: string;
  title: string;
  subtitle?: string;
  story: string;
  category: 'fairy-tale' | 'birds-avian' | 'whispering-forest' | 'ethereal-portraits' | 'golden-light';
  url: string;
  highResUrl: string;
  thumbnailUrl?: string;
  githubPath?: string;
  aspectRatio: 'portrait' | 'landscape' | 'square' | 'panoramic';
  exif: {
    camera: string;
    lens: string;
    focalLength: string;
    aperture: string;
    shutterSpeed: string;
    iso: string;
    dateTaken: string;
    location: string;
  };
  palette: string[];
  tags: string[];
  likes: number;
  featured?: boolean;
}

export type GalleryLayoutMode = 'masonry' | 'editorial' | 'grid' | 'story';

export type CursorStyleType = 'fairy-sparkle' | 'fluttering-bird' | 'whimsical-butterfly' | 'minimal-pearl' | 'default';

export type ThemePresetKey = 'ethereal-rose' | 'enchanted-moss' | 'swan-whisper' | 'celestial-twilight' | 'golden-fairy';

export interface ThemeColors {
  id: ThemePresetKey;
  name: string;
  tagline: string;
  bg: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  glassBg: string;
  glowColor: string;
}

export interface ThemeConfig {
  preset: ThemePresetKey;
  customColors?: Partial<ThemeColors>;
  fontFamily: 'cormorant' | 'playfair' | 'cinzel' | 'jakarta';
  cursorStyle: CursorStyleType;
  enableAmbientParticles: boolean;
  enableSoundEffects: boolean;
  borderRadius: 'sm' | 'md' | 'lg' | 'full';
  gallerySpacing: 'compact' | 'airy' | 'spacious';
}

export interface ImageEditState {
  brightness: number; // 0 - 200 (default 100)
  contrast: number; // 0 - 200 (default 100)
  saturation: number; // 0 - 200 (default 100)
  warmth: number; // -50 to +50 (default 0)
  tint: number; // -50 to +50 (default 0)
  fairyGlow: number; // 0 - 100 (default 0)
  grain: number; // 0 - 100 (default 0)
  vignette: number; // 0 - 100 (default 0)
  blur: number; // 0 - 20 (default 0)
  overlay: 'none' | 'fairy-dust' | 'feathers' | 'light-leak' | 'vintage-mist';
  cropAspect: 'original' | '1:1' | '4:5' | '16:9' | '3:2';
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  presetApplied?: string;
}

export interface BandcampTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  embedUrl: string; // iframe or streaming URL
  audioSrc?: string;
  duration: string;
  genre: string;
  description: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  duration: string;
  category: 'behind-the-scenes' | 'fairy-vlog' | 'visual-poem' | 'gear-craft';
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone?: string;
  socialHandle?: string;
  inquiryType: 'bridal-elopement' | 'fairy-concept' | 'editorial-fashion' | 'fine-art-prints' | 'avian-nature';
  preferredDate?: string;
  seasonPreference: 'spring-blossom' | 'summer-solstice' | 'autumn-mist' | 'winter-frost' | 'flexible';
  locationType: 'enchanted-woodland' | 'coastal-cliffs' | 'historic-chateau' | 'studio-sanctuary' | 'destination';
  specificLocation?: string;
  visionNotes: string;
  budgetRange: 'under-1k' | '1k-2.5k' | '2.5k-5k' | '5k-plus' | 'undecided';
  howHeard: string;
}

export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  interests: string[];
  subscribedAt: string;
}

export interface GitHubRepoConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  personalAccessToken?: string;
  isConnected: boolean;
  repoName?: string;
  repoUrl?: string;
}
