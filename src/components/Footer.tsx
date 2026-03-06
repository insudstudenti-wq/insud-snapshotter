import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy-solid py-8 border-t border-navy-light/20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-primary-foreground/50 text-sm">
          © 2025 INSUD - Studenti per l'Innovazione del Sud
        </p>
        <a
          href="https://www.instagram.com/insud.bocconi/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"
        >
          <Instagram className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
