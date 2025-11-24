import React from "react";
import Link from "next/link";
import { Card, Badge } from "@/components/atoms";

export interface TeamCardProps {
  /**
   * Team data
   */
  team: {
    team_id: string;
    nickname: string;
    abbreviation: string;
    city: string;
    full_name?: string;
  };
  /**
   * Show detailed view
   */
  detailed?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * TeamCard molecule component - Displays team information in a card
 *
 * @example
 * ```tsx
 * <TeamCard
 *   team={{
 *     team_id: "1610612738",
 *     nickname: "Celtics",
 *     abbreviation: "BOS",
 *     city: "Boston"
 *   }}
 * />
 * ```
 */
export const TeamCard: React.FC<TeamCardProps> = ({ team, detailed = false, className = "" }) => {
  return (
    <Link href={`/teams/${team.team_id}`} className={`block h-full ${className}`}>
      <Card
        variant="bordered"
        padding="lg"
        hover
        rounded="xl"
        className="h-full transition-all duration-300 group"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
              {team.city} {team.nickname}
            </h3>
            {detailed && team.full_name && (
              <p className="text-sm text-slate-500 mt-1 truncate">{team.full_name}</p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Badge variant="default" size="sm" className="group-hover:bg-white transition-colors">
              {team.abbreviation}
            </Badge>
            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-100 transition-all">
              {team.abbreviation.substring(0, 2)}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

TeamCard.displayName = "TeamCard";
