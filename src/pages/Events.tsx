import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Events = () => {
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
            <Ticket className="w-16 h-16 text-primary-foreground/80 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4">
              EVENTI
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
              Scopri gli appuntamenti, le iniziative e le esperienze che organizziamo per valorizzare il Sud Italia e costruire una community autentica
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cos'è EVENTI */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">Gli Eventi InSud</h2>
            <p className="text-muted-foreground leading-relaxed text-lg text-left">
              Ogni evento InSud è un'opportunità per incontrarsi, confrontarsi e celebrare la cultura del Sud Italia. Dal semplice aperitivo al workshop formativo, creiamo spazi di incontro dove studenti, professionisti e curiosi possono scambiare idee, progetti e passioni.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Prossimi Eventi - placeholder senza DB */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            Prossimi Eventi
          </motion.h2>

          <div className="text-center py-12 max-w-2xl mx-auto">
            <p className="text-muted-foreground text-lg mb-4">
              Al momento non ci sono eventi programmati.
            </p>
            <p className="text-muted-foreground">
              Torna a trovarci presto o seguici su Instagram per rimanere aggiornato sui prossimi appuntamenti!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Non perderti i prossimi eventi</h2>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
              Vuoi proporre una collaborazione, un'idea o semplicemente rimanere aggiornato? Unisciti a noi e fai parte della community InSud
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

export default Events;
