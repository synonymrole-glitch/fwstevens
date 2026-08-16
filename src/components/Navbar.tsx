import React, { useState } from 'react';
import { Sparkles, Palette, Github, Music, Video, Mail, Calendar, Camera, Menu, X, Feather, Disc } from 'lucide-react';
import { ThemeConfig, ThemeColors, GitHubRepoConfig } from '../types';

interface NavbarProps {
  currentTab: 'gallery' | 'showcase' | 'inquiry' | 'dispatch';
  onSelectTab: (tab: 'gallery' | 'showcase' | 'inquiry' | 'dispatch') => void;
  onOpenThemeModal: () => void;
  onOpenGitHubModal: () => void;
  onOpenEditor: () => void;
  theme: ThemeColors;
  themeConfig: ThemeConfig;
  githubConfig: GitHubRepoConfig;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  currentTrackTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenThemeModal,
  onOpenGitHubModal,
  onOpenEditor,
  theme,
  githubConfig,
  isPlayingAudio,
  onToggleAudio,
  currentTrackTitle,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      id="main-navigation"
      className="sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-300"
      style={{
        backgroundColor: theme.glassBg,
        borderColor: theme.cardBorder,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Emblem */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              onSelectTab('gallery');
              setMobileMenuOpen(false);
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xs"
              style={{
                backgroundColor: theme.accentSoft,
                border: `1px solid ${theme.accentBorder}`,
                color: theme.accent,
              }}
            >
              {/* Whimsical Wing & Feather Emblem */}
              <Feather className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className="font-serif text-2xl tracking-wide font-medium"
                  style={{ color: theme.textPrimary }}
                >
                  FaerieLens
                </span>
                <span
                  className="inline-block text-xs font-serif italic px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: theme.badgeBg,
                    color: theme.badgeText,
                  }}
                >
                  Studio
                </span>
              </div>
              <p
                className="text-[11px] font-sans tracking-widest uppercase opacity-70"
                style={{ color: theme.textSecondary }}
              >
                Fine Art, Birds & Fairy Chronicles
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-link-gallery"
              onClick={() => onSelectTab('gallery')}
              className={`px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                currentTab === 'gallery' ? 'shadow-xs' : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: currentTab === 'gallery' ? theme.accentSoft : 'transparent',
                color: currentTab === 'gallery' ? theme.accent : theme.textSecondary,
                border: currentTab === 'gallery' ? `1px solid ${theme.accentBorder}` : '1px solid transparent',
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Gallery</span>
            </button>

            <button
              id="nav-link-showcase"
              onClick={() => onSelectTab('showcase')}
              className={`px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                currentTab === 'showcase' ? 'shadow-xs' : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: currentTab === 'showcase' ? theme.accentSoft : 'transparent',
                color: currentTab === 'showcase' ? theme.accent : theme.textSecondary,
                border: currentTab === 'showcase' ? `1px solid ${theme.accentBorder}` : '1px solid transparent',
              }}
            >
              <Video className="w-4 h-4" />
              <span>Film & Audio</span>
            </button>

            <button
              id="nav-link-dispatch"
              onClick={() => onSelectTab('dispatch')}
              className={`px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                currentTab === 'dispatch' ? 'shadow-xs' : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: currentTab === 'dispatch' ? theme.accentSoft : 'transparent',
                color: currentTab === 'dispatch' ? theme.accent : theme.textSecondary,
                border: currentTab === 'dispatch' ? `1px solid ${theme.accentBorder}` : '1px solid transparent',
              }}
            >
              <Mail className="w-4 h-4" />
              <span>Dispatch</span>
            </button>

            <button
              id="nav-link-inquiry"
              onClick={() => onSelectTab('inquiry')}
              className={`px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                currentTab === 'inquiry' ? 'shadow-xs' : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: currentTab === 'inquiry' ? theme.accentSoft : 'transparent',
                color: currentTab === 'inquiry' ? theme.accent : theme.textSecondary,
                border: currentTab === 'inquiry' ? `1px solid ${theme.accentBorder}` : '1px solid transparent',
              }}
            >
              <Calendar className="w-4 h-4" />
              <span>Inquire</span>
            </button>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            {/* Audio Toggle with Equalizer Wave */}
            <button
              id="nav-audio-btn"
              onClick={onToggleAudio}
              title={isPlayingAudio ? 'Pause ambient Bandcamp aura' : 'Play ambient Bandcamp harp soundtrack'}
              className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isPlayingAudio ? theme.badgeBg : theme.accentSoft,
                color: theme.accent,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              {isPlayingAudio ? (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <Disc className="w-3.5 h-3.5" />
              )}
              <span className="max-w-[90px] truncate hidden md:inline">
                {isPlayingAudio ? currentTrackTitle || 'Playing Aura' : 'Bandcamp'}
              </span>
            </button>

            {/* Photo Editor Button */}
            <button
              id="nav-editor-btn"
              onClick={onOpenEditor}
              title="Open Photo Editing Studio"
              className="p-2 rounded-full transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.accentSoft,
                color: theme.accent,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Theme Customizer Button */}
            <button
              id="nav-theme-btn"
              onClick={onOpenThemeModal}
              title="Customize Palette & Whimsical Cursors"
              className="p-2 rounded-full transition-all duration-200 hover:scale-105 relative"
              style={{
                backgroundColor: theme.accentSoft,
                color: theme.accent,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              <Palette className="w-4 h-4" />
              <span
                className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                style={{ backgroundColor: theme.accent }}
              />
            </button>

            {/* GitHub Repo Button */}
            <button
              id="nav-github-btn"
              onClick={onOpenGitHubModal}
              title="Connect GitHub Repository or Export Site"
              className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.cardBg,
                color: theme.textPrimary,
                border: `1px solid ${theme.cardBorder}`,
              }}
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{githubConfig.owner ? `${githubConfig.owner}/${githubConfig.repo}` : 'GitHub Sync'}</span>
            </button>

            {/* Inquire CTA */}
            <button
              id="nav-cta-book-btn"
              onClick={() => onSelectTab('inquiry')}
              className="px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md hover:scale-102"
              style={{
                backgroundColor: theme.accent,
                color: '#FFFFFF',
              }}
            >
              Book Session
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-audio-btn"
              onClick={onToggleAudio}
              className="p-2 rounded-full"
              style={{ color: theme.accent, backgroundColor: theme.accentSoft }}
            >
              <Music className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg"
              style={{ color: theme.textPrimary }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden border-b px-4 pt-2 pb-6 space-y-3 animate-fadeIn"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                onSelectTab('gallery');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl text-left font-medium text-sm flex items-center gap-2"
              style={{
                backgroundColor: currentTab === 'gallery' ? theme.accentSoft : 'transparent',
                color: currentTab === 'gallery' ? theme.accent : theme.textPrimary,
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Gallery</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('showcase');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl text-left font-medium text-sm flex items-center gap-2"
              style={{
                backgroundColor: currentTab === 'showcase' ? theme.accentSoft : 'transparent',
                color: currentTab === 'showcase' ? theme.accent : theme.textPrimary,
              }}
            >
              <Video className="w-4 h-4" />
              <span>Film & Audio</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('dispatch');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl text-left font-medium text-sm flex items-center gap-2"
              style={{
                backgroundColor: currentTab === 'dispatch' ? theme.accentSoft : 'transparent',
                color: currentTab === 'dispatch' ? theme.accent : theme.textPrimary,
              }}
            >
              <Mail className="w-4 h-4" />
              <span>Dispatch</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('inquiry');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl text-left font-medium text-sm flex items-center gap-2"
              style={{
                backgroundColor: currentTab === 'inquiry' ? theme.accentSoft : 'transparent',
                color: currentTab === 'inquiry' ? theme.accent : theme.textPrimary,
              }}
            >
              <Calendar className="w-4 h-4" />
              <span>Inquire</span>
            </button>
          </div>

          <div className="pt-2 border-t flex flex-wrap gap-2" style={{ borderColor: theme.cardBorder }}>
            <button
              onClick={() => {
                onOpenEditor();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo Editor</span>
            </button>

            <button
              onClick={() => {
                onOpenThemeModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Themes</span>
            </button>

            <button
              onClick={() => {
                onOpenGitHubModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
