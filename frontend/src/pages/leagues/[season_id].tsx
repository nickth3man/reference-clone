import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { fetchAPI } from '../../lib/api';
import { Season, Standings } from '../../types';

interface LeaguePageProps {
  season: Season;
  standings: Standings[];
}

export const getServerSideProps: GetServerSideProps<LeaguePageProps> = async (context) => {
  const { season_id } = context.params as { season_id: string };
  try {
    // Run in parallel for speed
    const [season, standings] = await Promise.all([
        fetchAPI<Season>(`/seasons/${season_id}`),
        fetchAPI<Standings[]>(`/seasons/${season_id}/standings`)
    ]);
    
    return {
      props: { season, standings },
    };
  } catch (err) {
    console.error("Error fetching season data:", err);
    return { notFound: true };
  }
};

export default function LeaguePage({ season, standings }: LeaguePageProps) {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Season Header */}
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {season.season_id} NBA Season
              </h2>
              <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                   League: {season.league}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                   Teams: {season.num_teams}
                </div>
                {season.champion_team_id && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        Champion: <span className="font-semibold ml-1">{season.champion_team_id}</span>
                    </div>
                )}
                {season.mvp_player_id && (
                     <div className="mt-2 flex items-center text-sm text-gray-500">
                        MVP: <Link href={`/players/${season.mvp_player_id}`} className="ml-1 text-blue-600 hover:underline">{season.mvp_player_id}</Link>
                    </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
               {/* Place for action buttons if needed */}
            </div>
          </div>
        </div>

        {/* Standings Table */}
        <div className="space-y-4">
             <h3 className="text-xl font-medium leading-6 text-gray-900">Standings</h3>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Rk</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Team</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">W</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">L</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">W/L%</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">GB</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">SRS</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ORtg</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">DRtg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {standings.map((team, index) => (
                      <tr key={team.team_id} className={index < 8 ? "bg-white" : "bg-gray-50"}>
                         <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{index + 1}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                             <Link href={`/teams/${team.team_id}`} className="text-blue-600 hover:underline flex items-center">
                                 {team.logo_url && <img src={team.logo_url} alt="" className="h-5 w-5 mr-2 object-contain" />}
                                 {team.full_name || team.team_id}
                             </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{team.wins}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{team.losses}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{team.win_pct?.toFixed(3)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{team.games_behind}</td>
                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{team.simple_rating_system}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{team.offensive_rating}</td>
                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{team.defensive_rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        </div>
      </div>
    </Layout>
  );
}
