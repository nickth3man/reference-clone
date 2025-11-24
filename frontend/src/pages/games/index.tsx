import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { fetchAPI } from "@/lib/api";
import { Game } from "../../types";
import { Input, Card, Button, Badge } from "@/components/atoms";

interface GamesIndexProps {
  games: Game[];
  date: string;
}

export const getServerSideProps: GetServerSideProps<GamesIndexProps> = async (context) => {
  // Default to today if no date provided (in a real app), 
  // or a specific date where we know there is data for demo purposes (e.g., start of 2023 season).
  // For now, let's just default to empty if no date, or use the query param.
  const date = (context.query.date as string) || ""; 
  
  let endpoint = "/games?limit=50";
  if (date) {
    endpoint += `&date=${date}`;
  }

  try {
    const games = await fetchAPI<Game[]>(endpoint).catch(() => []);
    return {
      props: { games, date },
    };
  } catch (err) {
    console.error("Error fetching games:", err);
    return { props: { games: [], date } };
  }
};

export default function GamesIndex({ games, date }: GamesIndexProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(date);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    router.push(`/games?date=${newDate}`);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">NBA Games</h1>
          <p className="text-slate-500 mt-1">Scores & Schedule</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="game-date" className="text-sm font-medium text-slate-700">
            Select Date:
          </label>
          <Input
            type="date"
            id="game-date"
            className="w-auto"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <Card variant="bordered" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Away Team</th>
                <th className="px-6 py-3">Home Team</th>
                <th className="px-6 py-3 text-center">Score</th>
                <th className="px-6 py-3 text-right">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {games.map((game) => (
                <tr key={game.game_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">
                    {game.game_date ? new Date(game.game_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <Link href={`/teams/${game.away_team_id}`} className="hover:text-orange-600">
                      {game.away_team_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <Link href={`/teams/${game.home_team_id}`} className="hover:text-orange-600">
                      {game.home_team_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-slate-700">
                    {game.away_team_score} - {game.home_team_score}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/boxscores/${game.game_id}`}>
                       <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                         Box Score
                       </Button>
                    </Link>
                    <Link href={`/games/${game.game_id}`}>
                       <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                         Summary
                       </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {games.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    {date ? `No games found for ${new Date(date).toLocaleDateString()}` : "Select a date to view games"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}
