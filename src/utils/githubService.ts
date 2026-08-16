import { PhotoItem, GitHubRepoConfig } from '../types';

export interface GitHubContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
}

export async function fetchGitHubRepoImages(
  config: GitHubRepoConfig
): Promise<{ photos: PhotoItem[]; rawFiles: GitHubContentItem[]; message?: string }> {
  const { owner, repo, branch, path, personalAccessToken } = config;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (personalAccessToken) {
    headers['Authorization'] = `token ${personalAccessToken.trim()}`;
  }

  const cleanPath = path ? path.replace(/^\/+|\/+$/g, '') : '';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}${branch ? `?ref=${branch}` : ''}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Repository or path "${owner}/${repo}/${cleanPath}" not found. Please verify repo name and public visibility.`);
      } else if (res.status === 403) {
        throw new Error(`GitHub API rate limit exceeded or access forbidden. If this is a private repo, please provide a GitHub Personal Access Token.`);
      } else {
        throw new Error(`GitHub API returned status ${res.status}: ${res.statusText}`);
      }
    }

    const data: GitHubContentItem[] = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Specified path returned a single file instead of a directory.');
    }

    // Check if there's a gallery.json or metadata file
    const galleryJsonItem = data.find((item) => item.name.toLowerCase() === 'gallery.json' || item.name.toLowerCase() === 'photos.json');
    if (galleryJsonItem && galleryJsonItem.download_url) {
      try {
        const jsonRes = await fetch(galleryJsonItem.download_url);
        if (jsonRes.ok) {
          const jsonPhotos = await jsonRes.json();
          if (Array.isArray(jsonPhotos) && jsonPhotos.length > 0) {
            return {
              photos: jsonPhotos.map((p, idx) => ({
                id: p.id || `gh-${idx}-${Date.now()}`,
                title: p.title || `Photograph ${idx + 1}`,
                subtitle: p.subtitle || `${owner}/${repo}`,
                story: p.story || 'Fine art capture hosted on GitHub repository.',
                category: p.category || 'fairy-tale',
                url: p.url || p.download_url || `https://raw.githubusercontent.com/${owner}/${repo}/${branch || 'main'}/${p.githubPath || p.path}`,
                highResUrl: p.highResUrl || p.url || p.download_url,
                githubPath: p.githubPath || p.path,
                aspectRatio: p.aspectRatio || 'portrait',
                exif: p.exif || {
                  camera: 'Fine Art Camera',
                  lens: 'Prime Lens',
                  focalLength: '50mm',
                  aperture: 'f/1.4',
                  shutterSpeed: '1/500s',
                  iso: '100',
                  dateTaken: new Date().toLocaleDateString(),
                  location: `${owner}/${repo}`,
                },
                palette: p.palette || ['#E6CECA', '#A86C78', '#5E4348', '#38282B'],
                tags: p.tags || ['GitHub', 'Portfolio', 'Fine Art'],
                likes: p.likes || Math.floor(Math.random() * 200 + 40),
                featured: p.featured ?? idx < 3,
              })),
              rawFiles: data,
              message: `Successfully loaded ${jsonPhotos.length} curated photographs from gallery.json in ${owner}/${repo}`,
            };
          }
        }
      } catch (err) {
        console.warn('Failed to parse gallery.json from repository, falling back to direct images:', err);
      }
    }

    // Filter image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
    const imageFiles = data.filter((item) =>
      item.type === 'file' && imageExtensions.some((ext) => item.name.toLowerCase().endsWith(ext))
    );

    if (imageFiles.length === 0) {
      return {
        photos: [],
        rawFiles: data,
        message: `Found ${data.length} items in "${owner}/${repo}/${cleanPath}", but no image files (.jpg, .png, .webp). You can upload photos directly!`,
      };
    }

    const categories: PhotoItem['category'][] = ['fairy-tale', 'birds-avian', 'whispering-forest', 'ethereal-portraits', 'golden-light'];

    const parsedPhotos: PhotoItem[] = imageFiles.map((item, idx) => {
      const rawName = item.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const cleanTitle = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const rawUrl = item.download_url || `https://raw.githubusercontent.com/${owner}/${repo}/${branch || 'main'}/${item.path}`;
      const cat = categories[idx % categories.length];

      return {
        id: `gh-file-${item.sha.slice(0, 8)}`,
        title: cleanTitle,
        subtitle: `Repository: ${owner}/${repo}`,
        story: `Fine art archival capture hosted in ${owner}/${repo}. Preserved in git version control.`,
        category: cat,
        url: rawUrl,
        highResUrl: rawUrl,
        githubPath: item.path,
        aspectRatio: idx % 3 === 0 ? 'portrait' : idx % 3 === 1 ? 'landscape' : 'square',
        exif: {
          camera: 'Archival Medium Format',
          lens: 'Fixed Prime Master',
          focalLength: '45mm',
          aperture: 'f/1.8',
          shutterSpeed: '1/1000s',
          iso: '100',
          dateTaken: 'Archived on GitHub',
          location: `${owner}/${repo}/${item.path}`,
        },
        palette: ['#FAF6F5', '#E6CECA', '#A86C78', '#38282B'],
        tags: ['GitHub Repo', 'Fine Art', 'Archived', cat.replace('-', ' ')],
        likes: Math.floor(Math.random() * 150) + 25,
        featured: idx === 0,
      };
    });

    return {
      photos: parsedPhotos,
      rawFiles: data,
      message: `Successfully synchronized ${parsedPhotos.length} photographs from GitHub repository ${owner}/${repo}`,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect to GitHub repository.');
  }
}

