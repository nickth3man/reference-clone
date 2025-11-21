import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

// Define types based on backend models
interface Player {
  person_id: string;
  display_first_last: string;
  team_name: string;
  team_id: string;
  position: string;
  height: string;
  weight: string;
  birthdate: string;
  school: string;
  country: string;
  jersey: string;
  from_year: number;
  to_year: number;
}

interface PlayerStats {
  season_id: string;
  team_id: string;
  pts_per_game: number;
  ast_per_game: number;
  trb_per_game: number;
  stl_per_game: number;
  blk_per_game: number;
  fg_percent: number;
  x3p_percent: number;
  ft_percent: number;
  games_played: number;
  games_started: number;
  minutes_per_game: number;
}

export default function PlayerPage() {
  const router = useRouter();
  const { player_id } = router.query;
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!player_id) return;

    const fetchData = async () => {
      try {
        // Fetch player details
        const playerRes = await fetch(`http://localhost:8001/players/${player_id}`);
        if (!playerRes.ok) throw new Error('Failed to fetch player details');
        const playerData = await playerRes.json();
        setPlayer(playerData);

        // Fetch player stats
        const statsRes = await fetch(`http://localhost:8001/players/${player_id}/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load player data');
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
          <p className="mt-2">{error || 'Player not found'}</p>
          <Link href="/players" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Players
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-500">
              {player.display_first_last.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{player.display_first_last}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-gray-600">
                {player.team_name && (
                  <span className="flex items-center">
                    Team: <Link href={`/teams/${player.team_id}`} className="text-blue-600 hover:underline ml-1">{player.team_name}</Link>
                  </span>
                )}
                {player.position && <span>Position: {player.position}</span>}
                {player.jersey && <span>Jersey: #{player.jersey}</span>}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                {player.height && <span>Height: {player.height}</span>}
                {player.weight && <span>Weight: {player.weight}lbs</span>}
                {player.birthdate && <span>Born: {new Date(player.birthdate).toLocaleDateString()}</span>}
                {player.school && <span>College: {player.school}</span>}
                {player.country && <span>Country: {player.country}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Season Stats</h2>
        <div className="bg-white shadow overflow-hidden rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MPG</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PTS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AST</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BLK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FG%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3P%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FT%</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.season_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">
                      {stat.team_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.games_played}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.games_started}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.minutes_per_game}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{stat.pts_per_game}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.trb_per_game}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.ast_per_game}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.stl_per_game}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.blk_per_game}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.fg_percent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.x3p_percent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.ft_percent}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.length === 0 && (
            <div className="p-4 text-center text-gray-500">No stats available for this player.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
