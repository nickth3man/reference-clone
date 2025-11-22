import React from "react";

export interface CardProps {
  /**
   * Visual style variant
   */
  variant?: "default" | "bordered" | "elevated";
  /**
   * Padding size
   */
  padding?: "none" | "sm" | "md" | "lg";
  /**
   * Border radius size
   */
  rounded?: "sm" | "md" | "lg" | "xl";
  /**
   * Enable hover effect
   */
  hover?: boolean;
  /**
   * Enable interactive styles (clickable)
   */
  interactive?: boolean;
  /**
   * Card content
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler (makes card interactive)
   */
  onClick?: () => void;
}

/**
 * Card component - Container for content grouping
 *
 * @example
 * ```tsx
 * <Card variant="bordered" padding="md" hover>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      rounded = "lg",
      hover = false,
      interactive = false,
      children,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles = "bg-surface-base transition-all duration-base";

    const variantStyles = {
      default: "shadow-card-sm",
      bordered: "border border-border-light shadow-card-sm",
      elevated: "shadow-card-md",
    };

    const paddingStyles = {
      none: "",
      sm: "p-card-sm",
      md: "p-card",
      lg: "p-card-lg",
    };

    const roundedStyles = {
      sm: "rounded-card",
      md: "rounded-card-lg",
      lg: "rounded-card-xl",
      xl: "rounded-3xl",
    };

    const hoverStyles = hover
      ? "hover:shadow-card-md hover:border-brand-light"
      : "";

    const interactiveStyles =
      interactive || onClick
        ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        : "";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${roundedStyles[rounded]} ${hoverStyles} ${interactiveStyles} ${className}`;

    const Component = onClick ? "button" : "div";

    return (
      <Component
        ref={ref as any}
        className={combinedClassName}
        onClick={onClick}
        {...(onClick && { type: "button", role: "button" })}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";
