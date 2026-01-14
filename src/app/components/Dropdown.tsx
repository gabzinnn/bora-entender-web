"use client";

import { type LucideIcon, ChevronDown, Check } from "lucide-react";
import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  type FocusEvent,
  useId,
} from "react";

type DropdownSize = "sm" | "md" | "lg";
type DropdownVariant = "default" | "error" | "success";

interface DropdownOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface DropdownProps {
  // Data
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;

  // Layout
  label?: string;
  helperText?: string;
  error?: string | boolean;
  size?: DropdownSize;
  variant?: DropdownVariant;
  fullWidth?: boolean;

  // Icons
  leftIcon?: LucideIcon;

  // Behavior
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;

  // Formik support
  name?: string;
  onChange?: (value: string, name?: string) => void;
  onBlur?: (e: FocusEvent<HTMLButtonElement>) => void;
  touched?: boolean;

  // Styling
  className?: string;
  containerClassName?: string;
  id?: string;
}

// Size styles
const sizeStyles: Record<DropdownSize, string> = {
  sm: "h-10 px-3 py-2 text-sm",
  md: "h-12 px-4 py-3 text-base",
  lg: "h-14 px-4 py-3.5 text-lg",
};

const labelSizes: Record<DropdownSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const iconSizes: Record<DropdownSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const iconContainerSizes: Record<DropdownSize, string> = {
  sm: "left-3",
  md: "left-4",
  lg: "left-4",
};

const inputPaddingWithLeftIcon: Record<DropdownSize, string> = {
  sm: "pl-9",
  md: "pl-11",
  lg: "pl-12",
};

const optionSizes: Record<DropdownSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-4 py-3.5 text-lg",
};

// Variant styles
const variantStyles: Record<DropdownVariant, string> = {
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

const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      // Data
      options,
      value,
      defaultValue,
      placeholder = "Selecione uma opção",

      // Layout
      label,
      helperText,
      error,
      size = "md",
      variant = "default",
      fullWidth = true,

      // Icons
      leftIcon: LeftIcon,

      // Behavior
      searchable = false,
      clearable = false,
      disabled = false,

      // Formik support
      name,
      onChange,
      onBlur,
      touched,

      // Styling
      className = "",
      containerClassName = "",
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Determine if there's an error to show
    const hasError = Boolean(error) || (touched && Boolean(error));
    const currentVariant = hasError ? "error" : variant;

    // Controlled vs uncontrolled value
    const currentValue = value !== undefined ? value : internalValue;

    // Get selected option
    const selectedOption = options.find((opt) => opt.value === currentValue);

    // Filter options based on search
    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // Has left icon
    const hasLeftIcon = Boolean(LeftIcon);

    // Generate unique ID
    const generatedId = useId();
    const dropdownId = id || name || generatedId;

    // Handle click outside to close
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Handle keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;

        switch (event.key) {
          case "Escape":
            setIsOpen(false);
            setSearchTerm("");
            break;
          case "ArrowDown":
            event.preventDefault();
            // Focus next option logic could be added here
            break;
          case "ArrowUp":
            event.preventDefault();
            // Focus previous option logic could be added here
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Toggle dropdown
    const handleToggle = useCallback(() => {
      if (!disabled) {
        setIsOpen((prev) => !prev);
        if (isOpen) {
          setSearchTerm("");
        }
      }
    }, [disabled, isOpen]);

    // Select option
    const handleSelect = useCallback(
      (optionValue: string) => {
        if (value === undefined) {
          setInternalValue(optionValue);
        }
        onChange?.(optionValue, name);
        setIsOpen(false);
        setSearchTerm("");
      },
      [onChange, name, value]
    );

    // Clear selection
    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (value === undefined) {
          setInternalValue("");
        }
        onChange?.("", name);
      },
      [onChange, name, value]
    );

    // Handle blur for Formik
    const handleBlur = useCallback(
      (e: FocusEvent<HTMLButtonElement>) => {
        // Delay to allow click on option
        setTimeout(() => {
          if (!containerRef.current?.contains(document.activeElement)) {
            onBlur?.(e);
          }
        }, 150);
      },
      [onBlur]
    );

    return (
      <div
        ref={containerRef}
        className={`relative flex flex-col gap-2 ${fullWidth ? "w-full" : ""} ${containerClassName}`}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={dropdownId}
            className={`text-text-primary font-medium ${labelSizes[size]} ${
              disabled ? "opacity-50" : ""
            }`}
          >
            {label}
          </label>
        )}

        {/* Dropdown Button */}
        <button
          ref={ref}
          id={dropdownId}
          type="button"
          onClick={handleToggle}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            relative w-full rounded-lg border bg-white
            text-left
            focus:outline-none focus:ring-4
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeStyles[size]}
            ${variantStyles[currentVariant]}
            ${hasLeftIcon ? inputPaddingWithLeftIcon[size] : ""}
            pr-10
            ${className}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {/* Left Icon */}
          {hasLeftIcon && LeftIcon && (
            <span
              className={`absolute ${iconContainerSizes[size]} top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none`}
            >
              <LeftIcon className={iconSizes[size]} />
            </span>
          )}

          {/* Selected Value or Placeholder */}
          <span
            className={`block truncate ${
              selectedOption ? "text-text-primary" : "text-text-secondary/60"
            }`}
          >
            {selectedOption ? (
              <span className="flex items-center gap-2">
                {selectedOption.icon && (
                  <selectedOption.icon className={iconSizes[size]} />
                )}
                {selectedOption.label}
              </span>
            ) : (
              placeholder
            )}
          </span>

          {/* Right Icons (Clear + Chevron) */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Clear Button */}
            {clearable && currentValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-gray-100"
              >
                <svg
                  className={iconSizes[size]}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Chevron */}
            <ChevronDown
              className={`${iconSizes[size]} text-text-secondary transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-border-light rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            role="listbox"
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-border-light">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full px-3 py-2 text-sm border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={`
                      w-full text-left flex items-center justify-between gap-2
                      transition-colors duration-150
                      ${optionSizes[size]}
                      ${
                        option.value === currentValue
                          ? "bg-primary/10 text-primary"
                          : "text-text-primary hover:bg-gray-50"
                      }
                      ${option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                    role="option"
                    aria-selected={option.value === currentValue}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {option.icon && <option.icon className={iconSizes[size]} />}
                      {option.label}
                    </span>

                    {/* Check Icon for Selected */}
                    {option.value === currentValue && (
                      <Check className={`${iconSizes[size]} text-primary shrink-0`} />
                    )}
                  </button>
                ))
              ) : (
                <div className={`text-text-secondary text-center ${optionSizes[size]}`}>
                  Nenhuma opção encontrada
                </div>
              )}
            </div>
          </div>
        )}

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

Dropdown.displayName = "Dropdown";

export { Dropdown, type DropdownProps, type DropdownOption, type DropdownSize, type DropdownVariant };