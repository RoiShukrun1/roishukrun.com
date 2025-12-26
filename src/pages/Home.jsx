import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { SkillsSection } from "../components/SkillsSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, ""); // trim trailing slash

    const pathToId = {
      "": "home",
      "/": "home",
      "/home": "home",
      "/about": "about",
      "/skills": "skills",
      "/projects": "projects",
      "/contact": "contact",
    };

    const targetId = pathToId[path] ?? "home";

    // Wait for layout before scrolling
    requestAnimationFrame(() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0 });
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
