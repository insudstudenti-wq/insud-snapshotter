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
  publishedAt: string;
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
        published_at: data.publishedAt,
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

// Get all articles
export async function getArticles(): Promise<ArticleWithRelations[]> {
  // First, get articles with author and category
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(id, name),
      category:categories(id, name, slug)
    `)
    .order('published_at', { ascending: false });

  if (articlesError) {
    console.error('getArticles error:', articlesError);
    throw articlesError;
  }

  if (!articles || articles.length === 0) {
    return [];
  }

  // Get all article IDs
  const articleIds = articles.map(a => a.id);

  // Fetch tags for these articles in a separate query
  const { data: articleTags, error: tagsError } = await supabase
    .from('article_tags')
    .select(`
      article_id,
      tag:tags(id, name, slug)
    `)
    .in('article_id', articleIds);

  if (tagsError) {
    console.error('getArticles tags error:', tagsError);
  }

  // Group tags by article
  const tagsByArticle: Record<number, any[]> = {};
  if (articleTags) {
    articleTags.forEach((at: any) => {
      if (!tagsByArticle[at.article_id]) {
        tagsByArticle[at.article_id] = [];
      }
      if (at.tag) {
        tagsByArticle[at.article_id].push(at.tag);
      }
    });
  }

  // Combine articles with their tags
  return articles.map((article: any) => ({
    ...article,
    tags: tagsByArticle[article.id] || [],
  }));
}

// Get single article by slug
export async function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
  // Get article
  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(id, name),
      category:categories(id, name, slug)
    `)
    .eq('slug', slug)
    .single();

  if (articleError || !article) return null;

  // Get tags separately
  const { data: articleTags, error: tagsError } = await supabase
    .from('article_tags')
    .select(`
      tag:tags(id, name, slug)
    `)
    .eq('article_id', article.id);

  const tags = articleTags?.map((at: any) => at.tag).filter(Boolean) || [];

  return {
    ...article,
    tags,
  };
}

// Get articles by tag
export async function getArticlesByTag(tagSlug: string): Promise<ArticleWithRelations[]> {
  // First get the tag ID
  const { data: tagData } = await supabase
    .from('tags')
    .select('id')
    .eq('slug', tagSlug)
    .single();

  if (!tagData) return [];

  // Get article IDs linked to this tag
  const { data: articleTags } = await supabase
    .from('article_tags')
    .select('article_id')
    .eq('tag_id', tagData.id);

  const articleIds = articleTags?.map(at => at.article_id) || [];
  if (articleIds.length === 0) return [];

  // Get articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(id, name),
      category:categories(id, name, slug)
    `)
    .in('id', articleIds)
    .order('published_at', { ascending: false });

  if (error) throw error;
  if (!articles) return [];

  // Get all tags for these articles
  const { data: allArticleTags } = await supabase
    .from('article_tags')
    .select(`
      article_id,
      tag:tags(id, name, slug)
    `)
    .in('article_id', articleIds);

  const tagsByArticle: Record<number, any[]> = {};
  if (allArticleTags) {
    allArticleTags.forEach((at: any) => {
      if (!tagsByArticle[at.article_id]) {
        tagsByArticle[at.article_id] = [];
      }
      if (at.tag) {
        tagsByArticle[at.article_id].push(at.tag);
      }
    });
  }

  return articles.map((article: any) => ({
    ...article,
    tags: tagsByArticle[article.id] || [],
  }));
}

// Update article
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
      updates.slug = `${generateSlug(data.title)}-${Date.now()}`;
    }
    if (data.content) {
      updates.content = data.content;
      updates.excerpt = data.content.substring(0, 200) + '...';
    }
    if (data.excerpt) updates.excerpt = data.excerpt;
    if (data.published_at) updates.published_at = data.published_at;
    
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
    await supabase
      .from('article_tags')
      .delete()
      .eq('article_id', articleId);

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
