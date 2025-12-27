import {
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

const MAX_MESSAGES_PER_EMAIL = 3;
const RATE_LIMIT_WINDOW_HOURS = 30 * 24; // 30 days (1 month)
const STORAGE_KEY = "contact_form_submissions";

// Utility functions for rate limiting
const getMessageHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveMessageHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save message history:", error);
  }
};

const checkRateLimit = (email) => {
  const history = getMessageHistory();
  const emailKey = email.toLowerCase().trim();
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000;

  if (!history[emailKey]) {
    return { allowed: true, remaining: MAX_MESSAGES_PER_EMAIL };
  }

  const emailData = history[emailKey];
  const timeSinceFirstMessage = now - emailData.firstMessageTime;

  // Reset if a month has passed
  if (timeSinceFirstMessage >= windowMs) {
    return { allowed: true, remaining: MAX_MESSAGES_PER_EMAIL };
  }

  const messageCount = emailData.count || 0;
  const remaining = Math.max(0, MAX_MESSAGES_PER_EMAIL - messageCount);

  return {
    allowed: messageCount < MAX_MESSAGES_PER_EMAIL,
    remaining,
    resetTime: emailData.firstMessageTime + windowMs,
  };
};

const recordMessage = (email) => {
  const history = getMessageHistory();
  const emailKey = email.toLowerCase().trim();
  const now = Date.now();

  if (!history[emailKey]) {
    history[emailKey] = {
      count: 1,
      firstMessageTime: now,
    };
  } else {
    history[emailKey].count += 1;
    // Keep the first message time for the monthly window
  }

  saveMessageHistory(history);
};

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.3) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.3,
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

  // Check rate limit when email changes
  useEffect(() => {
    if (formData.email) {
      const limit = checkRateLimit(formData.email);
      setRateLimitInfo(limit);
    } else {
      setRateLimitInfo(null);
    }
  }, [formData.email]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "message":
        if (!value.trim()) {
          error = "Message is required";
        } else if (value.trim().length < 10) {
          error = "Message must be at least 10 characters";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);

    // Mark all fields as touched
    const newTouched = { name: true, email: true, message: true };
    setTouched(newTouched);

    // Validate all fields
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Check rate limit before proceeding
    const limitCheck = checkRateLimit(formData.email);
    if (!limitCheck.allowed) {
      const resetDate = new Date(limitCheck.resetTime);
      const resetTime = resetDate.toLocaleString();
      toast({
        title: "Message limit reached",
        description: `You've reached the limit of ${MAX_MESSAGES_PER_EMAIL} messages per month. Please try again after ${resetTime}.`,
        variant: "destructive",
      });
      return;
    }

    // Get EmailJS credentials from environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast({
        title: "Configuration Error",
        description:
          "Email service is not properly configured. Please check your environment variables.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: "roishukrun8@gmail.com",
        },
        publicKey
      );

      // Record the message after successful send
      recordMessage(formData.email);

      setIsSuccess(true);
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      // Update rate limit info
      const updatedLimit = checkRateLimit(formData.email);
      setRateLimitInfo(updatedLimit);

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setErrors({
        name: "",
        email: "",
        message: "",
      });
      setTouched({
        name: false,
        email: false,
        message: false,
      });

      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Failed to send message",
        description:
          "Something went wrong. Please try again later or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section
      id="contact"
      ref={sectionRef}
      className="pt-24 pb-4 px-4 relative bg-secondary/30 overflow-hidden"
    >
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center relative">
          <span className="inline-block">
            {"Get In ".split("").map((char, index) => (
              <span
                key={index}
                className={cn(
                  "inline-block transition-all duration-500 ease-out",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="text-primary inline-block">
            {"Touch".split("").map((char, index) => (
              <span
                key={index}
                className={cn(
                  "inline-block transition-all duration-500 ease-out",
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-75"
                )}
                style={{
                  transitionDelay: `${(index + 4) * 50}ms`,
                }}
              >
                {char}
              </span>
            ))}
            {/* Mail icon right next to Touch */}
            <Mail
              className={cn(
                "inline-block ml-2 text-primary/40 transition-all duration-1000 ease-out align-middle",
                isVisible
                  ? "opacity-100 translate-y-0 animate-float"
                  : "opacity-0 -translate-y-4"
              )}
              size={28}
              style={{
                transitionDelay: "600ms",
              }}
            />
          </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Feel free to reach out.
          I'm always open to discussing new opportunities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">
              {" "}
              Contact Information
            </h3>

            <div className="space-y-6 justify-center text-left">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex flex-col gap-1">
                  <h4 className="font-medium leading-tight">Email</h4>
                  <a
                    href="mailto:roishukrun8@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors leading-tight"
                  >
                    roishukrun8@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex flex-col gap-1">
                  <h4 className="font-medium leading-tight">Phone</h4>
                  <a
                    href="tel:+972543351584"
                    className="text-muted-foreground hover:text-primary transition-colors leading-tight"
                  >
                    +972-54-335-1584
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex flex-col gap-1">
                  <h4 className="font-medium leading-tight">Location</h4>
                  <span className="text-muted-foreground leading-tight">
                    Tel Aviv, Israel
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="font-medium mb-4"> Connect With Me</h4>
              <div className="flex space-x-4 justify-center">
                <a
                  href="https://linkedin.com/in/roi-shukrun"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin />
                </a>
                <a
                  href="https://github.com/RoiShukrun1"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-xs">
            <h3 className="text-2xl font-semibold mb-6"> Send a Message</h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Success indicator */}
              {isSuccess && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Message sent successfully! I'll get back to you soon.
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-background transition-all duration-200 focus:outline-none focus:ring-2",
                      errors.name
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : touched.name && !errors.name
                        ? "border-green-500/50 focus:ring-green-500/50 focus:border-green-500"
                        : "border-input focus:ring-primary focus:border-primary"
                    )}
                    placeholder="John Doe..."
                  />
                  {touched.name && !errors.name && formData.name && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                  {errors.name && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Your Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-background transition-all duration-200 focus:outline-none focus:ring-2",
                      errors.email
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : touched.email && !errors.email
                        ? "border-green-500/50 focus:ring-green-500/50 focus:border-green-500"
                        : "border-input focus:ring-primary focus:border-primary"
                    )}
                    placeholder="john@gmail.com"
                  />
                  {touched.email && !errors.email && formData.email && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                  {errors.email && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Your Message
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    rows={5}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-background transition-all duration-200 focus:outline-none focus:ring-2 resize-none",
                      errors.message
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : touched.message && !errors.message
                        ? "border-green-500/50 focus:ring-green-500/50 focus:border-green-500"
                        : "border-input focus:ring-primary focus:border-primary"
                    )}
                    placeholder="Hello, I'd like to talk about..."
                  />
                  {touched.message && !errors.message && formData.message && (
                    <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                  )}
                  {errors.message && (
                    <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                  )}
                </div>
                {errors.message && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting || (rateLimitInfo && !rateLimitInfo.allowed)
                }
                className={cn(
                  "cosmic-button w-full flex items-center justify-center gap-2 transition-all duration-300",
                  rateLimitInfo &&
                    !rateLimitInfo.allowed &&
                    "opacity-50 cursor-not-allowed",
                  isSuccess && "bg-green-500 hover:bg-green-600"
                )}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={16} />
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
