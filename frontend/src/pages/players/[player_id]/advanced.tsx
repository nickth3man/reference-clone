import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { PlayerHeader } from "../../../components/PlayerHeader";
import { PlayerSubNav } from "../../../components/PlayerSubNav";
import { API_URL } from "@/lib/api";
import type { Player, PlayerAdvancedStats, PlayerSeasonStats } from "../../../types";
import Table from "@/components/Table";
import { TABLE_SCHEMAS } from "@/lib/tableSchema";
import { mapToAdvanced } from "@/lib/dataMapper";

export default function PlayerAdvancedPage() {
  const router = useRouter();
  const { player_id } = router.query;
  const [player, setPlayer] = useState<Player | null>(null);
  const [basicStats, setBasicStats] = useState<PlayerSeasonStats[]>([]);
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

        // Fetch basic stats for context (G/MP/league/team)
        const basicRes = await fetch(`${API_URL}/players/${player_id}/stats`);
        if (basicRes.ok) {
          const basicData = await basicRes.json();
          setBasicStats(basicData);
        }

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
        <Table
          title=""
          schema={TABLE_SCHEMAS.advanced}
          data={mapToAdvanced(stats, basicStats, player)}
        />
        {stats.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No advanced stats available for this player.
          </div>
        )}
      </div>
    </Layout>
  );
}
