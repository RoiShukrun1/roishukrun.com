import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "Home", to: "/home" },
  { name: "About", to: "/about" },
  { name: "Projects", to: "/projects" },
  { name: "Skills", to: "/skills" },
  { name: "Contact", to: "/contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);
  return (
    <>
      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          isScrolled
            ? "py-3 bg-background/80 backdrop-blur-md shadow-xs"
            : "py-5 md:bg-transparent bg-background/80 backdrop-blur-md"
        )}
      >
        <div className="container flex items-center justify-between gap-3 px-3 sm:px-8">
          <Link
            className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2 min-w-0"
            to="/home"
          >
            <img
              src="/logo3.png"
              alt="Roi Shukrun logo"
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0"
            />
            <span className="relative z-10 truncate">
              <span className="text-glow text-foreground"> Roi Shukrun </span>{" "}
              <span className="hidden xs:inline">Portfolio</span>
            </span>
          </Link>

          {/* desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, key) => (
              <Link
                key={key}
                to={item.to}
                className="text-foreground/80 hover:text-primary transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* mobile nav */}
          <div className="md:hidden flex items-center gap-2 shrink-0 relative z-[70]">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 text-foreground"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}{" "}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Outside nav to avoid container constraints */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-md z-[60] flex flex-col items-center justify-center",
          "transition-all duration-300 md:hidden",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <button
          type="button"
          aria-label="Close Menu"
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-5 right-5 p-2 text-foreground"
        >
          <X size={28} />
        </button>
        <div className="flex flex-col space-y-8 text-xl items-center">
          {navItems.map((item, key) => (
            <Link
              key={key}
              to={item.to}
              className="text-foreground/80 hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};
