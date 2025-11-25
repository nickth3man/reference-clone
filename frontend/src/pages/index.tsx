import React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
import { StandingsTable } from "@/components/dashboard/StandingsTable";
import { LeadersCard } from "@/components/dashboard/LeadersCard";
import { Scoreboard } from "@/components/dashboard/Scoreboard";
import { StandingsItem, SeasonLeaders, Season, Game } from "@/types";

interface HomeProps {
  seasonId: string;
  standings: StandingsItem[];
  leaders: SeasonLeaders | null;
  recentGames: Game[];
  error?: string;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    // 1. Get latest season
    const seasons = await fetchAPI<Season[]>("/seasons");
    if (!seasons || seasons.length === 0) {
       throw new Error("No seasons found");
    }
    // Assuming the API returns sorted seasons, first one is latest
    const latestSeason = seasons[0];
    const seasonId = latestSeason.season_id;

    // 2. Get standings, leaders, and recent games in parallel
    const [standings, leaders, games] = await Promise.all([
      fetchAPI<StandingsItem[]>(`/seasons/${seasonId}/standings`),
      fetchAPI<SeasonLeaders>(`/seasons/${seasonId}/leaders`),
      fetchAPI<Game[]>("/games?limit=50"), // Fetches latest games due to default sort
    ]);

    // Filter games to the most recent date found
    let recentGames: Game[] = [];
    if (games && games.length > 0) {
      const latestDate = games[0].game_date;
      recentGames = games.filter(g => g.game_date === latestDate);
    }

    return {
      props: {
        seasonId,
        standings: standings || [],
        leaders: leaders || null,
        recentGames,
      },
    };
  } catch (error) {
    console.error("Dashboard data fetch failed:", error);
    return {
      props: {
        seasonId: "",
        standings: [],
        leaders: null,
        recentGames: [],
        error: "Failed to load dashboard data. Please try again later.",
      },
    };
  }
};

export default function Home({ seasonId, standings, leaders, recentGames, error }: HomeProps) {
    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    const eastStandings = standings.filter(t => t.conference === "Eastern");
    const westStandings = standings.filter(t => t.conference === "Western");

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <Head>
        <title>Basketball Reference Clone</title>
        <meta name="description" content="NBA Stats and History" />
      </Head>

      {/* Scoreboard Section */}
      <Scoreboard games={recentGames} />

      <h1 className="text-2xl font-bold text-gray-900">{seasonId} NBA Season Summary</h1>

      {/* Standings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StandingsTable title="Eastern Conference" standings={eastStandings} />
        <StandingsTable title="Western Conference" standings={westStandings} />
      </div>

      {/* Leaders Section */}
      <div>
          <h2 className="text-xl font-bold mb-3 text-gray-900 border-b pb-2 border-gray-200">League Leaders</h2>
          {leaders && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <LeadersCard title="Points" leaders={leaders.pts} valueLabel="PPG" />
                <LeadersCard title="Rebounds" leaders={leaders.trb} valueLabel="RPG" />
                <LeadersCard title="Assists" leaders={leaders.ast} valueLabel="APG" />
                <LeadersCard title="Win Shares" leaders={leaders.ws} valueLabel="WS" />
                <LeadersCard title="PER" leaders={leaders.per} valueLabel="PER" />
            </div>
          )}
      </div>
    </div>
  );
}
