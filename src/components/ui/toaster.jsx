import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const getIcon = () => {
          if (variant === "destructive") {
            return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />;
          }
          if (title?.toLowerCase().includes("sent") || title?.toLowerCase().includes("success")) {
            return <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />;
          }
          return <Info className="h-5 w-5 text-primary flex-shrink-0" />;
        };

        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="flex items-start gap-3 flex-1">
              {getIcon()}
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
