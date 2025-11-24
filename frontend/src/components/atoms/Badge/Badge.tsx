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
    default: "bg-slate-100 text-slate-600 border border-slate-200",
    primary: "bg-orange-50 text-orange-700 border border-orange-100",
    success: "bg-green-50 text-green-700 border border-green-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    error: "bg-red-50 text-red-700 border border-red-100",
    info: "bg-blue-50 text-blue-700 border border-blue-100",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px] uppercase tracking-wider font-bold",
    md: "px-3 py-1 text-xs font-semibold",
    lg: "px-4 py-1.5 text-sm font-semibold",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return <span className={combinedClassName}>{children}</span>;
};

Badge.displayName = "Badge";
