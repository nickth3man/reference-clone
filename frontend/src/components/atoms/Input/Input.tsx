import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input variant/type styling
   */
  variant?: "default" | "search";
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Helper text to display below input
   */
  helperText?: string;
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;
  /**
   * Full width input
   */
  fullWidth?: boolean;
}

/**
 * Input component - Form input field with labels and error states
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   error={hasError}
 *   errorMessage="Please enter a valid email"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      error = false,
      errorMessage,
      helperText,
      label,
      startIcon,
      endIcon,
      fullWidth = false,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const baseStyles =
      "w-full bg-slate-50/50 border rounded-lg py-2.5 transition-all duration-200 outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary disabled:opacity-60 disabled:bg-slate-100 placeholder:text-slate-400";

    const variantStyles = {
      default: "px-4",
      search: "rounded-full px-5 bg-white shadow-sm hover:shadow-md focus:shadow-lg",
    };

    const iconPadding = {
      start: startIcon ? "pl-11" : "",
      end: endIcon ? "pr-11" : "",
    };

    const stateStyles = error
      ? "border-status-error focus:ring-status-error/20 focus:border-status-error text-text-primary"
      : "border-slate-200 hover:border-slate-300 text-text-primary";

    const widthStyles = fullWidth ? "w-full" : "";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${iconPadding.start} ${iconPadding.end} ${stateStyles} ${className}`;

    return (
      <div className={widthStyles}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-text-primary mb-1.5"
          >
            {label}
            {props.required && <span className="text-status-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-quaternary pointer-events-none">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={combinedClassName}
            aria-invalid={error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-quaternary pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>

        {error && errorMessage && (
          <p id={errorId} className="mt-1.5 text-body-sm text-status-error" role="alert">
            {errorMessage}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="mt-1.5 text-body-sm text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
