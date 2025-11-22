import { useState } from "react";
import { useRouter } from "next/router";
// import { Search, ArrowRight } from 'lucide-react';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/players?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl mb-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:py-32 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
          The Ultimate <span className="text-orange-500">Basketball</span>{" "}
          Database
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 mb-10">
          Explore comprehensive stats, team histories, and player records. Dive
          deep into the game you love.
        </p>

        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="Search for a player (e.g. LeBron James)..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full py-4 pl-12 pr-16 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/20 transition-all text-lg placeholder-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* <Search className="absolute left-4 top-4.5 h-6 w-6 text-slate-400 group-focus-within:text-orange-500 transition-colors" /> */}
            <span className="absolute left-4 top-4.5 text-slate-400 text-xl">
              🔍
            </span>
            <button
              type="submit"
              className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors"
            >
              {/* <ArrowRight className="h-6 w-6" /> */}
              <span>→</span>
            </button>
          </form>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => router.push("/teams")}
            className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors"
          >
            Browse Teams
          </button>
          <button
            onClick={() => router.push("/games")}
            className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-colors"
          >
            Recent Games
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
