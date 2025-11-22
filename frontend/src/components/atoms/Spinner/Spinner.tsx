import React from "react";

export interface SpinnerProps {
  /**
   * Size of the spinner
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Color variant
   */
  variant?: "primary" | "inverse" | "current";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Screen reader label
   */
  label?: string;
}

/**
 * Spinner component - Loading indicator
 *
 * @example
 * ```tsx
 * <Spinner size="md" variant="primary" label="Loading data..." />
 * ```
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  className = "",
  label = "Loading...",
}) => {
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const variantStyles = {
    primary: "text-brand-primary",
    inverse: "text-text-inverse",
    current: "text-current",
  };

  const combinedClassName = `${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <div className="inline-flex items-center justify-center" role="status" aria-label={label}>
      <svg
        className={`animate-spin ${combinedClassName}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

Spinner.displayName = "Spinner";
