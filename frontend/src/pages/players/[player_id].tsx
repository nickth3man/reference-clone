import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    <>
      <PlayerHeader player={player} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <PlayerSubNav playerId={player.player_id} activeTab="overview" />

        {/* Controls */}
        <div className="flex justify-end">
             <button 
               onClick={() => setShowPlayoffs(!showPlayoffs)}
               className={`px-4 py-2 text-sm font-medium rounded-md ${showPlayoffs ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
             >
               {showPlayoffs ? "Show Regular Season" : "Show Playoffs"}
             </button>
        </div>

        {/* Per Game Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Per Game</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Season</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Team</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">GP</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">GS</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">MP</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">PTS</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">TRB</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">AST</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">STL</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">BLK</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">FG%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">3P%</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">FT%</th>
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
                      <td className="px-3 py-2 text-right">{stat.minutes_per_game}</td>
                      <td className="px-3 py-2 text-right font-bold">{stat.points_per_game}</td>
                      <td className="px-3 py-2 text-right">{stat.rebounds_per_game}</td>
                      <td className="px-3 py-2 text-right">{stat.assists_per_game}</td>
                      <td className="px-3 py-2 text-right">{stat.steals_per_game}</td>
                      <td className="px-3 py-2 text-right">{stat.blocks_per_game}</td>
                      <td className="px-3 py-2 text-right">{stat.field_goal_pct}</td>
                      <td className="px-3 py-2 text-right">{stat.three_point_pct}</td>
                      <td className="px-3 py-2 text-right">{stat.free_throw_pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </section>

        {/* Totals Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Totals</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
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
        </section>

        {/* Per 36 Minutes */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Per 36 Minutes</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
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
        </section>

        {/* Per 100 Possessions */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Per 100 Possessions</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
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
        </section>

        {/* Advanced Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Advanced</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
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
        </section>

        {/* Shooting Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Shooting</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
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
        </section>

        {/* Play-by-Play Stats */}
        <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Play-by-Play</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
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
        </section>

        {/* Awards */}
        {awards.length > 0 && (
            <section>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Awards</h2>
                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {awards.map((award, index) => (
                            <li key={index} className="px-4 py-3">
                                <span className="font-bold">{award.season_id}</span> {award.award_type}
                                {award.rank && <span className="text-gray-500 text-sm ml-2">(Rank: {award.rank})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        )}

        {/* Contracts */}
        {contracts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Contracts</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
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
          </section>
        )}
      </div>
    </>
  );
}
