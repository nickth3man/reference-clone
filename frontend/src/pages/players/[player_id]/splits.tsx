import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { PlayerHeader } from "../../../components/PlayerHeader";
import { PlayerSubNav } from "../../../components/PlayerSubNav";
import { API_URL } from "@/lib/api";
import type { Player, PlayerSplits } from "../../../types";
import Table from "@/components/Table";
import { TABLE_SCHEMAS } from "@/lib/tableSchema";
import { mapToSplits } from "@/lib/dataMapper";

export default function PlayerSplitsPage() {
  const router = useRouter();
  const { player_id, season } = router.query;
  const [player, setPlayer] = useState<Player | null>(null);
  const [splits, setSplits] = useState<PlayerSplits[]>([]);
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

        // Fetch splits
        let url = `${API_URL}/players/${player_id}/splits`;
        if (season) {
          url += `?season_id=${season}`;
        }

        const splitsRes = await fetch(url);
        if (splitsRes.ok) {
          const splitsData = await splitsRes.json();
          setSplits(splitsData);
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

  // Group splits by type
  const groupedSplits = splits.reduce(
    (acc, split) => {
      if (!acc[split.split_type]) {
        acc[split.split_type] = [];
      }
      acc[split.split_type].push(split);
      return acc;
    },
    {} as Record<string, PlayerSplits[]>
  );

  const splitTypes = Object.keys(groupedSplits).sort();

  return (
    <Layout>
      <PlayerHeader player={player} />

      <div className="container mx-auto px-4 py-8">
        <PlayerSubNav playerId={player.player_id} activeTab="splits" />

        <h2 className="text-2xl font-bold mb-4">Splits</h2>

        {splits.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No splits available.</div>
        ) : (
          splitTypes.map((type) => (
            <div key={type} className="mb-8">
              <h3 className="text-lg font-bold mb-2 text-gray-700">{type}</h3>
              <Table
                title=""
                schema={TABLE_SCHEMAS.splits}
                data={mapToSplits(groupedSplits[type], player)}
              />
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
