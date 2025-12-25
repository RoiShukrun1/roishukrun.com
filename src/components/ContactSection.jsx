import { Linkedin, Mail, MapPin, Phone, Send, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  // Check rate limit when email changes
  useEffect(() => {
    if (formData.email) {
      const limit = checkRateLimit(formData.email);
      setRateLimitInfo(limit);
    } else {
      setRateLimitInfo(null);
    }
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      toast({
        title: "Message sent!",
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
    <section id="contact" className="pt-24 pb-4 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Get In <span className="text-primary"> Touch</span>
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

            <div className="space-y-6 justify-center">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />{" "}
                </div>
                <div>
                  <h4 className="font-medium"> Email</h4>
                  <a
                    href="mailto:roishukrun8@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    roishukrun8@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />{" "}
                </div>
                <div>
                  <h4 className="font-medium"> Phone</h4>
                  <a
                    href="tel:+972543351584"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +972-54-335-1584
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />{" "}
                </div>
                <div>
                  <h4 className="font-medium"> Location</h4>
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Tel Aviv, Israel
                  </a>
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
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  {" "}
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                  placeholder="John Doe..."
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  {" "}
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                  placeholder="john@gmail.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  {" "}
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary resize-none"
                  placeholder="Hello, I'd like to talk about..."
                />
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting || (rateLimitInfo && !rateLimitInfo.allowed)
                }
                className={cn(
                  "cosmic-button w-full flex items-center justify-center gap-2",
                  rateLimitInfo &&
                    !rateLimitInfo.allowed &&
                    "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
