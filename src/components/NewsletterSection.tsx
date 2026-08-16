import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Check,
  Feather,
  Heart,
  Send,
  Lock,
  Gift,
} from 'lucide-react';
import { ThemeColors, NewsletterSubscriber } from '../types';
import confetti from 'canvas-confetti';

interface NewsletterSectionProps {
  theme: ThemeColors;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Print Drops',
    'Fairy Presets',
  ]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(1482);

  const interestOptions = [
    { id: 'Print Drops', label: 'Seasonal Fine Art Print Drops' },
    { id: 'Secret Locations', label: 'Secret Woodland & Castle Coordinates' },
    { id: 'Fairy Presets', label: 'Fairy Dust Color Grading Presets' },
    { id: 'Avian Logs', label: 'Wild Swan & Bird Sanctuary Fieldwork' },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const newSub: NewsletterSubscriber = {
      email,
      firstName,
      interests: selectedInterests,
      subscribedAt: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('faerielens_subscribers') || '[]');
      localStorage.setItem('faerielens_subscribers', JSON.stringify([newSub, ...existing]));
    } catch {
      // Ignore
    }

    setIsSubscribed(true);
    setSubscriberCount((prev) => prev + 1);
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <section
      id="newsletter-dispatch-section"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16"
    >
      <div
        className="rounded-3xl border p-6 sm:p-12 relative overflow-hidden shadow-xl text-center"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        {/* Soft Background Fairy Halo */}
        <div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ backgroundColor: theme.accent }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ backgroundColor: theme.glowColor }}
        />

        {/* Header Badges */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif italic mb-4 shadow-xs"
          style={{
            backgroundColor: theme.badgeBg,
            color: theme.badgeText,
            border: `1px solid ${theme.accentBorder}`,
          }}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>The Faerie Dispatch · Studio Letters</span>
        </div>

        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight mb-3"
          style={{ color: theme.textPrimary }}
        >
          Letters from the <span className="italic font-normal">Enchanted Glade</span>
        </h2>

        <p
          className="text-sm sm:text-base font-sans font-light max-w-xl mx-auto mb-8 opacity-80 leading-relaxed"
          style={{ color: theme.textSecondary }}
        >
          Receive quarterly fine art print releases, private booking dates for seasonal fairy tale sessions, and downloadable RAW color grades.
        </p>

        {isSubscribed ? (
          <div
            className="p-6 rounded-2xl border max-w-md mx-auto space-y-3 animate-fadeIn"
            style={{ backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }}
          >
            <div
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: theme.accent }}
            >
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <h3 className="font-serif text-xl font-medium" style={{ color: theme.textPrimary }}>
              Welcome to the Studio Circle!
            </h3>

            <p className="text-xs opacity-80 leading-relaxed" style={{ color: theme.textSecondary }}>
              A parchment confirmation and complimentary fairy color preset pack have been dispatched to <strong>{email}</strong>.
            </p>

            <button
              onClick={() => {
                setIsSubscribed(false);
                setEmail('');
              }}
              className="text-xs underline font-medium opacity-75 hover:opacity-100 mt-2 inline-block"
              style={{ color: theme.accent }}
            >
              Subscribe another email address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-lg mx-auto space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aurelia"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border outline-none bg-white/90"
                  style={{ borderColor: theme.cardBorder }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                  Email Address*
                </label>
                <input
                  type="email"
                  required
                  placeholder="aurelia@fairyrealm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border outline-none bg-white/90"
                  style={{ borderColor: theme.cardBorder }}
                />
              </div>
            </div>

            {/* Interest Pills */}
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                What would you like to receive?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((opt) => {
                  const isSelected = selectedInterests.includes(opt.id);
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                        isSelected ? 'font-semibold shadow-2xs' : 'opacity-70 hover:opacity-90'
                      }`}
                      style={{
                        backgroundColor: isSelected ? theme.accentSoft : 'transparent',
                        borderColor: isSelected ? theme.accent : theme.cardBorder,
                        color: isSelected ? theme.accent : theme.textPrimary,
                      }}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="newsletter-subscribe-btn"
              type="submit"
              className="w-full py-3 rounded-full text-xs uppercase tracking-widest font-semibold text-white shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98"
              style={{ backgroundColor: theme.accent }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Join the Dispatch Circle</span>
            </button>

            {/* Privacy & Member Count */}
            <div className="flex items-center justify-between text-[11px] opacity-60 pt-1" style={{ color: theme.textSecondary }}>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                No spam. Unsubscribe in 1-click anytime.
              </span>
              <span>{subscriberCount.toLocaleString()} fairy art patrons</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
