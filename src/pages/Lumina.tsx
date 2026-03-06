import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Award, Search, Layers, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { articles } from "@/data/articles";
import heroBg from "@/assets/hero-bg.jpg";

const highlights = [
  {
    icon: Award,
    title: "Storie di Successo",
    description: "Raccontiamo le storie di imprenditori, innovatori e leader che stanno trasformando il Sud Italia con il loro talento.",
  },
  {
    icon: Search,
    title: "Approfondimenti",
    description: "Analisi e riflessioni su temi chiave dell'innovazione meridionale: economia, cultura, tecnologia e società.",
  },
  {
    icon: Layers,
    title: "Serie Tematiche",
    description: "Collezioni di articoli organizzati per temi, che offrono una visione completa su argomenti specifici del Sud.",
  },
];


const series = [
  {
    title: "Storie di Successo",
    description: "Interviste e profili di imprenditori, professionisti e innovatori che stanno scrivendo il futuro del Meridione con progetti di successo.",
    tags: ["Imprenditoria", "Innovazione", "Ispirazione"],
  },
  {
    title: "Il Sud che Inventa",
    description: "Raccontiamo le eccellenze tecnologiche e industriali che nascono dal Sud, dimostrando come innovazione e territorio possano creare valore.",
    tags: ["Tecnologia", "Industria", "Ricerca"],
  },
  {
    title: "Ops… qualcosa è andato storto",
    description: "Analizziamo i fallimenti infrastrutturali e progettuali del Sud per capire cosa non ha funzionato e imparare dagli errori del passato.",
    tags: ["Infrastrutture", "Analisi", "Lezioni"],
  },
];

const Lumina = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-navy-gradient opacity-85" />
        <div className="relative z-10 text-center px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="w-16 h-16 text-primary-foreground/80 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4">
              LUMINA
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
              La nostra redazione che illumina le storie di successo e l'innovazione del Sud attraverso articoli e contenuti originali
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cos'è LUMINA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">Cos'è LUMINA?</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              LUMINA è il nostro progetto editoriale dedicato a raccontare le eccellenze, le innovazioni e le storie di successo che nascono dal Sud Italia. Attraverso articoli approfonditi e serie tematiche, diamo voce a chi sta facendo la differenza nel Meridione, ispirando le nuove generazioni.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-navy/5 border border-border rounded-2xl p-8"
              >
                <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center mb-4">
                  <h.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{h.title}</h3>
                <p className="text-muted-foreground">{h.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* I Nostri Articoli */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            I Nostri Articoli
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {articles.map((article, i) => (
              <Link key={article.slug} to={`/lumina/${article.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer h-full"
                >
                  <Badge variant="secondary" className="mb-4">{article.series}</Badge>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{article.title}</h3>
                  <p className="text-sm text-sky font-medium">Clicca per leggere l'articolo →</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Le Nostre Serie */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            Le Nostre Serie
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {series.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-navy/5 border border-border rounded-2xl p-8"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Redazione */}
      <section className="py-20 bg-navy-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Entra nella Redazione</h2>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
              Hai una storia da raccontare o vuoi contribuire con i tuoi articoli? Unisciti al team di LUMINA e aiutaci a illuminare le eccellenze del Sud
            </p>
            <a href="https://forms.gle/mSLxxMW1ooQmPK2y8" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-primary-foreground text-navy hover:bg-primary-foreground/90 font-semibold rounded-full px-10 gap-2"
              >
                Unisciti a Noi <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Lumina;
