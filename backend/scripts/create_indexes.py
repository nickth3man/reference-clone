"""Script to create database indexes for performance optimization.

This script creates indexes on frequently queried columns to improve query performance.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import get_db_connection
from app.core.logging import configure_logging, get_logger

configure_logging("INFO")
logger = get_logger(__name__)


def create_indexes() -> None:
    """Create database indexes for optimal query performance.

    Indexes are created based on analysis of common query patterns:
    - team_details: team_id (primary lookups)
    - common_player_info: person_id, team_id (player lookups, team rosters)
    - player: id (player lookups)
    - player_stats_per_game: player_id, seas_id (player stats queries)
    - game: game_id, team_id_home, team_id_away, game_date (game queries)
    - other_stats: game_id (game stats lookups)
    """
    conn = get_db_connection(read_only=False)

    try:
        logger.info("Creating database indexes...")

        # Team indexes
        logger.info("Creating team_details indexes...")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_team_details_team_id ON team_details(team_id)")

        # Player indexes
        logger.info("Creating player indexes...")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_player_id ON player(id)")

        logger.info("Creating common_player_info indexes...")
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_common_player_person_id ON common_player_info(person_id)",
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_common_player_team_id ON common_player_info(team_id)",
        )

        # Player stats indexes
        logger.info("Creating player_stats_per_game indexes...")
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON player_stats_per_game(player_id)",
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_player_stats_seas_id ON player_stats_per_game(seas_id)",
        )

        # Game indexes
        logger.info("Creating game indexes...")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_game_game_id ON game(game_id)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_game_team_home ON game(team_id_home)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_game_team_away ON game(team_id_away)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_game_date ON game(game_date)")

        # Game stats indexes
        logger.info("Creating other_stats indexes...")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_other_stats_game_id ON other_stats(game_id)")

        logger.info("✅ All indexes created successfully!")

    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    create_indexes()
