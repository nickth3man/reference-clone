import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/players?search=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events?.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const isActiveRoute = (path: string) => router.pathname === path;

  return (
    <nav
      className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-90"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md"
            aria-label="HoopsClone home"
          >
            <span className="text-2xl font-bold bg-linear-to-r from-orange-500 to-red-600 text-transparent bg-clip-text">
              HoopsClone
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block" role="navigation" aria-label="Primary">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/teams"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-current={isActiveRoute("/teams") ? "page" : undefined}
              >
                Teams
              </Link>
              <Link
                href="/players"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-current={isActiveRoute("/players") ? "page" : undefined}
              >
                Players
              </Link>
              <Link
                href="/games"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-current={isActiveRoute("/games") ? "page" : undefined}
              >
                Games
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md ml-8">
            <form onSubmit={handleSearch} className="relative" role="search">
              <label htmlFor="desktop-search" className="sr-only">
                Search players
              </label>
              <input
                id="desktop-search"
                type="search"
                placeholder="Search players..."
                className="w-full bg-slate-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search players"
              />
              <span className="absolute left-3 top-2.5 text-slate-400" aria-hidden="true">
                🔍
              </span>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span aria-hidden="true">{isOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-slate-900 pb-4 px-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" role="navigation" aria-label="Mobile">
            <Link
              href="/teams"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-current={isActiveRoute("/teams") ? "page" : undefined}
            >
              Teams
            </Link>
            <Link
              href="/players"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-current={isActiveRoute("/players") ? "page" : undefined}
            >
              Players
            </Link>
            <Link
              href="/games"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-current={isActiveRoute("/games") ? "page" : undefined}
            >
              Games
            </Link>
          </div>
          <form onSubmit={handleSearch} className="mt-4 relative" role="search">
            <label htmlFor="mobile-search" className="sr-only">
              Search players
            </label>
            <input
              id="mobile-search"
              type="search"
              placeholder="Search players..."
              className="w-full bg-slate-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search players"
            />
            <span className="absolute left-3 top-2.5 text-slate-400" aria-hidden="true">
              🔍
            </span>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
