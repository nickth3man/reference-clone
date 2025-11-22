import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { fetchAPI } from '../../lib/api';
import { Game } from '../../types';

interface GamesIndexProps {
  games: Game[];
}

export const getServerSideProps: GetServerSideProps<GamesIndexProps> = async () => {
  try {
    const games = await fetchAPI<Game[]>('/games?limit=50').catch(() => []);
    return {
      props: { games },
    };
  } catch (err) {
    console.error("Error fetching games:", err);
    return { props: { games: [] } };
  }
};

export default function GamesIndex({ games }: GamesIndexProps) {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Recent Games</h1>
        
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Matchup</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Score</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {games.map((game) => (
                <tr key={game.game_id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {game.game_date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                     <Link href={`/teams/${game.away_team_id}`} className="hover:underline">{game.away_team_id}</Link> @ <Link href={`/teams/${game.home_team_id}`} className="hover:underline">{game.home_team_id}</Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {game.away_team_score} - {game.home_team_score}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-600">
                    <Link href={`/boxscores/${game.game_id}`} className="hover:underline hover:text-blue-800 font-semibold mr-4">
                        Box Score
                    </Link>
                    <Link href={`/games/${game.game_id}`} className="hover:underline hover:text-blue-800">
                        Summary
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
