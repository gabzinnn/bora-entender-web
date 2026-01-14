"use client";

import { type LucideIcon, Eye, EyeOff } from "lucide-react";
import {
  type InputHTMLAttributes,
  forwardRef,
  useState,
  useCallback,
  useId,
  type ChangeEvent,
  type FocusEvent,
} from "react";

type InputSize = "sm" | "md" | "lg";
type InputVariant = "default" | "error" | "success";

interface MaskOptions {
  mask?: string; // Ex: "999.999.999-99" para CPF, "(99) 99999-9999" para telefone
  maskChar?: string; // Caractere placeholder (default: "_")
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  // Layout
  label?: string;
  helperText?: string;
  error?: string | boolean;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;

  // Icons
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;

  // Mask & Validation
  mask?: string;
  maskChar?: string;
  numericOnly?: boolean;
  alphaOnly?: boolean;
  maxLength?: number;

  // Password
  isPassword?: boolean;

  // Formik support
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  touched?: boolean;

  // Container className
  containerClassName?: string;
}

// Mask utility functions
const MASK_DEFINITIONS: Record<string, RegExp> = {
  "9": /[0-9]/,
  "a": /[a-zA-Z]/,
  "*": /[a-zA-Z0-9]/,
};

function applyMask(value: string, mask: string): string {
  if (!mask) return value;

  let maskedValue = "";
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    const maskChar = mask[i];
    const definition = MASK_DEFINITIONS[maskChar];

    if (definition) {
      // Find next valid character
      while (valueIndex < value.length) {
        const char = value[valueIndex];
        valueIndex++;
        if (definition.test(char)) {
          maskedValue += char;
          break;
        }
      }
    } else {
      // Fixed character in mask
      maskedValue += maskChar;
      if (value[valueIndex] === maskChar) {
        valueIndex++;
      }
    }
  }

  return maskedValue;
}

function removeMask(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}

// Size styles
const sizeStyles: Record<InputSize, string> = {
  sm: "h-10 px-3 py-2 text-sm",
  md: "h-12 px-4 py-3 text-base",
  lg: "h-14 px-4 py-3.5 text-lg",
};

const labelSizes: Record<InputSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const iconSizes: Record<InputSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const iconContainerSizes: Record<InputSize, string> = {
  sm: "left-3",
  md: "left-4",
  lg: "left-4",
};

const inputPaddingWithLeftIcon: Record<InputSize, string> = {
  sm: "pl-9",
  md: "pl-11",
  lg: "pl-12",
};

const inputPaddingWithRightIcon: Record<InputSize, string> = {
  sm: "pr-9",
  md: "pr-11",
  lg: "pr-12",
};

// Variant styles
const variantStyles: Record<InputVariant, string> = {
  default: `
    border-border-light
    focus:border-primary focus:ring-primary/20
  `,
  error: `
    border-brand-red
    focus:border-brand-red focus:ring-brand-red/20
  `,
  success: `
    border-primary-alt
    focus:border-primary-alt focus:ring-primary-alt/20
  `,
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      // Layout
      label,
      helperText,
      error,
      size = "md",
      variant = "default",
      fullWidth = true,

      // Icons
      leftIcon: LeftIcon,
      rightIcon: RightIcon,

      // Mask & Validation
      mask,
      maskChar = "_",
      numericOnly = false,
      alphaOnly = false,
      maxLength,

      // Password
      isPassword = false,
      type: typeProp = "text",

      // Formik support
      onChange,
      onBlur,
      touched,

      // Styling
      className = "",
      containerClassName = "",
      disabled,
      id,
      name,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState("");

    // Determine if there's an error to show
    const hasError = Boolean(error) || (touched && Boolean(error));
    const currentVariant = hasError ? "error" : variant;

    // Handle input type
    const inputType = isPassword ? (showPassword ? "text" : "password") : typeProp;

    // Determine if we have icons
    const hasLeftIcon = Boolean(LeftIcon);
    const hasRightIcon = Boolean(RightIcon) || isPassword;

    // Handle value change with mask and validation
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        // Apply numeric filter
        if (numericOnly) {
          newValue = newValue.replace(/[^0-9]/g, "");
        }

        // Apply alpha filter
        if (alphaOnly) {
          newValue = newValue.replace(/[^a-zA-Z\s]/g, "");
        }

        // Apply max length to raw value
        if (maxLength && !mask) {
          newValue = newValue.slice(0, maxLength);
        }

        // Apply mask
        if (mask) {
          const rawValue = removeMask(newValue);
          const limitedRaw = maxLength ? rawValue.slice(0, maxLength) : rawValue;
          newValue = applyMask(limitedRaw, mask);
        }

        // Update internal state for uncontrolled mode
        setInternalValue(newValue);

        // Create synthetic event with modified value
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: newValue,
            name: name || "",
          },
        } as ChangeEvent<HTMLInputElement>;

        onChange?.(syntheticEvent);
      },
      [mask, maxLength, numericOnly, alphaOnly, onChange, name]
    );

    // Handle blur for Formik
    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        onBlur?.(e);
      },
      [onBlur]
    );

    // Toggle password visibility
    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    // Determine display value (controlled vs uncontrolled)
    const displayValue = value !== undefined ? value : internalValue;

    // Generate unique ID if not provided
    const generatedId = useId();
    const inputId = id || name || generatedId;

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`text-text-primary font-medium ${labelSizes[size]} ${
              disabled ? "opacity-50" : ""
            }`}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && LeftIcon && (
            <div
              className={`absolute ${iconContainerSizes[size]} top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none`}
            >
              <LeftIcon className={iconSizes[size]} />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={inputType}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`
              w-full rounded-lg border bg-white
              text-text-primary placeholder:text-text-secondary/60
              focus:outline-none focus:ring-4
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${sizeStyles[size]}
              ${variantStyles[currentVariant]}
              ${hasLeftIcon ? inputPaddingWithLeftIcon[size] : ""}
              ${hasRightIcon ? inputPaddingWithRightIcon[size] : ""}
              ${className}
            `}
            {...props}
          />

          {/* Right Icon / Password Toggle */}
          {isPassword ? (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none`}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className={iconSizes[size]} />
              ) : (
                <Eye className={iconSizes[size]} />
              )}
            </button>
          ) : (
            hasRightIcon &&
            RightIcon && (
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none`}
              >
                <RightIcon className={iconSizes[size]} />
              </div>
            )
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || error) && (
          <p
            className={`text-sm ${
              hasError ? "text-brand-red" : "text-text-secondary"
            }`}
          >
            {typeof error === "string" ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps, type InputSize, type InputVariant };