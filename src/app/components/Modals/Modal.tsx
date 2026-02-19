"use client";

import { type LucideIcon, X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { forwardRef, useCallback, useEffect, type ReactNode } from "react";
import { Botao, type ButtonVariant } from "../Botao";

type ModalType = "success" | "error" | "warning" | "info" | "custom";
type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl";

interface ModalButton {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  isLoading?: boolean;
}

interface ModalProps {
  // Visibility
  isOpen: boolean;
  onClose: () => void;

  // Content
  type?: ModalType;
  title?: string;
  message?: string | ReactNode;
  icon?: LucideIcon;

  // Layout
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;

  // Buttons
  buttons?: ModalButton[];
  primaryButton?: ModalButton;
  secondaryButton?: ModalButton;

  // Custom content
  children?: ReactNode;

  // Styling
  className?: string;
}

// Type configurations
const typeConfig: Record<ModalType, { icon: LucideIcon; iconColor: string; iconBg: string }> = {
  success: {
    icon: CheckCircle,
    iconColor: "text-primary-alt",
    iconBg: "bg-primary-alt/10",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-brand-red",
    iconBg: "bg-brand-red/10",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-brand-yellow",
    iconBg: "bg-brand-yellow/10",
  },
  info: {
    icon: Info,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  custom: {
    icon: Info,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
};

// Default button variants per type
const defaultButtonVariant: Record<ModalType, ButtonVariant> = {
  success: "primary",
  error: "secondary",
  warning: "secondary",
  info: "primary",
  custom: "primary",
};

// Size styles
const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  "2xl": "max-w-5xl",
};

const iconSizes: Record<ModalSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
  xl: "h-16 w-16",
  "2xl": "h-16 w-16",
};

const iconInnerSizes: Record<ModalSize, string> = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
  xl: "h-8 w-8",
  "2xl": "h-8 w-8",
};

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      // Visibility
      isOpen,
      onClose,

      // Content
      type = "info",
      title,
      message,
      icon: CustomIcon,

      // Layout
      size = "md",
      showCloseButton = true,
      closeOnBackdrop = true,
      closeOnEscape = true,

      // Buttons
      buttons,
      primaryButton,
      secondaryButton,

      // Custom content
      children,

      // Styling
      className = "",
    },
    ref
  ) => {
    // Get type configuration
    const config = typeConfig[type];
    const Icon = CustomIcon || config.icon;

    // Handle escape key
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    // Handle backdrop click
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
          onClose();
        }
      },
      [closeOnBackdrop, onClose]
    );

    // Build buttons array
    const allButtons: ModalButton[] = [];

    if (secondaryButton) {
      allButtons.push({
        ...secondaryButton,
        variant: secondaryButton.variant || "secondary",
      });
    }

    if (primaryButton) {
      allButtons.push({
        ...primaryButton,
        variant: primaryButton.variant || defaultButtonVariant[type],
      });
    }

    if (buttons) {
      allButtons.push(...buttons);
    }

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleBackdropClick}
        />

        {/* Modal Content */}
        <div
          className={`
            relative bg-white rounded-2xl shadow-xl
            w-full ${sizeStyles[size]}
            p-6 sm:p-8
            max-h-[90vh] overflow-y-auto
            animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300
            ${className}
          `}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Icon */}
          {type !== "custom" && (
            <div className="flex justify-center mb-4">
              <div
                className={`
                  ${iconSizes[size]} rounded-full flex items-center justify-center
                  ${config.iconBg}
                `}
              >
                <Icon className={`${iconInnerSizes[size]} ${config.iconColor}`} />
              </div>
            </div>
          )}

          {/* Title */}
          {title && (
            <h2
              id="modal-title"
              className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-2"
            >
              {title}
            </h2>
          )}

          {/* Message */}
          {message && (
            <div className="text-text-secondary text-center mb-6">
              {typeof message === "string" ? <p>{message}</p> : message}
            </div>
          )}

          {/* Custom Children */}
          {children && <div className="mb-6">{children}</div>}

          {/* Buttons */}
          {allButtons.length > 0 && (
            <div
              className={`
                flex gap-3
                ${allButtons.length === 1 ? "justify-center" : "justify-center sm:justify-end"}
                ${allButtons.length > 2 ? "flex-col sm:flex-row" : "flex-col-reverse sm:flex-row"}
              `}
            >
              {allButtons.map((button, index) => (
                <Botao
                  key={index}
                  variant={button.variant || "primary"}
                  size="md"
                  onClick={button.onClick || onClose}
                  isLoading={button.isLoading}
                  className={allButtons.length === 1 ? "w-full sm:w-auto min-w-30" : "flex-1 sm:flex-none sm:min-w-30]"}
                >
                  {button.label}
                </Botao>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

// ==========================================
// Hook para facilitar uso do Modal
// ==========================================

import { useState } from "react";

interface UseModalOptions {
  type?: ModalType;
  title?: string;
  message?: string | ReactNode;
  primaryButton?: ModalButton;
  secondaryButton?: ModalButton;
}

function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseModalOptions>({});

  const open = useCallback((opts?: UseModalOptions) => {
    if (opts) setOptions(opts);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const success = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    setOptions({
      type: "success",
      title,
      message,
      primaryButton: {
        label: "OK",
        onClick: () => {
          onConfirm?.();
          close();
        },
      },
    });
    setIsOpen(true);
  }, [close]);

  const error = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    setOptions({
      type: "error",
      title,
      message,
      primaryButton: {
        label: "Entendi",
        onClick: () => {
          onConfirm?.();
          close();
        },
      },
    });
    setIsOpen(true);
  }, [close]);

  const warning = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    setOptions({
      type: "warning",
      title,
      message,
      primaryButton: {
        label: "OK",
        onClick: () => {
          onConfirm?.();
          close();
        },
      },
    });
    setIsOpen(true);
  }, [close]);

  const confirm = useCallback(
    (title: string, message?: string, onConfirm?: () => void, onCancel?: () => void) => {
      setOptions({
        type: "warning",
        title,
        message,
        primaryButton: {
          label: "Confirmar",
          onClick: () => {
            onConfirm?.();
            close();
          },
        },
        secondaryButton: {
          label: "Cancelar",
          onClick: () => {
            onCancel?.();
            close();
          },
        },
      });
      setIsOpen(true);
    },
    [close]
  );

  return {
    isOpen,
    options,
    open,
    close,
    success,
    error,
    warning,
    confirm,
  };
}

export { Modal, useModal, type ModalProps, type ModalType, type ModalSize, type ModalButton };