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
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
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

        // Fetch available seasons
        let seasonsData: string[] = [];
        const seasonsRes = await fetch(`${API_URL}/players/${player_id}/seasons`);
        if (seasonsRes.ok) {
            seasonsData = await seasonsRes.json();
            setAvailableSeasons(seasonsData);
        }

        // Fetch game log
        let url = `${API_URL}/players/${player_id}/gamelog`;
        // Default to most recent season if not specified, or handle backend default
        if (season) {
          url += `?season_id=${season}`;
        } else if (seasonsData.length > 0) {
           // Optional: could redirect to latest season here if we wanted explicit URL
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
  }, [player_id, season]); // Re-run when season changes

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSeason = e.target.value;
      if (newSeason && player_id) {
          router.push(`/players/${player_id}/gamelog?season=${newSeason}`);
      }
  };

  // BR style age is Years-Days. Let's just do Years.Decimal for simplicity or Years-Days if possible.
  // BR Format: 24-058 (24 years, 58 days)
  const formatAge = (gameDateStr?: string, birthDateStr?: string) => {
      if (!gameDateStr || !birthDateStr) return "-";
      const gameDate = new Date(gameDateStr);
      const birthDate = new Date(birthDateStr);
      
      let years = gameDate.getFullYear() - birthDate.getFullYear();
      let m = gameDate.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && gameDate.getDate() < birthDate.getDate())) {
          years--;
      }
      
      // Calculate remaining days
      // Roughly:
      const lastBirthday = new Date(birthDate);
      lastBirthday.setFullYear(years + birthDate.getFullYear());
      // This logic is getting complex for simple display, let's just show Years
      // Or simple difference in days / 365
      
      // Exact calculation
      let ageYears = years;
      // Set last birthday year to the game year (or previous if not reached)
      const lastBday = new Date(birthDate);
      lastBday.setFullYear(gameDate.getFullYear());
      if (lastBday > gameDate) {
          lastBday.setFullYear(gameDate.getFullYear() - 1);
      }
      
      const days = Math.floor((gameDate.getTime() - lastBday.getTime()) / (1000 * 60 * 60 * 24));
      
      return `${ageYears}-${String(days).padStart(3, '0')}`;
  };


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

        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Game Log</h2>
            
            {availableSeasons.length > 0 && (
                <div className="flex items-center">
                    <label htmlFor="season-select" className="mr-2 font-medium text-gray-700">Season:</label>
                    <select 
                        id="season-select"
                        value={season || availableSeasons[0]}
                        onChange={handleSeasonChange}
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {availableSeasons.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Rk</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Tm</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Opp</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Res</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">GS</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">MP</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">FG</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">FGA</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">FG%</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">3P</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">3PA</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">3P%</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">FT</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">FTA</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">FT%</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">TRB</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">AST</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">STL</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">BLK</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">TOV</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">PF</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">PTS</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">GmSc</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">+/-</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gameLog.map((game, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">{gameLog.length - index}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                    <Link href={`/boxscores/${game.game_id}`}>
                        {game.game_date ? new Date(game.game_date).toISOString().split('T')[0] : "-"}
                    </Link>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {formatAge(game.game_date, player.birth_date)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                     <Link href={`/teams/${game.team_id}`}>{game.team_id}</Link>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {game.is_home ? "" : "@"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                    <Link href={`/teams/${game.opponent_team_id}`}>{game.opponent_team_id}</Link>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {game.is_win === true ? (
                      <span className="text-green-800 bg-green-100 px-1 rounded">W</span>
                    ) : game.is_win === false ? (
                      <span className="text-red-800 bg-red-100 px-1 rounded">L</span>
                    ) : "-"}
                    {game.game_result && <span className="ml-1 text-xs text-gray-500">{game.game_result}</span>}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.is_starter ? "1" : "0"}</td>
                  <td className="px-3 py-2 text-right text-gray-900">{game.minutes_played}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.field_goals_made}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.field_goals_attempted}</td>
                  <td className="px-3 py-2 text-right text-gray-500">
                    {game.field_goals_attempted ? ((game.field_goals_made || 0) / game.field_goals_attempted).toFixed(3) : "-"}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.three_pointers_made}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.three_pointers_attempted}</td>
                  <td className="px-3 py-2 text-right text-gray-500">
                    {game.three_pointers_attempted ? ((game.three_pointers_made || 0) / game.three_pointers_attempted).toFixed(3) : "-"}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.free_throws_made}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.free_throws_attempted}</td>
                  <td className="px-3 py-2 text-right text-gray-500">
                    {game.free_throws_attempted ? ((game.free_throws_made || 0) / game.free_throws_attempted).toFixed(3) : "-"}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.total_rebounds}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.assists}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.steals}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.blocks}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.turnovers}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.personal_fouls}</td>
                  <td className="px-3 py-2 text-right font-bold text-gray-900">{game.points}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{game.game_score}</td>
                  <td className="px-3 py-2 text-right text-gray-500">
                    {game.plus_minus !== null && game.plus_minus !== undefined ? (game.plus_minus > 0 ? `+${game.plus_minus}` : game.plus_minus) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {gameLog.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No game logs available for this selection.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
