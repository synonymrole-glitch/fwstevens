import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Sparkles,
  QrCode,
  ExternalLink,
  Feather,
} from 'lucide-react';
import { PhotoItem, ThemeColors } from '../types';
import confetti from 'canvas-confetti';

interface SocialShareModalProps {
  photo: PhotoItem | null;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeColors;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  photo,
  isOpen,
  onClose,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen || !photo) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://faerielens.dev';
  const shareTitle = `FaerieLens Chronicle: ${photo.title} — Fine Art Photography`;
  const shareText = `Explore "${photo.title}", a fine art ethereal photography capture from the FaerieLens studio chronicle.`;
  const photoUrl = photo.highResUrl || photo.url;

  // Social Links
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    currentUrl
  )}&media=${encodeURIComponent(photoUrl)}&description=${encodeURIComponent(
    `${shareTitle} - ${photo.story}`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(currentUrl)}&hashtags=FaerieLens,FineArtPhotography,Whimsical`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;

  const threadsUrl = `https://threads.net/intent/post?text=${encodeURIComponent(
    `${shareText} ${currentUrl}`
  )}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText} ${currentUrl}`
  )}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    currentUrl
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=FAF6F5&color=38282B`;

  return (
    <div
      id="social-share-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn select-none"
    >
      <div
        id="social-share-container"
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border p-6 space-y-5 animate-slideUp"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
            >
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium" style={{ color: theme.textPrimary }}>
                Share Photo Chronicle
              </h3>
              <p className="text-[11px] truncate max-w-[220px]" style={{ color: theme.textMuted }}>
                {photo.title}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/5" style={{ color: theme.textSecondary }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail Preview Card */}
        <div
          className="p-3 rounded-2xl border flex items-center gap-3"
          style={{ backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-serif font-semibold truncate" style={{ color: theme.textPrimary }}>
              {photo.title}
            </div>
            <p className="text-[11px] opacity-75 line-clamp-1 italic font-serif" style={{ color: theme.textSecondary }}>
              "{photo.story}"
            </p>
            <div className="text-[10px] opacity-60 font-mono mt-0.5">{photo.exif.location.split(',')[0]}</div>
          </div>
        </div>

        {/* Social Buttons Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          {/* Pinterest */}
          <a
            href={pinterestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all hover:scale-102 hover:shadow-xs bg-[#E60023]/5 border-[#E60023]/20 text-[#E60023]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
            <span className="font-semibold text-[11px]">Pinterest</span>
          </a>

          {/* Twitter / X */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all hover:scale-102 hover:shadow-xs bg-neutral-100 border-neutral-300 text-neutral-900"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="font-semibold text-[11px]">X / Twitter</span>
          </a>

          {/* Threads */}
          <a
            href={threadsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all hover:scale-102 hover:shadow-xs bg-neutral-900/5 border-neutral-300 text-neutral-800"
          >
            <Feather className="w-5 h-5" />
            <span className="font-semibold text-[11px]">Threads</span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all hover:scale-102 hover:shadow-xs bg-[#25D366]/5 border-[#25D366]/20 text-[#25D366]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span className="font-semibold text-[11px]">WhatsApp</span>
          </a>

          {/* Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all hover:scale-102 hover:shadow-xs bg-[#1877F2]/5 border-[#1877F2]/20 text-[#1877F2]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="font-semibold text-[11px]">Facebook</span>
          </a>

          {/* QR Code toggle */}
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all hover:scale-102 hover:shadow-xs"
            style={{
              backgroundColor: showQR ? theme.accentSoft : theme.cardBg,
              borderColor: showQR ? theme.accent : theme.cardBorder,
              color: showQR ? theme.accent : theme.textPrimary,
            }}
          >
            <QrCode className="w-5 h-5" />
            <span className="font-semibold text-[11px]">QR Scan</span>
          </button>
        </div>

        {/* QR Code Viewer Section */}
        {showQR && (
          <div className="p-4 rounded-2xl border text-center space-y-2 animate-fadeIn" style={{ backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }}>
            <img src={qrApiUrl} alt="QR Code" className="w-36 h-36 mx-auto rounded-xl shadow-xs border p-1 bg-white" />
            <p className="text-[11px] opacity-75" style={{ color: theme.textSecondary }}>
              Scan with your mobile camera for seamless phone viewing
            </p>
          </div>
        )}

        {/* Copy Link Bar */}
        <div className="pt-2">
          <div
            className="p-2 rounded-xl border flex items-center justify-between gap-2"
            style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}
          >
            <span className="text-xs truncate font-mono opacity-70 px-2" style={{ color: theme.textSecondary }}>
              {currentUrl}
            </span>

            <button
              id="copy-fairy-link-btn"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-transform active:scale-95"
              style={{ backgroundColor: theme.accent }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
