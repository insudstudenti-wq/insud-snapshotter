import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { articles, getReadTime } from "@/data/articles";

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

            <div className="space-y-6">
              {article.content.map((paragraph, i) => (
                <p key={i} className="text-foreground/90 leading-relaxed text-[1.05rem]">
                  {paragraph}
                </p>
              ))}
            </div>

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
