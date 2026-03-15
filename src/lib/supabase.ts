import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for your tables
export type Author = {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  created_at: string;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
};

export type Article = {
  id: number;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  author_id: number;
  category_id?: number;
  status: 'pending_review' | 'published' | 'rejected' | 'draft';
  featured_image?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
};

export type ArticleWithRelations = Article & {
  author: Author;
  tags: Tag[];
};
