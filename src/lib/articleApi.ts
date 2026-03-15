import { supabase } from './supabase';
import type { Article, Author, Tag, ArticleWithRelations } from './supabase';

// Helper to generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Submit new article
export async function submitArticle(data: {
  title: string;
  author: string;
  content: string;
  category?: string;
  tags: string[];
}) {
  try {
    // 1. Check if author exists, create if not
    let authorId: number;
    
    const { data: existingAuthor } = await supabase
      .from('authors')
      .select('id')
      .eq('name', data.author)
      .single();

    if (existingAuthor) {
      authorId = existingAuthor.id;
    } else {
      const { data: newAuthor, error: authorError } = await supabase
        .from('authors')
        .insert({ name: data.author })
        .select('id')
        .single();

      if (authorError) throw authorError;
      authorId = newAuthor!.id;
    }

    // 2. Get category ID (default to 'Lumina')
    let categoryId = null;
    if (data.category) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', data.category.toLowerCase())
        .single();
      
      if (category) categoryId = category.id;
    }

    // 3. Create article
    const slug = `${generateSlug(data.title)}-${Date.now()}`;
    const excerpt = data.content.substring(0, 200) + '...';
    
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        title: data.title,
        slug: slug,
        content: data.content,
        excerpt: excerpt,
        author_id: authorId,
        category_id: categoryId,
        status: 'pending_review',
      })
      .select('id')
      .single();

    if (articleError) throw articleError;

    // 4. Process tags
    if (data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tagSlug = generateSlug(tagName);
        
        // Insert tag if not exists
        const { data: tagData } = await supabase
          .from('tags')
          .upsert(
            { name: tagName, slug: tagSlug },
            { onConflict: 'name' }
          )
          .select('id')
          .single();

        if (tagData) {
          // Link tag to article
          await supabase
            .from('article_tags')
            .insert({
              article_id: article.id,
              tag_id: tagData.id,
            });
        }
      }
    }

    return { success: true, id: article.id };
  } catch (error) {
    console.error('Error submitting article:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Get all published articles with relations
export async function getPublishedArticles(): Promise<ArticleWithRelations[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      tags:article_tags(tag:tags(*))
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;

  // Transform the nested data
  return (data || []).map((article: any) => ({
    ...article,
    tags: article.tags?.map((t: any) => t.tag) || [],
  }));
}

// Get single article by slug
export async function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      tags:article_tags(tag:tags(*))
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;

  return {
    ...data,
    tags: data.tags?.map((t: any) => t.tag) || [],
  };
}

// Get articles by tag
export async function getArticlesByTag(tagSlug: string): Promise<ArticleWithRelations[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      tags:article_tags!inner(tag:tags!inner(*))
    `)
    .eq('tags.tag.slug', tagSlug)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((article: any) => ({
    ...article,
    tags: article.tags?.map((t: any) => t.tag) || [],
  }));
}

// Admin: Get pending articles
export async function getPendingArticles(): Promise<ArticleWithRelations[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      tags:article_tags(tag:tags(*))
    `)
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((article: any) => ({
    ...article,
    tags: article.tags?.map((t: any) => t.tag) || [],
  }));
}

// Admin: Update article status
export async function updateArticleStatus(
  articleId: number, 
  status: 'published' | 'rejected' | 'draft',
  publishedAt?: string
) {
  const updates: any = { status };
  
  if (status === 'published') {
    updates.published_at = publishedAt || new Date().toISOString();
  }

  const { error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', articleId);

  if (error) throw error;
  return { success: true };
}

// Admin: Delete article
export async function deleteArticle(articleId: number) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', articleId);

  if (error) throw error;
  return { success: true };
}
