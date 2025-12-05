import { useState } from "react";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
import type { DraftPick } from "../../types";
import { useRouter } from "next/router";
import { Input, Card } from "@/components/atoms";
import Table from "@/components/Table";
import { TABLE_SCHEMAS } from "@/lib/tableSchema";
import { mapDraftPicks } from "@/lib/dataMapper";

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

      <Card variant="bordered" padding="md" className="overflow-hidden">
        <Table
          title=""
          schema={TABLE_SCHEMAS.draft_stats}
          data={mapDraftPicks(filteredPicks)}
        />
        {filteredPicks.length === 0 && (
          <div className="p-4 text-center text-slate-500">
            No picks found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </Card>
    </div>
  );
}

