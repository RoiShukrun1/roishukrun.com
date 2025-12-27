import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  { name: "GCP", level: 75, category: "databases & cloud" },
  { name: "Redis", level: 75, category: "databases & cloud" },
  { name: "Docker", level: 70, category: "databases & cloud" },

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
  const [showAll, setShowAll] = useState(false);
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

  const filteredSkills = skills.filter(
    (skill) => skill.category === activeCategory
  );

  // Mobile-only limit (no hover devices): show first 5 cards, allow expand/collapse
  // Desktop/tablet always show all
  const MOBILE_VISIBLE_ITEMS = 5;
  const hasMoreItems = filteredSkills.length > MOBILE_VISIBLE_ITEMS;

  // Reset showAll when category changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setShowAll(false);
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="pt-24 pb-8 px-4 relative bg-secondary/30"
    >
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My{" "}
          <span className="text-primary">
            {" "}
            Skill
            <span
              className={cn("inline-block", isVisible && "animate-flip")}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              s
            </span>
          </span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, key) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(category)}
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
              className={cn(
                "group bg-card p-6 rounded-lg shadow-xs card-hover text-center relative overflow-hidden border border-border/60",
                // Mobile: hide items after the first 5 unless expanded; keep visible on sm+
                key >= MOBILE_VISIBLE_ITEMS && !showAll && "hidden sm:block"
              )}
            >
              {/* Purple accent line (hover) */}
              <span
                className={cn(
                  "pointer-events-none absolute inset-x-6 bottom-3 h-[2px] bg-gradient-to-r from-primary/0 via-primary to-primary/0 origin-center transition-all duration-500",
                  // Mobile: always visible + subtle pulse (no hover)
                  "opacity-70 scale-x-100 animate-[pulse-subtle_3s_ease-in-out_infinite]",
                  // >= sm: hover-only
                  "sm:opacity-0 sm:scale-x-0 sm:animate-none sm:group-hover:opacity-100 sm:group-hover:scale-x-100"
                )}
              />

              <div className="text-center">
                <h3 className="font-semibold text-lg">{skill.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {hasMoreItems && (
          <div className="text-center mt-8 sm:hidden">
            <button
              onClick={() => setShowAll(!showAll)}
              className="cosmic-button flex items-center gap-2 mx-auto"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show All <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
