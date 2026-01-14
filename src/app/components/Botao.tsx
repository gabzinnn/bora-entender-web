import { type LucideIcon } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary hover:bg-primary-hover text-white",
  secondary: "bg-brand-red hover:bg-brand-red-hover text-white",
  danger: "bg-primary-alt hover:bg-primary-alt-hover text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-base gap-2",
  lg: "h-14 px-8 text-lg gap-2.5",
};

const iconSizes: Record<ButtonSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const Botao = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      isLoading = false,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          font-bold rounded-lg
          transition-all duration-200
          hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`} />
        ) : (
          <>
            {LeftIcon && <LeftIcon className={iconSizes[size]} />}
            {children}
            {RightIcon && <RightIcon className={iconSizes[size]} />}
          </>
        )}
      </button>
    );
  }
);

Botao.displayName = "Botao";

export { Botao, type ButtonProps, type ButtonVariant, type ButtonSize };