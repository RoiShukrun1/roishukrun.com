import { ArrowRight, ExternalLink, Github } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Flappy Bird 2.0 – AI & Multiplayer Edition",
    description:
      "Enhanced the classic game with AI opponents, multiplayer, authentication, and multiple gameplay modes. Built with Python, FastAPI, and NEAT for adaptive AI behavior.",
    image: "/projects/project1.png",
    tags: ["Python", "FastAPI", "NEAT", "AI", "Multiplayer"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "TechTube - YouTube Inspired Video Platform",
    description:
      "Full-stack web and mobile video-sharing platform with upload, user management, search, and authentication. Built with Node.js, MongoDB, React, and Kotlin.",
    image: "/projects/project2.png",
    tags: ["Node.js", "React", "Kotlin", "MongoDB", "Full-Stack"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "K Health Clinical AI Platform",
    description:
      "Enhanced flagship product through major UI/UX, performance, and architectural upgrades. Transitioned core services from REST to GraphQL and developed automated testing systems.",
    image: "/projects/project3.png",
    tags: ["GraphQL", "React", "Testing", "CI/CD", "AI"],
    demoUrl: "#",
    githubUrl: "#",
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {" "}
          Featured <span className="text-primary"> Projects </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, key) => (
            <div
              key={key}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1"> {project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href="https://github.com/RoiShukrun1"
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
