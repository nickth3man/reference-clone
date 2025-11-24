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
    const baseStyles = "bg-surface-base transition-all duration-300 ease-out";

    const variantStyles = {
      default: "shadow-sm border border-slate-100/50",
      bordered: "border border-slate-200 shadow-sm",
      elevated: "shadow-md border-transparent",
    };

    const paddingStyles = {
      none: "",
      sm: "p-3",
      md: "p-5",
      lg: "p-8",
    };

    const roundedStyles = {
      sm: "rounded-lg",
      md: "rounded-xl",
      lg: "rounded-2xl",
      xl: "rounded-3xl",
    };

    const hoverStyles = hover
      ? "hover:shadow-xl hover:-translate-y-1 hover:border-orange-100/50"
      : "";

    const interactiveStyles =
      interactive || onClick
        ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:ring-offset-2 active:scale-[0.99]"
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
