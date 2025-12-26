import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-6 px-4 bg-card relative border-t border-border mt-8 flex justify-center items-center">
      <Link
        to="/home"
        className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
      >
        <ArrowUp size={20} />
      </Link>
    </footer>
  );
};
