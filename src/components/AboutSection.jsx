import { Brain, Layers, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if section is at least 30% visible
          if (entry.intersectionRatio >= 0.3) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% visible
        rootMargin: "0px",
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="pt-24 pb-8 px-4 relative">
      {" "}
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center relative inline-block px-2">
          <span className="relative z-10">About </span>
          <span className="text-primary relative z-10"> Me</span>
          <span
            className={cn(
              "absolute top-1/2 left-0 -translate-y-1/2 h-8 bg-purple-200/20 dark:bg-purple-300/20 transition-all duration-1500 ease-out pointer-events-none z-0",
              isVisible ? "w-full opacity-100" : "w-0 opacity-0"
            )}
            style={{
              clipPath:
                "polygon(0% 20%, 5% 0%, 15% 10%, 25% 5%, 35% 15%, 45% 8%, 55% 12%, 65% 6%, 75% 14%, 85% 4%, 95% 10%, 100% 18%, 98% 100%, 2% 100%)",
              filter: "blur(1px)",
            }}
          />
          <span
            className={cn(
              "absolute top-1/2 left-0 -translate-y-1/2 h-7 bg-purple-200/30 dark:bg-purple-300/30 transition-all duration-1500 ease-out pointer-events-none z-0",
              isVisible ? "w-full opacity-100" : "w-0 opacity-0"
            )}
            style={{
              clipPath:
                "polygon(2% 25%, 7% 5%, 17% 15%, 27% 8%, 37% 18%, 47% 10%, 57% 14%, 67% 8%, 77% 16%, 87% 6%, 97% 12%, 98% 25%, 96% 100%, 4% 100%)",
              transitionDelay: "75ms",
            }}
          />
          <span
            className={cn(
              "absolute top-1/2 left-0 -translate-y-1/2 h-6 bg-purple-200/40 dark:bg-purple-300/40 transition-all duration-1500 ease-out pointer-events-none z-0",
              isVisible ? "w-full opacity-100" : "w-0 opacity-0"
            )}
            style={{
              clipPath:
                "polygon(3% 30%, 8% 10%, 18% 20%, 28% 12%, 38% 22%, 48% 14%, 58% 18%, 68% 12%, 78% 20%, 88% 10%, 96% 16%, 97% 30%, 95% 100%, 5% 100%)",
              transitionDelay: "150ms",
            }}
          />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Full-Stack Developer</h3>

            <p className="text-muted-foreground">
              Currently working as a Software Engineer at K Health, contributing
              to flagship products through UI/UX, performance and architectural
              improvements.
            </p>

            <p className="text-muted-foreground">
              Alongside product development, designs and develops end-to-end
              automation frameworks for complex workflows, with a strong focus
              on reliability, maintainability, and CI/CD integration. Experience
              spans JavaScript, Python, Kotlin and more, using modern frameworks
              such as React and Node.js across the full stack.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Link to="/contact" className="cosmic-button">
                {" "}
                Get In Touch
              </Link>

              <a
                href="/Roi_Shukrun_Resume_2025.pdf"
                download="Roi_Shukrun_Resume_2025.pdf"
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                Download CV
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">
                    Production Engineering
                  </h4>
                  <p className="text-muted-foreground">
                    Building and maintaining production-grade services with a
                    focus on scalability, reliability and clean architecture.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Workflow className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">
                    Test Automation & QE
                  </h4>
                  <p className="text-muted-foreground">
                    Designing end-to-end automation frameworks for complex
                    workflows, improving system confidence, release safety and
                    CI/CD efficiency.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>

                <div className="text-left">
                  <h4 className="font-semibold text-lg">AI & ML Systems</h4>
                  <p className="text-muted-foreground">
                    Strong interest in machine learning and AI systems, with
                    hands-on experience integrating intelligent components and
                    agents into real products and engineering workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
