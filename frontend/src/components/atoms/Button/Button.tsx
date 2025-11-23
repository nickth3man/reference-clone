import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant
   */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Icon to display before children
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display after children
   */
  endIcon?: React.ReactNode;
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * Button component - Primary interaction element
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      startIcon,
      endIcon,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-brand-primary hover:bg-brand-dark text-text-inverse focus:ring-brand-primary shadow-sm",
      secondary:
        "bg-surface-darker hover:bg-surface-dark text-text-inverse focus:ring-surface-darker shadow-sm",
      ghost:
        "bg-transparent hover:bg-surface-elevated text-text-primary focus:ring-border-strong border border-border-default",
      danger:
        "bg-status-error hover:bg-red-700 text-text-inverse focus:ring-status-error shadow-sm",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-body-sm gap-1.5",
      md: "px-4 py-2 text-body gap-2",
      lg: "px-6 py-3 text-body-lg gap-2",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    return (
      <button ref={ref} className={combinedClassName} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
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
            <span>Loading...</span>
          </>
        ) : (
          <>
            {startIcon && <span aria-hidden="true">{startIcon}</span>}
            {children}
            {endIcon && <span aria-hidden="true">{endIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
