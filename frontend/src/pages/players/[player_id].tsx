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
  PlayerAdjustedShooting,
  PlayerGameLog,
  PlayerSplits,
  Award 
} from "../../types";
import { PlayerHeader } from "../../components/PlayerHeader";
import { PlayerSubNav } from "../../components/PlayerSubNav";
import { Card, Button, Spinner } from "@/components/atoms";
import Table from "../../components/Table";
import { TABLE_SCHEMAS } from "../../lib/tableSchema";
import { mapToPerGame, mapToTotals, mapToPerMinute, mapToPerPoss, mapToAdvanced, mapToShooting, mapToPbp, mapToAdjustedShooting, mapToGameLog, mapToSplits } from "../../lib/dataMapper";

export default function PlayerPage() {
  const router = useRouter();
  const { player_id } = router.query;
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerSeasonStats[]>([]);
  const [advancedStats, setAdvancedStats] = useState<PlayerAdvancedStats[]>([]);
  const [shootingStats, setShootingStats] = useState<PlayerShootingStats[]>([]);
  const [adjustedShooting, setAdjustedShooting] = useState<PlayerAdjustedShooting[]>([]);
  const [pbpStats, setPbpStats] = useState<PlayerPlayByPlayStats[]>([]);
  const [gameLog, setGameLog] = useState<PlayerGameLog[]>([]);
  const [splits, setSplits] = useState<PlayerSplits[]>([]);
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

        // Fetch adjusted shooting stats
        const adjShootingRes = await fetch(`${API_URL}/players/${player_id}/adjusted_shooting`);
        if (adjShootingRes.ok) {
          const adjShootingData = await adjShootingRes.json();
          setAdjustedShooting(adjShootingData);
        }

        // Fetch game log
        const gameLogRes = await fetch(`${API_URL}/players/${player_id}/gamelog`);
        if (gameLogRes.ok) {
          const gameLogData = await gameLogRes.json();
          setGameLog(gameLogData);
        }

        // Fetch splits
        const splitsRes = await fetch(`${API_URL}/players/${player_id}/splits`);
        if (splitsRes.ok) {
          const splitsData = await splitsRes.json();
          setSplits(splitsData);
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
  const displayedAdjustedShooting = filterStats(adjustedShooting);
  const displayedPbp = filterStats(pbpStats);
  // GameLog and Splits might need different filtering or just show all for now
  // For GameLog, we might want to filter by season if selected, but here we show all?
  // Usually GameLog is per season. The API fetches all?
  // The API `get_player_gamelog` takes `season_id`. If None, it returns all?
  // Let's assume we show all or filter by `showPlayoffs` if `game_type` is available.
  const displayedGameLog = gameLog.filter(log => {
      // Assuming game_type is available on log (from BoxScore)
      // If not, we might need to check.
      // For now, let's just pass it through or implement a simple filter if possible.
      return true; 
  });
  
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
            <Table 
              title="Per Game" 
              schema={TABLE_SCHEMAS.per_game} 
              data={mapToPerGame(displayedStats, player)} 
            />
        </section>

        {/* Totals Stats */}
        <section>
            <Table 
              title="Totals" 
              schema={TABLE_SCHEMAS.totals} 
              data={mapToTotals(displayedStats, player)} 
            />
        </section>

        {/* Per 36 Minutes */}
        <section>
            <Table 
              title="Per 36 Minutes" 
              schema={TABLE_SCHEMAS.per_minute} 
              data={mapToPerMinute(displayedStats, player)} 
            />
        </section>

        {/* Per 100 Possessions */}
        <section>
            <Table 
              title="Per 100 Possessions" 
              schema={TABLE_SCHEMAS.per_poss} 
              data={mapToPerPoss(displayedStats, player)} 
            />
        </section>

        {/* Advanced Stats */}
        <section>
            <Table 
              title="Advanced" 
              schema={TABLE_SCHEMAS.advanced} 
              data={mapToAdvanced(displayedAdvanced, displayedStats, player)} 
            />
        </section>

        {/* Shooting Stats */}
        <section>
            <Table 
              title="Shooting" 
              schema={TABLE_SCHEMAS.shooting} 
              data={mapToShooting(displayedShooting, displayedStats, player)} 
            />
        </section>

        {/* Adjusted Shooting Stats */}
        <section>
            <Table 
              title="Adjusted Shooting" 
              schema={TABLE_SCHEMAS.adj_shooting} 
              data={mapToAdjustedShooting(displayedAdjustedShooting, player)} 
            />
        </section>

        {/* Play-by-Play Stats */}
        <section>
            <Table 
              title="Play-by-Play" 
              schema={TABLE_SCHEMAS.pbp} 
              data={mapToPbp(displayedPbp, displayedStats, player)} 
            />
        </section>

        {/* Game Log */}
        <section>
            <Table 
              title="Game Log" 
              schema={TABLE_SCHEMAS.pgl_basic} 
              data={mapToGameLog(displayedGameLog, player)} 
            />
        </section>

        {/* Splits */}
        <section>
            <Table 
              title="Splits" 
              schema={TABLE_SCHEMAS.splits} 
              data={mapToSplits(splits, player)} 
            />
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
