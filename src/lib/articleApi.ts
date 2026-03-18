import { supabase } from './supabase';
import type { ArticleWithRelations } from './supabase';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Submit article (immediately published with custom timestamp)
export async function submitArticle(data: {
  title: string;
  author: string;
  content: string;
  category?: string;
  tags: string[];
  publishedAt: string; // Custom timestamp from form
}) {
  try {
    // 1. Handle author (create if new)
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

    // 2. Get category ID
    let categoryId = null;
    if (data.category) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', data.category.toLowerCase())
        .single();
      
      if (category) categoryId = category.id;
    }

    // 3. Create article with custom timestamp
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
        published_at: data.publishedAt, // Uses your manual timestamp
      })
      .select('id')
      .single();

    if (articleError) throw articleError;

    // 4. Handle tags
    if (data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tagSlug = generateSlug(tagName);
        
        const { data: tagData } = await supabase
          .from('tags')
          .upsert(
            { name: tagName, slug: tagSlug },
            { onConflict: 'name' }
          )
          .select('id')
          .single();

        if (tagData) {
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

// Get all articles (no status filter - everything is published)
export async function getArticles(): Promise<ArticleWithRelations[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(id, name),
      category:categories(id, name, slug),
      tags:article_tags(tag:id, tag:name, tag:slug)
    `)
    .order('published_at', { ascending: false });

  if (error) throw error;

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
      author:authors(id, name),
      category:categories(id, name, slug),
      tags:article_tags(tag:id, tag:name, tag:slug)
    `)
    .eq('slug', slug)
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
      author:authors(id, name),
      category:categories(id, name, slug),
      tags:article_tags!inner(tag:id, tag:name, tag:slug)
    `)
    .eq('tags.tag.slug', tagSlug)
    .order('published_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((article: any) => ({
    ...article,
    tags: article.tags?.map((t: any) => t.tag) || [],
  }));
}

// Delete article
export async function deleteArticle(articleId: number) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', articleId);

  if (error) throw error;
  return { success: true };
}

// Get all tags
export async function getAllTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*, article_count:article_tags(count)')
    .order('name');

  if (error) throw error;
  return data || [];
}

// Get all authors
export async function getAllAuthors() {
  const { data, error } = await supabase
    .from('authors')
    .select('id, name, article_count:articles(count)')
    .order('name');

  if (error) throw error;
  return data || [];
}

// Update article (full update)
export async function updateArticle(
  articleId: number,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    published_at?: string;
    author?: string;
  }
) {
  try {
    const updates: any = {};
    
    if (data.title) {
      updates.title = data.title;
      // Regenerate slug if title changes
      updates.slug = `${generateSlug(data.title)}-${Date.now()}`;
    }
    if (data.content) {
      updates.content = data.content;
      updates.excerpt = data.content.substring(0, 200) + '...';
    }
    if (data.excerpt) updates.excerpt = data.excerpt;
    if (data.published_at) updates.published_at = data.published_at;
    
    // Handle author change
    if (data.author) {
      let authorId: number;
      const { data: existingAuthor } = await supabase
        .from('authors')
        .select('id')
        .eq('name', data.author)
        .single();

      if (existingAuthor) {
        authorId = existingAuthor.id;
      } else {
        const { data: newAuthor } = await supabase
          .from('authors')
          .insert({ name: data.author })
          .select('id')
          .single();
        authorId = newAuthor!.id;
      }
      updates.author_id = authorId;
    }

    const { error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', articleId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating article:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Update article tags
export async function updateArticleTags(articleId: number, tags: string[]) {
  try {
    // Remove existing tags
    await supabase
      .from('article_tags')
      .delete()
      .eq('article_id', articleId);

    // Add new tags
    if (tags.length > 0) {
      for (const tagName of tags) {
        const tagSlug = generateSlug(tagName);
        const { data: tagData } = await supabase
          .from('tags')
          .upsert(
            { name: tagName, slug: tagSlug },
            { onConflict: 'name' }
          )
          .select('id')
          .single();

        if (tagData) {
          await supabase
            .from('article_tags')
            .insert({ article_id: articleId, tag_id: tagData.id });
        }
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error updating tags:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
