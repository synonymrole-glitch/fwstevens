import React from 'react';
import { Feather, Heart, Github, Sparkles, Instagram, Music, Mail, ExternalLink } from 'lucide-react';
import { ThemeColors, GitHubRepoConfig } from '../types';

interface FooterProps {
  theme: ThemeColors;
  githubConfig: GitHubRepoConfig;
  onOpenGitHubModal: () => void;
  onOpenThemeModal: () => void;
  onSelectTab: (tab: 'gallery' | 'showcase' | 'inquiry' | 'dispatch') => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  githubConfig,
  onOpenGitHubModal,
  onOpenThemeModal,
  onSelectTab,
}) => {
  return (
    <footer
      id="site-footer"
      className="border-t transition-colors duration-300 mt-20"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.cardBorder,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-xs"
                style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
              >
                <Feather className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-medium" style={{ color: theme.textPrimary }}>
                FaerieLens Studio
              </span>
            </div>

            <p className="text-xs sm:text-sm font-sans font-light opacity-80 max-w-md leading-relaxed" style={{ color: theme.textSecondary }}>
              An ethereal, fine-art photography portfolio chronicling wild swans, whispering ancient woodlands, and romantic bridal fairytales. Hosted seamlessly with GitHub version control and high-performance CDN delivery.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenGitHubModal}
                className="p-2 rounded-full border transition-transform hover:scale-105"
                style={{ borderColor: theme.cardBorder, color: theme.textPrimary }}
                title="View GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('showcase')}
                className="p-2 rounded-full border transition-transform hover:scale-105"
                style={{ borderColor: theme.cardBorder, color: theme.textPrimary }}
                title="Bandcamp Soundscapes & Film Reels"
              >
                <Music className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('dispatch')}
                className="p-2 rounded-full border transition-transform hover:scale-105"
                style={{ borderColor: theme.cardBorder, color: theme.textPrimary }}
                title="Faerie Dispatch Newsletter"
              >
                <Mail className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenThemeModal}
                className="p-2 rounded-full border transition-transform hover:scale-105"
                style={{ borderColor: theme.cardBorder, color: theme.textPrimary }}
                title="Customize Aesthetics & Whimsical Cursors"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider" style={{ color: theme.textPrimary }}>
              Chronicles & Studio
            </h4>
            <ul className="space-y-2" style={{ color: theme.textSecondary }}>
              <li>
                <button onClick={() => onSelectTab('gallery')} className="hover:underline">
                  Fine Art Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('showcase')} className="hover:underline">
                  Behind the Lens Film Reels
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('showcase')} className="hover:underline">
                  Bandcamp Ethereal Audio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dispatch')} className="hover:underline">
                  Faerie Dispatch Letters
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('inquiry')} className="hover:underline font-semibold" style={{ color: theme.accent }}>
                  Book 2026/2027 Commission
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: GitHub & Infrastructure */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider" style={{ color: theme.textPrimary }}>
              GitHub Portfolio Hub
            </h4>
            <p className="text-[11px] opacity-75" style={{ color: theme.textSecondary }}>
              Connected to: <span className="font-mono">{githubConfig.owner || 'faerielens'}/{githubConfig.repo || 'gallery'}</span>
            </p>
            <ul className="space-y-2" style={{ color: theme.textSecondary }}>
              <li>
                <button onClick={onOpenGitHubModal} className="hover:underline flex items-center gap-1">
                  <span>Sync Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={onOpenGitHubModal} className="hover:underline">
                  Upload Archival Captures
                </button>
              </li>
              <li>
                <button onClick={onOpenGitHubModal} className="hover:underline">
                  Deploy to GitHub Pages
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4"
          style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
        >
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} FaerieLens Fine Art Studio. Crafted with</span>
            <Heart className="w-3 h-3 fill-current text-rose-400" />
            <span>& fairy dust.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={onOpenThemeModal} className="hover:underline">
              Theme Studio
            </button>
            <span>·</span>
            <button onClick={onOpenGitHubModal} className="hover:underline">
              GitHub Pages Ready
            </button>
            <span>·</span>
            <button onClick={() => onSelectTab('inquiry')} className="hover:underline">
              Private Commissions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
