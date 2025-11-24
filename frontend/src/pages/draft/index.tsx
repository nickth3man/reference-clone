import { useState } from "react";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
import type { DraftPick } from "../../types";
import { useRouter } from "next/router";
import { Input, Card } from "@/components/atoms";

interface DraftPageProps {
  picks: DraftPick[];
  year: number;
}

export const getServerSideProps: GetServerSideProps<DraftPageProps> = async (context) => {
  const year = context.query.year ? parseInt(context.query.year as string) : 2023;
  try {
    const picks = await fetchAPI<DraftPick[]>(`/draft/picks?year=${year}&limit=60`);
    return {
      props: {
        picks,
        year,
      },
    };
  } catch (error) {
    console.error("Failed to fetch draft picks:", error);
    return {
      props: {
        picks: [],
        year,
      },
    };
  }
};

export default function DraftIndex({ picks, year }: DraftPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPicks = picks.filter(
    (pick) =>
      (pick.player_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pick.college || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pick.team_id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleYearChange = (newYear: string) => {
    router.push(`/draft?year=${newYear}`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{year} NBA Draft</h1>
          <p className="text-slate-500 mt-1">{picks.length} picks loaded</p>
        </div>

        <div className="flex gap-4 items-center">
          <select 
            className="bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-8 h-[42px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer hover:border-orange-200 transition-colors"
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
          >
             {/* Generating a few years for selection */}
            {Array.from({ length: 2024 - 1980 }, (_, i) => 2023 - i).map(y => (
                <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="w-full md:w-64">
             <Input
                variant="search"
                placeholder="Search picks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startIcon={<span>🔍</span>}
                fullWidth
             />
          </div>
        </div>
      </div>

      <Card variant="bordered" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Pick</th>
                <th className="px-6 py-3">Team</th>
                <th className="px-6 py-3">Player</th>
                <th className="px-6 py-3">College</th>
                <th className="px-6 py-3 text-right">WS</th>
                <th className="px-6 py-3 text-right">VORP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPicks.map((pick) => (
                <tr key={pick.pick_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">{pick.overall_pick}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{pick.team_id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{pick.player_name}</td>
                  <td className="px-6 py-4 text-slate-600">{pick.college}</td>
                  <td className="px-6 py-4 text-right text-slate-600">{pick.career_win_shares}</td>
                  <td className="px-6 py-4 text-right text-slate-600">{pick.career_vorp}</td>
                </tr>
              ))}
              {filteredPicks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No picks found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

