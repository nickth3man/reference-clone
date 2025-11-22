import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface Game {
  game_id: string;
  game_date: string;
  team_id_home: string;
  team_name_home: string;
  team_abbreviation_home: string;
  pts_home: number;
  team_id_away: string;
  team_name_away: string;
  team_abbreviation_away: string;
  pts_away: number;
  season_type: string;
  matchup_home: string;
}

interface GameStats {
  game_id: string;
  pts_paint_home: number;
  pts_2nd_chance_home: number;
  pts_fb_home: number;
  largest_lead_home: number;
  lead_changes: number;
  times_tied: number;
  team_turnovers_home: number;
  total_turnovers_home: number;
  team_rebounds_home: number;
  pts_off_to_home: number;
  pts_paint_away: number;
  pts_2nd_chance_away: number;
  pts_fb_away: number;
  largest_lead_away: number;
  team_turnovers_away: number;
  total_turnovers_away: number;
  team_rebounds_away: number;
  pts_off_to_away: number;
}

export default function GamePage() {
  const router = useRouter();
  const { game_id } = router.query;
  const [game, setGame] = useState<Game | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!game_id) return;

    const fetchData = async () => {
      try {
        const [gameRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/games/${game_id}`),
          fetch(`${API_URL}/games/${game_id}/stats`),
        ]);

        if (gameRes.ok) {
          const gameData = await gameRes.json();
          setGame(gameData);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [game_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-700">Game not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Game Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 text-center border-b border-slate-800">
          <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">
            {formatDate(game.game_date)}
          </div>
          <div className="text-slate-500 text-xs mt-1">{game.season_type} Season</div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
            {/* Away Team */}
            <div className="flex flex-col items-center text-center flex-1">
              <div
                className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-700 mb-4 cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => router.push(`/teams/${game.team_id_away}`)}
              >
                {game.team_abbreviation_away}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{game.team_name_away}</h2>
              <div className="text-5xl font-bold text-slate-900 mt-2">{game.pts_away}</div>
            </div>

            {/* VS / Score Divider */}
            <div className="flex flex-col items-center">
              <div className="text-slate-300 font-bold text-xl">VS</div>
              {stats && (
                <div className="mt-2 text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
                  Final
                </div>
              )}
            </div>

            {/* Home Team */}
            <div className="flex flex-col items-center text-center flex-1">
              <div
                className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-700 mb-4 cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => router.push(`/teams/${game.team_id_home}`)}
              >
                {game.team_abbreviation_home}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{game.team_name_home}</h2>
              <div className="text-5xl font-bold text-slate-900 mt-2">{game.pts_home}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Stats Comparison */}
      {stats ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {/* <Activity className="h-5 w-5 text-orange-500" /> */}
              <span>📊</span>
              Team Stats Comparison
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-right w-1/3">{game.team_abbreviation_away}</th>
                  <th className="px-6 py-3 text-center w-1/3">Category</th>
                  <th className="px-6 py-3 text-left w-1/3">{game.team_abbreviation_home}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    label: "Points in Paint",
                    home: stats.pts_paint_home,
                    away: stats.pts_paint_away,
                  },
                  {
                    label: "2nd Chance Points",
                    home: stats.pts_2nd_chance_home,
                    away: stats.pts_2nd_chance_away,
                  },
                  { label: "Fast Break Points", home: stats.pts_fb_home, away: stats.pts_fb_away },
                  {
                    label: "Points Off Turnovers",
                    home: stats.pts_off_to_home,
                    away: stats.pts_off_to_away,
                  },
                  {
                    label: "Largest Lead",
                    home: stats.largest_lead_home,
                    away: stats.largest_lead_away,
                  },
                  {
                    label: "Team Rebounds",
                    home: stats.team_rebounds_home,
                    away: stats.team_rebounds_away,
                  },
                  {
                    label: "Total Turnovers",
                    home: stats.total_turnovers_home,
                    away: stats.total_turnovers_away,
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td
                      className={`px-6 py-4 text-right font-medium ${row.away > row.home ? "text-green-600" : "text-slate-600"}`}
                    >
                      {row.away}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 text-sm">{row.label}</td>
                    <td
                      className={`px-6 py-4 text-left font-medium ${row.home > row.away ? "text-green-600" : "text-slate-600"}`}
                    >
                      {row.home}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50">
                  <td colSpan={3} className="px-6 py-3 text-center text-xs text-slate-400">
                    Lead Changes: {stats.lead_changes} • Times Tied: {stats.times_tied}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="text-4xl mb-4">📉</div>
          <h3 className="text-lg font-bold text-slate-900">No Detailed Stats Available</h3>
          <p className="text-slate-500 mt-2">
            Detailed team statistics are not available for this game.
          </p>
        </div>
      )}

      {/* Box Scores Link */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="text-2xl">📊</div>
          <div>
            <h4 className="font-bold text-blue-900">Player Box Scores</h4>
            <p className="text-blue-700 mt-1 text-sm">
              View detailed player statistics for this game.
            </p>
            <Link 
                href={`/boxscores/${game.game_id}`} 
                className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                View Box Score
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
