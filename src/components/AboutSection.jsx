import { Brain, Layers, Workflow } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="pt-24 pb-8 px-4 relative">
      {" "}
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          About <span className="text-primary"> Me</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Full-Stack Developer</h3>

            <p className="text-muted-foreground">
              Currently working as a Software Engineer at K Health, contributing
              to flagship products through UI/UX, performance, and architectural
              improvements, and building scalable features used in production.
            </p>

            <p className="text-muted-foreground">
              Alongside product development, designs and develops end-to-end
              automation frameworks for complex workflows, with a strong focus
              on reliability, maintainability, and CI/CD integration. Experience
              spans JavaScript, Python, and Kotlin, using modern frameworks such
              as React and Node.js across the full stack.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#contact" className="cosmic-button">
                {" "}
                Get In Touch
              </a>

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
                    focus on scalability, reliability, and clean architecture.
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
                    workflows, improving system confidence, release safety, and
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
