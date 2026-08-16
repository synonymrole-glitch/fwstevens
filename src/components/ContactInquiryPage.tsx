import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  MapPin,
  Heart,
  Send,
  Camera,
  Check,
  Feather,
  Clock,
  DollarSign,
  FileText,
  Download,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { InquiryFormData, ThemeColors } from '../types';
import confetti from 'canvas-confetti';

interface ContactInquiryPageProps {
  theme: ThemeColors;
}

const PACKAGES = [
  {
    id: 'fairy-concept',
    title: 'Fairy Tale & Mythic Portraiture',
    price: '$1,450',
    desc: '3-hour enchanted woodland session with custom flower crowns, styling direction, prism lighting, and 35 finished fine art masters.',
    popular: true,
  },
  {
    id: 'bridal-elopement',
    title: 'Ethereal Bridal & Elopement',
    price: '$3,200',
    desc: 'Full-day golden hour documentation, vintage 35mm film rolls, high-res digital gallery, leather-bound heirloom album.',
  },
  {
    id: 'editorial-fashion',
    title: 'Couture Editorial & Commercial',
    price: '$2,800',
    desc: 'Commercial licensing, studio & location set design, full styling team coordination, and RAW color grading.',
  },
  {
    id: 'fine-art-prints',
    title: 'Archival Fine Art Prints & Licensing',
    price: 'From $250',
    desc: 'Museum-grade Hahnemühle German Etching cotton rag prints, signed limited edition certificates of authenticity.',
  },
  {
    id: 'avian-nature',
    title: 'Avian Sanctuary & Wildlife Fieldwork',
    price: '$1,800',
    desc: 'Documentary coverage of bird sanctuaries, private nature reserves, and conservation chronicles.',
  },
];

