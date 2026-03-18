import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User, Database } from "lucide-react";
import { motion } from "framer-motion";
import { getArticles } from "@/lib/articleApi";
import type { ArticleWithRelations } from "@/lib/supabase";

const LuminaDynamic = () => {
  const [articles, setArticles] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
      setError(null);
    } catch (err) {
      setError("Failed to load articles from database");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate read time
  const getReadTime = (content: string) => {
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link to="/">
              <Button variant="ghost" className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Torna alla Home
              </Button>
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-indigo-600" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
                LUMINA <span className="text-indigo-600">DYNAMIC</span>
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Test page - Articles from database ({articles.length} found)
            </p>
            
            <div className="flex gap-4 mt-6">
              <Link to="/lumina">
                <Button variant="outline">← View Static Articles</Button>
              </Link>
              <Link to="/lumina/submit">
                <Button>Submit New Article</Button>
              </Link>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading articles from database...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadArticles} variant="outline">Retry</Button>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-muted-foreground mb-4">No articles found in database yet.</p>
              <Link to="/lumina/submit">
                <Button>Submit First Article</Button>
              </Link>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/article/${article.slug}`} className="block p-6">
                    <Badge variant="secondary" className="mb-3">
                      {article.category?.name || 'LUMINA'}
                    </Badge>
                    
                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    
                    {article.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {article.author.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(article.published_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {getReadTime(article.content)} min
                      </span>
                    </div>

                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{article.tags.length - 3}</Badge>
                        )}
                      </div>
                    )}
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LuminaDynamic;
