import time

from nba_api.stats.endpoints import (
    commonplayerinfo,
    commonteamroster,
    drafthistory,
    leaguestandings,
    playerawards,
    teamdetails,
)


def check_endpoint(name, endpoint_class, **kwargs):
    print(f"\n--- Checking {name} ---")
    try:
        endpoint = endpoint_class(**kwargs)
        # Try different methods to get data frames
        dfs = endpoint.get_data_frames()
        if dfs:
            for i, df in enumerate(dfs):
                print(f"DataFrame {i} columns: {list(df.columns)}")
                if not df.empty:
                    print(f"Sample data:\n{df.head(2)}")
                else:
                    print("DataFrame is empty.")
        else:
            print("No DataFrames returned.")
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(1)  # Be nice to the API


def explore():
    # 1. Draft History
    check_endpoint(
        "DraftHistory", drafthistory.DraftHistory, league_id="00", season_year_nullable="2023"
    )

    # 2. Awards
    # Needs a player_id. Let's use LeBron James (2544)
    check_endpoint("PlayerAwards", playerawards.PlayerAwards, player_id="2544")

    # 3. Coaches
    # commonteamroster might have coaches. Use Celtics (1610612738)
    check_endpoint(
        "CommonTeamRoster",
        commonteamroster.CommonTeamRoster,
        team_id="1610612738",
        season="2023-24",
    )

    # 4. Standings (for Playoffs?)
    check_endpoint("LeagueStandings", leaguestandings.LeagueStandings, season="2023-24")

    # 5. Team Details (might have awards or history)
    check_endpoint("TeamDetails", teamdetails.TeamDetails, team_id="1610612738")

    # 6. Contracts?
    # CommonPlayerInfo might have something?
    check_endpoint("CommonPlayerInfo", commonplayerinfo.CommonPlayerInfo, player_id="2544")


if __name__ == "__main__":
    explore()
