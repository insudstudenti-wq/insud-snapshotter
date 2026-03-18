import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { getArticleBySlug } from "@/lib/articleApi";
import type { ArticleWithRelations } from "@/lib/supabase";

// Same read time calculation as old system
const getReadTime = (content: string): string => {
  const words = content.split(' ').length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
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
          <p className="text-muted-foreground mb-8">L'articolo che cerchi non esiste.</p>
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

  // Split content by newlines to match old paragraph structure
  const paragraphs = article.content.split('\n').filter(p => p.trim());

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

            <div className="space-y-6">
              {paragraphs.map((paragraph, i) => (
                <p key={i} className="text-foreground/90 leading-relaxed text-[1.05rem]">
                  {paragraph}
                </p>
              ))}
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
