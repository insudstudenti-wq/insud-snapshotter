import { useParams, Link } from "react-router-dom";
import type React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { articles, getReadTime } from "@/data/articles";
import { cleanHtmlContent } from "@/lib/articleSubmission";

// Render paragraph content, supporting both HTML and plain text
const renderParagraph = (content: string): React.ReactNode | { __html: string } => {
  if (!content) return null;
  
  // Check if content contains HTML tags (more robust check)
  // Matches strings that start with optional whitespace followed by <tag...>
  if (/^[\s]*<[a-zA-Z][^>]*>/.test(content) || /<[a-z][\s\S]*>/i.test(content)) {
    // Return as object to be used with dangerouslySetInnerHTML by caller
    return { __html: cleanHtmlContent(content) };
  }
  
  return <>{content}</>;
};

// Type guard to check if content is HTML object
const isHtmlObject = (content: React.ReactNode): content is { __html: string } => {
  return typeof content === 'object' && content !== null && '__html' in content;
};

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Articolo non trovato</h1>
          <p className="text-muted-foreground mb-8">L'articolo che cerchi non esiste.</p>
          <Link to="/lumina">
            <Button variant="outline" className="gap-2 rounded-full">
              <ArrowLeft className="w-4 h-4" /> Torna a LUMINA
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <article className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/lumina">
              <Button variant="ghost" className="gap-2 mb-8 -ml-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Torna a LUMINA
              </Button>
            </Link>

            <Badge variant="secondary" className="mb-4">{article.series}</Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-10 border-b border-border pb-6">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {getReadTime(article)} di lettura
              </span>
            </div>

            <p className="text-lg text-muted-foreground italic mb-8">{article.summary}</p>

            <div className="space-y-6 article-content">
              {article.content.map((paragraph, i) => {
                const content = renderParagraph(paragraph);
                if (isHtmlObject(content)) {
                  return (
                    <div 
                      key={i} 
                      className="text-foreground/90 leading-relaxed text-[1.05rem]"
                      dangerouslySetInnerHTML={content}
                    />
                  );
                }
                return (
                  <div key={i} className="text-foreground/90 leading-relaxed text-[1.05rem]">
                    {content}
                  </div>
                );
              })}
            </div>

            {article.links && (
              <div className="mt-10 p-6 bg-muted/50 border border-border rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-4">{article.links.title}</h3>
                <div className="flex flex-col gap-3">
                  {article.links.items.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sky hover:underline font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-border text-center">
              <Link to="/lumina">
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

export default ArticlePage;
