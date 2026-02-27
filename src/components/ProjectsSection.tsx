import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import aperinsudLogo from "@/assets/aperinsud-logo.png";
import luminaLogo from "@/assets/lumina-logo.png";
import conferenzaBanner from "@/assets/conferenza-banner.png";

const projects = [
  {
    image: aperinsudLogo,
    title: "AperInsud",
    description:
      "Aperitivi a tema sud con cibo tipico per finanziare l'associazione e creare momenti di aggregazione e networking tra studenti.",
    link: "/aperinsud",
    isInternal: true,
    darkBg: true,
  },
  {
    image: luminaLogo,
    title: "LUMINA",
    description:
      "La nostra redazione di articoli online con serie dedicate a storie di successo e tematiche legate all'innovazione del Sud.",
    link: "/lumina",
    isInternal: true,
    darkBg: true,
  },
  {
    image: conferenzaBanner,
    title: "Conferenza: Private Equity & Venture Capital",
    description:
      "Un evento per esplorare come il capitale può accelerare lo sviluppo del Sud Italia. Il ruolo del Private Equity e del Venture Capital nella crescita del Mezzogiorno.",
    link: "https://conference-seat-booker.lovable.app/",
    isInternal: false,
    darkBg: false,
    meta: {
      date: "26 Novembre 2025 - ore 18:30",
      location: "Università Bocconi, Via Sarfatti 25 - Aula 35",
    },
  },
];

const ProjectsSection = () => {
  return (
    <section id="progetti" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            I Nostri Progetti
          </h2>
          <p className="text-muted-foreground text-lg">
            Scopri le iniziative che realizziamo per il Sud
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, i) => {
            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div
                  className={`h-48 flex items-center justify-center p-6 ${
                    project.darkBg ? "bg-navy-gradient" : "bg-muted"
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="max-h-full max-w-[70%] object-contain"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>
                  {project.meta && (
                    <div className="space-y-1 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{project.meta.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{project.meta.location}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sky text-sm font-semibold group-hover:gap-2 transition-all">
                    Scopri di più <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );

            if (project.isInternal) {
              return (
                <Link key={project.title} to={project.link}>
                  {CardContent}
                </Link>
              );
            }
            return (
              <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer">
                {CardContent}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
