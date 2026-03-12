import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import insudLogo from "@/assets/insud-logo-white.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "AperInsud", to: "/aperinsud" },
  { label: "LUMINA", to: "/lumina" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-navy-light/20">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={insudLogo} alt="INSUD Logo" className="h-10 w-auto" />
          <div>
            <span className="text-primary-foreground font-bold text-lg tracking-tight">INSUD</span>
            <p className="text-primary-foreground/60 text-[10px] leading-tight -mt-0.5">
              Studenti per l'Innovazione del Sud
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-primary-foreground"
                  : "text-primary-foreground/60 hover:text-primary-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/insud.bocconi/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://forms.gle/mSLxxMW1ooQmPK2y8" target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              className="bg-primary-foreground text-navy hover:bg-primary-foreground/90 font-semibold rounded-full px-5"
            >
              Unisciti a Noi
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy border-t border-navy-light/20 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://forms.gle/mSLxxMW1ooQmPK2y8"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2"
          >
            <Button className="w-full bg-primary-foreground text-navy hover:bg-primary-foreground/90 font-semibold rounded-full">
              Unisciti a Noi
            </Button>
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
