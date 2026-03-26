import type { ContentBlock } from '@/lib/supabase';

export type Tool = 'publish' | 'manage';
export type BlockType = 'paragraph' | 'textbox';

// Complete interface with all fields
export interface ArticleFormData {
  title: string;
  author: string;
  content: string;
  category: string;
  tags: string;
  publishedAt: string;
  excerpt: string;
  contentBlocks: ContentBlock[];
}

export interface EditingArticle {
  id: number;
  title: string;
  author: string;
  content: string;
  excerpt: string;
  published_at: string;
  tags: string;
  contentBlocks: ContentBlock[];
}

// Helper: Format ISO to European DD/MM/YYYY for display
export const toEuropeanDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

// Helper: Format timestamp to European for article list
export const formatDateDisplay = (isoTimestamp: string): string => {
  if (!isoTimestamp) return '';
  return new Date(isoTimestamp).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// TextBox styles (no icon)
export const textBoxStyles = {
  default: { bg: 'bg-muted/50', border: 'border-border' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200' },
  success: { bg: 'bg-green-50', border: 'border-green-200' },
};

// Render content with markdown links [text](url) - fallback for plain text
export const renderContentWithLinks = (content: string): (JSX.Element | string)[] | null => {
  if (!content) return null;
  
  // Split by markdown links [text](url)
  const parts = content.split(/(\[.*?\]\(.*?\))/g);
  
  return parts.map((part, index) => {
    const match = part.match(/^\[(.+?)\]\((.+?)\)$/);
    if (match) {
      const [, text, url] = match;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky hover:underline"
        >
          {text}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

// Normalize HTML content - preserve formatting but ensure uniform font size
export const normalizeHtmlContent = (html: string): string => {
  if (!html) return '';
  
  // SSR-safe: return input as-is if document is not available
  if (typeof document === 'undefined') {
    return html;
  }
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove script and style tags for security
  const scripts = tempDiv.querySelectorAll('script, style, iframe, object, embed');
  scripts.forEach(el => el.remove());
  
  // Remove font-size inline styles to ensure uniform sizing via CSS
  // but preserve bold, italic, and other formatting
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    const style = el.getAttribute('style');
    if (style) {
      // Remove font-size declarations but keep other styles
      const cleanedStyle = style
        .split(';')
        .filter(s => !s.trim().startsWith('font-size'))
        .join(';');
      if (cleanedStyle.trim()) {
        el.setAttribute('style', cleanedStyle);
      } else {
        el.removeAttribute('style');
      }
    }
  });
  
  // Ensure links have proper attributes and styling
  const links = tempDiv.querySelectorAll('a');
  links.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.classList.add('text-sky', 'hover:underline');
  });
  
  return tempDiv.innerHTML;
};

// Clean HTML content for safe rendering (legacy function, kept for compatibility)
export const cleanHtmlContent = (html: string): string => {
  return normalizeHtmlContent(html);
};

// Strip HTML tags for plain text display (used for excerpts, previews)
export const stripHtml = (html: string): string => {
  if (!html) return '';
  // SSR-safe: use regex fallback if document is not available
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Convert HTML to plain text while preserving line breaks (for read time calculation only)
export const htmlToPlainText = (html: string): string => {
  if (!html) return '';
  
  // Replace block elements with newlines first (on the string, before DOM insertion)
  const normalized = html
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n');
  
  // Now strip all remaining HTML using DOM
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = normalized;
  
  return (tempDiv.textContent || tempDiv.innerText || '').trim();
};

// Sync content blocks to plain text for backwards compatibility (read time calculation only)
// NOTE: This is used ONLY for calculating read time, not for display
export const syncBlocksToContent = (contentBlocks: ContentBlock[]): string => {
  return contentBlocks
    .map(block => {
      if (block.type === 'paragraph') return htmlToPlainText(block.content);
      if (block.type === 'textbox') return htmlToPlainText(block.content);
      return '';
    })
    .filter(Boolean)
    .join('\n\n');
};

// Initial form data factory
export const createInitialFormData = (): ArticleFormData => ({
  title: '',
  author: '',
  content: '',
  category: 'Lumina',
  tags: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  excerpt: '',
  contentBlocks: [],
});
