export { supabase } from '@/integrations/supabase/client';

// Minimal types
export type Author = {
  id: number;
  name: string;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export type Article = {
  id: number;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  author_id: number;
  category_id?: number;
  published_at?: string;
};

// Content block types for rich article content
export type ContentBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'textbox'; title: string; content: string; style?: 'default' | 'info' | 'warning' | 'success' };

export type ArticleLink = {
  label: string;
  url: string;
};

export type ArticleLinks = {
  title: string;
  items: ArticleLink[];
};

export type ArticleWithRelations = Article & {
  author: Author;
  tags: Tag[];
  category?: Category;
  content_blocks?: ContentBlock[];
  links?: ArticleLinks | null;
};
