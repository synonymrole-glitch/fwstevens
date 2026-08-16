import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  RotateCw,
  FlipHorizontal,
  Sliders,
  Sparkles,
  Download,
  Github,
  Save,
  Undo2,
  Eye,
  Check,
  Crop,
  Layers,
  Wand2,
  Sun,
  Contrast,
  Droplet,
  Feather,
  Flame,
  CloudFog,
} from 'lucide-react';
import { PhotoItem, ImageEditState, ThemeColors, GitHubRepoConfig } from '../types';
import { commitImageToGitHub } from '../utils/githubService';
import confetti from 'canvas-confetti';

interface ImageEditorModalProps {
  photo: PhotoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (updatedPhoto: PhotoItem) => void;
  theme: ThemeColors;
  githubConfig: GitHubRepoConfig;
}

const INITIAL_EDIT_STATE: ImageEditState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  warmth: 0,
  tint: 0,
  fairyGlow: 0,
  grain: 0,
  vignette: 0,
  blur: 0,
  overlay: 'none',
  cropAspect: 'original',
  rotation: 0,
  flipH: false,
  flipV: false,
};

const PRESETS = [
  {
    id: 'fairy-glow',
    name: 'Fairy Dust Glow',
    icon: Sparkles,
    state: { brightness: 108, contrast: 105, saturation: 110, warmth: 8, fairyGlow: 40, grain: 15, vignette: 20, overlay: 'fairy-dust' as const },
  },
  {
    id: 'swan-silk',
    name: 'Swan Silk Pastel',
    icon: Feather,
    state: { brightness: 115, contrast: 92, saturation: 88, warmth: -6, fairyGlow: 25, grain: 10, vignette: 10, overlay: 'vintage-mist' as const },
  },
  {
    id: 'enchanted-grove',
    name: 'Enchanted Grove',
    icon: CloudFog,
    state: { brightness: 98, contrast: 112, saturation: 118, warmth: -4, tint: -10, fairyGlow: 20, grain: 20, vignette: 30, overlay: 'none' as const },
  },
  {
    id: 'vintage-35mm',
    name: 'Vintage 35mm Film',
    icon: Flame,
    state: { brightness: 102, contrast: 108, saturation: 95, warmth: 16, fairyGlow: 15, grain: 45, vignette: 35, overlay: 'light-leak' as const },
  },
  {
    id: 'celestial-twilight',
    name: 'Celestial Twilight',
    icon: Wand2,
    state: { brightness: 104, contrast: 105, saturation: 105, warmth: -12, tint: 18, fairyGlow: 35, grain: 15, vignette: 25, overlay: 'fairy-dust' as const },
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz Velvet',
    icon: Sparkles,
    state: { brightness: 110, contrast: 102, saturation: 112, warmth: 10, tint: 14, fairyGlow: 30, grain: 12, vignette: 15, overlay: 'none' as const },
  },
  {
    id: 'silver-whisper',
    name: 'Silver Monochrome',
    icon: Layers,
    state: { brightness: 106, contrast: 115, saturation: 0, warmth: -5, fairyGlow: 25, grain: 30, vignette: 40, overlay: 'vintage-mist' as const },
  },
];

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  photo,
  isOpen,
  onClose,
  onSavePhoto,
  theme,
  githubConfig,
}) => {
  const [editState, setEditState] = useState<ImageEditState>(INITIAL_EDIT_STATE);
  const [activeTab, setActiveTab] = useState<'presets' | 'adjust' | 'overlays' | 'crop'>('presets');
  const [showOriginal, setShowOriginal] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Initialize image on open
  useEffect(() => {
    if (!photo || !isOpen) return;

    setEditState(INITIAL_EDIT_STATE);
    setImageLoaded(false);
    setStatusNotification(null);
    setShowCommitDialog(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImageRef.current = img;
      setImageLoaded(true);
    };
    img.src = photo.highResUrl || photo.url;
  }, [photo, isOpen]);

  // Apply edits to canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions based on crop and rotation
    const isRotated90or270 = editState.rotation === 90 || editState.rotation === 270;
    let baseW = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
    let baseH = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

    // Crop Aspect Ratio calculation
    let cropW = baseW;
    let cropH = baseH;
    let cropX = 0;
    let cropY = 0;

    if (editState.cropAspect === '1:1') {
      const minDim = Math.min(baseW, baseH);
      cropW = minDim;
      cropH = minDim;
      cropX = (baseW - minDim) / 2;
      cropY = (baseH - minDim) / 2;
    } else if (editState.cropAspect === '4:5') {
      const targetRatio = 4 / 5;
      if (baseW / baseH > targetRatio) {
        cropW = baseH * targetRatio;
        cropH = baseH;
        cropX = (baseW - cropW) / 2;
      } else {
        cropW = baseW;
        cropH = baseW / targetRatio;
        cropY = (baseH - cropH) / 2;
      }
    } else if (editState.cropAspect === '16:9') {
      const targetRatio = 16 / 9;
      if (baseW / baseH > targetRatio) {
        cropW = baseH * targetRatio;
        cropH = baseH;
        cropX = (baseW - cropW) / 2;
      } else {
        cropW = baseW;
        cropH = baseW / targetRatio;
        cropY = (baseH - cropH) / 2;
      }
    } else if (editState.cropAspect === '3:2') {
      const targetRatio = 3 / 2;
      if (baseW / baseH > targetRatio) {
        cropW = baseH * targetRatio;
        cropH = baseH;
        cropX = (baseW - cropW) / 2;
      } else {
        cropW = baseW;
        cropH = baseW / targetRatio;
        cropY = (baseH - cropH) / 2;
      }
    }

    // Set canvas dimensions
    canvas.width = cropW;
    canvas.height = cropH;

    // Render image with transformations
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showOriginal) {
      // Draw pristine original
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      return;
    }

    // Apply CSS Filter
    let filterString = `brightness(${editState.brightness}%) contrast(${editState.contrast}%) saturate(${editState.saturation}%)`;
    if (editState.blur > 0) {
      filterString += ` blur(${editState.blur}px)`;
    }
    ctx.filter = filterString;

    // Center and rotate/flip
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (editState.rotation !== 0) {
      ctx.rotate((editState.rotation * Math.PI) / 180);
    }
    ctx.scale(editState.flipH ? -1 : 1, editState.flipV ? -1 : 1);

    const drawW = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
    const drawH = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Color Tint & Warmth Layer
    if (editState.warmth !== 0 || editState.tint !== 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      if (editState.warmth > 0) {
        ctx.fillStyle = `rgba(255, 175, 75, ${Math.abs(editState.warmth) / 150})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (editState.warmth < 0) {
        ctx.fillStyle = `rgba(100, 180, 255, ${Math.abs(editState.warmth) / 150})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      if (editState.tint > 0) {
        // Pink / Magenta Tint
        ctx.fillStyle = `rgba(255, 105, 180, ${Math.abs(editState.tint) / 160})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (editState.tint < 0) {
        // Green / Emerald Tint
        ctx.fillStyle = `rgba(80, 200, 120, ${Math.abs(editState.tint) / 160})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.restore();
    }

    // Fairy Glow / Bloom Effect
    if (editState.fairyGlow > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = editState.fairyGlow / 120;
      ctx.filter = `blur(${Math.max(10, canvas.width / 40)}px) brightness(130%)`;
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }

    // Film Grain Effect
    if (editState.grain > 0) {
      ctx.save();
      const grainCanvas = document.createElement('canvas');
      grainCanvas.width = 120;
      grainCanvas.height = 120;
      const gCtx = grainCanvas.getContext('2d');
      if (gCtx) {
        const imgData = gCtx.createImageData(120, 120);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const val = Math.floor(Math.random() * 255);
          imgData.data[i] = val;
          imgData.data[i + 1] = val;
          imgData.data[i + 2] = val;
          imgData.data[i + 3] = editState.grain * 0.9;
        }
        gCtx.putImageData(imgData, 0, 0);
        ctx.globalCompositeOperation = 'overlay';
        const pattern = ctx.createPattern(grainCanvas, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      ctx.restore();
    }

    // Vignette Effect
    if (editState.vignette > 0) {
      ctx.save();
      const radius = Math.max(canvas.width, canvas.height) * 0.75;
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        radius * 0.4,
        canvas.width / 2,
        canvas.height / 2,
        radius
      );
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, `rgba(18, 10, 15, ${editState.vignette / 100})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // Whimsical Overlays
    if (editState.overlay === 'fairy-dust') {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      // Draw sparkling fairy dust stars
      const starCount = 35;
      for (let i = 0; i < starCount; i++) {
        const sx = ((i * 137.5) % canvas.width);
        const sy = ((i * 243.7) % canvas.height);
        const size = (i % 5) + 3;
        const alpha = 0.4 + (i % 4) * 0.15;

        ctx.fillStyle = `rgba(255, 248, 220, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point sparkle cross
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx - size * 3, sy);
        ctx.lineTo(sx + size * 3, sy);
        ctx.moveTo(sx, sy - size * 3);
        ctx.lineTo(sx, sy + size * 3);
        ctx.stroke();
      }
      ctx.restore();
    } else if (editState.overlay === 'light-leak') {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const grad = ctx.createLinearGradient(0, 0, canvas.width * 0.5, canvas.height * 0.5);
      grad.addColorStop(0, 'rgba(255, 140, 100, 0.4)');
      grad.addColorStop(0.5, 'rgba(255, 220, 150, 0.25)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else if (editState.overlay === 'vintage-mist') {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height * 0.4);
      grad.addColorStop(0, 'rgba(240, 245, 250, 0.45)');
      grad.addColorStop(1, 'rgba(240, 245, 250, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  }, [editState, imageLoaded, showOriginal]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  if (!isOpen || !photo) return null;

  const handleSaveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const updatedPhoto: PhotoItem = {
      ...photo,
      url: editedDataUrl,
      highResUrl: editedDataUrl,
      story: editState.presetApplied
        ? `${photo.story} (Remixed with ${editState.presetApplied} preset)`
        : photo.story,
    };

    onSavePhoto(updatedPhoto);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setStatusNotification({ type: 'success', message: 'Photo edits saved to your gallery!' });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `faerielens-${photo.id}-remix.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
    confetti({ particleCount: 35, spread: 50 });
  };

  const handleCommitToGitHub = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!githubConfig.personalAccessToken) {
      setStatusNotification({
        type: 'error',
        message: 'Please add a GitHub Personal Access Token in the GitHub Settings to commit changes.',
      });
      return;
    }

    setIsCommitting(true);
    setStatusNotification(null);

    try {
      const editedBase64 = canvas.toDataURL('image/jpeg', 0.92);
      const targetPath = photo.githubPath || `photos/${photo.category}/${photo.id}-edit.jpg`;

      const result = await commitImageToGitHub(
        githubConfig,
        targetPath,
        editedBase64,
        commitMessage || `Remix photo: ${photo.title} (${editState.presetApplied || 'custom fairy grade'})`
      );

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setStatusNotification({ type: 'success', message: result.message });
      setShowCommitDialog(false);

      // Also update in memory
      onSavePhoto({
        ...photo,
        url: result.url,
        highResUrl: result.url,
        githubPath: targetPath,
      });
    } catch (err: any) {
      setStatusNotification({ type: 'error', message: err.message || 'GitHub commit failed.' });
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div
      id="image-editor-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div
        id="image-editor-container"
        className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh] border"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        {/* Left/Top: Canvas Preview Area */}
        <div className="flex-1 bg-neutral-950 flex flex-col items-center justify-center p-4 sm:p-8 relative min-h-[350px] lg:min-h-[550px] overflow-hidden">
          {/* Canvas Wrapper */}
          <div className="relative max-w-full max-h-[70vh] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl transition-all duration-200"
            />
          </div>

          {/* Canvas Overlay Controls */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <button
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onTouchStart={() => setShowOriginal(true)}
              onTouchEnd={() => setShowOriginal(false)}
              className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-black/60 text-white flex items-center gap-1.5 hover:bg-black/80 transition-all select-none"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showOriginal ? 'Showing Original' : 'Hold for Original'}</span>
            </button>
          </div>

          {/* Canvas Bottom Tooling */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/80 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditState((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                className="p-2 rounded-full bg-black/50 hover:bg-black/80 transition-all"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditState((prev) => ({ ...prev, flipH: !prev.flipH }))}
                className="p-2 rounded-full bg-black/50 hover:bg-black/80 transition-all"
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditState(INITIAL_EDIT_STATE)}
                className="p-2 rounded-full bg-black/50 hover:bg-black/80 transition-all text-rose-300"
                title="Reset All Adjustments"
              >
                <Undo2 className="w-4 h-4" />
              </button>
            </div>

            <span className="font-serif italic tracking-wide text-[11px] opacity-75 hidden sm:inline">
              FaerieLens In-Browser RAW Grading Studio
            </span>
          </div>
        </div>

        {/* Right/Sidebar: Adjustment Controls */}
        <div className="w-full lg:w-96 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh] lg:max-h-[92vh]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" style={{ color: theme.accent }} />
                <div>
                  <h3 className="font-serif text-lg font-medium" style={{ color: theme.textPrimary }}>
                    Studio Photo Editor
                  </h3>
                  <p className="text-[11px] truncate max-w-[200px]" style={{ color: theme.textMuted }}>
                    {photo.title}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
                style={{ color: theme.textSecondary }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Alert */}
            {statusNotification && (
              <div
                className={`p-3 rounded-xl text-xs mb-4 flex items-center gap-2 ${
                  statusNotification.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{statusNotification.message}</span>
              </div>
            )}

            {/* Tab Selectors */}
            <div
              className="flex items-center gap-1 p-1 rounded-xl mb-5 border"
              style={{ backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }}
            >
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'presets' ? 'bg-white shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ color: activeTab === 'presets' ? theme.accent : theme.textSecondary }}
              >
                Presets
              </button>
              <button
                onClick={() => setActiveTab('adjust')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'adjust' ? 'bg-white shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ color: activeTab === 'adjust' ? theme.accent : theme.textSecondary }}
              >
                Tones
              </button>
              <button
                onClick={() => setActiveTab('overlays')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'overlays' ? 'bg-white shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ color: activeTab === 'overlays' ? theme.accent : theme.textSecondary }}
              >
                Overlays
              </button>
              <button
                onClick={() => setActiveTab('crop')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'crop' ? 'bg-white shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ color: activeTab === 'crop' ? theme.accent : theme.textSecondary }}
              >
                Crop
              </button>
            </div>

            {/* TAB 1: FAIRY PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-2.5">
                <p className="text-xs font-serif italic mb-3 opacity-80" style={{ color: theme.textSecondary }}>
                  Select a crafted fairytale mood grade:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {PRESETS.map((p) => {
                    const Icon = p.icon;
                    const isSelected = editState.presetApplied === p.name;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setEditState((prev) => ({
                            ...prev,
                            ...p.state,
                            presetApplied: p.name,
                          }));
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected ? 'shadow-sm scale-101 font-semibold' : 'hover:opacity-85'
                        }`}
                        style={{
                          backgroundColor: isSelected ? theme.accentSoft : theme.cardBg,
                          borderColor: isSelected ? theme.accent : theme.cardBorder,
                          color: isSelected ? theme.accent : theme.textPrimary,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: isSelected ? theme.accent : theme.accentSoft, color: isSelected ? '#FFF' : theme.accent }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-medium">{p.name}</div>
                            <div className="text-[10px] opacity-65">{p.id.replace('-', ' ')}</div>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4" style={{ color: theme.accent }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: ADJUSTMENT SLIDERS */}
            {activeTab === 'adjust' && (
              <div className="space-y-4 text-xs">
                {/* Exposure / Brightness */}
                <div>
                  <div className="flex justify-between mb-1" style={{ color: theme.textSecondary }}>
                    <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5" /> Brightness</span>
                    <span>{editState.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={editState.brightness}
                    onChange={(e) => setEditState((prev) => ({ ...prev, brightness: Number(e.target.value) }))}
                    className="w-full accent-rose-400"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex justify-between mb-1" style={{ color: theme.textSecondary }}>
                    <span className="flex items-center gap-1.5"><Contrast className="w-3.5 h-3.5" /> Contrast</span>
                    <span>{editState.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="150"
                    value={editState.contrast}
                    onChange={(e) => setEditState((prev) => ({ ...prev, contrast: Number(e.target.value) }))}
                    className="w-full accent-rose-400"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between mb-1" style={{ color: theme.textSecondary }}>
                    <span className="flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5" /> Saturation</span>
                    <span>{editState.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={editState.saturation}
                    onChange={(e) => setEditState((prev) => ({ ...prev, saturation: Number(e.target.value) }))}
                    className="w-full accent-rose-400"
                  />
                </div>

                {/* Fairy Glow / Bloom */}
                <div>
                  <div className="flex justify-between mb-1" style={{ color: theme.accent }}>
                    <span className="flex items-center gap-1.5 font-semibold"><Sparkles className="w-3.5 h-3.5" /> Fairy Glow (Bloom)</span>
                    <span>{editState.fairyGlow}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={editState.fairyGlow}
                    onChange={(e) => setEditState((prev) => ({ ...prev, fairyGlow: Number(e.target.value) }))}
                    className="w-full accent-rose-400"
                  />
                </div>

                {/* Warmth / Color Temp */}
                <div>
                  <div className="flex justify-between mb-1" style={{ color: theme.textSecondary }}>
                    <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" /> Warmth (Temp)</span>
                    <span>{editState.warmth > 0 ? `+${editState.warmth}` : editState.warmth}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={editState.warmth}
                    onChange={(e) => setEditState((prev) => ({ ...prev, warmth: Number(e.target.value) }))}
                    className="w-full accent-rose-400"
                  />
                </div>

                {/* Film Grain */}
                <div>
                  <div className="flex justify-between mb-1" style={{ color: theme.textSecondary }}>
                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> 35mm Film Grain</span>
                    <span>{editState.grain}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="70"
                    value={editState.grain}
                    onChange={(e) => setEditState((prev) => ({ ...prev, grain: Number(e.target.value) }))}
                    className="w-full accent-rose-400"
                  />
                </div>

                {/* Vignette */}
                <div>
                  <div className="flex justify-between mb-1" style={{ color: theme.textSecondary }}>
                    <span className="flex items-center gap-1.5">Vignette Soft Shadow</span>
                    <span>{editState.vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={editState.vignette}
                    onChange={(e) => setEditState((prev) => ({ ...prev, vignette: Number(e.target.value) }))}
                    className="w-full accent-rose-400"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: OVERLAYS */}
            {activeTab === 'overlays' && (
              <div className="space-y-3">
                <p className="text-xs font-serif italic opacity-80" style={{ color: theme.textSecondary }}>
                  Whimsical particle overlays and atmospheric textures:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'none', label: 'No Overlay', icon: X },
                    { id: 'fairy-dust', label: 'Fairy Dust Sparkles', icon: Sparkles },
                    { id: 'light-leak', label: 'Prism Light Leak', icon: Flame },
                    { id: 'vintage-mist', label: 'Morning Mountain Mist', icon: CloudFog },
                  ].map((item) => {
                    const isSelected = editState.overlay === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setEditState((prev) => ({ ...prev, overlay: item.id as any }))}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                          isSelected ? 'shadow-sm font-semibold' : 'hover:opacity-85'
                        }`}
                        style={{
                          backgroundColor: isSelected ? theme.accentSoft : theme.cardBg,
                          borderColor: isSelected ? theme.accent : theme.cardBorder,
                          color: isSelected ? theme.accent : theme.textPrimary,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[11px] leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: CROP & ASPECT */}
            {activeTab === 'crop' && (
              <div className="space-y-3">
                <p className="text-xs font-serif italic opacity-80" style={{ color: theme.textSecondary }}>
                  Select photographic aspect ratio for gallery and social feeds:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'original', label: 'Original Ratio' },
                    { id: '1:1', label: '1:1 Square (Instagram)' },
                    { id: '4:5', label: '4:5 Fine Art Portrait' },
                    { id: '3:2', label: '3:2 Classic 35mm' },
                    { id: '16:9', label: '16:9 Cinematic' },
                  ].map((aspect) => (
                    <button
                      key={aspect.id}
                      onClick={() => setEditState((prev) => ({ ...prev, cropAspect: aspect.id as any }))}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                        editState.cropAspect === aspect.id ? 'font-semibold shadow-xs' : 'hover:opacity-85'
                      }`}
                      style={{
                        backgroundColor: editState.cropAspect === aspect.id ? theme.accentSoft : theme.cardBg,
                        borderColor: editState.cropAspect === aspect.id ? theme.accent : theme.cardBorder,
                        color: editState.cropAspect === aspect.id ? theme.accent : theme.textPrimary,
                      }}
                    >
                      {aspect.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-5 border-t space-y-2 mt-4" style={{ borderColor: theme.cardBorder }}>
            {/* Primary Save to Gallery Button */}
            <button
              id="editor-save-gallery-btn"
              onClick={handleSaveToGallery}
              className="w-full py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold text-white shadow-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-101"
              style={{ backgroundColor: theme.accent }}
            >
              <Save className="w-4 h-4" />
              <span>Save Edits to Gallery</span>
            </button>

            {/* Secondary Buttons: Download & GitHub Commit */}
            <div className="flex gap-2">
              <button
                id="editor-download-btn"
                onClick={handleDownload}
                className="flex-1 py-2 rounded-full text-xs font-medium border flex items-center justify-center gap-1.5 transition-all hover:opacity-80"
                style={{ borderColor: theme.cardBorder, color: theme.textPrimary, backgroundColor: theme.cardBg }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JPG</span>
              </button>

              <button
                id="editor-commit-btn"
                onClick={() => setShowCommitDialog(!showCommitDialog)}
                className="flex-1 py-2 rounded-full text-xs font-medium border flex items-center justify-center gap-1.5 transition-all hover:opacity-80"
                style={{ borderColor: theme.accentBorder, color: theme.accent, backgroundColor: theme.accentSoft }}
              >
                <Github className="w-3.5 h-3.5" />
                <span>Commit to GitHub</span>
              </button>
            </div>

            {/* Commit Dialog Accordion */}
            {showCommitDialog && (
              <div
                className="p-3 rounded-2xl border text-xs space-y-2.5 mt-2 animate-fadeIn"
                style={{ backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }}
              >
                <div className="font-semibold flex items-center gap-1" style={{ color: theme.accent }}>
                  <Github className="w-3.5 h-3.5" />
                  <span>Commit Directly to {githubConfig.owner || 'Repository'}/{githubConfig.repo || 'gallery'}</span>
                </div>
                <input
                  type="text"
                  placeholder="Commit message (e.g. Grade photo with Fairy Dust preset)"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border bg-white outline-none"
                  style={{ borderColor: theme.cardBorder }}
                />
                <button
                  disabled={isCommitting}
                  onClick={handleCommitToGitHub}
                  className="w-full py-2 rounded-lg text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                  style={{ backgroundColor: theme.accent }}
                >
                  {isCommitting ? (
                    <span>Pushing Git Object...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Push Commit to GitHub</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
