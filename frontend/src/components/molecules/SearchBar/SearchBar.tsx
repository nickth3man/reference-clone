import React, { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/atoms";

export interface SearchBarProps {
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Initial search query value
   */
  initialValue?: string;
  /**
   * Search endpoint path
   */
  searchPath?: string;
  /**
   * Variant styling
   */
  variant?: "default" | "search";
  /**
   * Full width search bar
   */
  fullWidth?: boolean;
  /**
   * Callback when search is submitted
   */
  onSearch?: (query: string) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SearchBar molecule component - Combines Input with search functionality
 *
 * @example
 * ```tsx
 * <SearchBar
 *   placeholder="Search players..."
 *   searchPath="/players"
 *   variant="search"
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  initialValue = "",
  searchPath = "/players",
  variant = "search",
  fullWidth = false,
  onSearch,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        router.push(`${searchPath}?search=${encodeURIComponent(trimmedQuery)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`} role="search">
      <Input
        type="search"
        variant={variant}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth={fullWidth}
        startIcon={<span>🔍</span>}
        aria-label={placeholder}
      />
    </form>
  );
};

SearchBar.displayName = "SearchBar";
