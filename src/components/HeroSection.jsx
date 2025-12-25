import { ArrowDown } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 sm:pt-0"
    >
      <div className="container max-w-4xl mx-auto text-center relative z-0">
        <div className="space-y-6">
          {/* Circular Profile Photo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src="/LinkedIn photo.jpeg"
                alt="Profile Photo"
                className="w-52 h-52 md:w-60 md:h-60 rounded-full object-cover border-4 border-primary/20 shadow-2xl opacity-0 animate-fade-in"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="opacity-0 animate-fade-in"> Hi, I'm</span>
            <span className="text-primary opacity-0 animate-fade-in-delay-1">
              {" "}
              Roi
            </span>
            <span className="text-gradient ml-2 opacity-0 animate-fade-in-delay-2">
              {" "}
              Shukrun
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-2-2xl mx-auto opacity-0 animate-fade-in-delay-3">
            Software Engineer and Computer Science graduate focused on
            full-stack development. Passionate about building impactful
            products, solving complex problems, and exploring new technologies.
          </p>

          <div className="pt-4 pb-20 sm:pb-4 opacity-0 animate-fade-in-delay-4">
            <a href="#projects" className="cosmic-button">
              View My Work
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce z-0">
        <span className="text-sm text-muted-foreground mb-2"> Scroll </span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  );
};
