export interface ArticleSubmission {
  title: string;
  author: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  status: 'pending_review' | 'published' | 'rejected';
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function submitArticle(article: ArticleSubmission): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Failed to submit article:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
