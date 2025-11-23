import Link from "next/link";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
import type { Team } from "../../types";

interface TeamsPageProps {
  teams: Team[];
}

export const getServerSideProps: GetServerSideProps<TeamsPageProps> = async () => {
  try {
    // By default active_only=True, which now filters for NBA league as well
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

const DIVISIONS: Record<string, string[]> = {
  "Atlantic": ["BOS", "BKN", "NYK", "PHI", "TOR"],
  "Central": ["CHI", "CLE", "DET", "IND", "MIL"],
  "Southeast": ["ATL", "CHA", "MIA", "ORL", "WAS"],
  "Northwest": ["DEN", "MIN", "OKC", "POR", "UTA"],
  "Pacific": ["GSW", "LAC", "LAL", "PHX", "SAC"],
  "Southwest": ["DAL", "HOU", "MEM", "NOP", "SAS"],
};

const CONFERENCES = {
  "Eastern Conference": ["Atlantic", "Central", "Southeast"],
  "Western Conference": ["Northwest", "Pacific", "Southwest"],
};

export default function TeamsIndex({ teams }: TeamsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = teams.filter(
    (team) =>
      (team.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.nickname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.abbreviation || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTeamCard = (team: Team) => (
    <Link key={team.team_id} href={`/teams/${team.team_id}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-slate-100 group-hover:border-orange-200 h-full flex items-center gap-4">
        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors shrink-0">
          {(team.abbreviation || "").substring(0, 2)}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
            {team.city} {team.nickname}
          </h3>
          <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
            {team.abbreviation}
          </span>
        </div>
      </div>
    </Link>
  );

  const renderConference = (conferenceName: string, divisions: string[]) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-2">{conferenceName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {divisions.map((division) => (
          <div key={division}>
            <h3 className="text-lg font-semibold text-slate-700 mb-4 bg-slate-50 p-2 rounded">
              {division} Division
            </h3>
            <div className="flex flex-col gap-3">
              {filteredTeams
                .filter((team) => {
                  // Try to match by abbreviation first if defined in DIVISIONS
                  // Otherwise fallback to team.division if available (data might be messy)
                  const abbr = team.abbreviation || "";
                  if (DIVISIONS[division].includes(abbr)) return true;
                  return team.division === division;
                })
                .map(renderTeamCard)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">NBA Teams</h1>
          <p className="text-slate-500 mt-1">Active Franchises</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Show hierarchical view only if no search query or if specific matches found */}
      {!searchQuery ? (
        <>
          {renderConference("Eastern Conference", CONFERENCES["Eastern Conference"])}
          {renderConference("Western Conference", CONFERENCES["Western Conference"])}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeams.map(renderTeamCard)}
          {filteredTeams.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No teams found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      )}
      
      <div className="mt-12 pt-8 border-t border-slate-200 text-center">
        <p className="text-slate-500">
          Looking for past teams? Check the <Link href="/franchises" className="text-orange-600 hover:underline">Franchise Index</Link>.
        </p>
      </div>
    </div>
  );
}
