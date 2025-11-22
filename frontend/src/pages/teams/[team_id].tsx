import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
// import { Calendar, MapPin, Users } from 'lucide-react';

interface Team {
  team_id: string;
  nickname: string;
  abbreviation: string;
  city: string;
  full_name: string;
  state: string;
  year_founded: number;
}

interface Player {
  person_id: string;
  display_first_last: string;
  position: string;
  height: string;
  weight: string;
  jersey: string;
  birthdate: string;
  country: string;
}

interface TeamPageProps {
  team: Team | null;
  roster: Player[];
}

export const getServerSideProps: GetServerSideProps<TeamPageProps> = async (context) => {
  const { team_id } = context.params!;

  try {
    const [team, roster] = await Promise.all([
      fetchAPI<Team>(`/teams/${team_id}`).catch(() => null),
      fetchAPI<Player[]>(`/teams/${team_id}/players`).catch(() => []),
    ]);

    return {
      props: {
        team,
        roster,
      },
    };
  } catch (error) {
    console.error("Failed to fetch team data:", error);
    return {
      props: {
        team: null,
        roster: [],
      },
    };
  }
};

export default function TeamPage({ team, roster }: TeamPageProps) {
  const router = useRouter();

  if (!team) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-700">Team not found</h2>
        <button
          onClick={() => router.push("/teams")}
          className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
        >
          &larr; Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 h-32 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="h-32 w-32 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl font-bold text-slate-800 border-4 border-white">
              {team.abbreviation}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-4xl font-bold text-slate-900">
                {team.city} {team.nickname}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-slate-500">
                <div className="flex items-center gap-1">
                  {/* <MapPin className="h-4 w-4" /> */}
                  <span>
                    {team.city}, {team.state}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {/* <Calendar className="h-4 w-4" /> */}
                  <span>Est. {team.year_founded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roster */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {/* <Users className="h-5 w-5 text-orange-500" /> */}
            Team Roster
          </h2>
          <span className="text-sm text-slate-500">{roster.length} Players</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">Player</th>
                <th className="px-6 py-3 font-medium">Jersey</th>
                <th className="px-6 py-3 font-medium">Pos</th>
                <th className="px-6 py-3 font-medium">Height</th>
                <th className="px-6 py-3 font-medium">Weight</th>
                <th className="px-6 py-3 font-medium">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roster.map((player) => (
                <tr
                  key={player.person_id}
                  onClick={() => router.push(`/players/${player.person_id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {player.display_first_last}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono">{player.jersey || "-"}</td>
                  <td className="px-6 py-4 text-slate-500">{player.position}</td>
                  <td className="px-6 py-4 text-slate-500">{player.height}</td>
                  <td className="px-6 py-4 text-slate-500">{player.weight} lbs</td>
                  <td className="px-6 py-4 text-slate-500">{player.country}</td>
                </tr>
              ))}
              {roster.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No roster data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
