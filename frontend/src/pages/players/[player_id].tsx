import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { API_URL } from "@/lib/api";
import type { 
  Player, 
  PlayerSeasonStats, 
  PlayerAdvancedStats, 
  Contract, 
  PlayerShootingStats, 
  PlayerPlayByPlayStats, 
  Award 
} from "../../types";
import { PlayerHeader } from "../../components/PlayerHeader";
import { PlayerSubNav } from "../../components/PlayerSubNav";
import { Card, Button, Spinner } from "@/components/atoms";

export default function PlayerPage() {
  const router = useRouter();
  const { player_id } = router.query;
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerSeasonStats[]>([]);
  const [advancedStats, setAdvancedStats] = useState<PlayerAdvancedStats[]>([]);
  const [shootingStats, setShootingStats] = useState<PlayerShootingStats[]>([]);
  const [pbpStats, setPbpStats] = useState<PlayerPlayByPlayStats[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPlayoffs, setShowPlayoffs] = useState(false);

  useEffect(() => {
    if (!player_id) return;

    const fetchData = async () => {
      try {
        // Fetch player details
        const playerRes = await fetch(`${API_URL}/players/${player_id}`);
        if (!playerRes.ok) throw new Error("Failed to fetch player details");
        const playerData = await playerRes.json();
        setPlayer(playerData);

        // Fetch player stats
        const statsRes = await fetch(`${API_URL}/players/${player_id}/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        // Fetch advanced stats
        const advRes = await fetch(`${API_URL}/players/${player_id}/advanced`);
        if (advRes.ok) {
          const advData = await advRes.json();
          setAdvancedStats(advData);
        }

        // Fetch shooting stats
        const shootingRes = await fetch(`${API_URL}/players/${player_id}/shooting`);
        if (shootingRes.ok) {
          const shootingData = await shootingRes.json();
          setShootingStats(shootingData);
        }

        // Fetch play-by-play stats
        const pbpRes = await fetch(`${API_URL}/players/${player_id}/playbyplay`);
        if (pbpRes.ok) {
          const pbpData = await pbpRes.json();
          setPbpStats(pbpData);
        }

        // Fetch awards
        const awardsRes = await fetch(`${API_URL}/players/${player_id}/awards`);
        if (awardsRes.ok) {
          const awardsData = await awardsRes.json();
          setAwards(awardsData);
        }

        // Fetch contracts
        const contractsRes = await fetch(`${API_URL}/players/${player_id}/contracts`);
        if (contractsRes.ok) {
          const contractsData = await contractsRes.json();
          setContracts(contractsData);
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
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2">{error || "Player not found"}</p>
        <Link href="/players" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Players
        </Link>
      </div>
    );
  }
  
  // Helper to filter stats based on playoffs toggle
  const filterStats = (data: any[]) => {
    if (!data) return [];
    return data.filter(stat => {
       const isPlayoff = stat.season_type === "Playoffs";
       return showPlayoffs ? isPlayoff : !isPlayoff;
    });
  };

  const displayedStats = filterStats(stats);
  const displayedAdvanced = filterStats(advancedStats);
  const displayedShooting = filterStats(shootingStats);
  const displayedPbp = filterStats(pbpStats);

  return (
    <Layout>
      <PlayerHeader player={player} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <PlayerSubNav playerId={player.player_id} activeTab="overview" />

        {/* Controls */}
        <div className="flex justify-end">
             <Button 
               variant={showPlayoffs ? "primary" : "secondary"}
               onClick={() => setShowPlayoffs(!showPlayoffs)}
               size="sm"
             >
               {showPlayoffs ? "Show Regular Season" : "Show Playoffs"}
             </Button>
        </div>

        {/* Per Game Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Per Game</h2>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Season</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">Age</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Team</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Lg</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Pos</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">G</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">GS</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">MP</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">FG</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">FGA</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">FG%</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">3P</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">3PA</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">3P%</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">2P</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">2PA</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">2P%</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">eFG%</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">FT</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">FTA</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">FT%</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">ORB</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">DRB</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">TRB</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">AST</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">STL</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">BLK</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">TOV</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">PF</th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-600">PTS</th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-600">Awards</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedStats.map((stat, index) => {
                    const g = stat.games_played || 1;
                    const formatVal = (val: number | undefined) => (val ? (val / g).toFixed(1) : "0.0");
                    const formatPct = (val: number | undefined) => (val !== undefined ? val.toFixed(3).replace(/^0/, "") : "");
                    
                    // Match awards for this season
                    const seasonAwards = awards.filter(a => a.season_id === stat.season_id);
                    const awardsStr = seasonAwards.map(a => {
                        let str = a.award_type || "";
                        if (a.rank && a.rank > 0) str += `-${a.rank}`; // Simple representation
                        return str;
                    }).filter(s => s).join(", ");

                    return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-900">
                        <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>
                      </td>
                      <td className="px-2 py-2 text-right">{stat.age}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-blue-600 hover:underline">
                        {stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`}>{stat.team_id}</Link>}
                      </td>
                      <td className="px-2 py-2 text-left">{stat.league}</td>
                      <td className="px-2 py-2 text-left">{player.position}</td>
                      <td className="px-2 py-2 text-right">{stat.games_played}</td>
                      <td className="px-2 py-2 text-right">{stat.games_started}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.minutes_played)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.field_goals_made)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.field_goals_attempted)}</td>
                      <td className="px-2 py-2 text-right">{formatPct(stat.field_goal_pct)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.three_pointers_made)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.three_pointers_attempted)}</td>
                      <td className="px-2 py-2 text-right">{formatPct(stat.three_point_pct)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.two_pointers_made)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.two_pointers_attempted)}</td>
                      <td className="px-2 py-2 text-right">{formatPct(stat.two_point_pct)}</td>
                      <td className="px-2 py-2 text-right">{formatPct(stat.effective_fg_pct)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.free_throws_made)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.free_throws_attempted)}</td>
                      <td className="px-2 py-2 text-right">{formatPct(stat.free_throw_pct)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.offensive_rebounds)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.defensive_rebounds)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.total_rebounds)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.assists)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.steals)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.blocks)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.turnovers)}</td>
                      <td className="px-2 py-2 text-right">{formatVal(stat.personal_fouls)}</td>
                      <td className="px-2 py-2 text-right font-bold">{formatVal(stat.points)}</td>
                      <td className="px-2 py-2 text-left text-xs text-gray-500">{awardsStr}</td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
            </Card>
        </section>

        {/* Totals Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Totals</h2>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Season</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Team</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">G</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">GS</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">MP</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">PTS</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">TRB</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">AST</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">STL</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">BLK</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">TOV</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">PF</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{stat.season_id}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                         {stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`}>{stat.team_id}</Link>}
                      </td>
                      <td className="px-3 py-2 text-right">{stat.games_played}</td>
                      <td className="px-3 py-2 text-right">{stat.games_started}</td>
                      <td className="px-3 py-2 text-right">{stat.minutes_played}</td>
                      <td className="px-3 py-2 text-right font-bold">{stat.points}</td>
                      <td className="px-3 py-2 text-right">{stat.total_rebounds}</td>
                      <td className="px-3 py-2 text-right">{stat.assists}</td>
                      <td className="px-3 py-2 text-right">{stat.steals}</td>
                      <td className="px-3 py-2 text-right">{stat.blocks}</td>
                      <td className="px-3 py-2 text-right">{stat.turnovers}</td>
                      <td className="px-3 py-2 text-right">{stat.personal_fouls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Card>
        </section>

        {/* Per 36 Minutes */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Per 36 Minutes</h2>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Season</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Team</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">PTS</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">TRB</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">AST</th>
                    {/* Note: DB Schema has per_36 for pts, trb, ast. Others might be missing or could be calculated if needed, 
                        but we'll stick to what's in PlayerSeasonStats model */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{stat.season_id}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                         {stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`}>{stat.team_id}</Link>}
                      </td>
                      <td className="px-3 py-2 text-right font-bold">{stat.points_per_36}</td>
                      <td className="px-3 py-2 text-right">{stat.rebounds_per_36}</td>
                      <td className="px-3 py-2 text-right">{stat.assists_per_36}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Card>
        </section>

        {/* Per 100 Possessions */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Per 100 Possessions</h2>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Season</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Team</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">PTS</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">TRB</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">AST</th>
                    {/* Similarly, stick to available fields */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{stat.season_id}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                         {stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`}>{stat.team_id}</Link>}
                      </td>
                      <td className="px-3 py-2 text-right font-bold">{stat.points_per_100_poss}</td>
                      <td className="px-3 py-2 text-right">{stat.rebounds_per_100_poss}</td>
                      <td className="px-3 py-2 text-right">{stat.assists_per_100_poss}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Card>
        </section>

        {/* Advanced Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Advanced</h2>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Season</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Team</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">PER</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">TS%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">USG%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">OWS</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">DWS</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">WS</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">WS/48</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">OBPM</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">DBPM</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">BPM</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">VORP</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedAdvanced.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{stat.season_id}</td>
                       <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                         {stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`}>{stat.team_id}</Link>}
                      </td>
                      <td className="px-3 py-2 text-right">{stat.player_efficiency_rating}</td>
                      <td className="px-3 py-2 text-right">{stat.true_shooting_pct}</td>
                      <td className="px-3 py-2 text-right">{stat.usage_pct}</td>
                      <td className="px-3 py-2 text-right">{stat.offensive_win_shares}</td>
                      <td className="px-3 py-2 text-right">{stat.defensive_win_shares}</td>
                      <td className="px-3 py-2 text-right font-bold">{stat.win_shares}</td>
                      <td className="px-3 py-2 text-right">{stat.win_shares_per_48}</td>
                      <td className="px-3 py-2 text-right">{stat.offensive_box_plus_minus}</td>
                      <td className="px-3 py-2 text-right">{stat.defensive_box_plus_minus}</td>
                      <td className="px-3 py-2 text-right">{stat.box_plus_minus}</td>
                      <td className="px-3 py-2 text-right font-bold">{stat.value_over_replacement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Card>
        </section>

        {/* Shooting Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Shooting</h2>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Season</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Team</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Dist.</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">2P%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">0-3</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">3-10</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">10-16</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">16-3P</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">3P%</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedShooting.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{stat.season_id}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                         {stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`}>{stat.team_id}</Link>}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500">-</td>
                      <td className="px-3 py-2 text-right text-gray-500">-</td>
                      <td className="px-3 py-2 text-right">{stat.fg_pct_at_rim}</td>
                      <td className="px-3 py-2 text-right">{stat.fg_pct_3_10}</td>
                      <td className="px-3 py-2 text-right">{stat.fg_pct_10_16}</td>
                      <td className="px-3 py-2 text-right">{stat.fg_pct_16_3pt}</td>
                      <td className="px-3 py-2 text-right">{stat.fg_pct_3pt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Card>
        </section>

        {/* Play-by-Play Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Play-by-Play</h2>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Season</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Team</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">PG%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">SG%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">SF%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">PF%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">C%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">OnCourt +/-</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">OffCourt +/-</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedPbp.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{stat.season_id}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                         {stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`}>{stat.team_id}</Link>}
                      </td>
                      <td className="px-3 py-2 text-right">{stat.pct_pg}%</td>
                      <td className="px-3 py-2 text-right">{stat.pct_sg}%</td>
                      <td className="px-3 py-2 text-right">{stat.pct_sf}%</td>
                      <td className="px-3 py-2 text-right">{stat.pct_pf}%</td>
                      <td className="px-3 py-2 text-right">{stat.pct_c}%</td>
                      <td className="px-3 py-2 text-right">{stat.plus_minus_on}</td>
                      <td className="px-3 py-2 text-right">{stat.plus_minus_off}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Card>
        </section>

        {/* Awards */}
        {awards.length > 0 && (
            <section>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Awards</h2>
                <Card padding="none" className="overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {awards.map((award, index) => (
                            <li key={index} className="px-4 py-3">
                                <span className="font-bold">{award.season_id}</span> {award.award_type}
                                {award.rank && <span className="text-gray-500 text-sm ml-2">(Rank: {award.rank})</span>}
                            </li>
                        ))}
                    </ul>
                </Card>
            </section>
        )}

        {/* Contracts */}
        {contracts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Contracts</h2>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Team</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Type</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Signed</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Years</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Total Value</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Year 1</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Year 2</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Year 3</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Year 4</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Year 5</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Guaranteed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-blue-600 hover:underline">
                        <Link href={`/teams/${contract.team_id}`}>{contract.team_id}</Link>
                      </td>
                      <td className="px-3 py-2 text-gray-500">{contract.contract_type}</td>
                      <td className="px-3 py-2 text-gray-500">{contract.signing_date}</td>
                      <td className="px-3 py-2 text-right">{contract.years}</td>
                      <td className="px-3 py-2 text-right font-medium">
                        {contract.total_value ? `$${contract.total_value.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500">
                        {contract.year_1_salary ? `$${contract.year_1_salary.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500">
                        {contract.year_2_salary ? `$${contract.year_2_salary.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500">
                        {contract.year_3_salary ? `$${contract.year_3_salary.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500">
                        {contract.year_4_salary ? `$${contract.year_4_salary.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500">
                        {contract.year_5_salary ? `$${contract.year_5_salary.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {contract.guaranteed_money ? `$${contract.guaranteed_money.toLocaleString()}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Card>
          </section>
        )}
      </div>
    </Layout>
  );
}
