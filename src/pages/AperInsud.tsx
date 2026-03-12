import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Wine, Users, Utensils, Instagram, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Utensils,
    title: "Cibo Autentico",
    description: "Prodotti tipici e ricette tradizionali del Sud Italia selezionati con cura per offrire un'esperienza gastronomica autentica.",
  },
  {
    icon: Users,
    title: "Networking",
    description: "Un'occasione per conoscere altri studenti, condividere esperienze e creare connessioni significative in un ambiente informale.",
  },
  {
    icon: Globe,
    title: "Cultura Meridionale",
    description: "Ogni evento celebra un aspetto della cultura del Sud, dalla musica alla gastronomia, dalle tradizioni alle innovazioni.",
  },
];

const steps = [
  { number: "01", title: "Iscriviti", description: "Unisciti a INSUD e rimani aggiornato sui prossimi eventi AperInsud" },
  { number: "02", title: "Partecipa", description: "Prenota il tuo posto per l'aperitivo e vieni a scoprire i sapori del Sud" },
  { number: "03", title: "Connettiti", description: "Gusta prodotti tipici, conosci nuove persone e sostieni l'associazione" },
];

const AperInsud = () => {
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
            <Wine className="w-16 h-16 text-primary-foreground/80 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4">
              AperInsud
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
              Aperitivi a tema Sud per celebrare la cultura meridionale, creare connessioni e finanziare i nostri progetti
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cos'è AperInsud */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">Cos'è AperInsud?</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              AperInsud è la nostra iniziativa per portare i sapori, le tradizioni e l'atmosfera del
              Sud Italia all'interno della comunità studentesca. Attraverso aperitivi tematici con
              prodotti tipici meridionali, creiamo momenti di aggregazione, networking e scoperta
              culturale, sostenendo al contempo le attività dell'associazione.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-navy/5 border border-border rounded-2xl p-8"
              >
                <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Come Funziona */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            Come Funziona
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <span className="text-5xl font-extrabold text-sky/30">{step.number}</span>
                <h3 className="text-xl font-bold text-foreground mt-2 mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-20 bg-navy-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Instagram className="w-12 h-12 mx-auto mb-6 text-primary-foreground/80" />
            <h2 className="text-3xl font-bold mb-4">Seguici su Instagram</h2>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
              Rimani aggiornato sui prossimi eventi AperInsud, scopri foto e video degli aperitivi passati e non perderti le nostre iniziative
            </p>
            <a href="https://www.instagram.com/insud.bocconi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-primary-foreground text-navy hover:bg-primary-foreground/90 font-semibold rounded-full px-10 gap-2"
              >
                <Instagram className="w-4 h-4" /> Seguici su Instagram
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AperInsud;
