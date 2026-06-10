import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  open: boolean;
  onClose: () => void;
  animation?: "slide-up" | "slide-down" | "bounce";
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  open,
  onClose,
  animation = "bounce",
}) => {
  const [isVisible, setIsVisible] = React.useState(open);
  const [isClosing, setIsClosing] = React.useState(false);

  useEffect(() => {
    if (!open) {
      // If parent closes, play closing animation before removing.
      if (isVisible) {
        setIsClosing(true);
        const timer = setTimeout(() => setIsVisible(false), 250);
        return () => clearTimeout(timer);
      }
      return;
    }

    setIsVisible(true);
    setIsClosing(false);

    const startClose = window.setTimeout(() => setIsClosing(true), 800);
    const finishClose = window.setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 1000);

    return () => {
      clearTimeout(startClose);
      clearTimeout(finishClose);
    };
  }, [open, onClose, isVisible]);

  if (!isVisible) return null;

  let bg = "bg-green-600";
  if (type === "error") bg = "bg-red-600";
  if (type === "info") bg = "bg-blue-600";

  const animationKey = `${animation}`;
  const animationClass = isClosing
    ? `toast-out-${animationKey}`
    : `toast-in-${animationKey}`;

  // Ensure there's a single toast container where all toasts can stack by default.
  const containerId = "misscandle-toast-root";
  let toastContainer = typeof document !== "undefined" ? document.getElementById(containerId) : null;
  if (!toastContainer && typeof document !== "undefined") {
    toastContainer = document.createElement("div");
    toastContainer.id = containerId;
    // Use bottom positioning and reverse column so newer toasts appear at the bottom.
    toastContainer.className =
      "fixed top-16 right-6 z-50 flex flex-col-reverse gap-3 items-end";
    document.body.appendChild(toastContainer);
  }

  return createPortal(
    <div
      className={`min-w-60 max-w-xl px-6 py-3 rounded-xl shadow-lg text-white flex items-center gap-3 ${bg} ${animationClass}`}
    >
      <span className="text-xl">
        {type === "success" ? "✔" : type === "error" ? "✖" : "ℹ"}
      </span>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-white/80 hover:text-white text-lg"
      >
        ×
      </button>
      <style>{`
        @keyframes toast-in-bounce {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          60% {
            opacity: 1;
            transform: translateY(-4px) scale(1.03);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toast-out-bounce {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-16px) scale(0.95);
          }
        }

        @keyframes toast-in-slide-up {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes toast-out-slide-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-18px);
          }
        }

        @keyframes toast-in-slide-down {
          0% {
            opacity: 0;
            transform: translateY(-14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes toast-out-slide-down {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(18px);
          }
        }

        .toast-in-bounce {
          animation: toast-in-bounce 260ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .toast-out-bounce {
          animation: toast-out-bounce 220ms ease-in forwards;
        }

        .toast-in-slide-up {
          animation: toast-in-slide-up 220ms ease-out forwards;
        }

        .toast-out-slide-up {
          animation: toast-out-slide-up 220ms ease-in forwards;
        }

        .toast-in-slide-down {
          animation: toast-in-slide-down 220ms ease-out forwards;
        }

        .toast-out-slide-down {
          animation: toast-out-slide-down 220ms ease-in forwards;
        }
      `}</style>
    </div>,
    toastContainer ?? document.body
  );
};
