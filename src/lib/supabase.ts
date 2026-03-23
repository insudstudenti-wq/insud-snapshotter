import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  | { type: 'textbox'; title: string; content: string; style?: 'default' | 'info' | 'warning' | 'success' }
  | { type: 'link'; label: string; url: string; style?: 'default' | 'button' | 'outline' };

export type ArticleWithRelations = Article & {
  author: Author;
  tags: Tag[];
  category?: Category;
  content_blocks?: ContentBlock[];
};
