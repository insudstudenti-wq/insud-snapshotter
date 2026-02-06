import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

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
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
              La nostra redazione di articoli online dedicata a storie di successo e innovazione del Sud
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">Cos'è LUMINA?</h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              LUMINA è la redazione online di INSUD, dove raccontiamo le storie di chi sta
              trasformando il Meridione. Attraverso articoli, interviste e approfondimenti,
              esploriamo tematiche legate all'innovazione, all'imprenditoria e alla cultura del Sud
              Italia.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Le nostre serie editoriali coprono storie di successo di imprenditori meridionali,
              analisi delle opportunità di sviluppo e riflessioni sul futuro del Mezzogiorno.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Lumina;
