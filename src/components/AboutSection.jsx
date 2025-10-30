import { Briefcase, Code, User } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      {" "}
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          About <span className="text-primary"> Me</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Software Engineer & Full-Stack Developer
            </h3>

            <p className="text-muted-foreground">
              Currently working as a Software Engineer at K Health, where I
              enhance flagship products through major UI/UX, performance, and
              architectural upgrades. I specialize in transitioning services
              from REST to GraphQL and developing automated testing systems for
              AI platforms.
            </p>

            <p className="text-muted-foreground">
              With expertise in JavaScript, Python, Kotlin, and modern
              frameworks like React and Node.js, I build scalable applications
              that integrate AI components and manage real-time client-server
              interactions. I'm passionate about creating innovative solutions
              that enhance user experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#contact" className="cosmic-button">
                {" "}
                Get In Touch
              </a>

              <a
                href=""
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
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">
                    Full-Stack Development
                  </h4>
                  <p className="text-muted-foreground">
                    Building scalable applications with JavaScript, Python,
                    Kotlin, React, Node.js, and modern frameworks.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">AI Integration</h4>
                  <p className="text-muted-foreground">
                    Developing automated testing systems for AI platforms and
                    integrating ML components into applications.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>

                <div className="text-left">
                  <h4 className="font-semibold text-lg">
                    Architecture & Performance
                  </h4>
                  <p className="text-muted-foreground">
                    Transitioning services from REST to GraphQL, enhancing
                    performance, and implementing CI/CD pipelines.
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
