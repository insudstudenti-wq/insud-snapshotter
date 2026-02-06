import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24 bg-navy-gradient text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Entra a Far Parte del Cambiamento
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-10">
            Unisciti a noi e contribuisci all'innovazione del Sud. Insieme possiamo fare la differenza!
          </p>
          <a href="https://forms.gle/tkzeKBqUbc6Ltkzt9" target="_blank" rel="noopener noreferrer">
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
  );
};

export default CTASection;
