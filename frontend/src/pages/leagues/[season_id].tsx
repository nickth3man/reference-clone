import { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "../../components/Layout";
import { fetchAPI } from "../../lib/api";
import { Season, StandingsItem, SeasonLeaders, Award, PlayoffSeries } from "../../types";

interface LeaguePageProps {
  season: Season;
  standings: StandingsItem[];
  leaders: SeasonLeaders;
  awards: Award[];
  playoffSeries: PlayoffSeries[];
}

export const getServerSideProps: GetServerSideProps<LeaguePageProps> = async (context) => {
  const { season_id } = context.params as { season_id: string };
  try {
    // Run in parallel for speed
    const [season, standings, leaders, awards, playoffSeries] = await Promise.all([
      fetchAPI<Season>(`/seasons/${season_id}`),
      fetchAPI<StandingsItem[]>(`/seasons/${season_id}/standings`),
      fetchAPI<SeasonLeaders>(`/seasons/${season_id}/leaders`),
      fetchAPI<Award[]>(`/seasons/${season_id}/awards`).catch(() => []),
      fetchAPI<PlayoffSeries[]>(`/seasons/${season_id}/playoffs`).catch(() => []),
    ]);

    return {
      props: { season, standings, leaders, awards, playoffSeries },
    };
  } catch (err) {
    console.error("Error fetching season data:", err);
    return { notFound: true };
  }
};

export default function LeaguePage({ season, standings, leaders, awards, playoffSeries }: LeaguePageProps) {
  // Group standings by Conference
  const eastStandings = standings.filter(t => t.conference === "Eastern" || t.conference === "East");
  const westStandings = standings.filter(t => t.conference === "Western" || t.conference === "West");

  // Helper for Leader Table
  const LeaderTable = ({ title, data, unit }: { title: string, data: any[], unit: string }) => (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 uppercase">{title} ({unit})</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {data.map((leader, idx) => (
          <li key={leader.player_id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
               <span className="text-gray-500 w-6">{idx + 1}.</span>
               {/* eslint-disable-next-line @next/next/no-img-element */}
               {leader.headshot_url && <img src={leader.headshot_url} className="w-8 h-8 rounded-full mr-2 bg-gray-100" alt="" />}
               <Link href={`/players/${leader.player_id}`} className="text-blue-600 hover:underline text-sm font-medium">
                 {leader.full_name}
               </Link>
               <span className="text-gray-400 text-xs ml-2">({leader.team_id})</span>
            </div>
            <span className="font-bold text-gray-900">{leader.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const StandingsTable = ({ title, data }: { title: string, data: StandingsItem[] }) => (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      </div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-6">Team</th>
            <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
            <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
            <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">W/L%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">GB</th>
            <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">SRS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((team, index) => (
            <tr key={team.team_id} className={index < 8 ? "bg-white" : "bg-gray-50"}>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                <Link href={`/teams/${team.team_id}`} className="text-blue-600 hover:underline flex items-center">
                  {team.full_name || team.team_id}
                  {/* Not adding seed here as StandingsItem might not have it populated for all logic, relying on order */}
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-right">{team.wins}</td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-right">{team.losses}</td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-right">{team.win_pct?.toFixed(3)}</td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-right">{team.games_behind}</td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-right">{team.simple_rating_system}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                 <div><span className="font-semibold">League:</span> {season.league}</div>
                 <div><span className="font-semibold">Teams:</span> {season.num_teams}</div>
                 {season.champion_team_id && (
                    <div><span className="font-semibold">Champion:</span> {season.champion_team_id}</div>
                 )}
                 {season.mvp_player_id && (
                    <div>
                        <span className="font-semibold">MVP:</span>{" "}
                        <Link href={`/players/${season.mvp_player_id}`} className="text-blue-600 hover:underline">
                            {season.mvp_player_id}
                        </Link>
                    </div>
                 )}
                 {season.roy_player_id && (
                    <div>
                        <span className="font-semibold">ROY:</span>{" "}
                        <Link href={`/players/${season.roy_player_id}`} className="text-blue-600 hover:underline">
                            {season.roy_player_id}
                        </Link>
                    </div>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Playoff Series */}
        {playoffSeries && playoffSeries.length > 0 && (
            <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">Playoffs</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {playoffSeries.map((series) => {
                             const winner = series.winner_team_id;
                             const loser = winner === series.higher_seed_team_id ? series.lower_seed_team_id : series.higher_seed_team_id;
                             const winnerWins = winner === series.higher_seed_team_id ? series.higher_seed_wins : series.lower_seed_wins;
                             const loserWins = winner === series.higher_seed_team_id ? series.lower_seed_wins : series.higher_seed_wins;

                             return (
                            <li key={series.series_id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-indigo-600 truncate uppercase tracking-wide">
                                            {series.round}
                                        </span>
                                        <div className="mt-2 flex items-center text-sm text-gray-700">
                                            <Link href={`/teams/${winner}`} className="font-bold mr-2 hover:underline text-gray-900">{winner}</Link>
                                            <span className="mx-1">over</span>
                                            <Link href={`/teams/${loser}`} className="font-bold ml-2 hover:underline text-gray-900">{loser}</Link>
                                            <span className="ml-2 text-gray-500">
                                                ({winnerWins}-{loserWins})
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        )}

        {/* Leaders Grid */}
        <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900">League Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaders.pts && <LeaderTable title="Points Per Game" data={leaders.pts} unit="PPG" />}
                {leaders.trb && <LeaderTable title="Rebounds Per Game" data={leaders.trb} unit="RPG" />}
                {leaders.ast && <LeaderTable title="Assists Per Game" data={leaders.ast} unit="APG" />}
                {leaders.ws && <LeaderTable title="Win Shares" data={leaders.ws} unit="WS" />}
                {leaders.per && <LeaderTable title="Player Efficiency Rating" data={leaders.per} unit="PER" />}
            </div>
        </div>

        {/* Standings Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StandingsTable title="Eastern Conference" data={eastStandings} />
            <StandingsTable title="Western Conference" data={westStandings} />
        </div>
        
      </div>
    </Layout>
  );
}
