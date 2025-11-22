import React from "react";

export interface BadgeProps {
  /**
   * Visual style variant
   */
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Badge content
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Badge component - Status and category indicator
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="sm">Active</Badge>
 * <Badge variant="error">Inactive</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  children,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap";

  const variantStyles = {
    default: "bg-surface-elevated text-text-secondary border border-border-default",
    primary: "bg-brand-primary text-text-inverse",
    success: "bg-status-success-light text-green-700",
    warning: "bg-status-warning-light text-yellow-700",
    error: "bg-status-error-light text-red-700",
    info: "bg-status-info-light text-blue-700",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-caption",
    md: "px-2.5 py-1 text-body-sm",
    lg: "px-3 py-1.5 text-body",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return <span className={combinedClassName}>{children}</span>;
};

Badge.displayName = "Badge";
