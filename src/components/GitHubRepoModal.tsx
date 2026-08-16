import React, { useState } from 'react';
import {
  X,
  Github,
  RefreshCw,
  Upload,
  Download,
  FolderGit2,
  Key,
  ExternalLink,
  Check,
  AlertCircle,
  Copy,
  Sparkles,
  FileCode,
  Info,
  Plus,
} from 'lucide-react';
import { GitHubRepoConfig, PhotoItem, ThemeColors } from '../types';
import { CURATED_GITHUB_REPOS } from '../data/defaultData';
import { fetchGitHubRepoImages, generateGitHubPagesManifest } from '../utils/githubService';
import confetti from 'canvas-confetti';

interface GitHubRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GitHubRepoConfig;
  onUpdateConfig: (newConfig: GitHubRepoConfig) => void;
  onImportPhotos: (photos: PhotoItem[], message: string) => void;
  currentPhotos: PhotoItem[];
  theme: ThemeColors;
}

export const GitHubRepoModal: React.FC<GitHubRepoModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onImportPhotos,
  currentPhotos,
  theme,
}) => {
  const [formData, setFormData] = useState<GitHubRepoConfig>(config);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'connect' | 'upload' | 'export' | 'guide'>('connect');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // New photo upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<PhotoItem['category']>('fairy-tale');
  const [uploadStory, setUploadStory] = useState('');
  const [uploadImageFile, setUploadImageFile] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');

  if (!isOpen) return null;

  const handleSyncRepo = async (targetConfig: GitHubRepoConfig = formData) => {
    if (!targetConfig.owner || !targetConfig.repo) {
      setErrorMessage('Please enter both the GitHub Owner (username/org) and Repository name.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await fetchGitHubRepoImages(targetConfig);
      onUpdateConfig({
        ...targetConfig,
        isConnected: true,
      });

      if (result.photos.length > 0) {
        onImportPhotos(result.photos, result.message || `Loaded ${result.photos.length} photos.`);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setSuccessMessage(result.message || `Successfully synced ${result.photos.length} photos!`);
      } else {
        setSuccessMessage(result.message || 'Connected to repository, but no image files found.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sync with GitHub repository.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCurated = (curated: (typeof CURATED_GITHUB_REPOS)[0]) => {
    const newConf: GitHubRepoConfig = {
      ...formData,
      owner: curated.owner,
      repo: curated.repo,
      branch: curated.branch,
      path: 'photos',
      repoName: curated.name,
    };
    setFormData(newConf);
    handleSyncRepo(newConf);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setUploadImageFile(loadEvt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddNewPhotoToPortfolio = () => {
    if (!uploadImageFile || !uploadTitle) {
      setErrorMessage('Please select an image and enter a title for the capture.');
      return;
    }

    const newPhoto: PhotoItem = {
      id: `local-${Date.now()}`,
      title: uploadTitle,
      subtitle: `Archived in ${formData.owner || 'Faerie'}/${formData.repo || 'Studio'}`,
      story: uploadStory || 'A delicate fairy tale chronicle added directly to the portfolio.',
      category: uploadCategory,
      url: uploadImageFile,
      highResUrl: uploadImageFile,
      githubPath: `photos/${uploadCategory}/${uploadFileName || 'new-capture.jpg'}`,
      aspectRatio: 'portrait',
      exif: {
        camera: 'Fine Art Digital / Film',
        lens: '50mm Prime',
        focalLength: '50mm',
        aperture: 'f/1.4',
        shutterSpeed: '1/800s',
        iso: '100',
        dateTaken: new Date().toLocaleDateString(),
        location: 'Enchanted Sanctuary',
      },
      palette: ['#FAF6F5', '#E6CECA', '#A86C78', '#38282B'],
      tags: ['New Release', uploadCategory.replace('-', ' '), 'Fine Art'],
      likes: 12,
      featured: true,
    };

    onImportPhotos([newPhoto, ...currentPhotos], `Added "${uploadTitle}" to your portfolio!`);
    confetti({ particleCount: 60, spread: 70 });
    setSuccessMessage(`"${uploadTitle}" has been added to your live portfolio!`);

    // Reset upload form
    setUploadTitle('');
    setUploadStory('');
    setUploadImageFile(null);
    setUploadFileName('');
  };

  const manifest = generateGitHubPagesManifest(currentPhotos, formData.repo || 'faerielens-portfolio');

  const copyManifestFile = (fileName: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div
      id="github-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md animate-fadeIn"
    >
      <div
        id="github-modal-container"
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border max-h-[92vh] flex flex-col"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        {/* Header */}
        <div
          className="p-5 sm:p-6 border-b flex items-center justify-between"
          style={{ borderColor: theme.cardBorder, backgroundColor: theme.glassBg }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
            >
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-medium" style={{ color: theme.textPrimary }}>
                  GitHub Repository Studio Hub
                </h2>
                {config.isConnected && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: theme.textMuted }}>
                Host photographs on GitHub repos, commit RAW edits, and export to GitHub Pages
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5" style={{ color: theme.textSecondary }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b" style={{ borderColor: theme.cardBorder }}>
          <button
            onClick={() => setActiveSubTab('connect')}
            className={`pb-3 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'connect' ? 'border-current font-semibold' : 'border-transparent opacity-60'
            }`}
            style={{ color: activeSubTab === 'connect' ? theme.accent : theme.textPrimary }}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Connect Repository</span>
          </button>

          <button
            onClick={() => setActiveSubTab('upload')}
            className={`pb-3 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'upload' ? 'border-current font-semibold' : 'border-transparent opacity-60'
            }`}
            style={{ color: activeSubTab === 'upload' ? theme.accent : theme.textPrimary }}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload & Host Photo</span>
          </button>

          <button
            onClick={() => setActiveSubTab('export')}
            className={`pb-3 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'export' ? 'border-current font-semibold' : 'border-transparent opacity-60'
            }`}
            style={{ color: activeSubTab === 'export' ? theme.accent : theme.textPrimary }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GitHub Pages Site</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guide')}
            className={`pb-3 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'guide' ? 'border-current font-semibold' : 'border-transparent opacity-60'
            }`}
            style={{ color: activeSubTab === 'guide' ? theme.accent : theme.textPrimary }}
          >
            <Info className="w-3.5 h-3.5" />
            <span>GitHub Setup Guide</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Status Banners */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: CONNECT REPOSITORY */}
          {activeSubTab === 'connect' && (
            <div className="space-y-5">
              {/* Curated Sample Repos */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-2.5" style={{ color: theme.accent }}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Choose a Curated Public Photography Repository</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CURATED_GITHUB_REPOS.map((cur) => (
                    <button
                      key={cur.repo}
                      onClick={() => handleSelectCurated(cur)}
                      className="p-3 rounded-xl border text-left transition-all hover:scale-101 flex flex-col justify-between"
                      style={{
                        backgroundColor: theme.accentSoft,
                        borderColor: theme.accentBorder,
                      }}
                    >
                      <div>
                        <div className="font-semibold text-xs mb-1" style={{ color: theme.accent }}>
                          {cur.name}
                        </div>
                        <p className="text-[11px] opacity-75 mb-2 leading-tight" style={{ color: theme.textSecondary }}>
                          {cur.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] opacity-65 font-mono">
                        <span>{cur.owner}/{cur.repo}</span>
                        <span>⭐ {cur.stars}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Repo Form */}
              <div className="p-4 rounded-2xl border space-y-3" style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}>
                <div className="font-serif text-sm font-medium" style={{ color: theme.textPrimary }}>
                  Or Connect Your Custom GitHub Repository
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Owner (Username / Org)*
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. octocat or my-studio"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full p-2 text-xs rounded-lg border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Repository Name*
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. my-photography-portfolio"
                      value={formData.repo}
                      onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                      className="w-full p-2 text-xs rounded-lg border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Branch
                    </label>
                    <input
                      type="text"
                      placeholder="main"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full p-2 text-xs rounded-lg border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Directory Path (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="photos or leave blank for root"
                      value={formData.path}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                      className="w-full p-2 text-xs rounded-lg border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    />
                  </div>
                </div>

                {/* Personal Access Token */}
                <div className="pt-2">
                  <label className="block text-[11px] font-medium mb-1 flex items-center justify-between" style={{ color: theme.textSecondary }}>
                    <span className="flex items-center gap-1">
                      <Key className="w-3 h-3 text-amber-500" />
                      GitHub Personal Access Token (Required for Committing Edits/Private Repos)
                    </span>
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-500 hover:underline flex items-center gap-0.5"
                    >
                      Generate Token <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (stored in browser session)"
                    value={formData.personalAccessToken || ''}
                    onChange={(e) => setFormData({ ...formData, personalAccessToken: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border outline-none bg-white font-mono"
                    style={{ borderColor: theme.cardBorder }}
                  />
                </div>

                {/* Sync Action */}
                <button
                  disabled={isLoading}
                  onClick={() => handleSyncRepo(formData)}
                  className="w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold text-white shadow-xs flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: theme.accent }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Connecting to GitHub API...' : 'Synchronize Gallery with GitHub'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD & HOST PHOTO */}
          {activeSubTab === 'upload' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border space-y-3" style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}>
                <div className="font-serif text-sm font-medium" style={{ color: theme.textPrimary }}>
                  Add a New Fine Art Capture to Portfolio
                </div>

                {/* File Dropzone */}
                <div className="border-2 border-dashed rounded-2xl p-6 text-center transition-all hover:bg-neutral-50/50" style={{ borderColor: theme.accentBorder }}>
                  {uploadImageFile ? (
                    <div className="space-y-2">
                      <img src={uploadImageFile} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-sm object-cover" />
                      <p className="text-xs font-medium" style={{ color: theme.accent }}>{uploadFileName}</p>
                      <button
                        onClick={() => { setUploadImageFile(null); setUploadFileName(''); }}
                        className="text-[11px] text-rose-500 hover:underline"
                      >
                        Choose a different image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" style={{ color: theme.accent }} />
                      <p className="text-xs font-medium mb-1" style={{ color: theme.textPrimary }}>Drag & drop high-res image here or click to browse</p>
                      <p className="text-[10px] opacity-60 mb-3" style={{ color: theme.textSecondary }}>Supports JPG, PNG, WEBP, AVIF up to 25MB</p>
                      <label
                        className="px-4 py-2 rounded-full text-xs font-semibold cursor-pointer shadow-xs inline-block"
                        style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
                      >
                        Select Image File
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>

                {/* Meta Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1">Photograph Title*</label>
                    <input
                      type="text"
                      placeholder="e.g. Song of the Whispering Swan"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border outline-none"
                      style={{ borderColor: theme.cardBorder }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1">Thematic Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value as any)}
                      className="w-full p-2 text-xs rounded-lg border outline-none bg-white"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      <option value="fairy-tale">Fairy Tales</option>
                      <option value="birds-avian">Birds & Avian</option>
                      <option value="whispering-forest">Whispering Forest</option>
                      <option value="ethereal-portraits">Ethereal Portraits</option>
                      <option value="golden-light">Golden Light</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium mb-1">Poetic Story / Lore Caption</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the light, location, or mythology behind this capture..."
                    value={uploadStory}
                    onChange={(e) => setUploadStory(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border outline-none"
                    style={{ borderColor: theme.cardBorder }}
                  />
                </div>

                <button
                  onClick={handleAddNewPhotoToPortfolio}
                  className="w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold text-white shadow-xs flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: theme.accent }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Capture to Gallery</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT GITHUB PAGES SITE */}
          {activeSubTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border space-y-3" style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-serif text-sm font-medium" style={{ color: theme.textPrimary }}>
                      Ready-to-Deploy GitHub Pages Repository Bundle
                    </div>
                    <p className="text-[11px] opacity-75" style={{ color: theme.textSecondary }}>
                      Commit these files to your repository to host this portfolio entirely on GitHub Pages for free!
                    </p>
                  </div>
                </div>

                {/* File list cards */}
                <div className="space-y-2">
                  {Object.entries(manifest).map(([fileName, fileContent]) => (
                    <div
                      key={fileName}
                      className="p-3 rounded-xl border flex items-center justify-between"
                      style={{ borderColor: theme.cardBorder, backgroundColor: theme.accentSoft }}
                    >
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4" style={{ color: theme.accent }} />
                        <span className="font-mono text-xs font-semibold" style={{ color: theme.textPrimary }}>
                          {fileName}
                        </span>
                        <span className="text-[10px] opacity-60">({Math.round(fileContent.length / 1024 * 10) / 10} KB)</span>
                      </div>

                      <button
                        onClick={() => copyManifestFile(fileName, fileContent)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium border bg-white flex items-center gap-1 transition-all hover:scale-102"
                        style={{ borderColor: theme.accentBorder, color: theme.accent }}
                      >
                        {copiedFile === fileName ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedFile === fileName ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GITHUB SETUP GUIDE */}
          {activeSubTab === 'guide' && (
            <div className="space-y-3 text-xs leading-relaxed opacity-90" style={{ color: theme.textPrimary }}>
              <div className="p-4 rounded-2xl border space-y-2" style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }}>
                <h4 className="font-serif text-sm font-semibold" style={{ color: theme.accent }}>
                  How FaerieLens Works with GitHub
                </h4>
                <ol className="list-decimal list-inside space-y-2 pl-1">
                  <li>
                    <strong>Host Photos for Free:</strong> Create a public repository on GitHub (e.g. <code className="bg-neutral-100 px-1 rounded">username/photos-portfolio</code>). Put your JPEG/PNG/WEBP files into a <code className="bg-neutral-100 px-1 rounded">photos/</code> folder.
                  </li>
                  <li>
                    <strong>Raw CDN Delivery:</strong> FaerieLens loads and caches your images directly from raw.githubusercontent.com, providing ultra-fast global CDN delivery at zero hosting cost.
                  </li>
                  <li>
                    <strong>Direct In-Browser Commits:</strong> When you grade a photo in the Studio Photo Editor, entering your GitHub Personal Access Token commits the edited file directly to your repo branch with Git history!
                  </li>
                  <li>
                    <strong>GitHub Pages Deploy:</strong> Enable GitHub Pages in your repo Settings &rarr; Pages &rarr; Source &rarr; GitHub Actions to publish your live custom domain portfolio.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t flex justify-between items-center"
          style={{ borderColor: theme.cardBorder, backgroundColor: theme.glassBg }}
        >
          <div className="text-[11px] opacity-70" style={{ color: theme.textSecondary }}>
            Active Repository: <span className="font-mono font-medium">{formData.owner}/{formData.repo}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:scale-102 transition-transform"
            style={{ backgroundColor: theme.accent }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
