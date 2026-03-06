import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-navy-gradient opacity-80" />

      <div className="relative z-10 container mx-auto px-4 text-center pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground leading-tight mb-6"
        >
          Innovazione che parte{" "}
          <br />
          dal <span className="text-gradient">Sud</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-primary-foreground/75 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Un'associazione studentesca dedicata alla crescita e allo sviluppo del
          Meridione attraverso progetti innovativi e collaborazione.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="https://forms.gle/mSLxxMW1ooQmPK2y8" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-primary-foreground text-navy hover:bg-primary-foreground/90 font-semibold rounded-full px-8 gap-2"
            >
              Unisciti a Noi <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <a href="#progetti">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-8 font-semibold"
            >
              Scopri i Nostri Progetti
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
