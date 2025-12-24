import { useState } from "react";
import { cn } from "@/lib/utils";

const skills = [
  // Programming Languages
  { name: "JavaScript", level: 90, category: "languages" },
  { name: "TypeScript", level: 90, category: "languages" },
  { name: "Kotlin", level: 90, category: "languages" },
  { name: "Python", level: 85, category: "languages" },
  { name: "Java", level: 85, category: "languages" },
  { name: "C", level: 80, category: "languages" },
  { name: "C++", level: 75, category: "languages" },
  { name: "C#", level: 75, category: "languages" },
  { name: "SQL", level: 75, category: "languages" },
  { name: "Bash", level: 70, category: "languages" },

  // Frameworks & Libraries
  { name: "React", level: 90, category: "frameworks" },
  { name: "Node.js", level: 90, category: "frameworks" },
  { name: "FastAPI", level: 85, category: "frameworks" },
  { name: "Micronaut", level: 85, category: "frameworks" },
  { name: "Express.js", level: 80, category: "frameworks" },
  { name: "Next.js", level: 80, category: "frameworks" },
  { name: "Tailwind CSS", level: 70, category: "frameworks" },
  { name: "Vite", level: 70, category: "frameworks" },
  { name: "Vue.js", level: 70, category: "frameworks" },
  { name: "Zustand", level: 70, category: "frameworks" },

  // Databases & Cloud
  { name: "PostgreSQL", level: 90, category: "databases & cloud" },
  { name: "MongoDB", level: 90, category: "databases & cloud" },
  { name: "Prisma", level: 80, category: "databases & cloud" },
  { name: "Redis", level: 75, category: "databases & cloud" },
  { name: "Docker", level: 70, category: "databases & cloud" },
  { name: "Kubernetes", level: 50, category: "databases & cloud" },

  // Automation & Testing
  { name: "Playwright", level: 90, category: "automation & testing" },
  { name: "Postman", level: 90, category: "automation & testing" },
  { name: "Allure", level: 85, category: "automation & testing" },
  { name: "JUnit", level: 85, category: "automation & testing" },
  { name: "BrowserStack", level: 80, category: "automation & testing" },
  { name: "Appium", level: 70, category: "automation & testing" },

  // Tools
  { name: "Git", level: 95, category: "tools" },
  { name: "Figma", level: 90, category: "tools" },
  { name: "GraphQL", level: 85, category: "tools" },
  { name: "PubSub", level: 80, category: "tools" },
  { name: "Android Studio", level: 75, category: "tools" },
  { name: "Xcode", level: 75, category: "tools" },
];

const categories = [
  "languages",
  "frameworks",
  "databases & cloud",
  "automation & testing",
  "tools",
];

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("languages");

  const filteredSkills = skills.filter(
    (skill) => skill.category === activeCategory
  );
  return (
    <section id="skills" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary"> Skills</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-5 py-2 rounded-full transition-colors duration-300 capitalize",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/70 text-forefround hover:bd-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, key) => (
            <div
              key={key}
              className="bg-card p-6 rounded-lg shadow-xs card-hover"
            >
              <div className="text-left mb-4">
                <h3 className="font-semibold text-lg"> {skill.name}</h3>
              </div>
              <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full origin-left animate-[grow_1.5s_ease-out]"
                  style={{ width: skill.level + "%" }}
                />
              </div>

              <div className="text-right mt-1">
                <span className="text-sm text-muted-foreground">
                  {skill.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
