import Link from "next/link";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
import type { Team } from "../../types";
// import { Search } from 'lucide-react';

interface TeamsPageProps {
  teams: Team[];
}

export const getServerSideProps: GetServerSideProps<TeamsPageProps> = async () => {
  try {
    const teams = await fetchAPI<Team[]>("/teams");
    return {
      props: {
        teams,
      },
    };
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return {
      props: {
        teams: [],
      },
    };
  }
};

export default function TeamsIndex({ teams }: TeamsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = teams.filter(
    (team) =>
      (team.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.nickname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.abbreviation || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">All Teams</h1>
          <p className="text-slate-500 mt-1">Browse all {teams.length} NBA franchises</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" /> */}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTeams.map((team) => (
          <Link key={team.team_id} href={`/teams/${team.team_id}`} className="group">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-slate-100 group-hover:border-orange-200 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                  {(team.abbreviation || "").substring(0, 2)}
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  {team.abbreviation}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {team.city} {team.nickname}
                </h3>
              </div>
            </div>
          </Link>
        ))}

        {filteredTeams.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No teams found matching {'"'}
            {searchQuery}
            {'"'}
          </div>
        )}
      </div>
    </div>
  );
}
