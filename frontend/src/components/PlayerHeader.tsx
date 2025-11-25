import Image from "next/image";
import type { Player } from "../types";

interface PlayerHeaderProps {
  player: Player;
}

export const PlayerHeader = ({ player }: PlayerHeaderProps) => {
  const formatHeight = (inches?: number) => {
    if (!inches) return "-";
    return `${Math.floor(inches / 12)}'${inches % 12}"`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Player Image */}
          <div className="shrink-0">
            <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
              {player.headshot_url ? (
                <Image
                  src={player.headshot_url}
                  alt={player.full_name || "Player"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 192px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                  {(player.full_name || "?").charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Player Info */}
          <div className="grow font-sans">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-serif tracking-tight">
              {player.full_name}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm text-gray-700 mt-4">
              <div className="space-y-1">
                <p>
                  <strong className="font-semibold text-gray-900">Position:</strong> {player.position}
                  <span className="mx-2 text-gray-300">▪</span>
                  <strong className="font-semibold text-gray-900">Shoots:</strong> {player.shoots}
                </p>
                <p>
                  <strong className="font-semibold text-gray-900">Height:</strong> {formatHeight(player.height_inches)}
                  <span className="mx-2 text-gray-300">▪</span>
                  <strong className="font-semibold text-gray-900">Weight:</strong> {player.weight_lbs}lb
                </p>
                <p>
                  <strong className="font-semibold text-gray-900">Born:</strong> {formatDate(player.birth_date)}
                  {player.birth_city && (
                    <> in <span className="underline decoration-dotted">{player.birth_city}</span>, {player.birth_country}</>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                {player.draft_year ? (
                  <p>
                    <strong className="font-semibold text-gray-900">Draft:</strong> {player.draft_team_id}, {player.draft_round}th round ({player.draft_pick}th pick), {player.draft_year}
                  </p>
                ) : (
                  <p><strong className="font-semibold text-gray-900">Draft:</strong> Undrafted</p>
                )}
                <p>
                  <strong className="font-semibold text-gray-900">NBA Debut:</strong> {formatDate(player.nba_debut)}
                </p>
                <p>
                  <strong className="font-semibold text-gray-900">Experience:</strong> {player.experience_years} years
                </p>
              </div>
            </div>

            {/* Socials & Nicknames */}
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              {player.twitter && (
                <a 
                  href={player.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  Twitter
                </a>
              )}
              {player.instagram && (
                <a 
                  href={player.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  Instagram
                </a>
              )}
              {player.nicknames && (
                <div className="text-sm text-gray-500 italic">
                  (Nicknames: {player.nicknames})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
