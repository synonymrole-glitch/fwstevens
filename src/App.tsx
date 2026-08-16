/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PhotoItem, ThemeConfig, ThemeColors, GitHubRepoConfig } from './types';
import { DEFAULT_PHOTOS, THEME_PRESETS, BANDCAMP_TRACKS, CURATED_GITHUB_REPOS } from './data/defaultData';
import { WhimsicalCursor } from './components/WhimsicalCursor';
import { Navbar } from './components/Navbar';
import { GalleryView } from './components/GalleryView';
import { PhotoLightbox } from './components/PhotoLightbox';
import { ImageEditorModal } from './components/ImageEditorModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { GitHubRepoModal } from './components/GitHubRepoModal';
import { BandcampPlayerBar } from './components/BandcampPlayerBar';
import { YouTubeShowcase } from './components/YouTubeShowcase';
import { SocialShareModal } from './components/SocialShareModal';
import { NewsletterSection } from './components/NewsletterSection';
import { ContactInquiryPage } from './components/ContactInquiryPage';
import { Footer } from './components/Footer';
import confetti from 'canvas-confetti';

export default function App() {
  // Photos State
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem('faerielens_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_PHOTOS;
  });

  // Theme Config State
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('faerielens_theme_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return {
      preset: 'enchanted-moss',
      fontFamily: 'cormorant',
      cursorStyle: 'fairy-sparkle',
      enableAmbientParticles: true,
      enableSoundEffects: true,
      borderRadius: 'lg',
      gallerySpacing: 'airy',
    };
  });

  // GitHub Repo State
  const [githubConfig, setGithubConfig] = useState<GitHubRepoConfig>(() => {
    try {
      const saved = localStorage.getItem('faerielens_github_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return {
      owner: CURATED_GITHUB_REPOS[0].owner,
      repo: CURATED_GITHUB_REPOS[0].repo,
      branch: 'main',
      path: 'photos',
      isConnected: true,
      repoName: CURATED_GITHUB_REPOS[0].name,
    };
  });

  // Navigation Tab
  const [currentTab, setCurrentTab] = useState<'gallery' | 'showcase' | 'inquiry' | 'dispatch'>('gallery');

  // Modals and Active Photo states
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [editorPhoto, setEditorPhoto] = useState<PhotoItem | null>(null);
  const [sharePhoto, setSharePhoto] = useState<PhotoItem | null>(null);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);

  // Likes Tracking
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('faerielens_likes');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // Ignore
    }
    return new Set(['faerie-01', 'portrait-01']);
  });

  // Bandcamp Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Active theme colors
  const activeTheme: ThemeColors = THEME_PRESETS[themeConfig.preset] || THEME_PRESETS['enchanted-moss'];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('faerielens_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('faerielens_theme_config', JSON.stringify(themeConfig));
  }, [themeConfig]);

  useEffect(() => {
    localStorage.setItem('faerielens_github_config', JSON.stringify(githubConfig));
  }, [githubConfig]);

  useEffect(() => {
    localStorage.setItem('faerielens_likes', JSON.stringify(Array.from(likedPhotoIds)));
  }, [likedPhotoIds]);

  // Handlers
  const handleLikePhoto = (photoId: string) => {
    setLikedPhotoIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
        confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 } });
      }
      return next;
    });
  };

  const handleSaveEditedPhoto = (updated: PhotoItem) => {
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (lightboxPhoto && lightboxPhoto.id === updated.id) {
      setLightboxPhoto(updated);
    }
  };

  const handleImportPhotos = (newPhotos: PhotoItem[]) => {
    setPhotos(newPhotos);
  };

  // Lightbox Navigation
  const handleNextLightbox = () => {
    if (!lightboxPhoto) return;
    const curIdx = photos.findIndex((p) => p.id === lightboxPhoto.id);
    const nextIdx = (curIdx + 1) % photos.length;
    setLightboxPhoto(photos[nextIdx]);
  };

  const handlePrevLightbox = () => {
    if (!lightboxPhoto) return;
    const curIdx = photos.findIndex((p) => p.id === lightboxPhoto.id);
    const prevIdx = (curIdx - 1 + photos.length) % photos.length;
    setLightboxPhoto(photos[prevIdx]);
  };

  const currentTrack = BANDCAMP_TRACKS[currentTrackIndex] || BANDCAMP_TRACKS[0];

  // Dynamic font class style
  const getFontFamilyStyle = () => {
    switch (themeConfig.fontFamily) {
      case 'cormorant':
        return { fontFamily: 'Cormorant Garamond, serif' };
      case 'playfair':
        return { fontFamily: 'Playfair Display, serif' };
      case 'cinzel':
        return { fontFamily: 'Cinzel, serif' };
      case 'jakarta':
      default:
        return { fontFamily: 'Plus Jakarta Sans, sans-serif' };
    }
  };

  return (
    <div
      id="faerielens-root"
      className="min-h-screen transition-colors duration-500 relative flex flex-col selection:bg-emerald-200 selection:text-emerald-950"
      style={{
        backgroundColor: activeTheme.bg,
        backgroundImage: activeTheme.bgGradient,
        color: activeTheme.textPrimary,
        ...getFontFamilyStyle(),
      }}
    >
      {/* Whimsical Custom Cursor & Particle Spores */}
      <WhimsicalCursor
        cursorType={themeConfig.cursorStyle}
        accentColor={activeTheme.accent}
        enableAmbientParticles={themeConfig.enableAmbientParticles}
      />

      {/* Main Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenThemeModal={() => setThemeModalOpen(true)}
        onOpenGitHubModal={() => setGithubModalOpen(true)}
        onOpenEditor={() => setEditorPhoto(photos[0] || null)}
        theme={activeTheme}
        themeConfig={themeConfig}
        githubConfig={githubConfig}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
        currentTrackTitle={currentTrack.title}
      />

      {/* Main Viewport Content based on active tab */}
      <main className="flex-1">
        {currentTab === 'gallery' && (
          <>
            <GalleryView
              photos={photos}
              theme={activeTheme}
              themeConfig={themeConfig}
              onPhotoClick={(photo) => setLightboxPhoto(photo)}
              onEditPhoto={(photo) => setEditorPhoto(photo)}
              onSharePhoto={(photo) => setSharePhoto(photo)}
              onLikePhoto={handleLikePhoto}
              likedPhotoIds={likedPhotoIds}
              onOpenGitHubModal={() => setGithubModalOpen(true)}
              onOpenInquiry={() => setCurrentTab('inquiry')}
            />

            {/* Newsletter Dispatch section embedded into gallery stream */}
            <NewsletterSection theme={activeTheme} />
          </>
        )}

        {currentTab === 'showcase' && (
          <YouTubeShowcase
            theme={activeTheme}
            onOpenInquiry={() => setCurrentTab('inquiry')}
            bandcampTracks={BANDCAMP_TRACKS}
            onPlayBandcampTrack={(idx) => {
              setCurrentTrackIndex(idx);
              setIsPlayingAudio(true);
            }}
          />
        )}

        {currentTab === 'dispatch' && (
          <div className="py-8">
            <NewsletterSection theme={activeTheme} />
          </div>
        )}

        {currentTab === 'inquiry' && (
          <ContactInquiryPage theme={activeTheme} />
        )}
      </main>

      {/* Floating Bandcamp Ambient Audio Player Bar */}
      <BandcampPlayerBar
        tracks={BANDCAMP_TRACKS}
        isPlaying={isPlayingAudio}
        onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
        currentTrackIndex={currentTrackIndex}
        onSelectTrack={(idx) => {
          setCurrentTrackIndex(idx);
          setIsPlayingAudio(true);
        }}
        theme={activeTheme}
      />

      {/* Fullscreen Photo Lightbox Modal */}
      <PhotoLightbox
        photo={lightboxPhoto}
        isOpen={Boolean(lightboxPhoto)}
        onClose={() => setLightboxPhoto(null)}
        onPrev={handlePrevLightbox}
        onNext={handleNextLightbox}
        onEditPhoto={(photo) => {
          setLightboxPhoto(null);
          setEditorPhoto(photo);
        }}
        onSharePhoto={(photo) => {
          setSharePhoto(photo);
        }}
        onLikePhoto={handleLikePhoto}
        isLiked={Boolean(lightboxPhoto && likedPhotoIds.has(lightboxPhoto.id))}
        theme={activeTheme}
      />

      {/* Studio RAW Photo Editor Modal */}
      <ImageEditorModal
        photo={editorPhoto}
        isOpen={Boolean(editorPhoto)}
        onClose={() => setEditorPhoto(null)}
        onSavePhoto={handleSaveEditedPhoto}
        theme={activeTheme}
        githubConfig={githubConfig}
      />

      {/* Theme Studio Modal */}
      <ThemeCustomizerModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        themeConfig={themeConfig}
        onChangeThemeConfig={setThemeConfig}
        activeTheme={activeTheme}
      />

      {/* GitHub Repository Sync Modal */}
      <GitHubRepoModal
        isOpen={githubModalOpen}
        onClose={() => setGithubModalOpen(false)}
        config={githubConfig}
        onUpdateConfig={setGithubConfig}
        onImportPhotos={handleImportPhotos}
        currentPhotos={photos}
        theme={activeTheme}
      />

      {/* Social Media Sharing Modal */}
      <SocialShareModal
        photo={sharePhoto}
        isOpen={Boolean(sharePhoto)}
        onClose={() => setSharePhoto(null)}
        theme={activeTheme}
      />

      {/* Site Footer */}
      <Footer
        theme={activeTheme}
        githubConfig={githubConfig}
        onOpenGitHubModal={() => setGithubModalOpen(true)}
        onOpenThemeModal={() => setThemeModalOpen(true)}
        onSelectTab={setCurrentTab}
      />
    </div>
  );
}
