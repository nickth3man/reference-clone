import Image from "next/image";
import type { Player } from "../types";

interface PlayerHeaderProps {
  player: Player;
}

export const PlayerHeader = ({ player }: PlayerHeaderProps) => {
  return (
    <div className="bg-white shadow">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
            {player.headshot_url ? (
              <Image
                src={player.headshot_url}
                alt={player.full_name || "Player Name"}
                width={128}
                height={128}
                className="object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-500">
                {(player.full_name || "").charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{player.full_name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-gray-600">
              {player.position && <span>Position: {player.position}</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              {player.height_inches && (
                <span>
                  Height: {Math.floor(player.height_inches / 12)}&apos;{player.height_inches % 12}
                  &quot;
                </span>
              )}
              {player.weight_lbs && <span>Weight: {player.weight_lbs}lbs</span>}
              {player.birth_date && (
                <span>Born: {new Date(player.birth_date).toLocaleDateString()}</span>
              )}
              {player.college && <span>College: {player.college}</span>}
              {player.birth_country && <span>Country: {player.birth_country}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
