import { useState, useEffect } from "react";
import Link from "next/link";
import { Game } from "@/types";
import { Card } from "@/components/atoms";
import { fetchAPI } from "@/lib/api";

interface ScoreboardProps {
  games: Game[];
}

export const Scoreboard = ({ games: initialGames }: ScoreboardProps) => {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (initialGames && initialGames.length > 0 && initialGames[0].game_date) {
      return new Date(initialGames[0].game_date);
    }
    return new Date();
  });
  const [loading, setLoading] = useState(false);

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = async (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
    setLoading(true);

    try {
      const dateStr = formatDateForAPI(newDate);
      const data = await fetchAPI<Game[]>(`/games?date=${dateStr}`);
      setGames(data || []);
    } catch (error) {
      console.error("Failed to fetch games", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const displayDate = selectedDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
            {displayDate}
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleDateChange(-1)}
              className="px-2 py-1 text-xs font-medium bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600"
            >
              &larr; Prev
            </button>
            <button 
              onClick={() => handleDateChange(1)}
              className="px-2 py-1 text-xs font-medium bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600"
            >
              Next &rarr;
            </button>
          </div>
        </div>
        <Link href="/games" className="text-sm font-medium text-orange-600 hover:text-orange-700">
          View Full Schedule &rarr;
        </Link>
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 min-h-[100px]">
        {loading ? (
           <div className="w-full flex items-center justify-center text-slate-400 text-sm italic">
             Loading scores...
           </div>
        ) : games.length === 0 ? (
          <div className="w-full flex items-center justify-center text-slate-400 text-sm italic border border-dashed border-slate-300 rounded-lg p-4">
            No games scheduled for this date.
          </div>
        ) : (
          games.map((game) => (
            <Link key={game.game_id} href={`/boxscores/${game.game_id}`} className="shrink-0">
              <Card 
                padding="sm" 
                className="w-48 hover:shadow-md transition-shadow border-slate-200 cursor-pointer bg-white"
              >
                <div className="flex flex-col space-y-3">
                  {/* Away Team */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-700 text-sm">{game.away_team_id}</span>
                    </div>
                    <span className={`text-sm ${
                      (game.away_team_score || 0) > (game.home_team_score || 0) 
                        ? "font-bold text-slate-900" 
                        : "text-slate-500"
                    }`}>
                      {game.away_team_score}
                    </span>
                  </div>

                  {/* Home Team */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-700 text-sm">{game.home_team_id}</span>
                    </div>
                    <span className={`text-sm ${
                      (game.home_team_score || 0) > (game.away_team_score || 0) 
                        ? "font-bold text-slate-900" 
                        : "text-slate-500"
                    }`}>
                      {game.home_team_score}
                    </span>
                  </div>

                  {/* Footer / Status */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-400 text-center flex justify-between">
                    <span>Final</span>
                    <span className="text-orange-600 hover:underline">Box Score</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

