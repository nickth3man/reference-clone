import Link from "next/link";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
import type { Team } from "../../types";
import { TeamCard } from "@/components/molecules";
import { Input } from "@/components/atoms";

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
    <TeamCard key={team.team_id} team={team} className="h-full" />
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

        <div className="relative w-full md:w-72">
          <Input
            variant="search"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<span>🔍</span>}
            fullWidth
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