export async function commitImageToGitHub(
  config: GitHubRepoConfig,
  filePath: string,
  base64Content: string,
  commitMessage: string
): Promise<{ success: boolean; url: string; sha: string; message: string }> {
  const { owner, repo, branch, personalAccessToken } = config;

  if (!personalAccessToken) {
    throw new Error('A GitHub Personal Access Token is required to commit changes to the repository.');
  }

  const cleanBranch = branch || 'main';
  const cleanPath = filePath.replace(/^\/+/, '');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`;

  // Check if file already exists to get SHA
  let existingSha: string | undefined;
  try {
    const checkRes = await fetch(`${url}?ref=${cleanBranch}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${personalAccessToken.trim()}`,
      },
    });
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      existingSha = checkData.sha;
    }
  } catch {
    // File doesn't exist yet, proceeding to create
  }

  // Remove base64 data prefix if present (e.g., data:image/png;base64,)
  const pureBase64 = base64Content.replace(/^data:image\/[a-z]+;base64,/, '');

  const payload: any = {
    message: commitMessage || `Update photo asset: ${cleanPath} via FaerieLens Studio`,
    content: pureBase64,
    branch: cleanBranch,
  };

  if (existingSha) {
    payload.sha = existingSha;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${personalAccessToken.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `GitHub commit failed with HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const rawUrl = data.content?.download_url || `https://raw.githubusercontent.com/${owner}/${repo}/${cleanBranch}/${cleanPath}`;

  return {
    success: true,
    url: rawUrl,
    sha: data.content?.sha || '',
    message: `Successfully committed ${cleanPath} to branch ${cleanBranch}! Commit: ${data.commit?.sha?.slice(0, 7) || 'latest'}`,
  };
}

export function generateGitHubPagesManifest(photos: PhotoItem[], repoName: string = 'faerielens-portfolio') {
  const jsonContent = JSON.stringify(photos, null, 2);

  const workflowYml = `name: Deploy FaerieLens Portfolio to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const readmeMd = `# 🌸 ${repoName}
> A whimsical, fairy-and-bird themed fine art photography portfolio powered by FaerieLens & GitHub Pages.

## 📸 About this Gallery
This repository stores and hosts the high-resolution fine art captures, editorial stories, Bandcamp audio aura, and gallery layouts.

### 🌟 Features
- Hosted via GitHub repository & GitHub Pages
- Soft, minimalist, feminine aesthetics & fairy cursor sparkles
- Embedded Bandcamp soundscapes & YouTube film reels
- Direct client inquiry booking system & newsletter dispatch

## 🚀 Live Preview
View the published portfolio on GitHub Pages or connect this repository to **FaerieLens Studio**.
`;

  return {
    'gallery.json': jsonContent,
    'README.md': readmeMd,
    '.github/workflows/deploy.yml': workflowYml,
  };
}
