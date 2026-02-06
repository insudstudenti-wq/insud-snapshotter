import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Wine, Users, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Utensils,
    title: "Cibo Tipico",
    description: "Prodotti e ricette tradizionali del Sud Italia selezionati con cura.",
  },
  {
    icon: Users,
    title: "Networking",
    description: "Momenti di incontro e connessione tra studenti e professionisti.",
  },
  {
    icon: Wine,
    title: "Aggregazione",
    description: "Serate conviviali per costruire relazioni e sostenere la nostra causa.",
  },
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

      {/* Content */}
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

      <Footer />
    </div>
  );
};

export default AperInsud;
