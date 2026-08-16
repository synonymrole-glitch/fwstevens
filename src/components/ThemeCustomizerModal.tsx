import React from 'react';
import {
  X,
  Palette,
  Sparkles,
  MousePointer,
  Type,
  Maximize,
  Sliders,
  Check,
  Feather,
  Sun,
  Eye,
  Heart,
} from 'lucide-react';
import { ThemeConfig, ThemePresetKey, CursorStyleType, ThemeColors } from '../types';
import { THEME_PRESETS } from '../data/defaultData';
import confetti from 'canvas-confetti';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ThemeConfig;
  onChangeThemeConfig: (newConfig: ThemeConfig) => void;
  activeTheme: ThemeColors;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  themeConfig,
  onChangeThemeConfig,
  activeTheme,
}) => {
  if (!isOpen) return null;

  const presets = Object.values(THEME_PRESETS);

  const cursors: { id: CursorStyleType; name: string; desc: string; icon: any }[] = [
    {
      id: 'fairy-sparkle',
      name: 'Fairy Wand Sparkle',
      desc: 'Interactive 4-point star trail & golden dust burst on click',
      icon: Sparkles,
    },
    {
      id: 'fluttering-bird',
      name: 'Avian Swan & Feather',
      desc: 'Gliding origami bird wing with soft feather strokes',
      icon: Feather,
    },
    {
      id: 'whimsical-butterfly',
      name: 'Enchanted Butterfly',
      desc: 'Rotating fairy butterfly with luminous dust trail',
      icon: Sparkles,
    },
    {
      id: 'minimal-pearl',
      name: 'Minimalist Pearl Ring',
      desc: 'Clean, airy modern luxury ring with delicate dot center',
      icon: MousePointer,
    },
    {
      id: 'default',
      name: 'Default Browser Cursor',
      desc: 'Standard system arrow pointer without particle canvas',
      icon: MousePointer,
    },
  ];

  const fonts: { id: ThemeConfig['fontFamily']; name: string; sample: string; desc: string }[] = [
    {
      id: 'cormorant',
      name: 'Cormorant Garamond',
      sample: 'The Whispering Avian Grove',
      desc: 'Refined, high-contrast Renaissance serif with romantic italics',
    },
    {
      id: 'playfair',
      name: 'Playfair Display',
      sample: 'Ethereal Fine Art Chronicles',
      desc: 'Classic editorial serif with generous proportions and graceful curves',
    },
    {
      id: 'cinzel',
      name: 'Cinzel Decorative',
      sample: 'MYTHIC SWAN LAKE LORE',
      desc: 'Classical Roman inscriptions with whimsical fairy flourishes',
    },
    {
      id: 'jakarta',
      name: 'Plus Jakarta Sans',
      sample: 'Airy Modern Minimalist',
      desc: 'Clean geometric sans-serif for sleek modern balance',
    },
  ];

  const handleSelectPreset = (presetKey: ThemePresetKey) => {
    onChangeThemeConfig({
      ...themeConfig,
      preset: presetKey,
    });
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
  };

  return (
    <div
      id="theme-customizer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn"
    >
      <div
        id="theme-customizer-container"
        className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: activeTheme.cardBg,
          borderColor: activeTheme.cardBorder,
        }}
      >
        {/* Header */}
        <div
          className="p-5 sm:p-6 border-b flex items-center justify-between"
          style={{ borderColor: activeTheme.cardBorder, backgroundColor: activeTheme.glassBg }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: activeTheme.accentSoft, color: activeTheme.accent }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-medium" style={{ color: activeTheme.textPrimary }}>
                Aesthetic & Whimsical Theme Studio
              </h2>
              <p className="text-xs" style={{ color: activeTheme.textMuted }}>
                Soft greens, warm earthy browns, fairy cursor trails, and typography
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            style={{ color: activeTheme.textSecondary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: Color Palette Presets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5" style={{ color: activeTheme.accent }}>
                <Palette className="w-3.5 h-3.5" />
                <span>Soft Green & Earthy Brown Palettes</span>
              </label>
              <span className="text-[11px] font-serif italic" style={{ color: activeTheme.textMuted }}>
                Current: {THEME_PRESETS[themeConfig.preset]?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((preset) => {
                const isSelected = themeConfig.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                      isSelected ? 'shadow-md scale-101 ring-2' : 'hover:opacity-90'
                    }`}
                    style={{
                      backgroundColor: preset.bg,
                      borderColor: isSelected ? preset.accent : preset.cardBorder,
                      ringColor: preset.accent,
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-serif text-sm font-medium" style={{ color: preset.textPrimary }}>
                          {preset.name}
                        </div>
                        <div className="text-[11px] leading-tight opacity-75" style={{ color: preset.textSecondary }}>
                          {preset.tagline}
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: preset.accent, color: '#FFFFFF' }}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Color Swatch Strips */}
                    <div className="flex items-center gap-1.5 pt-2 border-t" style={{ borderColor: preset.cardBorder }}>
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.bg }} />
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.accent }} />
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.accentSoft }} />
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.badgeBg }} />
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.textPrimary }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Whimsical Cursor Selection */}
          <div>
            <label className="text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-3" style={{ color: activeTheme.accent }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Whimsical Fairy & Avian Cursors</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cursors.map((c) => {
                const isSelected = themeConfig.cursorStyle === c.id;
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => onChangeThemeConfig({ ...themeConfig, cursorStyle: c.id })}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected ? 'shadow-xs font-medium' : 'hover:opacity-85'
                    }`}
                    style={{
                      backgroundColor: isSelected ? activeTheme.accentSoft : activeTheme.cardBg,
                      borderColor: isSelected ? activeTheme.accent : activeTheme.cardBorder,
                      color: isSelected ? activeTheme.accent : activeTheme.textPrimary,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isSelected ? activeTheme.accent : activeTheme.accentSoft,
                        color: isSelected ? '#FFFFFF' : activeTheme.accent,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                      <div className="text-xs font-semibold">{c.name}</div>
                      <div className="text-[11px] opacity-70 leading-relaxed" style={{ color: activeTheme.textSecondary }}>
                        {c.desc}
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 shrink-0" style={{ color: activeTheme.accent }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Typography & Editorial Accents */}
          <div>
            <label className="text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-3" style={{ color: activeTheme.accent }}>
              <Type className="w-3.5 h-3.5" />
              <span>Typography Styling</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {fonts.map((f) => {
                const isSelected = themeConfig.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => onChangeThemeConfig({ ...themeConfig, fontFamily: f.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected ? 'shadow-xs font-medium' : 'hover:opacity-85'
                    }`}
                    style={{
                      backgroundColor: isSelected ? activeTheme.accentSoft : activeTheme.cardBg,
                      borderColor: isSelected ? activeTheme.accent : activeTheme.cardBorder,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: isSelected ? activeTheme.accent : activeTheme.textPrimary }}>
                        {f.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />}
                    </div>
                    <div
                      className="text-sm font-serif italic mb-1"
                      style={{
                        fontFamily: f.id === 'cormorant' ? 'Cormorant Garamond, serif' : f.id === 'playfair' ? 'Playfair Display, serif' : f.id === 'cinzel' ? 'Cinzel, serif' : 'Plus Jakarta Sans, sans-serif',
                        color: activeTheme.textPrimary,
                      }}
                    >
                      "{f.sample}"
                    </div>
                    <div className="text-[10px] opacity-65" style={{ color: activeTheme.textSecondary }}>
                      {f.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Ambient Atmosphere & Particles */}
          <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: activeTheme.cardBorder }}>
            <div>
              <div className="text-xs font-semibold" style={{ color: activeTheme.textPrimary }}>
                Ambient Fairy Spores & Particles
              </div>
              <div className="text-[11px] opacity-75" style={{ color: activeTheme.textSecondary }}>
                Subtle floating luminous spores drift across the background
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={themeConfig.enableAmbientParticles}
                onChange={(e) => onChangeThemeConfig({ ...themeConfig, enableAmbientParticles: e.target.checked })}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: themeConfig.enableAmbientParticles ? activeTheme.accent : '#E5E7EB' }}
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t flex justify-end gap-3"
          style={{ borderColor: activeTheme.cardBorder, backgroundColor: activeTheme.glassBg }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold text-white shadow-sm hover:scale-102 transition-transform"
            style={{ backgroundColor: activeTheme.accent }}
          >
            Apply & Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
