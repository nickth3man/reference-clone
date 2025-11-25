import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import type { Team, Player, Game, TeamSeasonStats } from "@/types";
import { Card, Button, Badge } from "@/components/atoms";
// import { Calendar, MapPin, Users } from 'lucide-react';

interface TeamPageProps {
  team: Team | null;
  roster: Player[];
  games: Game[];
  stats: TeamSeasonStats[];
}

export const getServerSideProps: GetServerSideProps<TeamPageProps> = async (context) => {
  const { team_id } = context.params!;

  try {
    const [team, roster, games, stats] = await Promise.all([
      fetchAPI<Team>(`/teams/${team_id}`).catch(() => null),
      fetchAPI<Player[]>(`/teams/${team_id}/roster`).catch(() => []),
      fetchAPI<Game[]>(`/games?team_id=${team_id}`).catch(() => []),
      fetchAPI<TeamSeasonStats[]>(`/teams/${team_id}/stats`).catch(() => []),
    ]);

    return {
      props: {
        team,
        roster,
        games,
        stats,
      },
    };
  } catch (error) {
    console.error("Failed to fetch team data:", error);
    return {
      props: {
        team: null,
        roster: [],
        games: [],
        stats: [],
      },
    };
  }
};

export default function TeamPage({ team, roster, games, stats }: TeamPageProps) {
  const router = useRouter();

  if (!team) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-700">Team not found</h2>
        <Button
          variant="ghost"
          onClick={() => router.push("/teams")}
          className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
        >
          &larr; Back to Teams
        </Button>
      </div>
    );
  }

  // Get latest season stats
  const currentStats = stats.length > 0 ? stats[0] : null;

  return (
    <div className="space-y-8">
      {/* Team Header */}
      <Card padding="none" rounded="xl" className="overflow-hidden border-slate-100">
        <div className="bg-slate-900 h-32 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="h-32 w-32 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden border-4 border-white relative">
              {team.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={team.logo_url} alt={team.full_name} className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-4xl font-bold text-slate-800">{team.abbreviation}</span>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-4xl font-bold text-slate-900">
                {team.city} {team.nickname}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-slate-500">
                <div className="flex items-center gap-1">
                  <span>
                    {team.city}, {team.state}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Est. {team.founded_year}</span>
                </div>
                {team.conference && (
                    <div className="flex items-center gap-1">
                        <Badge variant="secondary">{team.conference}</Badge>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Team Stats Summary */}
      {currentStats && (
        <Card padding="none" rounded="xl" className="overflow-hidden border-slate-100">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Team Stats ({currentStats.season_id})</h2>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
             <div className="text-center">
                <p className="text-sm text-gray-500">Record</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.wins}-{currentStats.losses}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">Win %</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.win_pct?.toFixed(3)}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">PPG</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.points_per_game}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">Opp PPG</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.opponent_points_per_game}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">SRS</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.simple_rating_system}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">Pace</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.pace}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">Off Rtg</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.offensive_rating}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">Def Rtg</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.defensive_rating}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">Net Rtg</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.net_rating}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">eFG%</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.effective_fg_pct}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">TOV%</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.turnover_pct}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">ORB%</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.offensive_rebound_pct}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-gray-500">FT%</p>
                <p className="text-lg font-bold text-gray-900">{currentStats.free_throw_pct}</p>
             </div>
          </div>
        </Card>
      )}

      {/* Franchise History */}
      <Card padding="none" rounded="xl" className="overflow-hidden border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Franchise History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium">Season</th>
                <th className="px-4 py-3 font-medium">Lg</th>
                <th className="px-4 py-3 font-medium">Team</th>
                <th className="px-4 py-3 font-medium text-right">W</th>
                <th className="px-4 py-3 font-medium text-right">L</th>
                <th className="px-4 py-3 font-medium text-right">W/L%</th>
                <th className="px-4 py-3 font-medium">Finish</th>
                <th className="px-4 py-3 font-medium">Playoffs</th>
                <th className="px-4 py-3 font-medium text-right">Pace</th>
                <th className="px-4 py-3 font-medium text-right">ORtg</th>
                <th className="px-4 py-3 font-medium text-right">DRtg</th>
                <th className="px-4 py-3 font-medium text-right">SRS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.map((stat) => (
                <tr key={stat.season_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">
                        {stat.season_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500">NBA</td>
                  <td className="px-4 py-3 text-slate-900">{team.full_name}</td>
                  <td className="px-4 py-3 text-right text-slate-900">{stat.wins}</td>
                  <td className="px-4 py-3 text-right text-slate-900">{stat.losses}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{stat.win_pct?.toFixed(3)}</td>
                  <td className="px-4 py-3 text-slate-500">
                      {stat.conference_rank ? `${stat.conference_rank}th` : "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                      {stat.playoff_seed ? `Seed ${stat.playoff_seed}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">{stat.pace}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{stat.offensive_rating}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{stat.defensive_rating}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{stat.simple_rating_system}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Roster */}
      <Card padding="none" rounded="xl" className="overflow-hidden border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Team Roster
          </h2>
          <Badge variant="default">{roster.length} Players</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium w-16"></th>
                <th className="px-6 py-3 font-medium">Player</th>
                <th className="px-6 py-3 font-medium">Pos</th>
                <th className="px-6 py-3 font-medium">Height</th>
                <th className="px-6 py-3 font-medium">Weight</th>
                <th className="px-6 py-3 font-medium">Exp</th>
                <th className="px-6 py-3 font-medium">College</th>
                <th className="px-6 py-3 font-medium">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roster.map((player) => (
                <tr
                  key={player.player_id}
                  onClick={() => router.push(`/players/${player.player_id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                     <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        {player.headshot_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={player.headshot_url} alt={player.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                                {player.full_name?.charAt(0)}
                            </div>
                        )}
                     </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-600 hover:underline">{player.full_name}</td>
                  <td className="px-6 py-4 text-slate-500">{player.position}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {player.height_inches
                      ? `${Math.floor(player.height_inches / 12)}'${player.height_inches % 12}"`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {player.weight_lbs ? `${player.weight_lbs} lbs` : "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{player.experience_years}</td>
                  <td className="px-6 py-4 text-slate-500">{player.college}</td>
                  <td className="px-6 py-4 text-slate-500">{player.birth_country}</td>
                </tr>
              ))}
              {roster.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No roster data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Schedule */}
      <Card padding="none" rounded="xl" className="overflow-hidden border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Game Schedule
          </h2>
          <Badge variant="default">{games.length} Games</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Opponent</th>
                <th className="px-6 py-3 font-medium">Result</th>
                <th className="px-6 py-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {games.map((game) => {
                const isHome = game.home_team_id === team.team_id;
                const opponentId = isHome ? game.away_team_id : game.home_team_id;
                const win = isHome
                  ? game.home_team_score! > game.away_team_score!
                  : game.away_team_score! > game.home_team_score!;
                // We don't have opponent name here easily, so show ID for now or just At/Vs
                const label = isHome ? "vs " + opponentId : "@ " + opponentId;

                // Line Score Logic (simplified)
                // Assuming line scores (q1-q4) are available in game object
                const teamQ1 = isHome ? game.home_q1 : game.away_q1;
                const teamQ2 = isHome ? game.home_q2 : game.away_q2;
                const teamQ3 = isHome ? game.home_q3 : game.away_q3;
                const teamQ4 = isHome ? game.home_q4 : game.away_q4;
                
                const oppQ1 = isHome ? game.away_q1 : game.home_q1;
                const oppQ2 = isHome ? game.away_q2 : game.home_q2;
                const oppQ3 = isHome ? game.away_q3 : game.home_q3;
                const oppQ4 = isHome ? game.away_q4 : game.home_q4;

                return (
                  <tr
                    key={game.game_id}
                    onClick={() => router.push(`/boxscores/${game.game_id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-900">{game.game_date}</td>
                    <td className="px-6 py-4 text-slate-900">{label}</td>
                    <td className="px-6 py-4">
                      <Badge variant={win ? "success" : "error"}>
                        {win ? "W" : "L"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{game.home_team_score} - {game.away_team_score}</span>
                        {/* Line Score Display if available */}
                        {(teamQ1 !== undefined && oppQ1 !== undefined) && (
                           <span className="text-xs text-gray-400 mt-1">
                             ({teamQ1}-{teamQ2}-{teamQ3}-{teamQ4}) vs ({oppQ1}-{oppQ2}-{oppQ3}-{oppQ4})
                           </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {games.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No games found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
