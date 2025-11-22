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
export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  detailed = false,
  className = "",
}) => {
  return (
    <Link href={`/teams/${team.team_id}`} className={`group block ${className}`}>
      <Card variant="bordered" padding="md" hover rounded="xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-heading-4 text-text-primary group-hover:text-brand-primary transition-colors">
              {team.city} {team.nickname}
            </h3>
            {detailed && team.full_name && (
              <p className="text-body-sm text-text-tertiary mt-1">{team.full_name}</p>
            )}
          </div>

          <div className="flex items-center gap-3 ml-4">
            <Badge variant="default" size="sm">
              {team.abbreviation}
            </Badge>
            <div className="h-12 w-12 bg-surface-elevated rounded-full flex items-center justify-center text-text-tertiary font-bold text-lg group-hover:bg-brand-light group-hover:text-brand-primary transition-colors">
              {team.abbreviation.substring(0, 2)}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

TeamCard.displayName = "TeamCard";
