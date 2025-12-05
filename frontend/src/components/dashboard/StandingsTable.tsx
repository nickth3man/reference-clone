import React from "react";
import Link from "next/link";
import { StandingsItem } from "../../types";

interface StandingsTableProps {
  title: string;
  standings: StandingsItem[];
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ title, standings }) => {
  return (
    <div className="border border-gray-300 bg-white shadow-sm text-sm">
      <div className="bg-gray-100 px-2 py-1 font-bold border-b border-gray-300 text-center">
        {title} Standings
      </div>
      <table className="w-full table-auto">
        <thead className="bg-gray-50 text-xs text-gray-600 border-b border-gray-200">
          <tr>
            <th className="px-2 py-1 text-left">Rk</th>
            <th className="px-2 py-1 text-left">Team</th>
            <th className="px-2 py-1 text-right">W</th>
            <th className="px-2 py-1 text-right">L</th>
            <th className="px-2 py-1 text-right">W%</th>
            <th className="px-2 py-1 text-right" title="Games Behind">GB</th>
            <th className="px-2 py-1 text-right" title="Points Per Game">PS/G</th>
            <th className="px-2 py-1 text-right" title="Opponent Points Per Game">PA/G</th>
            <th className="px-2 py-1 text-right" title="Simple Rating System">SRS</th>
            <th className="px-2 py-1 text-right" title="Pace">Pace</th>
            <th className="px-2 py-1 text-right" title="Offensive Rating">OffRtg</th>
            <th className="px-2 py-1 text-right" title="Defensive Rating">DefRtg</th>
            <th className="px-2 py-1 text-right" title="Net Rating">NetRtg</th>
          <th className="px-2 py-1 text-right" title="Points Per Game">PTS</th>
          <th className="px-2 py-1 text-right" title="Opponent Points Per Game">Opp PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.team_id} className="border-b border-gray-100 hover:bg-blue-50">
              <td className="px-2 py-1 text-gray-500">{index + 1}</td>
              <td className="px-2 py-1 font-medium text-blue-700 hover:underline">
                <Link href={`/teams/${team.team_id}`}>
                  {team.full_name}
                </Link>
              </td>
              <td className="px-2 py-1 text-right">{team.wins}</td>
              <td className="px-2 py-1 text-right">{team.losses}</td>
              <td className="px-2 py-1 text-right">{(team.win_pct || 0).toFixed(3)}</td>
              <td className="px-2 py-1 text-right">{team.games_behind ?? "-"}</td>
              <td className="px-2 py-1 text-right">{team.points_per_game?.toFixed(1)}</td>
              <td className="px-2 py-1 text-right">{team.opponent_points_per_game?.toFixed(1)}</td>
              <td className="px-2 py-1 text-right">{team.simple_rating_system?.toFixed(2)}</td>
              <td className="px-2 py-1 text-right">{team.pace?.toFixed(1)}</td>
              <td className="px-2 py-1 text-right">{team.offensive_rating?.toFixed(1)}</td>
              <td className="px-2 py-1 text-right">{team.defensive_rating?.toFixed(1)}</td>
              <td className="px-2 py-1 text-right">{team.net_rating?.toFixed(1)}</td>
            <td className="px-2 py-1 text-right">{team.points_per_game?.toFixed(1)}</td>
            <td className="px-2 py-1 text-right">{team.opponent_points_per_game?.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

