import Link from "next/link";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { fetchAPI } from "@/lib/api";
import type { Player } from "../../types";

interface PlayersPageProps {
  players: Player[];
  letter: string;
  search: string;
  page: number;
}

export const getServerSideProps: GetServerSideProps<PlayersPageProps> = async (context) => {
  const letter = (context.query.letter as string) || "A";
  const search = (context.query.search as string) || "";
  const page = context.query.page ? parseInt(context.query.page as string) : 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  let endpoint = `/players?limit=${limit}&offset=${offset}`;
  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  } else {
    endpoint += `&letter=${letter}`;
  }

  try {
    const players = await fetchAPI<Player[]>(endpoint);
    return {
      props: {
        players,
        letter,
        search,
        page,
      },
    };
  } catch (error) {
    console.error("Failed to fetch players:", error);
    return {
      props: {
        players: [],
        letter,
        search,
        page,
      },
    };
  }
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function PlayersIndex({ players, letter, search, page }: PlayersPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/players?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">NBA Player Index</h1>
        
        {/* Alphabet Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ALPHABET.map((char) => (
            <Link
              key={char}
              href={`/players?letter=${char}`}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                !search && letter === char
                  ? "bg-orange-500 text-white"
                  : "bg-white text-slate-600 hover:bg-orange-100 hover:text-orange-600 border border-slate-200"
              }`}
            >
              {char}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-md">
          <input
            type="text"
            placeholder="Find a player..."
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
          >
            🔍
          </button>
        </form>
      </div>

      {/* Players Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Player</th>
                <th className="px-6 py-3">Pos</th>
                <th className="px-6 py-3">Ht</th>
                <th className="px-6 py-3">Wt</th>
                <th className="px-6 py-3">Birth Date</th>
                <th className="px-6 py-3">College</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {players.map((player) => (
                <tr key={player.player_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <Link href={`/players/${player.player_id}`} className="hover:text-orange-600">
                      {player.full_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{player.position}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {player.height_inches
                      ? `${Math.floor(player.height_inches / 12)}'${player.height_inches % 12}"`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{player.weight_lbs} lbs</td>
                  <td className="px-6 py-4 text-slate-600">
                    {player.birth_date ? new Date(player.birth_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{player.college || "-"}</td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No players found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <Link
          href={{
            pathname: "/players",
            query: { ...router.query, page: page > 1 ? page - 1 : 1 },
          }}
          className={`px-4 py-2 rounded border ${
            page > 1
              ? "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              : "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none"
          }`}
        >
          Previous
        </Link>
        <span className="px-4 py-2 text-slate-600">Page {page}</span>
        <Link
          href={{
            pathname: "/players",
            query: { ...router.query, page: page + 1 },
          }}
          className={`px-4 py-2 rounded border ${
            players.length === 50
              ? "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              : "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

