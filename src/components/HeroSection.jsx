import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { HeroBurstCanvas } from "./HeroBurstCanvas";

export const HeroSection = () => {
  const burstRef = useRef(null);
  const photoRef = useRef(null);
  const [primaryColor, setPrimaryColor] = useState(null);
  const [photoSize, setPhotoSize] = useState(0);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  useEffect(() => {
    const computePrimary = () => {
      if (typeof window === "undefined") return;
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();
      if (raw) setPrimaryColor(`hsl(${raw})`);
    };

    computePrimary();
    window.addEventListener("theme-change", computePrimary);

    const observer = new MutationObserver(computePrimary);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("theme-change", computePrimary);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!photoRef.current) return;
    const el = photoRef.current;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setPhotoSize(rect.width || 0);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const handlePhotoClick = () => {
    if (prefersReducedMotion) return;
    // Always burst from behind the center of the photo.
    // Spawn from a ring near the photo edge so particles immediately appear outside the mask.
    const r = Math.max(0, photoSize / 2 - 10);
    burstRef.current?.spawnBurst?.(0, 0, r);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 sm:pt-0"
    >
      <div className="container max-w-4xl mx-auto text-center relative z-0">
        <div className="space-y-6">
          {/* Circular Profile Photo */}
          <div className="flex justify-center mb-8">
            <div
              className="relative cursor-pointer"
              onPointerDown={handlePhotoClick}
              onClick={handlePhotoClick}
            >
              <img
                ref={photoRef}
                src="/LinkedIn photo.jpeg"
                alt="Profile Photo"
                className="w-52 h-52 md:w-60 md:h-60 rounded-full object-cover border-4 border-primary/20 shadow-2xl opacity-0 animate-fade-in"
              />
              {/* Overlay gradient (visual only; must not block pointer events) */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />

              {/* Burst particles: render in a larger overlay, masked so particles only show OUTSIDE the circular photo.
                  This makes them feel like they pop from behind the image and spread around it. */}
              <div
                className="absolute -inset-17 pointer-events-none z-10 rounded-full overflow-hidden"
                style={{
                  WebkitMaskImage:
                    photoSize > 0
                      ? `radial-gradient(circle at center, transparent 0 ${
                          photoSize / 2 + 6
                        }px, black ${photoSize / 2 + 14}px, black 100%)`
                      : undefined,
                  maskImage:
                    photoSize > 0
                      ? `radial-gradient(circle at center, transparent 0 ${
                          photoSize / 2 + 6
                        }px, black ${photoSize / 2 + 14}px, black 100%)`
                      : undefined,
                }}
              >
                <HeroBurstCanvas
                  ref={burstRef}
                  className="absolute inset-0 pointer-events-none"
                  color={primaryColor}
                  particleCount={18}
                />
              </div>
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
            products, solving complex problems and exploring new technologies.
          </p>

          <div className="pt-4 pb-20 sm:pb-4 opacity-0 animate-fade-in-delay-4">
            <Link to="/projects" className="cosmic-button">
              View My Work
            </Link>
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
