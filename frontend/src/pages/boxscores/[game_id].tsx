import { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "../../components/Layout";
import { fetchAPI } from "../../lib/api";
import { BoxScore, Game, Team } from "../../types";

interface BoxScorePageProps {
  game: Game;
  boxScores: BoxScore[];
  homeTeam: Team;
  awayTeam: Team;
}

export const getServerSideProps: GetServerSideProps<BoxScorePageProps> = async (context) => {
  const { game_id } = context.params as { game_id: string };
  try {
    const game = await fetchAPI<Game>(`/games/${game_id}`);
    const boxScores = await fetchAPI<BoxScore[]>(`/boxscores/${game_id}`);

    // Fetch team details to display names properly
    const [homeTeam, awayTeam] = await Promise.all([
      fetchAPI<Team>(`/teams/${game.home_team_id}`),
      fetchAPI<Team>(`/teams/${game.away_team_id}`),
    ]);

    return {
      props: { game, boxScores, homeTeam, awayTeam },
    };
  } catch (err) {
    console.error("Error fetching boxscore data:", err);
    return { notFound: true };
  }
};

const calculateTS = (pts: number | undefined, fga: number | undefined, fta: number | undefined) => {
  const p = pts || 0;
  const a = fga || 0;
  const ft = fta || 0;
  if (a === 0 && ft === 0) return "-";
  const val = p / (2 * (a + 0.44 * ft));
  return val.toFixed(3);
};

const calculateEFG = (fgm: number | undefined, fga: number | undefined, tpm: number | undefined) => {
  const m = fgm || 0;
  const a = fga || 0;
  const t = tpm || 0;
  if (a === 0) return "-";
  const val = (m + 0.5 * t) / a;
  return val.toFixed(3);
};

const pct = (made?: number, att?: number) => {
  if (!att) return "-";
  return (made ?? 0) / att;
};

const otColumns = (game: Game) => {
  const keys = [
    { key: "ot1", home: game.home_ot1, away: game.away_ot1 },
    { key: "ot2", home: game.home_ot2, away: game.away_ot2 },
    { key: "ot3", home: game.home_ot3, away: game.away_ot3 },
    { key: "ot4", home: game.home_ot4, away: game.away_ot4 },
  ];
  return keys.filter(k => k.home !== null && k.home !== undefined && k.away !== null && k.away !== undefined);
};

const StatTable = ({ team, players }: { team: Team; players: BoxScore[] }) => (
  <div className="mt-8">
    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
      <Link href={`/teams/${team.team_id}`} className="hover:underline text-blue-800">
        {team.city} {team.nickname}
      </Link>
    </h3>
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Player
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              MP
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              FG
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              FGA
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              3P
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              3PA
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              3P%
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              FT
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              FTA
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              FT%
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              ORB
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              DRB
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              TRB
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              AST
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              STL
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              BLK
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              TOV
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              PF
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              PTS
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              +/-
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              TS%
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              eFG%
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {players.map((player) => (
            <tr key={player.player_id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                <Link
                  href={`/players/${player.player_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {player.full_name}
                </Link>
              </td>
              {player.did_not_play ? (
                <td colSpan={20} className="px-3 py-4 text-sm text-gray-500 text-center italic">
                  Did Not Play {player.dnp_reason ? `(${player.dnp_reason})` : ""}
                </td>
              ) : (
                <>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.minutes_played}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.field_goals_made}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.field_goals_attempted}
                  </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                  {pct(player.field_goals_made, player.field_goals_attempted) !== "-" ? pct(player.field_goals_made, player.field_goals_attempted).toFixed(3) : "-"}
                </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.three_pointers_made}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.three_pointers_attempted}
                  </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                  {pct(player.three_pointers_made, player.three_pointers_attempted) !== "-" ? pct(player.three_pointers_made, player.three_pointers_attempted).toFixed(3) : "-"}
                </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.free_throws_made}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.free_throws_attempted}
                  </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                  {pct(player.free_throws_made, player.free_throws_attempted) !== "-" ? pct(player.free_throws_made, player.free_throws_attempted).toFixed(3) : "-"}
                </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.offensive_rebounds}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.defensive_rebounds}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.total_rebounds}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.assists}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.steals}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.blocks}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.turnovers}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.personal_fouls}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-bold text-right">
                    {player.points}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {player.plus_minus}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {calculateTS(player.points, player.field_goals_attempted, player.free_throws_attempted)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    {calculateEFG(player.field_goals_made, player.field_goals_attempted, player.three_pointers_made)}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdvancedTable = ({ team, players }: { team: Team; players: BoxScore[] }) => (
  <div className="mt-8">
    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
      <Link href={`/teams/${team.team_id}`} className="hover:underline text-blue-800">
        {team.city} {team.nickname} — Advanced
      </Link>
    </h3>
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Player
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">MP</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">TS%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">eFG%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">3PAr</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">FTr</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">ORB%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">DRB%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">TRB%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">AST%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">STL%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">BLK%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">TOV%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">USG%</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">ORtg</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">DRtg</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">BPM</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {players.map((player) => (
            <tr key={`${player.player_id}-adv`}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                <Link
                  href={`/players/${player.player_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {player.full_name}
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.minutes_played}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.true_shooting_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.effective_fg_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.three_point_attempt_rate}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.free_throw_rate}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.offensive_rebound_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.defensive_rebound_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.total_rebound_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.assist_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.steal_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.block_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.turnover_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.usage_pct}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.offensive_rating}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.defensive_rating}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{player.box_plus_minus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function BoxScorePage({ game, boxScores, homeTeam, awayTeam }: BoxScorePageProps) {
  // Filter players by team
  const homePlayers = boxScores.filter((p) => p.team_id === game.home_team_id);
  const awayPlayers = boxScores.filter((p) => p.team_id === game.away_team_id);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Scoreboard */}
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 text-center">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                <Link href={`/teams/${awayTeam.team_id}`} className="hover:underline text-gray-900">
                  {awayTeam.abbreviation}
                </Link>
              </h2>
              <p className="text-4xl font-bold mt-2 text-gray-900">{game.away_team_score}</p>
            </div>
            <div className="text-sm text-gray-500">
              <div>{game.game_date}</div>
              <div>{game.arena}</div>
              <div className="mt-1 font-semibold">Final</div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                <Link href={`/teams/${homeTeam.team_id}`} className="hover:underline text-gray-900">
                  {homeTeam.abbreviation}
                </Link>
              </h2>
              <p className="text-4xl font-bold mt-2 text-gray-900">{game.home_team_score}</p>
            </div>
          </div>

          {/* Line Score (with OT if available) */}
          <div className="mt-6 flex justify-center">
            <table className="border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-1"></th>
                  <th className="border border-gray-200 px-3 py-1">1</th>
                  <th className="border border-gray-200 px-3 py-1">2</th>
                  <th className="border border-gray-200 px-3 py-1">3</th>
                  <th className="border border-gray-200 px-3 py-1">4</th>
                  {otColumns(game).map((ot, idx) => (
                    <th key={ot.key} className="border border-gray-200 px-3 py-1">{`OT${idx + 1}`}</th>
                  ))}
                  <th className="border border-gray-200 px-3 py-1 font-bold">T</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-1 font-semibold">
                    {awayTeam.abbreviation}
                  </td>
                  <td className="border border-gray-200 px-3 py-1">{game.away_q1}</td>
                  <td className="border border-gray-200 px-3 py-1">{game.away_q2}</td>
                  <td className="border border-gray-200 px-3 py-1">{game.away_q3}</td>
                  <td className="border border-gray-200 px-3 py-1">{game.away_q4}</td>
                  {otColumns(game).map((_, idx) => (
                    <td key={`away-ot-${idx}`} className="border border-gray-200 px-3 py-1">
                      {(game as any)[`away_ot${idx + 1}`]}
                    </td>
                  ))}
                  <td className="border border-gray-200 px-3 py-1 font-bold">
                    {game.away_team_score}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-1 font-semibold">
                    {homeTeam.abbreviation}
                  </td>
                  <td className="border border-gray-200 px-3 py-1">{game.home_q1}</td>
                  <td className="border border-gray-200 px-3 py-1">{game.home_q2}</td>
                  <td className="border border-gray-200 px-3 py-1">{game.home_q3}</td>
                  <td className="border border-gray-200 px-3 py-1">{game.home_q4}</td>
                  {otColumns(game).map((_, idx) => (
                    <td key={`home-ot-${idx}`} className="border border-gray-200 px-3 py-1">
                      {(game as any)[`home_ot${idx + 1}`]}
                    </td>
                  ))}
                  <td className="border border-gray-200 px-3 py-1 font-bold">
                    {game.home_team_score}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Box Scores */}
        <StatTable team={awayTeam} players={awayPlayers} />
        <StatTable team={homeTeam} players={homePlayers} />
        <AdvancedTable team={awayTeam} players={awayPlayers} />
        <AdvancedTable team={homeTeam} players={homePlayers} />
      </div>
    </Layout>
  );
}
