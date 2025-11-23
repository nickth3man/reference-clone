import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { PlayerHeader } from "../../../components/PlayerHeader";
import { PlayerSubNav } from "../../../components/PlayerSubNav";
import { API_URL } from "@/lib/api";
import type { Player, PlayerAdvancedStats } from "../../../types";

export default function PlayerAdvancedPage() {
  const router = useRouter();
  const { player_id } = router.query;
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerAdvancedStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!player_id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch player details
        const playerRes = await fetch(`${API_URL}/players/${player_id}`);
        if (!playerRes.ok) throw new Error("Failed to fetch player details");
        const playerData = await playerRes.json();
        setPlayer(playerData);

        // Fetch advanced stats
        const statsRes = await fetch(`${API_URL}/players/${player_id}/advanced`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load player data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [player_id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !player) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2">{error || "Player not found"}</p>
          <Link href="/players" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Players
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PlayerHeader player={player} />
      
      <div className="container mx-auto px-4 py-8">
        <PlayerSubNav playerId={player.player_id} activeTab="advanced" />

        <h2 className="text-2xl font-bold mb-4">Advanced Stats</h2>
        <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Player Efficiency Rating">PER</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="True Shooting %">TS%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="3-Point Attempt Rate">3PAr</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Free Throw Rate">FTr</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Offensive Rebound %">ORB%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Defensive Rebound %">DRB%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Total Rebound %">TRB%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Assist %">AST%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Steal %">STL%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Block %">BLK%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Turnover %">TOV%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Usage %">USG%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Offensive Win Shares">OWS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Defensive Win Shares">DWS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Win Shares">WS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Win Shares Per 48 Minutes">WS/48</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Box Plus/Minus">BPM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" title="Value Over Replacement Player">VORP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.season_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.player_efficiency_rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.true_shooting_pct}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.three_point_attempt_rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.free_throw_rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.offensive_rebound_pct}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.defensive_rebound_pct}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.total_rebound_pct}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.assist_pct}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.steal_pct}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.block_pct}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.turnover_pct}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.usage_pct}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.offensive_win_shares}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.defensive_win_shares}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{stat.win_shares}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.win_shares_per_48}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.box_plus_minus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{stat.value_over_replacement}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.length === 0 && (
            <div className="p-4 text-center text-gray-500">No advanced stats available for this player.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}

