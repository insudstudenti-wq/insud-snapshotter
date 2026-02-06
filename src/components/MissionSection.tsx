import { Heart, Lightbulb, Users } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    icon: Heart,
    title: "Passione per il Sud",
    description:
      "Crediamo nel potenziale del Meridione e lavoriamo per valorizzarlo attraverso iniziative concrete e innovative.",
  },
  {
    icon: Lightbulb,
    title: "Innovazione",
    description:
      "Sviluppiamo progetti che uniscono tradizione e modernità, creando nuove opportunità per il territorio.",
  },
  {
    icon: Users,
    title: "Comunità",
    description:
      "Costruiamo una rete di studenti e professionisti impegnati nella crescita del Sud Italia.",
  },
];

const MissionSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            La Nostra Missione
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Valorizzare il talento meridionale e creare opportunità di crescita
            attraverso l'innovazione e la collaborazione
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                <card.icon className="w-7 h-7 text-navy" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
