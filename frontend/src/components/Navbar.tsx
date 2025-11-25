import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchAPI } from "@/lib/api";
import { Team } from "@/types";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const router = useRouter();

  // Fetch teams on mount for search logic
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchAPI<Team[]>("/teams");
        setTeams(data || []);
      } catch (err) {
        console.error("Failed to load teams for search", err);
      }
    };
    loadTeams();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    
    // Check for team match
    const matchedTeam = teams.find(
      (t) =>
        (t.team_id && t.team_id.toLowerCase() === query) ||
        (t.abbreviation && t.abbreviation.toLowerCase() === query) ||
        (t.full_name && t.full_name.toLowerCase() === query) ||
        (t.nickname && t.nickname.toLowerCase() === query) ||
        (t.city && t.city.toLowerCase() === query)
    );

    if (matchedTeam) {
      router.push(`/teams/${matchedTeam.team_id}`);
    } else {
      router.push(`/players?search=${encodeURIComponent(searchQuery)}`);
    }
    setIsOpen(false);
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
                href="/leagues"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-current={isActiveRoute("/leagues") ? "page" : undefined}
              >
                Seasons
              </Link>
              <Link
                href="/leaders"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-current={isActiveRoute("/leaders") ? "page" : undefined}
              >
                Leaders
              </Link>
              <Link
                href="/games"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-current={isActiveRoute("/games") ? "page" : undefined}
              >
                Scores
              </Link>
              <Link
                href="/playoffs"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-current={isActiveRoute("/playoffs") ? "page" : undefined}
              >
                Playoffs
              </Link>
              <Link
                href="/stathead"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-current={isActiveRoute("/stathead") ? "page" : undefined}
              >
                Stathead
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md ml-8">
            <form onSubmit={handleSearch} className="relative" role="search">
              <label htmlFor="desktop-search" className="sr-only">
                Search players or teams
              </label>
              <input
                id="desktop-search"
                type="search"
                placeholder="Search players or teams..."
                className="w-full bg-slate-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search players or teams"
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
              href="/leagues"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-current={isActiveRoute("/leagues") ? "page" : undefined}
            >
              Seasons
            </Link>
            <Link
              href="/leaders"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-current={isActiveRoute("/leaders") ? "page" : undefined}
            >
              Leaders
            </Link>
            <Link
              href="/games"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-current={isActiveRoute("/games") ? "page" : undefined}
            >
              Scores
            </Link>
            <Link
              href="/playoffs"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-current={isActiveRoute("/playoffs") ? "page" : undefined}
            >
              Playoffs
            </Link>
            <Link
              href="/stathead"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-current={isActiveRoute("/stathead") ? "page" : undefined}
            >
              Stathead
            </Link>
          </div>
          <form onSubmit={handleSearch} className="mt-4 relative" role="search">
            <label htmlFor="mobile-search" className="sr-only">
              Search players or teams
            </label>
            <input
              id="mobile-search"
              type="search"
              placeholder="Search players or teams..."
              className="w-full bg-slate-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search players or teams"
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
