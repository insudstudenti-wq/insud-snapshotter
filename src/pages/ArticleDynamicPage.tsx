import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { getArticleBySlug } from "@/lib/articleApi";
import type { ArticleWithRelations, ContentBlock } from "@/lib/supabase";

// Same read time calculation as old system
const getReadTime = (content: string): string => {
  const words = content.split(' ').length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
};

// TextBox style configurations (no icon)
const textBoxStyles = {
  default: { bg: 'bg-muted/50', border: 'border-border' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200' },
  success: { bg: 'bg-green-50', border: 'border-green-200' },
};



// Parse content blocks from article
const parseContentBlocks = (article: ArticleWithRelations): ContentBlock[] => {
  // If article has content_blocks stored, use those
  if (article.content_blocks && article.content_blocks.length > 0) {
    return article.content_blocks;
  }
  
  // Otherwise, parse legacy format or split by newlines
  const blocks: ContentBlock[] = [];
  const lines = article.content.split('\n');
  let currentParagraph = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check for textbox pattern: [BOX: Title] or similar
    const boxMatch = trimmedLine.match(/^\[BOX:\s*(.+?)\]$/i);
    if (boxMatch) {
      // Save current paragraph if exists
      if (currentParagraph.trim()) {
        blocks.push({ type: 'paragraph', content: currentParagraph.trim() });
        currentParagraph = '';
      }
      // Text box content follows in next lines until empty line or next box
      continue;
    }
    

    
    // Check if this might be textbox content (if previous line was a box marker)
    if (blocks.length > 0 && blocks[blocks.length - 1].type === 'textbox') {
      const lastBlock = blocks[blocks.length - 1];
      if (!lastBlock.content && trimmedLine) {
        // This is the first content line after box marker
        lastBlock.content = trimmedLine;
        continue;
      } else if (lastBlock.content && trimmedLine) {
        lastBlock.content += '\n' + trimmedLine;
        continue;
      }
    }
    
    // Check for URL list pattern (links section)
    const urlMatch = trimmedLine.match(/^(https?:\/\/\S+)\s*-\s*(.+)$/);
    if (urlMatch && blocks.length > 0) {
      // This is a link line, append to last textbox or create new one
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock && lastBlock.type === 'textbox') {
        lastBlock.content += (lastBlock.content ? '\n' : '') + `[${urlMatch[2]}](${urlMatch[1]})`;
        continue;
      }
    }
    
    // Regular paragraph content
    if (trimmedLine) {
      if (currentParagraph) {
        currentParagraph += '\n' + trimmedLine;
      } else {
        currentParagraph = trimmedLine;
      }
    } else if (currentParagraph.trim()) {
      blocks.push({ type: 'paragraph', content: currentParagraph.trim() });
      currentParagraph = '';
    }
  }
  
  // Don't forget the last paragraph
  if (currentParagraph.trim()) {
    blocks.push({ type: 'paragraph', content: currentParagraph.trim() });
  }
  
  return blocks.length > 0 ? blocks : [{ type: 'paragraph', content: article.content }];
};

// Render content with markdown link detection [text](url)
const renderContentWithLinks = (content: string) => {
  if (!content) return null;
  
  // Split by markdown links [text](url)
  const parts = content.split(/(\[.*?\]\(.*?\))/g);
  
  return parts.map((part, index) => {
    // Check for markdown link [text](url)
    const markdownMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
    if (markdownMatch) {
      const [, text, url] = markdownMatch;
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
    // Return plain text
    return <span key={index}>{part}</span>;
  });
};

const ArticleDynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      const data = await getArticleBySlug(slug!);
      setArticle(data);
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <p>Caricamento...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Articolo non trovato</h1>
          <p className="text-muted-foreground mb-8">L&apos;articolo che cerchi non esiste.</p>
          <Link to="/lumina_dynamic">
            <Button variant="outline" className="gap-2 rounded-full">
              <ArrowLeft className="w-4 h-4" /> Torna a LUMINA DYNAMIC
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Format date like old system (Italian format)
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get content blocks
  const contentBlocks = parseContentBlocks(article);

  return (
    <div className="min-h-screen">
      <Navbar />

      <article className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/lumina_dynamic">
              <Button variant="ghost" className="gap-2 mb-8 -ml-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Torna a LUMINA
              </Button>
            </Link>

            <Badge variant="secondary" className="mb-4">{article.category?.name || 'LUMINA'}</Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-10 border-b border-border pb-6">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {article.author.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {formatDate(article.published_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {getReadTime(article.content)} di lettura
              </span>
            </div>

            {article.excerpt && (
              <p className="text-lg text-muted-foreground italic mb-8">{article.excerpt}</p>
            )}

            {/* Render Content Blocks */}
            <div className="space-y-6">
              {contentBlocks.map((block, index) => {
                if (block.type === 'paragraph') {
                  return (
                    <p key={index} className="text-foreground/90 leading-relaxed text-[1.05rem] whitespace-pre-wrap">
                      {renderContentWithLinks(block.content)}
                    </p>
                  );
                }
                
                if (block.type === 'textbox') {
                  const style = textBoxStyles[block.style || 'default'];
                  
                  return (
                    <div 
                      key={index} 
                      className={`mt-8 p-6 ${style.bg} border ${style.border} rounded-2xl`}
                    >
                      {block.title && (
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          {block.title}
                        </h3>
                      )}
                      <div className="text-foreground/80 text-[1.05rem] leading-relaxed whitespace-pre-wrap">
                        {renderContentWithLinks(block.content)}
                      </div>
                    </div>
                  );
                }
                
                return null;
              })}
            </div>

            {article.tags.length > 0 && (
              <div className="mt-10 p-6 bg-muted/50 border border-border rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-border text-center">
              <Link to="/lumina_dynamic">
                <Button variant="outline" className="gap-2 rounded-full">
                  <ArrowLeft className="w-4 h-4" /> Torna a LUMINA
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticleDynamicPage;
