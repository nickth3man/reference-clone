import { useState } from "react";
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

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push("/")}>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text">
              HoopsClone
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/teams"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Teams
              </Link>
              <Link
                href="/players"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Players
              </Link>
              <Link
                href="/games"
                className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Games
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md ml-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search players..."
                className="w-full bg-slate-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" /> */}
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {/* {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} */}
              {isOpen ? "X" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 pb-4 px-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/teams"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium"
            >
              Teams
            </Link>
            <Link
              href="/players"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium"
            >
              Players
            </Link>
            <Link
              href="/games"
              className="block hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium"
            >
              Games
            </Link>
          </div>
          <form onSubmit={handleSearch} className="mt-4 relative">
            <input
              type="text"
              placeholder="Search players..."
              className="w-full bg-slate-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" /> */}
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
