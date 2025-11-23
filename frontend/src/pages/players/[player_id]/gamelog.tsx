import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { PlayerHeader } from "../../../components/PlayerHeader";
import { PlayerSubNav } from "../../../components/PlayerSubNav";
import { API_URL } from "@/lib/api";
import type { Player, PlayerGameLog } from "../../../types";

export default function PlayerGameLogPage() {
  const router = useRouter();
  const { player_id, season } = router.query;
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameLog, setGameLog] = useState<PlayerGameLog[]>([]);
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

        // Fetch game log
        let url = `${API_URL}/players/${player_id}/gamelog`;
        if (season) {
            url += `?season_id=${season}`;
        }
        
        const logRes = await fetch(url);
        if (logRes.ok) {
          const logData = await logRes.json();
          setGameLog(logData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load player data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [player_id, season]);

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
        <PlayerSubNav playerId={player.player_id} activeTab="gamelog" />

        <h2 className="text-2xl font-bold mb-4">Game Log</h2>
        
        {/* Season Selector (Simple Placeholder) */}
        {/* <div className="mb-4">
            <label className="mr-2 font-medium">Season:</label>
            <select className="border rounded p-1" disabled>
                <option>All Seasons</option>
            </select>
        </div> */}

        <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opponent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FG</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FGA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3P</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3PA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FTA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AST</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BLK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PTS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">+/-</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gameLog.map((game, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {game.game_date ? new Date(game.game_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/teams/${game.opponent_team_id}`} className="text-blue-600 hover:underline">
                        {game.is_home ? '' : '@ '}{game.opponent_team_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {game.is_win === true ? <span className="text-green-600 font-bold">W</span> : 
                     game.is_win === false ? <span className="text-red-600 font-bold">L</span> : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {game.is_starter ? '1' : '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {game.minutes_played || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.field_goals_made}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.field_goals_attempted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.three_pointers_made}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.three_pointers_attempted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.free_throws_made}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.free_throws_attempted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.total_rebounds}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.assists}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.steals}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.blocks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.turnovers}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.personal_fouls}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{game.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {game.plus_minus !== null ? (game.plus_minus > 0 ? `+${game.plus_minus}` : game.plus_minus) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {gameLog.length === 0 && (
            <div className="p-4 text-center text-gray-500">No game logs available for this selection.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}