export const ContactInquiryPage: React.FC<ContactInquiryPageProps> = ({ theme }) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    socialHandle: '',
    inquiryType: 'fairy-concept',
    preferredDate: '',
    seasonPreference: 'spring-blossom',
    locationType: 'enchanted-woodland',
    specificLocation: '',
    visionNotes: '',
    budgetRange: '1k-2.5k',
    howHeard: 'Instagram / Portfolio',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<InquiryFormData | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    setSubmittedData(formData);
    setIsSubmitted(true);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });

    // Store in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('faerielens_inquiries') || '[]');
      localStorage.setItem('faerielens_inquiries', JSON.stringify([formData, ...existing]));
    } catch {
      // Ignore
    }
  };

  const handleDownloadReceipt = () => {
    if (!submittedData) return;
    const content = `🌸 FAERIELENS STUDIO — COMMISSION INQUIRY RECEIPT
Date of Submission: ${new Date().toLocaleDateString()}
Client Name: ${submittedData.fullName}
Email: ${submittedData.email}
Phone: ${submittedData.phone || 'N/A'}
Social Handle: ${submittedData.socialHandle || 'N/A'}

COMMISSION DETAILS:
Package / Inquiry Type: ${submittedData.inquiryType}
Preferred Season: ${submittedData.seasonPreference}
Target Date: ${submittedData.preferredDate || 'Flexible'}
Location Vision: ${submittedData.locationType} (${submittedData.specificLocation || 'To be curated'})
Budget Range: ${submittedData.budgetRange}

ARTISTIC VISION NOTES:
"${submittedData.visionNotes || 'Standard studio consultation'}"

Our studio will review your moodboard and respond within 24 to 48 hours with a customized itinerary and booking contract.
Thank you for inviting enchantment into your story.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `faerielens-inquiry-${submittedData.fullName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
  };

  const selectedPackage = PACKAGES.find((p) => p.id === formData.inquiryType) || PACKAGES[0];

  return (
    <div id="contact-inquiry-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif italic mb-3 shadow-xs"
          style={{
            backgroundColor: theme.badgeBg,
            color: theme.badgeText,
            border: `1px solid ${theme.accentBorder}`,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke Fairytale Commissions · 2026 / 2027 Calendar</span>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-serif font-light tracking-tight mb-4"
          style={{ color: theme.textPrimary }}
        >
          Begin Your <span className="italic font-normal">Storybook Chronicle</span>
        </h1>

        <p
          className="text-sm sm:text-base font-sans font-light opacity-80 max-w-2xl mx-auto leading-relaxed"
          style={{ color: theme.textSecondary }}
        >
          Whether you desire a private dawn session among mist-veiled redwoods, romantic couture elopement memories, or limited fine art prints, we would be honored to weave your vision into light.
        </p>
      </div>

      {isSubmitted && submittedData ? (
        /* Submission Success State */
        <div
          className="max-w-2xl mx-auto rounded-3xl border p-8 sm:p-12 text-center space-y-6 shadow-xl animate-fadeIn"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-md"
            style={{ backgroundColor: theme.accent }}
          >
            <Check className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.accent }}>
              Inquiry Dispatched to Studio
            </span>
            <h2 className="text-3xl font-serif font-medium mt-1 mb-2" style={{ color: theme.textPrimary }}>
              Thank You, {submittedData.fullName}
            </h2>
            <p className="text-sm opacity-80 max-w-md mx-auto leading-relaxed" style={{ color: theme.textSecondary }}>
              Your fairytale inquiry has been received into our studio ledger. We will review your vision notes and respond via <strong>{submittedData.email}</strong> within 24–48 hours.
            </p>
          </div>

          {/* Inquiry Summary Box */}
          <div
            className="p-5 rounded-2xl border text-left text-xs space-y-2.5"
            style={{ backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }}
          >
            <div className="flex justify-between font-semibold" style={{ color: theme.textPrimary }}>
              <span>Selected Package:</span>
              <span style={{ color: theme.accent }}>{selectedPackage.title}</span>
            </div>
            <div className="flex justify-between" style={{ color: theme.textSecondary }}>
              <span>Season & Setting:</span>
              <span>{submittedData.seasonPreference} · {submittedData.locationType.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between" style={{ color: theme.textSecondary }}>
              <span>Estimated Budget:</span>
              <span>{submittedData.budgetRange}</span>
            </div>
            {submittedData.visionNotes && (
              <div className="pt-2 border-t border-black/10">
                <span className="font-semibold block mb-1" style={{ color: theme.textPrimary }}>Vision Notes:</span>
                <p className="italic opacity-80 font-serif">"{submittedData.visionNotes}"</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={handleDownloadReceipt}
              className="px-5 py-2.5 rounded-full text-xs font-semibold border flex items-center gap-2 hover:scale-102 transition-transform"
              style={{ borderColor: theme.cardBorder, color: theme.textPrimary, backgroundColor: theme.cardBg }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Inquiry Parchment</span>
            </button>

            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white shadow-xs hover:scale-102 transition-transform"
              style={{ backgroundColor: theme.accent }}
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        /* Main Inquiry Form & Sidebar Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Robust Form */}
          <div
            className="lg:col-span-2 rounded-3xl border p-6 sm:p-10 shadow-lg"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Step 1: Package Selector */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5" style={{ color: theme.accent }}>
                  <Camera className="w-3.5 h-3.5" />
                  <span>1. Select Photographic Commission Type</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PACKAGES.map((pkg) => {
                    const isSelected = formData.inquiryType === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setFormData({ ...formData, inquiryType: pkg.id as any })}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                          isSelected ? 'shadow-sm ring-2 scale-101' : 'hover:opacity-90'
                        }`}
                        style={{
                          backgroundColor: isSelected ? theme.accentSoft : theme.cardBg,
                          borderColor: isSelected ? theme.accent : theme.cardBorder,
                          ringColor: theme.accent,
                        }}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-serif text-sm font-medium" style={{ color: isSelected ? theme.accent : theme.textPrimary }}>
                            {pkg.title}
                          </h4>
                          <span className="font-mono text-xs font-semibold ml-2" style={{ color: theme.textSecondary }}>
                            {pkg.price}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-75 leading-relaxed" style={{ color: theme.textSecondary }}>
                          {pkg.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Client Contact Details */}
              <div className="pt-4 border-t" style={{ borderColor: theme.cardBorder }}>
                <label className="block text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5" style={{ color: theme.accent }}>
                  <Heart className="w-3.5 h-3.5" />
                  <span>2. Client Contact Information</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Full Name*
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sylvia Montgomery"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none bg-white"
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
                      placeholder="sylvia@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Instagram / Portfolio Handle (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="@sylvia.fairytale"
                      value={formData.socialHandle}
                      onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Logistics, Timing & Setting */}
              <div className="pt-4 border-t" style={{ borderColor: theme.cardBorder }}>
                <label className="block text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5" style={{ color: theme.accent }}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>3. Season, Dates & Dream Atmosphere</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Preferred Season
                    </label>
                    <select
                      value={formData.seasonPreference}
                      onChange={(e) => setFormData({ ...formData, seasonPreference: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      <option value="spring-blossom">🌸 Spring Blossom & Wildflowers (April - May)</option>
                      <option value="summer-solstice">☀️ Summer Solstice & Golden Dust (June - August)</option>
                      <option value="autumn-mist">🍂 Autumn Mist & Amber Pines (Sept - Nov)</option>
                      <option value="winter-frost">❄️ Winter Frost & Swan Lakes (Dec - March)</option>
                      <option value="flexible">✨ Flexible / Dream Timing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Setting / Natural Environment
                    </label>
                    <select
                      value={formData.locationType}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      <option value="enchanted-woodland">🌲 Ancient Temperate Rainforest & Moss</option>
                      <option value="coastal-cliffs">🌊 Misty Ocean Cliffs & Wild Coast</option>
                      <option value="historic-chateau">🏰 Historic Chateau, Castle & Ruins</option>
                      <option value="studio-sanctuary">🌿 Private Botanical Studio Sanctuary</option>
                      <option value="destination">✈️ International Destination Travel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Specific Destination (If chosen)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Black Forest, Germany or Hoh Rainforest"
                      value={formData.specificLocation}
                      onChange={(e) => setFormData({ ...formData, specificLocation: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Budget Investment Range
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      <option value="under-1k">Under $1,000</option>
                      <option value="1k-2.5k">$1,000 – $2,500</option>
                      <option value="2.5k-5k">$2,500 – $5,000</option>
                      <option value="5k-plus">$5,000+ (High Couture & Destination)</option>
                      <option value="undecided">Undecided / Flexible</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 4: Vision & Lore */}
              <div className="pt-4 border-t" style={{ borderColor: theme.cardBorder }}>
                <label className="block text-xs uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5" style={{ color: theme.accent }}>
                  <Feather className="w-3.5 h-3.5" />
                  <span>4. Your Vision, Wardrobe & Inspiration Notes</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details regarding wardrobe (e.g. vintage lace, floral headpieces), Pinterest moodboard links, fairy tale themes, or questions for the artist..."
                  value={formData.visionNotes}
                  onChange={(e) => setFormData({ ...formData, visionNotes: e.target.value })}
                  className="w-full p-3 text-xs rounded-2xl border outline-none bg-white"
                  style={{ borderColor: theme.cardBorder }}
                />
              </div>

              {/* Submit Button */}
              <button
                id="contact-submit-inquiry-btn"
                type="submit"
                className="w-full py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold text-white shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98"
                style={{ backgroundColor: theme.accent }}
              >
                <Send className="w-4 h-4" />
                <span>Send Booking Inquiry to Studio</span>
              </button>
            </form>
          </div>

          {/* Right Col: Studio Philosophy & Assurance Card */}
          <div className="space-y-5">
            {/* Package Summary Box */}
            <div
              className="rounded-3xl border p-6 shadow-sm space-y-4"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
            >
              <h3 className="font-serif text-lg font-medium" style={{ color: theme.textPrimary }}>
                Included in Every Session
              </h3>

              <ul className="space-y-2.5 text-xs" style={{ color: theme.textSecondary }}>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>High-resolution online gallery with full personal printing rights</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Lossless RAW color grading with bespoke fairy tale tone presets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Styling consultation, botanical crown sourcing & location scouting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Private ambient Bandcamp soundscape playlist curated for your gallery</span>
                </li>
              </ul>
            </div>

            {/* Studio Artist Note */}
            <div
              className="rounded-3xl border p-6 space-y-3"
              style={{ backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }}
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Lead Artist"
                  className="w-12 h-12 rounded-full object-cover shadow-xs border-2 border-white"
                />
                <div>
                  <div className="font-serif text-sm font-semibold" style={{ color: theme.textPrimary }}>
                    Aurelia Sylvaine
                  </div>
                  <div className="text-[11px] opacity-75 font-sans" style={{ color: theme.textSecondary }}>
                    Principal Fine Art & Avian Photographer
                  </div>
                </div>
              </div>

              <p className="text-xs font-serif italic leading-relaxed opacity-85" style={{ color: theme.textSecondary }}>
                "We photograph not just the light as it appears, but as it felt when you were standing in the quiet morning glade."
              </p>

              <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[11px]" style={{ color: theme.textMuted }}>
                <span>Studio Location:</span>
                <span className="font-medium" style={{ color: theme.textPrimary }}>Baden-Württemberg & Worldwide</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
