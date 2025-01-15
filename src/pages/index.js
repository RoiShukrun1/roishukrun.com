import HeroSection from "../components/sections/HeroSection";
import '../styles/global.css'; 
import Navbar from "../components/sections/Navbar";
import AboutSection from "../components/sections/AboutSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import EmailSection from "../components/sections/EmailSection";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <Navbar />
      <div className="container mt-24 mx-auto px-12 py-4">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <EmailSection />
      </div>
      <Footer />
    </main>
  );
}